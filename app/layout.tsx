'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { AuthProvider } from "@/lib/auth";
import Navigation from "@/components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-blue-50 to-white min-h-screen`}
      >
        <AuthProvider>
          <Navigation />
          
          <main>
            {children}
          </main>

          <footer className="bg-white mt-16 py-6 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <p className="text-gray-600">
                © {new Date().getFullYear()} Techla Solutions. All rights reserved.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Professional Document Management System
              </p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
