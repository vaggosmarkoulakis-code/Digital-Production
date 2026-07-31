"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  useMotionValue,
  useScroll,
  useSpring,
} from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Code2,
  Gauge,
  Globe2,
  Info,
  Languages,
  Layers,
  Mail,
  Menu,
  MessageCircle,
  MonitorSmartphone,
  PenTool,
  Phone,
  Rocket,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import Atmosphere from "./atmosphere";
import CircuitBoard from "./circuit";
import { useMotionOff } from "./use-motion-off";

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

type Lang = "el" | "en";
type Copy = { el: string; en: string };

const t = (value: Copy, lang: Lang) => value[lang];

const profile = {
  name: { el: "Βαγγέλης Μαρκουλάκης", en: "Vangelis Markoulakis" },
  role: { el: "Web Developer & Digital Designer", en: "Web Developer & Digital Designer" },
  phoneLabel: "+30 695 538 2035",
  phoneHref: "tel:+306955382035",
  instagramHandle: "@vagg_mrk",
  instagramHref: "https://instagram.com/vagg_mrk",
  whatsappHref: "https://wa.me/306955382035",
  email: "markoulakisevan@gmail.com",
};

const navLinks: Array<{ href: string; label: Copy }> = [
  { href: "#services", label: { el: "Τι κάνω", en: "What I do" } },
  { href: "#work", label: { el: "Δουλειές", en: "Work" } },
  { href: "#pricing", label: { el: "Τιμές", en: "Pricing" } },
  { href: "#process", label: { el: "Πώς δουλεύω", en: "How it works" } },
  { href: "#contact", label: { el: "Επικοινωνία", en: "Contact" } },
];

/* Named for what it measures, not for the tool that measures it — "Lighthouse"
   means nothing to someone who has never built a website. */
const scoreNote: Copy = {
  el: "Η Google βαθμολογεί κάθε ιστοσελίδα στα 100: πόσο γρήγορα ανοίγει, πόσο εύκολα διαβάζεται και πόσο εύκολα σας βρίσκει ο κόσμος. Δεν παραδίδω σελίδα κάτω από 98.",
  en: "Google scores every website out of 100: how fast it opens, how easily it reads, and how easily people find you. I don’t hand over a page below 98.",
};

/* Everything below is written for someone who has never built a website: no
   "landing page", no "responsive", no "SEO" — what it is, in the words a
   customer would use asking for it. */
const services: Array<{ icon: LucideIcon; title: Copy; items: Array<Copy> }> = [
  {
    icon: Globe2,
    title: { el: "Ιστοσελίδες", en: "Websites" },
    items: [
      { el: "Μία σελίδα με τα βασικά", en: "One page with the essentials" },
      { el: "Σελίδα για την επιχείρησή σας", en: "A site for your business" },
      { el: "Ανανέωση παλιάς σελίδας", en: "A refresh of an old site" },
    ],
  },
  {
    icon: ShoppingBag,
    title: { el: "Πωλήσεις & κρατήσεις", en: "Sales & bookings" },
    items: [
      { el: "Πούλημα προϊόντων online", en: "Selling online" },
      { el: "Παραγγελίες από το κινητό", en: "Orders from a phone" },
      { el: "Ραντεβού & κρατήσεις", en: "Appointments & bookings" },
    ],
  },
  {
    icon: MonitorSmartphone,
    title: { el: "Εφαρμογές", en: "Apps" },
    items: [
      { el: "Εφαρμογή για κινητό", en: "An app for phones" },
      { el: "Πίνακας με τα νούμερά σας", en: "A dashboard of your numbers" },
      { el: "Δουλειές που γίνονται μόνες τους", en: "Jobs that run themselves" },
    ],
  },
  {
    icon: Zap,
    title: { el: "Να σας βρίσκουν", en: "Getting found" },
    items: [
      { el: "Ψηλά στην αναζήτηση Google", en: "High up in Google search" },
      { el: "Προφίλ στον χάρτη της Google", en: "A profile on Google Maps" },
      { el: "Φιλοξενία, όνομα & συντήρηση", en: "Hosting, domain & upkeep" },
    ],
  },
];

