import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

/**
 * Nunito is loaded as the web fallback for Avenir Next.
 * On macOS/iOS the browser will pick up Avenir Next first from the
 * font-sans stack defined in globals.css; on other platforms Nunito
 * takes over — it shares the same geometric humanist DNA.
 */
const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PCC Connect",
  description: "Pasadena City College student & faculty intranet portal",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${nunito.variable} h-full antialiased`}>
      <body className="min-h-full bg-surface-subtle font-sans text-text-primary">
        {children}
      </body>
    </html>
  );
}
