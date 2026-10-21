import os
import sys
import shutil
from pathlib import Path
from PIL import Image

BASE_DIR = Path(__file__).resolve().parent.parent
SOURCE_DIR = BASE_DIR / "Lin's-Art"
PUBLIC_ART_DIR = BASE_DIR / "public" / "art"
PUBLIC_FULL_DIR = PUBLIC_ART_DIR / "full"

# Explicit slot mapping so room curations and spatial transforms remain stable
SLOT_MAPPING = {
    "mw-01": ("Chole.PNG", "masterwork_01.webp", 2048, 86),
    "mw-02": ("The traveler.PNG", "masterwork_02.webp", 2048, 86),
    "mw-04": ("Maquia and Ariel.PNG", "masterwork_04.webp", 2048, 86),
    "mw-05": ("Long-tailed tits.PNG", "masterwork_05.webp", 2048, 86),
    "mw-06": ("I am here for you.PNG", "masterwork_06.webp", 2048, 86),
    "mw-07": ("The nerdy brawl.PNG", "masterwork_07.webp", 2048, 86),
    "mw-08": ("Rotten girl.PNG", "masterwork_08.webp", 2048, 86),
    "mw-09": ("Anxious girl sketch.PNG", "masterwork_09.webp", 2048, 86),
    "mw-10": ("American teenager.PNG", "masterwork_10.webp", 2048, 86),
    "mw-11": ("Long way from home.PNG", "masterwork_11.webp", 2048, 86),
    "mw-12": ("Crush.PNG", "masterwork_12.webp", 2048, 86),
    "mw-13": ("Calne Ca.PNG", "masterwork_13.webp", 2048, 86),
    "mw-14": ("God-forsaken Pearl.PNG", "masterwork_14.webp", 2048, 86),
    "mw-15": ("Red hoodie girl with her cat.PNG", "masterwork_15.webp", 2048, 86),
    "mw-16": ("Maki and Billy.PNG", "masterwork_16.webp", 2048, 86),
    "study-01": ("After midnight.JPG", "study_01.webp", 1400, 82),
    "study-02": ("The witch.JPG", "study_02.webp", 1400, 82),
    "study-03": ("The last goodbye kiss.JPG", "study_03.webp", 1400, 82),
    "study-04": ("Haunted.JPG", "study_04.webp", 1400, 82),
    "study-05": ("Date night.JPG", "study_05.webp", 1400, 82),
    "study-06": ("Expression sketch.JPG", "study_06.webp", 1400, 82),
    "study-07": ("Dorothy.JPG", "study_07.webp", 1400, 82),
    "study-08": ("Late night in the city.JPG", "study_08.webp", 1400, 82),
    "study-09": ("Crying girl.JPG", "study_09.webp", 1400, 82),
    "study-10": ("The devil sister.JPG", "study_10.webp", 1400, 82),
    "study-11": ("Last stop.JPG", "study_11.webp", 1400, 82),
    "study-12": ("Crying fairy.JPG", "study_12.webp", 1400, 82),
    "study-14": ("Junetta the wood elf.JPG", "study_14.webp", 1400, 82),
    "study-15": ("Heated call.JPG", "study_15.webp", 1400, 82),
    "study-16": ("Junetta origin.JPG", "study_16.webp", 1400, 82),
}

def main():
    if not SOURCE_DIR.exists():
        print(f"Error: Source directory {SOURCE_DIR} not found.")
        sys.exit(1)

    PUBLIC_ART_DIR.mkdir(parents=True, exist_ok=True)
    PUBLIC_FULL_DIR.mkdir(parents=True, exist_ok=True)

    for slot_id, (fname, webp_name, max_dim, quality) in SLOT_MAPPING.items():
        src_path = SOURCE_DIR / fname
        if not src_path.exists():
            print(f"Skipping {slot_id}: {fname} not found in {SOURCE_DIR}")
            continue

        webp_path = PUBLIC_ART_DIR / webp_name
        full_dest = PUBLIC_FULL_DIR / fname
        shutil.copy2(src_path, full_dest)

        with Image.open(src_path) as im:
            width, height = im.size
            if im.mode in ("RGBA", "P"):
                bg = Image.new("RGB", im.size, (255, 255, 255))
                if im.mode == "RGBA":
                    bg.paste(im, mask=im.split()[3])
                else:
                    bg.paste(im)
                im = bg
            elif im.mode != "RGB":
                im = im.convert("RGB")

            im_thumb = im.copy()
            im_thumb.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)
            im_thumb.save(webp_path, "WEBP", quality=quality, method=6)
            webp_size_kb = round(os.path.getsize(webp_path) / 1024, 1)
            print(f"✓ [{slot_id}] {fname} -> {webp_name} ({width}x{height}, {webp_size_kb} KB)")

if __name__ == "__main__":
    main()
