import type { Metadata } from "next";
import { Inter, Playfair_Display, Dancing_Script, Great_Vibes, Pacifico, Lobster } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const dancing = Dancing_Script({ subsets: ["latin"], variable: "--font-dancing" });
const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"], variable: "--font-great-vibes" });
const pacifico = Pacifico({ weight: "400", subsets: ["latin"], variable: "--font-pacifico" });
const lobster = Lobster({ weight: "400", subsets: ["latin"], variable: "--font-lobster" });

export const metadata: Metadata = {
  title: "Adristi & Fadhriga",
  description: "Join us as we celebrate our love",
  icons: {
    icon: '/love-icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} ${dancing.variable} ${greatVibes.variable} ${pacifico.variable} ${lobster.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}