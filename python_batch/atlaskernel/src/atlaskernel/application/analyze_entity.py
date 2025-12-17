from atlaskernel.application.pipelines.brand_pipeline import analyze_brand
from atlaskernel.application.pipelines.document_term_pipeline import analyze_document_term

def analyze(request):
    if request.entity_type == "brand":
        return analyze_brand(request)
    if request.entity_type == "document_term":
        return analyze_document_term(request)
    raise ValueError(f"Unsupported entity_type: {request.entity_type}")