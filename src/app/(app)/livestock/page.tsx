import Link from "next/link";
import Image from "next/image";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { livestockData } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

export default function LivestockPage() {
  return (
    <>
      <PageHeader title="Livestock" description="Manage your herd and individual animal profiles.">
        <Button>
          <PlusCircle />
          Add Animal
        </Button>
      </PageHeader>
      <main className="flex-1 space-y-4 p-4 pt-2 sm:p-6 sm:pt-2">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {livestockData.map((animal) => (
            <Card key={animal.id} className="overflow-hidden">
              <Link href={`/livestock/${animal.id}`}>
                <div className="aspect-w-4 aspect-h-3">
                  <Image
                    src={animal.imageUrl}
                    alt={animal.name}
                    width={600}
                    height={400}
                    className="object-cover"
                    data-ai-hint={animal.imageHint}
                  />
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {animal.name}
                    <Badge variant={animal.status === 'Active' ? 'default' : 'secondary'}>{animal.status}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {animal.breed} &bull; {animal.tagId}
                  </p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
