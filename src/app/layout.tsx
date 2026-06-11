import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Rohan Tewari // Portfolio",
  description: "Rohan's 3D portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
