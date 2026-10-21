import os
import json
import re
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
PUBLIC_ART = BASE_DIR / "public" / "art"
PUBLIC_FULL = PUBLIC_ART / "full"
DATA_FILE = BASE_DIR / "src" / "data" / "artworks.ts"

def test_artworks():
    assert DATA_FILE.exists(), f"Missing {DATA_FILE}"
    content = DATA_FILE.read_text(encoding="utf-8")
    
    # Extract ARTWORKS array from ts file
    match = re.search(r'export const ARTWORKS: Artwork\[\] = (\[.*?\]);', content, re.DOTALL)
    assert match, "Failed to parse ARTWORKS array from artworks.ts"
    
    artworks = json.loads(match.group(1))
    assert len(artworks) == 32, f"Expected 32 artworks, got {len(artworks)}"
    
    masterworks = [a for a in artworks if a["hall"] == "hall-1"]
    studies = [a for a in artworks if a["hall"] == "hall-2"]
    
    assert len(masterworks) == 16, f"Expected 16 masterworks, got {len(masterworks)}"
    assert len(studies) == 16, f"Expected 16 studies, got {len(studies)}"
    
    for a in artworks:
        webp_rel = a["textureUrl"].lstrip("/")
        full_rel = a["fullResUrl"].lstrip("/")
        
        webp_path = BASE_DIR / "public" / webp_rel.split("art/")[1]
        # In textureUrl: /art/masterwork_01.webp -> public/art/masterwork_01.webp
        real_webp = BASE_DIR / "public" / a["textureUrl"].lstrip("/")
        real_full = BASE_DIR / "public" / a["fullResUrl"].lstrip("/")
        
        assert real_webp.exists(), f"Texture file missing: {real_webp}"
        assert real_full.exists(), f"Full-res file missing: {real_full}"
        assert a["aspectRatio"] > 0, f"Invalid aspect ratio for {a['id']}"
        assert a["catalogIndex"], f"Missing catalog index for {a['id']}"

    print(f"✅ All 32 artworks, textures, and full-res files verified successfully!")

if __name__ == "__main__":
    test_artworks()
