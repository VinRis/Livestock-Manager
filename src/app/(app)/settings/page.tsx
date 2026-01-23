
"use client"

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Moon, Sun, Download, MessageSquare, Phone, ExternalLink, Store, BarChart3, RefreshCw, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import React, { useRef, useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const restoreInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  const [farmLogoUrl, setFarmLogoUrl] = useState<string | null>(null);
  const [farmName, setFarmName] = useState('');
  const [managerName, setManagerName] = useState('');
  const [farmLocation, setFarmLocation] = useState('');


  useEffect(() => {
    setIsMounted(true);
    const storedLogo = localStorage.getItem('farmLogoUrl');
    if (storedLogo) {
        setFarmLogoUrl(storedLogo);
    }
    const storedFarmName = localStorage.getItem('farmName');
    if (storedFarmName) setFarmName(storedFarmName);
    const storedManagerName = localStorage.getItem('managerName');
    if (storedManagerName) setManagerName(storedManagerName);
    const storedFarmLocation = localStorage.getItem('farmLocation');
    if (storedFarmLocation) setFarmLocation(storedFarmLocation);
  }, []);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) { // 10MB size limit
      toast({
        variant: "destructive",
        title: "File Too Large",
        description: "Please upload a logo smaller than 10MB.",
      });
      return;
    }

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
        farmName: localStorage.getItem('farmName') || '',
        managerName: localStorage.getItem('managerName') || '',
        farmLocation: localStorage.getItem('farmLocation') || '',
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
        if (restored.farmName) localStorage.setItem('farmName', restored.farmName);
        if (restored.managerName) localStorage.setItem('managerName', restored.managerName);
        if (restored.farmLocation) localStorage.setItem('farmLocation', restored.farmLocation);
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
  
  const handleSaveSettings = () => {
    try {
      localStorage.setItem('farmName', farmName);
      localStorage.setItem('managerName', managerName);
      localStorage.setItem('farmLocation', farmLocation);
      toast({
        title: "Settings Saved",
        description: "Your farm details have been updated.",
      });
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Could not save your farm details.",
      });
    }
  };

  const handleUpdateAndReinstall = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          const checkingToast = toast({
            title: "Checking for updates...",
            description: "Please wait a moment.",
          });

          await registration.update();

          checkingToast.dismiss();

          if (registration.waiting) {
            toast({
              title: "Update Available!",
              description: "Activating the new version now. The app will reload.",
            });
            
            navigator.serviceWorker.addEventListener('controllerchange', () => {
              window.location.reload();
            });
            
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });

          } else {
            toast({
              title: "App is Up to Date",
              description: "You are running the latest version.",
            });
          }
        } else {
             toast({
                variant: "destructive",
                title: "Update Check Failed",
                description: "Could not find an active service worker registration.",
            });
        }
      } catch (error) {
        console.error('Error during service worker update:', error);
        toast({
            variant: "destructive",
            title: "Update Check Failed",
            description: "An error occurred while checking for updates.",
        });
      }
    } else {
        toast({
            variant: "destructive",
            title: "PWA Not Supported",
            description: "Service workers are not supported in your browser.",
        });
    }
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
              <Input 
                id="farm-name" 
                placeholder="e.g., Sunrise Farms"
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
              />
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
                        <p className="text-xs text-muted-foreground">This logo will appear on your generated reports. (PNG, JPG, GIF up to 10MB)</p>
                    </div>
                    <Button variant="outline" onClick={() => logoInputRef.current?.click()}>Choose File</Button>
                    <input 
                        type="file" 
                        ref={logoInputRef} 
                        className="hidden"
                        accept="image/png, image/jpeg, image/gif"
                        onChange={handleLogoUpload}
                    />
                </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="manager-name">Manager's Name</Label>
              <Input 
                id="manager-name" 
                placeholder="e.g., John Doe"
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="farm-location">Farm Location</Label>
              <Input 
                id="farm-location" 
                placeholder="e.g., Springfield, IL"
                value={farmLocation}
                onChange={(e) => setFarmLocation(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-center sm:justify-end">
            <Button className="w-full sm:w-auto" onClick={handleSaveSettings}>Save Settings</Button>
          </CardFooter>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>App Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
            <CardTitle>Data &amp; App Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Important!</AlertTitle>
              <AlertDescription>
                Backup your farm data regularly. It's recommended to do this weekly to prevent data loss.
              </AlertDescription>
            </Alert>
            <div className="flex gap-4">
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
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Analytics &amp; Reports</CardTitle>
            <CardDescription>View detailed analytics and download reports for each livestock category.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/analytics">
                <BarChart3 />
                Go to Analytics
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Support &amp; Feedback</CardTitle>
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

        <Card>
          <CardHeader>
            <CardTitle>App Updates</CardTitle>
            <CardDescription>Check for the latest version of the app and install it.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleUpdateAndReinstall}>
              <RefreshCw />
              Check for Updates
            </Button>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
