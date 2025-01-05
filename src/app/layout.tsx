import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "./navbar";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Peng Game",
  description: "Peng Game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative dark`}
      >
        <Providers>
          <div className="min-h-svh pt-16 flex flex-col relative">
            <Navbar />
            <main className="flex-grow flex items-center justify-center p-4 sm:p-8">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
