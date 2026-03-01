from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.services.scheduler import start_scheduler, stop_scheduler
from app.routers import auth, predictions, users, friends, leaderboard, admin


@asynccontextmanager
async def lifespan(app: FastAPI):
    start_scheduler()
    yield
    stop_scheduler()


app = FastAPI(title="KiHobe API", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(predictions.router)
app.include_router(users.router)
app.include_router(friends.router)
app.include_router(leaderboard.router)
app.include_router(admin.router)


@app.get("/health")
def health():
    return {"status": "ok"}
