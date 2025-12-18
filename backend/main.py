import shutil
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException, status
from fastapi import UploadFile, File
from pydantic import BaseModel
from pathlib import Path
import os

app = FastAPI()

BUILD_DIR = os.path.abspath(os.path.join("..", "frontend", "dist"))
ASSETS_DIR = os.path.join(BUILD_DIR, "assets")
FILE_DIR = Path("..") / "files"
FILE_DIR = FILE_DIR.resolve()
FILE_DIR.mkdir(exist_ok=True)

app.mount("/assets", StaticFiles(directory=ASSETS_DIR), name="assets")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite dev server
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginRequest(BaseModel):
    username: str
    password: str

passwords={
    "saketh":"Safe@1234",
    "admin":"Safe@12345"
}

@app.get("/")
def read_root():
    return FileResponse(os.path.join(BUILD_DIR, "index.html"))

@app.post("/api/login")
async def login(data: LoginRequest):
    if data.username not in passwords:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    if data.password != passwords[data.username]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    return {"message": "valid credentials"}

@app.post("/api/upload")
async def upload(file: UploadFile = File(...)):
    file_path = os.path.join(FILE_DIR, file.filename)

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception:
        raise HTTPException(status_code=500, detail="File save failed")

    return {
        "filename": file.filename,
        "content_type": file.content_type
    }

@app.get("/api/files")
def get_files():
    files = []

    for f in FILE_DIR.iterdir():
        if f.is_file():
            files.append({
                "name": f.name,
                "size": f.stat().st_size,
            })

    return files

@app.get("/api/files/{filename}")
def download_file(filename: str):
    for f in FILE_DIR.iterdir():
        if f.is_file() and f.name == filename:
            return FileResponse(f.resolve(), media_type="application/octet-stream", filename=filename)
    raise HTTPException(status_code=404, detail="File not found")

@app.get("/api/files/delete/{filename}")
def delete_file(filename: str):
    for f in FILE_DIR.iterdir():
        if f.is_file() and f.name == filename:
            f.unlink()
            return {"message":'file deleted successfully'}
       
    raise HTTPException(status_code=404, detail="File not found")

@app.get("/{path:path}")
def spa(path: str):
    return FileResponse(os.path.join(BUILD_DIR, "index.html"))