
"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { notFound, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Edit, PlusCircle, Upload, GitMerge, User, Users, LineChart, Weight, Cake } from "lucide-react";
import { getLivestockById, type HealthRecord, type ProductionMetric, type Livestock, livestockData, updateLivestock } from "@/lib/data";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { cn } from "@/lib/utils";

function calculateAge(birthDate: string) {
  const birth = new Date(birthDate);
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  if (months < 0) {
    years--;
    months += 12;
  }
  return { years, months, text: `${years} years, ${months} months` };
}

export default function LivestockDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const [animal, setAnimal] = useState<Livestock | undefined>(() => getLivestockById(params.id));
  
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
  const [editForm, setEditForm] = useState<Livestock | undefined>(animal);

  // Re-fetch animal data if params.id changes
  useEffect(() => {
    const currentAnimal = getLivestockById(params.id);
    setAnimal(currentAnimal);
    setEditForm(currentAnimal);
  }, [params.id]);

  const sire = useMemo(() => animal?.sireId ? getLivestockById(animal.sireId) : undefined, [animal]);
  const dam = useMemo(() => animal?.damId ? getLivestockById(animal.damId) : undefined, [animal]);
  const offspring = useMemo(() => livestockData.filter(a => a.sireId === animal?.id || a.damId === animal?.id), [animal]);

  if (!animal) {
    return notFound();
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
    
    if (animal) {
        const updatedAnimal = { ...animal, healthRecords: [newRecord, ...animal.healthRecords] };
        updateLivestock(updatedAnimal);
        setAnimal(updatedAnimal);
    }
    
    toast({
        title: "Record Saved",
        description: "The new health record has been added.",
    });

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

    if (animal) {
        const updatedAnimal = { ...animal, productionMetrics: [newMetric, ...animal.productionMetrics] };
        updateLivestock(updatedAnimal);
        setAnimal(updatedAnimal);
    }
    
    toast({
        title: "Metric Saved",
        description: "The new production metric has been added.",
    });
    
    setMetricType('');
    setMetricValue('');
    setMetricDate(new Date().toISOString().split('T')[0]);
    setMetricDialogOpen(false);
  };
  
  const handleSaveProfile = () => {
    if (!editForm) return;

    updateLivestock(editForm);
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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editForm) return;
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm({ ...editForm, imageUrl: reader.result as string, imageHint: file.name });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const age = calculateAge(animal.birthDate);
  const isFemaleRuminant = (animal.gender === 'Female' && ['Holstein', 'Angus', 'Boer', 'Merino'].includes(animal.breed));
  const statusOptions = ['Active', 'Sold', 'Deceased'];
  if (isFemaleRuminant) {
    statusOptions.push('Milking', 'Dry', 'Sick', 'In-Calf/Pregnant');
  }

  const lastWeightMetric = animal.productionMetrics.find(m => m.type === 'Weight');
  
  const LineageNode = ({ animal, role }: { animal?: Livestock, role: string }) => (
    <div className="flex items-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        {animal ? (
          <Link href={`/livestock/${animal.id}`}>
            <Image
              src={animal.imageUrl}
              alt={animal.name}
              width={48}
              height={48}
              className="h-12 w-12 rounded-full object-cover"
              data-ai-hint={animal.imageHint}
            />
          </Link>
        ) : (
          <User className="h-6 w-6 text-muted-foreground" />
        )}
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{role}</p>
        {animal ? (
           <Link href={`/livestock/${animal.id}`} className="font-semibold text-primary hover:underline">{animal.name}</Link>
        ) : (
          <p className="font-semibold">Not Recorded</p>
        )}
      </div>
    </div>
  );

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
                      <Label htmlFor="animal-image">Animal Image</Label>
                      <div className="flex items-center gap-4">
                        <Image
                          src={editForm.imageUrl}
                          alt={editForm.name}
                          width={128}
                          height={128}
                          className="h-32 w-32 rounded-lg border object-cover"
                          data-ai-hint={editForm.imageHint}
                        />
                        <div className="flex-1">
                          <Input id="animal-image" type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageSelect} />
                          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Image
                          </Button>
                          <p className="text-xs text-muted-foreground mt-2">PNG, JPG, GIF up to 10MB.</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" value={editForm.name} onChange={handleEditFormChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tagId">Tag ID</Label>
                      <Input id="tagId" value={editForm.tagId} onChange={handleEditFormChange} />
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
                            <Select value={editForm.gender} onValueChange={(value) => editForm && setEditForm({ ...editForm, gender: value as 'Male' | 'Female' })}>
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
                            <Select value={editForm.status} onValueChange={(value) => editForm && setEditForm({ ...editForm, status: value as any })}>
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
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-6">
            <Card className="overflow-hidden">
              <Image
                src={animal.imageUrl}
                alt={animal.name}
                width={600}
                height={400}
                className="w-full object-cover aspect-[3/2]"
                data-ai-hint={animal.imageHint}
              />
              <CardContent className="p-4">
                <h2 className="text-2xl font-bold font-headline">{animal.name}</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                    <Badge>{animal.breed}</Badge>
                    <Badge variant="secondary">{animal.gender}</Badge>
                    <Badge variant={['Active', 'Milking'].includes(animal.status) ? 'default' : 'outline'}>
                      {animal.status}
                    </Badge>
                  </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Age</CardTitle>
                  <Cake className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{age.years}<span className="text-base font-normal text-muted-foreground">y</span> {age.months}<span className="text-base font-normal text-muted-foreground">m</span></div>
                  <p className="text-xs text-muted-foreground">Born on {new Date(animal.birthDate).toLocaleDateString()}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Weight</CardTitle>
                  <Weight className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{lastWeightMetric ? lastWeightMetric.value : 'N/A'}</div>
                   <p className="text-xs text-muted-foreground">{lastWeightMetric ? `as of ${new Date(lastWeightMetric.date).toLocaleDateString()}`: 'No weight recorded'}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="lg:col-span-2">
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
                         {animal.healthRecords.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center text-muted-foreground py-8">No health records found.</TableCell>
                            </TableRow>
                        )}
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
                        {animal.productionMetrics.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center text-muted-foreground py-8">No production metrics found.</TableCell>
                            </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="lineage">
                 <Card>
                  <CardHeader>
                    <CardTitle>Lineage</CardTitle>
                    <CardDescription>Family tree of {animal.name}.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                        <h3 className="mb-4 text-lg font-semibold flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> Parents</h3>
                        <div className="flex items-center justify-around relative">
                           <div className="flex-1 flex justify-center">
                                <LineageNode animal={sire} role="Sire" />
                           </div>
                           <div className="flex-1 flex justify-center">
                                <LineageNode animal={dam} role="Dam" />
                           </div>
                           <div className="absolute top-6 left-0 w-full h-px bg-border -z-10"></div>
                           <div className="absolute top-6 left-1/2 w-px h-8 -translate-x-1/2 -translate-y-full bg-border -z-10"></div>
                        </div>
                    </div>
                    
                    <div className="flex justify-center items-center my-4">
                        <div className="relative">
                            <div className="absolute bottom-full left-1/2 w-px h-8 -translate-x-1/2 bg-border -z-10"></div>
                            <div className="flex items-center gap-4 rounded-lg border p-3 bg-card shadow-sm">
                                <Image
                                  src={animal.imageUrl}
                                  alt={animal.name}
                                  width={48}
                                  height={48}
                                  className="h-12 w-12 rounded-full object-cover"
                                  data-ai-hint={animal.imageHint}
                                />
                               <div>
                                  <p className="text-sm text-muted-foreground">Current Animal</p>
                                  <p className="font-bold text-primary text-lg">{animal.name}</p>
                               </div>
                            </div>
                           {offspring.length > 0 && <div className="absolute top-full left-1/2 w-px h-8 -translate-x-1/2 bg-border -z-10"></div>}
                        </div>
                    </div>

                    {offspring.length > 0 && (
                        <div>
                            <h3 className="mb-4 text-lg font-semibold flex items-center gap-2"><GitMerge className="h-5 w-5 text-primary" /> Offspring</h3>
                             <div className="relative">
                                {offspring.length > 1 && <div className="absolute top-8 left-1/4 w-1/2 h-px -translate-y-1/2 bg-border -z-10"></div>}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 pt-8">
                                    {offspring.map(child => (
                                         <div key={child.id} className="flex justify-center relative">
                                            <div className="absolute bottom-full left-1/2 w-px h-8 -translate-x-1/2 bg-border -z-10"></div>
                                            <LineageNode animal={child} role="Offspring" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
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
