from atlaskernel.services.normalize import normalize
from atlaskernel.services.similarity import similarity
from atlaskernel.services.decision_rules import decide
from atlaskernel.adapters.assets_loader import load_assets
from atlaskernel.domain.candidate import Candidate
from atlaskernel.domain.result import AnalysisResult
from atlaskernel.version import VERSION
from typing import List, Dict


def analyze_brand(request):
    norm = normalize(request.raw_value)
    assets = load_assets(request.known_assets_ref or "brands_v1")

    candidates: List[Candidate] = []
    for a in assets:
        score = similarity(norm, normalize(a))
        candidates.append(Candidate(value=a, score=score))

    # ★ 本番・CI向けガード
    if not candidates:
        raise RuntimeError(
            "No brand assets loaded. "
            "Check that atlaskernel/assets/*.txt is packaged correctly."
        )

    candidates.sort(key=lambda c: c.score, reverse=True)
    top = candidates[0]

    # ★ Pylance / 型チェッカー対策：明示的に初期化
    decision: str
    explanation: List[Dict[str, str]]

    decision, explanation = decide(top.score)
    explanation.insert(0, {"rule": "similarity", "detail": f"top={top.score}"})

    return AnalysisResult(
        entity_type=request.entity_type,
        raw_value=request.raw_value,
        canonical_value=top.value,
        confidence=top.score,
        decision=decision,
        explanation=explanation,
        candidates=candidates[:5],
        version=VERSION
    )