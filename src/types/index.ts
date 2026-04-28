export type UserRole = 'administrator' | 'doctor' | 'nurse' | 'patient' | 'receptionist';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  specialization?: string;
  phone?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  phone: string;
  email: string;
  address: string;
  admissionDate: string;
  status: 'Admitted' | 'Outpatient' | 'Discharged' | 'Critical';
  assignedDoctor: string;
  assignedNurse: string;
  room?: string;
  diagnosis?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  department: string;
  phone: string;
  email: string;
  status: 'Available' | 'In Surgery' | 'On Leave' | 'Busy';
  patientsCount: number;
  experience: string;
  qualification: string;
}

export interface Nurse {
  id: string;
  name: string;
  department: string;
  shift: 'Morning' | 'Afternoon' | 'Night';
  phone: string;
  email: string;
  status: 'On Duty' | 'Off Duty' | 'On Leave';
  assignedWard: string;
  patientsCount: number;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'In Progress';
  type: 'Consultation' | 'Follow-up' | 'Emergency' | 'Surgery';
  notes?: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  medications: Medication[];
  diagnosis: string;
  notes?: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface VitalSign {
  id: string;
  patientId: string;
  patientName: string;
  nurseId: string;
  date: string;
  time: string;
  temperature: number;
  bloodPressure: string;
  heartRate: number;
  oxygenLevel: number;
  weight?: number;
  notes?: string;
}

export interface Department {
  id: string;
  name: string;
  head: string;
  doctorsCount: number;
  nursesCount: number;
  bedsTotal: number;
  bedsOccupied: number;
}

export interface BillingRecord {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  items: BillingItem[];
  totalAmount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  insuranceCovered: number;
  paymentMethod?: 'mpesa' | 'bank' | 'insurance' | 'cash';
  paymentRef?: string;
}

export interface BillingItem {
  description: string;
  amount: number;
  quantity: number;
}
