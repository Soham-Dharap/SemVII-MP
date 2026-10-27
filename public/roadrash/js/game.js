/* =========================================================================
   game.js — Road Rash rules: throttle, bends, brawling, traffic, spills.
   Units: world units per second for speed, x is measured in "road widths",
   so x = ±1 is the edge of the tarmac and the road is 2.0 wide.
   ========================================================================= */

import { clamp, lerp, rand, pick, seeded, sign } from "./util.js";
import { SEG_LEN, ROAD_WIDTH, CAMERA_HEIGHT, DRAW_DISTANCE, cameraDepthFor, createTrack, LEVELS, project } from "./road.js";

export const MAX_KMH = 260;

export const BIKE_MODELS = [
  { id: "shuriken", name: "SHURIKEN 400", price: 0, speed: 1.0, accel: 1.0, grip: 1.0 },
  { id: "panda", name: "PANDA 600", price: 2600, speed: 1.1, accel: 1.05, grip: 1.05 },
  { id: "banshee", name: "BANSHEE 750", price: 7000, speed: 1.22, accel: 1.1, grip: 1.1 },
  { id: "diablo", name: "DIABLO 1000", price: 15500, speed: 1.36, accel: 1.18, grip: 1.14 },
];

export const RIVAL_NAMES = [
  "VIPER", "HATCHET", "RUSTY", "MONGOOSE", "JINX", "BRUISER", "BLITZ", "SPIKE",
  "TANK", "NITRO", "RAZOR", "DUSTY", "MACK", "KOWALSKI", "SNAKE", "GRIT",
  "BUZZ", "TOAD", "AXEL", "RICKY",
];

const RIDER_PALETTES = [
  { jacket: "#c8402f", jacketDark: "#96281c", helmet: "#f2e3c4", helmetStripe: "#c8402f", pants: "#2e3446", bike: "#2f6f9e", bikeDark: "#1f4f74", skin: "#d9a97e" },
  { jacket: "#3f7a3f", jacketDark: "#2b572b", helmet: "#1f242c", helmetStripe: "#e8c341", pants: "#3b3340", bike: "#a8322a", bikeDark: "#7a201a", skin: "#c48b62" },
  { jacket: "#2f5fa8", jacketDark: "#1f4278", helmet: "#d94f2b", helmetStripe: "#f4e9d6", pants: "#26303e", bike: "#d8cfb8", bikeDark: "#a89e88", skin: "#e0b489" },
  { jacket: "#7a3f8f", jacketDark: "#552a66", helmet: "#f0e7cf", helmetStripe: "#7a3f8f", pants: "#2b2b33", bike: "#e0a02c", bikeDark: "#b77c1c", skin: "#a9764f" },
  { jacket: "#d8b23c", jacketDark: "#a8862a", helmet: "#26303e", helmetStripe: "#d8b23c", pants: "#3a3f4a", bike: "#3a3f4a", bikeDark: "#252a32", skin: "#d9a97e" },
  { jacket: "#2f8f8a", jacketDark: "#1f6360", helmet: "#f4ede0", helmetStripe: "#2f8f8a", pants: "#33333b", bike: "#c14a2c", bikeDark: "#8e3018", skin: "#b98056" },
  { jacket: "#b9427a", jacketDark: "#8a2c58", helmet: "#2a2a30", helmetStripe: "#f0e0d0", pants: "#2f3a45", bike: "#6f8f3a", bikeDark: "#4e6827", skin: "#e0b489" },
  { jacket: "#6f6f7a", jacketDark: "#4c4c55", helmet: "#c8402f", helmetStripe: "#f0e0d0", pants: "#2b2b33", bike: "#2f4f8f", bikeDark: "#1e3564", skin: "#c48b62" },
];

const COP_PALETTE = {
  jacket: "#26364f", jacketDark: "#17233a", helmet: "#f2f0e6", helmetStripe: "#26364f",
  pants: "#1d2530", bike: "#f0ede2", bikeDark: "#c9c5b6", skin: "#d9a97e",
};

export const PLAYER_PALETTE = {
  jacket: "#e3562c", jacketDark: "#a83a1c", helmet: "#f4ead6", helmetStripe: "#e3562c",
  pants: "#333b4d", bike: "#2f9e8f", bikeDark: "#1d6f64", skin: "#e0b489",
};

const CAR_COLORS = ["#8f9aa6", "#c8452f", "#2f5f8f", "#e8e2d4", "#3f6f4a", "#d8a83c", "#5a4a5f", "#2a2a30"];
const TRAFFIC_KINDS = [
  { kind: "sedan", hw: 0.13, speed: [4200, 5800], weight: 5 },
  { kind: "hatch", hw: 0.12, speed: [4400, 6000], weight: 3 },
  { kind: "van", hw: 0.15, speed: [3800, 5000], weight: 2 },
  { kind: "truck", hw: 0.19, speed: [3000, 4200], weight: 1 },
  { kind: "bus", hw: 0.20, speed: [2800, 3800], weight: 1 },
];

const PED_SHIRTS = ["#d9542e", "#3f7ab8", "#e0b23c", "#7a4a8f", "#3f8f5a", "#c8407a", "#f0e6d2"];
const PED_PANTS = ["#2b3550", "#3a3a42", "#4a3b2a", "#26262e"];

let ENTITY_ID = 1;

export class Game {
  constructor(options = {}) {
    this.audio = options.audio || null;
    this.onEvent = options.onEvent || (() => {});
    this.onHud = options.onHud || (() => {});
    this.cash = 0;
    this.bikeIndex = 0;
    this.raceNumber = 1;
    this.width = 1280;
    this.height = 720;
    this.paused = false;
    this.reset();
  }

  /* ------------------------------------------------------------- setup */

