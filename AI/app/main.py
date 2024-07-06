from fastapi import FastAPI, APIRouter

from .routers import llama_api
from .routers import stable_diffusion_api

app = FastAPI()

app.include_router(llama_api.router)
app.include_router(stable_diffusion_api.router)
