"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from 'react';
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { currencyData } from "@/lib/data";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/contexts/currency-context";

export default function CurrencySettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { currency, setCurrency } = useCurrency();
  const [selectedCurrency, setSelectedCurrency] = React.useState(currency);
  const [customCurrencyName, setCustomCurrencyName] = React.useState('');
  const [customCurrencySymbol, setCustomCurrencySymbol] = React.useState('');

  // When the component mounts on the client, the `currency` from context will be
  // updated from localStorage. This effect ensures our local state `selectedCurrency`
  // is in sync with the persisted value.
  useEffect(() => {
    setSelectedCurrency(currency);
  }, [currency]);

  const handleSave = () => {
    let finalCurrency = selectedCurrency;

    // If a custom symbol is entered, it takes precedence
    if (customCurrencySymbol) {
      finalCurrency = customCurrencySymbol;
    }
    
    setCurrency(finalCurrency);

    toast({
      title: "Changes Saved",
      description: "Your currency settings have been updated.",
    });
    router.push('/settings');
  };

  return (
    <>
      <PageHeader title="Manage Currency">
        <Button variant="outline" asChild>
          <Link href="/settings">
            <ArrowLeft />
            Back
          </Link>
        </Button>
      </PageHeader>
      <main className="flex-1 space-y-4 p-4 pt-2 sm:p-6 sm:pt-2">
        <Card>
          <CardHeader>
            <CardTitle>Select Currency</CardTitle>
            <CardDescription>Choose your default currency from the list below or add a custom one.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup value={selectedCurrency} onValueChange={setSelectedCurrency}>
              {currencyData.map((c) => (
                <div key={c.code} className="flex items-center justify-between rounded-lg border p-4">
                  <Label htmlFor={`currency-${c.code}`} className="flex-1 cursor-pointer">
                    {c.name} ({c.symbol})
                  </Label>
                  <RadioGroupItem value={c.symbol} id={`currency-${c.code}`} />
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Custom Currency</CardTitle>
                <CardDescription>If your currency is not listed, you can add it here.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
                 <div className="space-y-2">
                    <Label htmlFor="custom-currency-name">Currency Name</Label>
                    <Input id="custom-currency-name" placeholder="e.g., Bitcoin" value={customCurrencyName} onChange={(e) => setCustomCurrencyName(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="custom-currency-symbol">Currency Symbol</Label>
                    <Input id="custom-currency-symbol" placeholder="e.g., BTC" value={customCurrencySymbol} onChange={(e) => setCustomCurrencySymbol(e.target.value)} />
                </div>
            </CardContent>
            <CardFooter className="flex justify-center sm:justify-end">
                <Button onClick={handleSave} className="w-full sm:w-auto">Save Changes</Button>
            </CardFooter>
        </Card>
      </main>
    </>
  );
}