  reset() {
    this.levelIndex = 0;
    this.state = "menu";
    this.track = null;
    this.rivals = [];
    this.traffic = [];
    this.hazards = [];
    this.wrecks = [];
    this.particles = [];
    this.floaters = [];
    this.camera = { x: 0, y: CAMERA_HEIGHT, z: 0, depth: cameraDepthFor(100) };
    this.shake = 0;
    this.time = 0;
    this.lastResult = null;
  }

  /** Start (or restart) a race. */
  startRace(levelIndex = this.levelIndex, opts = {}) {
    this.levelIndex = clamp(levelIndex, 0, LEVELS.length - 1);
    this.seed = opts.seed != null ? opts.seed : (Date.now() ^ (this.levelIndex * 7919)) & 0x7fffffff;
    this.track = createTrack(this.levelIndex, this.seed);
    this.level = this.track.level;
    this.theme = this.track.theme;
    this.bike = BIKE_MODELS[this.bikeIndex];

    this.rivals = [];
    this.traffic = [];
    this.hazards = [];
    this.wrecks = [];
    this.particles = [];
    this.floaters = [];
    this.time = 0;
    this.raceClock = 0;
    this.countdown = 3.0;
    this.state = "countdown";
    this.finished = false;
    this.result = null;
    this.warning = "";
    this.warningTimer = 0;
    this.shake = 0;
    this.bikeWrecked = false;
    this.copsActive = this.levelIndex >= 1;

    const topSpeed = 13000 * this.bike.speed + this.levelIndex * 220;
    this.player = {
      isPlayer: true,
      id: ENTITY_ID++,
      name: "YOU",
      colors: PLAYER_PALETTE,
      x: 0,
      z: 400,
      prevZ: 400,
      speed: 0,
      topSpeed,
      accel: 4400 * this.bike.accel,
      brake: 9200,
      stamina: 1,
      staminaRegen: 0.035,
      bikeDamage: 0,
      lean: 0,
      steerVisual: 0,
      wheelie: 0,
      punch: 0,
      kick: 0,
      attackCd: 0,
      attackSide: 1,
      weapon: null,
      state: "riding",
      downTimer: 0,
      runTimer: 0,
      runPhase: 0,
      wobble: 0,
      invuln: 0,
      bump: 0,
      bumps: 0,
      knocked: 0,
      hits: 0,
      busted: false,
      finishTime: 0,
      pad: { gas: 0, brake: 0, left: 0, right: 0 },
      lastGear: 0,
    };

    this.spawnRivals();
    this.prefillTraffic();

    this.camera = { x: 0, y: CAMERA_HEIGHT, z: this.player.z - 900, depth: this.camera.depth };
    this.onEvent("countdown", { level: this.levelIndex });
    this.emitHud();
    return this;
  }

  spawnRivals() {
    const rng = seeded(this.seed ^ 0x5f356495);
    const count = this.level.rivals;
    const names = [...RIVAL_NAMES];
    const usedPals = [];
    for (let i = 0; i < count; i++) {
      const nameIdx = rng.int(0, names.length - 1);
      const name = names.splice(nameIdx, 1)[0];
      let pal;
      do {
        pal = RIDER_PALETTES[rng.int(0, RIDER_PALETTES.length - 1)];
      } while (usedPals.includes(pal) && usedPals.length < RIDER_PALETTES.length);
      usedPals.push(pal);

      const isCop = this.copsActive && i >= count - 2 && rng.chance(0.7);
      const skill = rng.range(0.9, 1.06) + this.levelIndex * 0.008;
      const bikeBase = 12400 + this.levelIndex * 420;
      this.rivals.push({
        isPlayer: false,
        id: ENTITY_ID++,
        name: isCop ? "PATROL" : name,
        colors: isCop ? COP_PALETTE : pal,
        isCop,
        skill,
        x: rng.range(-0.72, 0.72),
        z: 700 + i * 380 + rng.range(-120, 160),
        prevZ: 0,
        speed: 0,
        topSpeed: bikeBase * skill * (isCop ? 1.05 : 1),
        stamina: rng.range(0.7, 1),
        bikeDamage: 0,
        state: "riding",
        downTimer: 0,
        runTimer: 0,
        runPhase: 0,
        wobble: 0,
        lean: 0,
        punch: 0,
        kick: 0,
        attackCd: rng.range(0.3, 1.4),
        attackSide: 1,
        weapon: !isCop && this.levelIndex >= 1 && rng.chance(0.28) ? { type: "club", swings: 8 } : null,
        lane: rng.range(-0.7, 0.7),
        aggression: rng.range(0.35, 1),
        dodge: 0,
        finishTime: 0,
        bump: 0,
        wheelie: 0,
        passive: false,
      });
    }
  }

  prefillTraffic() {
    const rng = seeded(this.seed ^ 0x1234567);
    for (let z = 900; z < this.track.length - 200; z += this.trafficGap(rng)) {
      this.spawnTrafficAt(z, rng);
    }
    this.traffic.sort((a, b) => a.z - b.z);
  }

  /** Spacing between traffic cars, in world units (≈1-2 s at racing speed). */
  trafficGap(rng = null) {
    const R = !rng ? Math.random : typeof rng === "function" ? rng : rng.next.bind(rng);
    const spread = 9000 + R() * 11000;
    return spread / this.level.traffic;
  }

