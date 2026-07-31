"use client";

/**
 * Floating bubbles of the stack — icons only, no labels.
 * Names live in aria-label/title so the field still reads to assistive tech.
 */

import { motion, useReducedMotion } from "framer-motion";
import {
  CssIcon,
  FigmaIcon,
  FirebaseIcon,
  GitIcon,
  HtmlIcon,
  JavaScriptIcon,
  NextIcon,
  NodeIcon,
  ReactIcon,
  TailwindIcon,
  TypeScriptIcon,
  VercelIcon,
} from "./tech-icons";

const bubbles: Array<{
  name: string;
  Icon: (props: { className?: string }) => React.JSX.Element;
  x: number;
  y: number;
  size: number;
  dur: number;
  delay: number;
  drift: number;
}> = [
  { name: "TypeScript", Icon: TypeScriptIcon, x: 8, y: 30, size: 104, dur: 9.5, delay: 0, drift: 9 },
  { name: "React", Icon: ReactIcon, x: 21, y: 64, size: 88, dur: 11, delay: 1.1, drift: -7 },
  { name: "Next.js", Icon: NextIcon, x: 31, y: 22, size: 120, dur: 12.5, delay: 0.5, drift: 11 },
  { name: "JavaScript", Icon: JavaScriptIcon, x: 42, y: 58, size: 80, dur: 8.5, delay: 1.8, drift: -6 },
  { name: "HTML5", Icon: HtmlIcon, x: 49, y: 26, size: 86, dur: 10.5, delay: 0.9, drift: 8 },
  { name: "Tailwind", Icon: TailwindIcon, x: 60, y: 64, size: 110, dur: 12, delay: 0.3, drift: -10 },
  { name: "CSS3", Icon: CssIcon, x: 66, y: 24, size: 78, dur: 9, delay: 2.2, drift: 7 },
  { name: "Node.js", Icon: NodeIcon, x: 78, y: 58, size: 94, dur: 11.5, delay: 1.4, drift: -8 },
  { name: "Firebase", Icon: FirebaseIcon, x: 88, y: 28, size: 90, dur: 10, delay: 0.7, drift: 9 },
  { name: "Figma", Icon: FigmaIcon, x: 94, y: 68, size: 70, dur: 8, delay: 2.6, drift: -5 },
  { name: "Git", Icon: GitIcon, x: 14, y: 88, size: 72, dur: 10.8, delay: 1.6, drift: 6 },
  { name: "Vercel", Icon: VercelIcon, x: 72, y: 88, size: 76, dur: 9.8, delay: 0.2, drift: -7 },
];

export default function StackBubbles() {
  const reduced = useReducedMotion();
  return (
    <div className="bubble-field">
      {bubbles.map((bubble) => (
        <motion.span
          key={bubble.name}
          className="bubble"
          role="img"
          aria-label={bubble.name}
          title={bubble.name}
          style={
            {
              left: `${bubble.x}%`,
              top: `${bubble.y}%`,
              "--size": bubble.size,
            } as React.CSSProperties
          }
          animate={
            reduced ? undefined : { y: [0, -18, 0], x: [0, bubble.drift, 0] }
          }
          transition={{
            duration: bubble.dur,
            delay: bubble.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          whileHover={{ scale: 1.09 }}
        >
          <bubble.Icon />
        </motion.span>
      ))}
    </div>
  );
}
