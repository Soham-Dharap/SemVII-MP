/* =========================================================================
   road.js — the pseudo-3D highway. A 1991-style "raster road": the track is a
   list of segments, each with a curve amount, a height and roadside props.
   Everything else (riders, traffic, pedestrians) is projected into the same
   camera space, which is what makes bumping into people feel right.
   ========================================================================= */

import { clamp, seeded } from "./util.js";

export const SEG_LEN = 200;          // world units per segment
export const ROAD_WIDTH = 2000;      // half-width used for projection
export const CAMERA_HEIGHT = 1150;
export const FIELD_OF_VIEW = 100;    // degrees
export const DRAW_DISTANCE = 180;    // segments
export const FOG_DENSITY = 2.6;

export const THEMES = {
  grassvalley: {
    id: "grassvalley",
    name: "GRASS VALLEY",
    subtitle: "Level 1 · rolling ranch country",
    skyTop: "#2f7fb8",
    skyMid: "#8ec8e0",
    skyBottom: "#f6d9a8",
    sun: "#fff3cf",
    farHills: "#6b8f86",
    nearHills: "#4b7b4c",
    ground: "#7ba645",
    groundDark: "#75a041",
    road: "#4a4750",
    roadDark: "#403d46",
    rumbleA: "#d94a3d",
    rumbleB: "#f2ece0",
    lane: "#e9e2cf",
    scenery: ["oak", "oak", "pine", "fence", "bush", "sign", "billboard", "lamp"],
    fog: "#cfe0d6",
  },
  sierra: {
    id: "sierra",
    name: "SIERRA NEVADA",
    subtitle: "Level 2 · switchbacks and pines",
    skyTop: "#1f5f95",
    skyMid: "#7fb3d5",
    skyBottom: "#dfeaf0",
    sun: "#fdf6e3",
    farHills: "#5b7290",
    nearHills: "#345c47",
    ground: "#4f7a4a",
    groundDark: "#4a7445",
    road: "#484650",
    roadDark: "#3e3c46",
    rumbleA: "#e6e0d2",
    rumbleB: "#2f4a54",
    lane: "#f0ead9",
    scenery: ["pine", "pine", "pine", "rock", "rock", "sign", "lamp", "bush"],
    fog: "#c8d8e2",
  },
  napa: {
    id: "napa",
    name: "NAPA VALLEY",
    subtitle: "Level 3 · vineyards at golden hour",
    skyTop: "#2a5f8f",
    skyMid: "#e8a55f",
    skyBottom: "#f8dca6",
    sun: "#fff0c0",
    farHills: "#7c6f5c",
    nearHills: "#5d7a3c",
    ground: "#8faa4c",
    groundDark: "#88a246",
    road: "#4b4851",
    roadDark: "#413e47",
    rumbleA: "#c8452f",
    rumbleB: "#f7f0e0",
    lane: "#fbf3dd",
    scenery: ["oak", "fence", "bush", "sign", "billboard", "oak", "lamp"],
    fog: "#f3ddb4",
  },
  coast: {
    id: "coast",
    name: "PACIFIC COAST",
    subtitle: "Level 4 · cliffs and ocean spray",
    skyTop: "#1d4f7a",
    skyMid: "#79b6cf",
    skyBottom: "#ffe2b8",
    sun: "#fff4d6",
    farHills: "#4c6f88",
    nearHills: "#3f6b52",
    ground: "#6f9750",
    groundDark: "#688f4a",
    road: "#464550",
    roadDark: "#3c3b46",
    rumbleA: "#c8452f",
    rumbleB: "#f4eee0",
    lane: "#f2ecdc",
    scenery: ["palm", "palm", "rock", "fence", "bush", "sign", "billboard"],
    fog: "#d9e6ee",
  },
  desert: {
    id: "desert",
    name: "PALM DESERT",
    subtitle: "Level 5 · heat haze and cactus",
    skyTop: "#2c6c99",
    skyMid: "#f0b562",
    skyBottom: "#fbe3b0",
    sun: "#fff6d9",
    farHills: "#a97a56",
    nearHills: "#9c6c45",
    ground: "#d6a356",
    groundDark: "#d19d52",
    road: "#4d4a52",
    roadDark: "#434048",
    rumbleA: "#b23a2a",
    rumbleB: "#f5ecd6",
    lane: "#f6eed6",
    scenery: ["cactus", "cactus", "rock", "rock", "sign", "billboard", "bush"],
    fog: "#f6dfb4",
  },
};

export const LEVELS = [
  { theme: "grassvalley", segments: 4400, rivals: 9, traffic: 0.9, prize: 900 },
  { theme: "sierra", segments: 5000, rivals: 10, traffic: 1.0, prize: 1600 },
  { theme: "napa", segments: 5700, rivals: 11, traffic: 1.1, prize: 2500 },
  { theme: "coast", segments: 6300, rivals: 12, traffic: 1.2, prize: 3800 },
  { theme: "desert", segments: 7000, rivals: 14, traffic: 1.3, prize: 6000 },
];

/* ------------------------------------------------------------------ build */