  spawnTrafficAt(z, rng = null) {
    const R = !rng ? Math.random : typeof rng === "function" ? rng : rng.next.bind(rng);
    const roll = R();
    let acc = 0;
    let spec = TRAFFIC_KINDS[0];
    const totalWeight = TRAFFIC_KINDS.reduce((s, k) => s + k.weight, 0);
    for (const k of TRAFFIC_KINDS) {
      acc += k.weight / totalWeight;
      if (roll <= acc) {
        spec = k;
        break;
      }
    }
    const oncoming = R() < 0.22;
    const lane = oncoming ? (R() < 0.5 ? -0.72 : -0.28) : (R() < 0.5 ? 0.28 : 0.72);
    this.traffic.push({
      id: ENTITY_ID++,
      kind: spec.kind,
      hw: spec.hw,
      color: pick(CAR_COLORS),
      x: lane + (R() - 0.5) * 0.08,
      z,
      speed: oncoming ? -(3600 + R() * 1600) : R() * (spec.speed[1] - spec.speed[0]) + spec.speed[0],
      oncoming,
      brake: false,
      hit: 0,
    });
  }

  /* --------------------------------------------------------- race flow */

  go() {
    this.state = "racing";
    this.onEvent("go");
  }

  finishRace() {
    this.state = "finished";
    this.finished = true;
    const place = this.position();
    const top4 = place <= 4;
    const prize = top4 ? Math.round(this.level.prize * (place === 1 ? 1.6 : place === 2 ? 1.25 : place === 3 ? 1.05 : 0.85)) : 0;
    this.cash += prize;
    this.lastResult = {
      place,
      time: this.raceClock,
      prize,
      top4,
      level: this.levelIndex,
      fallen: this.player.knocked,
      busted: this.player.busted,
    };
    this.result = this.lastResult;
    this.onEvent("finish", this.lastResult);
    this.emitHud();
  }

  busted() {
    this.player.busted = true;
    this.player.state = "busted";
    this.state = "busted";
    this.lastResult = {
      place: this.position(),
      time: this.raceClock,
      prize: 0,
      top4: false,
      level: this.levelIndex,
      busted: true,
      fallen: this.player.knocked,
      fine: 400 + this.levelIndex * 250,
    };
    this.cash = Math.max(0, this.cash - this.lastResult.fine);
    this.result = this.lastResult;
    this.onEvent("busted", this.lastResult);
  }

  position() {
    if (!this.rivals) return 1;
    let ahead = 0;
    for (const r of this.rivals) {
      if (r.finishTime && this.player.finishTime) {
        if (r.finishTime < this.player.finishTime) ahead++;
      } else if (r.finishTime) {
        ahead++;
      } else if (r.z > this.player.z) {
        ahead++;
      }
    }
    return ahead + 1;
  }

  progress() {
    return clamp(this.player.z / (this.track.length - 50 * SEG_LEN), 0, 1);
  }

  emitHud() {
    this.onHud({
      speed: Math.round(this.player.speed * 0.0195),
      place: this.position(),
      total: this.rivals.length + 1,
      stamina: this.player.stamina,
      bikeDamage: this.player.bikeDamage,
      progress: this.progress(),
      time: this.raceClock,
      state: this.state,
      weapon: this.player.weapon ? this.player.weapon.swings : 0,
      rivals: this.nearestRivals(3),
    });
  }

  nearestRivals(n) {
    return [...this.rivals]
      .filter((r) => r.state === "riding")
      .map((r) => ({ d: Math.abs(r.z - this.player.z), name: r.name, stamina: r.stamina, colors: r.colors, cop: r.isCop }))
      .sort((a, b) => a.d - b.d)
      .slice(0, n);
  }

  /* ------------------------------------------------------------ input */

  setInput(pad) {
    if (this.player) this.player.pad = pad;
  }

  attack(kind) {
    const p = this.player;
    if (!p || p.state !== "riding" || this.state !== "racing") return;
    if (p.attackCd > 0) return;
    const isKick = kind === "kick";
    p.attackCd = isKick ? 0.52 : 0.3;
    if (isKick) p.kick = 1;
    else p.punch = 1;

    const weapon = p.weapon && p.weapon.type === "club";
    const range = (isKick ? 0.52 : 0.46) + (weapon ? 0.12 : 0);
    const damage = (isKick ? 0.13 : 0.1) * (weapon ? 2.1 : 1) * (this.bike.grip * 0.6 + 0.4);

    // auto-aim at the closest rival alongside
    let target = null;
    let best = 1e9;
    for (const r of this.rivals) {
      if (r.state !== "riding") continue;
      const dz = Math.abs(r.z - p.z);
      const dx = Math.abs(r.x - p.x);
      if (dz < 820 && dx < range + 0.12 && dx < best) {
        best = dx;
        target = r;
      }
    }
    if (target) {
      p.attackSide = sign(target.x - p.x) || 1;
      this.hitRival(target, damage, isKick, weapon);
    } else {
      // swung at empty air
      this.onEvent(isKick ? "whoosh" : "whoosh");
    }
    if (weapon) {
      p.weapon.swings--;
      if (p.weapon.swings <= 0) {
        p.weapon = null;
        this.onEvent("weaponBreak");
      }
    }
  }

  hitRival(r, damage, isKick, weapon) {
    const p = this.player;
    r.stamina = clamp(r.stamina - damage, 0, 1);
    r.bump = 1;
    r.punch = 0.6;
    r.wobble = Math.min(1, r.wobble + (isKick ? 0.55 : 0.3));
    r.x = clamp(r.x + (r.x - p.x > 0 ? 1 : -1) * (isKick ? 0.13 : 0.07), -1.2, 1.2);
    r.lane = r.x;
    p.hits++;
    this.spawnParticles(r.z, r.x, "spark", isKick ? 10 : 6);
    this.addFloater(r.z, r.x, weapon ? "CLANG!" : isKick ? "WHAM!" : "POW!", isKick ? "#ffd24a" : "#ffe9b0");
    this.onEvent(weapon ? "clang" : isKick ? "kick" : "punch");
    this.shake = Math.max(this.shake, isKick ? 6 : 3.5);
    if (r.isCop) {
      this.warning = "ASSAULTING AN OFFICER";
      this.warningTimer = 2;
    }
    // stealing a weapon: hit somebody mid-swing while empty-handed
    if (!weapon && r.weapon && r.punch > 0 && !r.isCop) {
      p.weapon = { type: "club", swings: 8 };
      r.weapon = null;
      this.addFloater(r.z, r.x, "CLUB STOLEN!", "#8de0ff");
      this.onEvent("pickup");
    }
    if (r.stamina <= 0) this.knockOffRival(r, "beaten");
  }

