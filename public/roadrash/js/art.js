/* =========================================================================
   art.js — every sprite in the game is hand-drawn vector art (no image files)
   All draw functions take the bottom-centre of the sprite as the origin and
   draw upward, so they can be pinned straight onto a pseudo-3D road point.
   ========================================================================= */

import { ellipse, roundRect, clamp } from "./util.js";

const OUTLINE = "rgba(18,14,22,0.55)";

function outline(ctx, w = 1) {
  ctx.lineWidth = w;
  ctx.strokeStyle = OUTLINE;
  ctx.stroke();
}

/* ---------------------------------------------------------------- riders */

/**
 * Rider + bike seen from behind.
 * opts: { colors, lean (-1..1), punch (0..1), punchSide (-1|1), kick (0..1),
 *         wheelie (0..1), wobble (0..1), s }
 */
export function drawRiderOnBike(ctx, s, o) {
  const C = o.colors;
  const lean = o.lean || 0;
  const wob = o.wobble || 0;

  ctx.save();
  // ground shadow
  ctx.fillStyle = "rgba(10,8,16,0.28)";
  ellipse(ctx, 0, 0, s * 0.30, s * 0.075);
  ctx.fill();

  ctx.translate(0, -(o.wheelie || 0) * s * 0.18);
  ctx.rotate(lean * 0.16 + Math.sin(wob * 40) * wob * 0.07);

  /* ---- rear wheel ---- */
  ctx.fillStyle = "#17131c";
  roundRect(ctx, -s * 0.095, -s * 0.44, s * 0.19, s * 0.42, s * 0.07);
  ctx.fill();
  ctx.fillStyle = "#2f2a36";
  roundRect(ctx, -s * 0.055, -s * 0.40, s * 0.11, s * 0.24, s * 0.03);
  ctx.fill();
  ctx.fillStyle = "#3b3542";
  roundRect(ctx, -s * 0.03, -s * 0.34, s * 0.06, s * 0.10, s * 0.02);
  ctx.fill();

  /* ---- exhaust + swingarm ---- */
  ctx.fillStyle = "#7a7f8a";
  roundRect(ctx, s * 0.06, -s * 0.30, s * 0.09, s * 0.055, s * 0.02);
  ctx.fill();

  /* ---- legs ---- */
  ctx.fillStyle = C.pants;
  // left leg
  roundRect(ctx, -s * 0.155, -s * 0.52, s * 0.135, s * 0.32, s * 0.05);
  ctx.fill();
  // right leg (kicks out when kicking)
  const kickOut = (o.kick || 0) * s * 0.18;
  ctx.save();
  ctx.translate(kickOut, 0);
  roundRect(ctx, s * 0.02, -s * 0.52, s * 0.135, s * 0.32, s * 0.05);
  ctx.fillStyle = C.pants;
  ctx.fill();
  ctx.restore();
  // boots
  ctx.fillStyle = "#1d1a22";
  roundRect(ctx, -s * 0.17, -s * 0.24, s * 0.16, s * 0.09, s * 0.035);
  ctx.fill();
  roundRect(ctx, s * 0.005 + kickOut, -s * 0.24, s * 0.16, s * 0.09, s * 0.035);
  ctx.fill();

  /* ---- bike body / tail ---- */
  ctx.fillStyle = C.bike;
  ctx.beginPath();
  ctx.moveTo(-s * 0.185, -s * 0.50);
  ctx.quadraticCurveTo(-s * 0.16, -s * 0.62, -s * 0.115, -s * 0.70);
  ctx.lineTo(s * 0.115, -s * 0.70);
  ctx.quadraticCurveTo(s * 0.16, -s * 0.62, s * 0.185, -s * 0.50);
  ctx.closePath();
  ctx.fill();
  outline(ctx, Math.max(1, s * 0.012));
  ctx.fillStyle = C.bikeDark;
  roundRect(ctx, -s * 0.05, -s * 0.60, s * 0.10, s * 0.07, s * 0.02);
  ctx.fill();
  // tail light
  ctx.fillStyle = "#ff4d3d";
  roundRect(ctx, -s * 0.035, -s * 0.68, s * 0.07, s * 0.035, s * 0.015);
  ctx.fill();

  /* ---- torso ---- */
  ctx.fillStyle = C.jacket;
  ctx.beginPath();
  ctx.moveTo(-s * 0.235, -s * 0.72);
  ctx.quadraticCurveTo(-s * 0.275, -s * 0.98, -s * 0.185, -s * 1.08);
  ctx.lineTo(s * 0.185, -s * 1.08);
  ctx.quadraticCurveTo(s * 0.275, -s * 0.98, s * 0.235, -s * 0.72);
  ctx.quadraticCurveTo(0, -s * 0.64, -s * 0.235, -s * 0.72);
  ctx.closePath();
  ctx.fill();
  outline(ctx, Math.max(1, s * 0.012));

  // back plate / stripe
  ctx.fillStyle = C.jacketDark;
  roundRect(ctx, -s * 0.055, -s * 1.06, s * 0.11, s * 0.30, s * 0.03);
  ctx.fill();

  /* ---- arms (from behind we mostly see elbows) ---- */
  const punch = o.punch || 0;
  const side = o.punchSide || 1;
  ctx.strokeStyle = C.jacket;
  ctx.lineCap = "round";
  ctx.lineWidth = s * 0.10;
  // left arm
  ctx.beginPath();
  ctx.moveTo(-s * 0.19, -s * 1.00);
  ctx.lineTo(-s * 0.31 * (1 + punch * 0.35 * (side < 0 ? 1 : 0.2)), -s * (0.90 - punch * 0.12));
  ctx.stroke();
  // right arm
  ctx.beginPath();
  ctx.moveTo(s * 0.19, -s * 1.00);
  ctx.lineTo(s * 0.31 * (1 + punch * 0.35 * (side > 0 ? 1 : 0.2)), -s * (0.90 - punch * 0.12));
  ctx.stroke();
  // fists
  ctx.fillStyle = C.skin;
  ellipse(ctx, -s * 0.315, -s * (0.885 - punch * 0.14), s * 0.055, s * 0.055);
  ctx.fill();
  ellipse(ctx, s * 0.315, -s * (0.885 - punch * 0.14), s * 0.055, s * 0.055);
  ctx.fill();

  /* ---- head / helmet ---- */
  const headY = -s * 1.215;
  ctx.fillStyle = C.helmet;
  ellipse(ctx, 0, headY, s * 0.115, s * 0.125);
  ctx.fill();
  outline(ctx, Math.max(1, s * 0.012));
  ctx.fillStyle = C.helmetStripe;
  roundRect(ctx, -s * 0.03, headY - s * 0.13, s * 0.06, s * 0.26, s * 0.03);
  ctx.fill();
  ctx.fillStyle = C.pants;
  roundRect(ctx, -s * 0.09, headY + s * 0.09, s * 0.18, s * 0.06, s * 0.03);
  ctx.fill();

  ctx.restore();
}

