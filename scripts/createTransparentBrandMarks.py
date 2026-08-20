from pathlib import Path

from PIL import Image


ASSETS = Path("/home/ubuntu/webdev-static-assets")
CANVAS_SIZE = 1024

MARKS = {
    "lamborghini": ("lamborghini-logo-transparent.png", 780),
    "ferrari": ("ferrari-logo-transparent.png", 780),
    "mclaren": ("mclaren-logo-transparent.png", 860),
    "porsche": ("porsche-logo-transparent.png", 780),
    "audi": ("audi-logo-transparent.png", 860),
    "bmw": ("bmw-logo-transparent.png", 780),
    "bentley": ("bentley-logo-transparent.png", 900),
    "aston-martin": ("aston-martin-logo-transparent.png", 900),
    "cadillac": ("cadillac-logo-transparent.png", 820),
}


def centered(mark: Image.Image, target_size: int, output: Path) -> None:
    alpha = mark.getchannel("A")
    bbox = alpha.getbbox()
    if not bbox:
        raise RuntimeError(f"No visible mark remains for {output.name}")
    mark = mark.crop(bbox)
    scale = target_size / max(mark.size)
    mark = mark.resize((round(mark.width * scale), round(mark.height * scale)), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0))
    canvas.alpha_composite(mark, ((CANVAS_SIZE - mark.width) // 2, (CANVAS_SIZE - mark.height) // 2))
    canvas.save(output)


def clean_existing_mark(source: Path, output: Path, target_size: int) -> None:
    """Remove the semi-transparent generative backdrop while retaining opaque marque pixels."""
    image = Image.open(source).convert("RGBA")
    red, green, blue, alpha = image.split()
    cleaned = alpha.point(lambda value: 255 if value >= 150 else 0)
    image.putalpha(cleaned)
    centered(image, target_size, output)


def clean_z_mark(source: Path, output: Path) -> None:
    """Remove the neutral checkerboard generated behind the supplied gold Z mark."""
    image = Image.open(source).convert("RGBA")
    pixels = image.load()
    for y in range(image.height):
        for x in range(image.width):
            red, green, blue, _ = pixels[x, y]
            chroma = max(red, green, blue) - min(red, green, blue)
            brightness = (red + green + blue) / 3
            pixels[x, y] = (red, green, blue, 0 if chroma < 18 and brightness > 170 else 255)
    centered(image, 900, output)


for brand, (source_name, target_size) in MARKS.items():
    clean_existing_mark(ASSETS / source_name, ASSETS / f"{brand}-mark-alpha.png", target_size)

clean_z_mark(ASSETS / "zaverre-winged-z-mark.png", ASSETS / "zaverre-winged-z-mark-alpha.png")
