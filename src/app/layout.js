import { Geist, Geist_Mono } from "next/font/google";
import "@fontsource/bebas-neue";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "FlexStream",
  description:
    "FlexStream est une plateforme pour gérer vos films et séries favoris : ajoutez-les à votre collection, attribuez-leur une note et retrouvez facilement toutes vos recommandations personnelles. Par Vincent Silvestri.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
