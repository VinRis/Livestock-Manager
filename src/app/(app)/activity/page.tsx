
"use client";

import { useState } from "react";
import { PlusCircle, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { activityLogData as initialActivityLogData, type Activity, livestockData } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Combobox } from "@/components/ui/combobox";
import Link from "next/link";
import { cn } from "@/lib/utils";

const formatRelativeDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));

  if (diffDays === 0) {
    if (diffHours < 1) return "Just now";
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  }
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
};

export default function ActivityLogPage() {
  const { toast } = useToast();
  const [activityLog, setActivityLog] = useState<Activity[]>(initialActivityLogData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  const [isDialogOpen, setDialogOpen] = useState(false);
  
  // Form state
  const [activityType, setActivityType] = useState<'Feeding' | 'Health Check' | 'Breeding' | 'Movement' | 'General' | ''>('');
  const [activityDate, setActivityDate] = useState(new Date().toISOString().split('T')[0]);
  const [activityDescription, setActivityDescription] = useState('');
  const [livestockId, setLivestockId] = useState('');
  const [livestockCategory, setLivestockCategory] = useState('');

  const handleLogActivity = () => {
    if (!activityType || !activityDate || !activityDescription) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill out all fields to log an activity.",
      });
      return;
    }

    const selectedAnimal = livestockData.find(animal => animal.id === livestockId);

    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      type: activityType as 'Feeding' | 'Health Check' | 'Breeding' | 'Movement' | 'General',
      date: new Date(activityDate).toISOString(),
      description: activityDescription,
      livestockId: selectedAnimal?.id,
      livestockName: selectedAnimal?.name,
      livestockCategory: livestockCategory,
    };

    setActivityLog(prevLog => [newActivity, ...prevLog]);

    toast({
      title: "Activity Logged",
      description: "The new activity has been added to your log.",
    });

    // Reset form and close dialog
    setActivityType('');
    setActivityDate(new Date().toISOString().split('T')[0]);
    setActivityDescription('');
    setLivestockId('');
    setLivestockCategory('');
    setDialogOpen(false);
  };
  
  const activityTypes = ['Feeding', 'Health Check', 'Breeding', 'Movement', 'General'];
  const livestockOptions = livestockData.map(animal => ({ value: animal.id, label: `${animal.name} (${animal.tagId})`}));
  const categoryOptions = Array.from(new Set(livestockData.map(animal => animal.category)));

  return (
    <>
      <PageHeader title="Farm Activity Log" description="A record of all recent activities on your farm.">
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle />
              Log Activity
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Log a New Activity</DialogTitle>
              <DialogDescription>
                Record a new activity that happened on the farm.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="activity-type">Activity Type</Label>
                  <Select value={activityType} onValueChange={(value) => setActivityType(value as any)}>
                      <SelectTrigger id="activity-type">
                          <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                          {activityTypes.map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="activity-date">Date</Label>
                  <Input id="activity-date" type="date" value={activityDate} onChange={(e) => setActivityDate(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="livestock" className={cn(!!livestockCategory && 'text-muted-foreground')}>
                  Affected Livestock (Optional)
                </Label>
                <Combobox
                    options={livestockOptions}
                    value={livestockId}
                    onChange={setLivestockId}
                    placeholder="Select an animal..."
                    emptyMessage="No animals found."
                    disabled={!!livestockCategory}
                />
              </div>
              <div className="relative text-center my-2">
                <span className="bg-background px-2 text-sm text-muted-foreground">OR</span>
                <div className="absolute left-0 top-1/2 w-full -translate-y-1/2 border-t -z-10"></div>
              </div>
               <div className="space-y-2">
                  <Label htmlFor="livestock-category" className={cn(!!livestockId && 'text-muted-foreground')}>
                    Affected Category (Optional)
                  </Label>
                  <Select value={livestockCategory} onValueChange={setLivestockCategory} disabled={!!livestockId}>
                      <SelectTrigger id="livestock-category">
                          <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                          {categoryOptions.map(cat => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
              </div>
              <div className="space-y-2 mt-4">
                <Label htmlFor="activity-description">Description</Label>
                <Textarea
                  id="activity-description"
                  placeholder="Describe the activity in detail..."
                  value={activityDescription}
                  onChange={(e) => setActivityDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleLogActivity}>Save Activity</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>
      <main className="flex-1 space-y-4 p-4 pt-2 sm:p-6 sm:pt-2">
        <Card>
          <CardHeader>
            <CardTitle>Activity Feed</CardTitle>
            <CardDescription>Chronological list of farm activities.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {activityLog.map((activity) => (
                <div key={activity.id} className="relative pl-8">
                  <div className="absolute left-0 top-1 h-full border-l-2 border-border"></div>
                  <div className="absolute left-[-5px] top-1 h-3 w-3 rounded-full bg-primary"></div>
                  <div className="flex items-start gap-4">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <Badge variant="outline">{activity.type}</Badge>
                        <p className="text-xs text-muted-foreground">{formatRelativeDate(activity.date)}</p>
                      </div>
                      <p className="mt-1 text-sm text-foreground">{activity.description}</p>
                      {activity.livestockId && activity.livestockName && (
                        <Button variant="link" size="sm" className="h-auto p-0 mt-1" asChild>
                           <Link href={`/livestock/${activity.livestockId}`} className="text-xs">
                             <LinkIcon className="mr-1 h-3 w-3"/>
                             {activity.livestockName}
                           </Link>
                        </Button>
                      )}
                      {activity.livestockCategory && (
                        <Button variant="link" size="sm" className="h-auto p-0 mt-1" asChild>
                           <Link href={`/livestock?category=${activity.livestockCategory.toLowerCase()}`} className="text-xs">
                             <LinkIcon className="mr-1 h-3 w-3"/>
                             {activity.livestockCategory}
                           </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {activityLog.length === 0 && (
                <div className="py-8 text-center text-muted-foreground">
                  No activities logged yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
