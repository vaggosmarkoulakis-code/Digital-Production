"use client";

/**
 * "By the numbers" section.
 *
 * Three forms, each picked for its job:
 *  - Lighthouse targets  → meters (a ratio against a fixed limit of 100)
 *  - Comfort per tech    → single-series bar chart (magnitude, one hue)
 *  - Project time split  → stacked bar on an ordinal ramp (the phases are ordered,
 *                          so the colour carries the order instead of identity)
 *
 * Colours come from the validated tokens in globals.css: one electric-blue mark
 * for the single-series charts and a four-step blue ramp for the ordinal one.
 */

import { motion, useReducedMotion } from "framer-motion";

type Lang = "el" | "en";
type Copy = { el: string; en: string };

const lighthouse: Array<{ label: Copy; value: number }> = [
  { label: { el: "Performance", en: "Performance" }, value: 98 },
  { label: { el: "Προσβασιμότητα", en: "Accessibility" }, value: 100 },
  { label: { el: "Best practices", en: "Best practices" }, value: 100 },
  { label: { el: "SEO", en: "SEO" }, value: 98 },
];

const skills: Array<{ label: Copy; value: number }> = [
  { label: { el: "React / Next.js", en: "React / Next.js" }, value: 95 },
  { label: { el: "TypeScript", en: "TypeScript" }, value: 90 },
  { label: { el: "UI/UX Design", en: "UI/UX design" }, value: 88 },
  { label: { el: "Firebase & Cloud", en: "Firebase & cloud" }, value: 82 },
  { label: { el: "Node.js", en: "Node.js" }, value: 78 },
  { label: { el: "Τεχνικό SEO", en: "Technical SEO" }, value: 75 },
];

const phases: Array<{ label: Copy; value: number; step: string }> = [
  { label: { el: "Στρατηγική & ανάλυση", en: "Strategy & analysis" }, value: 15, step: "var(--ramp-1)" },
  { label: { el: "Σχεδιασμός", en: "Design" }, value: 30, step: "var(--ramp-2)" },
  { label: { el: "Ανάπτυξη", en: "Development" }, value: 40, step: "var(--ramp-3)" },
  { label: { el: "Έλεγχος & παράδοση", en: "Testing & launch" }, value: 15, step: "var(--ramp-4)" },
];

const ticks = [0, 25, 50, 75, 100];

