const SOURCE_URL = new URL("./complete_one_pass_poster_prompts.txt", document.baseURI);
const state = {
  recipes: [],
  query: "",
  category: "all",
  mode: "smart",
  sort: "featured",
};

const ASSET_FILES = {
  "kaya-vepudu": "vankaya-vepudu",
};

const elements = {
  archiveCount: document.querySelector("#archiveCount"),
  searchForm: document.querySelector("#searchForm"),
  searchInput: document.querySelector("#searchInput"),
  clearSearch: document.querySelector("#clearSearch"),
  searchHint: document.querySelector("#searchHint"),
  categoryBar: document.querySelector("#categoryBar"),
  sortSelect: document.querySelector("#sortSelect"),
  densityToggle: document.querySelector("#densityToggle"),
  recipeGrid: document.querySelector("#recipeGrid"),
  resultsSummary: document.querySelector("#resultsSummary"),
  dialog: document.querySelector("#recipeDialog"),
  closeDialog: document.querySelector("#closeDialog"),
  dialogCategory: document.querySelector("#dialogCategory"),
  dialogTitle: document.querySelector("#dialogTitle"),
  dialogSubtitle: document.querySelector("#dialogSubtitle"),
  dialogImage: document.querySelector("#dialogImage"),
  downloadLink: document.querySelector("#downloadLink"),
  dialogMeta: document.querySelector("#dialogMeta"),
  dialogIngredients: document.querySelector("#dialogIngredients"),
  dialogSteps: document.querySelector("#dialogSteps"),
  dialogReasons: document.querySelector("#dialogReasons"),
  dialogTipsWrap: document.querySelector("#dialogTipsWrap"),
  dialogTips: document.querySelector("#dialogTips"),
  dialogNutrition: document.querySelector("#dialogNutrition"),
};

const CATEGORY_DEFS = [
  { id: "all", label: "All" },
  { id: "brinjal", label: "Brinjal" },
  { id: "potato", label: "Potato" },
  { id: "plantain", label: "Plantain" },
  { id: "taro", label: "Taro" },
  { id: "tomato", label: "Tomato" },
  { id: "rice", label: "Rice" },
];

const CATEGORY_RULES = [
  { id: "brinjal", terms: ["vankaya", "brinjal", "వంకాయ"] },
  { id: "potato", terms: ["potato", "potatoes", "బంగాళదుంప"] },
  { id: "plantain", terms: ["plantain", "banana", "అరటికాయ"] },
  { id: "taro", terms: ["chamadumpa", "taro", "yam", "చామదుంప"] },
  { id: "tomato", terms: ["tomato", "టమాటా"] },
  { id: "rice", terms: ["rice", "pulihora", "నిమ్మకాయ"] },
];

const CONCEPT_GROUPS = [
  { key: "brinjal", terms: ["brinjal", "brinjals", "eggplant", "aubergine", "vankaya", "వంకాయ"] },
  { key: "potato", terms: ["potato", "potatoes", "aloo", "బంగాళదుంప"] },
  { key: "plantain", terms: ["plantain", "plantains", "raw banana", "green banana", "banana", "అరటికాయ"] },
  { key: "taro", terms: ["taro", "yam", "chamadumpa", "చామదుంప"] },
  { key: "tomato", terms: ["tomato", "tomatoes", "టమాటా"] },
  { key: "rice", terms: ["rice", "lemon rice", "pulihora", "నిమ్మకాయ", "పులిహోర"] },
  { key: "coconut", terms: ["coconut", "fresh coconut"] },
  { key: "milk", terms: ["milk", "boiled milk", "creamy"] },
  { key: "curd", terms: ["curd", "yogurt", "yoghurt", "dahi"] },
  { key: "pachadi", terms: ["pachadi", "chutney", "dip"] },
  { key: "pulusu", terms: ["pulusu", "tamarind gravy", "sour gravy"] },
  { key: "tamarind", terms: ["tamarind", "sour", "tangy"] },
  { key: "roast", terms: ["roast", "roasted", "roasting", "smoky", "smoke", "charred"] },
  { key: "fry", terms: ["fry", "fried", "frying", "stir fry", "vepudu"] },
  { key: "onion", terms: ["onion", "onions"] },
  { key: "coconut", terms: ["coconut"] },
  { key: "dal", terms: ["dal", "lentil", "chana", "moong", "urad", "పప్పు"] },
  { key: "green-chilli", terms: ["green chilli", "green chillies", "chilli", "chilli powder"] },
  { key: "oil", terms: ["oil", "ghee"] },
  { key: "pressure-cooker", terms: ["pressure cooker", "pressure-cook", "whistles"] },
  { key: "low-heat", terms: ["low heat", "slow", "slowly"] },
  { key: "soft", terms: ["soft", "tender", "slightly cooked"] },
];

