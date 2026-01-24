
"use client";

export function saveDataToLocalStorage(key: string, data: any) {
  const save = () => {
    try {
      const serializedData = JSON.stringify(data);
      window.localStorage.setItem(key, serializedData);
    } catch (error) {
      console.error(`Failed to save data for key "${key}" to localStorage`, error);
    }
  };

  if (window.requestIdleCallback) {
    window.requestIdleCallback(save, { timeout: 2000 });
  } else {
    // Fallback for browsers that don't support requestIdleCallback
    setTimeout(save, 1);
  }
}
