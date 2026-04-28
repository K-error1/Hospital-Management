import { Patient, Doctor, Nurse, Appointment, Prescription, VitalSign, Department, BillingRecord, User } from '../types';

export const users: User[] = [
  { id: 'admin-1', name: 'Sarah Wanjiru', email: 'admin@medicare.co.ke', role: 'administrator', phone: '+254 712 345 678' },
  { id: 'doc-1', name: 'Dr. James Otieno', email: 'otieno@medicare.co.ke', role: 'doctor', specialization: 'Cardiology', department: 'Cardiology', phone: '+254 722 100 200' },
  { id: 'doc-2', name: 'Dr. Emily Mutua', email: 'mutua@medicare.co.ke', role: 'doctor', specialization: 'Neurology', department: 'Neurology', phone: '+254 733 400 500' },
  { id: 'doc-3', name: 'Dr. Michael Kamau', email: 'kamau@medicare.co.ke', role: 'doctor', specialization: 'Orthopedics', department: 'Orthopedics', phone: '+254 755 600 700' },
  { id: 'nurse-1', name: 'Lisa Akinyi', email: 'akinyi@medicare.co.ke', role: 'nurse', department: 'Cardiology', phone: '+254 799 800 900' },
  { id: 'nurse-2', name: 'Maria Wamalwa', email: 'wamalwa@medicare.co.ke', role: 'nurse', department: 'Neurology', phone: '+254 711 222 333' },
  { id: 'pat-1', name: 'John Ochieng', email: 'john@email.co.ke', role: 'patient', phone: '+254 744 555 666' },
  { id: 'pat-2', name: 'Jane Njoroge', email: 'jane@email.co.ke', role: 'patient', phone: '+254 777 888 999' },
  { id: 'pat-3', name: 'Robert Kipchoge', email: 'robert@email.co.ke', role: 'patient', phone: '+254 720 111 222' },
];

export const patients: Patient[] = [
  { id: 'pat-1', name: 'John Ochieng', age: 45, gender: 'Male', bloodGroup: 'A+', phone: '+254 744 555 666', email: 'john@email.co.ke', address: 'Ngong Road, Nairobi', admissionDate: '2026-01-15', status: 'Admitted', assignedDoctor: 'doc-1', assignedNurse: 'nurse-1', room: '301-A', diagnosis: 'Coronary Artery Disease' },
  { id: 'pat-2', name: 'Jane Njoroge', age: 32, gender: 'Female', bloodGroup: 'B+', phone: '+254 777 888 999', email: 'jane@email.co.ke', address: 'Nyali, Mombasa', admissionDate: '2026-01-18', status: 'Outpatient', assignedDoctor: 'doc-2', assignedNurse: 'nurse-2', diagnosis: 'Migraine' },
  { id: 'pat-3', name: 'Robert Kipchoge', age: 58, gender: 'Male', bloodGroup: 'O-', phone: '+254 720 111 222', email: 'robert@email.co.ke', address: 'Milimani, Kisumu', admissionDate: '2026-01-10', status: 'Critical', assignedDoctor: 'doc-1', assignedNurse: 'nurse-1', room: 'ICU-2', diagnosis: 'Acute Myocardial Infarction' },
  { id: 'pat-4', name: 'Emily Nduta', age: 28, gender: 'Female', bloodGroup: 'AB+', phone: '+254 788 333 444', email: 'emily@email.co.ke', address: 'Westlands, Nairobi', admissionDate: '2026-01-20', status: 'Admitted', assignedDoctor: 'doc-3', assignedNurse: 'nurse-1', room: '205-B', diagnosis: 'Fractured Femur' },
  { id: 'pat-5', name: 'David Mwangi', age: 67, gender: 'Male', bloodGroup: 'A-', phone: '+254 700 999 000', email: 'david@email.co.ke', address: 'Nakuru Town, Nakuru', admissionDate: '2026-01-12', status: 'Admitted', assignedDoctor: 'doc-2', assignedNurse: 'nurse-2', room: '402-C', diagnosis: 'Stroke Recovery' },
  { id: 'pat-6', name: 'Sarah Atieno', age: 41, gender: 'Female', bloodGroup: 'B-', phone: '+254 701 234 567', email: 'sarah@email.co.ke', address: 'Kibera, Nairobi', admissionDate: '2026-01-22', status: 'Outpatient', assignedDoctor: 'doc-1', assignedNurse: 'nurse-1', diagnosis: 'Hypertension' },
  { id: 'pat-7', name: 'Thomas Omondi', age: 73, gender: 'Male', bloodGroup: 'O+', phone: '+254 722 345 678', email: 'thomas@email.co.ke', address: 'Runda, Nairobi', admissionDate: '2026-01-08', status: 'Discharged', assignedDoctor: 'doc-3', assignedNurse: 'nurse-2', diagnosis: 'Hip Replacement Recovery' },
  { id: 'pat-8', name: 'Anna Wambui', age: 35, gender: 'Female', bloodGroup: 'A+', phone: '+254 733 567 890', email: 'anna@email.co.ke', address: 'Karen, Nairobi', admissionDate: '2026-01-25', status: 'Admitted', assignedDoctor: 'doc-2', assignedNurse: 'nurse-2', room: '310-A', diagnosis: 'Epilepsy Management' },
];

