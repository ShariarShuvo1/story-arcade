from fastapi import APIRouter, Request
from diffusers import StableDiffusionPipeline
import os
import base64
from io import BytesIO
from .llama_api import llama_extract_prompt

router = APIRouter()


def generate_image(prompt: str):
    script_directory = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(script_directory, "sd_model.ckpt")

    pipeline = StableDiffusionPipeline.from_single_file(
        model_path, local_files_only=True)
    pipeline.to("cuda")

    image = pipeline(prompt, num_inference_steps=50,
                     height=1024, width=1024).images[0]

    return image


def get_base64_image(image):
    buffered = BytesIO()
    image.save(buffered, format="PNG")
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
