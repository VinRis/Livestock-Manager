
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { currencyData } from "@/lib/data";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function CurrencySettingsPage() {
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
            <RadioGroup defaultValue="USD">
              {currencyData.map((currency) => (
                <div key={currency.code} className="flex items-center justify-between rounded-lg border p-4">
                  <Label htmlFor={`currency-${currency.code}`} className="flex-1 cursor-pointer">
                    {currency.name} ({currency.code})
                  </Label>
                  <RadioGroupItem value={currency.code} id={`currency-${currency.code}`} />
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
                    <Input id="custom-currency-name" placeholder="e.g., Bitcoin" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="custom-currency-code">Currency Code</Label>
                    <Input id="custom-currency-code" placeholder="e.g., BTC" />
                </div>
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button>Save Changes</Button>
            </CardFooter>
        </Card>
      </main>
    </>
  );
}