/** Bike + rider already on the asphalt, tumbling. t = tumble angle. */
export function drawWreckedRider(ctx, s, o) {
  const C = o.colors;
  ctx.save();
  ctx.fillStyle = "rgba(10,8,16,0.25)";
  ellipse(ctx, 0, 0, s * 0.55, s * 0.14);
  ctx.fill();
  ctx.rotate(o.tilt || 0);

  // bike lying on its side
  ctx.fillStyle = C.bike;
  roundRect(ctx, -s * 0.52, -s * 0.26, s * 0.85, s * 0.20, s * 0.06);
  ctx.fill();
  ctx.fillStyle = C.bikeDark;
  roundRect(ctx, -s * 0.30, -s * 0.30, s * 0.30, s * 0.10, s * 0.03);
  ctx.fill();
  // wheels sticking out
  ctx.fillStyle = "#17131c";
  ellipse(ctx, -s * 0.58, -s * 0.16, s * 0.15, s * 0.13);
  ctx.fill();
  ellipse(ctx, s * 0.36, -s * 0.16, s * 0.15, s * 0.13);
  ctx.fill();

  // rider slumped nearby
  ctx.save();
  ctx.translate(s * 0.06, -s * 0.10);
  ctx.fillStyle = C.jacket;
  ellipse(ctx, 0, -s * 0.06, s * 0.24, s * 0.13);
  ctx.fill();
  ctx.fillStyle = C.helmet;
  ellipse(ctx, -s * 0.24, -s * 0.05, s * 0.10, s * 0.10);
  ctx.fill();
  ctx.fillStyle = C.pants;
  roundRect(ctx, s * 0.14, -s * 0.06, s * 0.24, s * 0.11, s * 0.05);
  ctx.fill();
  ctx.restore();
  ctx.restore();
}

