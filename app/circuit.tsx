"use client";

/**
 * Travelling circuit board.
 *
 * The board is twice the height of the viewport and pans upward as the page
 * scrolls, so you move across it rather than watching one fixed frame. Each
 * trace draws itself in the window where it enters view — the fill follows the
 * camera — and the last one closes at the foot of the page, so arriving at the
 * bottom means arriving at a finished board.
 */

import { m, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { memo } from "react";
import { useMotionOff } from "./use-motion-off";

const BOARD_W = 1440;
const BOARD_H = 1800;

type Chip = { x: number; y: number; w: number; h: number; rx: number };

const chips: Chip[] = [
  { x: 580, y: 420, w: 280, h: 210, rx: 14 },
  { x: 150, y: 120, w: 140, h: 100, rx: 9 },
  { x: 1080, y: 960, w: 190, h: 140, rx: 11 },
  { x: 250, y: 1380, w: 160, h: 115, rx: 9 },
  { x: 860, y: 1540, w: 210, h: 150, rx: 12 },
];

/* Traces, drawn with 45° elbows. Order does not matter — each one takes its
   scroll window from where it starts on the board. */
const traces = [
  "M290 150 L420 150 L495 225 L495 420",
  "M290 190 L360 190 L435 265 L1000 265 L1075 190 L1460 190",
  "M220 220 L220 300 L145 375 L145 700 L60 785 L60 1180",
  "M260 220 L260 330 L335 405 L335 640 L260 715 L-20 715",
  "M640 406 L640 350 L565 275 L565 60 L300 60",
  "M700 406 L700 320 L775 245 L775 -20",
  "M760 406 L760 300 L905 300 L980 225 L1180 225 L1255 150 L1255 -20",
  "M820 406 L820 340 L1090 340 L1165 265 L1460 265",
  "M874 470 L1000 470 L1075 545 L1460 545",
  "M874 520 L960 520 L1035 595 L1250 595 L1325 670 L1460 670",
  "M874 570 L940 570 L1015 645 L1015 900 L1090 975",
  "M566 470 L470 470 L395 545 L200 545 L125 620 L-20 620",
  "M566 520 L440 520 L365 595 L365 860 L290 935 L-20 935",
  "M566 570 L490 570 L415 645 L415 1000 L340 1075 L340 1380",
  "M640 644 L640 780 L565 855 L565 1180 L640 1255 L640 1540",
  "M700 644 L700 830 L775 905 L775 1400 L700 1475 L700 1540",
  "M760 644 L760 720 L905 720 L980 795 L980 1540",
  "M820 644 L820 690 L1010 690 L1085 765 L1085 960",
  "M-20 1050 L200 1050 L275 1125 L275 1300",
  /* Kept clear of the package at 1080,960: the old run down x=1245 went
     straight through the middle of it. */
  "M1460 830 L1395 830 L1320 905 L1320 1130 L1245 1205 L1170 1205 L1170 1400",
  "M1270 1000 L1360 1000 L1435 1075 L1460 1075",
  "M1270 1060 L1330 1060 L1405 1135 L1405 1420 L1460 1420",
  "M1175 1100 L1175 1250 L1100 1325 L1100 1540",
  "M1080 1040 L1000 1040 L925 1115 L925 1300 L850 1375 L560 1375",
  "M410 1420 L560 1420 L635 1495 L635 1820",
  "M410 1470 L500 1470 L575 1545 L575 1700 L500 1775 L-20 1775",
  "M250 1495 L180 1495 L105 1570 L105 1820",
  "M330 1495 L330 1600 L255 1675 L255 1820",
  "M1070 1580 L1200 1580 L1275 1655 L1275 1820",
  "M1070 1640 L1150 1640 L1225 1715 L1460 1715",
  "M900 1690 L900 1760 L825 1820",
  "M1000 1690 L1000 1745 L1075 1820",
];

/** Every point on a trace, so pads can only ever sit on copper. */
function points(d: string): Array<[number, number]> {
  const nums = d.match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? [];
  const out: Array<[number, number]> = [];
  for (let i = 0; i + 1 < nums.length; i += 2) out.push([nums[i], nums[i + 1]]);
  return out;
}

const onBoard = ([x, y]: [number, number]) =>
  x > 14 && x < BOARD_W - 14 && y > 14 && y < BOARD_H - 14;

const STUB = 14;

type Side = "top" | "bottom" | "left" | "right";
/** The outer end of a pin stub — where a trace is supposed to meet it. */
type Pin = { x: number; y: number; side: Side };

/* One pitch for both axes. At the old, coarser spacing across the top the
   widest package had exactly fourteen pins for fifteen traces, and the odd one
   out had nowhere to land. */
const PITCH = 62;

/** Every pin on a package, in comb order. */
function pinsOf(chip: Chip): Pin[] {
  const out: Pin[] = [];
  const across = Math.max(2, Math.round(chip.w / PITCH));
  for (let i = 1; i <= across; i += 1) {
    const x = chip.x + (chip.w * i) / (across + 1);
    out.push({ x, y: chip.y - STUB, side: "top" });
    out.push({ x, y: chip.y + chip.h + STUB, side: "bottom" });
  }
  const down = Math.max(2, Math.round(chip.h / PITCH));
  for (let i = 1; i <= down; i += 1) {
    const y = chip.y + (chip.h * i) / (down + 1);
    out.push({ x: chip.x - STUB, y, side: "left" });
    out.push({ x: chip.x + chip.w + STUB, y, side: "right" });
  }
  return out;
}

const chipPinList = chips.map(pinsOf);

/** Pin stubs for a package, as one path so the whole comb draws as a unit. */
function chipPins(chip: Chip, pins: Pin[]) {
  return pins
    .map((pin) => {
      if (pin.side === "top") return `M${pin.x} ${pin.y} L${pin.x} ${chip.y}`;
      if (pin.side === "bottom") return `M${pin.x} ${pin.y} L${pin.x} ${chip.y + chip.h}`;
      if (pin.side === "left") return `M${pin.x} ${pin.y} L${chip.x} ${pin.y}`;
      return `M${pin.x} ${pin.y} L${chip.x + chip.w} ${pin.y}`;
    })
    .join(" ");
}

/* ------------------------------------------------------------------ */
/* Wiring the traces onto the packages                                 */
/* ------------------------------------------------------------------ */

/**
 * The trace ends were written by hand against the packages, and every one of
 * them missed: thirty-five endpoints, not one of them on a pin, off by anything
 * from two units to fifty, and one finishing inside a package altogether. So
 * the ends are no longer taken on trust — each one is bound to a real pin here,
 * and the stubs are drawn from the same list, which is what stops the two
 * drifting apart again.
 */
const REACH = 90;

/** Which edge of a package a point belongs to, by its pin line. */
function sideOf(point: [number, number], chip: Chip): Side {
  const gap: Record<Side, number> = {
    top: Math.abs(point[1] - (chip.y - STUB)),
    bottom: Math.abs(point[1] - (chip.y + chip.h + STUB)),
    left: Math.abs(point[0] - (chip.x - STUB)),
    right: Math.abs(point[0] - (chip.x + chip.w + STUB)),
  };
  return (Object.keys(gap) as Side[]).reduce((a, b) => (gap[b] < gap[a] ? b : a));
}

/**
 * Whether a trace coming from `from` can reach this edge without crossing the
 * package to get there. A pin is only wired from the side it faces — otherwise
 * the approach would run straight through the chip it is meant to plug into.
 */
function facesOutward(from: [number, number], chip: Chip, side: Side) {
  if (side === "left") return from[0] <= chip.x;
  if (side === "right") return from[0] >= chip.x + chip.w;
  if (side === "top") return from[1] <= chip.y;
  return from[1] >= chip.y + chip.h;
}

/**
 * The nearest free pin to a trace end. First choice is the edge the end is
 * already beside, which keeps the obvious connections short and square; if that
 * edge is full, any other reachable free pin on the same package will do rather
 * than leaving the trace hanging in mid-air.
 */
type Claim = { distance: number; key: string; pin: Pin };

function claimPin(point: [number, number], from: [number, number], taken: Set<string>) {
  const search = (preferredSideOnly: boolean) => {
    let best: Claim | null = null;
    chips.forEach((chip, ci) => {
      const dx = Math.max(chip.x - point[0], 0, point[0] - (chip.x + chip.w));
      const dy = Math.max(chip.y - point[1], 0, point[1] - (chip.y + chip.h));
      if (Math.hypot(dx, dy) > REACH) return;
      const side = sideOf(point, chip);
      chipPinList[ci].forEach((pin, pi) => {
        if (preferredSideOnly && pin.side !== side) return;
        if (!facesOutward(from, chip, pin.side)) return;
        const key = `${ci}:${pi}`;
        if (taken.has(key)) return;
        const distance = Math.hypot(pin.x - point[0], pin.y - point[1]);
        if (!best || distance < best.distance) best = { distance, key, pin };
      });
    });
    return best as Claim | null;
  };
  return search(true) ?? search(false);
}

/** The last hop into a pin: square to the package, with a 45° elbow. */
function approach(from: [number, number], pin: Pin): Array<[number, number]> {
  const square = pin.side === "top" || pin.side === "bottom";
  const dx = pin.x - from[0];
  const dy = pin.y - from[1];
  const chamfer = Math.min(45, Math.abs(dx), Math.abs(dy));
  if (chamfer < 6) {
    return square
      ? [[pin.x, from[1]], [pin.x, pin.y]]
      : [[from[0], pin.y], [pin.x, pin.y]];
  }
  const sx = Math.sign(dx);
  const sy = Math.sign(dy);
  return square
    ? [[pin.x - sx * chamfer, from[1]], [pin.x, from[1] + sy * chamfer], [pin.x, pin.y]]
    : [[from[0], pin.y - sy * chamfer], [from[0] + sx * chamfer, pin.y], [pin.x, pin.y]];
}

/**
 * Bind one end of a trace to a pin. A small sideways slip is absorbed by
 * sliding the whole straight run into line — cleaner than bolting a jog onto
 * the end of it. Anything larger gets a proper elbow.
 */
function bind(pts: Array<[number, number]>, atStart: boolean, pin: Pin) {
  const index = atStart ? 0 : pts.length - 1;
  const step = atStart ? 1 : -1;
  const end = pts[index];
  const square = pin.side === "top" || pin.side === "bottom";
  const slip = square ? pin.x - end[0] : pin.y - end[1];

  if (Math.abs(slip) < 18) {
    const axis = square ? 0 : 1;
    const target = square ? pin.x : pin.y;
    const was = end[axis];
    for (let i = index; i >= 0 && i < pts.length; i += step) {
      if (pts[i][axis] !== was) break;
      pts[i][axis] = target;
    }
    end[square ? 1 : 0] = square ? pin.y : pin.x;
    return;
  }

  const from = pts[index + step] ?? end;
  const legs = approach(from, pin);
  if (atStart) pts.splice(0, 1, ...legs.reverse());
  else pts.splice(index, 1, ...legs);
}

/** Points to a path, dropping any point that repeats the one before it. */
function toPath(pts: Array<[number, number]>) {
  const trim = (n: number) => +n.toFixed(1);
  const kept = pts.filter(
    (p, i) => i === 0 || trim(p[0]) !== trim(pts[i - 1][0]) || trim(p[1]) !== trim(pts[i - 1][1])
  );
  return (
    `M${trim(kept[0][0])} ${trim(kept[0][1])} ` +
    kept.slice(1).map((p) => `L${trim(p[0])} ${trim(p[1])}`).join(" ")
  );
}

const claimed = new Set<string>();
const wired = traces.map((d) => {
  const pts = points(d).map((p) => [p[0], p[1]] as [number, number]);
  const tail = claimPin(pts[pts.length - 1], pts[pts.length - 2] ?? pts[0], claimed);
  if (tail) {
    claimed.add(tail.key);
    bind(pts, false, tail.pin);
  }
  const head = claimPin(pts[0], pts[1] ?? pts[pts.length - 1], claimed);
  if (head) {
    claimed.add(head.key);
    bind(pts, true, head.pin);
  }
  return toPath(pts);
});

/* One pad at each trace's end, one at a mid elbow — both snapped to the path,
   and to the wired path, so a pad can never sit where the copper used to be. */
const pads: Array<[number, number, number]> = wired.flatMap((d) => {
  const pts = points(d);
  const picks: Array<[number, number]> = [];
  const last = pts[pts.length - 1];
  if (last && onBoard(last)) picks.push(last);
  const mid = pts[Math.floor(pts.length / 2)];
  if (mid && onBoard(mid)) picks.push(mid);
  return picks.map(([x, y]) => [x, y, 5.5] as [number, number, number]);
});

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/**
 * Drawing progress is stepped before it reaches a path. Every trace that was
 * mid-draw rewrote three SVG attributes on every frame, and a change to any of
 * them repaints the whole board; at a hundredth of a trace per frame that is a
 * repaint nobody can see. Framer skips a write when the value is unchanged, so
 * rounding to the smallest visible step is what makes it skip.
 */
const STEPS = 26;
const stepped = (value: number) => Math.round(value * STEPS) / STEPS;

/** Board y -> the scroll window where that row is on screen. */
const windowFor = (y: number) => {
  const start = clamp((y - 120) / 1560, 0, 0.78);
  return [start, start + 0.13] as const;
};

/* Windows are resolved once here rather than re-parsing `d` on every render. */
const traceItems = wired.map((d) => {
  const [start, end] = windowFor(points(d)[0]?.[1] ?? 0);
  return { d, start, end };
});

const padItems = pads.map(([cx, cy, r]) => {
  const at = windowFor(cy)[0] + 0.1;
  return { cx, cy, r, from: at - 0.04, to: at + 0.03 };
});

const chipItems = chips.map((chip, index) => {
  const [start, end] = windowFor(chip.y);
  return { chip, pins: chipPins(chip, chipPinList[index]), start, end };
});

function Trace({
  d,
  start,
  end,
  progress,
  width = 1.6,
}: {
  d: string;
  start: number;
  end: number;
  progress: MotionValue<number>;
  width?: number;
}) {
  const pathLength = useTransform(progress, [start, end], [0, 1], { clamp: true });
  const drawn = useTransform(pathLength, stepped);
  return (
    <m.path
      d={d}
      fill="none"
      stroke="var(--circuit-line)"
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ pathLength: drawn }}
    />
  );
}

