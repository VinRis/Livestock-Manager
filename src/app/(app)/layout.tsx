
"use client"

import { MobileNav } from "@/components/mobile-nav";
import { InstallPWA } from "@/components/install-pwa";

export default function AppLayout({ children }: { children: React.ReactNode }) {

  return (
    <>
      <div className="relative flex flex-col w-full min-h-screen overflow-x-hidden md:pb-16 pb-16">
        {children}
      </div>
      <MobileNav />
      <InstallPWA />
    </>
  );
}
