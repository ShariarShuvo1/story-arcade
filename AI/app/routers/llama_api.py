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
ai_chat_collection = db['aichats']
page_collection = db['pages']


async def generate_chunks(prompt: str):
    for chunk in llm.stream(prompt):
        yield {
            "id": str(datetime.datetime.now()),
            "data": chunk
        }


@router.post("/llama")
async def llama(request: Request):
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


@router.post("/llamaChat")
async def llamaChat(request: Request):
    body = await request.json()

    message = body['message']
    story_id = body['storyId']

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

        story = ai_chat_collection.find_one({"story": ObjectId(story_id)})

        if not story:
            return JSONResponse(content={"message": "Story not found"}, status_code=404)
        previous_chats = story["chats"]
        prompt = (f"You are a helpful and knowledgeable assistant who helps people write and edit stories. "
                  f"You only provide the exact answer and do not greet or socialize. You will be given a chat message question. "
                  f"You have to generate a response to the chat message. Here is our Previous chat history: {previous_chats}. "
                  f"Here is the question:\n\n{message}")

        story["chats"].append(
            {"sender": "user", "text": message, "created_at": datetime.datetime.now()})

        generated_response = llm(prompt)

        story["chats"].append(
            {"sender": "ai", "text": generated_response, "created_at": datetime.datetime.now()})
        ai_chat_collection.update_one(
            {"story": ObjectId(story_id)}, {"$set": story})

        return JSONResponse(content={"answer": generated_response}, status_code=200)
    else:
        return JSONResponse(content={"message": "Invalid token"}, status_code=400)


@router.post("/llamaStoryChat")
async def llamaStoryChat(request: Request):
    body = await request.json()
    message = body['message']
    story_id = body['storyId']
    page_number = body['pageNumber']

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

        story = ai_chat_collection.find_one({"story": ObjectId(story_id)})
        if not story:
            return JSONResponse(content={"message": "Story not found"}, status_code=404)

        pages = list(page_collection.find(
            {"story": ObjectId(story_id)},
            {
                "_id": 1,
                "page_number": 1,
                "is_starting_page": 1,
                "steps": 1,
                "mover": 1,
                "page_story": 1,
                "choices": 1,
                "tasks": 1
            }
        ))

        page_id = None
        for page in pages:
            if page["page_number"] == page_number:
                page_id = page["_id"]
                break

        previous_chats = story["chats"]
        prompt = (f"You are a helpful and knowledgeable assistant who helps people write and edit stories. "
                  f"You only provide the exact answer and do not greet or socialize. You will be given a chat message question. "
                  f"You have to generate a response to the chat message. Here is our Previous chat history: {previous_chats}. "
                  f"This is the story flow: {pages}. "
                  f"Currently, the user is at page_number {page_number}. which _id is {page_id}. "
                  f"In the story flow, each element of the list represent a page in the story. "
                  f"The story will be shown as a rpg game. "
                  f"story_text is the text that will be shown to the user. and other type os step is actions that the user can do in the story to proceed. "
                  f"One step can go to another page or another a task. "
                  f"Do not result any _id rather say which page number"
                  f"You will use this information to generate a response to the chat message, give suggestions or help the user for the current page. "
                  f"If asked in question, analyze the story, its flow and give suggestion for this page. "
                  f"current page could be in the middle of the story or at the end of the story or at the beggining of the story. "
                  f"Only replay in human language. "
                  f"Here is the question:\n\n{message}")

        story["chats"].append(
            {"sender": "user", "text": message, "created_at": datetime.datetime.now()})

        generated_response = llm(prompt)

        story["chats"].append(
            {"sender": "ai", "text": generated_response, "created_at": datetime.datetime.now()})

        ai_chat_collection.update_one(
            {"story": ObjectId(story_id)}, {"$set": story})

        return JSONResponse(content={"answer": generated_response}, status_code=200)
    else:
        return JSONResponse(content={"message": "Invalid token"}, status_code=400)
