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
  "M1460 830 L1320 830 L1245 905 L1245 1130 L1170 1205 L1170 1400",
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

/* One pad at each trace's end, one at a mid elbow — both snapped to the path. */
const pads: Array<[number, number, number]> = traces.flatMap((d) => {
  const pts = points(d);
  const picks: Array<[number, number]> = [];
  const last = pts[pts.length - 1];
  if (last && onBoard(last)) picks.push(last);
  const mid = pts[Math.floor(pts.length / 2)];
  if (mid && onBoard(mid)) picks.push(mid);
  return picks.map(([x, y]) => [x, y, 5.5] as [number, number, number]);
});

/** Pin stubs for a package, as one path so the whole comb draws as a unit. */
function chipPins(chip: Chip) {
  const stub = 14;
  const parts: string[] = [];
  const across = Math.max(2, Math.round(chip.w / 70));
  for (let i = 1; i <= across; i += 1) {
    const x = chip.x + (chip.w * i) / (across + 1);
    parts.push(`M${x} ${chip.y - stub} L${x} ${chip.y}`);
    parts.push(`M${x} ${chip.y + chip.h} L${x} ${chip.y + chip.h + stub}`);
  }
  const down = Math.max(2, Math.round(chip.h / 62));
  for (let i = 1; i <= down; i += 1) {
    const y = chip.y + (chip.h * i) / (down + 1);
    parts.push(`M${chip.x - stub} ${y} L${chip.x} ${y}`);
    parts.push(`M${chip.x + chip.w} ${y} L${chip.x + chip.w + stub} ${y}`);
  }
  return parts.join(" ");
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/** Board y -> the scroll window where that row is on screen. */
const windowFor = (y: number) => {
  const start = clamp((y - 120) / 1560, 0, 0.78);
  return [start, start + 0.13] as const;
};

/* Windows are resolved once here rather than re-parsing `d` on every render. */
const traceItems = traces.map((d) => {
  const [start, end] = windowFor(points(d)[0]?.[1] ?? 0);
  return { d, start, end };
});

const padItems = pads.map(([cx, cy, r]) => {
  const at = windowFor(cy)[0] + 0.1;
  return { cx, cy, r, from: at - 0.04, to: at + 0.03 };
});

const chipItems = chips.map((chip) => {
  const [start, end] = windowFor(chip.y);
  return { chip, pins: chipPins(chip), start, end };
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
  const pathLength = useTransform(progress, [start, end], [0, 1]);
  return (
    <m.path
      d={d}
      fill="none"
      stroke="var(--circuit-line)"
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ pathLength }}
    />
  );
}

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
  const opacity = useTransform(progress, [from, to], [0, 1]);
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
  const outline = useTransform(progress, [start, end], [0, 1]);
  const fill = useTransform(progress, [start + 0.03, end], [0, 1]);
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
          {traces.map((d) => (
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
      </m.div>
    </div>
  );
}

/* Props-free, so memo keeps the 90-odd board nodes out of every page render. */
export default memo(CircuitBoard);
