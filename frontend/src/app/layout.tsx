import type { Metadata } from "next";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Patent Navigator",
  description: "특허 검색 및 우회방안 제시 LLM 웹앱",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body className="antialiased flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 bg-gray-50">{children}</main>

        <Footer />
      </body>
    </html>
  );
}