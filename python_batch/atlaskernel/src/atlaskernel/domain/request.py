from pydantic import BaseModel
from typing import Dict, Optional

class AnalysisRequest(BaseModel):
    entity_type: str
    raw_value: str
    context: Dict[str, str] = {}
    known_assets_ref: Optional[str] = None