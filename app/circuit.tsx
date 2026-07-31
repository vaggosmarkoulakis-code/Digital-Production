"use client";

/**
 * Scroll-drawn circuit board.
 *
 * A fixed board sits behind the glass and draws itself as the page scrolls:
 * every trace owns a slice of the scroll progress, the slices overlap, and the
 * last one closes right at the foot of the page — so reaching the bottom means
 * arriving at a finished board.
 */

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

/* Traces laid out on a 1440 x 900 board, drawn with 45° elbows. */
const traces = [
  "M650 350 L650 275 L575 200 L575 45 L300 45",
  "M700 350 L700 250 L775 175 L775 -20",
  "M750 350 L750 300 L905 300 L980 225 L1460 225",
  "M800 350 L800 320 L1045 320 L1120 245 L1120 -20",
  "M850 400 L960 400 L1035 475 L1460 475",
  "M850 450 L1000 450 L1075 375 L1305 375 L1380 450 L1460 450",
  "M850 500 L945 500 L1020 575 L1130 575",
  "M850 530 L890 530 L965 605 L1130 605",
  "M590 400 L480 400 L405 325 L405 165 L300 165",
  "M590 450 L430 450 L355 375 L-20 375",
  "M590 500 L450 500 L375 575 L130 575 L55 650 L55 940",
  "M590 530 L505 530 L430 605 L185 605 L110 680 L-20 680",
  "M650 550 L650 645 L565 730 L565 940",
  "M700 550 L700 685 L385 685 L310 760 L310 940",
  "M750 550 L750 625 L905 625 L980 700 L980 940",
  "M800 550 L800 605 L1065 605 L1140 680 L1140 940",
  "M235 205 L235 265 L175 325 L-20 325",
  "M1205 720 L1205 800 L1280 875 L1460 875",
];

/* Solder pads and vias, in the order they should light up. */
const pads: Array<[number, number, number]> = [
  [575, 200, 5],
  [300, 45, 6],
  [775, 175, 5],
  [905, 300, 5],
  [1045, 320, 5],
  [405, 325, 5],
  [355, 375, 6],
  [1035, 475, 5],
  [1075, 375, 5],
  [300, 165, 6],
  [1020, 575, 5],
  [1130, 575, 6],
  [375, 575, 5],
  [430, 605, 5],
  [175, 325, 5],
  [905, 625, 5],
  [1065, 605, 5],
  [565, 730, 5],
  [385, 685, 5],
  [55, 650, 5],
  [110, 680, 5],
  [1280, 875, 6],
];

const chips: Array<{ x: number; y: number; w: number; h: number; rx: number }> = [
  { x: 590, y: 350, w: 260, h: 200, rx: 12 },
  { x: 170, y: 110, w: 130, h: 95, rx: 9 },
  { x: 1130, y: 610, w: 150, h: 110, rx: 9 },
];

/** Chip pin stubs, so the packages read as components rather than boxes. */
const pins = [
  ...[650, 700, 750, 800].flatMap((x) => [
    `M${x} 336 L${x} 350`,
    `M${x} 550 L${x} 564`,
  ]),
  ...[400, 450, 500].flatMap((y) => [
    `M576 ${y} L590 ${y}`,
    `M850 ${y} L864 ${y}`,
  ]),
];

const TOTAL = traces.length;

function Trace({
  d,
  progress,
  index,
  count,
  width = 1.6,
}: {
  d: string;
  progress: MotionValue<number>;
  index: number;
  count: number;
  width?: number;
}) {
  const start = (index / count) * 0.74;
  const pathLength = useTransform(progress, [start, Math.min(1, start + 0.34)], [0, 1]);
  return (
    <motion.path
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
  progress,
  index,
  count,
}: {
  cx: number;
  cy: number;
  r: number;
  progress: MotionValue<number>;
  index: number;
  count: number;
}) {
  const at = (index / count) * 0.78 + 0.06;
  const opacity = useTransform(progress, [at - 0.03, at + 0.03], [0, 1]);
  return (
    <motion.circle
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

function Chip({
  chip,
  progress,
  index,
}: {
  chip: (typeof chips)[number];
  progress: MotionValue<number>;
  index: number;
}) {
  const start = 0.04 + index * 0.24;
  const pathLength = useTransform(progress, [start, start + 0.3], [0, 1]);
  const fill = useTransform(progress, [start + 0.1, start + 0.36], [0, 1]);
  return (
    <g>
      <motion.rect
        x={chip.x}
        y={chip.y}
        width={chip.w}
        height={chip.h}
        rx={chip.rx}
        fill="var(--circuit-chip)"
        style={{ opacity: fill }}
      />
      <motion.rect
        x={chip.x}
        y={chip.y}
        width={chip.w}
        height={chip.h}
        rx={chip.rx}
        fill="none"
        stroke="var(--circuit-pad)"
        strokeWidth="2"
        style={{ pathLength }}
      />
    </g>
  );
}

export default function CircuitBoard() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 30,
    restDelta: 0.001,
  });

  if (reduced) {
    /* No scroll choreography: show the finished board, quietly. */
    return (
      <div className="circuit-field is-static" aria-hidden="true">
        <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
          {chips.map((chip) => (
            <rect key={`${chip.x}-${chip.y}`} {...chip} fill="var(--circuit-chip)" stroke="var(--circuit-pad)" strokeWidth="2" />
          ))}
          {[...traces, ...pins].map((d) => (
            <path key={d} d={d} fill="none" stroke="var(--circuit-line)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          ))}
          {pads.map(([cx, cy, r]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="var(--circuit-surface)" stroke="var(--circuit-pad)" strokeWidth="2" />
          ))}
        </svg>
      </div>
    );
  }

  return (
    <div className="circuit-field" aria-hidden="true">
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        {chips.map((chip, index) => (
          <Chip key={`${chip.x}-${chip.y}`} chip={chip} progress={progress} index={index} />
        ))}
        {pins.map((d, index) => (
          <Trace key={d} d={d} progress={progress} index={index % TOTAL} count={TOTAL} width={2.2} />
        ))}
        {traces.map((d, index) => (
          <Trace key={d} d={d} progress={progress} index={index} count={TOTAL} />
        ))}
        {pads.map(([cx, cy, r], index) => (
          <Pad
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r={r}
            progress={progress}
            index={index}
            count={pads.length}
          />
        ))}
      </svg>
    </div>
  );
}
