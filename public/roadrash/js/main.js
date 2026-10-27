/* =========================================================================
   main.js — wires the canvas game to the DOM: menus, garage, input, save.
   ========================================================================= */

import { Game, BIKE_MODELS, LEVELS } from "./game.js";
import { render } from "./render.js";
import { Audio } from "./audio.js";
import { formatTime, ordinal, clamp } from "./util.js";
import { THEMES } from "./road.js";

const $ = (sel) => document.querySelector(sel);

const canvas = $("#game");
const ctx = canvas.getContext("2d", { alpha: false });

const SAVE_KEY = "roadrash-tribute-v1";
const DEFAULT_SAVE = { cash: 0, bikeIndex: 0, unlocked: 0, sound: true, music: true };

function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return { ...DEFAULT_SAVE };
    return { ...DEFAULT_SAVE, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_SAVE };
  }
}

function persist() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  } catch {
    /* private mode — the game still plays, it just won't remember */
  }
}

let save = loadSave();
let selectedLevel = clamp(save.unlocked, 0, LEVELS.length - 1);
let mode = "menu";              // menu | race | result | garage | pause
let resultShown = false;

const audio = new Audio();
audio.musicOn = save.music;

const game = new Game({
  audio,
  onEvent: handleGameEvent,
  onHud: () => {},
});
game.cash = save.cash;
game.bikeIndex = save.bikeIndex;
game.levelIndex = selectedLevel;

/* ------------------------------------------------------------------ view */

let W = 0;
let H = 0;
let DPR = 1;

function resize() {
  DPR = Math.min(1.5, window.devicePixelRatio || 1);
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = Math.floor(W * DPR);
  canvas.height = Math.floor(H * DPR);
  canvas.style.width = W + "px";
  canvas.style.height = H + "px";
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  game.width = W;
  game.height = H;
}

window.addEventListener("resize", resize);
resize();

/* ---------------------------------------------------------------- screens */

const screens = {
  menu: $("#screen-menu"),
  garage: $("#screen-garage"),
  result: $("#screen-result"),
  pause: $("#screen-pause"),
};

function showScreen(name) {
  for (const [key, el] of Object.entries(screens)) {
    el.classList.toggle("screen--active", key === name);
  }
  document.body.classList.toggle("in-race", name === null);
}

/* ------------------------------------------------------------------ menu */

function renderLevelList() {
  const list = $("#level-list");
  list.innerHTML = "";
  LEVELS.forEach((lvl, i) => {
    const theme = THEMES[lvl.theme].name;
    const locked = i > save.unlocked;
    const btn = document.createElement("button");
    btn.className = "level";
    btn.type = "button";
    btn.disabled = locked;
    btn.setAttribute("aria-pressed", String(i === selectedLevel));
    btn.innerHTML = `
      <span class="level-num">${String(i + 1).padStart(2, "0")}</span>
      <span class="level-name">${theme}</span>
      <span class="level-sub">${locked ? "LOCKED" : lvl.prize + " PRIZE"}</span>
    `;
    btn.addEventListener("click", () => {
      if (locked) return;
      selectedLevel = i;
      renderLevelList();
    });
    list.appendChild(btn);
  });
}

function refreshMenuChrome() {
  $("#menu-cash").textContent = `$${save.cash}`;
  $("#menu-bike").textContent = BIKE_MODELS[save.bikeIndex].name;
  $("#btn-sound").textContent = `SOUND: ${save.sound ? "ON" : "OFF"}`;
}

/* ---------------------------------------------------------------- garage */

