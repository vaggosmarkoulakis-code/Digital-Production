"use client";

/**
 * The stack as a board: icon bubbles wired together with traces, the way the
 * circuit behind the page is wired. Size carries weight — the tools the work
 * actually rests on are the big packages, the supporting ones are smaller.
 * No labels; names live in aria-label/title so the field still reads out.
 */

import { memo } from "react";
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
  /* Landscape placement — percentages of a field that is wider than it is tall. */
  x: number;
  y: number;
  /* Portrait placement, for the phone. The landscape arrangement squeezed into a
     narrow column put bubbles on top of each other and squashed every trace, so
     the board is laid out a second time as a column instead of being scaled. */
  mx: number;
  my: number;
  size: number;
  dur: number;
  delay: number;
  drift: number;
};

const nodes: Record<string, Node> = {
  next: { name: "Next.js", Icon: NextIcon, x: 38, y: 34, mx: 30, my: 23, size: 134, dur: 12, delay: 0.4, drift: 5 },
  react: { name: "React", Icon: ReactIcon, x: 60, y: 30, mx: 70, my: 36, size: 134, dur: 13, delay: 0, drift: -4 },
  ts: { name: "TypeScript", Icon: TypeScriptIcon, x: 49, y: 66, mx: 36, my: 55, size: 134, dur: 11.5, delay: 0.9, drift: 4 },

  js: { name: "JavaScript", Icon: JavaScriptIcon, x: 22, y: 60, mx: 62, my: 71, size: 96, dur: 10, delay: 1.5, drift: -4 },
  node: { name: "Node.js", Icon: NodeIcon, x: 76, y: 56, mx: 82, my: 58, size: 96, dur: 11, delay: 0.7, drift: 5 },
  tailwind: { name: "Tailwind", Icon: TailwindIcon, x: 70, y: 78, mx: 34, my: 85, size: 96, dur: 12.5, delay: 2, drift: -5 },

  html: { name: "HTML5", Icon: HtmlIcon, x: 12, y: 28, mx: 76, my: 9, size: 68, dur: 9, delay: 1.1, drift: 4 },
  css: { name: "CSS3", Icon: CssIcon, x: 27, y: 16, mx: 24, my: 8, size: 68, dur: 9.5, delay: 2.4, drift: -3 },
  firebase: { name: "Firebase", Icon: FirebaseIcon, x: 88, y: 34, mx: 90, my: 76, size: 68, dur: 10.5, delay: 0.3, drift: 4 },
  figma: { name: "Figma", Icon: FigmaIcon, x: 92, y: 70, mx: 10, my: 68, size: 68, dur: 8.5, delay: 1.8, drift: -3 },
  git: { name: "Git", Icon: GitIcon, x: 10, y: 82, mx: 11, my: 42, size: 68, dur: 11, delay: 2.6, drift: 3 },
  vercel: { name: "Vercel", Icon: VercelIcon, x: 60, y: 92, mx: 66, my: 92, size: 68, dur: 9.8, delay: 1.3, drift: -4 },
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

type Point = { x: number; y: number };

/**
 * A trace between two points: run along x, chamfer the corner, then drop to the
 * target — the same routing language as the board behind the page. The chamfer
 * is given per axis because the field is stretched to fit (`preserveAspectRatio
 * ="none"`), so equal units are not equal pixels.
 */
function route(a: Point, b: Point, cx: number, cy: number) {
  const stepX = Math.sign(b.x - a.x) || 1;
  const stepY = Math.sign(b.y - a.y) || 1;
  const corner = b.x - stepX * cx;
  return `M${a.x} ${a.y} H${corner} L${b.x} ${a.y + stepY * cy} V${b.y}`;
}

/**
 * One wiring for a given placement: the traces, and the pads where they turn.
 * Pads render as round elements rather than SVG circles, so the field's aspect
 * ratio can never squash them into ellipses. Both wirings are built once at
 * module scope and the stylesheet shows whichever suits the viewport.
 */
function wire(pick: (node: Node) => Point, cx: number, cy: number) {
  return links.map(([from, to]) => {
    const a = pick(nodes[from]);
    const b = pick(nodes[to]);
    return {
      key: `${from}-${to}`,
      d: route(a, b, cx, cy),
      joint: { x: b.x, y: a.y + (Math.sign(b.y - a.y) || 1) * cy },
    };
  });
}

/**
 * The wiring, stamped out once as a mask, so a band of light can slide beneath
 * it on a transform. The current used to be a dash chasing each path via
 * `stroke-dashoffset`; an animating stroke property re-rasterises the whole SVG
 * every frame, and on a phone that alone cost a third of the frames.
 */
function maskFor(traces: Array<{ d: string }>) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">` +
    `<g fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">` +
    traces.map((t) => `<path d="${t.d}"/>`).join("") +
    `</g></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

const wirings = [
  { modifier: "wide", traces: wire((n) => ({ x: n.x, y: n.y }), 3.5, 3.5) },
  { modifier: "tall", traces: wire((n) => ({ x: n.mx, y: n.my }), 3.5, 2.6) },
].map((w) => ({ ...w, mask: maskFor(w.traces) }));

const list = Object.values(nodes);

function StackBubbles() {
  return (
    <div className="bubble-field">
      {wirings.map(({ modifier, traces, mask }) => (
        <div className={`bubble-wiring bubble-wiring--${modifier}`} key={modifier} aria-hidden="true">
          <svg className="bubble-links" viewBox="0 0 100 100" preserveAspectRatio="none">
            {traces.map((trace) => (
              <path
                key={trace.key}
                d={trace.d}
                fill="none"
                stroke="var(--circuit-pad)"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>

          <div className="bubble-current" style={{ maskImage: mask, WebkitMaskImage: mask }}>
            <span className="bubble-current-band" />
          </div>

          {traces.map((trace) => (
            <span
              className="bubble-joint"
              key={trace.key}
              style={{ left: `${trace.joint.x}%`, top: `${trace.joint.y}%` }}
            />
          ))}
        </div>
      ))}

      {/* The float is a CSS animation, not a JavaScript one. Twelve bubbles
          drifting on the main thread meant twelve inline style writes every
          frame of every scroll, on every part of the page, whether or not the
          stack was anywhere near the viewport. As `translate` — the standalone
          property, so the hover `scale` still composes with it — the browser
          runs the whole thing on the compositor for nothing. */}
      {list.map((node) => (
        <span
          key={node.name}
          className="bubble"
          role="img"
          aria-label={node.name}
          title={node.name}
          style={
            {
              "--x": `${node.x}%`,
              "--y": `${node.y}%`,
              "--mx": `${node.mx}%`,
              "--my": `${node.my}%`,
              "--size": node.size,
              "--float-x": `${node.drift}px`,
              "--float-dur": `${node.dur}s`,
              "--float-delay": `${node.delay}s`,
            } as React.CSSProperties
          }
        >
          <node.Icon />
        </span>
      ))}
    </div>
  );
}

export default memo(StackBubbles);
