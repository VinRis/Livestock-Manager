

"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { notFound, useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Edit, PlusCircle, Upload, GitMerge, User, Users, LineChart, Weight, Cake, MoreVertical, Trash2, Box, CalendarDays, DollarSign } from "lucide-react";
import { getLivestockById, type HealthRecord, type ProductionMetric, type Livestock, financialData as initialFinancialData } from "@/lib/data";
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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

function IndividualAnimalProfile({ initialAnimal, onUpdate, allLivestock }: { initialAnimal: Livestock, onUpdate: (updatedAnimal: Livestock) => void, allLivestock: Livestock[] }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const [animal, setAnimal] = useState<Livestock>(initialAnimal);
  
  // Health Record State
  const [isHealthDialogOpen, setHealthDialogOpen] = useState(false);
  const [healthDate, setHealthDate] = useState(new Date().toISOString().split('T')[0]);
  const [healthEvent, setHealthEvent] = useState('');
  const [healthDescription, setHealthDescription] = useState('');
  const [isEditHealthDialogOpen, setEditHealthDialogOpen] = useState(false);
  const [editingHealthRecord, setEditingHealthRecord] = useState<HealthRecord | null>(null);

  // Production Metric State
  const [isMetricDialogOpen, setMetricDialogOpen] = useState(false);
  const [metricDate, setMetricDate] = useState(new Date().toISOString().split('T')[0]);
  const [metricType, setMetricType] = useState<'Milk' | 'Weight' | 'Breeding' | ''>('');
  const [metricValue, setMetricValue] = useState('');
  
  // Edit Profile State
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<Livestock>(animal);
  
  // Edit Metric State
  const [isEditMetricDialogOpen, setEditMetricDialogOpen] = useState(false);
  const [editingMetric, setEditingMetric] = useState<ProductionMetric | null>(null);


  // Re-fetch animal data if params.id changes
  useEffect(() => {
    setAnimal(initialAnimal);
    setEditForm(initialAnimal);
  }, [initialAnimal]);

  const sire = useMemo(() => animal?.sireId ? allLivestock.find(a => a.id === animal.sireId) : undefined, [animal, allLivestock]);
  const dam = useMemo(() => animal?.damId ? allLivestock.find(a => a.id === animal.damId) : undefined, [animal, allLivestock]);
  const offspring = useMemo(() => allLivestock.filter(a => a.sireId === animal?.id || a.damId === animal?.id), [animal, allLivestock]);

  if (!animal) {
    return notFound();
  }
  
  const handleUpdate = (updatedAnimal: Livestock) => {
    onUpdate(updatedAnimal);
    setAnimal(updatedAnimal);
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
    
    const updatedAnimal = { ...animal, healthRecords: [newRecord, ...animal.healthRecords] };
    handleUpdate(updatedAnimal);
    
    toast({
        title: "Record Saved",
        description: "The new health record has been added.",
    });

    setHealthEvent('');
    setHealthDescription('');
    setHealthDate(new Date().toISOString().split('T')[0]);
    setHealthDialogOpen(false);
  };
  
  const handleEditHealthRecord = (record: HealthRecord) => {
    setEditingHealthRecord(record);
    setEditHealthDialogOpen(true);
  };

  const handleUpdateHealthRecord = () => {
    if (!editingHealthRecord || !animal) return;

    const updatedHealthRecords = animal.healthRecords.map(r =>
      r.id === editingHealthRecord.id ? editingHealthRecord : r
    );
    const updatedAnimal = { ...animal, healthRecords: updatedHealthRecords };
    handleUpdate(updatedAnimal);

    toast({
      title: "Health Record Updated",
      description: "The health record has been successfully updated.",
    });

    setEditingHealthRecord(null);
    setEditHealthDialogOpen(false);
  };

  const handleDeleteHealthRecord = (recordId: string) => {
    if (!animal) return;

    const updatedHealthRecords = animal.healthRecords.filter(r => r.id !== recordId);
    const updatedAnimal = { ...animal, healthRecords: updatedHealthRecords };
    handleUpdate(updatedAnimal);

    toast({
      variant: "destructive",
      title: "Health Record Deleted",
      description: "The health record has been removed.",
    });
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

    const updatedAnimal = { ...animal, productionMetrics: [newMetric, ...animal.productionMetrics] };
    handleUpdate(updatedAnimal);
    
    toast({
        title: "Metric Saved",
        description: "The new production metric has been added.",
    });
    
    setMetricType('');
    setMetricValue('');
    setMetricDate(new Date().toISOString().split('T')[0]);
    setMetricDialogOpen(false);
  };

  const handleEditMetric = (metric: ProductionMetric) => {
    setEditingMetric(metric);
    setEditMetricDialogOpen(true);
  };
  
  const handleUpdateProductionMetric = () => {
      if (!editingMetric || !animal) return;

      const updatedMetrics = animal.productionMetrics.map(m =>
          m.id === editingMetric.id ? editingMetric : m
      );
      const updatedAnimal = { ...animal, productionMetrics: updatedMetrics };
      handleUpdate(updatedAnimal);

      toast({
          title: "Metric Updated",
          description: "The production metric has been updated.",
      });

      setEditingMetric(null);
      setEditMetricDialogOpen(false);
  };
  
  const handleDeleteMetric = (metricId: string) => {
      if (!animal) return;

      const updatedMetrics = animal.productionMetrics.filter(m => m.id !== metricId);
      const updatedAnimal = { ...animal, productionMetrics: updatedMetrics };
      handleUpdate(updatedAnimal);

      toast({
          variant: "destructive",
          title: "Metric Deleted",
          description: "The production metric has been removed.",
      });
  };
  
  const handleSaveProfile = () => {
    if (!editForm) return;

    const finalForm = {
        ...editForm,
        sireId: editForm.sireId === 'unknown' ? undefined : editForm.sireId,
        damId: editForm.damId === 'unknown' ? undefined : editForm.damId,
    };

    handleUpdate(finalForm);
    
    toast({
      title: "Profile Saved",
      description: `${finalForm.name}'s profile has been updated.`,
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
      <PageHeader title={animal.name}>
         <Button variant="outline" onClick={() => router.back()}><ArrowLeft /> Back</Button>
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
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="sireId">Sire (Father)</Label>
                            <Select value={editForm.sireId || 'unknown'} onValueChange={(value) => editForm && setEditForm({ ...editForm, sireId: value })}>
                                <SelectTrigger id="sireId">
                                    <SelectValue placeholder="Select Sire" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="unknown">Unknown</SelectItem>
                                    {allLivestock.filter(a => a.gender === 'Male' && a.id !== animal.id).map(male => (
                                        <SelectItem key={male.id} value={male.id}>{male.name} ({male.tagId})</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="damId">Dam (Mother)</Label>
                             <Select value={editForm.damId || 'unknown'} onValueChange={(value) => editForm && setEditForm({ ...editForm, damId: value })}>
                                <SelectTrigger id="damId">
                                    <SelectValue placeholder="Select Dam" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="unknown">Unknown</SelectItem>
                                    {allLivestock.filter(a => a.gender === 'Female' && a.id !== animal.id).map(female => (
                                        <SelectItem key={female.id} value={female.id}>{female.name} ({female.tagId})</SelectItem>
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
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-4">
            <Card className="overflow-hidden">
              <Image
                src={animal.imageUrl}
                alt={animal.name}
                width={600}
                height={400}
                className="w-full object-cover aspect-[4/3]"
                data-ai-hint={animal.imageHint}
              />
              <CardContent className="p-3">
                <h2 className="text-xl font-bold font-headline">{animal.name}</h2>
                <p className="text-sm text-muted-foreground">Tag ID: {animal.tagId}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                    <Badge>{animal.breed}</Badge>
                    <Badge variant="secondary">{animal.gender}</Badge>
                    <Badge variant={['Active', 'Milking'].includes(animal.status) ? 'default' : 'outline'}>
                      {animal.status}
                    </Badge>
                  </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="p-3 pb-2">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    <span>Age</span>
                    <Cake className="h-4 w-4 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="text-xl font-bold">{age.years}<span className="text-sm font-normal text-muted-foreground">y</span> {age.months}<span className="text-sm font-normal text-muted-foreground">m</span></div>
                  <p className="text-xs text-muted-foreground">Born {new Date(animal.birthDate).toLocaleDateString()}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-3 pb-2">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    <span>Weight</span>
                    <Weight className="h-4 w-4 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="text-xl font-bold">{lastWeightMetric ? lastWeightMetric.value : 'N/A'}</div>
                   <p className="text-xs text-muted-foreground">{lastWeightMetric ? `on ${new Date(lastWeightMetric.date).toLocaleDateString()}`: 'No record'}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <Tabs defaultValue="health" className="w-full">
                <CardHeader className="p-2 sm:p-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="health">Health</TabsTrigger>
                    <TabsTrigger value="production">Production</TabsTrigger>
                    <TabsTrigger value="lineage">Lineage</TabsTrigger>
                  </TabsList>
                </CardHeader>
                <TabsContent value="health" className="p-0">
                  <CardHeader className="flex flex-row items-center justify-between px-4 pb-2">
                    <CardTitle className="text-base">Health History</CardTitle>
                    <Dialog open={isHealthDialogOpen} onOpenChange={setHealthDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline"><PlusCircle className="mr-2 h-4 w-4"/>Add</Button>
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
                  <CardContent className="px-4">
                    {/* Desktop Table */}
                    <div className="hidden sm:block">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Event</TableHead>
                            <TableHead>Details</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {animal.healthRecords.map((record: HealthRecord) => (
                            <TableRow key={record.id}>
                              <TableCell className="min-w-[100px]">{new Date(record.date).toLocaleDateString()}</TableCell>
                              <TableCell>{record.event}</TableCell>
                              <TableCell>{record.description}</TableCell>
                              <TableCell className="text-right">
                                  <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="icon" className="h-8 w-8">
                                              <MoreVertical className="h-4 w-4" />
                                          </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                          <DropdownMenuItem onClick={() => handleEditHealthRecord(record)}>
                                              <Edit className="mr-2 h-4 w-4"/>Edit
                                          </DropdownMenuItem>
                                          <DropdownMenuItem onClick={() => handleDeleteHealthRecord(record.id)} className="text-destructive">
                                              <Trash2 className="mr-2 h-4 w-4"/>Delete
                                          </DropdownMenuItem>
                                      </DropdownMenuContent>
                                  </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    {/* Mobile Card List */}
                    <div className="block sm:hidden space-y-3">
                        {animal.healthRecords.map((record) => (
                            <Card key={record.id}>
                                <CardContent className="p-4 flex justify-between items-start">
                                    <div className="flex-1 space-y-2">
                                        <p className="font-semibold">{record.event}</p>
                                        <p className="text-sm text-muted-foreground">{record.description}</p>
                                        <p className="text-xs text-muted-foreground pt-1">{new Date(record.date).toLocaleDateString()}</p>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 -mt-2 -mr-2">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleEditHealthRecord(record)}>
                                                <Edit className="mr-2 h-4 w-4"/>Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDeleteHealthRecord(record.id)} className="text-destructive">
                                                <Trash2 className="mr-2 h-4 w-4"/>Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                     {animal.healthRecords.length === 0 && (
                          <div className="text-center text-muted-foreground py-8">No health records found.</div>
                      )}
                  </CardContent>
                </TabsContent>
                <TabsContent value="production" className="p-0">
                  <CardHeader className="flex flex-row items-center justify-between px-4 pb-2">
                    <CardTitle className="text-base">Production Metrics</CardTitle>
                    <Dialog open={isMetricDialogOpen} onOpenChange={setMetricDialogOpen}>
                       <DialogTrigger asChild>
                         <Button size="sm" variant="outline"><PlusCircle className="mr-2 h-4 w-4"/>Add</Button>
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
                  <CardContent className="px-4">
                      {/* Desktop Table */}
                      <div className="hidden sm:block">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Value</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {animal.productionMetrics.map((metric: ProductionMetric) => (
                              <TableRow key={metric.id}>
                                <TableCell className="min-w-[100px]">{new Date(metric.date).toLocaleDateString()}</TableCell>
                                <TableCell>{metric.type}</TableCell>
                                <TableCell>{metric.value}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleEditMetric(metric)}>
                                                <Edit className="mr-2 h-4 w-4"/>Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDeleteMetric(metric.id)} className="text-destructive">
                                                <Trash2 className="mr-2 h-4 w-4"/>Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      {/* Mobile Card List */}
                      <div className="block sm:hidden space-y-3">
                          {animal.productionMetrics.map((metric) => (
                              <Card key={metric.id}>
                                  <CardContent className="p-4 flex justify-between items-start">
                                      <div className="flex-1 space-y-2">
                                          <p className="font-semibold">{metric.type}: <span className="font-bold text-primary">{metric.value}</span></p>
                                          <p className="text-xs text-muted-foreground pt-1">{new Date(metric.date).toLocaleDateString()}</p>
                                      </div>
                                      <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                              <Button variant="ghost" size="icon" className="h-8 w-8 -mt-2 -mr-2">
                                                  <MoreVertical className="h-4 w-4" />
                                              </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end">
                                              <DropdownMenuItem onClick={() => handleEditMetric(metric)}>
                                                  <Edit className="mr-2 h-4 w-4"/>Edit
                                              </DropdownMenuItem>
                                              <DropdownMenuItem onClick={() => handleDeleteMetric(metric.id)} className="text-destructive">
                                                  <Trash2 className="mr-2 h-4 w-4"/>Delete
                                              </DropdownMenuItem>
                                          </DropdownMenuContent>
                                      </DropdownMenu>
                                  </CardContent>
                              </Card>
                          ))}
                      </div>
                      {animal.productionMetrics.length === 0 && (
                           <div className="text-center text-muted-foreground py-8">No production metrics found.</div>
                      )}
                  </CardContent>
                </TabsContent>
                <TabsContent value="lineage" className="p-0">
                  <CardHeader className="px-4 pb-2">
                    <CardTitle className="text-base">Lineage</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 px-4">
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> Parents</h3>
                        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:gap-8">
                           <LineageNode animal={sire} role="Sire" />
                           <LineageNode animal={dam} role="Dam" />
                        </div>
                    </div>
                    
                     <div className="flex flex-col items-center space-y-4">
                        <div className="flex items-center gap-4 rounded-lg border p-2 bg-card shadow-sm">
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
                    </div>

                    {offspring.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold flex items-center gap-2"><GitMerge className="h-4 w-4 text-primary" /> Offspring</h3>
                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4">
                                {offspring.map(child => (
                                     <div key={child.id} className="flex justify-start">
                                        <LineageNode animal={child} role="Offspring" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                  </CardContent>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </main>

        <Dialog open={isEditMetricDialogOpen} onOpenChange={setEditMetricDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Production Metric</DialogTitle>
                </DialogHeader>
                {editingMetric && (
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-metric-date">Date</Label>
                            <Input
                                id="edit-metric-date"
                                type="date"
                                value={editingMetric.date}
                                onChange={(e) => setEditingMetric({ ...editingMetric, date: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-metric-type">Type</Label>
                            <Select
                                value={editingMetric.type}
                                onValueChange={(value) =>
                                    setEditingMetric({ ...editingMetric, type: value as 'Milk' | 'Weight' | 'Breeding' })
                                }
                            >
                                <SelectTrigger id="edit-metric-type">
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
                            <Label htmlFor="edit-metric-value">Value</Label>
                            <Input
                                id="edit-metric-value"
                                value={editingMetric.value}
                                onChange={(e) => setEditingMetric({ ...editingMetric, value: e.target.value })}
                            />
                        </div>
                    </div>
                )}
                <DialogFooter>
                    <Button variant="outline" onClick={() => { setEditMetricDialogOpen(false); setEditingMetric(null); }}>Cancel</Button>
                    <Button onClick={handleUpdateProductionMetric}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <Dialog open={isEditHealthDialogOpen} onOpenChange={setEditHealthDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Health Record</DialogTitle>
                </DialogHeader>
                {editingHealthRecord && (
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-health-date">Date</Label>
                            <Input
                                id="edit-health-date"
                                type="date"
                                value={editingHealthRecord.date}
                                onChange={(e) => setEditingHealthRecord({ ...editingHealthRecord, date: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-health-event">Event</Label>
                            <Input
                                id="edit-health-event"
                                value={editingHealthRecord.event}
                                onChange={(e) => setEditingHealthRecord({ ...editingHealthRecord, event: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-health-description">Description</Label>
                            <Textarea
                                id="edit-health-description"
                                value={editingHealthRecord.description}
                                onChange={(e) => setEditingHealthRecord({ ...editingHealthRecord, description: e.target.value })}
                            />
                        </div>
                    </div>
                )}
                <DialogFooter>
                    <Button variant="outline" onClick={() => { setEditHealthDialogOpen(false); setEditingHealthRecord(null); }}>Cancel</Button>
                    <Button onClick={handleUpdateHealthRecord}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
  );
}

function BatchProfile({ initialAnimal, onUpdate, allLivestock, onFinancialUpdate }: { initialAnimal: Livestock, onUpdate: (updatedAnimal: Livestock) => void, allLivestock: Livestock[], onFinancialUpdate: (record: any) => void }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const [animal, setAnimal] = useState<Livestock>(initialAnimal);
  
  // Health Record State
  const [isHealthDialogOpen, setHealthDialogOpen] = useState(false);
  const [healthDate, setHealthDate] = useState(new Date().toISOString().split('T')[0]);
  const [healthEvent, setHealthEvent] = useState('');
  const [healthDescription, setHealthDescription] = useState('');
  const [isEditHealthDialogOpen, setEditHealthDialogOpen] = useState(false);
  const [editingHealthRecord, setEditingHealthRecord] = useState<HealthRecord | null>(null);

  // Production Metric State
  const [isMetricDialogOpen, setMetricDialogOpen] = useState(false);
  const [metricDate, setMetricDate] = useState(new Date().toISOString().split('T')[0]);
  const [metricType, setMetricType] = useState<'Milk' | 'Weight' | 'Breeding' | 'Eggs' | ''>('');
  const [metricValue, setMetricValue] = useState('');
  
  // Edit Profile State
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<Livestock>(animal);
  
  // Edit Metric State
  const [isEditMetricDialogOpen, setEditMetricDialogOpen] = useState(false);
  const [editingMetric, setEditingMetric] = useState<ProductionMetric | null>(null);

  const acquisitionCostRecord = useMemo(() => initialFinancialData.find(f => f.description === `Purchase of batch: ${initialAnimal.name.split(' (')[0]}`), [initialAnimal]);
  const [cost, setCost] = useState(acquisitionCostRecord ? acquisitionCostRecord.amount.toString() : '');

  useEffect(() => {
    setAnimal(initialAnimal);
    setEditForm(initialAnimal);
    const newAcquisitionCostRecord = initialFinancialData.find(f => f.description === `Purchase of batch: ${initialAnimal.name.split(' (')[0]}`);
    setCost(newAcquisitionCostRecord ? newAcquisitionCostRecord.amount.toString() : '');
  }, [initialAnimal]);

  if (!animal) {
    return notFound();
  }
  
  const handleUpdate = (updatedAnimal: Livestock) => {
    onUpdate(updatedAnimal);
    setAnimal(updatedAnimal);
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
    
    const updatedAnimal = { ...animal, healthRecords: [newRecord, ...animal.healthRecords] };
    handleUpdate(updatedAnimal);
    
    toast({
        title: "Record Saved",
        description: "The new health record has been added for the batch.",
    });

    setHealthEvent('');
    setHealthDescription('');
    setHealthDate(new Date().toISOString().split('T')[0]);
    setHealthDialogOpen(false);
  };
  
  const handleEditHealthRecord = (record: HealthRecord) => {
    setEditingHealthRecord(record);
    setEditHealthDialogOpen(true);
  };

  const handleUpdateHealthRecord = () => {
    if (!editingHealthRecord || !animal) return;

    const updatedHealthRecords = animal.healthRecords.map(r =>
      r.id === editingHealthRecord.id ? editingHealthRecord : r
    );
    const updatedAnimal = { ...animal, healthRecords: updatedHealthRecords };
    handleUpdate(updatedAnimal);

    toast({
      title: "Health Record Updated",
      description: "The health record has been successfully updated.",
    });

    setEditingHealthRecord(null);
    setEditHealthDialogOpen(false);
  };

  const handleDeleteHealthRecord = (recordId: string) => {
    if (!animal) return;

    const updatedHealthRecords = animal.healthRecords.filter(r => r.id !== recordId);
    const updatedAnimal = { ...animal, healthRecords: updatedHealthRecords };
    handleUpdate(updatedAnimal);

    toast({
      variant: "destructive",
      title: "Health Record Deleted",
      description: "The health record has been removed.",
    });
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
      type: metricType as any,
      value: metricValue,
    };

    const updatedAnimal = { ...animal, productionMetrics: [newMetric, ...animal.productionMetrics] };
    handleUpdate(updatedAnimal);
    
    toast({
        title: "Metric Saved",
        description: "The new production metric has been added for the batch.",
    });
    
    setMetricType('');
    setMetricValue('');
    setMetricDate(new Date().toISOString().split('T')[0]);
    setMetricDialogOpen(false);
  };

  const handleEditMetric = (metric: ProductionMetric) => {
    setEditingMetric(metric);
    setEditMetricDialogOpen(true);
  };
  
  const handleUpdateProductionMetric = () => {
      if (!editingMetric || !animal) return;

      const updatedMetrics = animal.productionMetrics.map(m =>
          m.id === editingMetric.id ? editingMetric : m
      );
      const updatedAnimal = { ...animal, productionMetrics: updatedMetrics };
      handleUpdate(updatedAnimal);

      toast({
          title: "Metric Updated",
          description: "The production metric has been updated.",
      });

      setEditingMetric(null);
      setEditMetricDialogOpen(false);
  };
  
  const handleDeleteMetric = (metricId: string) => {
      if (!animal) return;

      const updatedMetrics = animal.productionMetrics.filter(m => m.id !== metricId);
      const updatedAnimal = { ...animal, productionMetrics: updatedMetrics };
      handleUpdate(updatedAnimal);

      toast({
          variant: "destructive",
          title: "Metric Deleted",
          description: "The production metric has been removed.",
      });
  };
  
  const handleSaveProfile = () => {
    if (!editForm) return;

    const finalForm = {
        ...editForm,
        name: `${editForm.name.split(' (')[0]} (${editForm.tagId.split('-')[1]} animals)`
    };

    handleUpdate(finalForm);
    
    if (acquisitionCostRecord) {
        const updatedRecord = { ...acquisitionCostRecord, amount: parseFloat(cost) || 0 };
        onFinancialUpdate(updatedRecord);
    }


    toast({
      title: "Profile Saved",
      description: `${finalForm.name}'s profile has been updated.`,
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

  const animalCount = animal.tagId.split('-')[1];

  return (
    <>
      <PageHeader title={animal.name}>
         <Button variant="outline" onClick={() => router.back()}><ArrowLeft /> Back</Button>
         <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Edit />
                    Edit Batch
                </Button>
            </DialogTrigger>
             <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Batch: {animal.name.split(' (')[0]}</DialogTitle>
                </DialogHeader>
                {editForm && (
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="batch-image">Batch Image</Label>
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
                          <Input id="batch-image" type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageSelect} />
                          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Image
                          </Button>
                          <p className="text-xs text-muted-foreground mt-2">PNG, JPG, GIF up to 10MB.</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Batch Name</Label>
                      <Input id="name" value={editForm.name.split(' (')[0]} onChange={(e) => setEditForm({...editForm, name: e.target.value})} />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="breed">Breed</Label>
                            <Input id="breed" value={editForm.breed} onChange={(e) => setEditForm({...editForm, breed: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="birthDate">Acquisition Date</Label>
                            <Input id="birthDate" type="date" value={editForm.birthDate} onChange={(e) => setEditForm({...editForm, birthDate: e.target.value})} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <Label htmlFor="tagId">Number of Animals</Label>
                          <Input id="tagId" value={editForm.tagId.split('-')[1]} onChange={(e) => setEditForm({...editForm, tagId: `batch-${e.target.value}`})} />
                      </div>
                       <div className="space-y-2">
                          <Label htmlFor="status">Status</Label>
                          <Select value={editForm.status} onValueChange={(value) => editForm && setEditForm({ ...editForm, status: value as any })}>
                              <SelectTrigger id="status">
                                  <SelectValue placeholder="Select a status" />
                              </SelectTrigger>
                              <SelectContent>
                                  {['Active', 'Sold', 'Deceased'].map(option => (
                                      <SelectItem key={option} value={option}>{option}</SelectItem>
                                  ))}
                              </SelectContent>
                          </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cost">Total Cost</Label>
                        <Input id="cost" type="number" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="e.g., 250.00"/>
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
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-4">
            <Card className="overflow-hidden">
              <Image
                src={animal.imageUrl}
                alt={animal.name}
                width={600}
                height={400}
                className="w-full object-cover aspect-[4/3]"
                data-ai-hint={animal.imageHint}
              />
              <CardContent className="p-3">
                <h2 className="text-xl font-bold font-headline">{animal.name}</h2>
                <p className="text-sm text-muted-foreground">Breed: {animal.breed}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary">{animal.category}</Badge>
                    <Badge variant={['Active'].includes(animal.status) ? 'default' : 'outline'}>
                      {animal.status}
                    </Badge>
                  </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="p-3 pb-2">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    <span>Animal Count</span>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="text-xl font-bold">{animalCount}</div>
                </CardContent>
              </Card>
               <Card>
                <CardHeader className="p-3 pb-2">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    <span>Acquired</span>
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                    <div className="text-xl font-bold">{new Date(animal.birthDate).toLocaleDateString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-3 pb-2">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    <span>Cost</span>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="text-xl font-bold">{acquisitionCostRecord ? `$${acquisitionCostRecord.amount}` : 'N/A'}</div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <Tabs defaultValue="health" className="w-full">
                <CardHeader className="p-2 sm:p-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="health">Health</TabsTrigger>
                    <TabsTrigger value="production">Production</TabsTrigger>
                  </TabsList>
                </CardHeader>
                <TabsContent value="health" className="p-0">
                  <CardHeader className="flex flex-row items-center justify-between px-4 pb-2">
                    <CardTitle className="text-base">Health History</CardTitle>
                    <Dialog open={isHealthDialogOpen} onOpenChange={setHealthDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline"><PlusCircle className="mr-2 h-4 w-4"/>Add</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Batch Health Record</DialogTitle>
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
                            <Input id="health-event" placeholder="e.g., Flock vaccination, Water treatment" value={healthEvent} onChange={(e) => setHealthEvent(e.target.value)} />
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
                  <CardContent className="px-4">
                    {/* Desktop Table */}
                    <div className="hidden sm:block">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Event</TableHead>
                            <TableHead>Details</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {animal.healthRecords.map((record: HealthRecord) => (
                            <TableRow key={record.id}>
                              <TableCell className="min-w-[100px]">{new Date(record.date).toLocaleDateString()}</TableCell>
                              <TableCell>{record.event}</TableCell>
                              <TableCell>{record.description}</TableCell>
                              <TableCell className="text-right">
                                  <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="icon" className="h-8 w-8">
                                              <MoreVertical className="h-4 w-4" />
                                          </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                          <DropdownMenuItem onClick={() => handleEditHealthRecord(record)}>
                                              <Edit className="mr-2 h-4 w-4"/>Edit
                                          </DropdownMenuItem>
                                          <DropdownMenuItem onClick={() => handleDeleteHealthRecord(record.id)} className="text-destructive">
                                              <Trash2 className="mr-2 h-4 w-4"/>Delete
                                          </DropdownMenuItem>
                                      </DropdownMenuContent>
                                  </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                     {animal.healthRecords.length === 0 && (
                          <div className="text-center text-muted-foreground py-8">No health records found for this batch.</div>
                      )}
                  </CardContent>
                </TabsContent>
                <TabsContent value="production" className="p-0">
                  <CardHeader className="flex flex-row items-center justify-between px-4 pb-2">
                    <CardTitle className="text-base">Production Metrics</CardTitle>
                    <Dialog open={isMetricDialogOpen} onOpenChange={setMetricDialogOpen}>
                       <DialogTrigger asChild>
                         <Button size="sm" variant="outline"><PlusCircle className="mr-2 h-4 w-4"/>Add</Button>
                       </DialogTrigger>
                       <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Batch Production Metric</DialogTitle>
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
                                <Select onValueChange={(value) => setMetricType(value as any)}>
                                    <SelectTrigger id="metric-type">
                                        <SelectValue placeholder="Select a metric type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Eggs">Eggs</SelectItem>
                                        <SelectItem value="Weight">Total Weight</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="space-y-2">
                              <Label htmlFor="metric-value">Value</Label>
                              <Input id="metric-value" placeholder="e.g., 45 eggs, 150kg" value={metricValue} onChange={(e) => setMetricValue(e.target.value)}/>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button onClick={handleSaveProductionMetric}>Save Metric</Button>
                          </DialogFooter>
                       </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent className="px-4">
                      {/* Desktop Table */}
                      <div className="hidden sm:block">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Value</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {animal.productionMetrics.map((metric: ProductionMetric) => (
                              <TableRow key={metric.id}>
                                <TableCell className="min-w-[100px]">{new Date(metric.date).toLocaleDateString()}</TableCell>
                                <TableCell>{metric.type}</TableCell>
                                <TableCell>{metric.value}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleEditMetric(metric)}>
                                                <Edit className="mr-2 h-4 w-4"/>Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDeleteMetric(metric.id)} className="text-destructive">
                                                <Trash2 className="mr-2 h-4 w-4"/>Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      {animal.productionMetrics.length === 0 && (
                           <div className="text-center text-muted-foreground py-8">No production metrics found for this batch.</div>
                      )}
                  </CardContent>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </main>

        <Dialog open={isEditMetricDialogOpen} onOpenChange={setEditMetricDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Production Metric</DialogTitle>
                </DialogHeader>
                {editingMetric && (
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-metric-date">Date</Label>
                            <Input
                                id="edit-metric-date"
                                type="date"
                                value={editingMetric.date}
                                onChange={(e) => setEditingMetric({ ...editingMetric, date: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-metric-type">Type</Label>
                            <Select
                                value={editingMetric.type}
                                onValueChange={(value) =>
                                    setEditingMetric({ ...editingMetric, type: value as any })
                                }
                            >
                                <SelectTrigger id="edit-metric-type">
                                    <SelectValue placeholder="Select a metric type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Eggs">Eggs</SelectItem>
                                    <SelectItem value="Weight">Total Weight</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-metric-value">Value</Label>
                            <Input
                                id="edit-metric-value"
                                value={editingMetric.value}
                                onChange={(e) => setEditingMetric({ ...editingMetric, value: e.target.value })}
                            />
                        </div>
                    </div>
                )}
                <DialogFooter>
                    <Button variant="outline" onClick={() => { setEditMetricDialogOpen(false); setEditingMetric(null); }}>Cancel</Button>
                    <Button onClick={handleUpdateProductionMetric}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <Dialog open={isEditHealthDialogOpen} onOpenChange={setEditHealthDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Health Record</DialogTitle>
                </DialogHeader>
                {editingHealthRecord && (
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-health-date">Date</Label>
                            <Input
                                id="edit-health-date"
                                type="date"
                                value={editingHealthRecord.date}
                                onChange={(e) => setEditingHealthRecord({ ...editingHealthRecord, date: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-health-event">Event</Label>
                            <Input
                                id="edit-health-event"
                                value={editingHealthRecord.event}
                                onChange={(e) => setEditingHealthRecord({ ...editingHealthRecord, event: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-health-description">Description</Label>
                            <Textarea
                                id="edit-health-description"
                                value={editingHealthRecord.description}
                                onChange={(e) => setEditingHealthRecord({ ...editingHealthRecord, description: e.target.value })}
                            />
                        </div>
                    </div>
                )}
                <DialogFooter>
                    <Button variant="outline" onClick={() => { setEditHealthDialogOpen(false); setEditingHealthRecord(null); }}>Cancel</Button>
                    <Button onClick={handleUpdateHealthRecord}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
  );
}

export default function LivestockDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [livestockList, setLivestockList] = useState<Livestock[]>([]);
  const [financialData, setFinancialData] = useState<typeof initialFinancialData>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const livestockItem = window.localStorage.getItem('livestockData');
      setLivestockList(livestockItem ? JSON.parse(livestockItem) : []);
      const financialItem = window.localStorage.getItem('financialData');
      setFinancialData(financialItem ? JSON.parse(financialItem) : []);
    } catch (error) {
      console.error(error);
      setLivestockList([]);
      setFinancialData([]);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      window.localStorage.setItem('livestockData', JSON.stringify(livestockList));
    }
  }, [livestockList, isClient]);

   useEffect(() => {
    if (isClient) {
      window.localStorage.setItem('financialData', JSON.stringify(financialData));
    }
  }, [financialData, isClient]);

  const animal = useMemo(() => livestockList.find(a => a.id === id), [id, livestockList]);

  const handleUpdate = (updatedAnimal: Livestock) => {
    setLivestockList(prev => prev.map(a => a.id === updatedAnimal.id ? updatedAnimal : a));
  };
  
  const handleFinancialUpdate = (updatedRecord: any) => {
    setFinancialData(prev => prev.map(r => r.id === updatedRecord.id ? updatedRecord : r));
    // Also update the in-memory export if needed elsewhere
    const index = initialFinancialData.findIndex(r => r.id === updatedRecord.id);
    if(index !== -1) initialFinancialData[index] = updatedRecord;
  }
  
  if (!isClient) {
    return null; // Or a loading spinner
  }

  if (!animal) {
    return notFound();
  }

  const isBatch = animal.tagId.startsWith('batch-');

  if (isBatch) {
    return <BatchProfile initialAnimal={animal} onUpdate={handleUpdate} allLivestock={livestockList} onFinancialUpdate={handleFinancialUpdate} />;
  } else {
    return <IndividualAnimalProfile initialAnimal={animal} onUpdate={handleUpdate} allLivestock={livestockList} />;
  }
}

    