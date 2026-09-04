/**
 * AMMA'S TABLE — NEXT-GENERATION INTELLIGENT SEARCH & DISCOVERY ENGINE
 * Features:
 * - Typo-tolerant Fuzzy Matching (Levenshtein Distance)
 * - Multilingual Telugu & English Transliteration
 * - Natural Language Craving & Mood Semantic Understanding
 * - Dynamic Category & Flavor-Tag Filtering
 * - Multi-criteria Sorting
 */

export class RecipeSearchEngine {
  constructor(recipes = []) {
    this.recipes = recipes;

    // Multilingual & Synonym Synsets
    this.conceptDictionary = {
      brinjal: ['brinjal', 'brinjals', 'eggplant', 'aubergine', 'vankaya', 'వంకాయ', 'వంకాయలు', 'baingan'],
      potato: ['potato', 'potatoes', 'aloo', 'alu', 'బంగాళదుంప', 'batata'],
      plantain: ['plantain', 'plantains', 'raw banana', 'green banana', 'aratikaya', 'అరటికాయ'],
      taro: ['taro', 'yam', 'chamadumpa', 'chama dumpa', 'arbi', 'చామదుంప'],
      tomato: ['tomato', 'tomatoes', 'tamata', 'టమాటా', 'tamatar'],
      rice: ['rice', 'lemon rice', 'pulihora', 'chitrannam', 'అన్నం', 'పులిహోర', 'చిత్రాన్నం'],
      coconut: ['coconut', 'kobbari', 'fresh coconut', 'కొబ్బరి', 'nariyal'],
      curd: ['curd', 'yogurt', 'yoghurt', 'dahi', 'perugu', 'పెరుగు', 'raita'],
      milk: ['milk', 'paalu', 'పాలు', 'creamy', 'boiled milk'],
      dal: ['dal', 'lentil', 'lentils', 'pappu', 'పప్పు', 'toor dal', 'moong dal', 'chana dal', 'పప్పుచారు'],
      tamarind: ['tamarind', 'chintha pandu', 'చింతపండు', 'sour', 'tangy', 'imli'],
      pulusu: ['pulusu', 'పులుసు', 'tamarind gravy', 'sour stew', 'pacchi pulusu', 'పచ్చి పులుసు'],
      fry: ['fry', 'fried', 'vepudu', 'వేపుడు', 'stir fry', 'crispy', 'crunchy', 'roast fry'],
      pachadi: ['pachadi', 'పచ్చడి', 'chutney', 'relish', 'dip', 'roti pachadi'],
      smoky: ['smoky', 'smoke', 'charred', 'flame roasted', 'roasted', 'blistered', 'కాల్చిన'],
      spicy: ['spicy', 'fiery', 'hot', 'karam', 'కారం', 'chilli', 'ginger chilli', 'masala', 'ఘాటైన'],
      zeroOil: ['zero oil', 'no oil', 'oil less', 'oil-free', 'less oil', 'minimal oil', 'healthy', 'diet', 'నూనె లేని', 'తక్కువ నూనె']
    };

    // Words to ignore for token analysis
    this.stopWords = new Set([
      'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'can', 'could', 'dish',
      'do', 'find', 'for', 'from', 'have', 'how', 'i', 'in', 'is', 'it', 'like',
      'make', 'me', 'my', 'of', 'on', 'or', 'please', 'recipe', 'show', 'some',
      'something', 'that', 'the', 'to', 'want', 'what', 'with', 'would', 'you'
    ]);
  }

  setRecipes(recipes) {
    this.recipes = recipes;
  }

  // Fast Levenshtein distance for fuzzy matching
  levenshtein(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }

  normalize(str) {
    return String(str || '')
      .normalize('NFKC')
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
      .trim();
  }

  tokenize(query) {
    return this.normalize(query)
      .split(/\s+/)
      .filter(token => token.length > 1 && !this.stopWords.has(token));
  }

  // Identify active concept groups from query, including fuzzy matches
  findActiveConcepts(query) {
    const norm = this.normalize(query);
    const tokens = this.tokenize(query);
    const matched = new Set();

    for (const [conceptKey, terms] of Object.entries(this.conceptDictionary)) {
      for (const term of terms) {
        const normTerm = this.normalize(term);
        // Direct substring match
        if (norm.includes(normTerm)) {
          matched.add(conceptKey);
          break;
        }
        // Fuzzy token match for tokens >= 4 characters
        for (const token of tokens) {
          if (token.length >= 4 && normTerm.length >= 4) {
            const dist = this.levenshtein(token, normTerm);
            const maxAllowed = Math.min(token.length, normTerm.length) <= 5 ? 1 : 2;
            if (dist <= maxAllowed) {
              matched.add(conceptKey);
              break;
            }
          }
        }
      }
    }

    return Array.from(matched);
  }

