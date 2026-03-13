import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "TUI Aesthetics Kernel OS | IWAS Framework",
  description: "An immersive Terminal User Interface-inspired operating system experience for the IWAS Framework. Consciousness-first architecture for AI systems.",
  keywords: ["IWAS", "Consciousness", "AI", "Terminal UI", "Daramola Olasupo", "Lagos Nigeria"],
  authors: [{ name: "Daramola Olasupo × Claude" }],
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${jetbrainsMono.variable} font-mono antialiased`}>
        {children}
      </body>
    </html>
  );
}
