
export type Livestock = {
  id: string;
  tagId: string;
  name: string;
  breed: string;
  birthDate: string;
  status: 'Active' | 'Sold' | 'Deceased' | 'Milking' | 'Dry' | 'Sick' | 'In-Calf/Pregnant';
  gender: 'Male' | 'Female';
  imageUrl: string;
  imageHint: string;
  healthRecords: HealthRecord[];
  productionMetrics: ProductionMetric[];
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
  type: 'Milk' | 'Weight' | 'Breeding';
  value: string;
  notes?: string;
};

export type Activity = {
  id: string;
  type: 'Feeding' | 'Health Check' | 'Breeding' | 'Movement' | 'General';
  description: string;
  date: string;
};

export type Task = {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  category: 'Health' | 'Feeding' | 'Maintenance' | 'Admin';
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

export const livestockData: Livestock[] = [
  {
    id: '1',
    tagId: 'LL-001',
    name: 'Daisy',
    breed: 'Holstein',
    birthDate: '2021-04-12',
    status: 'Milking',
    gender: 'Female',
    imageUrl: 'https://picsum.photos/seed/1/600/400',
    imageHint: 'cow pasture',
    healthRecords: [
      { id: 'hr1', date: '2023-10-15', event: 'Vaccination', description: 'Annual booster shots' },
      { id: 'hr2', date: '2024-01-20', event: 'Health Check', description: 'Routine check-up, all clear' },
    ],
    productionMetrics: [
      { id: 'pm1', date: '2024-05-01', type: 'Milk', value: '30L/day' },
      { id: 'pm2', date: '2024-02-10', type: 'Breeding', value: 'Successful insemination' },
    ],
  },
  {
    id: '2',
    tagId: 'LL-002',
    name: 'Buster',
    breed: 'Angus',
    birthDate: '2022-08-01',
    status: 'Active',
    gender: 'Male',
    imageUrl: 'https://picsum.photos/seed/2/600/400',
    imageHint: 'black bull',
    healthRecords: [
      { id: 'hr3', date: '2023-11-05', event: 'Deworming', description: 'Oral dewormer administered' },
    ],
    productionMetrics: [
      { id: 'pm3', date: '2024-04-15', type: 'Weight', value: '550kg' },
    ],
  },
  {
    id: '3',
    tagId: 'LL-003',
    name: 'Flossy',
    breed: 'Merino',
    birthDate: '2020-05-20',
    status: 'Active',
    gender: 'Female',
    imageUrl: 'https://picsum.photos/seed/3/600/400',
    imageHint: 'white sheep',
    healthRecords: [
      { id: 'hr4', date: '2024-03-10', event: 'Shearing', description: 'Annual shearing' },
    ],
    productionMetrics: [
      { id: 'pm4', date: '2023-09-01', type: 'Breeding', value: 'Gave birth to twins' },
    ],
  },
  {
    id: '4',
    tagId: 'LL-004',
    name: 'Billy',
    breed: 'Boer',
    birthDate: '2023-01-30',
    status: 'Active',
    gender: 'Male',
    imageUrl: 'https://picsum.photos/seed/4/600/400',
    imageHint: 'brown goat',
    healthRecords: [],
    productionMetrics: [
       { id: 'pm5', date: '2024-05-10', type: 'Weight', value: '60kg' },
    ],
  },
];

export const activityLogData: Activity[] = [
  { id: 'act1', type: 'Feeding', description: 'Distributed 500kg of silage to herd 1.', date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
  { id: 'act2', type: 'Health Check', description: 'Checked Daisy (LL-001) for signs of mastitis. All clear.', date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
  { id: 'act3', type: 'Movement', description: 'Moved sheep flock to pasture 3.', date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
  { id: 'act4', type: 'Breeding', description: 'Observed breeding behavior in ewes.', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'act5', type: 'General', description: 'Repaired fence in north paddock.', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
];

export const tasksData: Task[] = [
  { id: 'task1', title: 'Administer vaccinations for calves', dueDate: new Date().toISOString(), completed: false, category: 'Health' },
  { id: 'task2', title: 'Order new batch of feed', dueDate: new Date().toISOString(), completed: true, category: 'Feeding' },
  { id: 'task3', title: 'Repair water trough in Field B', dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), completed: false, category: 'Maintenance' },
  { id: 'task4', title: 'Record milk production data', dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), completed: false, category: 'Admin' },
  { id: 'task5', title: 'Shear Merino flock', dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), completed: true, category: 'Health' },
  { id: 'task6', title: 'Rotate grazing pasture for cattle', dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), completed: true, category: 'Feeding' },
];

export const financialData: FinancialRecord[] = [
  { id: 'fin1', type: 'Income', category: 'Milk Sales', amount: 1200, date: '2024-05-01', description: 'Sale of 2000L milk' },
  { id: 'fin2', type: 'Expense', category: 'Feed', amount: 450, date: '2024-05-02', description: 'Purchase of high-protein feed' },
  { id: 'fin3', type: 'Income', category: 'Livestock Sale', amount: 2500, date: '2024-04-20', description: 'Sold 2 Angus steers' },
  { id: 'fin4', type: 'Expense', category: 'Vet Services', amount: 300, date: '2024-04-15', description: 'Annual health check for herd' },
  { id: 'fin5', type: 'Expense', category: 'Utilities', amount: 150, date: '2024-04-10', description: 'Electricity bill for the barn' },
  { id: 'fin6', type: 'Income', category: 'Wool Sales', amount: 800, date: '2024-03-15', description: 'Sale of Merino wool' },
  { id: 'fin7', type: 'Expense', category: 'Feed', amount: 430, date: '2024-04-02', description: 'Purchase of silage' },
  { id: 'fin8', type: 'Income', category: 'Milk Sales', amount: 1150, date: '2024-04-01', description: 'Sale of 1900L milk' },
  { id: 'fin9', type: 'Income', category: 'Milk Sales', amount: 1300, date: '2024-03-01', description: 'Sale of 2100L milk' },
  { id: 'fin10', type: 'Expense', category: 'Feed', amount: 400, date: '2024-03-02', description: 'Purchase of hay' },
];

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

    