/* Sections are built sequentially: each one starts where the last ended,
   so hills and bends chain into a continuous road. */
function buildSections(rng, total) {
  const segs = [];
  const push = (len, curve, hill) => {
    const startY = segs.length ? segs[segs.length - 1].p2.world.y : 0;
    const slope = hill / Math.max(1, len);
    for (let n = 0; n < len; n++) {
      const i = segs.length;
      const y1 = startY + slope * n;
      const y2 = startY + slope * (n + 1);
      segs.push({
        index: i,
        p1: { world: { x: 0, y: y1, z: i * SEG_LEN }, camera: {}, screen: {} },
        p2: { world: { x: 0, y: y2, z: (i + 1) * SEG_LEN }, camera: {}, screen: {} },
        curve,
        sprites: [],
        finish: false,
        startLine: false,
        clip: 0,
      });
    }
  };

  // start straight + start line
  push(30, 0, 0);
  let built = 30;
  while (built < total - 40) {
    const len = Math.round(rng.range(60, 150));
    const kind = rng.next();
    let curve = 0;
    if (kind > 0.42) {
      // curves come in pairs so they feel like real bends, not noise
      const mag = rng.range(1.4, 4.4) * (rng.chance(0.5) ? 1 : -1);
      const half = Math.round(len / 2);
      push(half, mag, rng.range(-1600, 1600));
      push(len - half, mag * rng.range(0.15, 0.5), rng.range(-1600, 1600));
      built += len;
      continue;
    }
    // straights get the big elevation changes — that's where the sky shows
    const hill = rng.range(-1, 1) > 0 ? rng.range(2600, 7600) : -rng.range(1200, 3200);
    push(len, curve, hill);
    built += len;
  }
  // finish straight
  push(Math.max(40, total - segs.length), 0, 0);
  return segs;
}

/* --------------------------------------------------------------- scenery */

function decorate(segs, theme, rng) {
  const kinds = theme.scenery;
  for (let i = 12; i < segs.length - 4; i++) {
    const seg = segs[i];
    // a prop every couple of segments, more density deeper into the field
    if (rng.chance(0.34)) {
      const side = rng.chance(0.5) ? -1 : 1;
      const kind = rng.pick(kinds);
      const dist = rng.range(1.35, 5.2);
      const scale = segKindScale(kind) * (1.6 - clamp(dist, 1.2, 5.2) * 0.18) * rng.range(0.85, 1.25);
      seg.sprites.push({
        kind,
        offset: dist * side,
        scale,
        collide: dist < 1.62,
      });
    }
    // occasional spectators near the road (props, not hazards)
    if (rng.chance(0.03)) {
      seg.sprites.push({
        kind: "crowd",
        offset: (rng.chance(0.5) ? -1 : 1) * rng.range(1.18, 1.5),
        scale: 0.72,
        collide: false,
        crowd: rng.int(1, 4),
      });
    }
  }
  // finish line
  for (let i = Math.max(0, segs.length - 52); i < segs.length - 50; i++) segs[i].finish = true;
  for (let i = 12; i < 20; i++) segs[i].startLine = true;
}

function segKindScale(kind) {
  switch (kind) {
    case "billboard": return 1.35;
    case "palm": return 1.5;
    case "pine": return 1.4;
    case "oak": return 1.25;
    case "lamp": return 1.1;
    case "sign": return 0.8;
    case "fence": return 1.0;
    case "rock": return 0.85;
    case "cactus": return 0.95;
    default: return 0.8;
  }
}

/**
 * Build the whole highway. Same seed + same level = identical road.
 */
export function createTrack(levelIndex, seed) {
  const level = LEVELS[clamp(levelIndex, 0, LEVELS.length - 1)];
  const theme = THEMES[level.theme];
  const rng = seeded(seed);
  const segs = buildSections(rng, level.segments);
  decorate(segs, theme, rng);
  return {
    segments: segs,
    theme,
    level,
    segLen: SEG_LEN,
    roadWidth: ROAD_WIDTH,
    length: segs.length * SEG_LEN,
    lastY: segs[segs.length - 1].p2.world.y,
  };
}

/* ------------------------------------------------------------ projection */

export function project(p, cameraX, cameraY, cameraZ, cameraDepth, width, height, roadWidth) {
  p.camera.x = (p.world.x || 0) - cameraX;
  p.camera.y = (p.world.y || 0) - cameraY;
  p.camera.z = (p.world.z || 0) - cameraZ;
  if (p.camera.z < 1) p.camera.z = 1;
  p.screen.scale = cameraDepth / p.camera.z;
  p.screen.x = (width / 2) + (p.screen.scale * p.camera.x * width / 2);
  p.screen.y = (height / 2) - (p.screen.scale * p.camera.y * height / 2);
  p.screen.w = (p.screen.scale * roadWidth * width / 2);
  return p;
}

export function cameraDepthFor(fov) {
  return 1 / Math.tan(((fov / 2) * Math.PI) / 180);
}

/** World position along the road for a segment-relative offset. */
export function segmentIndexForZ(z, track) {
  return clamp(Math.floor(z / track.segLen), 0, track.segments.length - 1);
}
