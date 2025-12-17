from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

app = FastAPI()

app = FastAPI()

BUILD_DIR = os.path.abspath(os.path.join("..", "frontend", "dist"))
ASSETS_DIR = os.path.join(BUILD_DIR, "assets")

app.mount("/assets", StaticFiles(directory=ASSETS_DIR), name="assets")

@app.get("/")
def read_root():
    return FileResponse(os.path.join(BUILD_DIR, "index.html"))

@app.get("/{path:path}")
def spa(path: str):
    return FileResponse(os.path.join(BUILD_DIR, "index.html"))