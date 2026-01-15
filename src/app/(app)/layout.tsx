
"use client"

import { MobileNav } from "@/components/mobile-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {

  return (
    <>
      <div className="flex flex-col w-full md:pb-16 pb-16">
        {children}
      </div>
      <MobileNav />
    </>
  );
}
