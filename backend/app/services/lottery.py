import secrets
from app.db import get_db


def run_lottery(prediction_id: str, outcome: bool) -> dict:
    """
    Select winner(s) from correct voters for the given prediction.
    outcome: True = YES won, False = NO won
    Returns dict with winner info or error.
    """
    db = get_db()

    # Get prediction details
    pred = db.table("predictions").select("*").eq("id", prediction_id).single().execute()
    if not pred.data:
        return {"error": "Prediction not found"}

    winner_count = pred.data.get("winner_count", 1)
    prize_description = pred.data.get("prize_description", "")

    # Get all correct voters
    correct_votes = (
        db.table("votes")
        .select("user_id")
        .eq("prediction_id", prediction_id)
        .eq("vote", outcome)
        .execute()
    )

    if not correct_votes.data:
        return {"error": "No correct voters found", "prediction_id": prediction_id}

    voters = [v["user_id"] for v in correct_votes.data]

    # Cryptographically random selection
    num_winners = min(winner_count, len(voters))
    winners = secrets.SystemRandom().sample(voters, num_winners)

    # Record lottery results
    for winner_id in winners:
        db.table("lottery_results").insert({
            "prediction_id": prediction_id,
            "winner_id": winner_id,
            "prize_description": prize_description,
        }).execute()

    return {
        "success": True,
        "prediction_id": prediction_id,
        "winners": winners,
        "total_correct_voters": len(voters),
    }


def run_lottery_choice(prediction_id: str, outcome_choice: str) -> dict:
    """Select winner(s) from correct voters for a multi-choice prediction."""
    db = get_db()

    pred = db.table("predictions").select("*").eq("id", prediction_id).single().execute()
    if not pred.data:
        return {"error": "Prediction not found"}

    winner_count = pred.data.get("winner_count", 1)
    prize_description = pred.data.get("prize_description", "")

    correct_votes = (
        db.table("votes")
        .select("user_id")
        .eq("prediction_id", prediction_id)
        .eq("choice_key", outcome_choice)
        .execute()
    )

    if not correct_votes.data:
        return {"error": "No correct voters found", "prediction_id": prediction_id}

    voters = [v["user_id"] for v in correct_votes.data]
    num_winners = min(winner_count, len(voters))
    winners = secrets.SystemRandom().sample(voters, num_winners)

    for winner_id in winners:
        db.table("lottery_results").insert({
            "prediction_id": prediction_id,
            "winner_id": winner_id,
            "prize_description": prize_description,
        }).execute()

    return {
        "success": True,
        "prediction_id": prediction_id,
        "winners": winners,
        "total_correct_voters": len(voters),
    }
