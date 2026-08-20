from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, UnidentifiedImageError


ROOT = Path("/home/ubuntu/gallery-model-audit")
FONT = ImageFont.load_default()


def create_sheet(folder_name: str) -> None:
    folder = ROOT / folder_name
    image_paths = sorted(folder.glob("*.jpg"))
    tile_width, tile_height, label_height, gap = 260, 180, 28, 8
    columns = 3
    valid_images = []
    for image_path in image_paths:
        try:
            with Image.open(image_path) as source:
                source.verify()
            valid_images.append(image_path)
        except UnidentifiedImageError:
            continue
    rows = (len(valid_images) + columns - 1) // columns
    sheet = Image.new(
        "RGB",
        (columns * tile_width + (columns + 1) * gap, rows * (tile_height + label_height) + (rows + 1) * gap),
        "#11110f",
    )
    draw = ImageDraw.Draw(sheet)

    for index, image_path in enumerate(valid_images):
        with Image.open(image_path) as source:
            image = source.convert("RGB")
        image.thumbnail((tile_width, tile_height))
        tile = Image.new("RGB", (tile_width, tile_height), "#1c1b19")
        tile.paste(image, ((tile_width - image.width) // 2, (tile_height - image.height) // 2))
        x = gap + (index % columns) * (tile_width + gap)
        y = gap + (index // columns) * (tile_height + label_height + gap)
        sheet.paste(tile, (x, y))
        draw.text((x + 6, y + tile_height + 7), image_path.stem, fill="#e1c48f", font=FONT)

    sheet.save(ROOT / f"{folder_name}-contact-sheet.jpg", quality=92)


for target in ("sf90", "huracan-sto"):
    create_sheet(target)
