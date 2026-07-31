"use client";

/**
 * The stack as a board: icon bubbles wired together with traces, the way the
 * circuit behind the page is wired. Size carries weight — the tools the work
 * actually rests on are the big packages, the supporting ones are smaller.
 * No labels; names live in aria-label/title so the field still reads out.
 */

import { m } from "framer-motion";
import { memo } from "react";
import { useMotionOff } from "./use-motion-off";
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

type Node = {
  name: string;
  Icon: (props: { className?: string }) => React.JSX.Element;
  x: number;
  y: number;
  size: number;
  dur: number;
  delay: number;
  drift: number;
};

/* Positions are percentages of the field, shared with the trace layer below. */
const nodes: Record<string, Node> = {
  next: { name: "Next.js", Icon: NextIcon, x: 38, y: 34, size: 134, dur: 12, delay: 0.4, drift: 5 },
  react: { name: "React", Icon: ReactIcon, x: 60, y: 30, size: 134, dur: 13, delay: 0, drift: -4 },
  ts: { name: "TypeScript", Icon: TypeScriptIcon, x: 49, y: 66, size: 134, dur: 11.5, delay: 0.9, drift: 4 },

  js: { name: "JavaScript", Icon: JavaScriptIcon, x: 22, y: 60, size: 96, dur: 10, delay: 1.5, drift: -4 },
  node: { name: "Node.js", Icon: NodeIcon, x: 76, y: 56, size: 96, dur: 11, delay: 0.7, drift: 5 },
  tailwind: { name: "Tailwind", Icon: TailwindIcon, x: 70, y: 78, size: 96, dur: 12.5, delay: 2, drift: -5 },

  html: { name: "HTML5", Icon: HtmlIcon, x: 12, y: 28, size: 68, dur: 9, delay: 1.1, drift: 4 },
  css: { name: "CSS3", Icon: CssIcon, x: 27, y: 16, size: 68, dur: 9.5, delay: 2.4, drift: -3 },
  firebase: { name: "Firebase", Icon: FirebaseIcon, x: 88, y: 34, size: 68, dur: 10.5, delay: 0.3, drift: 4 },
  figma: { name: "Figma", Icon: FigmaIcon, x: 92, y: 70, size: 68, dur: 8.5, delay: 1.8, drift: -3 },
  git: { name: "Git", Icon: GitIcon, x: 10, y: 82, size: 68, dur: 11, delay: 2.6, drift: 3 },
  vercel: { name: "Vercel", Icon: VercelIcon, x: 60, y: 92, size: 68, dur: 9.8, delay: 1.3, drift: -4 },
};

const links: Array<[string, string]> = [
  ["next", "react"],
  ["next", "ts"],
  ["react", "ts"],
  ["ts", "js"],
  ["next", "css"],
  ["html", "js"],
  ["react", "node"],
  ["node", "firebase"],
  ["ts", "tailwind"],
  ["tailwind", "figma"],
  ["js", "git"],
  ["ts", "vercel"],
];

/**
 * A trace between two nodes: run along x, chamfer the corner at 45°, then drop
 * to the target — the same routing language as the board behind the page.
 */
function route(a: Node, b: Node) {
  const stepX = Math.sign(b.x - a.x) || 1;
  const stepY = Math.sign(b.y - a.y) || 1;
  const chamfer = 3.5;
  const corner = b.x - stepX * chamfer;
  return `M${a.x} ${a.y} H${corner} L${b.x} ${a.y + stepY * chamfer} V${b.y}`;
}

/* Where each trace turns. Pads render as round elements rather than SVG
   circles, so the field's aspect ratio can never squash them into ellipses. */
const joints = links.map(([from, to]) => {
  const a = nodes[from];
  const b = nodes[to];
  return { x: b.x, y: a.y + Math.sign(b.y - a.y) * 3.5, key: `${from}-${to}` };
});

const list = Object.values(nodes);

function StackBubbles() {
  const still = useMotionOff();
  return (
    <div className="bubble-field">
      <svg
        className="bubble-links"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {links.map(([from, to]) => (
          <path
            key={`${from}-${to}`}
            d={route(nodes[from], nodes[to])}
            fill="none"
            stroke="var(--circuit-pad)"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>

      {joints.map((joint) => (
        <span
          className="bubble-joint"
          key={joint.key}
          style={{ left: `${joint.x}%`, top: `${joint.y}%` }}
          aria-hidden="true"
        />
      ))}

      {list.map((node) => (
        <m.span
          key={node.name}
          className="bubble"
          role="img"
          aria-label={node.name}
          title={node.name}
          style={
            {
              left: `${node.x}%`,
              top: `${node.y}%`,
              "--size": node.size,
            } as React.CSSProperties
          }
          animate={still ? undefined : { y: [0, -9, 0], x: [0, node.drift, 0] }}
          transition={{
            duration: node.dur,
            delay: node.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          whileHover={{ scale: 1.08 }}
        >
          <node.Icon />
        </m.span>
      ))}
    </div>
  );
}

export default memo(StackBubbles);