  knockOffRival(r, reason) {
    if (r.state !== "riding") return;
    r.state = "down";
    r.downTimer = rand(3.4, 5.2);
    r.speed = 0;
    r.wobble = 0;
    r.stamina = 0.55;
    r.bump = 0;
    this.wrecks.push({
      id: ENTITY_ID++,
      z: r.z + rand(120, 420),
      x: clamp(r.x + rand(-0.12, 0.12), -1.15, 1.15),
      colors: r.colors,
      rider: r,
      life: 9,
      tilt: rand(-0.5, 0.5),
      bikeSpin: 0,
      spinVel: rand(-3, 3),
      hit: 0,
      bounced: false,
    });
    this.spawnParticles(r.z, r.x, "dust", 16);
    this.addFloater(r.z, r.x, reason === "beaten" ? "KNOCKED OFF!" : "WIPEOUT!", "#ffb04a");
    this.onEvent("rivalCrash");
    if (Math.abs(r.z - this.player.z) < 9000) this.shake = Math.max(this.shake, 4);
  }

  crashPlayer(reason, opts = {}) {
    const p = this.player;
    if (p.state !== "riding" || p.invuln > 0) return;
    if (opts.soft) {
      // bumps, not crashes: bounce, lose speed, wobble
      p.speed *= opts.soft;
      p.bump = 1;
      p.wobble = Math.min(1, p.wobble + 0.6);
      p.bikeDamage = clamp(p.bikeDamage + 0.03, 0, 1);
      this.shake = Math.max(this.shake, 7);
      this.onEvent("bump");
      this.spawnParticles(p.z, p.x, "dust", 8);
      this.addFloater(p.z, p.x, "BUMP!", "#ffd24a");
      return;
    }
    p.state = "crashed";
    p.downTimer = reason === "hard" ? 2.1 : 1.7;
    p.prevSpeed = p.speed;
    p.speed = 0;
    p.crashReason = reason;
    p.knocked++;
    p.stamina = Math.max(0.35, p.stamina - 0.2);
    p.bikeDamage = clamp(p.bikeDamage + (reason === "hard" ? 0.22 : 0.12), 0, 1);
    p.weapon = p.weapon && Math.random() < 0.45 ? p.weapon : null;
    p.punch = 0;
    p.kick = 0;
    this.shake = 13;
    this.spawnParticles(p.z, p.x, "crash", 26);
    this.onEvent(reason === "hard" ? "crashHard" : "crash");
    this.addFloater(p.z, p.x, reason === "car" ? "CRUNCH!" : "WIPEOUT!", "#ff6b4a");
    if (p.bikeDamage >= 1) {
      this.bikeWrecked = true;
    }
  }

  /* ----------------------------------------------------------- updating */

  update(dt) {
    dt = Math.min(dt, 1 / 30);
    this.dt = dt;
    if (this.state === "paused" || this.state === "menu") return;
    if (this.state === "countdown") {
      this.countdown -= dt;
      this.updateCamera(dt);
      this.updateWorldScrollIdle(dt);
      if (this.countdown <= 0) this.go();
      return;
    }
    if (this.state === "finished" || this.state === "busted") {
      this.updateTraffic(dt, true);
      this.updateParticles(dt);
      this.updateCamera(dt);
      return;
    }

    this.raceClock += dt;
    this.time += dt;
    this.warningTimer = Math.max(0, this.warningTimer - dt);

    this.updatePlayer(dt);
    this.updateRivals(dt);
    this.updateTraffic(dt, false);
    this.updateHazards(dt);
    this.updateWrecks(dt);
    this.updateParticles(dt);
    this.updateFloaters(dt);
    this.updateCamera(dt);

    if (this.shake > 0) this.shake = Math.max(0, this.shake - dt * 30);

    if (!this.finished && this.player.z >= this.track.length - 50 * SEG_LEN) {
      this.player.finishTime = this.raceClock;
      this.finishRace();
      return;
    }
    if (this.player.bikeDamage >= 1 && this.player.state === "riding" && !this.bikeWrecked) {
      this.bikeWrecked = true;
      this.player.bikeDamage = 1;
      this.player.topSpeed *= 0.55;
      this.player.speed = Math.min(this.player.speed, this.player.topSpeed);
      this.onEvent("bikeWrecked");
    }
    this.emitHud();
  }

  updateWorldScrollIdle(dt) {
    // during the countdown the pack idles forward very slowly
    for (const r of this.rivals) {
      r.z += 120 * dt;
      r.punch = Math.max(0, r.punch - dt * 3);
      r.attackCd = Math.max(0, r.attackCd - dt);
    }
  }

