from fastapi import APIRouter, Depends, HTTPException
from app.models.predictions import PredictionCreate, AdminPredictionUpdate
from app.models.users import AdminUserUpdate
from app.dependencies import require_admin
from app.services.lottery import run_lottery, run_lottery_choice
from app.services.coins import grant_coins
from app.db import get_db

router = APIRouter(prefix="/admin", tags=["admin"])


# ── Predictions ──────────────────────────────────────────────

@router.get("/predictions")
def list_all_predictions(admin: dict = Depends(require_admin)):
    db = get_db()
    result = db.table("predictions").select("*").order("created_at", desc=True).execute()
    return result.data


@router.post("/predictions", status_code=201)
def create_prediction(body: PredictionCreate, admin: dict = Depends(require_admin)):
    db = get_db()
    data = body.model_dump(exclude_none=True)
    if body.prediction_type == "multi_choice":
        if not body.choices or len(body.choices) < 2:
            raise HTTPException(status_code=400, detail="Multi-choice needs at least 2 choices")
        data["choice_counts"] = {c["key"]: 0 for c in body.choices}
    result = db.table("predictions").insert({
        **data,
        "status": "active",
        "created_by": admin["id"],
    }).execute()
    return result.data[0]


@router.patch("/predictions/{prediction_id}")
def update_prediction(prediction_id: str, body: AdminPredictionUpdate, admin: dict = Depends(require_admin)):
    db = get_db()
    updates = body.model_dump(exclude_none=True)
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = db.table("predictions").update(updates).eq("id", prediction_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Prediction not found")
    return result.data[0]


@router.post("/predictions/{prediction_id}/resolve")
def resolve_prediction(
    prediction_id: str,
    outcome: bool | None = None,
    outcome_choice: str | None = None,
    admin: dict = Depends(require_admin),
):
    db = get_db()

    pred = db.table("predictions").select("status, prediction_type, choices").eq("id", prediction_id).single().execute()
    if not pred.data:
        raise HTTPException(status_code=404, detail="Prediction not found")
    if pred.data["status"] not in ("active", "closed"):
        raise HTTPException(status_code=400, detail="Prediction cannot be resolved in its current state")

    prediction_type = pred.data.get("prediction_type", "binary")
    from datetime import datetime, timezone

    if prediction_type == "binary":
        if outcome is None:
            raise HTTPException(status_code=400, detail="Binary predictions require 'outcome' (bool)")
        db.table("predictions").update({
            "status": "resolved",
            "outcome": outcome,
            "resolved_at": datetime.now(timezone.utc).isoformat(),
        }).eq("id", prediction_id).execute()
        lottery_result = run_lottery(prediction_id, outcome)
    else:
        if not outcome_choice:
            raise HTTPException(status_code=400, detail="Multi-choice predictions require 'outcome_choice'")
        valid_keys = [c["key"] for c in (pred.data.get("choices") or [])]
        if outcome_choice not in valid_keys:
            raise HTTPException(status_code=400, detail="Invalid outcome_choice")
        db.table("predictions").update({
            "status": "resolved",
            "outcome_choice": outcome_choice,
            "resolved_at": datetime.now(timezone.utc).isoformat(),
        }).eq("id", prediction_id).execute()
        lottery_result = run_lottery_choice(prediction_id, outcome_choice)

    return {"resolved": True, "lottery": lottery_result}


# ── Users ─────────────────────────────────────────────────────

@router.get("/users")
def list_users(admin: dict = Depends(require_admin)):
    db = get_db()
    result = db.table("users").select("id, phone, display_name, coin_balance, is_admin, is_banned, created_at").order("created_at", desc=True).execute()
    return result.data


@router.patch("/users/{user_id}")
def update_user(user_id: str, body: AdminUserUpdate, admin: dict = Depends(require_admin)):
    db = get_db()
    updates = {}

    if body.coin_adjustment is not None:
        user = db.table("users").select("coin_balance").eq("id", user_id).single().execute()
        if not user.data:
            raise HTTPException(status_code=404, detail="User not found")
        if body.coin_adjustment > 0:
            grant_coins(user_id, body.coin_adjustment, "admin_adjust")
        elif body.coin_adjustment < 0:
            from app.services.coins import deduct_coins
            deduct_coins(user_id, abs(body.coin_adjustment), "admin_adjust")

    if body.is_banned is not None:
        updates["is_banned"] = body.is_banned
    if body.is_admin is not None:
        updates["is_admin"] = body.is_admin

    if updates:
        db.table("users").update(updates).eq("id", user_id).execute()

    result = db.table("users").select("*").eq("id", user_id).single().execute()
    return result.data


# ── Config ────────────────────────────────────────────────────

@router.get("/config")
def get_config(admin: dict = Depends(require_admin)):
    db = get_db()
    result = db.table("app_config").select("*").execute()
    return {row["key"]: row["value"] for row in result.data}


@router.patch("/config/{key}")
def update_config(key: str, value: dict, admin: dict = Depends(require_admin)):
    db = get_db()
    db.table("app_config").upsert({"key": key, "value": value["value"]}).execute()
    return {"key": key, "value": value["value"]}


# ── Lottery ───────────────────────────────────────────────────

@router.get("/lottery")
def list_lottery_results(admin: dict = Depends(require_admin)):
    db = get_db()
    result = (
        db.table("lottery_results")
        .select("*, predictions(title), users!lottery_results_winner_id_fkey(display_name, phone)")
        .order("created_at", desc=True)
        .execute()
    )
    return result.data
