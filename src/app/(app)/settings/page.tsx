
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Upload } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" description="Manage your application settings." />
      <main className="flex-1 space-y-6 p-4 pt-2 sm:p-6 sm:pt-2">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the look and feel of the application.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Enable or disable the dark color scheme.
                </p>
              </div>
              <Switch id="dark-mode" />
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
                    <Label htmlFor="currency">Currency</Label>
                    <Select defaultValue="USD">
                        <SelectTrigger id="currency">
                            <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="USD">USD - United States Dollar</SelectItem>
                            <SelectItem value="EUR">EUR - Euro</SelectItem>
                            <SelectItem value="GBP">GBP - British Pound</SelectItem>
                            <SelectItem value="KES">KES - Kenyan Shilling</SelectItem>
                            <SelectItem value="NGN">NGN - Nigerian Naira</SelectItem>
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">This currency will be used for all financial notations.</p>
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
