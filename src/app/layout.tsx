import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prawo Jazdy – Quiz Kategoria B",
  description: "Ćwicz na egzamin prawa jazdy kategorii B. 32 losowe pytania z oficjalnej bazy pytań.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