  updatePlayer(dt) {
    const p = this.player;
    const pad = p.pad;
    p.attackCd = Math.max(0, p.attackCd - dt);
    p.punch = Math.max(0, p.punch - dt * 5);
    p.kick = Math.max(0, p.kick - dt * 4);
    p.invuln = Math.max(0, p.invuln - dt);
    p.bump = Math.max(0, p.bump - dt * 2.2);
    p.wobble = Math.max(0, p.wobble - dt * 0.9);
    p.wheelie = Math.max(0, p.wheelie - dt * 1.6);

    if (p.state === "crashed") {
      p.downTimer -= dt;
      p.bump = Math.max(0, p.bump - dt);
      if (p.downTimer <= 0) {
        p.state = "recovering";
        p.runTimer = 1.35;
        p.runPhase = 0;
        this.onEvent("getUp");
      }
      return;
    }
    if (p.state === "recovering") {
      p.runTimer -= dt;
      p.runPhase += dt * 14;
      if (p.runTimer <= 0) {
        p.state = "riding";
        p.invuln = 1.6;
        p.speed = 900;
        p.x *= 0.6;
        p.stamina = Math.max(p.stamina, 0.55);
        this.onEvent("remount");
      }
      return;
    }
    if (p.state === "busted") return;

    // ---- throttle / brake
    const maxSpeed = p.topSpeed;
    if (pad.gas) {
      p.speed += p.accel * (1 - (p.speed / maxSpeed) * 0.55) * dt;
    } else if (pad.brake) {
      p.speed -= p.brake * dt;
    } else {
      p.speed -= 900 * dt;
    }

    // ---- off-road drag
    const seg = this.segmentAt(p.z);
    const onGrass = Math.abs(p.x) > 1.0;
    if (onGrass) {
      p.speed -= 5200 * dt;
      p.wobble = Math.min(1, p.wobble + dt * 2.2);
      p.topSpeedNow = Math.min(maxSpeed, 5200);
      if (Math.random() < dt * 18) this.spawnParticles(p.z, p.x, "dust", 1);
    } else {
      p.topSpeedNow = maxSpeed;
    }
    p.speed = clamp(p.speed, 0, p.topSpeedNow || maxSpeed);

    // ---- steering + corner drift
    const speedPct = clamp(p.speed / maxSpeed, 0, 1);
    let steer = (pad.right ? 1 : 0) - (pad.left ? 1 : 0);
    if (p.wobble > 0.2) steer += Math.sin(this.time * 22) * p.wobble * 0.35;
    p.steerVisual = lerp(p.steerVisual, steer, Math.min(1, dt * 12));
    p.lean = p.steerVisual * 0.9 + (seg ? seg.curve * 0.1 * speedPct : 0);

    const grip = this.bike.grip * (1 - p.bikeDamage * 0.25);
    p.x += steer * 1.45 * grip * (0.32 + speedPct * 0.68) * dt;
    if (seg && !onGrass) p.x -= (seg.curve || 0) * 0.28 * speedPct * speedPct * dt;

    // hit the shoulder scenery
    if (Math.abs(p.x) > 1.42) {
      p.x = sign(p.x) * 1.42;
      this.crashPlayer(p.speed > 6500 ? "hard" : "scenery");
      return;
    }
    p.x = clamp(p.x, -1.4, 1.4);

    // ---- progress
    p.prevZ = p.z;
    p.z += p.speed * dt;

    // ---- stamina regen
    p.stamina = clamp(p.stamina + p.staminaRegen * dt, 0, 1);

    // ---- wheelies on hard acceleration
    if (pad.gas && p.speed < maxSpeed * 0.35 && Math.random() < dt * 4) p.wheelie = 0.7;

    // ---- collide with traffic
    for (const t of this.traffic) {
      if (t.hit > 0) continue;
      const dz = t.z - p.z;
      if (Math.abs(dz) < 150 + Math.abs(p.speed - t.speed) * dt && Math.abs(t.x - p.x) < t.hw + 0.11) {
        t.hit = 1;
        if (t.oncoming) {
          this.crashPlayer("hard");
          this.spawnParticles(t.z, t.x, "crash", 20);
        } else if (p.speed - t.speed > 3800) {
          this.crashPlayer("car");
        } else {
          this.crashPlayer("car", { soft: 0.72 });
          t.z += 40;
        }
        return;
      }
    }

    // ---- collide with loose bikes / downed riders (the BUMP)
    for (const w of this.wrecks) {
      if (w.life <= 0 || w.bounced) continue;
      if (Math.abs(w.z - p.z) < 150 + p.speed * dt && Math.abs(w.x - p.x) < 0.26) {
        w.bounced = true;
        w.hit = 1;
        this.crashPlayer("wreck", { soft: p.speed > 9000 ? 0.63 : 0.78 });
        this.player.bumps++;
        this.onEvent("bikeBump");
        return;
      }
    }

    // ---- collide with hazards (pedestrians, cows, oil)
    for (const h of this.hazards) {
      if (h.hit || h.life <= 0) continue;
      const hitX = h.kind === "cow" || h.kind === "deer" ? 0.3 : h.kind === "ped" ? 0.14 : h.kind === "club" ? 0.18 : 0.2;
      if (Math.abs(h.z - p.z) < 150 + p.speed * dt && Math.abs(h.x - p.x) < hitX + 0.1) {
        if (h.kind === "club") {
          h.hit = true;
          h.life = 0;
          this.player.weapon = { type: "club", swings: 8 };
          this.addFloater(h.z, h.x, "CLUB!", "#8de0ff");
          this.onEvent("pickup");
        } else if (h.kind === "oil") {
          h.hit = true;
          p.wobble = 1;
          p.speed *= 0.9;
          this.addFloater(p.z, p.x, "OIL!", "#c8b8a0");
          this.onEvent("slip");
        } else if (h.kind === "ped") {
          // hitting a pedestrian knocks THEM flying — you keep going
          h.hit = true;
          h.flying = true;
          h.vy = 260;
          h.vz = -600;
          h.tumble = 0;
          p.speed *= 0.9;
          p.bikeDamage = clamp(p.bikeDamage + 0.01, 0, 1);
          this.shake = Math.max(this.shake, 3);
          this.addFloater(h.z, h.x, "OOF!", "#ffd24a");
          this.onEvent("pedHit");
        } else {
          h.hit = true;
          this.crashPlayer("hard");
          this.spawnParticles(h.z, h.x, "crash", 16);
        }
        return;
      }
    }

    // ---- collide with other riders (light push)
    for (const r of this.rivals) {
      if (r.state !== "riding") continue;
      if (Math.abs(r.z - p.z) < 190 && Math.abs(r.x - p.x) < 0.19) {
        const push = sign(p.x - r.x) || 1;
        p.x = clamp(p.x + push * 0.02, -1.2, 1.2);
        r.x = clamp(r.x - push * 0.02, -1.2, 1.2);
        p.speed *= 0.995;
        r.speed *= 0.995;
      }
    }
  }

