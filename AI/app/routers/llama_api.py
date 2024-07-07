from bson import ObjectId
from fastapi import APIRouter, Request
from langchain_community.llms import Ollama
from fastapi.responses import JSONResponse
from sse_starlette.sse import EventSourceResponse
import datetime
from pymongo import MongoClient
import os
from dotenv import load_dotenv
import jwt

llm = Ollama(model="llama3")
router = APIRouter()
load_dotenv()
client = MongoClient(os.getenv('DATABASE_URI'))
db = client['storyarcade']
user_collection = db['users']


async def generate_chunks(prompt: str):
    for chunk in llm.stream(prompt):
        yield {
            "id": str(datetime.datetime.now()),
            "data": chunk
        }


@router.post("/llama")
async def llama(request: Request):
    global base_prompt
    body = await request.json()

    base_prompt = "You are a helpful and knowledgeable assistant who helps people write or edit stories. You only provide exact answers and do not greet or socialize. Answer the following prompt appropriately:\n\n"
    prompt = f"{base_prompt}{body['prompt']}"

    return EventSourceResponse(generate_chunks(prompt))


def llama_extract_prompt(story: str):

    initial_prompt = f"You are a helpful and knowledgeable assistant who helps people write and edit stories. You only provide the exact answer and do not greet or socialize. You will be given a story, you have to generate a prompt for cover image generation. You will analyse the story and generate appropriate prompts so that the prompt can be used in image generation AI to generate a cover image for the story book. The prompt has to be exact. Here is the story:\n\n"
    prompt = f"{initial_prompt}{story}"

    generated_prompt = llm(prompt)
    return generated_prompt


def validate_jwt(jwt_token):
    try:
        jwt_valid = jwt.decode(jwt_token.split()[1], os.getenv(
            'JWT_SECRET'), algorithms=["HS256"])
        return jwt_valid
    except:
        return False


def get_user(user_id):
    user_id = ObjectId(user_id)
    user = user_collection.find_one({"_id": user_id})
    return user


@router.post("/llamaGetTitle")
async def llamaGetTitlelama(request: Request):
    body = await request.json()
    story = body['story']
    jwt_token = request.headers.get('Authorization')
    user_jwt = validate_jwt(jwt_token)
    if user_jwt:
        user = get_user(user_jwt['_id'])
        if not user:
            return JSONResponse(content={"message": "User not found"}, status_code=404)
        if user["points_left"] < 1:
            return JSONResponse(content={"message": "Not enough points"}, status_code=400)
        user_collection.update_one({"_id": user["_id"]}, {
                                   "$inc": {"points_left": -1}})
        initial_prompt = f"You are a helpful and knowledgeable assistant who helps people write and edit stories. You only provide the exact answer and do not greet or socialize. You will be given a story, you have to generate a title for the story. You will analyse the story and generate appropriate title. Do not add qoute around your output. Here is the story:\n\n"
        prompt = f"{initial_prompt}{story}"

        generated_prompt = llm(prompt)
        return JSONResponse(content={"title": generated_prompt}, status_code=200)
    else:
        return JSONResponse(content={"message": "Invalid token"}, status_code=400)