/** Rider sprinting back to their bike (we see them from behind, small). */
export function drawRunningRider(ctx, s, o) {
  const C = o.colors;
  const ph = o.phase || 0;
  const bob = Math.sin(ph * 2) * s * 0.04;
  ctx.save();
  ctx.fillStyle = "rgba(10,8,16,0.22)";
  ellipse(ctx, 0, 0, s * 0.20, s * 0.06);
  ctx.fill();
  ctx.translate(0, bob);
  // legs
  ctx.strokeStyle = C.pants;
  ctx.lineWidth = s * 0.10;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-s * 0.04, -s * 0.34);
  ctx.lineTo(-s * 0.04 + Math.sin(ph) * s * 0.16, -s * 0.02);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(s * 0.04, -s * 0.34);
  ctx.lineTo(s * 0.04 - Math.sin(ph) * s * 0.16, -s * 0.02);
  ctx.stroke();
  // torso
  ctx.fillStyle = C.jacket;
  roundRect(ctx, -s * 0.10, -s * 0.72, s * 0.20, s * 0.40, s * 0.06);
  ctx.fill();
  // arms
  ctx.strokeStyle = C.jacket;
  ctx.lineWidth = s * 0.07;
  ctx.beginPath();
  ctx.moveTo(-s * 0.10, -s * 0.66);
  ctx.lineTo(-s * 0.14 + Math.sin(ph + Math.PI) * s * 0.10, -s * 0.44);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(s * 0.10, -s * 0.66);
  ctx.lineTo(s * 0.14 - Math.sin(ph + Math.PI) * s * 0.10, -s * 0.44);
  ctx.stroke();
  // helmet
  ctx.fillStyle = C.helmet;
  ellipse(ctx, 0, -s * 0.80, s * 0.095, s * 0.10);
  ctx.fill();
  ctx.restore();
}

/* -------------------------------------------------------------- vehicles */

const VEHICLE_BODIES = {
  sedan: { w: 1.0, h: 0.62, cabin: 0.52 },
  hatch: { w: 0.92, h: 0.60, cabin: 0.62 },
  van: { w: 1.12, h: 0.86, cabin: 0.78 },
  truck: { w: 1.30, h: 1.10, cabin: 0.5 },
  bus: { w: 1.35, h: 1.15, cabin: 0.72 },
};

/**
 * Rear (or front) view of a car. Origin = road contact centre. s = vehicle width px.
 * opts: { kind, color, oncoming, brake, s }
 */
