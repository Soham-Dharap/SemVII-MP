/* =========================================================================
   render.js — pseudo-3D road renderer + in-race HUD.
   The camera looks down a chain of projected road segments; every prop,
   rider and car is pinned to a segment so it scales and curves with it.
   ========================================================================= */

import {
  drawRiderOnBike,
  drawVehicle,
  drawScenery,
  drawPedestrian,
  drawWreckedRider,
  drawLooseBike,
  drawWeaponPickup,
  drawRunningRider,
  drawGauge,
} from "./art.js";
import { SEG_LEN, ROAD_WIDTH, DRAW_DISTANCE, FOG_DENSITY, project } from "./road.js";
import { clamp, lerp, roundRect, formatTime, ordinal } from "./util.js";

/* --------------------------------------------------------- colour tools */

const hexCache = new Map();
function hexToRgb(hex) {
  if (hexCache.has(hex)) return hexCache.get(hex);
  if (hex.startsWith("rgb")) {
    const v = hex.slice(hex.indexOf("(") + 1, -1).split(",").map((n) => parseFloat(n));
    hexCache.set(hex, v);
    return v;
  }
  let h = hex.replace("#", "");
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  const v = [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  hexCache.set(hex, v);
  return v;
}

const mixCache = new Map();
function mix(a, b, t) {
  t = clamp(t, 0, 1);
  const key = a + "|" + b + "|" + t.toFixed(3);
  if (mixCache.has(key)) return mixCache.get(key);
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  const c = `rgb(${Math.round(A[0] + (B[0] - A[0]) * t)},${Math.round(A[1] + (B[1] - A[1]) * t)},${Math.round(A[2] + (B[2] - A[2]) * t)})`;
  mixCache.set(key, c);
  return c;
}

const FOG_STEPS = 12;
function fogColor(theme, color, fog) {
  const step = Math.round(clamp(fog, 0, 1) * FOG_STEPS);
  if (step <= 0) return color;
  return mix(color, theme.fog, step / FOG_STEPS);
}

const paletteCache = new Map();
function palette(theme) {
  if (paletteCache.has(theme.id)) return paletteCache.get(theme.id);
  const build = (key) => {
    const arr = [];
    for (let i = 0; i <= FOG_STEPS; i++) arr.push(mix(theme[key], theme.fog, i / FOG_STEPS));
    return arr;
  };
  const roadFog = mix(theme.fog, theme.road, 0.5);
  const buildRoad = (key) => {
    const arr = [];
    for (let i = 0; i <= FOG_STEPS; i++) arr.push(mix(theme[key], roadFog, i / FOG_STEPS));
    return arr;
  };
  const pal = {
    ground: build("ground"),
    groundDark: build("groundDark"),
    road: buildRoad("road"),
    roadDark: buildRoad("roadDark"),
    rumbleA: buildRoad("rumbleA"),
    rumbleB: buildRoad("rumbleB"),
    lane: buildRoad("lane"),
  };
  paletteCache.set(theme.id, pal);
  return pal;
}

function fogStep(n, total, density) {
  return Math.min(0.86, 1 - Math.exp((-density * n) / total));
}

/* ------------------------------------------------------------- main entry */

export function render(ctx, game, w, h) {
  const theme = game.theme;
  if (!theme || !game.track) return;
  const pal = palette(theme);
  const camera = game.camera;
  const depth = camera.depth;

  ctx.save();
  ctx.clearRect(0, 0, w, h);

  let shakeX = 0;
  let shakeY = 0;
  if (game.shake > 0.3) {
    shakeX = (Math.random() - 0.5) * game.shake;
    shakeY = (Math.random() - 0.5) * game.shake * 0.7;
    ctx.translate(shakeX, shakeY);
  }


  const segs = game.track.segments;
  const segCount = segs.length;
  const baseIdx = clamp(Math.floor(camera.z / SEG_LEN), 0, segCount - 1);
  const basePercent = (camera.z % SEG_LEN) / SEG_LEN;

  /* --- project the road chain once, near to far ------------------------ */
  let x = 0;
  let dx = -(segs[baseIdx].curve * basePercent);
  let maxy = h;
  const visible = [];
  let horizon = h * 0.5;

  for (let n = 0; n < DRAW_DISTANCE; n++) {
    const idx = (baseIdx + n) % segCount;
    const seg = segs[idx];
    const fog = fogStep(n, DRAW_DISTANCE, FOG_DENSITY);
    seg._x = x;
    seg._fog = fog;

    project(seg.p1, camera.x - x, camera.y, camera.z, depth, w, h, ROAD_WIDTH);
    project(seg.p2, camera.x - x - dx, camera.y, camera.z, depth, w, h, ROAD_WIDTH);

    x += dx;
    dx += seg.curve;

    seg._clip = maxy;
    if (seg.p1.camera.z <= depth) continue;
    if (seg.p2.screen.y >= seg.p1.screen.y) continue;
    if (seg.p2.screen.y >= maxy) continue;

    visible.push({ seg, fog });
    maxy = seg.p2.screen.y;
    horizon = Math.min(horizon, seg.p2.screen.y);
  }

  drawSky(ctx, game, w, h, theme);
  drawLandscape(ctx, game, w, h, theme, horizon);

  /* --- bucket moving entities into segments ---------------------------- */
  const buckets = new Map();
  const addEntity = (entity, draw) => {
    const segIdx = clamp(Math.floor(entity.z / SEG_LEN), 0, segCount - 1);
    if (!buckets.has(segIdx)) buckets.set(segIdx, []);
    buckets.get(segIdx).push({ entity, draw });
  };

  for (const r of game.rivals) {
    if (r.state !== "riding") continue;
    addEntity(r, (e, pid) => drawRival(ctx, game, r, pid));
  }
  for (const t of game.traffic) addEntity(t, (e, pid) => drawTraffic(ctx, game, t, pid));
  for (const hz of game.hazards) addEntity(hz, (e, pid) => drawHazard(ctx, game, hz, pid));
  for (const wr of game.wrecks) addEntity(wr, (e, pid) => drawWreck(ctx, game, wr, pid));
  for (const pt of game.particles) addEntity(pt, (e, pid) => drawParticle(ctx, game, pt, pid));

  /* --- paint road segments near -> far -------------------------------- */
  for (let i = 0; i < visible.length; i++) {
    const { seg, fog } = visible[i];
    const p1 = seg.p1.screen;
    const p2 = seg.p2.screen;
    const clipY = seg._clip != null ? seg._clip : h;
    const step = Math.round(fog * FOG_STEPS);

    drawSegment(ctx, seg, p1, p2, w, h, pal, step, theme);

    // roadside props
    for (const sp of seg.sprites) {
      if (sp.crowd) {
        drawCrowd(ctx, game, seg, sp, clipY);
      } else {
        drawProp(ctx, seg, sp, clipY);
      }
    }

  }

  /* --- moving things last, far -> near so they stack correctly --------- */
  for (let i = visible.length - 1; i >= 0; i--) {
    const { seg } = visible[i];
    const bucket = buckets.get(seg.index);
    if (!bucket) continue;
    const clipY = seg._clip != null ? seg._clip : h;
    bucket.sort((a, b) => b.entity.z - a.entity.z);
    for (const item of bucket) {
      if (item.entity.z < camera.z + 350) continue;
      item.draw(item.entity, clipY);
    }
  }

  /* --- score floaters -------------------------------------------------- */
  for (const f of game.floaters) drawFloater(ctx, game, f, w, h);

  /* --- the player's own rider ----------------------------------------- */
  drawPlayer(ctx, game, w, h);

  ctx.restore();

  drawHud(ctx, game, w, h);
}

/* ------------------------------------------------------------------ sky */

let skyCache = { key: "", grad: null };

function drawSky(ctx, game, w, h, theme) {
  const key = theme.id + w + "x" + h;
  if (skyCache.key !== key) {
    const g = ctx.createLinearGradient(0, 0, 0, h * 0.66);
    g.addColorStop(0, theme.skyTop);
    g.addColorStop(0.62, theme.skyMid);
    g.addColorStop(1, theme.skyBottom);
    skyCache = { key, grad: g };
  }
  ctx.fillStyle = skyCache.grad;
  ctx.fillRect(-40, -40, w + 80, h * 0.72 + 40);

  const camX = game.camera.x;

  // sun
  const sunX = w * 0.74 - camX * 0.0015;
  const sunY = h * 0.19;
  const sunR = Math.min(w, h) * 0.062;
  const glow = ctx.createRadialGradient(sunX, sunY, sunR * 0.2, sunX, sunY, sunR * 3.6);
  glow.addColorStop(0, "rgba(255,246,214,0.75)");
  glow.addColorStop(0.42, "rgba(255,232,180,0.16)");
  glow.addColorStop(1, "rgba(255,232,180,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(sunX - sunR * 3.6, sunY - sunR * 3.6, sunR * 7.2, sunR * 7.2);
  ctx.fillStyle = theme.sun;
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
  ctx.fill();

  // clouds — slow drift, small and layered
  const t = game.time || 0;
  for (let i = 0; i < 7; i++) {
    const speed = 7 + i * 4;
    const span = w + 520;
    const cx = (((i * 271 + t * speed - camX * 0.008) % span) + span) % span - 260;
    const cy = h * (0.05 + ((i * 7) % 5) * 0.028);
    const cw = 42 + ((i * 37) % 46);
    ctx.fillStyle = i % 3 === 0 ? "rgba(255,255,255,0.34)" : "rgba(255,255,255,0.22)";
    ctx.beginPath();
    ctx.ellipse(cx, cy, cw, cw * 0.22, 0, 0, Math.PI * 2);
    ctx.ellipse(cx + cw * 0.55, cy + cw * 0.05, cw * 0.58, cw * 0.16, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

/** Horizon haze, distant ridges, then the ground plane. */
function drawLandscape(ctx, game, w, h, theme, horizon) {
  const baseY = Math.max(h * 0.18, Math.min(h * 0.92, horizon));
  const camX = game.camera.x;
  const z = game.player ? game.player.z : 0;

  // ground plane first, ridges sit on top of the horizon line
  const haze = mix(theme.ground, theme.fog, 0.3);
  const g = ctx.createLinearGradient(0, baseY - h * 0.012, 0, h);
  g.addColorStop(0, haze);
  g.addColorStop(0.06, theme.ground);
  g.addColorStop(1, theme.groundDark);
  ctx.fillStyle = g;
  ctx.fillRect(-40, baseY - h * 0.012, w + 80, h - baseY + h * 0.012 + 40);

  const layers = [
    { color: theme.farHills, amp: 0.085, lift: 0.055, speed: 0.0022, seed: 1.7, alpha: 0.7 },
    { color: theme.nearHills, amp: 0.05, lift: 0.014, speed: 0.006, seed: 3.1, alpha: 0.9 },
  ];
  for (const layer of layers) {
    const shift = -camX * layer.speed - z * 0.00004;
    ctx.globalAlpha = layer.alpha;
    ctx.fillStyle = layer.color;
    ctx.beginPath();
    ctx.moveTo(-60, baseY + 8);
    const stepW = 26;
    for (let px = -60; px <= w + 60; px += stepW) {
      const u = (px + shift) * 0.0042;
      const ridge =
        Math.sin(u * 1.9 + layer.seed) * 0.55 +
        Math.sin(u * 0.6 + layer.seed * 2.3) * 0.3 +
        Math.sin(u * 4.1 + layer.seed) * 0.15;
      const y = baseY - (ridge * 0.5 + 0.5) * h * layer.amp - h * layer.lift;
      ctx.lineTo(px, y);
    }
    ctx.lineTo(w + 60, baseY + 8);
    ctx.closePath();
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function quad(ctx, x1, y1, w1, x2, y2, w2, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x1 - w1, y1);
  ctx.lineTo(x1 + w1, y1);
  ctx.lineTo(x2 + w2, y2);
  ctx.lineTo(x2 - w2, y2);
  ctx.closePath();
  ctx.fill();
}

function drawSegment(ctx, seg, p1, p2, w, h, pal, step, theme) {
  const light = Math.floor(seg.index / 4) % 2 === 0;
  const ground = light ? pal.ground[step] : pal.groundDark[step];
  const road = light ? pal.road[step] : pal.roadDark[step];
  const tall = p1.y - p2.y;

  // grass band
  ctx.fillStyle = ground;
  ctx.fillRect(0, p2.y, w, tall + 1);

  // Far segments are a couple of pixels tall — paint one flat quad and move on.
  if (tall < 3) {
    quad(ctx, p1.x, p1.y, p1.w * 1.06, p2.x, p2.y, p2.w * 1.06, light ? pal.rumbleA[step] : pal.rumbleB[step]);
    quad(ctx, p1.x, p1.y, p1.w, p2.x, p2.y, p2.w, road);
    if (seg.finish || seg.startLine) {
      ctx.fillStyle = light ? "#f4efe3" : "#242028";
      ctx.fillRect(p1.x - p1.w, p2.y, p1.w * 2, tall + 1);
    }
    return;
  }

  // shoulder (dirt strip)
  const shoulder = light ? pal.groundDark[step] : pal.ground[step];
  quad(ctx, p1.x, p1.y, p1.w * 1.16, p2.x, p2.y, p2.w * 1.16, shoulder);

  // rumble strips
  const rumble = light ? pal.rumbleA[step] : pal.rumbleB[step];
  quad(ctx, p1.x, p1.y, p1.w * 1.02, p2.x, p2.y, p2.w * 1.02, rumble);

  // tarmac
  quad(ctx, p1.x, p1.y, p1.w, p2.x, p2.y, p2.w, road);

  // centre line (oncoming traffic) + lane dashes
  const laneColor = pal.lane[step];
  quad(ctx, p1.x, p1.y, p1.w * 0.012, p2.x, p2.y, p2.w * 0.012, mix(theme.lane, "#e8b64a", 0.55));
  if (seg.index % 8 < 4) {
    for (const off of [-0.5, 0.5]) {
      quad(ctx, p1.x + p1.w * off, p1.y, p1.w * 0.014, p2.x + p2.w * off, p2.y, p2.w * 0.014, laneColor);
    }
  }

  // edge lines
  const edge = pal.lane[step];
  quad(ctx, p1.x - p1.w * 0.985, p1.y, p1.w * 0.01, p2.x - p2.w * 0.985, p2.y, p2.w * 0.01, edge);
  quad(ctx, p1.x + p1.w * 0.985, p1.y, p1.w * 0.01, p2.x + p2.w * 0.985, p2.y, p2.w * 0.01, edge);

  // start / finish checkerboard
  if (seg.finish || seg.startLine) {
    const sq = p1.w * 0.14;
    ctx.fillStyle = "#f4efe3";
    ctx.fillRect(p1.x - p1.w, p2.y, p1.w * 2, tall);
    ctx.fillStyle = "#242028";
    for (let i = -7; i <= 7; i++) {
      if ((i + (light ? 0 : 1)) % 2 === 0) continue;
      ctx.fillRect(p1.x + i * sq, p2.y, sq, tall);
    }
  }
}

/* ------------------------------------------------------------- sprites */

function drawProp(ctx, seg, sp, clipY) {
  const wpx = seg.p1.screen.w;
  const baseY = seg.p1.screen.y + (seg.p2.screen.y - seg.p1.screen.y) * 0.5;
  if (baseY > clipY + 2) return;
  const x = seg.p1.screen.x + wpx * sp.offset;
  const s = wpx * sp.scale * 0.6;
  if (s < 0.6 || s > wpx * 4) return;
  ctx.save();
  ctx.translate(x, baseY);
  ctx.globalAlpha = 1 - seg._fog * 0.85;
  drawScenery(ctx, s, sp.kind);
  ctx.restore();
}

function drawCrowd(ctx, game, seg, sp, clipY) {
  const wpx = seg.p1.screen.w;
  const baseY = seg.p1.screen.y + (seg.p2.screen.y - seg.p1.screen.y) * 0.5;
  if (baseY > clipY + 2) return;
  const s = charScale(game, seg.p1.camera.z, 0.5) * sp.scale;
  if (s < 1.2) return;
  const n = sp.crowd;
  for (let i = 0; i < n; i++) {
    const x = seg.p1.screen.x + wpx * (sp.offset + i * 0.06 - n * 0.03);
    ctx.save();
    ctx.translate(x, baseY);
    ctx.globalAlpha = 1 - seg._fog * 0.8;
    drawPedestrian(ctx, s * (0.9 + (i % 3) * 0.07), {
      phase: (game.time || 0) * 3 + i * 2,
      shirt: ["#d9542e", "#3f7ab8", "#e0b23c", "#7a4a8f"][i % 4],
      pants: "#2b3550",
      skin: "#e0b489",
      flip: i % 2 === 0,
    });
    ctx.restore();
  }
}

/** On-screen size of the player's own rider — the reference for every sprite. */
export function playerSpriteScale(w, h) {
  return Math.min(w, h * 1.3) * 0.175;
}

/** Exaggerated perspective for characters: sprite racers shrink faster than
 *  the road does, which is what makes distance read at 200 km/h. */
function charScale(game, dist, k = 1) {
  const base = playerSpriteScale(game.width, game.height);
  const persp = clamp(900 / Math.max(700, dist), 0.05, 1.15);
  return base * persp * k;
}

function projectEntity(game, seg, entity, w, h) {
  const wx = entity.x * ROAD_WIDTH;
  const wy = seg.p1.world.y;
  const wz = entity.z;
  const p = { world: { x: wx, y: wy, z: wz }, camera: {}, screen: {} };
  project(p, game.camera.x - (seg._x || 0), game.camera.y, game.camera.z, game.camera.depth, w, h, ROAD_WIDTH);
  return p;
}

function entityBase(game, e, clipY) {
  const segs = game.track.segments;
  const segIdx = clamp(Math.floor(e.z / SEG_LEN), 0, segs.length - 1);
  const seg = segs[segIdx];
  if (seg._x === undefined) return null;
  const p = projectEntity(game, seg, e, game.width, game.height);
  if (p.screen.scale <= 0) return null;
  if (p.camera.z < 520) return null;              // passed / under the camera
  if (p.screen.y > game.height * 1.02) return null;
  p.fade = clamp((p.camera.z - 520) / 700, 0, 1);   // only fade as they slide under us
  if (p.screen.y > clipY + 4) return null;
  return p;
}

function drawRival(ctx, game, r, clipY) {
  const p = entityBase(game, r, clipY, game.width, game.height);
  if (!p) return;
  const wpx = p.screen.w;
  const s = charScale(game, p.camera.z, 1);
  if (s < 2.5) return;
  ctx.save();
  ctx.translate(p.screen.x, p.screen.y);
  ctx.globalAlpha = 1;
  drawRiderOnBike(ctx, s, {
    colors: r.colors,
    lean: r.lean,
    punch: r.punch,
    punchSide: r.attackSide,
    kick: r.kick,
    wobble: r.wobble,
    wheelie: r.wheelie,
  });
  ctx.restore();
  // little stamina pip above wounded rivals
  if (r.stamina < 0.92 && s > 14) {
    const bw = s * 0.9;
    const bh = Math.max(2, s * 0.075);
    const bx = p.screen.x - bw / 2;
    const by = p.screen.y - s * 1.45;
    ctx.fillStyle = "rgba(12,10,16,0.6)";
    ctx.fillRect(bx - 1, by - 1, bw + 2, bh + 2);
    ctx.fillStyle = r.isCop ? "#6fc4ff" : r.stamina > 0.5 ? "#7ee07a" : r.stamina > 0.22 ? "#f0c040" : "#f05a3c";
    ctx.fillRect(bx, by, bw * r.stamina, bh);
  }
}

function drawTraffic(ctx, game, t, clipY) {
  const p = entityBase(game, t, clipY, game.width, game.height);
  if (!p) return;
  const wpx = p.screen.w;
  if (wpx < 2 || wpx * t.hw * 2 > game.width * 0.8) return;
  ctx.save();
  ctx.globalAlpha = p.fade != null ? p.fade : 1;
  ctx.translate(p.screen.x, p.screen.y);
  drawVehicle(ctx, wpx * t.hw * 2, { kind: t.kind, color: t.color, oncoming: t.oncoming, brake: t.brake });
  ctx.restore();
}

function drawWreck(ctx, game, wr, clipY) {
  const p = entityBase(game, wr, clipY, game.width, game.height);
  if (!p) return;
  const wpx = p.screen.w;
  if (wpx < 2 || wpx > game.width * 0.6) return;
  ctx.save();
  ctx.globalAlpha = p.fade != null ? p.fade : 1;
  ctx.translate(p.screen.x, p.screen.y);
  if (wr.rider && wr.rider.state === "down" && wr.life > 0.4) {
    drawWreckedRider(ctx, wpx * 0.40, { colors: wr.colors, tilt: wr.tilt });
  } else {
    drawLooseBike(ctx, wpx * 0.42, { colors: wr.colors, spin: wr.bikeSpin * 0.4 });
  }
  ctx.restore();
}

function drawHazard(ctx, game, hz, clipY) {
  const p = entityBase(game, hz, clipY, game.width, game.height);
  if (!p) return;
  const wpx = p.screen.w;
  const s = charScale(game, p.camera.z, 0.62);
  if (wpx < 1.5 || s < 2) return;
  ctx.save();
  ctx.globalAlpha = p.fade != null ? p.fade : 1;
  ctx.translate(p.screen.x, p.screen.y);

  if (hz.kind === "oil") {
    ctx.fillStyle = "rgba(24,22,30,0.62)";
    ctx.beginPath();
    ctx.ellipse(0, 0, wpx * (hz.w || 0.2), wpx * 0.055, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(90,140,160,0.35)";
    ctx.beginPath();
    ctx.ellipse(-wpx * 0.05, -wpx * 0.01, wpx * 0.09, wpx * 0.02, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (hz.kind === "ped") {
    ctx.save();
    if (hz.hit && hz.flying) {
      ctx.translate(0, -(hz.y || 0) * 0.0012 * wpx);
      ctx.rotate(hz.tumble || 0);
    }
    drawPedestrian(ctx, s, {
      phase: hz.phase,
      shirt: hz.shirt,
      pants: hz.pants,
      skin: hz.skin,
      flip: hz.dir < 0,
    });
    ctx.restore();
  } else if (hz.kind === "cow" || hz.kind === "deer") {
    drawScenery(ctx, s * 1.6, hz.kind);
  } else if (hz.kind === "club") {
    drawWeaponPickup(ctx, s * 0.8, (game.time || 0) + hz.phase);
  }
  ctx.restore();
}

function drawParticle(ctx, game, pt, clipY) {
  const p = entityBase(game, { x: pt.x, z: pt.z }, clipY, game.width, game.height);
  if (!p) return;
  const alpha = clamp(pt.life / pt.max, 0, 1);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = pt.color;
  const r = Math.max(0.6, p.screen.w * 0.012 * pt.size);
  ctx.beginPath();
  ctx.arc(p.screen.x, p.screen.y - pt.y * p.screen.w * 0.06, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

function drawFloater(ctx, game, f, w, h) {
  const segs = game.track.segments;
  const seg = segs[clamp(Math.floor(f.z / SEG_LEN), 0, segs.length - 1)];
  if (seg._x === undefined) return;
  const p = { world: { x: f.x * ROAD_WIDTH, y: seg.p1.world.y, z: f.z }, camera: {}, screen: {} };
  project(p, game.camera.x - seg._x, game.camera.y, game.camera.z, game.camera.depth, w, h, ROAD_WIDTH);
  if (p.screen.scale <= 0 || p.camera.z < 700) return;
  const t = f.life / f.max;
  const size = clamp(p.screen.w * 0.075, 11, 30);
  ctx.save();
  ctx.globalAlpha = clamp(t * 1.6, 0, 1);
  ctx.translate(clamp(p.screen.x, 70, w - 70), p.screen.y - size * 1.6 - (1 - t) * size * 3.2);
  ctx.rotate(-0.06);
  ctx.font = `900 ${size}px "Arial Black", system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.lineWidth = size * 0.18;
  ctx.strokeStyle = "rgba(20,14,24,0.85)";
  ctx.strokeText(f.text, 0, 0);
  ctx.fillStyle = f.color;
  ctx.fillText(f.text, 0, 0);
  ctx.restore();
}

/* -------------------------------------------------------------- player */

function drawPlayer(ctx, game, w, h) {
  const p = game.player;
  const s = playerSpriteScale(w, h);

  // dust / speed blur at the edges
  if (p.speed > p.topSpeed * 0.7) {
    const a = clamp((p.speed / p.topSpeed - 0.7) / 0.3, 0, 1) * 0.16;
    const g = ctx.createLinearGradient(0, h, 0, h * 0.55);
    g.addColorStop(0, `rgba(255,245,225,${a})`);
    g.addColorStop(1, "rgba(255,245,225,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, h * 0.55, w, h * 0.45);
  }

  const baseX = w / 2 + (p.steerVisual || 0) * w * 0.035;
  const bob = Math.sin((game.time || 0) * 18) * s * 0.006 * (p.speed / p.topSpeed);
  const baseY = h * 0.945 + bob - p.bump * s * 0.05;

  ctx.save();
  ctx.translate(baseX, baseY);

  if (p.state === "crashed") {
    // tumble around in front of the camera
    const t = clamp(1 - p.downTimer / 1.7, 0, 1);
    ctx.translate(Math.sin(t * 9) * s * 0.25, -Math.abs(Math.sin(t * 6)) * s * 0.25);
    ctx.rotate(Math.sin(t * 11) * 0.4);
    drawWreckedRider(ctx, s * 0.95, { colors: p.colors, tilt: 0.2 });
  } else if (p.state === "recovering") {
    const prog = 1 - clamp(p.runTimer / 1.35, 0, 1);
    ctx.translate(lerp(-s * 0.5, 0, prog), 0);
    drawRunningRider(ctx, s * 0.9, { colors: p.colors, phase: p.runPhase });
  } else if (p.state === "busted") {
    drawRunningRider(ctx, s * 0.8, { colors: p.colors, phase: (game.time || 0) * 10 });
  } else {
    const wob = p.wobble;
    ctx.rotate(Math.sin((game.time || 0) * 24) * wob * 0.09);
    drawRiderOnBike(ctx, s * 0.95, {
      colors: p.colors,
      lean: p.lean,
      punch: p.punch,
      punchSide: p.attackSide,
      kick: p.kick,
      wobble: wob,
      wheelie: p.wheelie,
    });

    // club in hand
    if (p.weapon) {
      ctx.save();
      ctx.translate(s * 0.34, -s * 0.82);
      ctx.rotate(-0.5 + p.punch * 1.2);
      ctx.fillStyle = "#6b4a2c";
      roundRect(ctx, 0, -s * 0.03, s * 0.34, s * 0.06, s * 0.02);
      ctx.fill();
      ctx.fillStyle = "#cfc7b4";
      roundRect(ctx, s * 0.30, -s * 0.045, s * 0.12, s * 0.09, s * 0.02);
      ctx.fill();
      ctx.restore();
    }
  }
  ctx.restore();
}

/* ------------------------------------------------------------------ HUD */

function panel(ctx, x, y, w, h, r = 10) {
  ctx.fillStyle = "rgba(14,12,20,0.72)";
  roundRect(ctx, x, y, w, h, r);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 1;
  ctx.stroke();
}

function bar(ctx, x, y, w, h, pct, color, bg = "rgba(255,255,255,0.16)") {
  ctx.fillStyle = bg;
  roundRect(ctx, x, y, w, h, h / 2);
  ctx.fill();
  ctx.fillStyle = color;
  roundRect(ctx, x, y, Math.max(h, w * clamp(pct, 0, 1)), h, h / 2);
  ctx.fill();
}

function drawHud(ctx, game, w, h) {
  const p = game.player;
  if (!p) return;
  const small = Math.min(w, h) < 620;
  const pad = small ? 10 : 18;
  const font = (size, weight = 600) => `${weight} ${size}px ui-monospace, "SF Mono", Menlo, monospace`;

  ctx.textBaseline = "middle";

  /* --- top left: place + time + level -------------------------------- */
  const panelW = small ? 150 : 214;
  const panelH = small ? 58 : 74;
  panel(ctx, pad, pad, panelW, panelH, 12);
  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = font(small ? 9 : 11, 700);
  ctx.fillText(game.theme.name, pad + 12, pad + (small ? 14 : 16));

  ctx.fillStyle = "#ffd479";
  ctx.font = font(small ? 22 : 30, 800);
  ctx.fillText(`${game.position()}`, pad + 12, pad + (small ? 34 : 42));
  const placeW = ctx.measureText(`${game.position()}`).width;
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = font(small ? 13 : 17, 700);
  ctx.fillText(`/${game.rivals.length + 1}`, pad + 14 + placeW, pad + (small ? 36 : 45));

  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.font = font(small ? 12 : 15, 700);
  ctx.fillText(formatTime(game.raceClock), pad + panelW - 12, pad + (small ? 20 : 24));
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = font(small ? 9 : 11, 600);
  ctx.fillText(`$${game.cash}`, pad + panelW - 12, pad + (small ? 40 : 50));

  /* --- race progress bar --------------------------------------------- */
  const barY = pad + panelH + 6;
  bar(ctx, pad, barY, panelW, 5, game.progress(), "#ff8a4a");

  /* --- top right: nearest rivals ------------------------------------- */
  const rivals = game.nearestRivals(small ? 2 : 3);
  const rw = small ? 132 : 190;
  const rh = 20 + rivals.length * (small ? 16 : 21);
  panel(ctx, w - pad - rw, pad, rw, rh, 12);
  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = font(small ? 8 : 10, 700);
  ctx.fillText("NEAREST RIDERS", w - pad - rw + 10, pad + 12);
  rivals.forEach((r, i) => {
    const y = pad + 26 + i * (small ? 16 : 21);
    ctx.fillStyle = r.cop ? "#6fc4ff" : "rgba(255,255,255,0.8)";
    ctx.font = font(small ? 9 : 11, 700);
    ctx.fillText(r.name, w - pad - rw + 10, y);
    const bw = rw * 0.36;
    bar(ctx, w - pad - 10 - bw, y - 3, bw, 5, r.stamina, r.stamina > 0.5 ? "#7ee07a" : r.stamina > 0.25 ? "#f0c040" : "#f05a3c");
  });

  /* --- bottom left: speed -------------------------------------------- */
  const gaugeR = small ? 30 : 44;
  const gy = h - pad - gaugeR - 4;
  drawGauge(ctx, pad + gaugeR + 2, gy, gaugeR, clamp(p.speed / p.topSpeed, 0, 1), `${Math.round(p.speed * 0.0195)}`);
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.font = font(small ? 8 : 9, 700);
  ctx.fillText("KM/H", pad + gaugeR + 2, gy + gaugeR + 10);

  /* --- bottom right: stamina / damage / weapon ------------------------ */
  const sw = small ? 132 : 190;
  const sy = h - pad - (small ? 54 : 66);
  panel(ctx, w - pad - sw, sy, sw, small ? 54 : 66, 12);
  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = font(small ? 8 : 10, 700);
  ctx.fillText("STAMINA", w - pad - sw + 12, sy + 14);
  bar(ctx, w - pad - sw + 12, sy + 22, sw - 24, 7, p.stamina, p.stamina > 0.45 ? "#7ee07a" : "#f05a3c");
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.fillText("BIKE", w - pad - sw + 12, sy + (small ? 40 : 48));
  bar(ctx, w - pad - sw + 12, sy + (small ? 46 : 55), sw - 24, 7, 1 - p.bikeDamage, p.bikeDamage > 0.6 ? "#f05a3c" : "#f0c040");
  if (p.weapon) {
    ctx.fillStyle = "#8de0ff";
    ctx.textAlign = "right";
    ctx.font = font(small ? 9 : 11, 800);
    ctx.fillText(`CLUB ×${p.weapon.swings}`, w - pad - 12, sy + 12);
  }

  /* --- centre messages ------------------------------------------------ */
  ctx.textAlign = "center";
  if (game.state === "countdown") {
    const n = Math.ceil(game.countdown);
    const frac = 1 - (game.countdown - Math.floor(game.countdown));
    const label = n <= 0 ? "GO!" : String(Math.min(3, n));
    const scale = 1 + (1 - frac) * 0.25;
    ctx.save();
    ctx.translate(w / 2, h * 0.42);
    ctx.scale(scale, scale);
    ctx.font = `900 ${Math.min(w, h) * 0.16}px "Arial Black", system-ui, sans-serif`;
    ctx.lineWidth = 10;
    ctx.strokeStyle = "rgba(16,12,22,0.8)";
    ctx.strokeText(label, 0, 0);
    ctx.fillStyle = label === "GO!" ? "#8ef07a" : "#ffd479";
    ctx.fillText(label, 0, 0);
    ctx.restore();
  }

  if (game.warningTimer > 0 && game.warning) {
    ctx.globalAlpha = clamp(game.warningTimer, 0, 1);
    ctx.fillStyle = "#ff6b4a";
    ctx.font = `800 ${small ? 14 : 20}px ui-monospace, monospace`;
    ctx.fillText(game.warning, w / 2, h * 0.2);
    ctx.globalAlpha = 1;
  }

  if (p.state === "crashed") {
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.font = `800 ${small ? 16 : 24}px ui-monospace, monospace`;
    ctx.fillText("WIPEOUT!", w / 2, h * 0.3);
  } else if (p.state === "recovering") {
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.font = `800 ${small ? 14 : 20}px ui-monospace, monospace`;
    ctx.fillText("RUN BACK TO THE BIKE", w / 2, h * 0.3);
  }

  if (p.bikeDamage > 0.75 && p.state === "riding") {
    ctx.fillStyle = `rgba(255,107,74,${0.5 + Math.sin((game.time || 0) * 8) * 0.35})`;
    ctx.font = `800 ${small ? 10 : 12}px ui-monospace, monospace`;
    ctx.fillText("ENGINE SMOKING", w / 2, h * 0.26);
  }
}

/* tiny helper used by the results screen */
export function ordinalPlace(n) {
  return ordinal(n);
}
