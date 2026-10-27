/* =========================================================================
   audio.js — everything you hear is synthesised with WebAudio.
   No samples, no downloads: engine drone, punches, crashes, sirens and a
   looping 16-bit style bassline.
   ========================================================================= */

export class Audio {
  constructor() {
    this.ctx = null;
    this.ready = false;
    this.muted = false;
    this.musicOn = true;
    this.engine = null;
    this.musicTimer = null;
    this.nextNote = 0;
    this.step = 0;
  }

  init() {
    if (this.ready) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    const ctx = this.ctx;

    this.master = ctx.createGain();
    this.master.gain.value = 0.85;
    this.master.connect(ctx.destination);

    this.sfxBus = ctx.createGain();
    this.sfxBus.gain.value = 0.9;
    this.sfxBus.connect(this.master);

    this.musicBus = ctx.createGain();
    this.musicBus.gain.value = 0.0;
    this.musicBus.connect(this.master);

    // reusable white noise buffer
    const len = ctx.sampleRate * 2;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    this.noiseBuffer = buf;

    this.ready = true;
    this.startEngine();
    if (this.musicOn) this.startMusic();
  }

  resume() {
    if (!this.ready) this.init();
    if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
  }

  setMuted(m) {
    this.muted = m;
    if (this.master) this.master.gain.setTargetAtTime(m ? 0 : 0.85, this.ctx.currentTime, 0.05);
  }

  /* ------------------------------------------------------------- engine */

  startEngine() {
    const ctx = this.ctx;
    if (this.engine) return;
    const out = ctx.createGain();
    out.gain.value = 0;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 900;
    filter.Q.value = 6;

    const osc1 = ctx.createOscillator();
    osc1.type = "sawtooth";
    osc1.frequency.value = 70;
    const osc2 = ctx.createOscillator();
    osc2.type = "square";
    osc2.frequency.value = 35;

    const sub = ctx.createGain();
    sub.gain.value = 0.55;

    osc1.connect(filter);
    osc2.connect(sub);
    sub.connect(filter);
    filter.connect(out);
    out.connect(this.sfxBus);

    // wind / tyre noise
    const noise = ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;
    noise.loop = true;
    const nf = ctx.createBiquadFilter();
    nf.type = "bandpass";
    nf.frequency.value = 1200;
    nf.Q.value = 0.6;
    const ng = ctx.createGain();
    ng.gain.value = 0;
    noise.connect(nf);
    nf.connect(ng);
    ng.connect(this.sfxBus);
    noise.start();

    osc1.start();
    osc2.start();
    this.engine = { out, filter, osc1, osc2, ng, nf };
  }

  /** ratio 0..1 of top speed, active = riding */
  setEngine(ratio, active, wobble = 0) {
    if (!this.ready || !this.engine) return;
    const t = this.ctx.currentTime;
    const r = Math.max(0, Math.min(1.2, ratio));
    const base = 48 + r * 150 + Math.sin(t * 18) * 2 * (0.3 + wobble);
    this.engine.osc1.frequency.setTargetAtTime(base, t, 0.06);
    this.engine.osc2.frequency.setTargetAtTime(base * 0.5, t, 0.06);
    this.engine.filter.frequency.setTargetAtTime(400 + r * 1800, t, 0.09);
    this.engine.out.gain.setTargetAtTime(active ? 0.055 + r * 0.07 : 0.0, t, 0.12);
    this.engine.ng.gain.setTargetAtTime(active ? 0.012 + r * 0.05 : 0, t, 0.15);
  }

  /* ---------------------------------------------------------------- sfx */

  noise(dur, { type = "lowpass", from = 2000, to = 200, gain = 0.5, q = 1 } = {}) {
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    src.playbackRate.value = 1;
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.Q.value = q;
    f.frequency.setValueAtTime(from, t);
    f.frequency.exponentialRampToValueAtTime(Math.max(40, to), t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(f);
    f.connect(g);
    g.connect(this.sfxBus);
    src.start(t);
    src.stop(t + dur + 0.02);
  }

  tone(freq, dur, { type = "square", gain = 0.2, slide = 0, delay = 0 } = {}) {
    const ctx = this.ctx;
    const t = ctx.currentTime + delay;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g);
    g.connect(this.sfxBus);
    o.start(t);
    o.stop(t + dur + 0.02);
  }

