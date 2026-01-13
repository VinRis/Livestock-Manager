
"use client";

import { useState } from "react";
import { notFound, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Edit, PlusCircle } from "lucide-react";
import { getLivestockById, type HealthRecord, type ProductionMetric, type Livestock } from "@/lib/data";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/hooks/use-toast";

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
  const initialAnimal = getLivestockById(params.id);
  const { toast } = useToast();
  const router = useRouter();

  const [animal, setAnimal] = useState<Livestock | undefined>(initialAnimal);
  
  // Health Record State
  const [isHealthDialogOpen, setHealthDialogOpen] = useState(false);
  const [healthDate, setHealthDate] = useState(new Date().toISOString().split('T')[0]);
  const [healthEvent, setHealthEvent] = useState('');
  const [healthDescription, setHealthDescription] = useState('');

  // Production Metric State
  const [isMetricDialogOpen, setMetricDialogOpen] = useState(false);
  const [metricDate, setMetricDate] = useState(new Date().toISOString().split('T')[0]);
  const [metricType, setMetricType] = useState<'Milk' | 'Weight' | 'Breeding' | ''>('');
  const [metricValue, setMetricValue] = useState('');
  
  // Edit Profile State
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState(animal);


  if (!animal) {
    notFound();
  }

  const handleSaveHealthRecord = () => {
    if (!healthEvent || !healthDescription) {
        toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Please fill out all fields for the health record.",
        });
        return;
    }

    const newRecord: HealthRecord = {
      id: `hr-${Date.now()}`,
      date: healthDate,
      event: healthEvent,
      description: healthDescription,
    };

    setAnimal(prev => prev ? { ...prev, healthRecords: [newRecord, ...prev.healthRecords] } : undefined);
    
    toast({
        title: "Record Saved",
        description: "The new health record has been added.",
    });

    // Reset form and close dialog
    setHealthEvent('');
    setHealthDescription('');
    setHealthDate(new Date().toISOString().split('T')[0]);
    setHealthDialogOpen(false);
  };

  const handleSaveProductionMetric = () => {
    if (!metricType || !metricValue) {
        toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Please fill out all fields for the production metric.",
        });
        return;
    }
    const newMetric: ProductionMetric = {
      id: `pm-${Date.now()}`,
      date: metricDate,
      type: metricType as 'Milk' | 'Weight' | 'Breeding',
      value: metricValue,
    };

    setAnimal(prev => prev ? { ...prev, productionMetrics: [newMetric, ...prev.productionMetrics] } : undefined);
    
    toast({
        title: "Metric Saved",
        description: "The new production metric has been added.",
    });
    
    // Reset form and close dialog
    setMetricType('');
    setMetricValue('');
    setMetricDate(new Date().toISOString().split('T')[0]);
    setMetricDialogOpen(false);
  };
  
  const handleSaveProfile = () => {
    if (!editForm) return;

    setAnimal(editForm);
    toast({
      title: "Profile Saved",
      description: `${editForm.name}'s profile has been updated.`,
    });
    setEditDialogOpen(false);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editForm) return;
    const { id, value } = e.target;
    setEditForm({ ...editForm, [id]: value });
  };
  
  const age = calculateAge(animal.birthDate);
  const isFemaleRuminant = (animal.gender === 'Female' && ['Holstein', 'Angus', 'Boer', 'Merino'].includes(animal.breed));
  const statusOptions = ['Active', 'Sold', 'Deceased'];
  if (isFemaleRuminant) {
    statusOptions.push('Milking', 'Dry', 'Sick', 'In-Calf/Pregnant');
  }

  return (
    <>
      <PageHeader title={animal.name} description={`Tag ID: ${animal.tagId}`}>
         <Button variant="outline" onClick={() => router.back()}><ArrowLeft /> Back to List</Button>
         <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Edit />
                    Edit Profile
                </Button>
            </DialogTrigger>
             <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Profile for {animal.name}</DialogTitle>
                  <DialogDescription>
                    Update the details for this animal below.
                  </DialogDescription>
                </DialogHeader>
                {editForm && (
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" value={editForm.name} onChange={handleEditFormChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tagId">Tag ID</Label>
                      <Input id="tagId" value={editForm.tagId} onChange={handleEditFormChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="imageUrl">Image URL</Label>
                        <Input id="imageUrl" value={editForm.imageUrl} onChange={handleEditFormChange} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="breed">Breed</Label>
                            <Input id="breed" value={editForm.breed} onChange={handleEditFormChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="birthDate">Birth Date</Label>
                            <Input id="birthDate" type="date" value={editForm.birthDate} onChange={handleEditFormChange} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Select value={editForm.gender} onValueChange={(value) => setEditForm({ ...editForm, gender: value as 'Male' | 'Female' })}>
                                <SelectTrigger id="gender">
                                    <SelectValue placeholder="Select a gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={editForm.status} onValueChange={(value) => setEditForm({ ...editForm, status: value as any })}>
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="Select a status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusOptions.map(option => (
                                        <SelectItem key={option} value={option}>{option}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button onClick={handleSaveProfile}>Save Changes</Button>
                </DialogFooter>
             </DialogContent>
        </Dialog>
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
                    <Dialog open={isHealthDialogOpen} onOpenChange={setHealthDialogOpen}>
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
                            <Input id="health-date" type="date" value={healthDate} onChange={(e) => setHealthDate(e.target.value)} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="health-event">Event</Label>
                            <Input id="health-event" placeholder="e.g., Vaccination, Check-up" value={healthEvent} onChange={(e) => setHealthEvent(e.target.value)} />
                          </div>
                           <div className="space-y-2">
                            <Label htmlFor="health-description">Description / Details</Label>
                            <Textarea id="health-description" placeholder="Provide details about the event." value={healthDescription} onChange={(e) => setHealthDescription(e.target.value)} />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleSaveHealthRecord}>Save Record</Button>
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
                    <Dialog open={isMetricDialogOpen} onOpenChange={setMetricDialogOpen}>
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
                              <Input id="metric-date" type="date" value={metricDate} onChange={(e) => setMetricDate(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="metric-type">Type</Label>
                                <Select onValueChange={(value) => setMetricType(value as 'Milk' | 'Weight' | 'Breeding')}>
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
                              <Input id="metric-value" placeholder="e.g., 30L, 550kg" value={metricValue} onChange={(e) => setMetricValue(e.target.value)}/>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button onClick={handleSaveProductionMetric}>Save Metric</Button>
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

    