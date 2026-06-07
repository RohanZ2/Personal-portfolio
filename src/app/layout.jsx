import "./globals.css";

export const metadata = {
  title: "Personal Portfolio",
  description: "Welcome to my personal portfolio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
