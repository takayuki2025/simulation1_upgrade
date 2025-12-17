from pydantic import BaseModel
from typing import List, Dict
from .candidate import Candidate

class AnalysisResult(BaseModel):
    entity_type: str
    raw_value: str
    canonical_value: str
    confidence: float
    decision: str
    explanation: List[Dict[str, str]]
    candidates: List[Candidate]
    version: str