
"use client";

import Link from "next/link";
import { ArrowLeft, FileText, FileSpreadsheet } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { categoriesData } from "@/lib/data";
import { generateCsvReport, generatePdfReport } from "@/lib/reports";
import { useToast } from "@/hooks/use-toast";

export default function ReportsPage() {
  const { toast } = useToast();

  const handleDownload = async (category: string, format: 'pdf' | 'csv') => {
    toast({
      title: 'Generating Report...',
      description: `Your ${format.toUpperCase()} report for ${category} is being created.`,
    });

    try {
      if (format === 'pdf') {
        await generatePdfReport(category);
      } else {
        await generateCsvReport(category);
      }
      toast({
        title: 'Download Ready!',
        description: `Your ${category} report has been downloaded.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem generating your report.',
      });
      console.error("Report generation error:", error);
    }
  };

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
                  <Button variant="outline" size="sm" onClick={() => handleDownload(category.name, 'pdf')}>
                    <FileText />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDownload(category.name, 'csv')}>
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
