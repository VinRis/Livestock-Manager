
'use client';

import React, { useEffect } from 'react';

export default function PwaManifestHandler() {
  useEffect(() => {
    const customIconUrl = localStorage.getItem('pwaIconUrl');
    const manifestLink = document.querySelector("link[rel='manifest']") as HTMLLinkElement;

    if (!manifestLink) return;

    // Base manifest structure from the static file
    const baseManifest = {
        name: "Livestock Lynx",
        short_name: "LivestockLynx",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [] as { src: string; sizes: string; type: string }[],
    };

    if (customIconUrl) {
        // A simple way to get mime type from data URI
        const typeMatch = customIconUrl.match(/data:(image\/[a-zA-Z0-9]+);base64,/);
        const type = typeMatch ? typeMatch[1] : 'image/png';
        
        baseManifest.icons = [
            // Most browsers will scale the icon, so providing common PWA sizes is a good practice.
            { src: customIconUrl, sizes: "192x192", type: type },
            { src: customIconUrl, sizes: "512x512", type: type },
        ];
    }
    
    // Only generate a new manifest if there's a custom icon to add.
    // Otherwise, the default static manifest.json will be used.
    if (baseManifest.icons.length > 0) {
        const manifestString = JSON.stringify(baseManifest);
        const blob = new Blob([manifestString], { type: 'application/json' });
        const manifestUrl = URL.createObjectURL(blob);
        manifestLink.href = manifestUrl;
    }

  }, []);

  return null;
}
