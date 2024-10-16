import type { Metadata } from "next";
import { geistMono, geistMont, geistSans } from "@/config/fonts";
import "./globals.css";
import {
  ClerkProvider
} from '@clerk/nextjs'
import { SearchProvider } from "@/context/SearchContext";
import { CategoriesProvider } from "@/context/CategoriesContext";



export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/sign-in" >
      
    <html lang="en">
      <body
        className={`${geistMont} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SearchProvider>
        <CategoriesProvider>
        {children}
        </CategoriesProvider>
        </SearchProvider>

      </body>
    </html>
    </ClerkProvider>

  );
}
