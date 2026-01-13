import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { tasksData, type Task } from "@/lib/data";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

const TaskItem = ({ task }: { task: Task }) => (
  <div className="flex items-center gap-3 rounded-lg p-3 hover:bg-accent">
    <Checkbox id={`task-${task.id}`} defaultChecked={task.completed} />
    <label htmlFor={`task-${task.id}`} className="flex-1 cursor-pointer">
      <p className="font-medium">{task.title}</p>
      <div className="flex items-center gap-2">
        <p className="text-sm text-muted-foreground">{new Date(task.dueDate).toLocaleDateString()}</p>
        <Badge variant="secondary">{task.category}</Badge>
      </div>
    </label>
  </div>
);

export default function TasksPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todaysTasks = tasksData.filter(task => {
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0,0,0,0);
    return dueDate.getTime() === today.getTime();
  });
  
  const upcomingTasks = tasksData.filter(task => new Date(task.dueDate) > today);
  const pastTasks = tasksData.filter(task => {
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0,0,0,0);
    return dueDate.getTime() < today.getTime();
  });
  
  return (
    <>
      <PageHeader title="Task Scheduler" description="Manage and track your farm tasks.">
        <Button>
          <PlusCircle />
          New Task
        </Button>
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
                  {todaysTasks.length > 0 ? todaysTasks.map(task => <TaskItem key={task.id} task={task} />) : <p className="text-muted-foreground text-center p-4">No tasks for today.</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="upcoming">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                   {upcomingTasks.length > 0 ? upcomingTasks.map(task => <TaskItem key={task.id} task={task} />) : <p className="text-muted-foreground text-center p-4">No upcoming tasks.</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="past">
            <Card>
              <CardContent className="pt-6">
                 <div className="space-y-2">
                   {pastTasks.length > 0 ? pastTasks.map(task => <TaskItem key={task.id} task={task} />) : <p className="text-muted-foreground text-center p-4">No past tasks.</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
