"use client";

/**
 * The colour behind the glass.
 *
 * A single fixed set of washes reads identically from top to bottom, so this
 * carries six of them at different hues, sizes and corners, each fading in
 * around its own point in the scroll and drifting at its own rate. Whatever
 * section you are on, the mix behind the glass is a different one.
 *
 * Only opacity and transform change, so the whole layer stays on the
 * compositor — no filters, nothing to re-rasterise per frame.
 */

import { m, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { memo } from "react";

type Blob = {
  cls: string;
  /** Scroll fraction where this wash is at full strength. */
  at: number;
  /** How far it drifts, in vh, across the whole page. */
  travel: number;
};

const blobs: Blob[] = [
  { cls: "blob-a", at: 0.0, travel: -26 },
  { cls: "blob-b", at: 0.2, travel: 18 },
  { cls: "blob-c", at: 0.38, travel: -22 },
  { cls: "blob-d", at: 0.56, travel: 24 },
  { cls: "blob-e", at: 0.74, travel: -18 },
  { cls: "blob-f", at: 0.92, travel: 20 },
];

/**
 * Both values are stepped before they reach the element. Left continuous, each
 * wash wrote a new opacity and a new offset on every single frame of every
 * scroll — six washes, twelve style writes a frame, for changes far below what
 * an eye can see. Framer skips a write when the value has not changed, so
 * rounding to the smallest visible step is what makes it skip.
 */
const step = (value: number, size: number) => Math.round(value / size) * size;

function Wash({ blob, progress }: { blob: Blob; progress: MotionValue<number> }) {
  const opacity = useTransform(
    progress,
    [blob.at - 0.3, blob.at, blob.at + 0.3],
    [0, 1, 0]
  );
  const stepped = useTransform(opacity, (value) => step(value, 1 / 40));
  /* A quarter of a vh — under a pixel of travel on a phone. */
  const y = useTransform(progress, (value) => `${step(value * blob.travel, 0.25)}vh`);
  return <m.span className={`aurora ${blob.cls}`} style={{ opacity: stepped, y }} />;
}

function Atmosphere() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="atmosphere" aria-hidden="true">
      {blobs.map((blob) => (
        <Wash key={blob.cls} blob={blob} progress={progress} />
      ))}
    </div>
  );
}

export default memo(Atmosphere);
