
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Grandpa Ron's Lawns and Landscape LLC | Professional Landscaping Services",
    template: "%s | Grandpa Ron's Lawns and Landscape LLC"
  },
  description: "Professional landscaping services in Columbus, Ohio. From lawn care to complete landscape design. Quality work that lasts generations.",
  keywords: ["landscaping", "lawn care", "Columbus Ohio", "landscape design", "property maintenance"],
  authors: [{ name: "Grandpa Ron's Lawns and Landscape LLC" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://grandparonslawns.com",
    siteName: "Grandpa Ron's Lawns and Landscape LLC",
    title: "Grandpa Ron's Lawns and Landscape LLC | Professional Landscaping Services",
    description: "Professional landscaping services in Columbus, Ohio. Quality work that lasts generations.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Grandpa Ron's Lawns and Landscape LLC",
    description: "Professional landscaping services in Columbus, Ohio.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider>
            <Header />
            {children}
            <Footer />
            <Toaster position="top-right" />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
