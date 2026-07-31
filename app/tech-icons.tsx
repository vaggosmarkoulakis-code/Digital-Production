/**
 * Monochrome brand marks for the stack section.
 *
 * Every icon paints with `currentColor` on a 24×24 grid so the tiles can tint
 * them with the page's electric blue instead of eight competing brand palettes.
 */

type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  "aria-hidden": true as const,
};

const glyph = {
  fontSize: "9.5px",
  fontWeight: 800,
  letterSpacing: "-0.03em",
} as const;

export function NextIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M8.6 15.6V8.4l7.2 9.1"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M15 8.4v5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function ReactIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="1.3">
        <ellipse cx="12" cy="12" rx="9.6" ry="3.7" />
        <ellipse cx="12" cy="12" rx="9.6" ry="3.7" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="9.6" ry="3.7" transform="rotate(120 12 12)" />
      </g>
    </svg>
  );
}

export function TypeScriptIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="2" y="2" width="20" height="20" rx="4.4" stroke="currentColor" strokeWidth="1.6" />
      <text
        x="12"
        y="15.6"
        textAnchor="middle"
        fill="currentColor"
        style={glyph}
      >
        TS
      </text>
    </svg>
  );
}

export function JavaScriptIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="2" y="2" width="20" height="20" rx="4.4" stroke="currentColor" strokeWidth="1.6" />
      <text
        x="12"
        y="15.6"
        textAnchor="middle"
        fill="currentColor"
        style={glyph}
      >
        JS
      </text>
    </svg>
  );
}

function Shield({ label, className }: { label: string; className?: string }) {
  return (
    <svg {...base} className={className}>
      <path
        d="M4.1 3h15.8l-1.4 15.1L12 21l-6.5-2.9L4.1 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <text
        x="12"
        y="15.2"
        textAnchor="middle"
        fill="currentColor"
        style={{ ...glyph, fontSize: "8px" }}
      >
        {label}
      </text>
    </svg>
  );
}

export function HtmlIcon({ className }: IconProps) {
  return <Shield label="5" className={className} />;
}

export function CssIcon({ className }: IconProps) {
  return <Shield label="3" className={className} />;
}

export function TailwindIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <g stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11c1.2-3.4 3.2-5.1 6-5.1 4.2 0 4.7 3.1 6.8 3.6 1.4.4 2.6-.1 3.7-1.5-1.2 3.4-3.2 5.1-6 5.1-4.2 0-4.7-3.1-6.8-3.6C5.3 9.1 4.1 9.6 3 11Z" />
        <path d="M3 18.1c1.2-3.4 3.2-5.1 6-5.1 4.2 0 4.7 3.1 6.8 3.6 1.4.4 2.6-.1 3.7-1.5-1.2 3.4-3.2 5.1-6 5.1-4.2 0-4.7-3.1-6.8-3.6-1.4-.4-2.6.1-3.7 1.5Z" />
      </g>
    </svg>
  );
}

export function NodeIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path
        d="M12 2.2 20.4 7v10L12 21.8 3.6 17V7L12 2.2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9.4 9v5.2c0 .9-.7 1.6-1.6 1.6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M15.9 10.2c-.2-.8-.9-1.2-1.9-1.2-1.2 0-1.9.5-1.9 1.3 0 1.9 4 .8 4 2.9 0 .9-.8 1.5-2.1 1.5-1.2 0-2-.5-2.1-1.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FirebaseIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path
        d="m4 17.6 2.6-14 3.1 5.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="m4 17.6 5-14.4 6.8 11.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        opacity=".55"
      />
      <path
        d="M4 17.6 12 22l8-4.4-1.6-9.9L4 17.6Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function VercelIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path
        d="M12 3.6 22 20.4H2L12 3.6Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FigmaIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <g stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M12 2.6H8.6a3.4 3.4 0 1 0 0 6.8H12V2.6Z" />
        <path d="M12 2.6h3.4a3.4 3.4 0 1 1 0 6.8H12V2.6Z" />
        <path d="M12 9.4H8.6a3.4 3.4 0 1 0 0 6.8H12V9.4Z" />
        <path d="M12 16.2H8.6a3.4 3.4 0 1 0 3.4 3.4v-3.4Z" />
        <circle cx="15.4" cy="12.8" r="3.4" />
      </g>
    </svg>
  );
}

export function GitIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path
        d="M12 1.9 22.1 12 12 22.1 1.9 12 12 1.9Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d="M9 15V9.6l5.2 4.6" />
        <circle cx="9" cy="8.4" r="1.3" fill="currentColor" stroke="none" />
        <circle cx="9" cy="16.1" r="1.3" fill="currentColor" stroke="none" />
        <circle cx="15" cy="14.9" r="1.3" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}
