
"use client"

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import React from "react";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <PageHeader title="Settings" />
      <main className="flex-1 space-y-6 p-4 pt-2 sm:p-6 sm:pt-2">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the look and feel of the application.</CardDescription>
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
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Farm Details</CardTitle>
            <CardDescription>Update your farm's information.</CardDescription>
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
                    <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-medium">Upload Logo</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                </div>
                <Button variant="outline">Choose File</Button>
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
        </Card>

         <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>Backup and restore your local application data.</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button variant="outline">Backup Data</Button>
            <Button>Restore Data</Button>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>App Preferences</CardTitle>
                <CardDescription>Set default values for application features.</CardDescription>
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

        <div className="flex justify-end">
            <Button>Save Settings</Button>
        </div>

      </main>
    </>
  );
}
