import type { Metadata } from "next";
import { Footer, Sidenav, Header } from '@/components';
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import { CallProvider } from "@/context/CallContext";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-col min-h-screen bg-white text-black overflow-y-auto">
      {/* Mostrar solo si el usuario está autenticado */}
      <SignedIn>
        <CallProvider>
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidenav />
          <div className="flex-1 overflow-y-auto p-4">{children}</div>
        </div>
        <Footer />
        </CallProvider>
      </SignedIn>
      {/* Redirigir al inicio de sesión si el usuario no está autenticado */}
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </main>
  );
}
