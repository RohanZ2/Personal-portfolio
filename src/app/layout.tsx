import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Rohan Tewari // Portfolio",
  description: "Rohan's 3D portfolio",
  icons: {
    icon: [{ url: "/favicon-32.png", sizes: "32x32", type: "image/png" }],
    shortcut: "/favicon-32.png",
    apple: "/favicon-32.png",
  },
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
