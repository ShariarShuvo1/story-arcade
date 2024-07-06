from fastapi import APIRouter, Request
from langchain_community.llms import Ollama
from sse_starlette.sse import EventSourceResponse
import datetime

llm = Ollama(model="llama3")
router = APIRouter()


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

    initial_prompt = f"You are a helpful and knowledgeable assistant who helps people write and edit stories. You only provide the exact answer and do not greet or socialize. You will be given a story, you have to generate a prompt for background image generation. You will analyse the story and generate appropriate prompts so that the prompt can be used in image generation AI to generate a background image for the story. The prompt has to be exact. Here is the story:\n\n"
    prompt = f"{initial_prompt}{story}"

    generated_prompt = llm(prompt)
    return generated_prompt
