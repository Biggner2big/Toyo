import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { DisclaimerBanner } from "@/components/layout/DisclaimerBanner";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Toyo — Pre-Legal Document Generator",
  description:
    "Production-grade pre-legal document drafting SaaS. Generate, customize, live-preview, and export contracts, NDAs, and letters as PDF and DOCX.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} min-h-screen flex flex-col bg-[#0a0d14] text-slate-100 antialiased`}>
        <DisclaimerBanner />
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
