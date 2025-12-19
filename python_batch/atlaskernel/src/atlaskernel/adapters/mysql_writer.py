import os
import mysql.connector


def write_results_to_db(results):
    conn = mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        port=int(os.getenv("DB_PORT", 3306)),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASS"),
        database=os.getenv("DB_NAME"),
        autocommit=False,
    )

    cursor = conn.cursor(dictionary=True)

    try:
        # ★ item_id と result を同時に受け取る
        for item_id, result in results:
            # brand-only v1
            if result.entity_type != "brand":
                continue

            brand_entity_id = None

            # accepted のみ永続化
            if result.decision == "accepted" and result.canonical_value:
                normalized_key = result.canonical_value.lower()

                cursor.execute(
                    "SELECT id FROM brand_entities WHERE normalized_key=%s LIMIT 1",
                    (normalized_key,),
                )
                row = cursor.fetchone()

                if row:
                    brand_entity_id = row["id"]
                else:
                    cursor.execute(
                        """
                        INSERT INTO brand_entities
                            (canonical_name, normalized_key, confidence, created_from, created_at, updated_at)
                        VALUES
                            (%s, %s, %s, %s, NOW(), NOW())
                        """,
                        (
                            result.canonical_value,
                            normalized_key,
                            result.confidence,
                            "atlaskernel_v1",
                        ),
                    )
                    brand_entity_id = cursor.lastrowid

            # item_entities は必ず upsert（NULL も許容）
            cursor.execute(
                """
                INSERT INTO item_entities
                    (item_id, brand_entity_id, generated_version, generated_at, created_at, updated_at)
                VALUES
                    (%s, %s, 'v1_brand_only', NOW(), NOW(), NOW())
                ON DUPLICATE KEY UPDATE
                    brand_entity_id=VALUES(brand_entity_id),
                    generated_at=NOW(),
                    updated_at=NOW()
                """,
                (item_id, brand_entity_id),
            )

        conn.commit()

    except Exception:
        conn.rollback()
        raise

    finally:
        cursor.close()
        conn.close()