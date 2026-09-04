# Amma’s Table — The Living Telugu Recipe Storybook 🍲✨

An enchanted, Disney/Pixar-caliber interactive gallery of 24 beloved Telugu family recipe posters, featuring **10x faster performance**, an **intelligent culinary search engine**, **living 3D card tilt**, and **Amma’s interactive counter cook mode**.

---

## 🌟 What Makes Amma's Table Magical

- **Disney Storybook Aesthetics**:
  - Warm **Golden Hour Courtyard** amber lighting, **Midnight Kitchen Magic**, and **Festival of Lights** dynamic themes.
  - Floating 60fps golden spice dust ambient canvas particles (turmeric, cumin, and warm aroma embers).
  - Living 3D recipe cards with perspective parallax tilt and dynamic holographic foil shimmer.
  - Fairytale heirloom grimoire modal with leather corners, illuminated drop-caps, and gold-gilded edges.

- **10x Performance Engineering (>96% Bandwidth Reduction)**:
  - Raw 70MB PNG gallery converted into dual high-efficiency WebP formats (~40KB responsive thumbnails + ~180KB crisp display images).
  - Pristine original 1536×1024 PNGs preserved for lossless poster download.
  - Pre-compiled structured recipe database (`assets/data/recipes.json`) eliminating client-side text parsing.

- **The Magic Spice Dabba (Kitchen Oracle)**:
  - Can’t decide what to eat? Spin the enchanted spice box to receive Amma’s daily dish recommendation and culinary blessing.
  - Instant craving spells (*“Crispy for Rainy Day”*, *“Creamy Warm Hug”*, *“Zero-Oil Magic”*).

- **Intelligent Typo-Tolerant Culinary Search Engine**:
  - **Fuzzy Matching**: Resilient to typos (e.g., `bringal`, `patato`, `tamrind`, `currey`).
  - **Multilingual Telugu & English Search**: Understands native Telugu script (`వంకాయ`, `టమాటా`, `పప్పు`), Romanized Telugu phonetics (`vankaya`, `aratikaya`, `chamadumpa`, `pulusu`, `vepudu`), and English names.
  - **Semantic Craving Comprehension**: Understands natural language requests like *“something sour with rice”*, *“potato without much oil”*, or *“smoky roasted chutney”*.

- **Amma's Counter Cook Mode & Kitchen Assistant**:
  - Full-screen high-contrast cooking walkthrough with step-by-step counter display.
  - Interactive Pantry Checklist with strike-through progress.
  - Potion / Servings Scaler (1x, 2x, 4x portion scaling).
  - Integrated Kitchen Simmer Timer with Web Audio harmonic bell chime.

- **Procedural Web Audio Soundscape**:
  - Gentle fairy chimes, parchment page turns, star bookmark audio, and simmer bell synthesized directly in the browser with zero external audio downloads.
  - Muted by default with an accessible, polite audio toggle.

---

## 📁 Repository Structure

```
├── index.html                                  # Semantic, accessible HTML5 storybook entry
├── README.md                                   # Project documentation
├── .github/
│   └── workflows/
│       └── pages.yml                           # GitHub Pages auto-deployment workflow
└── assets/
    ├── css/
    │   ├── styles.css                          # Design tokens, reset, typography
    │   ├── magical-theme.css                   # Disney lighting themes, golden foil, animations
    │   └── components.css                      # Spice Dabba, 3D cards, Grimoire modal, Cook Mode
    ├── js/
    │   ├── app.js                              # Master application coordinator & state
    │   ├── search.js                           # Intelligent fuzzy & multilingual search engine
    │   ├── magical-fx.js                       # 60fps canvas particles, 3D tilt, Web Audio SFX
    │   └── cook-mode.js                        # Step-by-step cooking guide & kitchen timer
    ├── data/
    │   ├── recipes.json                        # Pre-compiled, enriched recipe catalog
    │   └── archive/
    │       └── complete_one_pass_poster_prompts.txt # Preserved raw prompt source archive
    └── images/
        ├── posters/                            # Original lossless 1536×1024 PNG files (for download)
        └── webp/                               # High-speed display & thumbnail WebPs
```

---

## 🚀 Running Locally

From this folder, start any local static server:

```sh
# Using Python
python3 -m http.server 4173

# Or using Node
npx serve .
```

Then open <http://localhost:4173> in your browser.

---

## 🌐 Publish on GitHub Pages

The repository includes a ready-to-use GitHub Actions workflow in `.github/workflows/pages.yml`. Simply push to the `main` branch, and GitHub Pages will deploy automatically.
