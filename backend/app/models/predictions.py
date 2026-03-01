from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class PredictionCreate(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    resolution_date: Optional[datetime] = None
    resolution_source: Optional[str] = None
    prize_description: Optional[str] = None
    prediction_type: str = "binary"
    choices: Optional[list[dict]] = None  # [{"key": "...", "label": "..."}]


class PredictionOut(BaseModel):
    id: str
    title: str
    description: Optional[str]
    category: Optional[str]
    status: str
    resolution_date: Optional[datetime]
    yes_count: int
    no_count: int
    prize_description: Optional[str]
    outcome: Optional[bool]
    created_at: datetime
    prediction_type: str = "binary"
    choices: Optional[list[dict]] = None
    choice_counts: Optional[dict[str, int]] = None
    outcome_choice: Optional[str] = None


class VoteRequest(BaseModel):
    vote: Optional[bool] = None        # For binary predictions
    choice_key: Optional[str] = None   # For multi-choice predictions


class VoteStatPoint(BaseModel):
    recorded_at: datetime
    yes_count: int
    no_count: int
    choice_counts: Optional[dict[str, int]] = None


class AdminPredictionUpdate(BaseModel):
    status: Optional[str] = None
    outcome: Optional[bool] = None
    outcome_choice: Optional[str] = None
    prize_description: Optional[str] = None
