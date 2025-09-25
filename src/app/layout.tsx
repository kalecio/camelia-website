import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Camélia Saboaria Artesanal",
  description: "Camélia Saboaria Artesanal",
  openGraph: {
    type: "website",
    countryName: "Brazil",
    locale: "pt-BR",
    title: "Camélia Saboaria Artesanal",
    description: "Sabonetes e cuidados naturais feitos à mão, unindo beleza, bem-estar e respeito ao meio ambiente.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1800,
        height: 1800,
        alt: "Camélia Saboaria Artesanal - Sabonetes Naturais"
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <link rel="icon" href="/images/favicon.ico" sizes="any" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
