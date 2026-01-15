
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { livestockData, type HealthRecord, type ProductionMetric, type Livestock } from './data';
import { format } from 'date-fns';

// Augment jsPDF with the autoTable method
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

// --- CSV Report Generation ---

export const generateCsvReport = async (category: string) => {
  const animalsInCategory = livestockData.filter(animal => animal.category === category);
  
  let csvContent = 'data:text/csv;charset=utf-8,';
  csvContent += 'Animal Name,Animal Tag ID,Record Type,Date,Event/Type,Value/Description,Notes/Treatment\n';

  animalsInCategory.forEach(animal => {
    animal.healthRecords.forEach(record => {
      const row = [
        animal.name,
        animal.tagId,
        'Health',
        record.date,
        `"${record.event.replace(/"/g, '""')}"`,
        `"${record.description.replace(/"/g, '""')}"`,
        `"${(record.treatment || '').replace(/"/g, '""')}"`
      ].join(',');
      csvContent += row + '\n';
    });

    animal.productionMetrics.forEach(metric => {
      const row = [
        animal.name,
        animal.tagId,
        'Production',
        metric.date,
        `"${metric.type.replace(/"/g, '""')}"`,
        `"${metric.value.replace(/"/g, '""')}"`,
        `"${(metric.notes || '').replace(/"/g, '""')}"`
      ].join(',');
      csvContent += row + '\n';
    });
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${category.toLowerCase()}_report_${format(new Date(), 'yyyy-MM-dd')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


// --- PDF Report Generation ---

const generatePdfHeader = (doc: jsPDF, farmName: string, manager: string, location: string) => {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text(farmName, 14, 22);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Manager: ${manager}`, 14, 30);
  doc.text(`Location: ${location}`, 14, 35);

  doc.setFontSize(10);
  doc.text(`Report Date: ${format(new Date(), 'MMMM dd, yyyy')}`, doc.internal.pageSize.getWidth() - 14, 22, { align: 'right' });
  
  doc.setDrawColor(221, 221, 221);
  doc.line(14, 40, doc.internal.pageSize.getWidth() - 14, 40);
};

const generateSummarySection = (doc: jsPDF, title: string, content: { label: string, value: string }[], startY: number) => {
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 14, startY);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const body = content.map(item => [item.label, item.value]);
  
  doc.autoTable({
    startY: startY + 5,
    head: [['Metric', 'Value']],
    body: body,
    theme: 'striped',
    headStyles: { fillColor: [34, 139, 34] },
    margin: { left: 14, right: 14 },
  });

  return doc.autoTable.previous.finalY + 10;
};


export const generatePdfReport = async (category: string) => {
  const doc = new jsPDF();
  const farmName = "Sunrise Farms"; // Placeholder
  const managerName = "John Doe"; // Placeholder
  const farmLocation = "Springfield, IL"; // Placeholder

  generatePdfHeader(doc, farmName, managerName, farmLocation);

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`${category} Performance Report`, 14, 50);

  // --- Data Analysis ---
  const animals = livestockData.filter(animal => animal.category === category);
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  const lastYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

  const getRecordsSince = (date: Date) => {
      return animals.flatMap(a => 
        [...a.healthRecords, ...a.productionMetrics]
        .filter(r => new Date(r.date) >= date)
      );
  }

  const lastMonthRecords = getRecordsSince(lastMonth);
  const lastYearRecords = getRecordsSince(lastYear);

  const totalAnimals = animals.length;
  const newAnimalsLastYear = animals.filter(a => new Date(a.birthDate) >= lastYear).length;

  // --- Last Month Summary ---
  const monthSummary = [
    { label: 'Health Events Logged', value: lastMonthRecords.filter(r => 'event' in r).length.toString() },
    { label: 'Production Metrics Logged', value: lastMonthRecords.filter(r => 'type' in r).length.toString() },
  ];
  let finalY = generateSummarySection(doc, 'Last 30 Days Summary', monthSummary, 60);

  // --- Last Year Summary ---
  const yearSummary = [
    { label: 'Total Animals in Category', value: totalAnimals.toString() },
    { label: 'New Animals Born/Added', value: newAnimalsLastYear.toString() },
    { label: 'Total Health Events', value: lastYearRecords.filter(r => 'event' in r).length.toString() },
    { label: 'Total Production Metrics', value: lastYearRecords.filter(r => 'type' in r).length.toString() },
  ];
  finalY = generateSummarySection(doc, 'Last 365 Days Summary', yearSummary, finalY);

  // --- Detailed Records Table ---
  doc.addPage();
  generatePdfHeader(doc, farmName, managerName, farmLocation);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('All Records', 14, 50);
  
  const allRecords = animals.flatMap(animal => 
    [
      ...animal.healthRecords.map(r => ({ ...r, animalName: animal.name, recordType: 'Health' })),
      ...animal.productionMetrics.map(m => ({ ...m, animalName: animal.name, recordType: 'Production' }))
    ]
  ).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const tableBody = allRecords.map(r => [
    r.animalName,
    r.recordType,
    r.date,
    (r as any).event || (r as any).type,
    (r as any).description || (r as any).value,
  ]);

  doc.autoTable({
    startY: 60,
    head: [['Animal', 'Record Type', 'Date', 'Event/Type', 'Details/Value']],
    body: tableBody,
    theme: 'grid',
    headStyles: { fillColor: [34, 139, 34] },
    margin: { left: 14, right: 14 },
    didDrawPage: (data) => {
        // Add footer
        doc.setFontSize(8);
        const pageCount = doc.internal.pages.length;
        doc.text(`Page ${data.pageNumber} of ${pageCount -1}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
    }
  });

  doc.save(`${category.toLowerCase()}_report_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};
