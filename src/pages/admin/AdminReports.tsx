import { useState, useEffect } from 'react';
import { Patient, Appointment, BillingRecord } from '../../types';
import * as api from '../../utils/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AdminReports() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [billing, setBilling] = useState<BillingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [patientsData, appointmentsData, billingData] = await Promise.all([
          api.fetchPatients(),
          api.fetchAppointments(),
          api.fetchBilling()
        ]);
        setPatients(patientsData);
        setAppointments(appointmentsData);
        setBilling(billingData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-full text-gray-500">Loading reports data...</div>;

  // Prepare Chart Data
  // 1. Revenue over time
  const revenueByDateMap = billing.reduce((acc, curr) => {
    const date = curr.date;
    if (!acc[date]) acc[date] = 0;
    acc[date] += curr.totalAmount;
    return acc;
  }, {} as Record<string, number>);
  const revenueData = Object.keys(revenueByDateMap).sort().map(date => ({
    date,
    revenue: revenueByDateMap[date]
  }));

  // 2. Appointment status distribution
  const appointmentStatusMap = appointments.reduce((acc, curr) => {
    const status = curr.status;
    if (!acc[status]) acc[status] = 0;
    acc[status] += 1;
    return acc;
  }, {} as Record<string, number>);
  const appointmentData = Object.keys(appointmentStatusMap).map(status => ({
    name: status,
    value: appointmentStatusMap[status]
  }));

  // 3. Patient distribution by status
  const patientStatusMap = patients.reduce((acc, curr) => {
    const status = curr.status || 'Unknown';
    if (!acc[status]) acc[status] = 0;
    acc[status] += 1;
    return acc;
  }, {} as Record<string, number>);
  const patientData = Object.keys(patientStatusMap).map(status => ({
    name: status,
    count: patientStatusMap[status]
  }));

  // PDF Export
  const exportPDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(18);
    doc.text('Hospital Administration Report', 14, 22);
    
    // Revenue Data
    doc.setFontSize(14);
    doc.text('Billing Records Summary', 14, 32);
    const billingRows = billing.map(b => [b.id, b.patientName, b.date, b.status, `Ksh ${b.totalAmount}`]);
    autoTable(doc, {
      startY: 36,
      head: [['ID', 'Patient Name', 'Date', 'Status', 'Total Amount']],
      body: billingRows,
    });

    // Patients Data
    const finalY = (doc as any).lastAutoTable.finalY || 36;
    doc.text('Patients Summary', 14, finalY + 10);
    const patientRows = patients.map(p => [p.id, p.name, p.age, p.gender, p.status || 'Unknown', p.diagnosis || 'None'] as (string | number)[]);
    autoTable(doc, {
      startY: finalY + 14,
      head: [['ID', 'Name', 'Age', 'Gender', 'Status', 'Diagnosis']],
      body: patientRows,
    });

    doc.save('admin_hospital_report.pdf');
  };

  // Excel Export
  const exportExcel = () => {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Billing
    const billingWs = XLSX.utils.json_to_sheet(billing.map(b => ({
      'ID': b.id,
      'Patient Name': b.patientName,
      'Date': b.date,
      'Status': b.status,
      'Total Amount': b.totalAmount
    })));
    XLSX.utils.book_append_sheet(wb, billingWs, "Billing");

    // Sheet 2: Patients
    const patientsWs = XLSX.utils.json_to_sheet(patients.map(p => ({
      'ID': p.id,
      'Name': p.name,
      'Age': p.age,
      'Gender': p.gender,
      'Status': p.status,
      'Diagnosis': p.diagnosis
    })));
    XLSX.utils.book_append_sheet(wb, patientsWs, "Patients");

    // Sheet 3: Appointments
    const apptWs = XLSX.utils.json_to_sheet(appointments.map(a => ({
      'ID': a.id,
      'Patient': a.patientName,
      'Doctor': a.doctorName,
      'Date': a.date,
      'Time': a.time,
      'Status': a.status
    })));
    XLSX.utils.book_append_sheet(wb, apptWs, "Appointments");

    XLSX.writeFile(wb, 'admin_hospital_data.xlsx');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Analytics & Reports</h2>
          <p className="text-gray-500 mt-1">Exportable metrics and visual analytics</p>
        </div>
        <div className="flex gap-3">
          <button onClick={exportExcel} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-sm">
            <span>📊</span> Export Excel
          </button>
          <button onClick={exportPDF} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2 shadow-sm">
            <span>📄</span> Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm col-span-1 lg:col-span-2">
          <h3 className="font-semibold text-gray-800 mb-4">Revenue Trend (Ksh)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <RechartsTooltip 
                  formatter={(value) => [`Ksh ${value}`, 'Revenue']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Appointments Chart */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-gray-800 mb-4">Appointments Distribution</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={appointmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {appointmentData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                   contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Patient Status Chart */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-gray-800 mb-4">Patient Status</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={patientData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="name" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} allowDecimals={false} />
                <RechartsTooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