const RECIPE_ALIASES = {
  "vankaya-kura": ["eggplant curry", "green peas masala", "coconut onion masala", "soft vegetable curry"],
  "vankaya-pachadi": ["eggplant chutney", "smoky brinjal dip", "roasted vegetable pachadi"],
  "vankaya-paal-pachadi": ["creamy eggplant pachadi", "brinjal with milk", "milk-based side dish"],
  "kaya-vepudu": ["eggplant onion fry", "dry brinjal stir fry", "small pieces cooked together"],
  "gutti-vankaya": ["stuffed eggplant", "stuffed brinjal curry", "masala-filled brinjals"],
  "roasted-long-brinjal": ["smoky eggplant pulp", "roasted brinjal side", "rice accompaniment"],
  "potato-coconut-curry": ["potato coconut masala", "coconut potato curry", "mashed potato curry"],
  "potato-ginger-green-chilli-curry": ["potato ginger chilli curry", "potato paste curry", "spicy potato curry"],
  "potato-onion-fry": ["potato onion fry", "crispy potato pieces", "fried potato and onion"],
  "potato-curd-pachadi": ["potato yogurt pachadi", "potato curd side", "thick curd potato dish"],
  "oil-less-potato-fry": ["little oil potato fry", "potato with minimal oil", "oil less potato"],
  "chamadumpa-fry": ["taro fry", "yam fry", "boiled taro pieces"],
  "chamadumpa-pulusu": ["taro tamarind gravy", "sour yam pulusu", "thick tamarind yam dish"],
  "chamadumpa-curry": ["taro curry", "yam fry without green chilli", "chamadumpa vegetable curry"],
  "lemon-rice": ["lemon rice", "sour rice", "rice with chilli and dal tempering"],
  "plantain-moong-dal-curry": ["raw banana lentil curry", "plantain with moong dal", "dry plantain dal fry"],
  "plantain-fry": ["raw banana fry", "green banana fry", "tender plantain pieces"],
  "plantain-onion-curry": ["plantain onion curry", "raw banana with onion", "green banana vegetable curry"],
  "plantain-patodi": ["boiled plantain onion dish", "raw banana patodi", "dry plantain mixture"],
  "plantain-pacchi-pulusu": ["raw banana tamarind gravy", "plantain sour pulusu", "mashed plantain with tamarind"],
  "tomato-dal": ["tomato lentil dal", "pressure cooker tomato dal", "tomato pappu"],
  "tomato-mixed-vegetable-curry": ["mixed vegetable tomato curry", "vegetable medley", "tomato vegetable gravy"],
  "tomato-pachadi": ["tomato chutney", "tomato tempering pachadi", "cooked tomato dip"],
  "tomato-curd-pachadi": ["tomato yogurt pachadi", "tomato curd side", "cooling tomato yogurt dish"],
};

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "can",
  "could",
  "dish",
  "find",
  "for",
  "has",
  "have",
  "i",
  "in",
  "is",
  "like",
  "me",
  "of",
  "on",
  "please",
  "recipe",
  "show",
  "some",
  "something",
  "that",
  "the",
  "to",
  "want",
  "with",
  "would",
  "you",
]);

