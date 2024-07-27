from fastapi import APIRouter, Request
from diffusers import StableDiffusionPipeline
import os
import base64
from io import BytesIO
from .llama_api import llama_extract_prompt
from bson import ObjectId
from fastapi import APIRouter, Request
from langchain_community.llms import Ollama
from fastapi.responses import JSONResponse
from pymongo import MongoClient
import os
from dotenv import load_dotenv
import jwt
import torch
from diffusers import AnimateDiffPipeline, MotionAdapter, EulerDiscreteScheduler
from huggingface_hub import hf_hub_download
from safetensors.torch import load_file

load_dotenv()
client = MongoClient(os.getenv('DATABASE_URI'))
db = client['storyarcade']
user_collection = db['users']

router = APIRouter()


def generate_image(prompt: str):
    script_directory = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(script_directory, "sd_model.ckpt")

    pipeline = StableDiffusionPipeline.from_single_file(
        model_path, local_files_only=True)
    pipeline.to("cuda")

    image = pipeline(prompt, num_inference_steps=50,
                     height=720, width=1024).images[0]
    return image


def generate_gif(prompt: str):
    device = "cuda"

    dtype = torch.float16

    step = 4
    repo = "ByteDance/AnimateDiff-Lightning"
    ckpt = f"animatediff_lightning_{step}step_diffusers.safetensors"
    base = "emilianJR/epiCRealism"

    adapter = MotionAdapter().to(device, dtype)
    adapter.load_state_dict(
        load_file(hf_hub_download(repo, ckpt), device=device))
    pipe = AnimateDiffPipeline.from_pretrained(
        base, motion_adapter=adapter, torch_dtype=dtype).to(device)
    pipe.scheduler = EulerDiscreteScheduler.from_config(
        pipe.scheduler.config, timestep_spacing="trailing", beta_schedule="linear")

    output = pipe(prompt, guidance_scale=1.0,
                  num_inference_steps=step)

    return output[0]


def get_base64_image(image):
    buffered = BytesIO()
    image.save(buffered, format="png")
    image_bytes = buffered.getvalue()
    encoded_image = base64.b64encode(image_bytes).decode('utf-8')
    return encoded_image


def get_base64_gif(image):
    buffered = BytesIO()
    image[0].save(
        buffered,
        format="png",
        save_all=True,
        append_images=image[1:],
        optimize=False,
        duration=1000 // 10,
        loop=0
    )
    image_bytes = buffered.getvalue()
    encoded_image = base64.b64encode(image_bytes).decode('utf-8')
    return encoded_image


def save_image(image):
    script_directory = os.path.dirname(os.path.abspath(__file__))
    image_path = os.path.join(script_directory, "image.png")
    image.save(image_path)


@router.post("/stable_diffusion")
async def stable_diffusion(request: Request):
    body = await request.json()
    prompt = body['prompt']

    image = generate_image(prompt)
    encoded_image = get_base64_image(image)

    save_image(image)

    return {"image_base64": encoded_image}


@router.post("/stable_diffusion_story")
async def stable_diffusion_story(request: Request):
    body = await request.json()
    story = body['story']
    prompt = llama_extract_prompt(story)

    image = generate_image(prompt)
    encoded_image = get_base64_image(image)

    save_image(image)

    return {"image_base64": encoded_image}


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


@router.post("/sdGetImage")
async def sdGetImage(request: Request):
    body = await request.json()
    story = body['story']
    specificPrompt = body['specificPrompt']
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
        if not specificPrompt:
            prompt = llama_extract_prompt(story)
        else:
            prompt = story

        image = generate_image(prompt)
        encoded_image = get_base64_image(image)

        return JSONResponse(content={"image": encoded_image}, status_code=200)
    else:
        return JSONResponse(content={"message": "Invalid token"}, status_code=400)


@router.post("/imageGenForPage")
async def imageGenForPage(request: Request):
    body = await request.json()
    prompt = body['prompt']
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
        if not prompt:
            return JSONResponse(content={"message": "Prompt Required"}, status_code=400)

        image = generate_image(prompt)
        encoded_image = get_base64_image(image)

        return JSONResponse(content={"image": encoded_image}, status_code=200)
    else:
        return JSONResponse(content={"message": "Invalid token"}, status_code=400)


@router.post("/gifGenForPage")
async def gifGenForPage(request: Request):
    body = await request.json()
    prompt = body['prompt']
    jwt_token = request.headers.get('Authorization')
    user_jwt = validate_jwt(jwt_token)
    if user_jwt:
        user = get_user(user_jwt['_id'])
        if not user:
            return JSONResponse(content={"message": "User not found"}, status_code=404)
        if user["points_left"] < 2:
            return JSONResponse(content={"message": "Not enough points"}, status_code=400)
        user_collection.update_one({"_id": user["_id"]}, {
            "$inc": {"points_left": -2}})
        if not prompt:
            return JSONResponse(content={"message": "Prompt Required"}, status_code=400)

        image = generate_gif(prompt)
        encoded_image = get_base64_gif(image[0])

        return JSONResponse(content={"image": encoded_image}, status_code=200)
    else:
        return JSONResponse(content={"message": "Invalid token"}, status_code=400)
