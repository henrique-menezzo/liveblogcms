import type { Metadata } from "next";
import { Libre_Franklin } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/Toast";

// Figma uses Libre Franklin throughout the CMS UI.
const franklin = Libre_Franklin({
  subsets: ["latin"],
  variable: "--font-franklin",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "DW Live Blog CMS",
  description: "Daily Wire Live Blog CMS — prototype",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={franklin.variable}>
      <body className="font-sans">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
