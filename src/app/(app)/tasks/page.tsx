
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { tasksData as initialTasksData, type Task, livestockData } from "@/lib/data";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Combobox } from "@/components/ui/combobox";
import { cn } from "@/lib/utils";

const ClientFormattedDate = ({ date }: { date: string }) => {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    setFormattedDate(new Date(date).toLocaleDateString());
  }, [date]);

  // Render a placeholder on the server and during the initial client render
  if (!formattedDate) {
    return <span className="text-sm text-muted-foreground">Loading date...</span>;
  }

  return <p className="text-sm text-muted-foreground">{formattedDate}</p>;
};

const TaskItem = ({ task, onToggle }: { task: Task; onToggle: (id: string, completed: boolean) => void }) => (
  <div className="flex items-start gap-3 rounded-lg p-3 hover:bg-accent">
    <Checkbox id={`task-${task.id}`} checked={task.completed} onCheckedChange={(checked) => onToggle(task.id, !!checked)} className="mt-1" />
    <label htmlFor={`task-${task.id}`} className="flex-1 cursor-pointer">
      <p className="font-medium">{task.title}</p>
      <div className="flex items-center gap-2 flex-wrap">
        <ClientFormattedDate date={task.dueDate} />
        <Badge variant="secondary">{task.category}</Badge>
        {task.livestockId && task.livestockName && (
            <Button variant="link" size="sm" className="h-auto p-0" asChild>
                <Link href={`/livestock/${task.livestockId}`} className="text-xs">
                    <LinkIcon className="mr-1 h-3 w-3"/>
                    {task.livestockName}
                </Link>
            </Button>
        )}
        {task.livestockCategory && !task.livestockId && (
            <Button variant="link" size="sm" className="h-auto p-0" asChild>
                <Link href={`/livestock?category=${task.livestockCategory.toLowerCase()}`} className="text-xs">
                    <LinkIcon className="mr-1 h-3 w-3"/>
                    {task.livestockCategory}
                </Link>
            </Button>
        )}
      </div>
    </label>
  </div>
);

export default function TasksPage() {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>(initialTasksData);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    dueDate: new Date().toISOString().split('T')[0],
    category: '' as Task['category'] | '',
    livestockId: '',
    livestockCategory: ''
  });

  const handleToggleTask = (taskId: string, completed: boolean) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed } : task
      )
    );
  };

  const handleAddTask = () => {
    if (!newTask.title || !newTask.dueDate || !newTask.category) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill out all fields to add a new task.",
      });
      return;
    }

    const selectedAnimal = livestockData.find(animal => animal.id === newTask.livestockId);

    const taskToAdd: Task = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      dueDate: newTask.dueDate,
      category: newTask.category as Task['category'],
      completed: false,
      livestockId: selectedAnimal?.id,
      livestockName: selectedAnimal?.name,
      livestockCategory: newTask.livestockCategory,
    };

    setTasks(prevTasks => [taskToAdd, ...prevTasks].sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()));

    toast({
      title: "Task Added",
      description: "The new task has been added to your schedule.",
    });

    setNewTask({
      title: '',
      dueDate: new Date().toISOString().split('T')[0],
      category: '',
      livestockId: '',
      livestockCategory: ''
    });
    setAddDialogOpen(false);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todaysTasks = tasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0,0,0,0);
    return dueDate.getTime() === today.getTime();
  });
  
  const upcomingTasks = tasks.filter(task => {
     const dueDate = new Date(task.dueDate);
     dueDate.setHours(0,0,0,0);
     return dueDate.getTime() > today.getTime();
  });

  const pastTasks = tasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0,0,0,0);
    return dueDate.getTime() < today.getTime();
  });

  const taskCategories: Task['category'][] = ['Health', 'Feeding', 'Maintenance', 'Admin'];
  const livestockOptions = livestockData.map(animal => ({ value: animal.id, label: `${animal.name} (${animal.tagId})`}));
  const categoryOptions = Array.from(new Set(livestockData.map(animal => animal.category)));

  
  return (
    <>
      <PageHeader title="Task Scheduler" description="Manage and track your farm tasks.">
        <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Schedule a New Task</DialogTitle>
              <DialogDescription>
                Add a new task to your farm's to-do list.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="task-title">Title</Label>
                <Input
                  id="task-title"
                  placeholder="e.g., Vaccinate the calves"
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({...prev, title: e.target.value}))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="task-duedate">Due Date</Label>
                  <Input
                    id="task-duedate"
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask(prev => ({...prev, dueDate: e.target.value}))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="task-category">Category</Label>
                  <Select value={newTask.category} onValueChange={(value) => setNewTask(prev => ({...prev, category: value as Task['category']}))}>
                    <SelectTrigger id="task-category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {taskCategories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
               <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 pt-4">
                <div className="space-y-2">
                    <Label htmlFor="livestock" className={cn(!!newTask.livestockCategory && 'text-muted-foreground')}>
                        Affected Livestock (Optional)
                    </Label>
                    <Combobox
                        options={livestockOptions}
                        value={newTask.livestockId}
                        onChange={(value) => setNewTask(prev => ({...prev, livestockId: value}))}
                        placeholder="Select an animal..."
                        emptyMessage="No animals found."
                        disabled={!!newTask.livestockCategory}
                    />
                </div>
                <div className="relative text-center self-end pb-2">
                    <span className="bg-background px-2 text-sm text-muted-foreground">OR</span>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="livestock-category" className={cn(!!newTask.livestockId && 'text-muted-foreground')}>
                        Affected Category (Optional)
                    </Label>
                    <Select value={newTask.livestockCategory} onValueChange={(value) => setNewTask(prev => ({...prev, livestockCategory: value}))} disabled={!!newTask.livestockId}>
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
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddTask}>Save Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>
      <main className="flex-1 space-y-4 p-4 pt-2 sm:p-6 sm:pt-2">
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          <TabsContent value="today">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  {todaysTasks.length > 0 ? todaysTasks.map(task => <TaskItem key={task.id} task={task} onToggle={handleToggleTask} />) : <p className="text-muted-foreground text-center p-4">No tasks for today.</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="upcoming">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                   {upcomingTasks.length > 0 ? upcomingTasks.map(task => <TaskItem key={task.id} task={task} onToggle={handleToggleTask} />) : <p className="text-muted-foreground text-center p-4">No upcoming tasks.</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="past">
            <Card>
              <CardContent className="pt-6">
                 <div className="space-y-2">
                   {pastTasks.length > 0 ? pastTasks.map(task => <TaskItem key={task.id} task={task} onToggle={handleToggleTask} />) : <p className="text-muted-foreground text-center p-4">No past tasks.</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
