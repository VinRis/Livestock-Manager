
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { birdTypesData } from "@/lib/data";

export default function EggTraySizesPage() {
  return (
    <>
      <PageHeader title="Manage Egg Tray Sizes">
        <Button variant="outline" asChild>
          <Link href="/settings">
            <ArrowLeft />
            Back
          </Link>
        </Button>
      </PageHeader>
      <main className="flex-1 space-y-4 p-4 pt-2 sm:p-6 sm:pt-2">
        <Card>
          <CardContent className="space-y-4 pt-6">
            {birdTypesData.map((bird) => (
              <div key={bird.name} className="flex items-center justify-between rounded-lg border p-4">
                <Label htmlFor={`tray-size-${bird.name.toLowerCase()}`}>{bird.name}</Label>
                <Input
                  id={`tray-size-${bird.name.toLowerCase()}`}
                  type="number"
                  defaultValue={bird.traySize}
                  className="w-24"
                />
              </div>
            ))}
          </CardContent>
        </Card>
        <div className="flex justify-end">
          <Button>Save Changes</Button>
        </div>
      </main>
    </>
  );
}
