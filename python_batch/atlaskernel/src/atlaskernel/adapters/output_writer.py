import json

def write_result(result, fp):
    fp.write(json.dumps(result.model_dump(), ensure_ascii=False) + "\n")