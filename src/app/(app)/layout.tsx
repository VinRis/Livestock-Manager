
"use client"

import { useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { MobileNav } from "@/components/mobile-nav";
import { InstallPWA } from "@/components/install-pwa";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const readyToExit = useRef(false);
  const isExiting = useRef(false); // Flag to prevent loop on history.back()

  // Use a ref for the toast function to ensure the latest version is used inside the effect closure.
  const toastRef = useRef(toast);
  useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  useEffect(() => {
    const handlePopState = () => {
      // If we are already in the process of exiting, do nothing.
      if (isExiting.current) {
        return;
      }
      
      // This feature is primarily for installed PWAs on mobile.
      const isPWA = window.matchMedia('(display-mode: standalone)').matches;
      if (!isPWA) {
        return;
      }
      
      // If the user has pressed back once already.
      if (readyToExit.current) {
        // Set the exiting flag and go back, which should close the PWA.
        isExiting.current = true;
        window.history.back();
        return;
      }

      // This is the first back press.
      readyToExit.current = true;
      toastRef.current({
        description: 'Press back again to exit.',
      });
      
      // "Trap" the back navigation by pushing a dummy state onto the history stack.
      window.history.pushState(null, '', window.location.href);

      // Reset the exit flag after 2 seconds.
      setTimeout(() => {
        readyToExit.current = false;
      }, 2000);
    };
    
    window.addEventListener('popstate', handlePopState);

    // Cleanup the event listener on component unmount.
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []); // Empty dependency array ensures this effect runs only once.

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
