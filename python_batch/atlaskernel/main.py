from atlaskernel.adapters.mysql_reader import read_requests_from_db
from atlaskernel.adapters.mysql_writer import write_results_to_db
from atlaskernel.application.analyze_entity import analyze


def main():
    pairs = (
        (item_id, analyze(req))
        for item_id, req in read_requests_from_db(limit=20, offset=0)
    )

    write_results_to_db(pairs)
    print("[OK] AtlasKernel DB pipeline executed")


if __name__ == "__main__":
    main()