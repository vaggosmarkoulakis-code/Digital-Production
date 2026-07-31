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
  Check,
  CheckCircle2,
  Code2,
  Gauge,
  Globe2,
  GraduationCap,
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
  X,
  Zap,
} from "lucide-react";
import CircuitBoard from "./circuit";
import StackBubbles from "./stack-bubbles";

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
  { href: "#profile", label: { el: "Προφίλ", en: "Profile" } },
  { href: "#stack", label: { el: "Stack", en: "Stack" } },
  { href: "#services", label: { el: "Υπηρεσίες", en: "Services" } },
  { href: "#work", label: { el: "Έργα", en: "Work" } },
  { href: "#pricing", label: { el: "Τιμές", en: "Pricing" } },
  { href: "#process", label: { el: "Διαδικασία", en: "Process" } },
];

const heroStats: Array<{ value: Copy; label: Copy }> = [
  { value: { el: "≤ 2 εβδ.", en: "≤ 2 wks" }, label: { el: "Παράδοση", en: "Delivery" } },
  { value: { el: "0", en: "0" }, label: { el: "Templates", en: "Templates" } },
  { value: { el: "98+", en: "98+" }, label: { el: "Lighthouse", en: "Lighthouse" } },
];

const services: Array<{ icon: LucideIcon; title: Copy; items: Array<Copy> }> = [
  {
    icon: Globe2,
    title: { el: "Ιστοσελίδες", en: "Websites" },
    items: [
      { el: "Landing pages", en: "Landing pages" },
      { el: "Επαγγελματικά websites", en: "Business websites" },
      { el: "Redesign", en: "Redesign" },
    ],
  },
  {
    icon: ShoppingBag,
    title: { el: "E-shop & Κρατήσεις", en: "E-commerce & bookings" },
    items: [
      { el: "E-shop", en: "Online store" },
      { el: "Online παραγγελίες", en: "Online ordering" },
      { el: "Κρατήσεις", en: "Bookings" },
    ],
  },
  {
    icon: MonitorSmartphone,
    title: { el: "Εφαρμογές", en: "Applications" },
    items: [
      { el: "Mobile apps", en: "Mobile apps" },
      { el: "Dashboards", en: "Dashboards" },
      { el: "Αυτοματισμοί", en: "Automation" },
    ],
  },
  {
    icon: Zap,
    title: { el: "SEO & Υποστήριξη", en: "SEO & support" },
    items: [
      { el: "Google Business & SEO", en: "Google Business & SEO" },
      { el: "Hosting & domain", en: "Hosting & domain" },
      { el: "Συντήρηση", en: "Maintenance" },
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
    name: { el: "Landing page", en: "Landing page" },
    price: { el: "300€", en: "€300" },
    sub: { el: "+ 10€ / μήνα συντήρηση", en: "+ €10 / month maintenance" },
    features: [
      { el: "Μονοσέλιδη landing page", en: "Single-page landing" },
      { el: "SEO για την επιχείρηση", en: "SEO for your business" },
      { el: "Responsive σε κάθε συσκευή", en: "Responsive on every device" },
      { el: "Google & social σύνδεση", en: "Google & social links" },
    ],
  },
  {
    name: { el: "Πολλαπλές σελίδες", en: "Multi-page" },
    price: { el: "500€", en: "€500" },
    sub: { el: "+ 15€ / μήνα συντήρηση", en: "+ €15 / month maintenance" },
    featured: true,
    features: [
      { el: "Πολλαπλές σελίδες", en: "Multiple pages" },
      { el: "Μενού & πλοήγηση", en: "Menu & navigation" },
      { el: "Animations", en: "Animations" },
      { el: "Premium εμφάνιση", en: "Premium look" },
      { el: "SEO", en: "SEO" },
    ],
  },
  {
    name: { el: "Custom", en: "Custom" },
    price: { el: "Συζητήσιμη", en: "Let’s talk" },
    sub: { el: "Αναλόγως τι χρειάζεστε", en: "Depending on what you need" },
    features: [
      { el: "E-shop & κρατήσεις", en: "E-commerce & bookings" },
      { el: "Εφαρμογές & dashboards", en: "Apps & dashboards" },
      { el: "Αυτοματισμοί", en: "Automation" },
      { el: "Προσφορά μετά από συζήτηση", en: "Quote after a chat" },
    ],
  },
];

const processSteps: Array<{ icon: LucideIcon; title: Copy }> = [
  { icon: MessageCircle, title: { el: "Συζήτηση", en: "Discovery" } },
  { icon: Search, title: { el: "Ανάλυση", en: "Analysis" } },
  { icon: PenTool, title: { el: "Σχεδιασμός", en: "Design" } },
  { icon: Code2, title: { el: "Ανάπτυξη", en: "Development" } },
  { icon: ShieldCheck, title: { el: "Έλεγχος", en: "Testing" } },
  { icon: Rocket, title: { el: "Παράδοση", en: "Launch" } },
];

const values: Array<{ icon: LucideIcon; title: Copy }> = [
  { icon: GraduationCap, title: { el: "Πληροφορική στην ΑΣΟΕΕ", en: "Computer Science at AUEB" } },
  { icon: Layers, title: { el: "Μηχανική σκέψη & design", en: "Engineering meets design" } },
  { icon: Gauge, title: { el: "Ταχύτητα ως χαρακτηριστικό", en: "Speed as a feature" } },
  { icon: Sparkles, title: { el: "Χωρίς έτοιμα templates", en: "No ready-made templates" } },
];

const workTags = ["Next.js", "UI/UX", "Responsive", "SEO"];

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
      <path d="M8 56h48" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity=".45" />
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
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const reduced = useReducedMotion();
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  return (
    <motion.a
      href={href}
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
      <CircuitBoard />
      <CursorGlow />

      <motion.div className="scroll-progress" style={{ scaleX: progress }} aria-hidden="true" />

      {/* ---------------------------------------------------------- Nav */}
      <header className={`nav-dock ${stuck ? "is-stuck" : ""}`}>
        <a className="brand" href="#top" aria-label={tr({ el: "Αρχή σελίδας", en: "Back to top" })}>
          <span className="brand-mark">
            <MarkLogo />
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
          <a className="btn btn-primary" href={profile.phoneHref} onClick={() => setMenuOpen(false)}>
            <Phone />
            {profile.phoneLabel}
          </a>
        </motion.div>
      )}

      <main id="top">
        {/* ------------------------------------------------------- Hero */}
        <section className="hero">
          <div className="hero-inner shell">
            <motion.p
              className="hero-kicker"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="status-dot" />
              {tr({ el: "ΔΙΑΘΕΣΙΜΟΣ ΓΙΑ ΝΕΑ PROJECTS", en: "AVAILABLE FOR NEW PROJECTS" })}
            </motion.p>

            <h1 className="wordmark">
              <motion.span
                className="wordmark-line"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
              >
                MARKOULAKIS
              </motion.span>
              <motion.span
                className="wordmark-line wordmark-accent"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
              >
                DIGITAL STUDIO
              </motion.span>
            </h1>

            <motion.p
              className="hero-tagline"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              {tr({
                el: "Ψηφιακές εμπειρίες φτιαγμένες να ξεχωρίζουν.",
                en: "Digital experiences built to stand out.",
              })}
            </motion.p>

            <motion.div
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
            </motion.div>

            <motion.a
              className="scroll-hint"
              href="#profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.55 }}
            >
              <i />
              {tr({ el: "ΚΥΛΗΣΤΕ", en: "SCROLL" })}
              <ArrowDown />
            </motion.a>
          </div>
        </section>

        {/* ---------------------------------------------------- Profile */}
        <section className="shell" id="profile">
          <div className="profile-grid">
            <div>
              <Reveal>
                <p className="eyebrow">
                  <i />
                  {tr({ el: "ΠΡΟΦΙΛ", en: "PROFILE" })}
                </p>
                <h2 className="profile-title">
                  {tr({ el: "Ένας άνθρωπος, ", en: "One person, " })}
                  <em>{tr({ el: "όλη η διαδρομή.", en: "the whole journey." })}</em>
                </h2>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="hero-stats">
                  {heroStats.map((stat) => (
                    <div className="glass stat-tile" key={stat.label.en}>
                      <b>{tr(stat.value)}</b>
                      <span>{tr(stat.label)}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            <Reveal className="hero-visual" delay={0.12}>
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

              <motion.div
                className="glass float-card float-b"
                animate={{ y: [0, 14, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              >
                <MonitorSmartphone />
                <span>
                  <small>{tr({ el: "Σχεδιασμός", en: "Design" })}</small>
                  Mobile first
                </span>
              </motion.div>
            </Reveal>
          </div>
        </section>

        {/* ------------------------------------------------------ Stack */}
        <section className="shell" id="stack">
          <Reveal className="section-head-tight">
            <p className="eyebrow">
              <i />
              {tr({ el: "ΤΕΧΝΟΛΟΓΙΕΣ", en: "TECHNOLOGIES" })}
            </p>
            <h2>
              {tr({ el: "Το ", en: "My " })}
              <em>{tr({ el: "stack μου.", en: "stack." })}</em>
            </h2>
          </Reveal>
          <StackBubbles />
        </section>

        {/* --------------------------------------------------- Services */}
        <section className="shell" id="services">
          <Reveal className="section-head-tight">
            <p className="eyebrow">
              <i />
              {tr({ el: "ΥΠΗΡΕΣΙΕΣ", en: "SERVICES" })}
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
              {tr({ el: "ΕΡΓΑ", en: "WORK" })}
            </p>
            <h2>
              {tr({ el: "Projects που ", en: "Projects that " })}
              <em>{tr({ el: "ξεχωρίζουν.", en: "stand out." })}</em>
            </h2>
          </Reveal>

          <GlassCard className="work-card">
            <div className="work-meta">
              <p className="eyebrow">
                <i />
                HOSPITALITY · 2026
              </p>
              <h3>SOMA</h3>
              <p>
                {tr({
                  el: "Ψηφιακή ταυτότητα για ένα σύγχρονο cocktail bar.",
                  en: "Digital identity for a modern cocktail bar.",
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
                <Image src="/soma-showcase.webp" alt="" fill sizes="130px" />
              </div>
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
                    {tr({ el: "Πιο δημοφιλές", en: "Most popular" })}
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
                  {tr({ el: "Ζητήστε προσφορά", en: "Request a quote" })}
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
              {tr({ el: "ΔΙΑΔΙΚΑΣΙΑ", en: "PROCESS" })}
            </p>
            <h2>
              {tr({ el: "Από την ιδέα ", en: "From idea " })}
              <em>{tr({ el: "στην πραγματικότητα.", en: "to reality." })}</em>
            </h2>
          </Reveal>

          <div className="process-grid">
            {processSteps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <GlassCard className="process-step" key={step.title.en} delay={index * 0.05}>
                  <span className="process-num">
                    <i>
                      <StepIcon />
                    </i>
                    {`0${index + 1}`}
                  </span>
                  <h3>{tr(step.title)}</h3>
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
                {tr({ el: "ΣΧΕΤΙΚΑ", en: "ABOUT" })}
              </p>
              <h2>
                {tr({ el: "Με πάθος για την ", en: "Driven by " })}
                <em>{tr({ el: "τεχνολογία.", en: "technology." })}</em>
              </h2>
              <p>
                {en ? (
                  <>
                    I’m <strong>Vangelis Markoulakis</strong>, a Computer Science student at
                    AUEB. I design and build websites, apps and digital systems for
                    businesses — a few projects at a time, so each one gets real attention.
                  </>
                ) : (
                  <>
                    Είμαι ο <strong>Βαγγέλης Μαρκουλάκης</strong>, φοιτητής Πληροφορικής στην
                    ΑΣΟΕΕ. Σχεδιάζω και αναπτύσσω ιστοσελίδες, εφαρμογές και ψηφιακά
                    συστήματα για επιχειρήσεις — λίγα projects τη φορά, ώστε το καθένα να
                    παίρνει πραγματική προσοχή.
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
                <MarkLogo />
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
    </>
  );
}
