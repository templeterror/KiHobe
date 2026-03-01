from app.db import get_db


def get_coin_cost() -> int:
    db = get_db()
    result = db.table("app_config").select("value").eq("key", "vote_coin_cost").execute()
    if result.data:
        return int(result.data[0]["value"])
    return 1


def get_coin_cap() -> int:
    db = get_db()
    result = db.table("app_config").select("value").eq("key", "coin_balance_cap").execute()
    if result.data:
        return int(result.data[0]["value"])
    return 50


def get_daily_grant() -> int:
    db = get_db()
    result = db.table("app_config").select("value").eq("key", "daily_coin_grant").execute()
    if result.data:
        return int(result.data[0]["value"])
    return 3


def deduct_coins(user_id: str, amount: int, reason: str, reference_id: str | None = None) -> dict:
    """Deduct coins atomically. Returns error dict if insufficient balance."""
    db = get_db()

    user = db.table("users").select("coin_balance").eq("id", user_id).single().execute()
    if not user.data:
        return {"error": "User not found"}

    balance = user.data["coin_balance"]
    if balance < amount:
        return {"error": "Insufficient coins", "balance": balance}

    db.table("users").update({"coin_balance": balance - amount}).eq("id", user_id).execute()

    tx = {"user_id": user_id, "amount": -amount, "reason": reason}
    if reference_id:
        tx["reference_id"] = reference_id
    db.table("coin_transactions").insert(tx).execute()

    return {"success": True, "new_balance": balance - amount}


def grant_coins(user_id: str, amount: int, reason: str, reference_id: str | None = None) -> None:
    """Grant coins up to the cap."""
    db = get_db()
    cap = get_coin_cap()

    user = db.table("users").select("coin_balance").eq("id", user_id).single().execute()
    if not user.data:
        return

    current = user.data["coin_balance"]
    new_balance = min(current + amount, cap)
    actual_grant = new_balance - current

    if actual_grant <= 0:
        return

    db.table("users").update({"coin_balance": new_balance}).eq("id", user_id).execute()

    tx = {"user_id": user_id, "amount": actual_grant, "reason": reason}
    if reference_id:
        tx["reference_id"] = reference_id
    db.table("coin_transactions").insert(tx).execute()


def run_daily_grants() -> int:
    """Grant daily coins to all non-banned users. Returns count of users granted."""
    db = get_db()
    amount = get_daily_grant()

    users = db.table("users").select("id").eq("is_banned", False).execute()
    for user in users.data:
        grant_coins(user["id"], amount, "daily_grant")

    return len(users.data)
