"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export function InstallPWA() {
  const [prompt, setPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (prompt) {
      prompt.prompt();
    }
  };

  if (!prompt) {
    return null;
  }

  return (
    <Button onClick={handleInstallClick}>
      <Download className="mr-2 h-4 w-4" />
      Install App
    </Button>
  );
}
