/**
 * AMMA'S TABLE — MASTER APPLICATION CONTROLLER
 * Connects:
 * - Recipe Database & Pre-Compiled Catalog
 * - Intelligent Typo-Tolerant Search & Craving Engine
 * - 3D Living Cards & Golden Spice Ambient Canvas
 * - Heirloom Grimoire Storybook Modal
 * - Interactive Cook Mode & Kitchen Timer
 * - Dynamic Disney Lighting Themes
 */

import { MagicalFX } from './magical-fx.js';
import { RecipeSearchEngine } from './search.js';
import { CookModeController } from './cook-mode.js';

class AmmaApp {
  constructor() {
    this.recipes = [];
    this.state = {
      query: '',
      category: 'all',
      flavor: 'all',
      sort: 'featured',
      theme: localStorage.getItem('amma_theme') || 'golden-hour',
      isCompact: localStorage.getItem('amma_compact') === 'true',
      bookmarkedIds: new Set(JSON.parse(localStorage.getItem('amma_bookmarks') || '[]'))
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
      // Theme & Tools
      themeSelect: document.getElementById('themeSelect'),
      soundToggleBtn: document.getElementById('soundToggleBtn'),
      bookmarkFilterBtn: document.getElementById('bookmarkFilterBtn'),
      bookmarkCountBadge: document.getElementById('bookmarkCountBadge'),

      // Spice Dabba Oracle
      spinOracleBtn: document.getElementById('spinOracleBtn'),
      oracleResultWrap: document.getElementById('oracleResultWrap'),
      oracleDishThumb: document.getElementById('oracleDishThumb'),
      oracleDishTitle: document.getElementById('oracleDishTitle'),
      oracleDishNote: document.getElementById('oracleDishNote'),
      oracleOpenBtn: document.getElementById('oracleOpenBtn'),

      // Search & Filters
      searchInput: document.getElementById('searchInput'),
      clearSearchBtn: document.getElementById('clearSearchBtn'),
      searchModeBtns: document.querySelectorAll('.search-mode-btn'),
      searchHint: document.getElementById('searchHint'),
      categoryRibbon: document.getElementById('categoryRibbon'),
      flavorFiltersRow: document.getElementById('flavorFiltersRow'),
      sortSelect: document.getElementById('sortSelect'),
      densityToggleBtn: document.getElementById('densityToggleBtn'),

      // Results
      recipeGrid: document.getElementById('recipeGrid'),
      resultsSummary: document.getElementById('resultsSummary'),

      // Grimoire Modal
      grimoireBackdrop: document.getElementById('grimoireBackdrop'),
      grimoireCloseBtn: document.getElementById('grimoireCloseBtn'),
      grimoireTitleTelugu: document.getElementById('grimoireTitleTelugu'),
      grimoireTitleEnglish: document.getElementById('grimoireTitleEnglish'),
      grimoirePosterImg: document.getElementById('grimoirePosterImg'),
      grimoireWaxSealBtn: document.getElementById('grimoireWaxSealBtn'),
      grimoireChecklist: document.getElementById('grimoireChecklist'),
      grimoireStepsList: document.getElementById('grimoireStepsList'),
      grimoireReasonsList: document.getElementById('grimoireReasonsList'),
      grimoireTipsWrap: document.getElementById('grimoireTipsWrap'),
      grimoireTipsList: document.getElementById('grimoireTipsList'),
      grimoireNutritionNote: document.getElementById('grimoireNutritionNote'),
      grimoireTabBtns: document.querySelectorAll('.grimoire-tab-btn'),
      grimoireTabPanes: document.querySelectorAll('.grimoire-tab-pane'),
      startCookModeFromModalBtn: document.getElementById('startCookModeFromModalBtn'),
      scaleBtns: document.querySelectorAll('.scale-btn')
    };

    if (this.state.isCompact) {
      this.el.recipeGrid.classList.add('is-compact');
    }
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
     Data Loading
     -------------------------------------------------------------------------- */
  async loadCatalog() {
    try {
      const response = await fetch('./assets/data/recipes.json');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      this.recipes = await response.json();
      this.searchEngine.setRecipes(this.recipes);

      this.updateBookmarkBadge();
      this.renderCategoryRibbon();
      this.renderRecipes();
    } catch (err) {
      console.error('Failed to load recipe catalog:', err);
      this.el.resultsSummary.textContent = 'Unable to open Amma’s cookbook. Please serve from a local server.';
    }
  }

  /* --------------------------------------------------------------------------
     Bookmarks & Favorites
     -------------------------------------------------------------------------- */
  toggleBookmark(recipeId, buttonEl) {
    const has = this.state.bookmarkedIds.has(recipeId);
    if (has) {
      this.state.bookmarkedIds.delete(recipeId);
      buttonEl.classList.remove('is-bookmarked');
      this.fx.showToast('Removed from Amma’s Starred Dishes');
    } else {
      this.state.bookmarkedIds.add(recipeId);
      buttonEl.classList.add('is-bookmarked');
      this.fx.playStarChime();
      this.fx.showToast('★ Saved to Amma’s Starred Dishes!');
    }
    localStorage.setItem('amma_bookmarks', JSON.stringify(Array.from(this.state.bookmarkedIds)));
    this.updateBookmarkBadge();
  }

  updateBookmarkBadge() {
    const count = this.state.bookmarkedIds.size;
    if (this.el.bookmarkCountBadge) {
      this.el.bookmarkCountBadge.textContent = count;
      this.el.bookmarkCountBadge.style.display = count > 0 ? 'inline-block' : 'none';
    }
  }

  /* --------------------------------------------------------------------------
     The Magic Spice Dabba (Oracle)
     -------------------------------------------------------------------------- */
  spinSpiceBox() {
    if (!this.recipes.length) return;
    this.fx.playFairyChime();

    // Whimsical spin sound and animation
    const btn = this.el.spinOracleBtn;
    btn.style.transform = 'scale(0.95) rotate(360deg)';
    btn.disabled = true;

    setTimeout(() => {
      btn.style.transform = '';
      btn.disabled = false;

      // Pick a random recipe
      const picked = this.recipes[Math.floor(Math.random() * this.recipes.length)];
      this.el.oracleDishThumb.src = picked.assets.thumb;
      this.el.oracleDishThumb.alt = picked.titleEnglish;
      this.el.oracleDishTitle.textContent = `${picked.titleOriginal} — ${picked.titleEnglish}`;
      this.el.oracleDishNote.textContent = `Amma says: “${picked.storyNote}”`;
      this.el.oracleResultWrap.hidden = false;
      this.el.oracleOpenBtn.onclick = () => this.openGrimoire(picked);

      this.fx.playStarChime();
      this.fx.showToast(`✨ The Spice Dabba chose ${picked.titleEnglish}!`);
    }, 600);
  }

  /* --------------------------------------------------------------------------
     Category & Filter Ribbon
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
        chip.dataset.category = cat.id;
        chip.innerHTML = `<span>${cat.icon}</span> <span>${cat.label}</span> <span class="filter-count-badge">${counts[cat.id] || 0}</span>`;
        chip.onclick = () => {
          this.state.category = cat.id;
          this.renderCategoryRibbon();
          this.renderRecipes();
          this.fx.playPageFlip();
        };
        return chip;
      })
    );
  }

  /* --------------------------------------------------------------------------
     Recipe Cards Grid Rendering
     -------------------------------------------------------------------------- */
  renderRecipes() {
    const results = this.searchEngine.search({
      query: this.state.query,
      category: this.state.category,
      flavor: this.state.flavor,
      sort: this.state.sort,
      bookmarkedIds: this.state.bookmarkedIds
    });

    this.el.recipeGrid.replaceChildren();

    if (!results.length) {
      const emptyWrap = document.createElement('div');
      emptyWrap.className = 'empty-state-box';
      emptyWrap.style.gridColumn = '1 / -1';
      emptyWrap.style.textAlign = 'center';
      emptyWrap.style.padding = '60px 20px';
      emptyWrap.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 14px;">🪄</div>
        <h3 style="font-family: var(--font-story); font-size: 1.6rem; margin-bottom: 8px;">No Spells Found in Amma’s Pantry</h3>
        <p style="color: var(--color-ink-muted); max-width: 480px; margin: 0 auto 20px;">
          Try searching for “potato without much oil”, “roasted chutney”, or clear your filters to explore all recipes.
        </p>
        <button class="spin-oracle-btn" id="resetFiltersBtn" type="button">Reset All Filters ✦</button>
      `;
      emptyWrap.querySelector('#resetFiltersBtn').onclick = () => {
        this.resetAllFilters();
      };
      this.el.recipeGrid.appendChild(emptyWrap);
    } else {
      const frag = document.createDocumentFragment();
      results.forEach(({ recipe, matchReasons }, idx) => {
        const cardWrap = this.createCardElement(recipe, matchReasons, idx);
        frag.appendChild(cardWrap);
      });
      this.el.recipeGrid.appendChild(frag);
    }

    // Results summary line
    const total = results.length;
    const q = this.state.query.trim();
    if (q) {
      this.el.resultsSummary.textContent = `${total} ${total === 1 ? 'magical poster' : 'magical posters'} discovered for “${q}”`;
    } else if (this.state.category !== 'all') {
      this.el.resultsSummary.textContent = `${total} heirloom recipes in this collection`;
    } else {
      this.el.resultsSummary.textContent = `All ${total} illustrated Telugu family posters ready to explore`;
    }
  }

  createCardElement(recipe, matchReasons, index) {
    const wrap = document.createElement('article');
    wrap.className = 'card-3d-wrap';
    wrap.style.animationDelay = `${Math.min(index * 35, 300)}ms`;

    const isBookmarked = this.state.bookmarkedIds.has(recipe.id);

    wrap.innerHTML = `
      <div class="recipe-card-3d" tabindex="0" role="button" aria-label="Open recipe poster for ${recipe.titleEnglish}">
        <div class="card-foil-overlay"></div>
        
        <div class="card-poster-frame">
          <img 
            class="card-poster-img" 
            src="${recipe.assets.thumb}" 
            srcset="${recipe.assets.thumb} 768w, ${recipe.assets.webp} 1536w" 
            sizes="(max-width: 768px) 100vw, 400px" 
            alt="${recipe.titleEnglish} illustrated poster"
            loading="lazy"
            decoding="async"
          />
          <span class="card-badge-heirloom">${recipe.badge || 'Amma’s Classic'}</span>
          <button 
            class="card-bookmark-btn ${isBookmarked ? 'is-bookmarked' : ''}" 
            type="button" 
            title="Star recipe"
            aria-label="Star ${recipe.titleEnglish}"
          >★</button>
        </div>

        <div class="card-body-content">
          <p class="card-original-title">${recipe.titleOriginal}</p>
          <h3 class="card-english-title">${recipe.titleEnglish}</h3>
          <p class="card-story-snippet">${recipe.storyNote || recipe.reasons[0] || ''}</p>
          
          <div class="card-meta-ribbon">
            <span>⏱️ ${recipe.cookTime || '25 mins'}</span>
            <span>🍲 ${recipe.steps.length} steps</span>
            <span class="card-open-btn">Open Poster ↗</span>
          </div>
        </div>
      </div>
    `;

    // Attach 3D parallax tilt & foil reflection
    this.fx.attach3DTilt(wrap);

    // Click handler for card
    const card3d = wrap.querySelector('.recipe-card-3d');
    card3d.onclick = (e) => {
      if (e.target.closest('.card-bookmark-btn')) return;
      this.openGrimoire(recipe);
    };

    // Card keyboard enter/space
    card3d.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.openGrimoire(recipe);
      }
    };

    // Bookmark button handler
    const bookmarkBtn = wrap.querySelector('.card-bookmark-btn');
    bookmarkBtn.onclick = (e) => {
      e.stopPropagation();
      this.toggleBookmark(recipe.id, bookmarkBtn);
    };

    return wrap;
  }

  /* --------------------------------------------------------------------------
     The Heirloom Grimoire Modal (Full Recipe Viewer)
     -------------------------------------------------------------------------- */
  openGrimoire(recipe) {
    this.activeGrimoireRecipe = recipe;
    this.fx.playFairyChime();

    // Populate Titles & Poster
    this.el.grimoireTitleTelugu.textContent = recipe.titleOriginal;
    this.el.grimoireTitleEnglish.textContent = recipe.titleEnglish;
    this.el.grimoirePosterImg.src = recipe.assets.webp;
    this.el.grimoirePosterImg.alt = `${recipe.titleEnglish} full illustrated poster`;

    // Poster Download Button (links to full-res original 1536x1024 PNG)
    this.el.grimoireWaxSealBtn.href = recipe.assets.png;
    this.el.grimoireWaxSealBtn.download = `${recipe.slug}.png`;

    // Interactive Checklist
    this.renderChecklist(recipe, 1);

    // Process Steps
    this.el.grimoireStepsList.replaceChildren(
      ...recipe.steps.map((step, idx) => {
        const li = document.createElement('li');
        li.style.marginBottom = '16px';
        li.innerHTML = `<strong>Step ${idx + 1}:</strong> ${step}`;
        return li;
      })
    );

    // Reasons / Notes
    this.el.grimoireReasonsList.replaceChildren(
      ...recipe.reasons.map(r => {
        const li = document.createElement('li');
        li.textContent = r;
        return li;
      })
    );

    // Tips
    if (recipe.tips && recipe.tips.length) {
      this.el.grimoireTipsWrap.hidden = false;
      this.el.grimoireTipsList.replaceChildren(
        ...recipe.tips.map(tip => {
          const li = document.createElement('li');
          li.textContent = tip;
          return li;
        })
      );
    } else {
      this.el.grimoireTipsWrap.hidden = true;
    }

    // Nutrition
    this.el.grimoireNutritionNote.textContent = recipe.nutrition || 'Wholesome homestyle preparation.';

    // Reset tabs to Tab 1 (Poster Art)
    this.switchGrimoireTab('posterTab');

    // Show modal
    this.el.grimoireBackdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  closeGrimoire() {
    this.el.grimoireBackdrop.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  renderChecklist(recipe, multiplier) {
    const allItems = recipe.ingredientGroups.flatMap(g => g.items);
    this.el.grimoireChecklist.replaceChildren(
      ...allItems.map(item => {
        const div = document.createElement('div');
        div.className = 'checklist-item';
        div.innerHTML = `
          <span class="checklist-box">✓</span>
          <span class="checklist-name">${item}</span>
        `;
        div.onclick = () => {
          div.classList.toggle('is-checked');
          this.fx.playPageFlip();
        };
        return div;
      })
    );
  }

  switchGrimoireTab(tabId) {
    this.el.grimoireTabBtns.forEach(btn => {
      const isTarget = btn.dataset.tab === tabId;
      btn.classList.toggle('is-active', isTarget);
    });
    this.el.grimoireTabPanes.forEach(pane => {
      pane.classList.toggle('is-active', pane.id === tabId);
    });
    this.fx.playPageFlip();
  }

  resetAllFilters() {
    this.state.query = '';
    this.state.category = 'all';
    this.state.flavor = 'all';
    this.state.sort = 'featured';
    if (this.el.searchInput) this.el.searchInput.value = '';
    if (this.el.clearSearchBtn) this.el.clearSearchBtn.hidden = true;
    if (this.el.sortSelect) this.el.sortSelect.value = 'featured';
    this.renderCategoryRibbon();
    this.renderRecipes();
  }

  /* --------------------------------------------------------------------------
     Event Listeners
     -------------------------------------------------------------------------- */
  attachEventListeners() {
    // Theme Switcher
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

    // Bookmark Filter Toggle
    if (this.el.bookmarkFilterBtn) {
      this.el.bookmarkFilterBtn.addEventListener('click', () => {
        if (this.state.sort === 'favorites') {
          this.state.sort = 'featured';
          this.el.bookmarkFilterBtn.classList.remove('is-active');
        } else {
          this.state.sort = 'favorites';
          this.el.bookmarkFilterBtn.classList.add('is-active');
        }
        this.renderRecipes();
        this.fx.playStarChime();
      });
    }

    // Spice Dabba Oracle
    if (this.el.spinOracleBtn) {
      this.el.spinOracleBtn.addEventListener('click', () => this.spinSpiceBox());
    }

    // Craving Spell Chips
    document.querySelectorAll('[data-craving]').forEach(chip => {
      chip.addEventListener('click', () => {
        const query = chip.dataset.craving;
        this.state.query = query;
        this.el.searchInput.value = query;
        this.el.clearSearchBtn.hidden = false;
        this.renderRecipes();
        this.fx.playFairyChime();
        document.getElementById('gallerySection')?.scrollIntoView({ behavior: 'smooth' });
      });
    });

    // Search Input
    if (this.el.searchInput) {
      this.el.searchInput.addEventListener('input', () => {
        this.state.query = this.el.searchInput.value;
        this.el.clearSearchBtn.hidden = !this.state.query.trim();
        this.renderRecipes();
      });
    }

    if (this.el.clearSearchBtn) {
      this.el.clearSearchBtn.addEventListener('click', () => {
        this.el.searchInput.value = '';
        this.state.query = '';
        this.el.clearSearchBtn.hidden = true;
        this.renderRecipes();
        this.el.searchInput.focus();
      });
    }

    // Flavor Tag Buttons
    document.querySelectorAll('[data-flavor]').forEach(btn => {
      btn.addEventListener('click', () => {
        const f = btn.dataset.flavor;
        this.state.flavor = this.state.flavor === f ? 'all' : f;
        document.querySelectorAll('[data-flavor]').forEach(b => {
          b.classList.toggle('is-active', b.dataset.flavor === this.state.flavor);
        });
        this.renderRecipes();
        this.fx.playPageFlip();
      });
    });

    // Sort Dropdown
    if (this.el.sortSelect) {
      this.el.sortSelect.addEventListener('change', () => {
        this.state.sort = this.el.sortSelect.value;
        this.renderRecipes();
      });
    }

    // Density Toggle (Spacious / Compact)
    if (this.el.densityToggleBtn) {
      this.el.densityToggleBtn.addEventListener('click', () => {
        this.state.isCompact = !this.state.isCompact;
        localStorage.setItem('amma_compact', String(this.state.isCompact));
        this.el.recipeGrid.classList.toggle('is-compact', this.state.isCompact);
        this.el.densityToggleBtn.title = this.state.isCompact ? 'Spacious view' : 'Compact view';
        this.fx.playPageFlip();
      });
    }

    // Grimoire Modal Tabs
    this.el.grimoireTabBtns.forEach(btn => {
      btn.addEventListener('click', () => this.switchGrimoireTab(btn.dataset.tab));
    });

    // Grimoire Close
    if (this.el.grimoireCloseBtn) {
      this.el.grimoireCloseBtn.addEventListener('click', () => this.closeGrimoire());
    }

    if (this.el.grimoireBackdrop) {
      this.el.grimoireBackdrop.addEventListener('click', (e) => {
        if (e.target === this.el.grimoireBackdrop) this.closeGrimoire();
      });
    }

    // Launch Cook Mode from Grimoire
    if (this.el.startCookModeFromModalBtn) {
      this.el.startCookModeFromModalBtn.addEventListener('click', () => {
        if (this.activeGrimoireRecipe) {
          this.closeGrimoire();
          this.cookMode.open(this.activeGrimoireRecipe);
        }
      });
    }

    // Potion / Servings Scaler Buttons (1x, 2x, 4x)
    this.el.scaleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.el.scaleBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const factor = Number(btn.dataset.scale || 1);
        if (this.activeGrimoireRecipe) {
          this.renderChecklist(this.activeGrimoireRecipe, factor);
        }
      });
    });

    // Global Keybindings
    document.addEventListener('keydown', (e) => {
      const activeTag = document.activeElement?.tagName;
      if (e.key === '/' && activeTag !== 'INPUT' && activeTag !== 'TEXTAREA') {
        e.preventDefault();
        this.el.searchInput?.focus();
      }
      if (e.key === 'Escape' && this.el.grimoireBackdrop?.classList.contains('is-open')) {
        this.closeGrimoire();
      }
    });
  }
}

// Bootstrap once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new AmmaApp();
});
