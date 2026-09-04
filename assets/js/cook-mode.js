/**
 * AMMA'S TABLE — INTERACTIVE COOK MODE & KITCHEN ALCHEMY
 * Features:
 * - Full-screen kitchen counter display with large readable typography
 * - Step-by-step progress tracking
 * - Interactive Kitchen Simmer Timer with Web Audio Bell
 * - Ingredient Checklist with strike-through and persistence
 * - Potion / Servings Scaler (1x, 2x, 4x)
 */

export class CookModeController {
  constructor(magicalFX) {
    this.fx = magicalFX;
    this.activeRecipe = null;
    this.currentStep = 0;
    this.portionMultiplier = 1;

    // Timer state
    this.timerSeconds = 0;
    this.timerInterval = null;
    this.isTimerRunning = false;

    this.initDOM();
  }

  initDOM() {
    this.overlay = document.getElementById('cookModeOverlay');
    this.stepNumberEl = document.getElementById('cookStepNum');
    this.stepTextEl = document.getElementById('cookStepText');
    this.progressBar = document.getElementById('cookProgressBar');
    this.prevBtn = document.getElementById('cookPrevBtn');
    this.nextBtn = document.getElementById('cookNextBtn');
    this.exitBtn = document.getElementById('cookExitBtn');
    this.timerDisplay = document.getElementById('cookTimerDisplay');
    this.timerToggleBtn = document.getElementById('cookTimerToggleBtn');
    this.timerResetBtn = document.getElementById('cookTimerResetBtn');
    this.timerAdd1Btn = document.getElementById('cookTimerAdd1Btn');
    this.timerAdd5Btn = document.getElementById('cookTimerAdd5Btn');

    if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prevStep());
    if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.nextStep());
    if (this.exitBtn) this.exitBtn.addEventListener('click', () => this.close());

    if (this.timerToggleBtn) this.timerToggleBtn.addEventListener('click', () => this.toggleTimer());
    if (this.timerResetBtn) this.timerResetBtn.addEventListener('click', () => this.resetTimer());
    if (this.timerAdd1Btn) this.timerAdd1Btn.addEventListener('click', () => this.addTimerSeconds(60));
    if (this.timerAdd5Btn) this.timerAdd5Btn.addEventListener('click', () => this.addTimerSeconds(300));

    // Keyboard navigation in Cook Mode
    document.addEventListener('keydown', (e) => {
      if (!this.overlay || !this.overlay.classList.contains('is-active')) return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        this.nextStep();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.prevStep();
      } else if (e.key === 'Escape') {
        this.close();
      }
    });
  }

  open(recipe) {
    this.activeRecipe = recipe;
    this.currentStep = 0;
    this.overlay.classList.add('is-active');
    document.body.style.overflow = 'hidden';
    this.fx.playFairyChime();
    this.renderStep();
  }

  close() {
    this.overlay.classList.remove('is-active');
    document.body.style.overflow = '';
    this.pauseTimer();
  }

  renderStep() {
    if (!this.activeRecipe || !this.activeRecipe.steps.length) return;

    const total = this.activeRecipe.steps.length;
    this.stepNumberEl.textContent = `✦ STEP ${this.currentStep + 1} OF ${total} ✦`;
    this.stepTextEl.textContent = this.activeRecipe.steps[this.currentStep];

    const progress = ((this.currentStep + 1) / total) * 100;
    this.progressBar.style.width = `${progress}%`;

    this.prevBtn.disabled = this.currentStep === 0;
    this.nextBtn.textContent = this.currentStep === total - 1 ? 'Finish Feast 🌟' : 'Next Step →';
  }

  nextStep() {
    if (!this.activeRecipe) return;
    if (this.currentStep < this.activeRecipe.steps.length - 1) {
      this.currentStep++;
      this.fx.playPageFlip();
      this.renderStep();
    } else {
      this.fx.playStarChime();
      this.fx.showToast('🎉 Feast Prepared with Amma’s Love!');
      this.close();
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.fx.playPageFlip();
      this.renderStep();
    }
  }

  /* --------------------------------------------------------------------------
     Kitchen Simmer Timer
     -------------------------------------------------------------------------- */
  formatTimer(seconds) {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }

  updateTimerUI() {
    if (this.timerDisplay) {
      this.timerDisplay.textContent = this.formatTimer(this.timerSeconds);
    }
  }

  addTimerSeconds(sec) {
    this.timerSeconds += sec;
    this.updateTimerUI();
    this.fx.playPageFlip();
  }

  toggleTimer() {
    if (this.isTimerRunning) {
      this.pauseTimer();
    } else {
      this.startTimer();
    }
  }

  startTimer() {
    if (this.timerSeconds <= 0) this.timerSeconds = 180; // default 3 mins
    this.isTimerRunning = true;
    if (this.timerToggleBtn) this.timerToggleBtn.textContent = 'Pause ⏸️';

    this.timerInterval = setInterval(() => {
      if (this.timerSeconds > 0) {
        this.timerSeconds--;
        this.updateTimerUI();
      } else {
        this.pauseTimer();
        this.fx.playTimerBell();
        this.fx.showToast('🔔 Amma’s Simmer Timer Finished!');
      }
    }, 1000);
  }

  pauseTimer() {
    this.isTimerRunning = false;
    clearInterval(this.timerInterval);
    if (this.timerToggleBtn) this.timerToggleBtn.textContent = 'Start ▶️';
  }

  resetTimer() {
    this.pauseTimer();
    this.timerSeconds = 0;
    this.updateTimerUI();
  }
}