  /* --------------------------------------------------------------- AI */

  updateRivals(dt) {
    const p = this.player;
    for (const r of this.rivals) {
      r.punch = Math.max(0, r.punch - dt * 5);
      r.kick = Math.max(0, r.kick - dt * 4);
      r.bump = Math.max(0, r.bump - dt * 2.2);
      r.wobble = Math.max(0, r.wobble - dt * 0.85);
      r.attackCd = Math.max(0, r.attackCd - dt);

      if (r.state === "down") {
        r.downTimer -= dt;
        if (r.downTimer <= 0) {
          r.state = "riding";
          r.speed = 1200;
          r.x = clamp(r.x, -0.9, 0.9);
          r.wobble = 0;
        }
        continue;
      }
      if (r.state === "finished") continue;

      r.prevZ = r.z;
      const seg = this.segmentAt(r.z);
      const speedPct = clamp(r.speed / r.topSpeed, 0, 1);

      // --- pace: rubber-band a little so the pack stays a pack
      const gap = r.z - p.z;
      let target = r.topSpeed;
      // gentle rubber band: the leader eases off, the tail speeds up, so the
      // pack stays within reach without feeling like the game is cheating.
      if (gap > 18000) target *= 0.82;
      else if (gap > 9000) target *= 0.9;
      else if (gap > 3000) target *= 0.96;
      if (gap < -14000) target *= 1.08;
      else if (gap < -5000) target *= 1.04;
      if (r.isCop) target = p.speed + 260;         // cops sit on your shoulder
      if (r.wobble > 0.5) target *= 0.82;
      target *= 1 - r.bikeDamage * 0.15;
      const aiAccel = 3300 * (r.skill || 1) * (r.isCop ? 1.08 : 1);
      r.speed += clamp(target - r.speed, -6200 * dt, aiAccel * dt);
      r.speed = Math.max(600, r.speed);

      // --- steering: follow the curve, hold a lane, dodge danger
      let wantX = r.lane;
      const lookahead = clamp(r.speed * 0.55, 900, 7000);
      const threat = this.findThreat(r, lookahead);
      if (threat) {
        const dir = threat.x > r.x ? -1 : 1;
        wantX = clamp(r.x + dir * 0.5, -0.95, 0.95);
        r.dodge = 1;
      } else {
        r.dodge = Math.max(0, (r.dodge || 0) - dt);
        if (seg) wantX -= (seg.curve || 0) * 0.06;
        if (Math.abs(wantX) > 0.95) r.lane = clamp(-r.lane, -0.85, 0.85);
      }

      // aggressive riders close in on the player to fight
      if (!r.isCop && r.aggression > 0.55 && Math.abs(gap) < 2600 && Math.abs(p.z - r.z) < 2600) {
        if (p.state === "riding" && Math.abs(p.speed - r.speed) < 2500) {
          wantX = clamp(p.x + (r.x > p.x ? 0.3 : -0.3), -0.95, 0.95);
        }
      }
      if (r.isCop) {
        // cops ride alongside, then shove
        wantX = clamp(p.x + 0.34 * (r.x > p.x ? 1 : -1), -0.95, 0.95);
      }

      const steering = clamp((wantX - r.x) * 2.4, -1, 1);
      r.x += steering * 1.35 * (0.35 + speedPct * 0.65) * dt;
      if (seg && Math.abs(r.x) < 1) r.x -= seg.curve * 0.25 * speedPct * speedPct * dt;
      r.lean = lerp(r.lean, steering * 0.8, Math.min(1, dt * 8));

      // --- off road / hitting something on the shoulder
      if (Math.abs(r.x) > 1.06) {
        r.x = sign(r.x) * 1.06;
        r.speed *= 0.985;
        r.wobble = Math.min(1, r.wobble + dt * 1.4);
        if (Math.abs(r.x) > 1.04 && Math.random() < dt * 0.25) {
          this.knockOffRival(r, "scenery");
          continue;
        }
      }

      r.z += r.speed * dt;

      // --- AI vs traffic
      for (const t of this.traffic) {
        if (t.hit > 0) continue;
        const dz = t.z - r.z;
        if (Math.abs(dz) < 150 + Math.abs(r.speed - t.speed) * dt && Math.abs(t.x - r.x) < t.hw + 0.1) {
          t.hit = 1;
          if (t.oncoming || r.speed - t.speed > 3600) {
            this.knockOffRival(r, "traffic");
          } else {
            r.speed *= 0.8;
            r.wobble = 1;
          }
          break;
        }
      }
      if (r.state !== "riding") continue;

      // --- AI brawling
      const dzP = Math.abs(p.z - r.z);
      const dxP = Math.abs(p.x - r.x);
      if (p.state === "riding" && dzP < 760 && dxP < 0.5 && r.attackCd <= 0) {
        const willFight = r.isCop ? true : Math.random() < 0.35 + r.aggression * 0.5;
        if (willFight) {
          r.attackCd = r.isCop ? 1.4 : rand(0.7, 1.9);
          const weapon = r.weapon && r.weapon.type === "club";
          if (weapon) {
            r.punch = 1;
            r.weapon.swings--;
            if (r.weapon.swings <= 0) r.weapon = null;
          } else if (Math.random() < 0.5) {
            r.punch = 1;
          } else {
            r.kick = 1;
          }
          r.attackSide = sign(p.x - r.x) || 1;
          const dmg = (weapon ? 0.11 : r.kick > 0 ? 0.075 : 0.055) * (0.7 + r.aggression * 0.5);
          p.stamina = clamp(p.stamina - dmg, 0, 1);
          p.wobble = Math.min(1, p.wobble + (weapon ? 0.5 : 0.25));
          p.x = clamp(p.x + sign(p.x - r.x || 1) * (weapon ? 0.08 : 0.045), -1.2, 1.2);
          p.bump = 0.7;
          this.shake = Math.max(this.shake, weapon ? 5 : 2.5);
          this.spawnParticles(p.z, p.x, "spark", 5);
          this.addFloater(p.z, p.x, weapon ? "THWACK!" : "OOF!", "#ff8a6a");
          this.onEvent(weapon ? "clang" : "getHit");
          if (p.stamina <= 0) {
            this.crashPlayer("beaten");
          }
        }
      }

      // --- cops: catch the player while they're still tangled in the wreck
      if (r.isCop && p.state === "crashed" && p.downTimer < 1.15) {
        const dz = Math.abs(p.z - r.z);
        if (dz < 620 && this.state === "racing") {
          this.busted();
          return;
        }
        if (dz < 4200) {
          this.warning = "PATROL CLOSING IN";
          this.warningTimer = 0.8;
        }
      }

      // --- AI vs AI nudges to avoid stacking
      for (const o of this.rivals) {
        if (o === r || o.state !== "riding") continue;
        if (Math.abs(o.z - r.z) < 150 && Math.abs(o.x - r.x) < 0.15) {
          const push = sign(r.x - o.x) || 1;
          r.x = clamp(r.x + push * 0.03, -1.2, 1.2);
          o.x = clamp(o.x - push * 0.03, -1.2, 1.2);
        }
      }

      if (r.z >= this.track.length - 50 * SEG_LEN && !r.finishTime) {
        r.finishTime = this.raceClock;
        r.state = "finished";
      }
    }

    // retired wrecks
    for (const r of this.rivals) {
      if (!r.finishTime) continue;
      r.speed = Math.max(0, r.speed - 4000 * dt);
      r.z += r.speed * dt;
    }
  }