  play(name) {
    if (!this.ready) return;
    switch (name) {
      case "punch":
        this.noise(0.09, { from: 1800, to: 200, gain: 0.5 });
        this.tone(140, 0.1, { type: "sine", gain: 0.3, slide: -80 });
        break;
      case "kick":
        this.noise(0.13, { from: 1200, to: 120, gain: 0.6 });
        this.tone(90, 0.16, { type: "sine", gain: 0.4, slide: -50 });
        break;
      case "clang":
        this.tone(1180, 0.22, { type: "triangle", gain: 0.22, slide: -400 });
        this.tone(1720, 0.16, { type: "square", gain: 0.1 });
        this.noise(0.1, { type: "bandpass", from: 3000, to: 1800, gain: 0.35, q: 3 });
        break;
      case "getHit":
        this.noise(0.12, { from: 1400, to: 180, gain: 0.45 });
        this.tone(120, 0.12, { type: "sine", gain: 0.3, slide: -60 });
        break;
      case "whoosh":
        this.noise(0.1, { type: "bandpass", from: 2600, to: 900, gain: 0.14, q: 1.4 });
        break;
      case "bump":
        this.tone(70, 0.18, { type: "sine", gain: 0.5, slide: -30 });
        this.noise(0.12, { from: 900, to: 150, gain: 0.35 });
        break;
      case "bikeBump":
        this.tone(58, 0.26, { type: "triangle", gain: 0.5, slide: -20 });
        this.noise(0.18, { type: "bandpass", from: 1600, to: 300, gain: 0.3, q: 2 });
        break;
      case "crash":
        this.noise(0.55, { from: 4200, to: 120, gain: 0.7 });
        this.tone(64, 0.5, { type: "sine", gain: 0.45, slide: -30 });
        break;
      case "crashHard":
        this.noise(0.8, { from: 5200, to: 80, gain: 0.85 });
        this.tone(52, 0.7, { type: "triangle", gain: 0.55, slide: -20 });
        this.tone(140, 0.4, { type: "sawtooth", gain: 0.2, slide: -100 });
        break;
      case "rivalCrash":
        this.noise(0.4, { type: "bandpass", from: 3000, to: 400, gain: 0.35, q: 1.2 });
        break;
      case "pedHit":
        this.tone(300, 0.12, { type: "sine", gain: 0.3, slide: 200 });
        this.noise(0.15, { type: "bandpass", from: 1400, to: 500, gain: 0.28, q: 2 });
        break;
      case "slip":
        this.noise(0.5, { type: "bandpass", from: 900, to: 2500, gain: 0.2, q: 1.5 });
        break;
      case "pickup":
        this.tone(660, 0.09, { type: "square", gain: 0.18 });
        this.tone(990, 0.12, { type: "square", gain: 0.16, delay: 0.08 });
        break;
      case "weaponBreak":
        this.tone(320, 0.18, { type: "sawtooth", gain: 0.16, slide: -160 });
        break;
      case "go":
        this.tone(440, 0.14, { type: "square", gain: 0.22 });
        this.tone(880, 0.3, { type: "square", gain: 0.18, delay: 0.16 });
        break;
      case "countdown":
        this.tone(330, 0.12, { type: "square", gain: 0.16 });
        break;
      case "getUp":
        this.tone(220, 0.1, { type: "triangle", gain: 0.14 });
        break;
      case "remount":
        this.tone(180, 0.16, { type: "sawtooth", gain: 0.14, slide: 120 });
        break;
      case "busted":
        this.tone(520, 0.25, { type: "square", gain: 0.2 });
        this.tone(390, 0.35, { type: "square", gain: 0.2, delay: 0.25 });
        break;
      case "finish":
        [523, 659, 784, 1046].forEach((f, i) => this.tone(f, 0.28, { type: "square", gain: 0.16, delay: i * 0.12 }));
        break;
      case "horn":
        this.tone(300, 0.35, { type: "sawtooth", gain: 0.16 });
        this.tone(380, 0.35, { type: "sawtooth", gain: 0.12 });
        break;
      case "siren":
        this.tone(720, 0.3, { type: "square", gain: 0.1 });
        this.tone(540, 0.3, { type: "square", gain: 0.1, delay: 0.3 });
        break;
      default:
        break;
    }
  }

  /* -------------------------------------------------------------- music */

  startMusic() {
    if (!this.ready || this.musicTimer) return;
    this.musicBus.gain.setTargetAtTime(0.16, this.ctx.currentTime, 0.6);
    this.nextNote = this.ctx.currentTime + 0.1;
    this.step = 0;
    this.musicTimer = setInterval(() => this.scheduleMusic(), 25);
  }

  stopMusic() {
    if (this.musicTimer) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
    if (this.musicBus) this.musicBus.gain.setTargetAtTime(0, this.ctx.currentTime, 0.3);
  }

  toggleMusic() {
    this.musicOn = !this.musicOn;
    if (this.musicOn) this.startMusic();
    else this.stopMusic();
    return this.musicOn;
  }

  /** 4 bars of A minor, 16th-note arp over a driving bass. */
  scheduleMusic() {
    const ctx = this.ctx;
    const sixteenth = 60 / 138 / 4;
    while (this.nextNote < ctx.currentTime + 0.2) {
      const s = this.step % 64;
      const bar = Math.floor(s / 16);
      const roots = [110, 110, 87.31, 98];      // A2, A2, F2, G2
      const chords = [
        [220, 261.63, 329.63, 440],
        [220, 261.63, 329.63, 440],
        [174.61, 220, 261.63, 349.23],
        [196, 246.94, 293.66, 392],
      ];
      const t = this.nextNote - ctx.currentTime;
      // bass on 1 and 3, plus an off-beat push
      if (s % 16 === 0 || s % 16 === 6 || s % 16 === 10) {
        this.musicTone(roots[bar] / 2, sixteenth * (s % 16 === 0 ? 3.2 : 1.4), "sawtooth", 0.5, t);
      }
      // arp on every 16th with a rest here and there
      if (s % 2 === 0) {
        const chord = chords[bar];
        const note = chord[(s / 2) % chord.length];
        this.musicTone(note * 2, sixteenth * 1.3, "square", 0.16, t);
      }
      // hats
      if (s % 4 === 2) this.musicNoise(0.03, 0.05, t);
      this.nextNote += sixteenth;
      this.step++;
    }
  }

  musicTone(freq, dur, type, gain, delay) {
    const ctx = this.ctx;
    const t = ctx.currentTime + delay;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    const f = ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = 2200;
    o.connect(f);
    f.connect(g);
    g.connect(this.musicBus);
    o.start(t);
    o.stop(t + dur + 0.02);
  }

  musicNoise(dur, gain, delay) {
    const ctx = this.ctx;
    const t = ctx.currentTime + delay;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const f = ctx.createBiquadFilter();
    f.type = "highpass";
    f.frequency.value = 6000;
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(f);
    f.connect(g);
    g.connect(this.musicBus);
    src.start(t);
    src.stop(t + dur + 0.02);
  }
}
