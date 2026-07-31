"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ArrowDown,
  ArrowUpRight,
  Atom,
  Boxes,
  Braces,
  Check,
  CheckCircle2,
  Code2,
  Flame,
  Gauge,
  Globe2,
  GraduationCap,
  Hexagon,
  Languages,
  Layers,
  Mail,
  Menu,
  MessageCircle,
  MonitorSmartphone,
  PenTool,
  Phone,
  Rocket,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Triangle,
  Wind,
  X,
  Zap,
} from "lucide-react";

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
  { href: "#services", label: { el: "Υπηρεσίες", en: "Services" } },
  { href: "#work", label: { el: "Έργα", en: "Work" } },
  { href: "#pricing", label: { el: "Πακέτα", en: "Pricing" } },
  { href: "#process", label: { el: "Διαδικασία", en: "Process" } },
  { href: "#about", label: { el: "Προφίλ", en: "Profile" } },
];

const heroStats: Array<{ value: Copy; label: Copy }> = [
  {
    value: { el: "≤ 2 εβδ.", en: "≤ 2 wks" },
    label: { el: "Χρόνος παράδοσης", en: "Delivery time" },
  },
  {
    value: { el: "0", en: "0" },
    label: { el: "Έτοιμα templates", en: "Ready-made templates" },
  },
  {
    value: { el: "98+", en: "98+" },
    label: { el: "Lighthouse score", en: "Lighthouse score" },
  },
];

const tech: Array<{ name: string; icon: LucideIcon }> = [
  { name: "NEXT.JS", icon: Boxes },
  { name: "REACT", icon: Atom },
  { name: "TYPESCRIPT", icon: Braces },
  { name: "TAILWIND", icon: Wind },
  { name: "FIREBASE", icon: Flame },
  { name: "NODE.JS", icon: Hexagon },
  { name: "VERCEL", icon: Triangle },
  { name: "FIGMA", icon: PenTool },
];

const services: Array<{
  icon: LucideIcon;
  title: Copy;
  text: Copy;
  items: Array<Copy>;
}> = [
  {
    icon: Globe2,
    title: { el: "Ιστοσελίδες & Landing pages", en: "Websites & landing pages" },
    text: {
      el: "Custom σχεδιασμός με ισχυρή ταυτότητα, καθαρό μήνυμα και ταχύτητα σε κάθε συσκευή.",
      en: "Custom design with a distinct identity, clear messaging and speed on every device.",
    },
    items: [
      { el: "Επαγγελματικά websites", en: "Professional websites" },
      { el: "Landing pages", en: "Landing pages" },
      { el: "Website redesign", en: "Website redesign" },
    ],
  },
  {
    icon: ShoppingBag,
    title: { el: "E-shop & Κρατήσεις", en: "E-commerce & bookings" },
    text: {
      el: "Ροές πώλησης και κρατήσεων με λιγότερα βήματα και περισσότερες ολοκληρωμένες ενέργειες.",
      en: "Selling and booking flows with fewer steps and more completed actions.",
    },
    items: [
      { el: "E-shop", en: "E-commerce" },
      { el: "Online παραγγελίες", en: "Online ordering" },
      { el: "Συστήματα κρατήσεων", en: "Booking systems" },
    ],
  },
  {
    icon: MonitorSmartphone,
    title: { el: "Εφαρμογές & Dashboards", en: "Apps & dashboards" },
    text: {
      el: "Mobile εφαρμογές, custom dashboards και αυτοματισμοί για πραγματικές καθημερινές ανάγκες.",
      en: "Mobile apps, custom dashboards and automations for real everyday needs.",
    },
    items: [
      { el: "Mobile εφαρμογές", en: "Mobile applications" },
      { el: "Custom dashboards", en: "Custom dashboards" },
      { el: "Αυτοματισμοί επιχειρήσεων", en: "Business automation" },
    ],
  },
  {
    icon: Zap,
    title: { el: "SEO, Hosting & Υποστήριξη", en: "SEO, hosting & support" },
    text: {
      el: "Η παράδοση είναι η αρχή: τεχνικό SEO, hosting και συνεχής φροντίδα μετά το launch.",
      en: "Launch is the beginning: technical SEO, hosting and ongoing care afterwards.",
    },
    items: [
      { el: "Google Business & SEO", en: "Google Business & SEO" },
      { el: "Hosting & domain setup", en: "Hosting & domain setup" },
      { el: "Τεχνική υποστήριξη", en: "Technical support" },
    ],
  },
];

