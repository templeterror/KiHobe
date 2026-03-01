from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, Query, status
from app.models.predictions import PredictionCreate, PredictionOut, VoteRequest, VoteStatPoint
from app.dependencies import get_current_user, get_current_user_id
from app.services.coins import deduct_coins, get_coin_cost
from app.db import get_db

router = APIRouter(prefix="/predictions", tags=["predictions"])


@router.get("", response_model=list[PredictionOut])
def list_predictions(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    category: str | None = None,
):
    db = get_db()
    query = db.table("predictions").select("*").eq("status", "active").order("created_at", desc=True)
    if category:
        query = query.eq("category", category)
    offset = (page - 1) * page_size
    result = query.range(offset, offset + page_size - 1).execute()
    return result.data


@router.get("/{prediction_id}", response_model=PredictionOut)
def get_prediction(prediction_id: str):
    db = get_db()
    result = db.table("predictions").select("*").eq("id", prediction_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Prediction not found")
    pred = result.data
    if pred["status"] not in ("active", "closed", "resolved"):
        raise HTTPException(status_code=404, detail="Prediction not found")
    return pred


@router.post("", status_code=201)
def propose_prediction(body: PredictionCreate, user: dict = Depends(get_current_user)):
    db = get_db()
    data = body.model_dump(exclude_none=True)
    if body.prediction_type == "multi_choice":
        if not body.choices or len(body.choices) < 2:
            raise HTTPException(status_code=400, detail="Multi-choice needs at least 2 choices")
        data["choice_counts"] = {c["key"]: 0 for c in body.choices}
    result = db.table("predictions").insert({
        **data,
        "status": "pending_approval",
        "created_by": user["id"],
    }).execute()
    return result.data[0]


@router.post("/{prediction_id}/vote", status_code=200)
def vote(prediction_id: str, body: VoteRequest, user: dict = Depends(get_current_user)):
    db = get_db()

    # Check prediction is active + get type
    pred = db.table("predictions").select("status, prediction_type, choices").eq("id", prediction_id).single().execute()
    if not pred.data or pred.data["status"] != "active":
        raise HTTPException(status_code=400, detail="Prediction is not open for voting")

    prediction_type = pred.data.get("prediction_type", "binary")

    # Validate payload matches prediction type
    if prediction_type == "binary":
        if body.vote is None:
            raise HTTPException(status_code=400, detail="Binary predictions require 'vote' (true/false)")
    elif prediction_type == "multi_choice":
        if not body.choice_key:
            raise HTTPException(status_code=400, detail="Multi-choice predictions require 'choice_key'")
        valid_keys = [c["key"] for c in (pred.data.get("choices") or [])]
        if body.choice_key not in valid_keys:
            raise HTTPException(status_code=400, detail=f"Invalid choice_key. Valid: {valid_keys}")

    # Check if already voted
    existing = (
        db.table("votes")
        .select("id")
        .eq("user_id", user["id"])
        .eq("prediction_id", prediction_id)
        .execute()
    )
    if existing.data:
        raise HTTPException(status_code=409, detail="You have already voted on this prediction")

    # Deduct coins
    cost = get_coin_cost()
    deduct_result = deduct_coins(user["id"], cost, "vote_spend")
    if "error" in deduct_result:
        raise HTTPException(status_code=402, detail=deduct_result["error"])

    # Atomic vote via appropriate RPC
    if prediction_type == "binary":
        db.rpc("cast_vote", {
            "p_user_id": user["id"],
            "p_prediction_id": prediction_id,
            "p_vote": body.vote,
        }).execute()
    else:
        db.rpc("cast_vote_choice", {
            "p_user_id": user["id"],
            "p_prediction_id": prediction_id,
            "p_choice_key": body.choice_key,
        }).execute()

    return {"success": True, "new_balance": deduct_result["new_balance"]}


@router.get("/{prediction_id}/chart", response_model=list[VoteStatPoint])
def get_chart_data(prediction_id: str):
    db = get_db()
    result = (
        db.table("vote_stats")
        .select("recorded_at, yes_count, no_count, choice_counts")
        .eq("prediction_id", prediction_id)
        .order("recorded_at")
        .execute()
    )
    return result.data
