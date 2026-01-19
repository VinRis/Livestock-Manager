"use client"

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Moon, Sun, Download, MessageSquare, Phone, ExternalLink, Store } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import React, { useRef, useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const restoreInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [farmLogoUrl, setFarmLogoUrl] = useState<string | null>(null);


  useEffect(() => {
    setIsMounted(true);
    const storedLogo = localStorage.getItem('farmLogoUrl');
    if (storedLogo) {
        setFarmLogoUrl(storedLogo);
    }
  }, []);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const dataUrl = e.target?.result as string;
            if (!dataUrl) throw new Error("File could not be read.");
            
            localStorage.setItem('farmLogoUrl', dataUrl);
            setFarmLogoUrl(dataUrl);

            toast({
                title: "Logo Updated",
                description: "Your new farm logo has been saved.",
            });

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Could not process the file.";
            toast({
                variant: "destructive",
                title: "Upload Failed",
                description: errorMessage,
            });
        }
    };
    reader.readAsDataURL(file);
  };

  const handleBackup = () => {
    try {
      const backupData = {
        livestockData: JSON.parse(localStorage.getItem('livestockData') || '[]'),
        categoriesData: JSON.parse(localStorage.getItem('categoriesData') || '[]'),
        activityLogData: JSON.parse(localStorage.getItem('activityLogData') || '[]'),
        tasksData: JSON.parse(localStorage.getItem('tasksData') || '[]'),
        financialData: JSON.parse(localStorage.getItem('financialData') || '[]'),
        farmLogoUrl: localStorage.getItem('farmLogoUrl') || '',
        theme: localStorage.getItem('theme') || 'system',
        currency: localStorage.getItem('currency') || '$',
        backupDate: new Date().toISOString(),
      };
      
      const jsonString = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `livestock-lynx-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Backup Successful",
        description: "Your farm data has been downloaded.",
      });

    } catch (error) {
      console.error("Backup failed:", error);
      toast({
        variant: "destructive",
        title: "Backup Failed",
        description: "Could not back up your data.",
      });
    }
  };

  const handleRestoreClick = () => {
    restoreInputRef.current?.click();
  };

  const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') throw new Error("File could not be read.");
        
        const restored = JSON.parse(text);

        // Basic validation
        if (!restored.livestockData || !restored.categoriesData) {
            throw new Error("Invalid backup file format.");
        }

        localStorage.setItem('livestockData', JSON.stringify(restored.livestockData || []));
        localStorage.setItem('categoriesData', JSON.stringify(restored.categoriesData || []));
        localStorage.setItem('activityLogData', JSON.stringify(restored.activityLogData || []));
        localStorage.setItem('tasksData', JSON.stringify(restored.tasksData || []));
        localStorage.setItem('financialData', JSON.stringify(restored.financialData || []));
        
        if (restored.farmLogoUrl) localStorage.setItem('farmLogoUrl', restored.farmLogoUrl);
        if (restored.theme) localStorage.setItem('theme', restored.theme);
        if (restored.currency) localStorage.setItem('currency', restored.currency);

        toast({
          title: "Restore Successful",
          description: "Your farm data has been restored. The app will now reload.",
        });
        
        setTimeout(() => window.location.reload(), 1500);

      } catch (error) {
        console.error("Restore failed:", error);
        const errorMessage = error instanceof Error ? error.message : "Could not parse the backup file.";
        toast({
          variant: "destructive",
          title: "Restore Failed",
          description: errorMessage,
        });
      } finally {
        // Reset file input
        if(event.target) event.target.value = '';
      }
    };
    reader.readAsText(file);
  };


  return (
    <>
      <PageHeader title="Settings" />
      <main className="flex-1 space-y-6 p-4 pt-2 sm:p-6 sm:pt-2">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label htmlFor="dark-mode">Theme</Label>
                <p className="text-sm text-muted-foreground">
                  Select a theme for the application.
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-muted p-1">
                {isMounted ? (
                  <>
                    <Button
                      variant={theme === 'light' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setTheme('light')}
                      className={cn("rounded-full", theme === 'light' && 'bg-primary text-primary-foreground')}
                    >
                      <Sun className="h-4 w-4" />
                      <span className="sr-only">Light mode</span>
                    </Button>
                    <Button
                      variant={theme === 'dark' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setTheme('dark')}
                      className={cn("rounded-full", theme === 'dark' && 'bg-primary text-primary-foreground')}
                    >
                      <Moon className="h-4 w-4" />
                      <span className="sr-only">Dark mode</span>
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
                    <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Farm Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="farm-name">Farm Name</Label>
              <Input id="farm-name" placeholder="e.g., Sunrise Farms" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="farm-logo">Farm Logo</Label>
                <div className="flex items-center gap-4 rounded-lg border p-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted">
                        {farmLogoUrl ? (
                            <Image src={farmLogoUrl} alt="Farm Logo" width={64} height={64} className="h-16 w-16 rounded-lg object-cover" />
                        ) : (
                            <Upload className="h-8 w-8 text-muted-foreground" />
                        )}
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium">Upload Logo</p>
                        <p className="text-xs text-muted-foreground">This logo will appear on your generated reports. (PNG, JPG up to 1MB)</p>
                    </div>
                    <Button variant="outline" onClick={() => logoInputRef.current?.click()}>Choose File</Button>
                    <input 
                        type="file" 
                        ref={logoInputRef} 
                        className="hidden"
                        accept="image/png, image/jpeg"
                        onChange={handleLogoUpload}
                    />
                </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="manager-name">Manager's Name</Label>
              <Input id="manager-name" placeholder="e.g., John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="farm-location">Farm Location</Label>
              <Input id="farm-location" placeholder="e.g., Springfield, IL" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button>Save Settings</Button>
          </CardFooter>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>App Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <Label>Egg Tray Sizes</Label>
                    <p className="text-xs text-muted-foreground">Set the default number of eggs per tray for different bird types.</p>
                     <Button asChild variant="outline">
                        <Link href="/settings/egg-tray-sizes">Manage Egg Tray Sizes</Link>
                    </Button>
                </div>
                <div className="space-y-2">
                    <Label>Currency</Label>
                    <p className="text-xs text-muted-foreground">Set the currency for all financial notations.</p>
                     <Button asChild variant="outline">
                        <Link href="/settings/currency">Manage Currency</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data & App Management</CardTitle>
            <CardDescription>Backup or restore your farm data.</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button variant="outline" onClick={handleBackup}>
              <Download />
              Backup Data
            </Button>
            <Button onClick={handleRestoreClick}>
              <Upload />
              Restore Data
            </Button>
            <input 
              type="file" 
              ref={restoreInputRef} 
              className="hidden"
              accept="application/json"
              onChange={handleRestore}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Download Reports</CardTitle>
            <CardDescription>Download your farm data in various formats.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/settings/reports">
                <Download />
                Go to Reports Page
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Support & Feedback</CardTitle>
            <CardDescription>Have suggestions or need help? Reach out to us.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-start text-left">
              <Link href="https://wa.me/254732364559" target="_blank" rel="noopener noreferrer">
                <MessageSquare />
                Chat on WhatsApp
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start text-left">
              <Link href="tel:+254732364559">
                <Phone />
                Call Us: +254 732 364559
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start text-left">
              <Link href="http://facebook.com/KienyejiPoultryFarmers" target="_blank" rel="noopener noreferrer">
                <ExternalLink />
                Visit our Facebook Page
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Online Store</CardTitle>
            <CardDescription>Get useful templates and resources to help you manage your farm.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="https://selar.com/m/kpf" target="_blank" rel="noopener noreferrer">
                <Store />
                Visit Store
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