export function drawVehicle(ctx, s, o) {
  const body = VEHICLE_BODIES[o.kind] || VEHICLE_BODIES.sedan;
  const w = s;
  const h = s * body.h;
  const oncoming = !!o.oncoming;

  ctx.save();
  ctx.fillStyle = "rgba(10,8,16,0.30)";
  ellipse(ctx, 0, 0, w * 0.56, s * 0.10);
  ctx.fill();

  // wheels
  ctx.fillStyle = "#151219";
  roundRect(ctx, -w * 0.50, -s * 0.16, w * 0.16, s * 0.16, s * 0.03);
  ctx.fill();
  roundRect(ctx, w * 0.34, -s * 0.16, w * 0.16, s * 0.16, s * 0.03);
  ctx.fill();

  // main body
  const bodyTop = -s * body.cabin - s * 0.10;
  ctx.fillStyle = o.color;
  roundRect(ctx, -w * 0.5, bodyTop, w, h, s * 0.10);
  ctx.fill();
  outline(ctx, Math.max(1, s * 0.012));

  // cabin / glass
  const cabinH = s * body.cabin * 0.62;
  ctx.fillStyle = oncoming ? "#2b3a4a" : "#243040";
  roundRect(ctx, -w * 0.34, bodyTop - cabinH * 0.92, w * 0.68, cabinH, s * 0.05);
  ctx.fill();
  // roof glint
  ctx.fillStyle = "rgba(255,255,255,0.16)";
  roundRect(ctx, -w * 0.30, bodyTop - cabinH * 0.80, w * 0.22, cabinH * 0.7, s * 0.03);
  ctx.fill();

  if (oncoming) {
    // headlights
    ctx.fillStyle = "#fff6c9";
    ellipse(ctx, -w * 0.34, bodyTop + h * 0.30, s * 0.09, s * 0.07);
    ctx.fill();
    ellipse(ctx, w * 0.34, bodyTop + h * 0.30, s * 0.09, s * 0.07);
    ctx.fill();
    // grille
    ctx.fillStyle = "#1b1720";
    roundRect(ctx, -w * 0.16, bodyTop + h * 0.44, w * 0.32, h * 0.18, s * 0.03);
    ctx.fill();
  } else {
    // tail lights
    ctx.fillStyle = o.brake ? "#ff2d1f" : "#c02a1e";
    roundRect(ctx, -w * 0.44, bodyTop + h * 0.22, w * 0.20, h * 0.20, s * 0.03);
    ctx.fill();
    roundRect(ctx, w * 0.24, bodyTop + h * 0.22, w * 0.20, h * 0.20, s * 0.03);
    ctx.fill();
    // plate
    ctx.fillStyle = "#e8e3d3";
    roundRect(ctx, -w * 0.10, bodyTop + h * 0.52, w * 0.20, h * 0.14, s * 0.02);
    ctx.fill();
  }
  ctx.restore();
}

/* -------------------------------------------------------------- scenery */