/**
 * The copper, as a mask.
 *
 * The current used to be a dash chasing each path via `stroke-dashoffset`, and
 * that was the single most expensive thing on the page: an animating stroke
 * property re-rasterises the entire SVG every frame, and the cost is per layer,
 * not per path — cutting twelve chasing dashes down to four changed nothing.
 *
 * So nothing in the SVG animates any more. The traces are stamped out once as a
 * mask, and a band of light slides underneath it on a transform, which the
 * compositor does for free. What you see is the same thing: light travelling
 * along the copper and nowhere else.
 */
const copperMask = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${BOARD_W} ${BOARD_H}">` +
    `<g fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round">` +
    wired.map((d) => `<path d="${d}"/>`).join("") +
    `</g></svg>`
)}")`;

function Pad({
  cx,
  cy,
  r,
  from,
  to,
  progress,
}: {
  cx: number;
  cy: number;
  r: number;
  from: number;
  to: number;
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(useTransform(progress, [from, to], [0, 1]), stepped);
  return (
    <m.circle
      cx={cx}
      cy={cy}
      r={r}
      fill="var(--circuit-surface)"
      stroke="var(--circuit-pad)"
      strokeWidth="2"
      style={{ opacity }}
    />
  );
}

function ChipPackage({
  chip,
  pins,
  start,
  end,
  progress,
}: {
  chip: Chip;
  pins: string;
  start: number;
  end: number;
  progress: MotionValue<number>;
}) {
  const outline = useTransform(useTransform(progress, [start, end], [0, 1]), stepped);
  const fill = useTransform(useTransform(progress, [start + 0.03, end], [0, 1]), stepped);
  return (
    <g>
      <m.rect
        x={chip.x}
        y={chip.y}
        width={chip.w}
        height={chip.h}
        rx={chip.rx}
        fill="var(--circuit-chip)"
        style={{ opacity: fill }}
      />
      <m.path
        d={pins}
        fill="none"
        stroke="var(--circuit-line)"
        strokeWidth="2.2"
        strokeLinecap="round"
        style={{ pathLength: outline }}
      />
      <m.rect
        x={chip.x}
        y={chip.y}
        width={chip.w}
        height={chip.h}
        rx={chip.rx}
        fill="none"
        stroke="var(--circuit-pad)"
        strokeWidth="2"
        style={{ pathLength: outline }}
      />
    </g>
  );
}

function CircuitBoard() {
  const still = useMotionOff();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 30,
    restDelta: 0.001,
  });
  /* The board is 200vh tall, so a full page scroll travels exactly one screen
     down it — the camera move and the drawing stay in step. */
  const travel = useTransform(progress, [0, 1], ["0vh", "-100vh"]);

  if (still) {
    return (
      <div className="circuit-field is-static" aria-hidden="true">
        <svg viewBox={`0 0 ${BOARD_W} ${BOARD_H}`} preserveAspectRatio="xMidYMid meet">
          {chipItems.map((item) => (
            <g key={`${item.chip.x}-${item.chip.y}`}>
              <rect {...item.chip} fill="var(--circuit-chip)" stroke="var(--circuit-pad)" strokeWidth="2" />
              <path d={item.pins} fill="none" stroke="var(--circuit-line)" strokeWidth="2.2" strokeLinecap="round" />
            </g>
          ))}
          {wired.map((d) => (
            <path key={d} d={d} fill="none" stroke="var(--circuit-line)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          ))}
          {pads.map(([cx, cy, r], index) => (
            <circle key={`${cx}-${cy}-${index}`} cx={cx} cy={cy} r={r} fill="var(--circuit-surface)" stroke="var(--circuit-pad)" strokeWidth="2" />
          ))}
        </svg>
      </div>
    );
  }

  return (
    <div className="circuit-field" aria-hidden="true">
      <m.div className="circuit-travel" style={{ y: travel }}>
        <svg viewBox={`0 0 ${BOARD_W} ${BOARD_H}`} preserveAspectRatio="xMidYMid slice">
          {chipItems.map((item) => (
            <ChipPackage
              key={`${item.chip.x}-${item.chip.y}`}
              chip={item.chip}
              pins={item.pins}
              start={item.start}
              end={item.end}
              progress={progress}
            />
          ))}
          {traceItems.map((item) => (
            <Trace key={item.d} {...item} progress={progress} />
          ))}
          {padItems.map((item, index) => (
            <Pad key={`${item.cx}-${item.cy}-${index}`} {...item} progress={progress} />
          ))}
        </svg>
        <div
          className="circuit-current"
          style={{ maskImage: copperMask, WebkitMaskImage: copperMask }}
        >
          <span className="circuit-current-band" />
          <span className="circuit-current-band circuit-current-band--late" />
        </div>
      </m.div>
    </div>
  );
}

/* Props-free, so memo keeps the 90-odd board nodes out of every page render. */
export default memo(CircuitBoard);
