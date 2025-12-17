import json
from atlaskernel.domain.request import AnalysisRequest

def read_requests(fp):
    for line in fp:
        if line.strip():
            yield AnalysisRequest(**json.loads(line))