const SCENERY = {
  pine: (ctx, s) => {
    ctx.fillStyle = "#4a3222";
    roundRect(ctx, -s * 0.035, -s * 0.28, s * 0.07, s * 0.28, s * 0.01);
    ctx.fill();
    for (let i = 0; i < 3; i++) {
      const y = -s * (0.22 + i * 0.24);
      const w = s * (0.34 - i * 0.085);
      ctx.fillStyle = i % 2 ? "#1f4b32" : "#265c3b";
      ctx.beginPath();
      ctx.moveTo(0, y - s * 0.30);
      ctx.lineTo(w, y);
      ctx.lineTo(-w, y);
      ctx.closePath();
      ctx.fill();
    }
  },
  palm: (ctx, s) => {
    ctx.strokeStyle = "#6b4a2c";
    ctx.lineWidth = s * 0.055;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(s * 0.10, -s * 0.5, s * 0.02, -s * 0.92);
    ctx.stroke();
    ctx.strokeStyle = "#2f6b3c";
    ctx.lineWidth = s * 0.05;
    for (let i = 0; i < 6; i++) {
      const a = -Math.PI / 2 + (i - 2.5) * 0.42;
      ctx.beginPath();
      ctx.moveTo(s * 0.02, -s * 0.92);
      ctx.quadraticCurveTo(
        s * 0.02 + Math.cos(a) * s * 0.26,
        -s * 0.92 + Math.sin(a) * s * 0.20,
        s * 0.02 + Math.cos(a) * s * 0.40,
        -s * 0.92 + Math.sin(a) * s * 0.30 + s * 0.10,
      );
      ctx.stroke();
    }
  },
  oak: (ctx, s) => {
    ctx.fillStyle = "#5a3d25";
    roundRect(ctx, -s * 0.05, -s * 0.45, s * 0.10, s * 0.45, s * 0.02);
    ctx.fill();
    ctx.fillStyle = "#2c5b33";
    ellipse(ctx, 0, -s * 0.62, s * 0.34, s * 0.30);
    ctx.fill();
    ctx.fillStyle = "#376b3b";
    ellipse(ctx, -s * 0.16, -s * 0.72, s * 0.20, s * 0.18);
    ctx.fill();
    ellipse(ctx, s * 0.17, -s * 0.68, s * 0.17, s * 0.16);
    ctx.fill();
  },
  cactus: (ctx, s) => {
    ctx.fillStyle = "#2f6b45";
    roundRect(ctx, -s * 0.06, -s * 0.62, s * 0.12, s * 0.62, s * 0.05);
    ctx.fill();
    roundRect(ctx, -s * 0.22, -s * 0.46, s * 0.10, s * 0.26, s * 0.05);
    ctx.fill();
    roundRect(ctx, s * 0.12, -s * 0.52, s * 0.10, s * 0.30, s * 0.05);
    ctx.fill();
  },
  rock: (ctx, s) => {
    ctx.fillStyle = "#7a6a5c";
    ctx.beginPath();
    ctx.moveTo(-s * 0.22, 0);
    ctx.lineTo(-s * 0.12, -s * 0.24);
    ctx.lineTo(s * 0.06, -s * 0.30);
    ctx.lineTo(s * 0.20, -s * 0.10);
    ctx.lineTo(s * 0.22, 0);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#8f8073";
    ctx.beginPath();
    ctx.moveTo(-s * 0.12, -s * 0.24);
    ctx.lineTo(s * 0.06, -s * 0.30);
    ctx.lineTo(s * 0.0, -s * 0.12);
    ctx.closePath();
    ctx.fill();
  },
  billboard: (ctx, s) => {
    ctx.fillStyle = "#4c3b2c";
    roundRect(ctx, -s * 0.04, -s * 1.0, s * 0.08, s * 1.0, s * 0.02);
    ctx.fill();
    ctx.fillStyle = "#b8322a";
    roundRect(ctx, -s * 0.44, -s * 1.42, s * 0.88, s * 0.52, s * 0.03);
    ctx.fill();
    ctx.fillStyle = "#f7e9c9";
    roundRect(ctx, -s * 0.38, -s * 1.36, s * 0.76, s * 0.15, s * 0.02);
    ctx.fill();
    ctx.fillStyle = "#f2b134";
    roundRect(ctx, -s * 0.38, -s * 1.16, s * 0.48, s * 0.10, s * 0.02);
    ctx.fill();
  },
  sign: (ctx, s) => {
    ctx.fillStyle = "#8b8b8b";
    roundRect(ctx, -s * 0.02, -s * 0.7, s * 0.04, s * 0.7, s * 0.01);
    ctx.fill();
    ctx.fillStyle = "#f2c53d";
    roundRect(ctx, -s * 0.20, -s * 0.86, s * 0.40, s * 0.30, s * 0.04);
    ctx.fill();
    ctx.fillStyle = "#241f22";
    ctx.fillRect(-s * 0.13, -s * 0.74, s * 0.26, s * 0.05);
  },
  lamp: (ctx, s) => {
    ctx.fillStyle = "#3d4048";
    roundRect(ctx, -s * 0.025, -s * 1.1, s * 0.05, s * 1.1, s * 0.02);
    ctx.fill();
    roundRect(ctx, 0, -s * 1.12, s * 0.22, s * 0.05, s * 0.02);
    ctx.fill();
    ctx.fillStyle = "#ffe9a8";
    ellipse(ctx, s * 0.20, -s * 1.06, s * 0.07, s * 0.045);
    ctx.fill();
  },
  fence: (ctx, s) => {
    ctx.fillStyle = "#b9a68a";
    for (let i = -2; i <= 2; i++) ctx.fillRect(i * s * 0.16 - s * 0.02, -s * 0.34, s * 0.04, s * 0.34);
    ctx.fillRect(-s * 0.36, -s * 0.28, s * 0.72, s * 0.05);
    ctx.fillRect(-s * 0.36, -s * 0.14, s * 0.72, s * 0.05);
  },
  bush: (ctx, s) => {
    ctx.fillStyle = "#3d6b3a";
    ellipse(ctx, 0, -s * 0.14, s * 0.24, s * 0.16);
    ctx.fill();
    ellipse(ctx, -s * 0.12, -s * 0.20, s * 0.16, s * 0.13);
    ctx.fill();
    ellipse(ctx, s * 0.13, -s * 0.18, s * 0.14, s * 0.12);
    ctx.fill();
  },
  cow: (ctx, s) => {
    ctx.fillStyle = "#e9e4da";
    roundRect(ctx, -s * 0.34, -s * 0.44, s * 0.62, s * 0.30, s * 0.10);
    ctx.fill();
    ctx.fillStyle = "#2c2622";
    ellipse(ctx, -s * 0.10, -s * 0.38, s * 0.10, s * 0.07);
    ctx.fill();
    ctx.fillStyle = "#e9e4da";
    roundRect(ctx, s * 0.24, -s * 0.56, s * 0.20, s * 0.22, s * 0.08);
    ctx.fill();
    ctx.fillStyle = "#2c2622";
    // legs
    for (const lx of [-0.28, -0.10, 0.10, 0.24]) ctx.fillRect(lx * s, -s * 0.16, s * 0.06, s * 0.16);
    // ears
    ellipse(ctx, s * 0.44, -s * 0.52, s * 0.06, s * 0.03);
    ctx.fill();
  },
  deer: (ctx, s) => {
    ctx.fillStyle = "#9c6b3f";
    roundRect(ctx, -s * 0.26, -s * 0.50, s * 0.46, s * 0.22, s * 0.08);
    ctx.fill();
    roundRect(ctx, s * 0.16, -s * 0.74, s * 0.14, s * 0.30, s * 0.05);
    ctx.fill();
    for (const lx of [-0.22, -0.08, 0.06, 0.18]) ctx.fillRect(lx * s, -s * 0.30, s * 0.045, s * 0.30);
    ctx.strokeStyle = "#c8a678";
    ctx.lineWidth = s * 0.03;
    ctx.beginPath();
    ctx.moveTo(s * 0.20, -s * 0.74);
    ctx.lineTo(s * 0.16, -s * 0.92);
    ctx.moveTo(s * 0.27, -s * 0.74);
    ctx.lineTo(s * 0.32, -s * 0.92);
    ctx.stroke();
  },
};