const pricing: Array<{
  name: Copy;
  price: Copy;
  sub: Copy;
  featured?: boolean;
  features: Array<Copy>;
}> = [
  {
    name: { el: "Μία σελίδα", en: "One page" },
    price: { el: "300€", en: "€300" },
    sub: { el: "+ 10€ τον μήνα για συντήρηση", en: "+ €10 a month to keep it running" },
    features: [
      { el: "Μία σελίδα με όλα τα βασικά", en: "One page with all the essentials" },
      { el: "Να σας βρίσκουν στη Google", en: "So people find you on Google" },
      { el: "Σωστή εμφάνιση σε κινητό και υπολογιστή", en: "Looks right on phone and computer" },
      { el: "Τηλέφωνο, χάρτης και social μέσα", en: "Phone, map and socials built in" },
    ],
  },
  {
    name: { el: "Πολλές σελίδες", en: "Several pages" },
    price: { el: "500€", en: "€500" },
    sub: { el: "+ 15€ τον μήνα για συντήρηση", en: "+ €15 a month to keep it running" },
    featured: true,
    features: [
      { el: "Πολλές σελίδες", en: "Several pages" },
      { el: "Μενού για να τις βρίσκει ο κόσμος", en: "A menu so people can find them" },
      { el: "Κινήσεις και εφέ", en: "Movement and effects" },
      { el: "Πιο προσεγμένη εμφάνιση", en: "A more polished look" },
      { el: "Να σας βρίσκουν στη Google", en: "So people find you on Google" },
    ],
  },
  {
    name: { el: "Κάτι δικό σας", en: "Something of your own" },
    price: { el: "Συζητήσιμη", en: "Let’s talk" },
    sub: { el: "Αναλόγως τι χρειάζεστε", en: "Depending on what you need" },
    features: [
      { el: "Πούλημα ή κρατήσεις online", en: "Selling or bookings online" },
      { el: "Εφαρμογή για κινητό", en: "An app for phones" },
      { el: "Δουλειές που γίνονται μόνες τους", en: "Jobs that run themselves" },
      { el: "Τιμή αφού μιλήσουμε", en: "A price once we’ve talked" },
    ],
  },
];

const processSteps: Array<{ icon: LucideIcon; title: Copy }> = [
  { icon: MessageCircle, title: { el: "Μιλάμε", en: "We talk" } },
  { icon: PenTool, title: { el: "Σχεδιάζω", en: "I design it" } },
  { icon: Code2, title: { el: "Φτιάχνω", en: "I build it" } },
  { icon: ShieldCheck, title: { el: "Ελέγχω", en: "I check it" } },
  { icon: Rocket, title: { el: "Βγαίνει στον αέρα", en: "It goes live" } },
  { icon: Sparkles, title: { el: "Το προσέχω", en: "I look after it" } },
];

const values: Array<{ icon: LucideIcon; title: Copy }> = [
  {
    icon: Layers,
    title: { el: "Σχέδιο και κατασκευή από τον ίδιο", en: "Designed and built by one person" },
  },
  { icon: Gauge, title: { el: "Ανοίγει γρήγορα και δείχνει ωραία", en: "Opens fast and looks good" } },
  {
    icon: MonitorSmartphone,
    title: { el: "Σωστή σε κινητό και υπολογιστή", en: "Right on phone and computer" },
  },
  { icon: Sparkles, title: { el: "Λίγες δουλειές τη φορά", en: "A few jobs at a time" } },
];

const workTags: Array<Copy> = [
  { el: "Ανοίγει γρήγορα", en: "Opens fast" },
  { el: "Σε κινητό & υπολογιστή", en: "Phone & computer" },
  { el: "Βρίσκεται στη Google", en: "Found on Google" },
  { el: "Δικό του σχέδιο", en: "Its own design" },
];

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

