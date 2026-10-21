# 0002: Dual-Tier Texture Pipeline

We decided to process raw artwork assets into dual-tier assets: compressed, mipmapped WebP textures (~300–400KB) for real-time 3D gallery walls, and full-resolution uncompressed assets lazy-loaded only during Inspection View. Loading 160MB of uncompressed PNGs into WebGL memory causes frame drops, battery drain, and mobile browser crashes. Progressive loading preserves 60 FPS performance without compromising high-resolution detail.
