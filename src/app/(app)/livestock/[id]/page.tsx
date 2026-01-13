
"use client";

import { notFound } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Edit, PlusCircle } from "lucide-react";
import { getLivestockById, type HealthRecord, type ProductionMetric } from "@/lib/data";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

function calculateAge(birthDate: string) {
  const birth = new Date(birthDate);
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  if (months < 0) {
    years--;
    months += 12;
  }
  return `${years} years, ${months} months`;
}

export default function LivestockDetailPage({ params }: { params: { id: string } }) {
  const animal = getLivestockById(params.id);

  if (!animal) {
    notFound();
  }
  
  const age = calculateAge(animal.birthDate);

  return (
    <>
      <PageHeader title={animal.name} description={`Tag ID: ${animal.tagId}`}>
         <Button variant="outline" asChild>
          <Link href="/livestock"><ArrowLeft /> Back to List</Link>
        </Button>
        <Button>
          <Edit />
          Edit Profile
        </Button>
      </PageHeader>
      <main className="flex-1 space-y-4 p-4 pt-2 sm:p-6 sm:pt-2">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <Image
                  src={animal.imageUrl}
                  alt={animal.name}
                  width={600}
                  height={400}
                  className="rounded-lg object-cover"
                  data-ai-hint={animal.imageHint}
                />
                <div className="mt-4 space-y-2">
                  <h2 className="text-2xl font-bold font-headline">{animal.name}</h2>
                  <div className="flex flex-wrap gap-2">
                    <Badge>{animal.breed}</Badge>
                    <Badge variant="secondary">{animal.gender}</Badge>
                    <Badge variant="secondary">{age}</Badge>
                    <Badge variant={animal.status === 'Active' ? 'default' : 'secondary'}>
                      {animal.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Tabs defaultValue="health">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="health">Health Records</TabsTrigger>
                <TabsTrigger value="production">Production</TabsTrigger>
                <TabsTrigger value="lineage">Lineage</TabsTrigger>
              </TabsList>
              <TabsContent value="health">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Health History</CardTitle>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline"><PlusCircle className="mr-2 h-4 w-4"/>Add Record</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Health Record</DialogTitle>
                          <DialogDescription>
                            Log a new health event for {animal.name}.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="health-date">Date</Label>
                            <Input id="health-date" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="health-event">Event</Label>
                            <Input id="health-event" placeholder="e.g., Vaccination, Check-up" />
                          </div>
                           <div className="space-y-2">
                            <Label htmlFor="health-description">Description / Details</Label>
                            <Textarea id="health-description" placeholder="Provide details about the event." />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button>Save Record</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Event</TableHead>
                          <TableHead>Details</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {animal.healthRecords.map((record: HealthRecord) => (
                          <TableRow key={record.id}>
                            <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                            <TableCell>{record.event}</TableCell>
                            <TableCell>{record.description}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="production">
                 <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Production Metrics</CardTitle>
                    <Dialog>
                       <DialogTrigger asChild>
                         <Button size="sm" variant="outline"><PlusCircle className="mr-2 h-4 w-4"/>Add Metric</Button>
                       </DialogTrigger>
                       <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Production Metric</DialogTitle>
                            <DialogDescription>
                              Log a new production metric for {animal.name}.
                            </DialogDescription>
                          </DialogHeader>
                           <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="metric-date">Date</Label>
                              <Input id="metric-date" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="metric-type">Type</Label>
                                <Select>
                                    <SelectTrigger id="metric-type">
                                        <SelectValue placeholder="Select a metric type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Milk">Milk</SelectItem>
                                        <SelectItem value="Weight">Weight</SelectItem>
                                        <SelectItem value="Breeding">Breeding</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="space-y-2">
                              <Label htmlFor="metric-value">Value</Label>
                              <Input id="metric-value" placeholder="e.g., 30L, 550kg" />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button>Save Metric</Button>
                          </DialogFooter>
                       </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                     <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Value</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {animal.productionMetrics.map((metric: ProductionMetric) => (
                          <TableRow key={metric.id}>
                            <TableCell>{new Date(metric.date).toLocaleDateString()}</TableCell>
                            <TableCell>{metric.type}</TableCell>
                            <TableCell>{metric.value}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="lineage">
                 <Card>
                  <CardHeader>
                    <CardTitle>Lineage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Lineage tracking is not yet implemented.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </>
  );
}

    