function InstagramGlyph({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2.6" y="2.6" width="18.8" height="18.8" rx="5.4" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.4" cy="6.6" r="1.15" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * `getBoundingClientRect` forces a layout, so measuring on every mousemove made
 * the browser re-lay-out the page dozens of times a second. The box only moves
 * when the pointer enters it, so measure there and reuse the result.
 */
function useSpotlight() {
  const box = useRef<DOMRect | null>(null);
  const onPointerEnter = useCallback((event: ReactMouseEvent<HTMLElement>) => {
    box.current = event.currentTarget.getBoundingClientRect();
  }, []);
  const onPointerMove = useCallback((event: ReactMouseEvent<HTMLElement>) => {
    const rect = box.current;
    if (!rect) return;
    const target = event.currentTarget;
    target.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    target.style.setProperty("--my", `${event.clientY - rect.top}px`);
  }, []);
  return { onPointerEnter, onPointerMove };
}

function GlassCard({
  children,
  className = "",
  delay = 0,
  spotlight = true,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  spotlight?: boolean;
}) {
  const handlers = useSpotlight();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => (ref.current ? watchForReveal(ref.current) : undefined), []);
  return (
    <div
      ref={ref}
      className={`glass reveal ${spotlight ? "spotlight" : ""} ${className}`}
      {...(spotlight ? handlers : {})}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}

/**
 * One observer for every reveal on the page, created on first use. Twenty
 * separate IntersectionObservers is twenty sets of bookkeeping for a job that
 * is identical each time.
 */
let revealObserver: IntersectionObserver | null = null;

function watchForReveal(el: Element) {
  if (typeof IntersectionObserver === "undefined") {
    el.classList.add("is-in");
    return () => {};
  }
  revealObserver ??= new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        /* A quarter of the element, or — for anything taller than the screen,
           which can never show a quarter of itself — simply being on screen.
           `rootBounds` is null in a few cross-origin cases; there, showing it
           is the safe answer. */
        const root = entry.rootBounds?.height;
        const tall = !root || entry.boundingClientRect.height > root * 0.6;
        if (entry.intersectionRatio < 0.25 && !tall) continue;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      }
    },
    { threshold: [0, 0.25] }
  );
  revealObserver.observe(el);
  return () => revealObserver?.unobserve(el);
}

/**
 * The entrance. It used to be a JavaScript animation per element; during a fast
 * scroll a dozen of them ran at once, each writing inline styles every frame,
 * and that was most of the reason a phone stuttered. A class and a CSS
 * transition do the same thing with one style write per element, ever.
 */
function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => (ref.current ? watchForReveal(ref.current) : undefined), []);
  return (
    <div
      ref={ref}
      className={className ? `reveal ${className}` : "reveal"}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}

