import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "James - Personal Financial Coach",
  description: "Your AI-powered financial coach for smarter spending without sacrifice",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
