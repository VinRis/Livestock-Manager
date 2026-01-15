
"use client";

import { useState } from "react";
import { PlusCircle, Link as LinkIcon, MoreVertical, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { activityLogData as initialActivityLogData, type Activity, livestockData, categoriesData } from "@/lib/data";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
  const diffSeconds = Math.floor(diffTime / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 1) return `${diffDays} days ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffHours > 1) return `${diffHours} hours ago`;
  if (diffHours === 1) return "1 hour ago";
  if (diffMinutes > 1) return `${diffMinutes} minutes ago`;
  if (diffMinutes === 1) return "1 minute ago";
  return "Just now";
};

export default function ActivityLogPage() {
  const { toast } = useToast();
  const [activityLog, setActivityLog] = useState<Activity[]>(initialActivityLogData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  
  // Dialog states
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Form state for adding
  const [newActivity, setNewActivity] = useState({
    type: '' as Activity['type'] | '',
    date: new Date().toISOString(),
    description: '',
    livestockId: '',
    livestockCategory: ''
  });
  
  // State for editing/deleting
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const handleLogActivity = () => {
    if (!newActivity.type || !newActivity.date) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please select an activity type and date.",
      });
      return;
    }

    const selectedAnimal = livestockData.find(animal => animal.id === newActivity.livestockId);

    const activityToAdd: Activity = {
      id: `act-${Date.now()}`,
      type: newActivity.type as Activity['type'],
      date: new Date(newActivity.date).toISOString(),
      description: newActivity.description,
      livestockId: selectedAnimal?.id,
      livestockName: selectedAnimal?.name,
      livestockCategory: newActivity.livestockCategory,
    };

    setActivityLog(prevLog => [activityToAdd, ...prevLog]);

    toast({
      title: "Activity Logged",
      description: "The new activity has been added to your log.",
    });

    setNewActivity({
      type: '',
      date: new Date().toISOString(),
      description: '',
      livestockId: '',
      livestockCategory: ''
    });
    setAddDialogOpen(false);
  };
  
  const handleEditClick = (activity: Activity) => {
    setTimeout(() => {
        setSelectedActivity(activity);
        setEditDialogOpen(true);
    }, 0);
  };

  const handleUpdateActivity = () => {
    if (!selectedActivity) return;

    setActivityLog(prevLog =>
      prevLog.map(act => (act.id === selectedActivity.id ? selectedActivity : act))
    );

    toast({
      title: "Activity Updated",
      description: "The activity details have been saved.",
    });

    setEditDialogOpen(false);
    setSelectedActivity(null);
  };
  
  const handleDeleteClick = (activity: Activity) => {
    setTimeout(() => {
        setSelectedActivity(activity);
        setDeleteDialogOpen(true);
    }, 0);
  };

  const handleConfirmDelete = () => {
    if (!selectedActivity) return;

    setActivityLog(prevLog => prevLog.filter(act => act.id !== selectedActivity.id));

    toast({
      variant: "destructive",
      title: "Activity Deleted",
      description: "The activity has been removed from your log.",
    });

    setDeleteDialogOpen(false);
    setSelectedActivity(null);
  };

  const activityTypes = ['Feeding', 'Health Check', 'Breeding', 'Movement', 'General'];
  const livestockOptions = livestockData.map(animal => ({ value: animal.id, label: `${animal.name} (${animal.tagId})`}));
  const categoryOptions = categoriesData.map(cat => cat.name);

  return (
    <>
      <PageHeader title="Farm Activity Log" />
      <main className="flex-1 space-y-4 p-4 pt-2 sm:p-6 sm:pt-2">
        <Card>
          <CardHeader>
            <CardTitle>Activity Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {activityLog.map((activity) => (
                <div key={activity.id} className="relative pl-8">
                  <div className="absolute left-0 top-1 h-full border-l-2 border-border"></div>
                  <div className="absolute left-[-5px] top-1 h-3 w-3 rounded-full bg-primary"></div>
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
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
                      {activity.livestockCategory && !activity.livestockId && (
                        <Button variant="link" size="sm" className="h-auto p-0 mt-1" asChild>
                           <Link href={`/livestock?category=${activity.livestockCategory.toLowerCase()}`} className="text-xs">
                             <LinkIcon className="mr-1 h-3 w-3"/>
                             {activity.livestockCategory}
                           </Link>
                        </Button>
                      )}
                    </div>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={() => handleEditClick(activity)}>
                                <Edit className="mr-2 h-4 w-4"/>Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleDeleteClick(activity)} className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4"/>Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
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

      {/* Add FAB */}
       <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="fixed bottom-20 right-4 h-14 w-14 rounded-full shadow-lg sm:bottom-6">
              <PlusCircle className="h-6 w-6" />
              <span className="sr-only">Log Activity</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Log a New Activity</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="activity-type">Activity Type</Label>
                  <Select value={newActivity.type} onValueChange={(value) => setNewActivity(prev => ({...prev, type: value as Activity['type']}))}>
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
                  <Input id="activity-date" type="datetime-local" value={newActivity.date.slice(0,16)} onChange={(e) => setNewActivity(prev => ({...prev, date: e.target.value}))} />
                </div>
              </div>

              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                <div className="space-y-2">
                    <Label htmlFor="livestock" className={cn(!!newActivity.livestockCategory && 'text-muted-foreground')}>
                        Affected Livestock
                    </Label>
                    <Combobox
                        options={livestockOptions}
                        value={newActivity.livestockId}
                        onChange={(value) => setNewActivity(prev => ({...prev, livestockId: value}))}
                        placeholder="Select an animal..."
                        emptyMessage="No animals found."
                        disabled={!!newActivity.livestockCategory}
                    />
                </div>
                <div className="relative text-center self-end pb-2">
                    <span className="bg-background px-2 text-sm text-muted-foreground">OR</span>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="livestock-category" className={cn(!!newActivity.livestockId && 'text-muted-foreground')}>
                        Affected Category
                    </Label>
                    <Select value={newActivity.livestockCategory} onValueChange={(value) => setNewActivity(prev => ({...prev, livestockCategory: value}))} disabled={!!newActivity.livestockId}>
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
              </div>
             
              <div className="space-y-2 mt-4">
                <Label htmlFor="activity-description">Description (Optional)</Label>
                <Textarea
                  id="activity-description"
                  placeholder="Describe the activity in detail..."
                  value={newActivity.description}
                  onChange={(e) => setNewActivity(prev => ({...prev, description: e.target.value}))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleLogActivity}>Save Activity</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Activity</DialogTitle>
            <DialogDescription>
              Update the details for this activity.
            </DialogDescription>
          </DialogHeader>
          {selectedActivity && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-activity-type">Activity Type</Label>
                  <Select 
                    value={selectedActivity.type} 
                    onValueChange={(value) => setSelectedActivity(prev => prev ? {...prev, type: value as Activity['type']} : null)}
                  >
                    <SelectTrigger id="edit-activity-type">
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
                  <Label htmlFor="edit-activity-date">Date</Label>
                  <Input 
                    id="edit-activity-date" 
                    type="datetime-local" 
                    value={new Date(selectedActivity.date).toISOString().slice(0,16)} 
                    onChange={(e) => setSelectedActivity(prev => prev ? {...prev, date: new Date(e.target.value).toISOString()} : null)} 
                  />
                </div>
              </div>
              {/* Other form fields for editing would go here */}
              <div className="space-y-2 mt-4">
                <Label htmlFor="edit-activity-description">Description</Label>
                <Textarea
                  id="edit-activity-description"
                  placeholder="Describe the activity in detail..."
                  value={selectedActivity.description}
                  onChange={(e) => setSelectedActivity(prev => prev ? {...prev, description: e.target.value} : null)}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateActivity}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this activity from your log.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