function normalize(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

function extract(text, pattern, fallback = "") {
  return text.match(pattern)?.[1]?.trim() || fallback;
}

function extractBullets(text) {
  return [...text.matchAll(/^•\s+(.+)$/gm)].map((match) => match[1].trim());
}

function parseIngredientGroups(section) {
  const groups = [];
  let activeGroup = null;

  for (const rawLine of section.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;

    if (line.startsWith("□ ")) {
      if (activeGroup) activeGroup.items.push(line.slice(2).trim());
      continue;
    }

    activeGroup = { name: line, items: [] };
    groups.push(activeGroup);
  }

  return groups.filter((group) => group.items.length > 0);
}

function classifyCategory(id, title) {
  const haystack = normalize(`${id} ${title}`);
  return CATEGORY_RULES.find((rule) => rule.terms.some((term) => haystack.includes(normalize(term))))?.id || "all";
}

function buildSearchFields(recipe) {
  const ingredientText = recipe.ingredientGroups.flatMap((group) => group.items).join(" ");
  const stepText = recipe.steps.join(" ");
  const notesText = [...recipe.reasons, ...recipe.tips].join(" ");
  const aliases = RECIPE_ALIASES[recipe.id] || [];

  return {
    title: normalize(`${recipe.id} ${recipe.titleOriginal} ${recipe.titleEnglish}`),
    ingredients: normalize(ingredientText),
    steps: normalize(stepText),
    notes: normalize(notesText),
    aliases: normalize(aliases.join(" ")),
    all: normalize(`${recipe.id} ${recipe.titleOriginal} ${recipe.titleEnglish} ${ingredientText} ${stepText} ${notesText} ${aliases.join(" ")}`),
  };
}

function parsePromptExport(source) {
  const headers = [...source.matchAll(/^PROMPT\s+(\d+)\s+—\s+([^\r\n]+)$/gm)];

  return headers.map((header, index) => {
    const blockStart = header.index;
    const blockEnd = headers[index + 1]?.index ?? source.length;
    const block = source.slice(blockStart, blockEnd);
    const ingredientMarker = "Ingredient groups and checklist lines exactly:";
    const ingredientStart = block.indexOf(ingredientMarker);
    const nutritionStart = block.indexOf("Nutrition label exactly:", ingredientStart);
    const stepMarker = "Render exactly";
    const stepStart = block.indexOf(":", block.indexOf(stepMarker)) + 1;
    const pageThreeStart = block.indexOf("PAGE 3 —");
    const reasonMarker = "Reasons exactly:";
    const reasonStart = block.indexOf(reasonMarker);
    const nextSectionStart = block.indexOf("Section heading exactly:", reasonStart);

    const titleOriginal = extract(block, /Title exactly:\s*“([^”]*)”/);
    const titleEnglish = extract(block, /Subtitle exactly:\s*“([^”]*)”/);
    const recipe = {
      number: Number(header[1]),
      id: header[2].trim(),
      titleOriginal,
      titleEnglish,
      prepTime: extract(block, /Metadata exactly:\s*“PREP:\s*([^”]+)”/),
      cookTime: extract(block, /Metadata exactly:\s*“PREP:[^”]+”\s+“COOK:\s*([^”]+)”/),
      servings: extract(block, /Metadata exactly:\s*“PREP:[^”]+”\s+“COOK:[^”]+”\s+“SERVES:\s*([^”]+)”/),
      ingredientGroups: parseIngredientGroups(block.slice(ingredientStart + ingredientMarker.length, nutritionStart)),
      steps: [...block.slice(stepStart, pageThreeStart).matchAll(/^\s*\d+\.\s+(.+)$/gm)].map((match) => match[1].trim()),
      reasons: extractBullets(block.slice(reasonStart + reasonMarker.length, nextSectionStart)),
      tips: [],
      nutrition: extract(block, /Nutrition note exactly:\s*“([^”]+)”/),
    };

    const tipsHeading = "Section heading exactly: “TIPS & VARIATIONS”";
    const tipsStart = block.indexOf(tipsHeading);
    if (tipsStart !== -1) {
      const tipsContentStart = block.indexOf("\n", tipsStart) + 1;
      const tipsEnd = block.indexOf("Section heading exactly:", tipsContentStart);
      recipe.tips = extractBullets(block.slice(tipsContentStart, tipsEnd === -1 ? block.length : tipsEnd));
    }

    recipe.category = classifyCategory(recipe.id, `${recipe.titleOriginal} ${recipe.titleEnglish}`);
    recipe.categoryLabel = CATEGORY_DEFS.find((category) => category.id === recipe.category)?.label || "Recipe";
    recipe.aliases = RECIPE_ALIASES[recipe.id] || [];
    recipe.searchFields = buildSearchFields(recipe);
    return recipe;
  });
}

function assetPath(recipe) {
  const fileStem = ASSET_FILES[recipe.id] || recipe.id;
  return new URL(`./${fileStem}.png`, document.baseURI).href;
}

function queryTokens(query) {
  return normalize(query)
    .split(" ")
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

function activeConcepts(query) {
  const normalizedQuery = normalize(query);
  const active = CONCEPT_GROUPS.filter((group) => group.terms.some((term) => normalizedQuery.includes(normalize(term))));
  return [...new Map(active.map((group) => [group.key, group])).values()];
}

function requiredConcepts(query) {
  const filterableKeys = new Set([
    "brinjal",
    "potato",
    "plantain",
    "taro",
    "tomato",
    "rice",
    "coconut",
    "milk",
    "curd",
    "pachadi",
    "pulusu",
  ]);
  return activeConcepts(query).filter((concept) => filterableKeys.has(concept.key));
}

function fieldMatchScore(fields, terms) {
  const weights = [
    ["title", 14],
    ["ingredients", 8],
    ["steps", 5],
    ["notes", 3],
    ["aliases", 4],
  ];

  for (const [field, weight] of weights) {
    if (terms.some((term) => fields[field].includes(normalize(term)))) return weight;
  }
  return 0;
}

function smartScore(recipe, query) {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return 0;

  let score = 0;
  let matchedConcepts = 0;
  const concepts = activeConcepts(query);
  const conceptTerms = new Set(concepts.flatMap((concept) => concept.terms.map(normalize)));

  if (recipe.searchFields.title.includes(normalizedQuery)) score += 28;

  for (const concept of concepts) {
    const match = fieldMatchScore(recipe.searchFields, concept.terms);
    if (match > 0) {
      matchedConcepts += 1;
      score += match;
    }
  }

  for (const token of queryTokens(query)) {
    if (conceptTerms.has(token)) continue;
    if (recipe.searchFields.title.includes(token)) score += 10;
    else if (recipe.searchFields.ingredients.includes(token)) score += 6;
    else if (recipe.searchFields.steps.includes(token)) score += 4;
    else if (recipe.searchFields.notes.includes(token) || recipe.searchFields.aliases.includes(token)) score += 2;
  }

  if (/\b(no|without|less|minimal)\s+(?:much\s+)?oil\b|oil[- ]?less/.test(normalizedQuery)) {
    if (recipe.id === "oil-less-potato-fry") score += 24;
    else if (recipe.searchFields.ingredients.includes("oil")) score += 1;
  }

  if (/\b(smoky|charred|roasted)\b/.test(normalizedQuery) && recipe.searchFields.all.includes("roast")) score += 7;
  if (/\bserve\b.*\brice\b|\brice\b.*\bserve\b/.test(normalizedQuery) && recipe.searchFields.all.includes("rice")) score += 7;

  return matchedConcepts > 0 || score > 0 ? score : 0;
}

function keywordScore(recipe, query) {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return 0;
  if (recipe.searchFields.all.includes(normalizedQuery)) return 30;

  return queryTokens(query).reduce((score, token) => {
    if (recipe.searchFields.title.includes(token)) return score + 12;
    if (recipe.searchFields.ingredients.includes(token)) return score + 8;
    if (recipe.searchFields.steps.includes(token)) return score + 5;
    if (recipe.searchFields.notes.includes(token)) return score + 3;
    return score;
  }, 0);
}

function sortResults(results) {
  if (state.sort === "az") {
    return results.sort((a, b) => a.recipe.titleEnglish.localeCompare(b.recipe.titleEnglish));
  }
  if (state.sort === "steps") {
    return results.sort((a, b) => b.recipe.steps.length - a.recipe.steps.length || a.recipe.number - b.recipe.number);
  }
  if (state.query.trim()) return results.sort((a, b) => b.score - a.score || a.recipe.number - b.recipe.number);
  return results.sort((a, b) => a.recipe.number - b.recipe.number);
}

function getResults() {
  const scoreFunction = state.mode === "smart" ? smartScore : keywordScore;
  const hasQuery = Boolean(state.query.trim());
  let results = state.recipes.map((recipe) => ({ recipe, score: hasQuery ? scoreFunction(recipe, state.query) : 0 }));

  if (hasQuery) results = results.filter((result) => result.score > 0);
  if (hasQuery && state.mode === "smart") {
    const required = requiredConcepts(state.query);
    if (required.length) {
      const useAny = /\bor\b/.test(normalize(state.query));
      results = results.filter(({ recipe }) => {
        const matches = required.map((concept) => fieldMatchScore(recipe.searchFields, concept.terms) > 0);
        return useAny ? matches.some(Boolean) : matches.every(Boolean);
      });
    }
  }
  if (state.category !== "all") results = results.filter((result) => result.recipe.category === state.category);
  return sortResults(results);
}

function makeTextElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = text;
  return element;
}

function createRecipeCard(recipe, score, index) {
  const article = document.createElement("article");
  article.className = "recipe-card";
  article.style.animationDelay = `${Math.min(index * 28, 260)}ms`;

  const button = document.createElement("button");
  button.className = "card-trigger";
  button.type = "button";
  button.dataset.openRecipe = recipe.id;
  button.setAttribute("aria-label", `Open ${recipe.titleEnglish} poster`);

  const media = document.createElement("div");
  media.className = "card-media";
  const image = document.createElement("img");
  image.src = assetPath(recipe);
  image.alt = `${recipe.titleEnglish} recipe poster`;
  image.loading = "lazy";
  image.decoding = "async";
  image.addEventListener("error", () => {
    image.alt = "Poster image unavailable";
    media.classList.add("image-missing");
  });
  media.append(image);
  media.append(makeTextElement("span", "card-index", String(recipe.number).padStart(2, "0")));
  media.append(makeTextElement("span", "card-category", recipe.categoryLabel));
  media.append(makeTextElement("span", "card-open", "Open poster ↗"));
  if (state.query.trim() && score > 0) media.append(makeTextElement("span", "match-badge", state.mode === "smart" ? "Smart match" : "Match"));

  const body = document.createElement("div");
  body.className = "card-body";
  body.append(makeTextElement("p", "card-original-title", recipe.titleOriginal || recipe.titleEnglish));
  body.append(makeTextElement("p", "card-english-title", recipe.titleEnglish));
  const meta = document.createElement("div");
  meta.className = "card-meta";
  meta.append(makeTextElement("span", "", `${recipe.steps.length} steps`));
  meta.append(makeTextElement("span", "", `${recipe.ingredientGroups.length} sections`));
  body.append(meta);

  button.append(media, body);
  article.append(button);
  return article;
}

function renderCategoryBar() {
  const counts = new Map(CATEGORY_DEFS.map((category) => [category.id, 0]));
  for (const recipe of state.recipes) counts.set(recipe.category, (counts.get(recipe.category) || 0) + 1);
  counts.set("all", state.recipes.length);

  elements.categoryBar.replaceChildren(
    ...CATEGORY_DEFS.filter((category) => category.id === "all" || counts.get(category.id) > 0).map((category) => {
      const button = document.createElement("button");
      button.className = `category-button${state.category === category.id ? " is-active" : ""}`;
      button.type = "button";
      button.dataset.category = category.id;
      button.setAttribute("aria-pressed", String(state.category === category.id));
      button.append(document.createTextNode(category.label));
      button.append(makeTextElement("span", "", String(counts.get(category.id))));
      return button;
    }),
  );
}

function renderRecipes() {
  const results = getResults();
  elements.recipeGrid.setAttribute("aria-busy", "false");
  elements.recipeGrid.replaceChildren();

  if (!results.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.append(makeTextElement("strong", "", "Nothing on the wall yet."));
    empty.append(document.createTextNode("Try a broader ingredient, dish name, or cooking action."));
    elements.recipeGrid.append(empty);
  } else {
    const fragment = document.createDocumentFragment();
    results.forEach(({ recipe, score }, index) => fragment.append(createRecipeCard(recipe, score, index)));
    elements.recipeGrid.append(fragment);
  }

  const query = state.query.trim();
  const count = results.length;
  if (query) {
    elements.resultsSummary.textContent = `${count} ${count === 1 ? "poster" : "posters"} found for “${query}”`;
  } else if (state.category === "all") {
    elements.resultsSummary.textContent = `${count} illustrated recipes in the archive`;
  } else {
    elements.resultsSummary.textContent = `${count} ${CATEGORY_DEFS.find((category) => category.id === state.category)?.label.toLowerCase()} recipes`;
  }
}

function updateSearchControls() {
  const hasQuery = Boolean(state.query.trim());
  elements.clearSearch.hidden = !hasQuery;
  elements.searchHint.textContent = state.mode === "smart"
    ? "Understands ingredients, cooking actions, and close meanings."
    : "Matches the words that appear in the recipe text.";
  document.querySelectorAll("[data-mode]").forEach((button) => {
    const isActive = button.dataset.mode === state.mode;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function openRecipe(recipeId) {
  const recipe = state.recipes.find((item) => item.id === recipeId);
  if (!recipe) return;

  elements.dialogCategory.textContent = recipe.categoryLabel;
  elements.dialogTitle.textContent = recipe.titleOriginal || recipe.titleEnglish;
  elements.dialogSubtitle.textContent = recipe.titleEnglish;
  elements.dialogImage.src = assetPath(recipe);
  elements.dialogImage.alt = `${recipe.titleEnglish} recipe poster`;
  elements.downloadLink.href = assetPath(recipe);
  elements.downloadLink.download = `${recipe.id}.png`;

  elements.dialogMeta.replaceChildren(
    makeTextElement("span", "", `Prep: ${recipe.prepTime || "not specified"}`),
    makeTextElement("span", "", `Cook: ${recipe.cookTime || "not specified"}`),
    makeTextElement("span", "", `Serves: ${recipe.servings || "not specified"}`),
  );

  elements.dialogIngredients.replaceChildren(
    ...recipe.ingredientGroups.map((group) => {
      const wrapper = document.createElement("div");
      wrapper.className = "ingredient-group";
      wrapper.append(makeTextElement("h4", "", group.name));
      const list = document.createElement("ul");
      list.className = "ingredient-list";
      list.append(...group.items.map((item) => makeTextElement("li", "", item)));
      wrapper.append(list);
      return wrapper;
    }),
  );

  elements.dialogSteps.replaceChildren(...recipe.steps.map((step) => makeTextElement("li", "", step)));
  elements.dialogReasons.replaceChildren(...recipe.reasons.map((reason) => makeTextElement("li", "", reason)));
  elements.dialogTipsWrap.hidden = recipe.tips.length === 0;
  elements.dialogTips.replaceChildren(...recipe.tips.map((tip) => makeTextElement("li", "", tip)));
  elements.dialogNutrition.textContent = recipe.nutrition;

  if (typeof elements.dialog.showModal === "function") elements.dialog.showModal();
  else elements.dialog.setAttribute("open", "");
  elements.closeDialog.focus();
}

function closeRecipe() {
  if (typeof elements.dialog.close === "function") elements.dialog.close();
  else elements.dialog.removeAttribute("open");
}

async function initialize() {
  try {
    const response = await fetch(SOURCE_URL);
    if (!response.ok) throw new Error(`Recipe source returned ${response.status}`);
    state.recipes = parsePromptExport(await response.text());
    elements.archiveCount.textContent = `${state.recipes.length} posters · local archive`;
    renderCategoryBar();
    updateSearchControls();
    renderRecipes();
  } catch (error) {
    console.error(error);
    elements.archiveCount.textContent = "Archive unavailable";
    elements.recipeGrid.setAttribute("aria-busy", "false");
    elements.recipeGrid.replaceChildren();
    const errorState = document.createElement("div");
    errorState.className = "error-state";
    errorState.append(makeTextElement("strong", "", "The archive needs a little room to load."));
    errorState.append(document.createTextNode("Open this folder through a local web server or GitHub Pages so the recipe text can be fetched."));
    elements.recipeGrid.append(errorState);
    elements.resultsSummary.textContent = "Recipe source unavailable";
  }
}

elements.searchForm.addEventListener("submit", (event) => event.preventDefault());
elements.searchInput.addEventListener("input", () => {
  state.query = elements.searchInput.value;
  updateSearchControls();
  renderRecipes();
});
elements.clearSearch.addEventListener("click", () => {
  elements.searchInput.value = "";
  state.query = "";
  updateSearchControls();
  renderRecipes();
  elements.searchInput.focus();
});
elements.sortSelect.addEventListener("change", () => {
  state.sort = elements.sortSelect.value;
  renderRecipes();
});
elements.densityToggle.addEventListener("click", () => {
  const compact = elements.recipeGrid.classList.toggle("is-compact");
  elements.densityToggle.setAttribute("aria-pressed", String(compact));
  elements.densityToggle.title = compact ? "Use spacious gallery view" : "Compact gallery view";
  elements.densityToggle.setAttribute("aria-label", compact ? "Use spacious gallery view" : "Use compact gallery view");
});

document.querySelectorAll("[data-mode]").forEach((button) => {
  button.addEventListener("click", () => {
    state.mode = button.dataset.mode;
    updateSearchControls();
    renderRecipes();
  });
});

document.querySelectorAll("[data-query]").forEach((button) => {
  button.addEventListener("click", () => {
    state.query = button.dataset.query;
    elements.searchInput.value = state.query;
    updateSearchControls();
    renderRecipes();
    elements.searchInput.focus();
  });
});

elements.categoryBar.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  state.category = button.dataset.category;
  renderCategoryBar();
  renderRecipes();
});

document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-open-recipe]");
  if (trigger) openRecipe(trigger.dataset.openRecipe);
});

elements.closeDialog.addEventListener("click", closeRecipe);
elements.dialog.addEventListener("click", (event) => {
  if (event.target === elements.dialog) closeRecipe();
});

document.addEventListener("keydown", (event) => {
  const activeTag = document.activeElement?.tagName;
  if (event.key === "/" && activeTag !== "INPUT" && activeTag !== "TEXTAREA" && activeTag !== "SELECT") {
    event.preventDefault();
    elements.searchInput.focus();
  }
  if (event.key === "Escape" && elements.dialog.open) closeRecipe();
});

initialize();
