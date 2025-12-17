import sys
from atlaskernel.adapters.input_reader import read_requests
from atlaskernel.adapters.output_writer import write_result
from atlaskernel.application.analyze_entity import analyze

def main():
    for req in read_requests(sys.stdin):
        result = analyze(req)
        write_result(result, sys.stdout)