const pricing: Array<{
  name: string;
  price: Copy;
  note: Copy;
  featured?: boolean;
  features: Array<Copy>;
}> = [
  {
    name: "Starter",
    price: { el: "290€", en: "€290" },
    note: { el: "Για μια δυνατή πρώτη παρουσία", en: "For a strong first presence" },
    features: [
      { el: "Έως 4 σελίδες", en: "Up to 4 pages" },
      { el: "Responsive design", en: "Responsive design" },
      { el: "Google Maps & Social", en: "Google Maps & social" },
      { el: "Βασικό SEO", en: "Basic SEO" },
      { el: "Παράδοση σε 5–7 ημέρες", en: "Delivery in 5–7 days" },
    ],
  },
  {
    name: "Business",
    price: { el: "490€", en: "€490" },
    note: { el: "Η πιο ολοκληρωμένη επιλογή", en: "The most complete choice" },
    featured: true,
    features: [
      { el: "Έως 8 σελίδες", en: "Up to 8 pages" },
      { el: "Premium σχεδιασμός", en: "Premium design" },
      { el: "Animations & gallery", en: "Animations & gallery" },
      { el: "Google Reviews & Instagram", en: "Google Reviews & Instagram" },
      { el: "Βελτιστοποίηση ταχύτητας", en: "Speed optimisation" },
      { el: "15 ημέρες υποστήριξη", en: "15 days of support" },
    ],
  },
  {
    name: "Premium",
    price: { el: "από 890€", en: "from €890" },
    note: { el: "Για σύνθετες ψηφιακές ανάγκες", en: "For advanced digital needs" },
    features: [
      { el: "Custom σχεδιασμός", en: "Custom design" },
      { el: "Online κρατήσεις", en: "Online bookings" },
      { el: "Dashboard διαχείρισης", en: "Admin dashboard" },
      { el: "Πολυγλωσσικό περιεχόμενο", en: "Multilingual content" },
      { el: "Premium animations", en: "Premium animations" },
      { el: "1 μήνας υποστήριξη", en: "1 month of support" },
    ],
  },
];

const processSteps: Array<{ icon: LucideIcon; title: Copy; text: Copy }> = [
  {
    icon: MessageCircle,
    title: { el: "Δωρεάν συζήτηση", en: "Discovery call" },
    text: {
      el: "Ακούω το όραμά σας και ορίζουμε μαζί τον στόχο του project.",
      en: "I listen to your vision and we define the goal together.",
    },
  },
  {
    icon: Search,
    title: { el: "Ανάλυση αναγκών", en: "Needs analysis" },
    text: {
      el: "Μετατρέπω τις ανάγκες σε καθαρό πλάνο περιεχομένου και δομής.",
      en: "I turn your needs into a clear content and structure plan.",
    },
  },
  {
    icon: PenTool,
    title: { el: "Σχεδιασμός", en: "Design" },
    text: {
      el: "Σχεδιάζω κάθε σημείο της εμπειρίας, από το wireframe στο τελικό UI.",
      en: "I design every point of the experience, from wireframe to final UI.",
    },
  },
  {
    icon: Code2,
    title: { el: "Ανάπτυξη", en: "Development" },
    text: {
      el: "Δίνω ζωή στο design με σύγχρονο, καθαρό και συντηρήσιμο κώδικα.",
      en: "I bring the design to life with modern, clean, maintainable code.",
    },
  },
  {
    icon: ShieldCheck,
    title: { el: "Έλεγχος", en: "Testing" },
    text: {
      el: "Δοκιμές σε κάθε συσκευή, έλεγχος ταχύτητας και προσβασιμότητας.",
      en: "Tests on every device, plus speed and accessibility checks.",
    },
  },
  {
    icon: Rocket,
    title: { el: "Παράδοση", en: "Launch" },
    text: {
      el: "Παράδοση, εκπαίδευση στη διαχείριση και υποστήριξη μετά το launch.",
      en: "Launch, hands-on training and support after go-live.",
    },
  },
];

