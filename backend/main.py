import shutil
from datetime import datetime, timedelta
from fastapi import Depends,Response
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException, status
from fastapi import UploadFile, File
from pydantic import BaseModel
import jwwtlib
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
        "username":"saketh",
        "password":"Safe@1234"
     }

@app.get("/")
def read_root():
    return FileResponse(os.path.join(BUILD_DIR, "index.html"))

@app.post("/api/login")
async def login(data: LoginRequest,response: Response):
    if data.username != passwords['username']:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    if data.password != passwords['password']:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    token = jwwtlib.create_token(passwords, expiration_time=timedelta(hours=2))
    print(token)
    response.set_cookie(
        key="access_token",       # cookie name
        value=token,              # JWT token
        httponly=True,            # cannot be accessed via JS
        secure=False,             # True if HTTPS
        samesite="lax",           # protect against CSRF
        max_age=2*60*60           # 2 hours in seconds
    )
    return {"message": "valid credentials",
            "token":token}

@app.post("/api/upload")
async def upload(file: UploadFile = File(...),payload: dict = Depends(jwwtlib.verify_token)):
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
def get_files(payload: dict = Depends(jwwtlib.verify_token)):
    files = []

    for f in FILE_DIR.iterdir():
        if f.is_file():
            files.append({
                "name": f.name,
                "size": f.stat().st_size,
            })

    return files

@app.get("/api/files/{filename}")
def download_file(filename: str,payload: dict = Depends(jwwtlib.verify_token)):
    safe_path = (FILE_DIR / filename).resolve()
    if not str(safe_path).startswith(str(FILE_DIR)) or not safe_path.is_file():
        raise HTTPException(status_code=404, detail="File not found")
    response = FileResponse(
        safe_path,
        media_type="application/octet-stream",
        filename=filename
    )
    response.headers["Cache-Control"] = "no-store"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response

@app.get("/api/files/delete/{filename}")
def delete_file(filename: str,payload: dict = Depends(jwwtlib.verify_token)):
    for f in FILE_DIR.iterdir():
        if f.is_file() and f.name == filename:
            f.unlink()
            return {"message":'file deleted successfully'}
       
    raise HTTPException(status_code=404, detail="File not found")

@app.get("/api/logout")
def handle_logout(response: Response):
    response.delete_cookie(key="access_token")
    return {"message": "Logged out successfully"}

@app.get("/{path:path}")
def spa(path: str):
    return FileResponse(os.path.join(BUILD_DIR, "index.html"))