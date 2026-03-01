from fastapi import APIRouter, Depends
from app.models.users import UserOut, UserUpdate, PushSubscription
from app.dependencies import get_current_user
from app.db import get_db

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserOut)
def get_me(user: dict = Depends(get_current_user)):
    return user


@router.patch("/me", response_model=UserOut)
def update_me(body: UserUpdate, user: dict = Depends(get_current_user)):
    db = get_db()
    updates = body.model_dump(exclude_none=True)
    if not updates:
        return user
    result = db.table("users").update(updates).eq("id", user["id"]).execute()
    return result.data[0]


@router.get("/me/votes")
def get_my_votes(user: dict = Depends(get_current_user)):
    db = get_db()
    result = (
        db.table("votes")
        .select("*, predictions(id, title, status, outcome)")
        .eq("user_id", user["id"])
        .order("created_at", desc=True)
        .execute()
    )
    return result.data


@router.get("/me/coins")
def get_my_coins(user: dict = Depends(get_current_user)):
    db = get_db()
    txns = (
        db.table("coin_transactions")
        .select("*")
        .eq("user_id", user["id"])
        .order("created_at", desc=True)
        .limit(50)
        .execute()
    )
    return {"balance": user["coin_balance"], "transactions": txns.data}


@router.post("/me/push-subscription", status_code=200)
def register_push(body: PushSubscription, user: dict = Depends(get_current_user)):
    db = get_db()
    db.table("users").update({"push_subscription": body.subscription}).eq("id", user["id"]).execute()
    return {"success": True}
