import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
});

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "YAHSHUA One — AI-Powered Business Backoffice for Filipino SMBs",
  description:
    "YAHSHUA One brings payroll, accounting, tax compliance, and HR together in one intelligent system built for Filipino businesses.",
  openGraph: {
    title: "YAHSHUA One",
    description:
      "Your entire backoffice. One platform. AI-Powered. Built for Filipino businesses.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${jakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#080d1a] text-white">
        {children}
      </body>
    </html>
  );
}