function renderGarage() {
  const list = $("#garage-list");
  list.innerHTML = "";
  $("#garage-cash").textContent = `$${save.cash}`;
  BIKE_MODELS.forEach((bike, i) => {
    const owned = i <= save.bikeIndex;
    const active = i === save.bikeIndex;
    const row = document.createElement("div");
    row.className = "bike";
    row.dataset.owned = String(owned);
    row.dataset.active = String(active);
    const spec = `TOP SPEED ${Math.round(bike.speed * 100)}% · ACCEL ${Math.round(bike.accel * 100)}% · GRIP ${Math.round(bike.grip * 100)}%`;
    row.innerHTML = `
      <div>
        <div class="bike-name">${bike.name}</div>
        <div class="bike-spec">${spec}</div>
      </div>
      <div class="bike-cta"></div>
    `;
    const cta = row.querySelector(".bike-cta");
    const btn = document.createElement("button");
    btn.className = "btn btn--ghost";
    if (active) {
      btn.textContent = "RIDING";
      btn.disabled = true;
    } else if (owned) {
      btn.textContent = "RIDE";
      btn.addEventListener("click", () => {
        save.bikeIndex = i;
        persist();
        renderGarage();
      });
    } else {
      btn.textContent = `$${bike.price}`;
      btn.disabled = save.cash < bike.price;
      btn.addEventListener("click", () => {
        if (save.cash < bike.price) return;
        save.cash -= bike.price;
        save.bikeIndex = i;
        persist();
        audio.play("pickup");
        renderGarage();
        refreshMenuChrome();
      });
    }
    cta.appendChild(btn);
    list.appendChild(row);
  });
}

/* ------------------------------------------------------------ race flow */

function startRace(level) {
  audio.init();
  audio.resume();
  if (!save.sound) audio.setMuted(true);

  game.cash = save.cash;
  game.bikeIndex = save.bikeIndex;
  game.levelIndex = level;
  game.startRace(level);

  mode = "race";
  resultShown = false;
  showScreen(null);
  lastTime = performance.now();
  if (!rafId) rafId = requestAnimationFrame(frame);
}

function handleResult(result) {
  if (resultShown) return;
  resultShown = true;
  mode = "result";

  save.cash = Math.max(0, game.cash);
  if (result.top4 && !result.busted) {
    save.unlocked = Math.min(LEVELS.length - 1, Math.max(save.unlocked, result.level + 1));
  }
  persist();
  refreshMenuChrome();

  const kicker = $("#result-kicker");
  const placeEl = $("#result-place");
  const note = $("#result-note");
  const next = $("#btn-result-next");

  $("#result-time").textContent = formatTime(result.time);
  $("#result-prize").textContent = result.prize ? `$${result.prize}` : "$0";
  $("#result-falls").textContent = String(result.fallen ?? 0);

  if (result.busted) {
    kicker.textContent = "BUSTED BY THE PATROL";
    placeEl.textContent = "BUSTED";
    note.textContent = `You were cuffed on the shoulder. The fine ate $${result.fine || 0} of your bankroll. Race it again.`;
    next.textContent = "RETRY RACE";
  } else {
    kicker.textContent = result.top4 ? "YOU QUALIFIED" : "RACE COMPLETE";
    placeEl.textContent = ordinal(result.place);
    note.textContent = result.top4
      ? "Top four finish — the next circuit is unlocked. Spend your winnings in the garage if you want a faster machine."
      : "You needed a top-four finish to move up the ladder. Same circuit, one more try.";
    next.textContent = result.top4 ? "CONTINUE" : "RETRY RACE";
  }

  showScreen("result");
}

function nextFromResult() {
  const r = game.lastResult;
  if (!r) return backToMenu();
  if (r.busted || !r.top4) {
    startRace(r.level);
    return;
  }
  selectedLevel = clamp(save.unlocked, 0, LEVELS.length - 1);
  mode = "garage";
  renderGarage();
  showScreen("garage");
  const lastLevel = r.level >= LEVELS.length - 1;
  $("#btn-garage-race").textContent = lastLevel ? "RIDE AGAIN" : "NEXT RACE";
}

function backToMenu() {
  mode = "menu";
  game.state = "menu";
  selectedLevel = clamp(save.unlocked, 0, LEVELS.length - 1);
  renderLevelList();
  refreshMenuChrome();
  audio.setEngine(0, false);
  showScreen("menu");
  document.body.classList.remove("in-race");
}

function pauseGame() {
  if (mode !== "race") return;
  game.pause();
  mode = "pause";
  audio.setEngine(0, false);
  showScreen("pause");
}

function resumeGame() {
  if (mode !== "pause") return;
  game.resume();
  mode = "race";
  lastTime = performance.now();
  showScreen(null);
}

/* --------------------------------------------------------------- events */

const SFX = {
  punch: "punch",
  kick: "kick",
  clang: "clang",
  getHit: "getHit",
  whoosh: "whoosh",
  bump: "bump",
  bikeBump: "bikeBump",
  crash: "crash",
  crashHard: "crashHard",
  rivalCrash: "rivalCrash",
  pedHit: "pedHit",
  slip: "slip",
  pickup: "pickup",
  weaponBreak: "weaponBreak",
  getUp: "getUp",
  remount: "remount",
  busted: "busted",
  finish: "finish",
  go: "go",
  bikeWrecked: "crashHard",
};