  findThreat(r, lookahead) {
    let best = null;
    let bestDz = lookahead;
    for (const t of this.traffic) {
      if (t.hit > 0) continue;
      const dz = t.z - r.z;
      if (dz > 0 && dz < bestDz && Math.abs(t.x - r.x) < t.hw + 0.24) {
        bestDz = dz;
        best = t;
      }
    }
    for (const h of this.hazards) {
      if (h.hit) continue;
      if (h.kind === "oil") continue;
      const dz = h.z - r.z;
      if (dz > 0 && dz < bestDz && Math.abs(h.x - r.x) < 0.3) {
        bestDz = dz;
        best = h;
      }
    }
    for (const w of this.wrecks) {
      if (w.life <= 0 || w.bounced) continue;
      const dz = w.z - r.z;
      if (dz > 0 && dz < bestDz && Math.abs(w.x - r.x) < 0.3) {
        bestDz = dz;
        best = w;
      }
    }
    return best;
  }

  /* ----------------------------------------------------------- traffic */

  updateTraffic(dt, frozen) {
    const camZ = this.camera.z;
    const rearLimit = camZ - 1400;
    const frontLimit = camZ + DRAW_DISTANCE * SEG_LEN;
    const p = this.player;

    for (const t of this.traffic) {
      if (frozen) continue;
      t.z += t.speed * dt;
      if (t.hit > 0) {
        t.hit -= dt;
        t.speed *= 0.97;
      }
      t.brake = !t.oncoming && p.state === "riding" && Math.abs(p.z - t.z) < 900 && t.speed > p.speed;
    }
    // recycle
    this.traffic = this.traffic.filter((t) => t.z > rearLimit && t.z < frontLimit + SEG_LEN * 40);
    // spawn ahead
    if (!frozen) {
      let furthest = frontLimit;
      for (const t of this.traffic) furthest = Math.max(furthest, t.z);
      const spawnSpan = this.trafficGap();
      while (furthest < frontLimit + spawnSpan) {
        furthest += this.trafficGap();
        this.spawnTrafficAt(furthest);
      }
    }
  }

  /* ---------------------------------------------------------- hazards */

