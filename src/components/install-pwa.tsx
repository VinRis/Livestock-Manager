"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function InstallPWA() {
  const [prompt, setPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setPrompt(e);
      // This check is for devices that have already installed the PWA.
      if (!window.matchMedia('(display-mode: standalone)').matches) {
          setIsVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const handleAppInstalled = () => {
        setIsVisible(false);
        setPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = () => {
    if (prompt) {
      prompt.prompt();
      // The prompt promise can be used to determine the user's choice
      prompt.userChoice.then(() => {
        setIsVisible(false); // Hide banner after interaction
        setPrompt(null);
      });
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible || !prompt) {
    return null;
  }

  return (
    <div className="fixed bottom-16 left-0 right-0 z-50 p-4 sm:bottom-4 md:top-4 md:bottom-auto">
        <Alert className="container mx-auto flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-grow">
                <AlertTitle className="font-bold">Install Livestock Lynx</AlertTitle>
                <AlertDescription>
                    Add this app to your home screen for easy access and offline use.
                </AlertDescription>
            </div>
            <div className="flex w-full flex-shrink-0 items-center gap-2 sm:w-auto">
                <Button onClick={handleInstallClick} size="sm" className="w-full sm:w-auto">
                    <Download className="mr-2 h-4 w-4" />
                    Install
                </Button>
                <Button variant="ghost" size="icon" onClick={handleDismiss} className="h-9 w-9">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Dismiss</span>
                </Button>
            </div>
        </Alert>
    </div>
  );
}