function handleGameEvent(type, payload) {
  if (type === "finish") {
    audio.play("finish");
    setTimeout(() => handleResult(payload), 1400);
    return;
  }
  if (type === "busted") {
    audio.play("busted");
    setTimeout(() => handleResult(payload), 1600);
    return;
  }
  const sfx = SFX[type];
  if (sfx && save.sound) audio.play(sfx);
}

/* ---------------------------------------------------------------- input */

const pad = { gas: 0, brake: 0, left: 0, right: 0 };
const keys = new Set();

const KEYMAP = {
  ArrowUp: "gas",
  KeyW: "gas",
  ArrowDown: "brake",
  KeyS: "brake",
  ArrowLeft: "left",
  KeyA: "left",
  ArrowRight: "right",
  KeyD: "right",
};

window.addEventListener("keydown", (e) => {
  if (e.target instanceof HTMLElement && ["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;

  if (KEYMAP[e.code]) {
    keys.add(KEYMAP[e.code]);
    e.preventDefault();
    return;
  }
  if (e.code === "Space" || e.code === "KeyJ" || e.code === "KeyZ") {
    e.preventDefault();
    if (!e.repeat && mode === "race") game.attack("punch");
    return;
  }
  if (e.code === "KeyK" || e.code === "KeyX") {
    e.preventDefault();
    if (!e.repeat && mode === "race") game.attack("kick");
    return;
  }
  if (e.code === "KeyP" || e.code === "Escape") {
    e.preventDefault();
    if (mode === "pause") resumeGame();
    else pauseGame();
    return;
  }
  if (e.code === "KeyM") {
    toggleSound();
    return;
  }
  if (e.code === "Enter") {
    if (mode === "menu") startRace(selectedLevel);
    else if (mode === "result") nextFromResult();
  }
});

window.addEventListener("keyup", (e) => {
  if (KEYMAP[e.code]) keys.delete(KEYMAP[e.code]);
});

window.addEventListener("blur", () => {
  keys.clear();
  if (mode === "race") pauseGame();
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden && mode === "race") pauseGame();
});

/* touch pads */

const touch = $("#touch-controls");
const touchState = {};

function bindTouch() {
  touch.querySelectorAll(".touch-btn").forEach((btn) => {
    const key = btn.dataset.key;
    const down = (e) => {
      e.preventDefault();
      btn.classList.add("is-down");
      audio.resume();
      if (key === "punch" || key === "kick") {
        if (mode === "race") game.attack(key);
        return;
      }
      touchState[key] = true;
    };
    const up = (e) => {
      e.preventDefault();
      btn.classList.remove("is-down");
      touchState[key] = false;
    };
    btn.addEventListener("pointerdown", down);
    btn.addEventListener("pointerup", up);
    btn.addEventListener("pointercancel", up);
    btn.addEventListener("pointerleave", up);
  });
  if (window.matchMedia("(pointer: coarse)").matches) document.body.classList.add("touch-mode");
}
bindTouch();

/* gamepad (nice to have, never required) */
let prevPad = { attack: false, kick: false, gas: false, brake: false };

function pollGamepad() {
  const pads = navigator.getGamepads ? navigator.getGamepads() : [];
  const gp = pads && pads[0];
  if (!gp) return;
  const ax = gp.axes[0] || 0;
  touchState.left = ax < -0.3;
  touchState.right = ax > 0.3;
  const gas = !!(gp.buttons[7] && gp.buttons[7].pressed);
  const brake = !!(gp.buttons[6] && gp.buttons[6].pressed);
  if (gas || brake || prevPad.gas || prevPad.brake) {
    touchState.gas = gas;
    touchState.brake = brake;
  }
  const atk = !!(gp.buttons[2] && gp.buttons[2].pressed);
  const kick = !!(gp.buttons[1] && gp.buttons[1].pressed);
  if (atk && !prevPad.attack && mode === "race") game.attack("punch");
  if (kick && !prevPad.kick && mode === "race") game.attack("kick");
  prevPad = { attack: atk, kick, gas, brake };
}

/* ---------------------------------------------------------------- sound */

function toggleSound() {
  save.sound = !save.sound;
  persist();
  audio.setMuted(!save.sound);
  if (save.sound) {
    audio.init();
    audio.resume();
  }
  $("#btn-sound").textContent = `SOUND: ${save.sound ? "ON" : "OFF"}`;
  $("#btn-mute").classList.toggle("is-off", !save.sound);
  $("#btn-mute").textContent = save.sound ? "♪" : "✕";
}

/* ------------------------------------------------------------- ui wiring */

$("#btn-start").addEventListener("click", () => startRace(selectedLevel));
$("#btn-garage").addEventListener("click", () => {
  mode = "garage";
  renderGarage();
  showScreen("garage");
  $("#btn-garage-race").textContent = "NEXT RACE";
});
$("#btn-sound").addEventListener("click", toggleSound);
$("#btn-garage-back").addEventListener("click", () => {
  if (game.state === "finished" && game.lastResult) {
    showScreen("result");
    mode = "result";
  } else {
    backToMenu();
  }
});
$("#btn-garage-race").addEventListener("click", () => startRace(selectedLevel));
$("#btn-result-menu").addEventListener("click", backToMenu);
$("#btn-result-next").addEventListener("click", nextFromResult);
$("#btn-resume").addEventListener("click", resumeGame);
$("#btn-restart").addEventListener("click", () => startRace(game.levelIndex));
$("#btn-quit").addEventListener("click", backToMenu);
$("#btn-pause").addEventListener("click", pauseGame);
$("#btn-mute").addEventListener("click", toggleSound);

// small hook so the game can be poked at from the console
window.__roadRash = { game, audio, save, startRace };

canvas.addEventListener("pointerdown", () => {
  audio.resume();
  if (mode === "menu") startRace(selectedLevel);
});

/* ------------------------------------------------------------- main loop */

let rafId = 0;
let lastTime = 0;
let lastCountdown = 4;
let hornCooldown = 0;

function frame(now) {
  rafId = requestAnimationFrame(frame);
  // guard against clock jitter (a negative dt would rewind the race)
  const dt = Math.max(0, Math.min(0.05, (now - lastTime) / 1000)) || 0.016;
  lastTime = now;

  if (mode === "race" || mode === "result") {
    pollGamepad();
    if (mode === "race") {
      pad.gas = keys.has("gas") || touchState.gas ? 1 : 0;
      pad.brake = keys.has("brake") || touchState.brake ? 1 : 0;
      pad.left = keys.has("left") || touchState.left ? 1 : 0;
      pad.right = keys.has("right") || touchState.right ? 1 : 0;
      game.setInput(pad);
    } else {
      game.setInput({ gas: 0, brake: 0, left: 0, right: 0 });
    }

    game.update(dt);

    // countdown beeps
    if (game.state === "countdown") {
      const c = Math.ceil(game.countdown);
      if (c !== lastCountdown) {
        lastCountdown = c;
        if (save.sound && c > 0) audio.play("countdown");
      }
    } else {
      lastCountdown = 4;
    }

    // engine note follows the player's speed
    const p = game.player;
    if (p) {
      audio.setEngine(
        p.speed / Math.max(1, p.topSpeed),
        game.state === "racing" && (p.state === "riding" || p.state === "recovering"),
        p.wobble || 0,
      );
    }

    // horn when a car is coming at you
    hornCooldown = Math.max(0, hornCooldown - dt);
    if (hornCooldown === 0 && game.state === "racing" && save.sound) {
      const p2 = game.player;
      for (const t of game.traffic) {
        if (!t.oncoming) continue;
        const dz = t.z - p2.z;
        if (dz > 0 && dz < 11000 && Math.abs(t.x - p2.x) < 0.5) {
          audio.play("horn");
          hornCooldown = 3.2;
          break;
        }
      }
    }
  }

  render(ctx, game, W, H);
}

/* --------------------------------------------------------------- startup */

renderLevelList();
refreshMenuChrome();
showScreen("menu");
$("#btn-mute").textContent = save.sound ? "♪" : "✕";
$("#btn-mute").classList.toggle("is-off", !save.sound);
if (!save.sound) audio.setMuted(true);


window.addEventListener("beforeunload", () => {
  save.cash = game.cash ?? save.cash;
  persist();
});
