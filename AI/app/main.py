from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware

from .routers import llama_api, stable_diffusion_api

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(llama_api.router)
app.include_router(stable_diffusion_api.router)