  updateHazards(dt) {
    const camZ = this.camera.z;
    const frontLimit = camZ + DRAW_DISTANCE * SEG_LEN;
    // spawn new hazards on the road ahead
    if (Math.random() < dt * 0.75) {
      const onRoad = Math.random() < 0.55;
      const kind = pick(["ped", "ped", "ped", "cow", "deer", "oil", "club"]);
      const z = camZ + rand(12000, DRAW_DISTANCE * SEG_LEN);
      if (kind === "ped") {
        this.hazards.push({
          id: ENTITY_ID++,
          kind,
          z,
          x: onRoad ? rand(-0.95, 0.95) : (Math.random() < 0.5 ? -1 : 1) * rand(1.05, 1.35),
          vx: 0,
          vz: 0,
          walk: rand(4, 7),
          phase: rand(0, 6.28),
          dir: Math.random() < 0.5 ? -1 : 1,
          shirt: pick(PED_SHIRTS),
          pants: pick(PED_PANTS),
          skin: pick(["#e6b48a", "#c48b62", "#8f6244", "#f0c9a0"]),
          hit: false,
          life: 26,
        });
      } else if (kind === "cow" || kind === "deer") {
        this.hazards.push({
          id: ENTITY_ID++,
          kind,
          z,
          x: (Math.random() < 0.5 ? -1 : 1) * rand(0.7, 1.1),
          dir: Math.random() < 0.5 ? -1 : 1,
          vx: 0,
          vz: 0,
          walk: kind === "cow" ? 1.2 : 2.2,
          phase: rand(0, 6.28),
          hit: false,
          life: 30,
        });
      } else if (kind === "oil") {
        this.hazards.push({ id: ENTITY_ID++, kind: "oil", z, x: rand(-0.8, 0.8), w: rand(0.16, 0.3), hit: false, life: 40 });
      } else {
        this.hazards.push({ id: ENTITY_ID++, kind: "club", z, x: rand(-0.7, 0.7), hit: false, life: 30, phase: rand(0, 6.28) });
      }
    }

    for (const h of this.hazards) {
      if (h.hit) {
        h.life -= dt;
        if (h.kind === "ped" && h.flying) {
          h.vy -= 900 * dt;
          h.y = (h.y || 0) + h.vy * dt;
          h.z += h.vz * 0.2;
          h.tumble = (h.tumble || 0) + dt * 9;
          if (h.y < -400) h.flying = false;
        }
        continue;
      }
      if (h.kind === "ped") {
        h.phase += dt * h.walk;
        h.life -= dt;
        // pedestrians drift across the road — the classic Road Rash hazard
        h.x += h.dir * 0.045 * dt;
        if (Math.abs(h.x) > 1.35) {
          h.dir *= -1;
          h.x = sign(h.x) * 1.35;
        }
        if (h.z - this.player.z < -2000) h.life = Math.min(h.life, 1);
      } else if (h.kind === "cow" || h.kind === "deer") {
        h.phase += dt * h.walk * 2;
        h.life -= dt;
        h.x += h.dir * (h.kind === "cow" ? 0.06 : 0.1) * dt;
        if (Math.abs(h.x) > 1.25) {
          h.dir *= -1;
          h.x = sign(h.x) * 1.25;
        }
      } else {
        h.life -= dt;
      }
    }
    this.hazards = this.hazards.filter((h) => h.life > 0 && h.z > camZ - 4000 && h.z < frontLimit + 8000);
  }

  updateWrecks(dt) {
    for (const w of this.wrecks) {
      w.life -= dt;
      w.spinVel *= 1 - dt * 1.5;
      w.bikeSpin += w.spinVel * dt;
      if (w.rider && w.rider.state === "riding") w.life = Math.min(w.life, 0.6);
    }
    this.wrecks = this.wrecks.filter((w) => w.life > 0);
  }

  spawnParticles(z, x, kind, n) {
    for (let i = 0; i < n; i++) {
      this.particles.push({
        z,
        x,
        y: kind === "spark" ? 0.5 : 0.1,
        vx: rand(-1.4, 1.4),
        vy: rand(0.4, 2.6) * (kind === "spark" ? 1 : 0.4),
        vz: rand(-500, 500),
        life: rand(0.25, 0.8),
        max: 0.8,
        kind,
        size: rand(0.5, 1.4),
        color: kind === "spark" ? pick(["#ffe08a", "#ffb03a", "#fff6d0"]) : pick(["#d9c9a8", "#bfae8f", "#8c7f6a"]),
      });
    }
    if (this.particles.length > 400) this.particles.splice(0, this.particles.length - 400);
  }

  updateParticles(dt) {
    for (const pt of this.particles) {
      pt.life -= dt;
      pt.z += pt.vz * dt;
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
      pt.vy -= 3.2 * dt;
      if (pt.y < 0) {
        pt.y = 0;
        pt.vy *= -0.35;
        pt.vx *= 0.7;
      }
    }
    this.particles = this.particles.filter((p) => p.life > 0);
  }

  addFloater(z, x, text, color) {
    this.floaters.push({ z, x, text, color, life: 0.9, max: 0.9 });
  }

  updateFloaters(dt) {
    for (const f of this.floaters) f.life -= dt;
    this.floaters = this.floaters.filter((f) => f.life > 0);
  }

  /* ------------------------------------------------------------ camera */

  updateCamera(dt) {
    const p = this.player;
    const seg = this.segmentAt(p.z + 900);
    const targetY = CAMERA_HEIGHT + (seg ? seg.p1.world.y : 0);
    this.camera.x = lerp(this.camera.x, p.x * ROAD_WIDTH, Math.min(1, dt * 9));
    this.camera.z = p.z - 900;
    this.camera.y = lerp(this.camera.y, targetY, Math.min(1, dt * 5));
    this.camera.depth = cameraDepthFor(100);
  }

  segmentAt(z) {
    const i = clamp(Math.floor(z / SEG_LEN), 0, this.track.segments.length - 1);
    return this.track.segments[i];
  }

  /* ------------------------------------------------------------ helpers */

  projectToScreen(worldX, worldY, worldZ) {
    const p = { world: { x: worldX, y: worldY, z: worldZ }, camera: {}, screen: {} };
    project(p, this.camera.x, this.camera.y, this.camera.z, this.camera.depth, this.width, this.height, ROAD_WIDTH);
    return p;
  }

  pause() {
    if (this.state === "racing" || this.state === "countdown") {
      this.prevState = this.state;
      this.state = "paused";
    }
  }

  resume() {
    if (this.state === "paused") {
      this.state = this.prevState || "racing";
      this.prevState = null;
    }
  }
}

export { LEVELS, BIKE_MODELS as BIKES };
