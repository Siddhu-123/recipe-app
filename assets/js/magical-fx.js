/**
 * AMMA'S TABLE — MAGICAL EFFECTS & PROCEDURAL AUDIO ENGINE
 * Handles:
 * 1. 60fps Golden Spice Dust Canvas Particles
 * 2. 3D Card Parallax Tilt & Foil Specular Lighting
 * 3. Browser-Synthesized Web Audio SFX (Zero External MP3s!)
 * 4. Toast Notifications
 */

export class MagicalFX {
  constructor() {
    this.soundEnabled = localStorage.getItem('amma_magic_sound') === 'true';
    this.audioCtx = null;
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.animId = null;
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.initCanvas();
    this.initSoundToggle();
  }

  /* --------------------------------------------------------------------------
     1. Ambient Golden Spice Dust Canvas
     -------------------------------------------------------------------------- */
  initCanvas() {
    this.canvas = document.getElementById('ambientCanvas');
    if (!this.canvas || this.isReducedMotion) return;

    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();

    window.addEventListener('resize', () => this.resizeCanvas());

    // Spawn initial spice dust specks
    const particleCount = Math.min(window.innerWidth < 768 ? 25 : 55, 60);
    const colors = [
      'rgba(245, 158, 11, 0.45)', // Turmeric Gold
      'rgba(234, 88, 12, 0.35)',  // Saffron
      'rgba(217, 119, 6, 0.4)',   // Deep Amber
      'rgba(254, 240, 138, 0.5)', // Pale Spice Sparkle
      'rgba(22, 101, 52, 0.25)'   // Fresh Curry Leaf Green
    ];

    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 2.5 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(Math.random() * 0.4 + 0.15),
        alpha: Math.random() * 0.6 + 0.2,
        pulsing: Math.random() * 0.02 + 0.01,
        angle: Math.random() * Math.PI * 2
      });
    }

    this.renderCanvas();

    // Pause canvas when page is not visible to save CPU/battery
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(this.animId);
      } else {
        this.renderCanvas();
      }
    });
  }

  resizeCanvas() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  renderCanvas() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const p of this.particles) {
      p.x += p.vx + Math.sin(p.angle) * 0.25;
      p.y += p.vy;
      p.angle += p.pulsing;

      // Wrap around edges seamlessly
      if (p.y < -10) p.y = this.canvas.height + 10;
      if (p.x < -10) p.x = this.canvas.width + 10;
      if (p.x > this.canvas.width + 10) p.x = -10;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.shadowBlur = p.radius * 4;
      this.ctx.shadowColor = 'rgba(245, 158, 11, 0.4)';
      this.ctx.fill();
    }

    this.animId = requestAnimationFrame(() => this.renderCanvas());
  }

  /* --------------------------------------------------------------------------
     2. 3D Card Parallax Tilt & Hologram Foil
     -------------------------------------------------------------------------- */
  attach3DTilt(cardWrap) {
    if (this.isReducedMotion || window.innerWidth < 768) return;

    const card = cardWrap.querySelector('.recipe-card-3d');
    const foil = cardWrap.querySelector('.card-foil-overlay');
    if (!card) return;

    const handleMouseMove = (e) => {
      const rect = cardWrap.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -9; // Max 9 deg tilt
      const rotateY = ((x - centerX) / centerX) * 9;

      card.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(8px)`;

      if (foil) {
        const percentX = (x / rect.width) * 100;
        const percentY = (y / rect.height) * 100;
        foil.style.background = `radial-gradient(circle at ${percentX.toFixed(0)}% ${percentY.toFixed(0)}%, rgba(255, 235, 150, 0.3) 0%, rgba(245, 158, 11, 0.08) 50%, transparent 80%)`;
      }
    };

    const handleMouseLeave = () => {
      card.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0)';
      card.style.transition = 'transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1)';
      setTimeout(() => {
        card.style.transition = '';
      }, 400);
    };

    cardWrap.addEventListener('mousemove', handleMouseMove);
    cardWrap.addEventListener('mouseleave', handleMouseLeave);
  }

  /* --------------------------------------------------------------------------
     3. Procedural Web Audio Sound Engine (Zero external MP3s!)
     -------------------------------------------------------------------------- */
  getAudioContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    localStorage.setItem('amma_magic_sound', String(this.soundEnabled));
    this.updateSoundToggleUI();
    if (this.soundEnabled) {
      this.playFairyChime();
      this.showToast('✨ Enchanted Audio Awakened!');
    } else {
      this.showToast('🤫 Audio Resting in Amma’s Courtyard');
    }
    return this.soundEnabled;
  }

  initSoundToggle() {
    this.updateSoundToggleUI();
  }

  updateSoundToggleUI() {
    const btn = document.getElementById('soundToggleBtn');
    if (!btn) return;
    btn.classList.toggle('is-active', this.soundEnabled);
    const icon = btn.querySelector('.sound-icon');
    const label = btn.querySelector('.sound-label');
    if (icon) icon.textContent = this.soundEnabled ? '🔔' : '🔕';
    if (label) label.textContent = this.soundEnabled ? 'Enchanted Audio: On' : 'Enchant Audio';
  }

  playFairyChime() {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const notes = [587.33, 739.99, 880.00, 1174.66]; // D5, F#5, A5, D6 (Fairytale D Major)
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);

      gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + idx * 0.06 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.06 + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.06);
      osc.stop(ctx.currentTime + idx * 0.06 + 0.65);
    });
  }

  playPageFlip() {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    // Soft parchment rustle using filtered noise buffer
    const bufferSize = ctx.sampleRate * 0.08;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.08);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
  }

  playStarChime() {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  }

  playTimerBell() {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const frequencies = [528, 1056]; // Healing love frequency harmonic
    frequencies.forEach((f) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, ctx.currentTime);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.8);
    });
  }

  /* --------------------------------------------------------------------------
     4. Storybook Toast Notification
     -------------------------------------------------------------------------- */
  showToast(message) {
    let toast = document.getElementById('magicalToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'magicalToast';
      toast.style.position = 'fixed';
      toast.style.bottom = '28px';
      toast.style.right = '28px';
      toast.style.background = 'var(--color-bg-surface)';
      toast.style.color = 'var(--color-ink-primary)';
      toast.style.padding = '12px 20px';
      toast.style.borderRadius = 'var(--radius-full)';
      toast.style.border = '2px solid var(--color-turmeric)';
      toast.style.boxShadow = 'var(--shadow-lg)';
      toast.style.fontFamily = 'var(--font-sans)';
      toast.style.fontSize = '0.92rem';
      toast.style.fontWeight = '600';
      toast.style.zIndex = '9999';
      toast.style.transition = 'all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)';
      toast.style.transform = 'translateY(100px) scale(0.9)';
      toast.style.opacity = '0';
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.transform = 'translateY(0) scale(1)';
    toast.style.opacity = '1';

    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.style.transform = 'translateY(100px) scale(0.9)';
      toast.style.opacity = '0';
    }, 3200);
  }
}