const values: Array<{ icon: LucideIcon; title: Copy; text: Copy }> = [
  {
    icon: GraduationCap,
    title: { el: "Πληροφορική στην ΑΣΟΕΕ", en: "Computer Science at AUEB" },
    text: {
      el: "Ακαδημαϊκή βάση που γίνεται καθημερινά πρακτική δημιουργία.",
      en: "An academic foundation that turns into hands-on work every day.",
    },
  },
  {
    icon: Layers,
    title: { el: "Μηχανική σκέψη & design", en: "Engineering meets design" },
    text: {
      el: "Με ενδιαφέρει εξίσου το πώς λειτουργεί ένα προϊόν και το πώς το νιώθει ο χρήστης.",
      en: "I care equally about how a product works and how it feels.",
    },
  },
  {
    icon: Gauge,
    title: { el: "Ταχύτητα ως χαρακτηριστικό", en: "Speed as a feature" },
    text: {
      el: "Κάθε σελίδα βελτιστοποιείται για performance, SEO και προσβασιμότητα.",
      en: "Every page is optimised for performance, SEO and accessibility.",
    },
  },
  {
    icon: Sparkles,
    title: { el: "Κάθε project έχει λόγο ύπαρξης", en: "Every project has a purpose" },
    text: {
      el: "Όχι έτοιμες λύσεις για ευκολία — κάθε απόφαση υπηρετεί την επιχείρηση.",
      en: "No templates for convenience — every decision serves the business.",
    },
  },
];

const workTags = ["Next.js", "UI/UX Design", "Responsive", "SEO", "Animations"];

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

function MarkLogo({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path
        d="M8 48 21.5 13 32 35 43.5 8 56 48"
        stroke="currentColor"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 56h48"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity=".45"
      />
    </svg>
  );
}

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

