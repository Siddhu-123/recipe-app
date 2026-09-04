/**
 * AMMA'S TABLE — FULL-SPACE LIVING CATALOG & STAGE CONTROLLER
 * Connects:
 * - Recipe Database & Pre-Compiled Catalog
 * - Intelligent Typo-Tolerant Search & Craving Engine
 * - Illuminated Catalog Folio (Left) & Grand Recipe Stage (Right)
 * - Mobile/Tablet Responsive View Management
 * - Interactive Cook Mode & Simmer Timer
 * - Procedural Web Audio Soundscape
 */

import { MagicalFX } from './magical-fx.js';
import { RecipeSearchEngine } from './search.js';
import { CookModeController } from './cook-mode.js';

class AmmaApp {
  constructor() {
    this.recipes = [];
    this.activeRecipe = null;
    this.portionMultiplier = 1;
    this.state = {
      query: '',
      category: 'all',
      flavor: 'all',
      sort: 'featured',
      theme: localStorage.getItem('amma_theme') || 'golden-hour',
      bookmarkedIds: new Set(JSON.parse(localStorage.getItem('amma_bookmarks') || '[]')),
      mobileView: 'catalog' // 'catalog' or 'stage'
    };

    this.fx = new MagicalFX();
    this.searchEngine = new RecipeSearchEngine();
    this.cookMode = new CookModeController(this.fx);

    this.initElements();
    this.applyTheme(this.state.theme);
    this.attachEventListeners();
    this.loadCatalog();
  }

  initElements() {
    this.el = {
      // Header controls
      themeSelect: document.getElementById('themeSelect'),
      soundToggleBtn: document.getElementById('soundToggleBtn'),
      bookmarkFilterBtn: document.getElementById('bookmarkFilterBtn'),
      bookmarkCountBadge: document.getElementById('bookmarkCountBadge'),

      // Mobile View Tabs
      mobileViewTabs: document.getElementById('mobileViewTabs'),
      mobileCatalogTabBtn: document.getElementById('mobileCatalogTabBtn'),
      mobileStageTabBtn: document.getElementById('mobileStageTabBtn'),
      mobileBackBtn: document.getElementById('mobileBackBtn'),

      // Sidebar controls
      catalogSidebar: document.getElementById('catalogSidebar'),
      searchInput: document.getElementById('catalogSearchInput'),
      clearSearchBtn: document.getElementById('catalogClearSearchBtn'),
      categoryRibbon: document.getElementById('catalogCategoryRibbon'),
      spinOracleBtn: document.getElementById('spinOracleBtn'),
      catalogSummary: document.getElementById('catalogListSummary'),
      catalogRecipeList: document.getElementById('catalogRecipeList'),

      // Grand Stage elements
      recipeStage: document.getElementById('recipeStage'),
      stageTeluguTitle: document.getElementById('stageTeluguTitle'),
      stageEnglishTitle: document.getElementById('stageEnglishTitle'),
      stageStoryQuote: document.getElementById('stageStoryQuote'),
      stagePosterImg: document.getElementById('stagePosterImg'),
      stageWaxSealBtn: document.getElementById('stageWaxSealBtn'),
      stageBookmarkBtn: document.getElementById('stageBookmarkBtn'),
      stageCookModeBtn: document.getElementById('stageCookModeBtn'),
      stageTabBtns: document.querySelectorAll('.stage-tab-btn'),
      stagePanes: document.querySelectorAll('.stage-pane'),

      // Stage Tab 2 (Alchemy)
      stageChecklist: document.getElementById('stageChecklist'),
      scaleBtns: document.querySelectorAll('.scale-btn'),

      // Stage Tab 3 (Method)
      stageStepsContainer: document.getElementById('stageStepsContainer'),

      // Stage Tab 4 (Secrets)
      stageReasonsList: document.getElementById('stageReasonsList'),
      stageTipsWrap: document.getElementById('stageTipsWrap'),
      stageTipsList: document.getElementById('stageTipsList'),
      stageNutritionNote: document.getElementById('stageNutritionNote')
    };
  }