function MagneticLink({
  href,
  className = "",
  children,
  external = false,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const still = useMotionOff();
  /* Motion values rather than state: the pull is written straight to the
     element, so moving the pointer never re-renders React. */
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spring = { stiffness: 250, damping: 18 } as const;
  const px = useSpring(x, spring);
  const py = useSpring(y, spring);
  const box = useRef<DOMRect | null>(null);

  return (
    <m.a
      href={href}
      className={className}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      style={{ x: px, y: py }}
      onPointerEnter={(event) => {
        box.current = event.currentTarget.getBoundingClientRect();
      }}
      onPointerMove={(event) => {
        const rect = box.current;
        if (still || !rect) return;
        x.set((event.clientX - rect.left - rect.width / 2) * 0.16);
        y.set((event.clientY - rect.top - rect.height / 2) * 0.24);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </m.a>
  );
}

function CursorGlow() {
  const still = useMotionOff();
  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  const sx = useSpring(x, { stiffness: 120, damping: 22, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 120, damping: 22, mass: 0.4 });

  useEffect(() => {
    if (still) return;
    if (window.matchMedia("(hover: none)").matches) return;
    const move = (event: globalThis.MouseEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [still, x, y]);

  if (still) return null;
  return <m.div className="cursor-glow" style={{ x: sx, y: sy }} aria-hidden="true" />;
}

/** A stat with a note behind a button, for figures that need a sentence. */
function StatWithNote({
  value,
  label,
  note,
  buttonLabel,
  closeLabel,
}: {
  value: string;
  label: string;
  note: string;
  buttonLabel: string;
  closeLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const pop = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    /* Opened from a tile near the foot of the screen, the note hangs below the
       fold. Bringing it into view is simpler and steadier than flipping it
       above the tile, which would put it under the sticky header instead. */
    pop.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onDown = (event: globalThis.MouseEvent) => {
      if (!wrap.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <div className="glass stat-tile stat-tile-note" ref={wrap}>
      <b>{value}</b>
      <span>
        {label}
        <button
          type="button"
          className="stat-info"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-label={buttonLabel}
        >
          <Info />
        </button>
      </span>
      {open && (
        <m.div
          className="glass stat-pop"
          ref={pop}
          role="dialog"
          aria-label={buttonLabel}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <p>{note}</p>
          <button type="button" onClick={() => setOpen(false)}>
            {closeLabel}
          </button>
        </m.div>
      )}
    </div>
  );
}

/** SOMA's mark: the wordmark alone, orange on black. */
function SomaMark() {
  return (
    <svg className="soma-mark" viewBox="0 0 420 130" role="img" aria-label="SOMA">
      <defs>
        <linearGradient id="somaGrad" x1="40" y1="20" x2="380" y2="112" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffc27a" />
          <stop offset="0.45" stopColor="#ff8330" />
          <stop offset="1" stopColor="#df4510" />
        </linearGradient>
      </defs>
      <text x="203" y="92" textAnchor="middle" fill="url(#somaGrad)">
        SOMA
      </text>
    </svg>
  );
}

/**
 * The process, typed out.
 *
 * One line that writes each step, holds it, wipes it and moves on. The text is
 * written straight to the node rather than through React state — a re-render
 * per character, six times a cycle, forever, is exactly the sort of thing this
 * page has been getting rid of. Only the icon change costs a render, and that
 * is once a step. It stops itself when the section is off screen.
 */
const TYPE_MS = 62;
const WIPE_MS = 26;
const HOLD_MS = 1500;

function ProcessTyper({ lang }: { lang: Lang }) {
  const still = useMotionOff();
  const host = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLSpanElement>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (still) return;
    const node = line.current;
    const box = host.current;
    if (!node || !box) return;

    let index = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let live = true;
    let onScreen = true;

    const words = () => processSteps.map((s) => t(s.title, lang));

    const run = () => {
      if (!live) return;
      if (!onScreen) {
        timer = setTimeout(run, 400);
        return;
      }
      const word = words()[index];
      let cut = 0;
      const write = () => {
        if (!live) return;
        cut += 1;
        node.textContent = word.slice(0, cut);
        if (cut < word.length) timer = setTimeout(write, TYPE_MS);
        else timer = setTimeout(wipe, HOLD_MS);
      };
      const wipe = () => {
        if (!live) return;
        cut -= 1;
        node.textContent = word.slice(0, Math.max(0, cut));
        if (cut > 0) timer = setTimeout(wipe, WIPE_MS);
        else {
          index = (index + 1) % processSteps.length;
          setStep(index);
          timer = setTimeout(run, 260);
        }
      };
      write();
    };

    const watcher = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
      },
      { rootMargin: "80px" }
    );
    watcher.observe(box);
    run();

    return () => {
      live = false;
      clearTimeout(timer);
      watcher.disconnect();
    };
  }, [lang, still]);

  const StepIcon = processSteps[step].icon;

  return (
    <div className="glass process-typer" ref={host}>
      <span className="process-icon" key={step}>
        <StepIcon />
      </span>
      <p className="process-line" aria-hidden={!still}>
        <span ref={line}>{still ? t(processSteps[0].title, lang) : ""}</span>
        {!still && <i className="process-caret" />}
      </p>
      {/* Where you are in the six, so the panel says more than one word at a
          time and the line has something to sit against. */}
      <span className="process-dots" aria-hidden="true">
        {processSteps.map((s, i) => (
          <i key={s.title.en} className={i === step ? "is-on" : undefined} />
        ))}
      </span>
      {/* The steps in full for anyone the animation never reaches — a screen
          reader, or a reader who has asked for less motion. */}
      <ol className="process-list">
        {processSteps.map((s) => (
          <li key={s.title.en}>{t(s.title, lang)}</li>
        ))}
      </ol>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

/**
 * The nav owns every piece of scroll-driven state. Kept inside the page, each
 * scroll-spy or sticky flip re-rendered the whole tree — the board's ninety-odd
 * nodes, the bubbles and every card — for a change only the dock can see.
 */
function SiteNav({ lang, onToggleLang }: { lang: Lang; onToggleLang: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  const [active, setActive] = useState("");
  const sheetRef = useRef<HTMLDivElement>(null);
  const en = lang === "en";
  const tr = (value: Copy) => t(value, lang);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = navLinks.map((link) => link.href.slice(1));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => node !== null);
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.6] }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const onClick = (event: globalThis.MouseEvent) => {
      if (!sheetRef.current) return;
      if (!sheetRef.current.contains(event.target as Node)) setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onClick);
    };
  }, [menuOpen]);

  return (
    <>
      <header className={`nav-dock ${stuck ? "is-stuck" : ""}`}>
        <a className="brand" href="#top" aria-label={tr({ el: "Αρχή σελίδας", en: "Back to top" })}>
          <span className="brand-mark">
            {/* Above the fold and the first thing that identifies the site, so
                it loads eagerly rather than popping in after the nav paints. */}
            <Image src="/logo-mark.webp" alt="" width={320} height={320} priority />
          </span>
          <span className="brand-text">
            <b>MARKOULAKIS</b>
            <small>DIGITAL STUDIO</small>
          </span>
        </a>

        <nav className="nav-links" aria-label={tr({ el: "Κύριο μενού", en: "Main menu" })}>
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className={active === link.href ? "active" : ""}>
              {tr(link.label)}
            </a>
          ))}
        </nav>

        <div className="nav-side">
          <button
            type="button"
            className="lang-toggle"
            onClick={onToggleLang}
            aria-label={en ? "Switch to Greek" : "Αλλαγή σε Αγγλικά"}
          >
            <Languages />
            {en ? "EL" : "EN"}
          </button>
          <a className="btn btn-primary nav-cta" href="#contact">
            {tr({ el: "Ας μιλήσουμε", en: "Let’s talk" })}
            <ArrowUpRight />
          </a>
          <button
            type="button"
            className="nav-burger"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={tr({ el: "Μενού", en: "Menu" })}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {menuOpen && (
        <m.div
          ref={sheetRef}
          className="nav-sheet glass"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
              {tr(link.label)}
            </a>
          ))}
          <a className="btn btn-primary" href={profile.phoneHref} onClick={() => setMenuOpen(false)}>
            <Phone />
            {profile.phoneLabel}
          </a>
        </m.div>
      )}
    </>
  );
}

