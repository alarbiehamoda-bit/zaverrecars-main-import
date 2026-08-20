from pathlib import Path
import sys

from PIL import Image

for raw_path in sys.argv[1:]:
    image = Image.open(raw_path).convert("RGBA")
    points = [(0, 0), (80, 80), (120, 120), (400, 400), (960, 80), (80, 960), (1600, 1600), (960, 960)]
    values = [f"{point}:{image.getpixel(point)}" for point in points]
    print(f"{Path(raw_path).name}\n  " + "\n  ".join(values))
