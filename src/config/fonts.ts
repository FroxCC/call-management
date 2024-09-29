import localFont from "next/font/local";
import { Montserrat } from "next/font/google";


export const geistSans = localFont({
    src: "../app/fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
  });
export const geistMono = localFont({
    src: "../app/fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
  });

export const geistMont = Montserrat({
    subsets: ['latin'],
    weight: ['100', '900'],
});
  