function setSpotlight(event: ReactMouseEvent<HTMLElement>) {
  const target = event.currentTarget;
  const rect = target.getBoundingClientRect();
  target.style.setProperty("--mx", `${event.clientX - rect.left}px`);
  target.style.setProperty("--my", `${event.clientY - rect.top}px`);
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
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={`glass ${spotlight ? "spotlight" : ""} ${className}`}
      onMouseMove={spotlight ? setSpotlight : undefined}
      initial={reduced ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function MagneticLink({
  href,
  className = "",
  children,
  external = false,
  ariaLabel,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
  external?: boolean;
  ariaLabel?: string;
}) {
  const reduced = useReducedMotion();
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  return (
    <motion.a
      href={href}
      aria-label={ariaLabel}
      className={className}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      animate={offset}
      transition={{ type: "spring", stiffness: 250, damping: 18 }}
      onMouseMove={(event) => {
        if (reduced) return;
        const rect = event.currentTarget.getBoundingClientRect();
        setOffset({
          x: (event.clientX - rect.left - rect.width / 2) * 0.16,
          y: (event.clientY - rect.top - rect.height / 2) * 0.24,
        });
      }}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
    >
      {children}
    </motion.a>
  );
}

/* ------------------------------------------------------------------ */
/* Ambient layers                                                      */
/* ------------------------------------------------------------------ */

function CursorGlow() {
  const reduced = useReducedMotion();
  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  const sx = useSpring(x, { stiffness: 120, damping: 22, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 120, damping: 22, mass: 0.4 });

  useEffect(() => {
    if (reduced) return;
    if (window.matchMedia("(hover: none)").matches) return;
    const move = (event: globalThis.MouseEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [reduced, x, y]);

  if (reduced) return null;
  return <motion.div className="cursor-glow" style={{ x: sx, y: sy }} aria-hidden="true" />;
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Home() {
  const [lang, setLang] = useState<Lang>("el");
  const [menuOpen, setMenuOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  const [active, setActive] = useState("");
  const sheetRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });

  const en = lang === "en";
  const tr = useCallback((value: Copy) => t(value, lang), [lang]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

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
      <div className="atmosphere" aria-hidden="true">
        <span className="aurora aurora-a" />
        <span className="aurora aurora-b" />
        <span className="aurora aurora-c" />
      </div>
      <div className="grid-veil" aria-hidden="true" />
      <CursorGlow />

      <motion.div
        className="scroll-progress"
        style={{ scaleX: progress }}
        aria-hidden="true"
      />

      {/* ---------------------------------------------------------- Nav */}
      <header className={`nav-dock ${stuck ? "is-stuck" : ""}`}>
        <a className="brand" href="#top" aria-label={tr({ el: "Αρχή σελίδας", en: "Back to top" })}>
          <span className="brand-mark">
            <MarkLogo />
          </span>
          <span className="brand-text">
            <b>MARKOULAKIS</b>
            <small>DIGITAL</small>
          </span>
        </a>

        <nav className="nav-links" aria-label={tr({ el: "Κύριο μενού", en: "Main menu" })}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={active === link.href ? "active" : ""}
            >
              {tr(link.label)}
            </a>
          ))}
        </nav>

        <div className="nav-side">
          <button
            type="button"
            className="lang-toggle"
            onClick={() => setLang(en ? "el" : "en")}
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
        <motion.div
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
          <a
            className="btn btn-primary"
            href={profile.phoneHref}
            onClick={() => setMenuOpen(false)}
          >
            <Phone />
            {profile.phoneLabel}
          </a>
        </motion.div>
      )}

      <main id="top">
        {/* ------------------------------------------------------- Hero */}
        <section className="hero shell">
          <div className="hero-grid">
            <div>
              <Reveal>
                <p className="status-pill">
                  <span className="status-dot" />
                  {tr({
                    el: "Διαθέσιμος για νέα projects",
                    en: "Available for new projects",
                  })}
                </p>
              </Reveal>

              <Reveal delay={0.05}>
                <h1>
                  <span className="line">
                    {tr({ el: "Ψηφιακές εμπειρίες", en: "Digital experiences" })}
                  </span>
                  <span className="line">
                    {tr({ el: "φτιαγμένες να ", en: "built to " })}
                    <em>{tr({ el: "ξεχωρίζουν.", en: "stand out." })}</em>
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={0.1}>
                <p className="hero-name">
                  {tr(profile.name)} · {tr(profile.role)}
                </p>
                <p className="hero-lead">
                  {tr({
                    el: "Σχεδιάζω και αναπτύσσω ιστοσελίδες, e-shops και εφαρμογές που δείχνουν premium, φορτώνουν γρήγορα και φέρνουν πραγματικά αποτελέσματα στην επιχείρησή σας.",
                    en: "I design and build websites, online stores and applications that look premium, load fast and deliver real results for your business.",
                  })}
                </p>
              </Reveal>

              <Reveal delay={0.15}>
                <div className="hero-actions">
                  <MagneticLink href={profile.phoneHref} className="btn btn-primary">
                    <Phone />
                    {tr({ el: "Καλέστε με", en: "Call me" })}
                  </MagneticLink>
                  <MagneticLink
                    href={profile.instagramHref}
                    className="btn btn-glass"
                    external
                  >
                    <InstagramGlyph />
                    Instagram
                  </MagneticLink>
                </div>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="hero-stats">
                  {heroStats.map((stat) => (
                    <div className="glass stat-tile" key={stat.label.en}>
                      <b>{tr(stat.value)}</b>
                      <span>{tr(stat.label)}</span>
                    </div>
                  ))}
                </div>
              </Reveal>

              <Reveal delay={0.25}>
                <p className="scroll-hint">
                  <i />
                  {tr({ el: "Κυλήστε για περισσότερα", en: "Scroll to explore" })}
                </p>
              </Reveal>
            </div>

            {/* Hero glass stack */}
            <motion.div
              className="hero-visual"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="orbit-ring r1" aria-hidden="true" />
              <span className="orbit-ring r2" aria-hidden="true" />

              <div className="glass spotlight profile-card" onMouseMove={setSpotlight}>
                <div className="profile-top">
                  <span className="avatar-mark">
                    <MarkLogo />
                  </span>
                  <div>
                    <h3>{tr(profile.name)}</h3>
                    <p>{tr(profile.role)}</p>
                  </div>
                </div>

                <div className="profile-rows">
                  <a className="profile-row" href={profile.phoneHref}>
                    <Phone />
                    <span>
                      <small>{tr({ el: "Τηλέφωνο", en: "Phone" })}</small>
                      {profile.phoneLabel}
                    </span>
                    <ArrowUpRight className="row-end" />
                  </a>
                  <a
                    className="profile-row"
                    href={profile.instagramHref}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <InstagramGlyph />
                    <span>
                      <small>Instagram</small>
                      {profile.instagramHandle}
                    </span>
                    <ArrowUpRight className="row-end" />
                  </a>
                  <div className="profile-row">
                    <GraduationCap />
                    <span>
                      <small>{tr({ el: "Σπουδές", en: "Studies" })}</small>
                      {tr({ el: "Πληροφορική · ΑΣΟΕΕ", en: "Computer Science · AUEB" })}
                    </span>
                  </div>
                </div>

                <div className="profile-skills">
                  {[
                    "Web Design",
                    "UI/UX",
                    "React / Next.js",
                    "TypeScript",
                    "Mobile Apps",
                    "Firebase",
                    "SEO",
                  ].map((skill) => (
                    <span className="skill-tag" key={skill}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <motion.div
                className="glass float-card float-a"
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <Gauge />
                <span>
                  <small>Performance</small>
                  98 / 100
                </span>
              </motion.div>

              <motion.div
                className="glass float-card float-b"
                animate={{ y: [0, 14, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              >
                <MonitorSmartphone />
                <span>
                  <small>{tr({ el: "Σχεδιασμός", en: "Design" })}</small>
                  {tr({ el: "Mobile first", en: "Mobile first" })}
                </span>
              </motion.div>

              <motion.div
                className="glass float-card float-c"
                animate={{ y: [0, -9, 0] }}
                transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
              >
                <Code2 />
                <span>
                  <small>Code</small>
                  {tr({ el: "Καθαρός & γρήγορος", en: "Clean & fast" })}
                </span>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* --------------------------------------------------- Tech band */}
        <div className="marquee-band">
          <p>{tr({ el: "ΤΑ ΕΡΓΑΛΕΙΑ ΠΙΣΩ ΑΠΟ ΤΗΝ ΕΜΠΕΙΡΙΑ", en: "THE TOOLS BEHIND THE EXPERIENCE" })}</p>
          <div className="marquee-track">
            <div className="marquee">
              {[...tech, ...tech].map((tool, index) => {
                const ToolIcon = tool.icon;
                return (
                  <span key={`${tool.name}-${index}`}>
                    <ToolIcon />
                    {tool.name}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* --------------------------------------------------- Services */}
        <section className="shell" id="services">
          <div className="section-head">
            <Reveal>
              <p className="eyebrow">
                <i />
                {tr({ el: "ΥΠΗΡΕΣΙΕΣ", en: "SERVICES" })}
              </p>
              <h2>
                {tr({ el: "Ό,τι χρειάζεται μια ", en: "Everything a business " })}
                <em>{tr({ el: "σύγχρονη επιχείρηση.", en: "needs online." })}</em>
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p>
                {tr({
                  el: "Από τη στρατηγική και τον σχεδιασμό μέχρι τον κώδικα και τη συντήρηση — ένα άτομο υπεύθυνο για όλη τη διαδρομή.",
                  en: "From strategy and design through to code and maintenance — one person accountable for the whole journey.",
                })}
              </p>
            </Reveal>
          </div>

          <div className="service-grid">
            {services.map((service, index) => {
              const ServiceIcon = service.icon;
              return (
                <GlassCard
                  className="service-card"
                  key={service.title.en}
                  delay={index * 0.06}
                >
                  <span className="service-index">
                    0{index + 1}
                  </span>
                  <span className="service-icon">
                    <ServiceIcon />
                  </span>
                  <h3>{tr(service.title)}</h3>
                  <p>{tr(service.text)}</p>
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
          <div className="section-head">
            <Reveal>
              <p className="eyebrow">
                <i />
                {tr({ el: "ΕΠΙΛΕΓΜΕΝΟ ΕΡΓΟ", en: "SELECTED WORK" })}
              </p>
              <h2>
                {tr({ el: "Projects σχεδιασμένα για να ", en: "Projects designed to " })}
                <em>{tr({ el: "ξεχωρίζουν.", en: "stand out." })}</em>
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p>
                {tr({
                  el: "Καθαρή στρατηγική, ιδιαίτερη ταυτότητα και τεχνολογία που αντέχει στον χρόνο.",
                  en: "Clear strategy, a distinct identity and technology built to last.",
                })}
              </p>
            </Reveal>
          </div>

          <GlassCard className="work-card">
            <div className="work-meta">
              <p className="eyebrow">
                <i />
                HOSPITALITY · 2026
              </p>
              <h3>SOMA</h3>
              <p>
                {tr({
                  el: "Ψηφιακή ταυτότητα και εμπειρία για ένα σύγχρονο cocktail bar: ατμοσφαιρικό design, μενού που διαβάζεται εύκολα στο κινητό και ροή που οδηγεί σε κράτηση.",
                  en: "Digital identity and experience for a modern cocktail bar: atmospheric design, a menu that reads effortlessly on mobile and a flow that leads to a booking.",
                })}
              </p>
              <div className="work-tags">
                {workTags.map((tag) => (
                  <span className="chip" key={tag}>
                    <Check />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="work-stage">
              <div className="browser">
                <div className="browser-bar" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <span>SOMA · COCKTAIL BAR</span>
                </div>
                <div className="browser-shot">
                  <Image
                    src="/soma-showcase.webp"
                    alt={tr({
                      el: "Η ιστοσελίδα του SOMA σε υπολογιστή",
                      en: "The SOMA website on desktop",
                    })}
                    fill
                    sizes="(max-width: 1080px) 90vw, 640px"
                  />
                </div>
              </div>
              <div className="work-phone" aria-hidden="true">
                <Image
                  src="/soma-showcase.webp"
                  alt=""
                  fill
                  sizes="130px"
                />
              </div>
            </div>
          </GlassCard>
        </section>

        {/* ---------------------------------------------------- Pricing */}
        <section className="shell" id="pricing">
          <div className="section-head">
            <Reveal>
              <p className="eyebrow">
                <i />
                {tr({ el: "ΠΑΚΕΤΑ ΙΣΤΟΣΕΛΙΔΩΝ", en: "WEBSITE PACKAGES" })}
              </p>
              <h2>
                {tr({ el: "Ξεκινήστε σωστά. ", en: "Start with confidence. " })}
                <em>{tr({ el: "Από 290€.", en: "From €290." })}</em>
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p>
                {tr({
                  el: "Ξεκάθαρες τιμές, χωρίς κρυφές χρεώσεις. Η ιστοσελίδα σας online μέσα σε δύο εβδομάδες.",
                  en: "Clear pricing with no hidden fees. Your website online within two weeks.",
                })}
              </p>
            </Reveal>
          </div>

          <div className="price-grid">
            {pricing.map((plan, index) => (
              <GlassCard
                key={plan.name}
                delay={index * 0.06}
                className={`price-card ${plan.featured ? "price-featured" : ""}`}
              >
                {plan.featured && (
                  <span className="price-badge">
                    {tr({ el: "Πιο δημοφιλές", en: "Most popular" })}
                  </span>
                )}
                <p className="price-name">{plan.name}</p>
                <p className="price-value">{tr(plan.price)}</p>
                <p className="price-note">{tr(plan.note)}</p>
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
                  {tr({ el: "Ζητήστε προσφορά", en: "Request a quote" })}
                  <ArrowUpRight />
                </a>
              </GlassCard>
            ))}
          </div>

          <GlassCard className="price-footnote" spotlight={false}>
            <p>
              <b>
                {tr({
                  el: "Mobile εφαρμογές, αυτοματισμοί και ειδικά συστήματα:",
                  en: "Mobile apps, automations and custom systems:",
                })}
              </b>{" "}
              {tr({ el: "κατόπιν επικοινωνίας.", en: "priced after a conversation." })}
            </p>
            <span>
              {tr({
                el: "Domain και hosting υπολογίζονται ξεχωριστά.",
                en: "Domain and hosting are quoted separately.",
              })}
            </span>
          </GlassCard>
        </section>

        {/* ---------------------------------------------------- Process */}
        <section className="shell" id="process">
          <div className="section-head">
            <Reveal>
              <p className="eyebrow">
                <i />
                {tr({ el: "ΔΙΑΔΙΚΑΣΙΑ", en: "PROCESS" })}
              </p>
              <h2>
                {tr({ el: "Από την ιδέα ", en: "From an idea " })}
                <em>{tr({ el: "στην πραγματικότητα.", en: "to reality." })}</em>
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p>
                {tr({
                  el: "Έξι καθαρά βήματα, με ενημέρωση σε κάθε στάδιο και χωρίς εκπλήξεις στο τέλος.",
                  en: "Six clear steps, with updates at every stage and no surprises at the end.",
                })}
              </p>
            </Reveal>
          </div>

          <div className="process-grid">
            {processSteps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <GlassCard
                  className="process-step"
                  key={step.title.en}
                  delay={index * 0.05}
                >
                  <span className="process-num">
                    <i>
                      <StepIcon />
                    </i>
                    {`0${index + 1}`}
                  </span>
                  <h3>{tr(step.title)}</h3>
                  <p>{tr(step.text)}</p>
                </GlassCard>
              );
            })}
          </div>
        </section>

        {/* ------------------------------------------------------ About */}
        <section className="shell" id="about">
          <div className="about-grid">
            <GlassCard className="about-copy">
              <p className="eyebrow">
                <i />
                {tr({ el: "ΣΧΕΤΙΚΑ ΜΕ ΕΜΕΝΑ", en: "ABOUT ME" })}
              </p>
              <h2>
                {tr({ el: "Με πάθος για την ", en: "Driven by " })}
                <em>{tr({ el: "τεχνολογία.", en: "technology." })}</em>
              </h2>
              <p>
                {en ? (
                  <>
                    My name is <strong>Vangelis Markoulakis</strong> and I study Computer
                    Science at the Athens University of Economics and Business. I design
                    and develop professional websites, mobile products and complete
                    digital systems for businesses.
                  </>
                ) : (
                  <>
                    Ονομάζομαι <strong>Βαγγέλης Μαρκουλάκης</strong> και σπουδάζω
                    Πληροφορική στην ΑΣΟΕΕ. Σχεδιάζω και αναπτύσσω επαγγελματικές
                    ιστοσελίδες, εφαρμογές κινητών και ολοκληρωμένα ψηφιακά συστήματα για
                    επιχειρήσεις.
                  </>
                )}
              </p>
              <p>
                {tr({
                  el: "Δουλεύω με λίγα projects τη φορά, ώστε κάθε επιχείρηση να παίρνει πραγματικό χρόνο και προσοχή. Στόχος μου είναι σύγχρονα ψηφιακά εργαλεία που εξοικονομούν χρόνο, αναβαθμίζουν την εικόνα και φέρνουν νέους πελάτες.",
                  en: "I take on a small number of projects at a time, so every business gets real time and attention. My goal is modern digital tools that save time, elevate the brand and bring in new customers.",
                })}
              </p>
              <div className="hero-actions">
                <MagneticLink href={profile.phoneHref} className="btn btn-primary">
                  <Phone />
                  {profile.phoneLabel}
                </MagneticLink>
                <MagneticLink
                  href={profile.instagramHref}
                  className="btn btn-glass"
                  external
                >
                  <InstagramGlyph />
                  {profile.instagramHandle}
                </MagneticLink>
              </div>
            </GlassCard>

            <div className="value-list">
              {values.map((value, index) => {
                const ValueIcon = value.icon;
                return (
                  <GlassCard
                    className="value-item"
                    key={value.title.en}
                    delay={index * 0.06}
                  >
                    <ValueIcon />
                    <div>
                      <h3>{tr(value.title)}</h3>
                      <p>{tr(value.text)}</p>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- Contact */}
        <section className="shell" id="contact">
          <GlassCard className="contact-panel" spotlight={false}>
            <p className="eyebrow" style={{ justifyContent: "center" }}>
              <i />
              {tr({ el: "ΕΠΙΚΟΙΝΩΝΙΑ", en: "GET IN TOUCH" })}
            </p>
            <h2>
              {tr({ el: "Ας δημιουργήσουμε κάτι ", en: "Let’s create something " })}
              <em>{tr({ el: "που ξεχωρίζει.", en: "worth remembering." })}</em>
            </h2>
            <p>
              {tr({
                el: "Ένα τηλεφώνημα ή ένα μήνυμα αρκεί. Θα συζητήσουμε την ιδέα σας και θα σας πω ρεαλιστικά τι χρειάζεται — χωρίς καμία δέσμευση.",
                en: "A call or a message is all it takes. We will talk through your idea and I will tell you realistically what it needs — with no obligation.",
              })}
            </p>

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
                  <small>{tr({ el: "Άμεσο μήνυμα", en: "Direct message" })}</small>
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
            <div>
              <div className="brand">
                <span className="brand-mark">
                  <MarkLogo />
                </span>
                <span className="brand-text">
                  <b>MARKOULAKIS</b>
                  <small>DIGITAL</small>
                </span>
              </div>
              <p className="footer-tagline">
                {tr({
                  el: "Χτίζω ψηφιακές εμπειρίες που βοηθούν τις επιχειρήσεις να ξεχωρίζουν.",
                  en: "Building digital experiences that help businesses stand out.",
                })}
              </p>
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
            <span>© {new Date().getFullYear()} MARKOULAKIS DIGITAL</span>
            <a className="to-top" href="#top">
              {tr({ el: "ΕΠΙΣΤΡΟΦΗ ΣΤΗΝ ΑΡΧΗ", en: "BACK TO TOP" })}
              <ArrowDown style={{ transform: "rotate(180deg)" }} />
            </a>
          </div>
        </footer>
      </main>
    </>
  );
}
