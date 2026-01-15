
"use client";

import Link from "next/link";
import { ArrowLeft, FileText, FileSpreadsheet } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { categoriesData } from "@/lib/data";

export default function ReportsPage() {
  return (
    <>
      <PageHeader title="Download Reports">
        <Button variant="outline" asChild>
          <Link href="/settings">
            <ArrowLeft />
            Back to Settings
          </Link>
        </Button>
      </PageHeader>
      <main className="flex-1 space-y-4 p-4 pt-2 sm:p-6 sm:pt-2">
        <Card>
          <CardHeader>
            <CardTitle>Livestock Reports</CardTitle>
            <CardDescription>
              Download a complete report for each livestock category.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoriesData.map((category) => (
              <div key={category.name} className="rounded-lg border p-4">
                <h3 className="font-semibold">{category.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Download a report of all animals in this category.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <FileText />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileSpreadsheet />
                    CSV
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </>
  );
}
