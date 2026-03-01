from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.dependencies import get_current_user
from app.services.coins import grant_coins
from app.db import get_db

router = APIRouter(prefix="/friends", tags=["friends"])


class AddFriendRequest(BaseModel):
    referral_code: str


@router.get("")
def get_friends(user: dict = Depends(get_current_user)):
    db = get_db()
    result = (
        db.table("friendships")
        .select("friend_id, users!friendships_friend_id_fkey(id, display_name, referral_code)")
        .eq("user_id", user["id"])
        .execute()
    )
    return result.data


@router.post("/add", status_code=201)
def add_friend(body: AddFriendRequest, user: dict = Depends(get_current_user)):
    db = get_db()

    # Find friend by referral code
    friend_result = (
        db.table("users")
        .select("id, display_name")
        .eq("referral_code", body.referral_code.upper())
        .execute()
    )
    if not friend_result.data:
        raise HTTPException(status_code=404, detail="User not found with that referral code")

    friend = friend_result.data[0]
    if friend["id"] == user["id"]:
        raise HTTPException(status_code=400, detail="Cannot add yourself as a friend")

    # Check not already friends
    existing = (
        db.table("friendships")
        .select("id")
        .eq("user_id", user["id"])
        .eq("friend_id", friend["id"])
        .execute()
    )
    if existing.data:
        raise HTTPException(status_code=409, detail="Already friends")

    # Add bidirectional friendship
    db.table("friendships").insert([
        {"user_id": user["id"], "friend_id": friend["id"]},
        {"user_id": friend["id"], "friend_id": user["id"]},
    ]).execute()

    return {"success": True, "friend": friend}