  /* --------------------------------------------------------------------------
     Theme Management
     -------------------------------------------------------------------------- */
  applyTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    this.state.theme = themeName;
    localStorage.setItem('amma_theme', themeName);
    if (this.el.themeSelect) this.el.themeSelect.value = themeName;
  }

  /* --------------------------------------------------------------------------
     Data Loading & Startup
     -------------------------------------------------------------------------- */
  async loadCatalog() {
    try {
      const response = await fetch('./assets/data/recipes.json');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      this.recipes = await response.json();
      this.searchEngine.setRecipes(this.recipes);

      this.updateBookmarkBadge();
      this.renderCategoryRibbon();

      // Check URL hash for direct recipe link (e.g. #gutti-vankaya)
      const hashId = window.location.hash.replace('#', '').trim();
      const initialRecipe = this.recipes.find(r => r.id === hashId || r.slug === hashId) || this.recipes[0];
      
      this.setActiveRecipe(initialRecipe, false);
      this.renderCatalogList();
    } catch (err) {
      console.error('Failed to load recipe catalog:', err);
      this.el.catalogSummary.textContent = 'Unable to load recipes from local server.';
    }
  }

  /* --------------------------------------------------------------------------
     Active Recipe Selection & Grand Stage Rendering
     -------------------------------------------------------------------------- */
  setActiveRecipe(recipe, switchMobileView = true) {
    if (!recipe) return;
    this.activeRecipe = recipe;
    this.portionMultiplier = 1;

    // Update URL hash smoothly
    if (window.history.replaceState) {
      window.history.replaceState(null, null, `#${recipe.slug}`);
    }

    // Render Stage
    this.renderActiveRecipeStage();

    // Update active highlight in catalog list
    document.querySelectorAll('.catalog-item').forEach(item => {
      const isTarget = item.dataset.recipeId === recipe.id;
      item.classList.toggle('is-active', isTarget);
      if (isTarget) {
        item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });

    // Update Stage Bookmark Star
    const isBookmarked = this.state.bookmarkedIds.has(recipe.id);
    if (this.el.stageBookmarkBtn) {
      this.el.stageBookmarkBtn.classList.toggle('is-bookmarked', isBookmarked);
      this.el.stageBookmarkBtn.title = isBookmarked ? 'Starred in Amma’s Favorites' : 'Star this recipe';
    }

    // Switch mobile view if requested
    if (switchMobileView && window.innerWidth <= 900) {
      this.setMobileView('stage');
    }
  }

  renderActiveRecipeStage() {
    const r = this.activeRecipe;
    if (!r) return;

    // Header Titles & Story
    this.el.stageTeluguTitle.textContent = r.titleOriginal;
    this.el.stageEnglishTitle.textContent = r.titleEnglish;
    this.el.stageStoryQuote.textContent = r.storyNote ? `Amma says: “${r.storyNote}”` : `A cherished heirloom from Amma’s kitchen.`;

    // Master Poster Frame
    this.el.stagePosterImg.src = r.assets.webp;
    this.el.stagePosterImg.alt = `${r.titleEnglish} master illustrated poster`;

    // Wax Seal Poster Download (Original 1536x1024 PNG)
    this.el.stageWaxSealBtn.href = r.assets.png;
    this.el.stageWaxSealBtn.download = `${r.slug}.png`;

    // Tab 2: Ingredients Checklist
    this.renderChecklist();

    // Tab 3: Numbered Method Steps
    this.el.stageStepsContainer.replaceChildren(
      ...r.steps.map((step, idx) => {
        const card = document.createElement('div');
        card.className = 'method-step-card';
        card.innerHTML = `
          <div class="method-step-badge">${idx + 1}</div>
          <div class="method-step-text">${step}</div>
        `;
        return card;
      })
    );

    // Tab 4: Secrets & Nutrition
    this.el.stageReasonsList.replaceChildren(
      ...r.reasons.map(reason => {
        const li = document.createElement('li');
        li.textContent = reason;
        return li;
      })
    );

    if (r.tips && r.tips.length) {
      this.el.stageTipsWrap.hidden = false;
      this.el.stageTipsList.replaceChildren(
        ...r.tips.map(tip => {
          const li = document.createElement('li');
          li.textContent = tip;
          return li;
        })
      );
    } else {
      this.el.stageTipsWrap.hidden = true;
    }

    this.el.stageNutritionNote.textContent = r.nutrition || 'Wholesome homestyle preparation.';
  }

  renderChecklist() {
    const r = this.activeRecipe;
    if (!r) return;

    const allItems = r.ingredientGroups.flatMap(g => g.items);
    this.el.stageChecklist.replaceChildren(
      ...allItems.map(item => {
        const div = document.createElement('div');
        div.className = 'checklist-item';
        div.innerHTML = `
          <span class="checklist-box">✓</span>
          <span class="checklist-text">${item}</span>
        `;
        div.onclick = () => {
          div.classList.toggle('is-checked');
          this.fx.playPageFlip();
        };
        return div;
      })
    );
  }

  /* --------------------------------------------------------------------------
     Sidebar Catalog List Rendering
     -------------------------------------------------------------------------- */
  renderCategoryRibbon() {
    const categories = [
      { id: 'all', label: 'All Treasures', icon: '🍲' },
      { id: 'brinjal', label: 'Brinjal', icon: '🍆' },
      { id: 'potato', label: 'Potato', icon: '🥔' },
      { id: 'plantain', label: 'Plantain', icon: '🍌' },
      { id: 'taro', label: 'Taro', icon: '🥔' },
      { id: 'tomato', label: 'Tomato', icon: '🍅' },
      { id: 'rice', label: 'Rice', icon: '🍚' }
    ];

    const counts = { all: this.recipes.length };
    this.recipes.forEach(r => {
      counts[r.category] = (counts[r.category] || 0) + 1;
    });

    this.el.categoryRibbon.replaceChildren(
      ...categories.map(cat => {
        const chip = document.createElement('button');
        chip.className = `filter-chip${this.state.category === cat.id ? ' is-active' : ''}`;
        chip.type = 'button';
        chip.innerHTML = `<span>${cat.icon}</span> <span>${cat.label}</span> <span class="filter-count-badge">${counts[cat.id] || 0}</span>`;
        chip.onclick = () => {
          this.state.category = cat.id;
          this.renderCategoryRibbon();
          this.renderCatalogList();
          this.fx.playPageFlip();
        };
        return chip;
      })
    );
  }

  renderCatalogList() {
    const results = this.searchEngine.search({
      query: this.state.query,
      category: this.state.category,
      flavor: this.state.flavor,
      sort: this.state.sort,
      bookmarkedIds: this.state.bookmarkedIds
    });

    this.el.catalogRecipeList.replaceChildren();

    if (!results.length) {
      const empty = document.createElement('div');
      empty.style.padding = '30px 16px';
      empty.style.textAlign = 'center';
      empty.innerHTML = `
        <div style="font-size: 2.2rem; margin-bottom: 8px;">🪄</div>
        <p style="font-weight: 600; color: var(--color-ink-primary);">No recipes found in Amma’s Folio</p>
        <p style="font-size: 0.82rem; color: var(--color-ink-muted); margin-bottom: 12px;">Try clearing filters or search terms.</p>
        <button id="catalogResetBtn" class="spin-oracle-btn" type="button">Reset Search ✦</button>
      `;
      empty.querySelector('#catalogResetBtn').onclick = () => this.resetFilters();
      this.el.catalogRecipeList.appendChild(empty);
      this.el.catalogSummary.textContent = `0 recipes found`;
      return;
    }

    const frag = document.createDocumentFragment();
    results.forEach(({ recipe }) => {
      const isActive = this.activeRecipe && this.activeRecipe.id === recipe.id;
      const isBookmarked = this.state.bookmarkedIds.has(recipe.id);

      const item = document.createElement('article');
      item.className = `catalog-item${isActive ? ' is-active' : ''}`;
      item.dataset.recipeId = recipe.id;
      item.tabIndex = 0;
      item.setAttribute('role', 'button');
      item.setAttribute('aria-label', `Select ${recipe.titleEnglish}`);

      item.innerHTML = `
        <div class="catalog-item-thumb-wrap">
          <img class="catalog-item-thumb" src="${recipe.assets.thumb}" alt="${recipe.titleEnglish}" loading="lazy" decoding="async" />
        </div>
        <div class="catalog-item-info">
          <p class="catalog-item-telugu">${recipe.titleOriginal}</p>
          <h4 class="catalog-item-english">${recipe.titleEnglish}</h4>
          <div class="catalog-item-meta">
            <span class="catalog-item-badge">${recipe.badge || 'Amma’s Classic'}</span>
            <span>⏱️ ${recipe.cookTime || '25m'}</span>
          </div>
        </div>
        <button class="catalog-item-star-btn ${isBookmarked ? 'is-bookmarked' : ''}" type="button" aria-label="Star recipe">★</button>
      `;

      item.onclick = (e) => {
        if (e.target.closest('.catalog-item-star-btn')) return;
        this.setActiveRecipe(recipe, true);
        this.fx.playFairyChime();
      };

      item.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.setActiveRecipe(recipe, true);
          this.fx.playFairyChime();
        }
      };

      const starBtn = item.querySelector('.catalog-item-star-btn');
      starBtn.onclick = (e) => {
        e.stopPropagation();
        this.toggleBookmark(recipe.id, starBtn);
      };

      frag.appendChild(item);
    });

    this.el.catalogRecipeList.appendChild(frag);

    const total = results.length;
    const q = this.state.query.trim();
    if (q) {
      this.el.catalogSummary.textContent = `${total} ${total === 1 ? 'dish matches' : 'dishes match'} “${q}”`;
    } else {
      this.el.catalogSummary.textContent = `Showing ${total} heirloom recipes`;
    }

    // If currently active recipe is not in results, select the first matching result
    const hasActive = results.some(r => this.activeRecipe && r.recipe.id === this.activeRecipe.id);
    if (!hasActive && results.length > 0) {
      this.setActiveRecipe(results[0].recipe, false);
    }
  }

  /* --------------------------------------------------------------------------
     The Magic Spice Dabba (Oracle)
     -------------------------------------------------------------------------- */
  spinSpiceBox() {
    if (!this.recipes.length) return;
    this.fx.playFairyChime();

    const btn = this.el.spinOracleBtn;
    btn.style.transform = 'scale(0.92) rotate(360deg)';
    btn.disabled = true;

    setTimeout(() => {
      btn.style.transform = '';
      btn.disabled = false;

      // Pick a random recipe
      const picked = this.recipes[Math.floor(Math.random() * this.recipes.length)];
      this.setActiveRecipe(picked, true);

      this.fx.playStarChime();
      this.fx.showToast(`✨ Amma’s Spice Dabba selected ${picked.titleEnglish}!`);
    }, 500);
  }

  /* --------------------------------------------------------------------------
     Bookmarks / Favorites
     -------------------------------------------------------------------------- */
  toggleBookmark(recipeId, buttonEl) {
    const has = this.state.bookmarkedIds.has(recipeId);
    if (has) {
      this.state.bookmarkedIds.delete(recipeId);
      if (buttonEl) buttonEl.classList.remove('is-bookmarked');
      this.fx.showToast('Removed from Starred Recipes');
    } else {
      this.state.bookmarkedIds.add(recipeId);
      if (buttonEl) buttonEl.classList.add('is-bookmarked');
      this.fx.playStarChime();
      this.fx.showToast('★ Saved to Amma’s Starred Dishes!');
    }
    localStorage.setItem('amma_bookmarks', JSON.stringify(Array.from(this.state.bookmarkedIds)));
    this.updateBookmarkBadge();
    
    // Refresh Stage bookmark star if active recipe
    if (this.activeRecipe && this.activeRecipe.id === recipeId && this.el.stageBookmarkBtn) {
      this.el.stageBookmarkBtn.classList.toggle('is-bookmarked', !has);
    }
  }

  updateBookmarkBadge() {
    const count = this.state.bookmarkedIds.size;
    if (this.el.bookmarkCountBadge) {
      this.el.bookmarkCountBadge.textContent = count;
      this.el.bookmarkCountBadge.style.display = count > 0 ? 'inline-block' : 'none';
    }
  }

  /* --------------------------------------------------------------------------
     Mobile View Switcher (Catalog vs Recipe Stage)
     -------------------------------------------------------------------------- */
  setMobileView(viewName) {
    this.state.mobileView = viewName;
    if (this.el.mobileCatalogTabBtn) {
      this.el.mobileCatalogTabBtn.classList.toggle('is-active', viewName === 'catalog');
    }
    if (this.el.mobileStageTabBtn) {
      this.el.mobileStageTabBtn.classList.toggle('is-active', viewName === 'stage');
    }

    if (viewName === 'catalog') {
      this.el.catalogSidebar.classList.remove('is-hidden-mobile');
      this.el.recipeStage.classList.add('is-hidden-mobile');
    } else {
      this.el.catalogSidebar.classList.add('is-hidden-mobile');
      this.el.recipeStage.classList.remove('is-hidden-mobile');
    }
  }

  switchStageTab(tabId) {
    this.el.stageTabBtns.forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.tab === tabId);
    });
    this.el.stagePanes.forEach(pane => {
      pane.classList.toggle('is-active', pane.id === tabId);
    });
    this.fx.playPageFlip();
  }

  resetFilters() {
    this.state.query = '';
    this.state.category = 'all';
    this.state.flavor = 'all';
    this.state.sort = 'featured';
    if (this.el.searchInput) this.el.searchInput.value = '';
    if (this.el.clearSearchBtn) this.el.clearSearchBtn.hidden = true;
    this.renderCategoryRibbon();
    this.renderCatalogList();
  }

  /* --------------------------------------------------------------------------
     Event Listeners
     -------------------------------------------------------------------------- */
  attachEventListeners() {
    // Theme Select
    if (this.el.themeSelect) {
      this.el.themeSelect.addEventListener('change', () => {
        this.applyTheme(this.el.themeSelect.value);
        this.fx.playPageFlip();
      });
    }

    // Sound Toggle
    if (this.el.soundToggleBtn) {
      this.el.soundToggleBtn.addEventListener('click', () => {
        this.fx.toggleSound();
      });
    }

    // Starred Dish Filter Toggle
    if (this.el.bookmarkFilterBtn) {
      this.el.bookmarkFilterBtn.addEventListener('click', () => {
        if (this.state.sort === 'favorites') {
          this.state.sort = 'featured';
          this.el.bookmarkFilterBtn.classList.remove('is-active');
        } else {
          this.state.sort = 'favorites';
          this.el.bookmarkFilterBtn.classList.add('is-active');
        }
        this.renderCatalogList();
        this.fx.playStarChime();
      });
    }

    // Mobile View Tab Buttons
    if (this.el.mobileCatalogTabBtn) {
      this.el.mobileCatalogTabBtn.addEventListener('click', () => this.setMobileView('catalog'));
    }
    if (this.el.mobileStageTabBtn) {
      this.el.mobileStageTabBtn.addEventListener('click', () => this.setMobileView('stage'));
    }
    if (this.el.mobileBackBtn) {
      this.el.mobileBackBtn.addEventListener('click', () => this.setMobileView('catalog'));
    }

    // Search Input
    if (this.el.searchInput) {
      this.el.searchInput.addEventListener('input', () => {
        this.state.query = this.el.searchInput.value;
        this.el.clearSearchBtn.hidden = !this.state.query.trim();
        this.renderCatalogList();
      });
    }

    if (this.el.clearSearchBtn) {
      this.el.clearSearchBtn.addEventListener('click', () => {
        this.el.searchInput.value = '';
        this.state.query = '';
        this.el.clearSearchBtn.hidden = true;
        this.renderCatalogList();
        this.el.searchInput.focus();
      });
    }

    // Craving Spell Buttons
    document.querySelectorAll('[data-craving]').forEach(chip => {
      chip.addEventListener('click', () => {
        const query = chip.dataset.craving;
        this.state.query = query;
        this.el.searchInput.value = query;
        this.el.clearSearchBtn.hidden = false;
        this.renderCatalogList();
        this.fx.playFairyChime();
      });
    });

    // Spin Spice Box
    if (this.el.spinOracleBtn) {
      this.el.spinOracleBtn.addEventListener('click', () => this.spinSpiceBox());
    }

    // Stage Tabs
    this.el.stageTabBtns.forEach(btn => {
      btn.addEventListener('click', () => this.switchStageTab(btn.dataset.tab));
    });

    // Stage Bookmark Button
    if (this.el.stageBookmarkBtn) {
      this.el.stageBookmarkBtn.addEventListener('click', () => {
        if (this.activeRecipe) {
          this.toggleBookmark(this.activeRecipe.id, this.el.stageBookmarkBtn);
          this.renderCatalogList();
        }
      });
    }

    // Stage Cook Mode Launcher
    if (this.el.stageCookModeBtn) {
      this.el.stageCookModeBtn.addEventListener('click', () => {
        if (this.activeRecipe) {
          this.cookMode.open(this.activeRecipe);
        }
      });
    }

    // Potion / Servings Scaler Buttons
    this.el.scaleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.el.scaleBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        this.portionMultiplier = Number(btn.dataset.scale || 1);
        this.renderChecklist();
        this.fx.playPageFlip();
      });
    });

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      const activeTag = document.activeElement?.tagName;
      if (e.key === '/' && activeTag !== 'INPUT' && activeTag !== 'TEXTAREA') {
        e.preventDefault();
        this.el.searchInput?.focus();
      }
    });
  }
}

// Bootstrap once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new AmmaApp();
});
