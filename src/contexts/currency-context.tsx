"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type CurrencyContextType = {
  currency: string;
  setCurrency: (currency: string) => void;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState(() => {
    if (typeof window === 'undefined') {
      return '$';
    }
    try {
      // Try to get the currency from localStorage
      const item = window.localStorage.getItem('currency');
      // If it exists, use it, otherwise default to '$'
      return item ? item : '$';
    } catch (error) {
      console.error("Failed to read currency from localStorage", error);
      return '$';
    }
  });

  // This effect runs whenever the currency state changes, and saves it to localStorage.
  useEffect(() => {
    try {
      window.localStorage.setItem('currency', currency);
    } catch (error) {
      console.error("Failed to save currency to localStorage", error);
    }
  }, [currency]);


  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
