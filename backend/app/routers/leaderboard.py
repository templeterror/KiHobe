from fastapi import APIRouter, Depends
from app.dependencies import get_current_user
from app.db import get_db

router = APIRouter(prefix="/leaderboard", tags=["leaderboard"])


def _compute_stats(user_ids: list[str]) -> list[dict]:
    if not user_ids:
        return []
    db = get_db()

    # Get all resolved votes for these users
    votes = (
        db.table("votes")
        .select("user_id, vote, predictions(outcome, status)")
        .in_("user_id", user_ids)
        .execute()
    )

    # Get lottery wins
    wins = (
        db.table("lottery_results")
        .select("winner_id")
        .in_("winner_id", user_ids)
        .execute()
    )
    win_counts = {}
    for w in wins.data:
        win_counts[w["winner_id"]] = win_counts.get(w["winner_id"], 0) + 1

    # Compute per-user stats
    stats: dict[str, dict] = {uid: {"total_bets": 0, "correct": 0} for uid in user_ids}
    for v in votes.data:
        pred = v.get("predictions")
        if not pred or pred["status"] != "resolved" or pred["outcome"] is None:
            continue
        uid = v["user_id"]
        stats[uid]["total_bets"] += 1
        if v["vote"] == pred["outcome"]:
            stats[uid]["correct"] += 1

    # Fetch display names
    users = db.table("users").select("id, display_name, referral_code").in_("id", user_ids).execute()
    user_map = {u["id"]: u for u in users.data}

    result = []
    for uid in user_ids:
        u = user_map.get(uid, {})
        s = stats[uid]
        total = s["total_bets"]
        correct = s["correct"]
        result.append({
            "user_id": uid,
            "display_name": u.get("display_name"),
            "total_bets": total,
            "correct_predictions": correct,
            "win_rate": round(correct / total * 100, 1) if total > 0 else 0,
            "prizes_won": win_counts.get(uid, 0),
        })

    result.sort(key=lambda x: (-x["correct_predictions"], -x["win_rate"]))
    for i, r in enumerate(result):
        r["rank"] = i + 1

    return result


@router.get("/friends")
def friends_leaderboard(user: dict = Depends(get_current_user)):
    db = get_db()
    friendships = (
        db.table("friendships")
        .select("friend_id")
        .eq("user_id", user["id"])
        .execute()
    )
    friend_ids = [f["friend_id"] for f in friendships.data] + [user["id"]]
    return _compute_stats(friend_ids)


@router.get("/global")
def global_leaderboard():
    db = get_db()
    # Get top 100 users by correct predictions (approximate via coin transactions as proxy)
    # For MVP: just return all users and sort in Python
    users = db.table("users").select("id").eq("is_banned", False).limit(200).execute()
    user_ids = [u["id"] for u in users.data]
    stats = _compute_stats(user_ids)
    return stats[:100]
