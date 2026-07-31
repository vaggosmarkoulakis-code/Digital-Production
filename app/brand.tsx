/**
 * The MK monogram: a heavy M whose right arm is answered by a detached
 * chevron. Drawn as strokes so it stays crisp at favicon size and inherits
 * colour from whatever surface it sits on.
 */

export function MarkLogo({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path
        d="M13 55V13l18 31 19-32 6 15"
        stroke="currentColor"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M27 55l16-17 13 15"
        stroke="currentColor"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity=".62"
      />
    </svg>
  );
}

/** The same mark with its own blue ramp, for light surfaces. */
export function MarkLogoColour({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="mkStem" x1="10" y1="10" x2="56" y2="58" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3f86ff" />
          <stop offset="0.55" stopColor="#0a5cff" />
          <stop offset="1" stopColor="#0a3ec0" />
        </linearGradient>
        <linearGradient id="mkArm" x1="27" y1="38" x2="56" y2="55" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9cc3ff" />
          <stop offset="1" stopColor="#5b95ff" />
        </linearGradient>
      </defs>
      <path
        d="M13 55V13l18 31 19-32 6 15"
        stroke="url(#mkStem)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M27 55l16-17 13 15"
        stroke="url(#mkArm)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
