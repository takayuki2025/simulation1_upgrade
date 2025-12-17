from pathlib import Path
from atlaskernel.services.policy_engine import PolicyEngine
from atlaskernel.application.pipelines.brand_pipeline import analyze_brand

_policy_engine = PolicyEngine()

def analyze(request):
    if request.entity_type == "brand":
        return analyze_brand(request, _policy_engine)
    else:
        raise ValueError(f"Unsupported entity_type: {request.entity_type}")