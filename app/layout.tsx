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

/**
 * Absolute URLs in the metadata — the link-preview image above all — are built
 * from this. It used to be hardcoded to a domain that does not resolve, which
 * pointed every preview at an image that could never load. Netlify supplies the
 * real address of whatever is being built: DEPLOY_PRIME_URL is this deploy
 * (a preview gets its own), URL is the production site and follows a custom
 * domain automatically once one is attached.
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.DEPLOY_PRIME_URL ??
  process.env.URL ??
  "https://portofoliomds.netlify.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Markoulakis Digital Studio | Βαγγέλης Μαρκουλάκης",
  description:
    "Φτιάχνω ιστοσελίδες που φέρνουν κόσμο στην επιχείρησή σας. Σελίδες παρουσίασης, ηλεκτρονικά καταστήματα, κρατήσεις και εφαρμογές για κινητό — από 300€.",
  keywords: [
    "κατασκευή ιστοσελίδων",
    "ιστοσελίδα για επιχείρηση",
    "ηλεκτρονικό κατάστημα",
    "online κρατήσεις",
    "εφαρμογή για κινητό",
    "προώθηση στη Google",
    "Βαγγέλης Μαρκουλάκης",
  ],
  authors: [{ name: "Βαγγέλης Μαρκουλάκης" }],
  openGraph: {
    type: "website",
    title: "Markoulakis Digital Studio | Βαγγέλης Μαρκουλάκης",
    description:
      "Ιστοσελίδες που ανοίγουν γρήγορα, δείχνουν ωραία και σας βρίσκει ο κόσμος στη Google.",
    locale: "el_GR",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Το σήμα του Markoulakis Digital Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Markoulakis Digital Studio",
    description:
      "Ιστοσελίδες που ανοίγουν γρήγορα, δείχνουν ωραία και σας βρίσκει ο κόσμος στη Google.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/apple-touch-icon.png",
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
