from pathlib import Path
import sys

from PIL import Image

for raw_path in sys.argv[1:]:
    path = Path(raw_path)
    image = Image.open(path)
    has_alpha = "A" in image.getbands()
    alpha = image.getchannel("A") if has_alpha else None
    alpha_range = alpha.getextrema() if alpha else None
    alpha_bbox = alpha.getbbox() if alpha else None
    print(f"{path.name}\tmode={image.mode}\talpha={has_alpha}\trange={alpha_range}\tbbox={alpha_bbox}")