export default function Home() {
  const [lang, setLang] = useState<Lang>("el");

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });

  const en = lang === "en";
  const tr = useCallback((value: Copy) => t(value, lang), [lang]);
  const toggleLang = useCallback(() => setLang((current) => (current === "en" ? "el" : "en")), []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LazyMotion features={domAnimation} strict>
      <Atmosphere />
      <CircuitBoard />
      <CursorGlow />

      <m.div className="scroll-progress" style={{ scaleX: progress }} aria-hidden="true" />

      <SiteNav lang={lang} onToggleLang={toggleLang} />

      <main id="top">
        {/* ------------------------------------------------------- Hero */}
        <section className="hero">
          <div className="hero-inner shell">
            <m.div
              className="hero-mark"
              initial={{ opacity: 0, scale: 0.86 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                src="/logo-hero.webp"
                alt="Το σήμα του Markoulakis Digital Studio"
                width={512}
                height={512}
                priority
              />
            </m.div>

            <m.p
              className="hero-kicker"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="status-dot" />
              {tr({ el: "ΔΕΧΟΜΑΙ ΝΕΕΣ ΔΟΥΛΕΙΕΣ", en: "TAKING ON NEW WORK" })}
            </m.p>

            <h1 className="wordmark">
              <m.span
                className="wordmark-line"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
              >
                MARKOULAKIS
              </m.span>
              <m.span
                className="wordmark-line wordmark-accent"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
              >
                DIGITAL STUDIO
              </m.span>
            </h1>

            <m.p
              className="hero-tagline"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              {tr({
                el: "Φτιάχνω ιστοσελίδες που φέρνουν κόσμο στην επιχείρησή σας.",
                en: "I make websites that bring people to your business.",
              })}
            </m.p>

            <m.div
              className="hero-actions"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
            >
              <MagneticLink href={profile.phoneHref} className="btn btn-primary">
                <Phone />
                {tr({ el: "Καλέστε με", en: "Call me" })}
              </MagneticLink>
              <MagneticLink href={profile.instagramHref} className="btn btn-glass" external>
                <InstagramGlyph />
                Instagram
              </MagneticLink>
            </m.div>

            {/* The two things a customer actually wants to know before they
                call: when they get it, and whether it will be any good. */}
            <m.div
              className="hero-stats"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="glass stat-tile">
                <b>{tr({ el: "2 εβδομάδες", en: "2 weeks" })}</b>
                <span>{tr({ el: "Και είναι έτοιμη", en: "And it’s ready" })}</span>
              </div>
              <StatWithNote
                value="98/100"
                label={tr({ el: "Βαθμός Google", en: "Google score" })}
                note={tr(scoreNote)}
                buttonLabel={tr({ el: "Τι σημαίνει αυτό;", en: "What does this mean?" })}
                closeLabel={tr({ el: "Κλείσιμο", en: "Close" })}
              />
            </m.div>
          </div>
        </section>

        {/* --------------------------------------------------- Services */}
        <section className="shell" id="services">
          <Reveal className="section-head-tight">
            <p className="eyebrow">
              <i />
              {tr({ el: "ΤΙ ΚΑΝΩ", en: "WHAT I DO" })}
            </p>
            <h2>
              {tr({ el: "Ό,τι χρειάζεται μια ", en: "Everything a business " })}
              <em>{tr({ el: "επιχείρηση.", en: "needs online." })}</em>
            </h2>
          </Reveal>

          <div className="service-grid">
            {services.map((service, index) => {
              const ServiceIcon = service.icon;
              return (
                <GlassCard className="service-card" key={service.title.en} delay={index * 0.06}>
                  <span className="service-index">0{index + 1}</span>
                  <span className="service-icon">
                    <ServiceIcon />
                  </span>
                  <h3>{tr(service.title)}</h3>
                  <ul className="service-list">
                    {service.items.map((item) => (
                      <li key={item.en}>
                        <CheckCircle2 />
                        {tr(item)}
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              );
            })}
          </div>
        </section>

        {/* ------------------------------------------------------- Work */}
        <section className="shell" id="work">
          <Reveal className="section-head-tight">
            <p className="eyebrow">
              <i />
              {tr({ el: "ΔΟΥΛΕΙΕΣ", en: "WORK" })}
            </p>
            <h2>
              {tr({ el: "Δουλειές που ", en: "Work that " })}
              <em>{tr({ el: "ξεχωρίζουν.", en: "stands out." })}</em>
            </h2>
          </Reveal>

          <GlassCard className="work-card">
            <div className="work-meta">
              <p className="eyebrow">
                <i />
                {tr({ el: "COCKTAIL BAR · 2026", en: "COCKTAIL BAR · 2026" })}
              </p>
              <h3>SOMA</h3>
              <p>
                {tr({
                  el: "Σελίδα και εμφάνιση για ένα σύγχρονο cocktail bar.",
                  en: "The site and the look for a modern cocktail bar.",
                })}
              </p>
              <div className="work-tags">
                {workTags.map((tag) => (
                  <span className="chip" key={tag.en}>
                    <Check />
                    {tr(tag)}
                  </span>
                ))}
              </div>
            </div>

            <div className="work-stage soma-stage">
              <SomaMark />
            </div>
          </GlassCard>
        </section>

        {/* ---------------------------------------------------- Pricing */}
        <section className="shell" id="pricing">
          <Reveal className="section-head-tight">
            <p className="eyebrow">
              <i />
              {tr({ el: "ΤΙΜΕΣ", en: "PRICING" })}
            </p>
            <h2>
              {tr({ el: "Ξεκινήστε ", en: "Start from " })}
              <em>{tr({ el: "από 300€.", en: "€300." })}</em>
            </h2>
          </Reveal>

          <div className="price-grid">
            {pricing.map((plan, index) => (
              <GlassCard
                key={plan.name.en}
                delay={index * 0.06}
                className={`price-card ${plan.featured ? "price-featured" : ""}`}
              >
                {plan.featured && (
                  <span className="price-badge">
                    {tr({ el: "Το πιο συνηθισμένο", en: "The usual choice" })}
                  </span>
                )}
                <p className="price-name">{tr(plan.name)}</p>
                <p className="price-value">{tr(plan.price)}</p>
                <p className="price-sub">{tr(plan.sub)}</p>
                <ul className="price-features">
                  {plan.features.map((feature) => (
                    <li key={feature.en}>
                      <CheckCircle2 />
                      {tr(feature)}
                    </li>
                  ))}
                </ul>
                <a
                  className={`btn ${plan.featured ? "btn-glass" : "btn-primary"}`}
                  href={profile.phoneHref}
                >
                  {tr({ el: "Πάρτε με τηλέφωνο", en: "Give me a call" })}
                  <ArrowUpRight />
                </a>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------- Process */}
        <section className="shell" id="process">
          <Reveal className="section-head-tight">
            <p className="eyebrow">
              <i />
              {tr({ el: "ΠΩΣ ΔΟΥΛΕΥΩ", en: "HOW IT WORKS" })}
            </p>
            <h2>
              {tr({ el: "Από την κουβέντα ", en: "From a chat " })}
              <em>{tr({ el: "στη σελίδα σας.", en: "to your site." })}</em>
            </h2>
          </Reveal>

          <ProcessTyper lang={lang} />
        </section>

        {/* ------------------------------------------------------ About */}
        <section className="shell" id="about">
          <div className="about-grid">
            <GlassCard className="about-copy">
              <p className="eyebrow">
                <i />
                {tr({ el: "ΣΧΕΤΙΚΑ", en: "ABOUT" })}
              </p>
              <h2>
                {tr({ el: "Με πάθος για την ", en: "Driven by " })}
                <em>{tr({ el: "τεχνολογία.", en: "technology." })}</em>
              </h2>
              <p>
                {en ? (
                  <>
                    I’m <strong>Vangelis Markoulakis</strong>. I make websites and apps for
                    businesses — the drawing and the building both, from the first sketch to
                    the day it goes live. I take on a few jobs at a time, so each one is
                    done properly.
                  </>
                ) : (
                  <>
                    Είμαι ο <strong>Βαγγέλης Μαρκουλάκης</strong>. Φτιάχνω ιστοσελίδες και
                    εφαρμογές για επιχειρήσεις — και τον σχεδιασμό και την κατασκευή, από το
                    πρώτο σκίτσο μέχρι τη μέρα που βγαίνουν στον αέρα. Παίρνω λίγες δουλειές
                    τη φορά, ώστε η καθεμιά να γίνεται σωστά.
                  </>
                )}
              </p>
              <div className="hero-actions">
                <MagneticLink href={profile.phoneHref} className="btn btn-primary">
                  <Phone />
                  {profile.phoneLabel}
                </MagneticLink>
                <MagneticLink href={profile.instagramHref} className="btn btn-glass" external>
                  <InstagramGlyph />
                  {profile.instagramHandle}
                </MagneticLink>
              </div>
            </GlassCard>

            <div className="value-list">
              {values.map((value, index) => {
                const ValueIcon = value.icon;
                return (
                  <GlassCard className="value-item" key={value.title.en} delay={index * 0.06}>
                    <ValueIcon />
                    <h3>{tr(value.title)}</h3>
                  </GlassCard>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- Contact */}
        <section className="shell" id="contact">
          <GlassCard className="contact-panel" spotlight={false}>
            <p className="eyebrow">
              <i />
              {tr({ el: "ΕΠΙΚΟΙΝΩΝΙΑ", en: "GET IN TOUCH" })}
            </p>
            <h2>
              {tr({ el: "Ας φτιάξουμε κάτι ", en: "Let’s build something " })}
              <em>{tr({ el: "που ξεχωρίζει.", en: "that stands out." })}</em>
            </h2>

            <div className="contact-cards">
              <a className="glass contact-card" href={profile.phoneHref}>
                <span className="c-icon">
                  <Phone />
                </span>
                <span>
                  <small>{tr({ el: "Τηλέφωνο", en: "Phone" })}</small>
                  <b>{profile.phoneLabel}</b>
                </span>
                <ArrowUpRight />
              </a>

              <a
                className="glass contact-card"
                href={profile.instagramHref}
                target="_blank"
                rel="noreferrer"
              >
                <span className="c-icon">
                  <InstagramGlyph />
                </span>
                <span>
                  <small>Instagram</small>
                  <b>{profile.instagramHandle}</b>
                </span>
                <ArrowUpRight />
              </a>

              <a
                className="glass contact-card"
                href={profile.whatsappHref}
                target="_blank"
                rel="noreferrer"
              >
                <span className="c-icon">
                  <MessageCircle />
                </span>
                <span>
                  <small>{tr({ el: "Μήνυμα", en: "Message" })}</small>
                  <b>WhatsApp / Viber</b>
                </span>
                <ArrowUpRight />
              </a>

              <a className="glass contact-card" href={`mailto:${profile.email}`}>
                <span className="c-icon">
                  <Mail />
                </span>
                <span>
                  <small>Email</small>
                  <b>{profile.email}</b>
                </span>
                <ArrowUpRight />
              </a>
            </div>
          </GlassCard>
        </section>

        {/* ----------------------------------------------------- Footer */}
        <footer className="shell site-footer">
          <div className="glass footer-inner">
            <div className="brand">
              <span className="brand-mark">
                <Image src="/logo-mark.webp" alt="" width={320} height={320} />
              </span>
              <span className="brand-text">
                <b>MARKOULAKIS</b>
                <small>DIGITAL STUDIO</small>
              </span>
            </div>

            <div className="footer-social">
              <a href={profile.phoneHref} aria-label={tr({ el: "Τηλέφωνο", en: "Phone" })}>
                <Phone />
              </a>
              <a
                href={profile.instagramHref}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <InstagramGlyph />
              </a>
              <a
                href={profile.whatsappHref}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
              >
                <MessageCircle />
              </a>
              <a href={`mailto:${profile.email}`} aria-label="Email">
                <Mail />
              </a>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} MARKOULAKIS DIGITAL STUDIO</span>
            <a className="to-top" href="#top">
              {tr({ el: "ΕΠΙΣΤΡΟΦΗ ΣΤΗΝ ΑΡΧΗ", en: "BACK TO TOP" })}
              <ArrowDown style={{ transform: "rotate(180deg)" }} />
            </a>
          </div>
        </footer>
      </main>
    </LazyMotion>
  );
}
