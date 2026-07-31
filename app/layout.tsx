import type { Metadata, Viewport } from "next";
import { Commissioner, Manrope } from "next/font/google";
import "./globals.css";

/* Manrope carries the headlines and the wordmark — geometric, wide caps.
   Commissioner does the reading: humanist, quieter, and it keeps small
   letter-spaced labels legible. Both ship Greek, which the page needs. */
const display = Manrope({
  variable: "--font-display",
  subsets: ["latin", "greek"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const sans = Commissioner({
  variable: "--font-sans",
  subsets: ["latin", "greek"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://markoulakis.dev"),
  title: "Markoulakis Digital Studio | Βαγγέλης Μαρκουλάκης",
  description:
    "Portfolio του Βαγγέλη Μαρκουλάκη. Σχεδιάζω και αναπτύσσω σύγχρονες ιστοσελίδες, e-shops, mobile εφαρμογές και ψηφιακά εργαλεία για φιλόδοξες επιχειρήσεις.",
  keywords: [
    "web developer",
    "ιστοσελίδες",
    "e-shop",
    "Next.js",
    "React",
    "UI UX design",
    "mobile apps",
    "Βαγγέλης Μαρκουλάκης",
  ],
  authors: [{ name: "Βαγγέλης Μαρκουλάκης" }],
  openGraph: {
    type: "website",
    title: "Markoulakis Digital Studio | Βαγγέλης Μαρκουλάκης",
    description:
      "Σύγχρονες ιστοσελίδες, e-shops και ψηφιακά προϊόντα με καθαρό design και τεχνολογία που αντέχει στον χρόνο.",
    locale: "el_GR",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a5cff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="el">
      <body className={`${display.variable} ${sans.variable} antialiased`}>{children}</body>
    </html>
  );
}