export function drawScenery(ctx, s, kind, phase = 0) {
  const fn = SCENERY[kind] || SCENERY.bush;
  ctx.save();
  fn(ctx, s, phase);
  ctx.restore();
}

/* ----------------------------------------------------------- pedestrians */

/** Side-view pedestrian walking along the shoulder (they wander into the road). */
export function drawPedestrian(ctx, s, o) {
  const ph = o.phase || 0;
  const shirt = o.shirt || "#d9542e";
  const pants = o.pants || "#2b3550";
  const face = o.skin || "#e6b48a";
  ctx.save();
  ctx.fillStyle = "rgba(10,8,16,0.22)";
  ellipse(ctx, 0, 0, s * 0.16, s * 0.05);
  ctx.fill();
  ctx.scale(o.flip ? -1 : 1, 1);
  ctx.lineCap = "round";
  // legs
  ctx.strokeStyle = pants;
  ctx.lineWidth = s * 0.075;
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.42);
  ctx.lineTo(Math.sin(ph) * s * 0.13, -s * 0.02);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.42);
  ctx.lineTo(-Math.sin(ph) * s * 0.13, -s * 0.02);
  ctx.stroke();
  // body
  ctx.fillStyle = shirt;
  roundRect(ctx, -s * 0.075, -s * 0.74, s * 0.15, s * 0.34, s * 0.05);
  ctx.fill();
  // arms
  ctx.strokeStyle = shirt;
  ctx.lineWidth = s * 0.055;
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.70);
  ctx.lineTo(-Math.sin(ph) * s * 0.12, -s * 0.48);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.70);
  ctx.lineTo(Math.sin(ph) * s * 0.12, -s * 0.50);
  ctx.stroke();
  // head
  ctx.fillStyle = face;
  ellipse(ctx, 0, -s * 0.80, s * 0.065, s * 0.075);
  ctx.fill();
  ctx.fillStyle = "#2a2226";
  ellipse(ctx, 0, -s * 0.845, s * 0.07, s * 0.04);
  ctx.fill();
  ctx.restore();
}

/* ----------------------------------------------------------- bike parts */

