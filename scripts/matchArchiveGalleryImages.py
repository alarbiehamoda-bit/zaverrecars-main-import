from __future__ import annotations

import concurrent.futures
import hashlib
import io
import json
from pathlib import Path
from urllib.parse import urlparse

import numpy as np
import requests
import cv2
from PIL import Image, ImageOps

PROJECT = Path("/home/ubuntu/zafir-restore-v2")
ARCHIVE = Path("/home/ubuntu/archive-gallery-source/catalog-source.json")
REPORT = PROJECT / "archive-gallery-mapping-report.json"
OUTPUT = PROJECT / "archive-gallery-visual-matches.json"
CACHE = Path("/home/ubuntu/archive-gallery-cache")
PRIMARY_ORIGIN = "https://luxcarrent-fy6ozqfy.manus.space"
TIMEOUT = 20


def cache_path(url: str) -> Path:
    tail = Path(urlparse(url).path).name or "asset"
    digest = hashlib.sha256(url.encode("utf-8")).hexdigest()[:16]
    return CACHE / f"{digest}_{tail}"


def fetch_image(url: str) -> Image.Image | None:
    target = cache_path(url)
    previous = next(CACHE.glob(f"*_{target.name.split('_', 1)[1]}"), target)
    try:
        if previous.exists():
            return Image.open(previous).convert("RGB")
        response = requests.get(url, timeout=TIMEOUT, headers={"User-Agent": "Mozilla/5.0"})
        response.raise_for_status()
        target.write_bytes(response.content)
        return Image.open(io.BytesIO(response.content)).convert("RGB")
    except Exception:
        return None


def dhash(image: Image.Image) -> np.ndarray:
    gray = image.convert("L").resize((17, 16), Image.Resampling.LANCZOS)
    pixels = np.asarray(gray, dtype=np.int16)
    return pixels[:, 1:] > pixels[:, :-1]


def distance(left: np.ndarray, right: np.ndarray) -> int:
    return int(np.count_nonzero(left != right))


def resolve_primary(image: str) -> str:
    return f"{PRIMARY_ORIGIN}{image}" if image.startswith("/manus-storage/") else image


def pricing_photo_hash(image: Image.Image) -> np.ndarray:
    """Ignore the lower title/price strip present on the catalog image."""
    photo_height = max(1, round(image.height * 0.835))
    return dhash(image.crop((0, 0, image.width, photo_height)))


def feature_match_count(primary: Image.Image, candidate: Image.Image) -> int:
    """Compare stable visual features, ignoring the lower price/title strip."""
    photo_height = max(1, round(primary.height * 0.835))
    reference = np.asarray(primary.crop((0, 0, primary.width, photo_height)).convert("L"))
    source = np.asarray(candidate.convert("L"))
    if max(source.shape) > 1600:
        scale = 1600 / max(source.shape)
        source = cv2.resize(source, (round(source.shape[1] * scale), round(source.shape[0] * scale)), interpolation=cv2.INTER_AREA)
    orb = cv2.ORB_create(nfeatures=900, fastThreshold=7)
    _, descriptors_a = orb.detectAndCompute(reference, None)
    _, descriptors_b = orb.detectAndCompute(source, None)
    if descriptors_a is None or descriptors_b is None:
        return 0
    pairs = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=False).knnMatch(descriptors_a, descriptors_b, k=2)
    return sum(1 for pair in pairs if len(pair) == 2 and pair[0].distance < 0.72 * pair[1].distance)


def process(record: dict, archive_by_id: dict) -> dict:
    primary_url = resolve_primary(record["image"])
    primary = fetch_image(primary_url)
    if primary is None:
        return {"id": record["id"], "name": record["name"], "status": "primary-unavailable", "primary": record["image"]}

    candidate = next((item for item in record.get("candidates", []) if item["score"] >= 30), None)
    if candidate is None:
        return {"id": record["id"], "name": record["name"], "status": "no-name-candidate", "primary": record["image"]}

    archive_record = archive_by_id.get(candidate["id"])
    if not archive_record:
        return {"id": record["id"], "name": record["name"], "status": "candidate-not-found", "primary": record["image"]}

    photo_height = max(1, round(primary.height * 0.835))
    photo_size = (primary.width, photo_height)
    primary_hash = pricing_photo_hash(primary)
    best_index = -1
    best_distance = 10_000
    best_feature_matches = 0
    for index, url in enumerate(archive_record["images"]):
        image = fetch_image(url)
        if image is None:
            continue
        fitted = ImageOps.fit(image, photo_size, method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
        current_distance = distance(primary_hash, dhash(fitted))
        current_feature_matches = feature_match_count(primary, image)
        if current_feature_matches > best_feature_matches or (current_feature_matches == best_feature_matches and current_distance < best_distance):
            best_feature_matches = current_feature_matches
            best_distance = current_distance
            best_index = index

    matched = best_index >= 0 and best_feature_matches >= 18
    return {
        "id": record["id"],
        "name": record["name"],
        "status": "matched" if matched else "visual-match-not-confirmed",
        "primary": record["image"],
        "archiveId": archive_record["id"],
        "archiveName": archive_record["name"],
        "score": candidate["score"],
        "priceMatches": candidate["priceMatches"],
        "matchedArchiveImageIndex": best_index if matched else None,
        "distance": best_distance if best_index >= 0 else None,
        "featureMatches": best_feature_matches,
        "gallery": [url for index, url in enumerate(archive_record["images"]) if matched and index != best_index],
    }


def main() -> None:
    CACHE.mkdir(parents=True, exist_ok=True)
    report = json.loads(REPORT.read_text())
    archive = json.loads(ARCHIVE.read_text())["vehicles"]
    archive_by_id = {record["id"]: record for record in archive}
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as executor:
        results = list(executor.map(lambda record: process(record, archive_by_id), report))
    OUTPUT.write_text(json.dumps(results, indent=2))
    matched = sum(result["status"] == "matched" for result in results)
    print(f"visual-match confirmed: {matched}/{len(results)}")
    for result in results:
        print("\t".join([result["id"], result["status"], str(result.get("featureMatches", "")), str(result.get("distance", "")), str(len(result.get("gallery", []))), result["name"]]))


if __name__ == "__main__":
    main()
