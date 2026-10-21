# 0004: Catalog Indexing and Dynamic Metadata Configuration

The artist has not titled the individual artworks yet. We decided to structure artwork metadata in a centralized data catalog (`src/data/artworks.ts`) using clean catalog identifiers (`Masterwork #01` through `#16`, `Study #01` through `#16`) while emphasizing technical specs, medium, and concept notes. This decoupling allows the artist to add custom titles, dates, and lore at any time by updating a single configuration file without touching 3D scene code.
