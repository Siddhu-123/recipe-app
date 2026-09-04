# Amma's Table — Recipe Poster Gallery

A static, GitHub Pages-ready gallery for the illustrated Telugu family recipe posters in this folder.

## Included

- Responsive gallery layout for all poster PNGs.
- Filters by recipe family: brinjal, potato, plantain, taro, tomato, and rice.
- Search across the exact poster titles, ingredients, steps, reasons, and tips.
- Smart search with browser-only synonym and intent expansion for natural queries such as `something with potato and coconut`, `a roasted chutney`, or `potato without much oil`.
- Poster detail dialog with the full recipe text and PNG download link.
- GitHub Actions workflow for automatic GitHub Pages deployment.

The search index is intentionally local and dependency-free. It does not send recipe text to an API or require a model download. It combines direct text relevance with a small, editable vocabulary map; a future version can replace the scorer with an embedding model if the collection grows.

## Run locally

From this folder, start any static web server. For example:

```sh
python3 -m http.server 4173
```

Then open <http://localhost:4173>.

Opening `index.html` directly with `file://` will block the browser from fetching the recipe-text export.

## Publish on GitHub Pages

Create an empty repository on GitHub, then run from this folder:

```sh
git init
git add .
git commit -m "Build searchable recipe poster gallery"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

The included `.github/workflows/pages.yml` deploys the repository to GitHub Pages after the first push. In the repository settings, set Pages to use **GitHub Actions** if GitHub has not selected it automatically.

## Source

The gallery reads `complete_one_pass_poster_prompts.txt` in the browser. Keeping that export beside the poster PNGs makes the repository self-contained and keeps the supplied recipe wording intact.
