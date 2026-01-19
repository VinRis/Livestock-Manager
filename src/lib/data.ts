
export type Livestock = {
  id: string;
  tagId: string;
  name: string;
  breed: string;
  category: 'Cattle' | 'Sheep' | 'Goats' | string;
  birthDate: string;
  status: 'Active' | 'Sold' | 'Deceased' | 'Milking' | 'Dry' | 'Sick' | 'In-Calf/Pregnant';
  gender: 'Male' | 'Female';
  imageUrl: string;
  imageHint: string;
  healthRecords: HealthRecord[];
  productionMetrics: ProductionMetric[];
  sireId?: string;
  damId?: string;
};

export type HealthRecord = {
  id: string;
  date: string;
  event: string;
  description: string;
  treatment?: string;
};

export type ProductionMetric = {
  id: string;
  date: string;
  type: 'Milk' | 'Weight' | 'Breeding' | 'Eggs';
  value: string;
  notes?: string;
};

export type Activity = {
  id: string;
  type: 'Feeding' | 'Health Check' | 'Breeding' | 'Movement' | 'General' | 'Production';
  description: string;
  date: string;
  livestockId?: string;
  livestockName?: string;
  livestockCategory?: string;
};

export type Task = {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  category: 'Health' | 'Feeding' | 'Maintenance' | 'Admin';
  livestockId?: string;
  livestockName?: string;
  livestockCategory?: string;
};

export type FinancialRecord = {
  id: string;
  type: 'Income' | 'Expense';
  category: string;
  amount: number;
  date: string;
  description: string;
};

export type BirdType = {
  name: string;
  traySize: number;
};

export type Currency = {
  code: string;
  name: string;
  symbol: string;
};

export type CategoryDefinition = {
    name: string;
    icon: string; // Using string to store icon name
    managementStyle: 'animal' | 'batch';
}


export let categoriesData: CategoryDefinition[] = [];

export let livestockData: Livestock[] = [];

export let activityLogData: Activity[] = [];

export let tasksData: Task[] = [];

export let financialData: FinancialRecord[] = [];

export const birdTypesData: BirdType[] = [
    { name: 'Chicken', traySize: 30 },
    { name: 'Dove', traySize: 50 },
    { name: 'Duck', traySize: 30 },
    { name: 'Goose', traySize: 15 },
    { name: 'Guinea Fowl', traySize: 20 },
    { name: 'Ostrich', traySize: 10 },
    { name: 'Pheasants', traySize: 20 },
    { name: 'Pigeon', traySize: 50 },
    { name: 'Quail', traySize: 100 },
    { name: 'Turkey', traySize: 30 },
];

export const currencyData: Currency[] = [
    { code: 'USD', name: 'United States Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' },
    { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
    { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵' },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
];

export const getLivestockById = (id: string) => livestockData.find(animal => animal.id === id);
    

    