  scoreRecipe(recipe, query, activeConcepts) {
    const normQuery = this.normalize(query);
    const tokens = this.tokenize(query);
    let score = 0;
    let matchReasons = [];

    // 1. Exact full title match
    const normOriginal = this.normalize(recipe.titleOriginal);
    const normEnglish = this.normalize(recipe.titleEnglish);
    if (normEnglish.includes(normQuery) || normOriginal.includes(normQuery)) {
      score += 50;
      matchReasons.push('Direct Title Match');
    }

    // 2. Semantic concept matches
    for (const concept of activeConcepts) {
      const terms = this.conceptDictionary[concept] || [];
      let foundInRecipe = false;

      // Check category match
      if (recipe.category === concept) {
        score += 25;
        foundInRecipe = true;
      }
      // Check prep style match
      if (recipe.prepStyle === concept) {
        score += 20;
        foundInRecipe = true;
      }
      // Check flavor profile & dietary
      if (recipe.flavorProfile.includes(concept) || recipe.dietary.includes(concept)) {
        score += 18;
        foundInRecipe = true;
      }
      // Check haystack
      if (terms.some(t => recipe.searchHaystack.includes(this.normalize(t)))) {
        score += 15;
        foundInRecipe = true;
      }

      if (foundInRecipe) {
        matchReasons.push(`Craving: ${concept}`);
      }
    }

    // 3. Token-level matching (Title, Ingredients, Steps)
    const ingredientsText = recipe.ingredientGroups.flatMap(g => g.items).join(' ').toLowerCase();
    for (const token of tokens) {
      if (normEnglish.includes(token) || normOriginal.includes(token)) {
        score += 12;
      } else if (ingredientsText.includes(token)) {
        score += 8;
      } else if (recipe.searchHaystack.includes(token)) {
        score += 4;
      } else {
        // Fuzzy token match against recipe title words
        const titleWords = (normEnglish + ' ' + normOriginal).split(/\s+/);
        for (const tw of titleWords) {
          if (tw.length >= 4 && token.length >= 4) {
            if (this.levenshtein(tw, token) <= 1) {
              score += 9;
              matchReasons.push(`Fuzzy: ${tw}`);
              break;
            }
          }
        }
      }
    }

    // 4. Special Intent Boosts
    if (activeConcepts.includes('zeroOil') && recipe.id === 'oil-less-potato-fry') {
      score += 40;
    }
    if (activeConcepts.includes('smoky') && (recipe.id === 'roasted-long-brinjal' || recipe.id === 'vankaya-pachadi')) {
      score += 25;
    }
    if (activeConcepts.includes('rice') && recipe.id === 'lemon-rice') {
      score += 35;
    }

    return { score, matchReasons };
  }

  search({
    query = '',
    category = 'all',
    flavor = 'all',
    sort = 'featured',
    bookmarkedIds = new Set()
  } = {}) {
    const trimmedQuery = query.trim();
    const hasQuery = Boolean(trimmedQuery);
    const activeConcepts = hasQuery ? this.findActiveConcepts(trimmedQuery) : [];

    let results = this.recipes.map(recipe => {
      let score = 0;
      let matchReasons = [];
      if (hasQuery) {
        const evaluation = this.scoreRecipe(recipe, trimmedQuery, activeConcepts);
        score = evaluation.score;
        matchReasons = evaluation.matchReasons;
      }
      return { recipe, score, matchReasons };
    });

    // Filter by search query if present
    if (hasQuery) {
      results = results.filter(r => r.score > 0);
    }

    // Filter by Category
    if (category !== 'all') {
      results = results.filter(r => r.recipe.category === category);
    }

    // Filter by Flavor / Prep Style
    if (flavor !== 'all') {
      results = results.filter(r => {
        if (r.recipe.prepStyle === flavor) return true;
        if (r.recipe.flavorProfile.includes(flavor)) return true;
        if (r.recipe.dietary.includes(flavor)) return true;
        return false;
      });
    }

    // Sort Results
    results.sort((a, b) => {
      // If bookmarked filter is active or bookmark sort
      if (sort === 'favorites') {
        const aFav = bookmarkedIds.has(a.recipe.id) ? 1 : 0;
        const bFav = bookmarkedIds.has(b.recipe.id) ? 1 : 0;
        if (aFav !== bFav) return bFav - aFav;
      }

      if (hasQuery && sort === 'featured') {
        return b.score - a.score || a.recipe.number - b.recipe.number;
      }

      switch (sort) {
        case 'az':
          return a.recipe.titleEnglish.localeCompare(b.recipe.titleEnglish);
        case 'quick': {
          const aTime = parseInt(a.recipe.prepTime) || 20;
          const bTime = parseInt(b.recipe.prepTime) || 20;
          return aTime - bTime;
        }
        case 'steps':
          return b.recipe.steps.length - a.recipe.steps.length;
        case 'featured':
        default:
          return a.recipe.number - b.recipe.number;
      }
    });

    return results;
  }
}