export default function Metrics({ lang }: { lang: Lang }) {
  const tr = (value: Copy) => value[lang];
  const reduced = useReducedMotion();

  const grow = (width: number) => ({
    initial: reduced ? false : ({ width: 0 } as const),
    whileInView: { width: `${width}%` },
    viewport: { once: true, amount: 0.4 },
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section className="shell" id="metrics">
      <div className="section-head">
        <div>
          <p className="eyebrow">
            <i />
            {tr({ el: "ΜΕ ΝΟΥΜΕΡΑ", en: "BY THE NUMBERS" })}
          </p>
          <h2>
            {tr({ el: "Ό,τι φτιάχνω, ", en: "What I build " })}
            <em>{tr({ el: "μετριέται.", en: "gets measured." })}</em>
          </h2>
        </div>
        <div>
          <p>
            {tr({
              el: "Τα Lighthouse νούμερα είναι ο στόχος που βάζω σε κάθε παράδοση. Τα υπόλοιπα δύο γραφήματα είναι δική μου εκτίμηση για το πού στέκομαι και πώς δουλεύω.",
              en: "The Lighthouse figures are the target I hold every delivery to. The other two charts are my own estimate of where I stand and how I work.",
            })}
          </p>
        </div>
      </div>

      <div className="chart-grid">
        {/* ---------------------------------------------- Meters: Lighthouse */}
        <figure className="glass chart-card">
          <figcaption>
            <h3>{tr({ el: "Στόχος Lighthouse", en: "Lighthouse target" })}</h3>
            <p>{tr({ el: "Σε κάθε σελίδα που παραδίδω, στα 100", en: "On every page I ship, out of 100" })}</p>
          </figcaption>
          <div className="meter-grid">
            {lighthouse.map((item) => (
              <div className="meter" key={item.label.en}>
                <div className="meter-head">
                  <span>{tr(item.label)}</span>
                  <b>{item.value}</b>
                </div>
                <div className="meter-track">
                  <motion.i className="meter-fill" {...grow(item.value)} />
                </div>
              </div>
            ))}
          </div>
        </figure>

        {/* ------------------------------------- Stacked bar: time distribution */}
        <figure className="glass chart-card">
          <figcaption>
            <h3>{tr({ el: "Ο χρόνος ενός project", en: "A project's time" })}</h3>
            <p>{tr({ el: "Τυπική κατανομή ανά φάση", en: "Typical split per phase" })}</p>
          </figcaption>

          <motion.div
            className="stack-bar"
            initial={reduced ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
          >
            {phases.map((phase) => (
              <span
                className="stack-seg"
                key={phase.label.en}
                tabIndex={0}
                style={{ flexBasis: `${phase.value}%`, background: phase.step }}
              >
                {phase.value >= 25 && <b>{phase.value}%</b>}
                <span className="chart-tip" role="status">
                  {tr(phase.label)} · {phase.value}%
                </span>
              </span>
            ))}
          </motion.div>

          <ul className="chart-legend">
            {phases.map((phase) => (
              <li key={phase.label.en}>
                <i style={{ background: phase.step }} />
                {tr(phase.label)}
                <b>{phase.value}%</b>
              </li>
            ))}
          </ul>
        </figure>
        {/* ------------------------------------------- Bar chart: comfort level */}
        <figure className="glass chart-card chart-card-wide">
          <figcaption>
            <h3>{tr({ el: "Επίπεδο εξοικείωσης", en: "Comfort level" })}</h3>
            <p>{tr({ el: "Αυτοαξιολόγηση ανά τεχνολογία, στα 100", en: "Self-assessed per technology, out of 100" })}</p>
          </figcaption>

          <div className="bar-chart">
            <div className="bar-grid" aria-hidden="true">
              {ticks.map((tick) => (
                <i key={tick} style={{ left: `${tick}%` }} />
              ))}
            </div>

            {skills.map((skill) => (
              <div className="bar-row" key={skill.label.en} tabIndex={0}>
                <span className="bar-label">{tr(skill.label)}</span>
                <span className="bar-plot">
                  <motion.i className="bar" {...grow(skill.value)} />
                  <span className="chart-tip" role="status">
                    {tr(skill.label)} · {skill.value}
                  </span>
                </span>
                <span className="bar-value">{skill.value}</span>
              </div>
            ))}

            <div className="bar-axis" aria-hidden="true">
              {ticks.map((tick) => (
                <span key={tick} style={{ left: `${tick}%` }}>
                  {tick}
                </span>
              ))}
            </div>
          </div>
        </figure>

      </div>

      {/* ------------------------------------------------------- Table view */}
      <details className="chart-tables">
        <summary>{tr({ el: "Δείτε τα δεδομένα σε πίνακα", en: "View the data as a table" })}</summary>
        <div className="chart-tables-inner">
          <table>
            <caption>{tr({ el: "Στόχος Lighthouse", en: "Lighthouse target" })}</caption>
            <thead>
              <tr>
                <th scope="col">{tr({ el: "Μέτρηση", en: "Metric" })}</th>
                <th scope="col">{tr({ el: "Στόχος", en: "Target" })}</th>
              </tr>
            </thead>
            <tbody>
              {lighthouse.map((item) => (
                <tr key={item.label.en}>
                  <th scope="row">{tr(item.label)}</th>
                  <td>{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <table>
            <caption>{tr({ el: "Επίπεδο εξοικείωσης", en: "Comfort level" })}</caption>
            <thead>
              <tr>
                <th scope="col">{tr({ el: "Τεχνολογία", en: "Technology" })}</th>
                <th scope="col">{tr({ el: "Επίπεδο", en: "Level" })}</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((skill) => (
                <tr key={skill.label.en}>
                  <th scope="row">{tr(skill.label)}</th>
                  <td>{skill.value}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <table>
            <caption>{tr({ el: "Ο χρόνος ενός project", en: "A project's time" })}</caption>
            <thead>
              <tr>
                <th scope="col">{tr({ el: "Φάση", en: "Phase" })}</th>
                <th scope="col">{tr({ el: "Ποσοστό", en: "Share" })}</th>
              </tr>
            </thead>
            <tbody>
              {phases.map((phase) => (
                <tr key={phase.label.en}>
                  <th scope="row">{tr(phase.label)}</th>
                  <td>{phase.value}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}