/** A bike that got knocked loose and is skidding/bouncing down the road. */
export function drawLooseBike(ctx, s, o) {
  ctx.save();
  ctx.fillStyle = "rgba(10,8,16,0.22)";
  ellipse(ctx, 0, 0, s * 0.40, s * 0.10);
  ctx.fill();
  ctx.rotate((o.spin || 0) * 0.35);

  // wheels (seen edge on, one nearer the camera)
  ctx.fillStyle = "#15121a";
  ellipse(ctx, -s * 0.30, -s * 0.15, s * 0.115, s * 0.155);
  ctx.fill();
  ellipse(ctx, s * 0.30, -s * 0.15, s * 0.115, s * 0.155);
  ctx.fill();
  ctx.fillStyle = "#3d3745";
  ellipse(ctx, -s * 0.30, -s * 0.15, s * 0.05, s * 0.07);
  ctx.fill();
  ellipse(ctx, s * 0.30, -s * 0.15, s * 0.05, s * 0.07);
  ctx.fill();

  // frame + body
  ctx.fillStyle = o.colors.bike;
  ctx.beginPath();
  ctx.moveTo(-s * 0.34, -s * 0.20);
  ctx.quadraticCurveTo(-s * 0.12, -s * 0.40, s * 0.10, -s * 0.30);
  ctx.lineTo(s * 0.32, -s * 0.24);
  ctx.lineTo(s * 0.30, -s * 0.10);
  ctx.lineTo(-s * 0.30, -s * 0.10);
  ctx.closePath();
  ctx.fill();

  // tank + seat
  ctx.fillStyle = o.colors.bikeDark;
  roundRect(ctx, -s * 0.16, -s * 0.34, s * 0.28, s * 0.13, s * 0.05);
  ctx.fill();
  ctx.fillStyle = "#26212c";
  roundRect(ctx, -s * 0.34, -s * 0.30, s * 0.16, s * 0.10, s * 0.04);
  ctx.fill();

  // handlebars sticking up
  ctx.strokeStyle = "#9aa0aa";
  ctx.lineWidth = s * 0.035;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(s * 0.20, -s * 0.26);
  ctx.lineTo(s * 0.30, -s * 0.44);
  ctx.lineTo(s * 0.44, -s * 0.40);
  ctx.stroke();
  ctx.restore();
}

/** Club / crowbar pickup lying on the road. */
export function drawWeaponPickup(ctx, s, t) {
  ctx.save();
  ctx.translate(0, -Math.abs(Math.sin(t * 3)) * s * 0.12);
  ctx.rotate(Math.sin(t * 1.4) * 0.25);
  ctx.fillStyle = "#6b4a2c";
  roundRect(ctx, -s * 0.30, -s * 0.30, s * 0.60, s * 0.10, s * 0.04);
  ctx.fill();
  ctx.fillStyle = "#c9c3b4";
  roundRect(ctx, s * 0.14, -s * 0.33, s * 0.22, s * 0.16, s * 0.03);
  ctx.fill();
  ctx.restore();
}

/* ------------------------------------------------------------ hud icons */

/** Tiny rider head used for position pips in the HUD. */
export function drawHeadPip(ctx, x, y, r, color, helmet) {
  ctx.fillStyle = color;
  ellipse(ctx, x, y, r, r);
  ctx.fill();
  ctx.fillStyle = helmet;
  ctx.beginPath();
  ctx.arc(x, y, r, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
}

/** Speedometer needle helper. */
export function drawGauge(ctx, x, y, r, pct, label) {
  const a0 = Math.PI * 0.75;
  const a1 = Math.PI * 2.25;
  ctx.save();
  ctx.lineWidth = Math.max(2, r * 0.12);
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.beginPath();
  ctx.arc(x, y, r, a0, a1);
  ctx.stroke();
  const a = a0 + (a1 - a0) * clamp(pct, 0, 1);
  ctx.strokeStyle = "#ff7a3d";
  ctx.beginPath();
  ctx.arc(x, y, r, a0, a);
  ctx.stroke();
  ctx.strokeStyle = "#f6f1e7";
  ctx.lineWidth = Math.max(1.5, r * 0.06);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + Math.cos(a) * r * 0.82, y + Math.sin(a) * r * 0.82);
  ctx.stroke();
  ctx.fillStyle = "#f6f1e7";
  ctx.font = `600 ${Math.round(r * 0.42)}px ui-monospace, monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, x, y + r * 0.52);
  ctx.restore();
}