export const doctors: Doctor[] = [
  { id: 'doc-1', name: 'Dr. James Otieno', specialization: 'Cardiology', department: 'Cardiology', phone: '+254 722 100 200', email: 'otieno@medicare.co.ke', status: 'Available', patientsCount: 12, experience: '15 years', qualification: 'MD, FACC' },
  { id: 'doc-2', name: 'Dr. Emily Mutua', specialization: 'Neurology', department: 'Neurology', phone: '+254 733 400 500', email: 'mutua@medicare.co.ke', status: 'Busy', patientsCount: 9, experience: '12 years', qualification: 'MD, PhD' },
  { id: 'doc-3', name: 'Dr. Michael Kamau', specialization: 'Orthopedics', department: 'Orthopedics', phone: '+254 755 600 700', email: 'kamau@medicare.co.ke', status: 'In Surgery', patientsCount: 8, experience: '10 years', qualification: 'MD, FAAOS' },
  { id: 'doc-4', name: 'Dr. Rebecca Naliaka', specialization: 'Pediatrics', department: 'Pediatrics', phone: '+254 766 800 900', email: 'naliaka@medicare.co.ke', status: 'Available', patientsCount: 15, experience: '8 years', qualification: 'MD, FAAP' },
];

export const nurses: Nurse[] = [
  { id: 'nurse-1', name: 'Lisa Akinyi', department: 'Cardiology', shift: 'Morning', phone: '+254 799 800 900', email: 'akinyi@medicare.co.ke', status: 'On Duty', assignedWard: 'Ward A - 3rd Floor', patientsCount: 6 },
  { id: 'nurse-2', name: 'Maria Wamalwa', department: 'Neurology', shift: 'Afternoon', phone: '+254 711 222 333', email: 'wamalwa@medicare.co.ke', status: 'On Duty', assignedWard: 'Ward B - 4th Floor', patientsCount: 5 },
];

export const appointments: Appointment[] = [
  { id: 'apt-1', patientId: 'pat-1', patientName: 'John Ochieng', doctorId: 'doc-1', doctorName: 'Dr. James Otieno', date: '2026-01-28', time: '09:00', status: 'Scheduled', type: 'Consultation', notes: 'Follow-up' },
  { id: 'apt-2', patientId: 'pat-2', patientName: 'Jane Njoroge', doctorId: 'doc-2', doctorName: 'Dr. Emily Mutua', date: '2026-01-28', time: '10:30', status: 'Scheduled', type: 'Follow-up' },
];

export const prescriptions: Prescription[] = [];
export const vitalSigns: VitalSign[] = [];
export const departments: Department[] = [
  { id: 'dept-1', name: 'Cardiology', head: 'Dr. James Otieno', doctorsCount: 4, nursesCount: 6, bedsTotal: 30, bedsOccupied: 22 },
];

export const billingRecords: BillingRecord[] = [
  { id: 'bill-1', patientId: 'pat-1', patientName: 'John Ochieng', date: '2026-01-25', items: [{ description: 'Consultation Fee', amount: 20000, quantity: 1 }, { description: 'Blood Test Panel', amount: 35000, quantity: 1 }], totalAmount: 55000, status: 'Pending', insuranceCovered: 40000 },
  { id: 'bill-2', patientId: 'pat-2', patientName: 'Jane Njoroge', date: '2026-01-20', items: [{ description: 'MRI Scan', amount: 120000, quantity: 1 }], totalAmount: 120000, status: 'Paid', insuranceCovered: 100000 },
];
