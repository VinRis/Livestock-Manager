import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { activityLogData } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

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
  return (
    <>
      <PageHeader title="Farm Activity Log" description="A record of all recent activities on your farm.">
        <Button>
          <PlusCircle />
          Log Activity
        </Button>
      </PageHeader>
      <main className="flex-1 space-y-4 p-4 pt-2 sm:p-6 sm:pt-2">
        <Card>
          <CardHeader>
            <CardTitle>Activity Feed</CardTitle>
            <CardDescription>Chronological list of farm activities.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {activityLogData.map((activity) => (
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
