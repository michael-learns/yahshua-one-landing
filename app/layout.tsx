import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

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
    <html lang="en" className={GeistSans.variable}>
      <body className="min-h-full flex flex-col bg-white text-[#0f172a]">
        {children}
      </body>
    </html>
  );
}
