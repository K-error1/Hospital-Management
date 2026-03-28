import { Patient, Doctor, Nurse, Appointment, Prescription, VitalSign, Department, BillingRecord, User } from '../types';

export const users: User[] = [
  { id: 'admin-1', name: 'Sarah Johnson', email: 'admin@medicare.com', role: 'administrator', phone: '555-0100' },
  { id: 'doc-1', name: 'Dr. James Wilson', email: 'wilson@medicare.com', role: 'doctor', specialization: 'Cardiology', department: 'Cardiology', phone: '555-0201' },
  { id: 'doc-2', name: 'Dr. Emily Chen', email: 'chen@medicare.com', role: 'doctor', specialization: 'Neurology', department: 'Neurology', phone: '555-0202' },
  { id: 'doc-3', name: 'Dr. Michael Brown', email: 'brown@medicare.com', role: 'doctor', specialization: 'Orthopedics', department: 'Orthopedics', phone: '555-0203' },
  { id: 'nurse-1', name: 'Lisa Anderson', email: 'anderson@medicare.com', role: 'nurse', department: 'Cardiology', phone: '555-0301' },
  { id: 'nurse-2', name: 'Maria Garcia', email: 'garcia@medicare.com', role: 'nurse', department: 'Neurology', phone: '555-0302' },
  { id: 'pat-1', name: 'John Smith', email: 'john@email.com', role: 'patient', phone: '555-0401' },
  { id: 'pat-2', name: 'Jane Doe', email: 'jane@email.com', role: 'patient', phone: '555-0402' },
  { id: 'pat-3', name: 'Robert Taylor', email: 'robert@email.com', role: 'patient', phone: '555-0403' },
];

export const patients: Patient[] = [
  { id: 'pat-1', name: 'John Smith', age: 45, gender: 'Male', bloodGroup: 'A+', phone: '555-0401', email: 'john@email.com', address: '123 Main St, Springfield', admissionDate: '2026-01-15', status: 'Admitted', assignedDoctor: 'doc-1', assignedNurse: 'nurse-1', room: '301-A', diagnosis: 'Coronary Artery Disease' },
  { id: 'pat-2', name: 'Jane Doe', age: 32, gender: 'Female', bloodGroup: 'B+', phone: '555-0402', email: 'jane@email.com', address: '456 Oak Ave, Shelbyville', admissionDate: '2026-01-18', status: 'Outpatient', assignedDoctor: 'doc-2', assignedNurse: 'nurse-2', diagnosis: 'Migraine' },
  { id: 'pat-3', name: 'Robert Taylor', age: 58, gender: 'Male', bloodGroup: 'O-', phone: '555-0403', email: 'robert@email.com', address: '789 Pine Rd, Capital City', admissionDate: '2026-01-10', status: 'Critical', assignedDoctor: 'doc-1', assignedNurse: 'nurse-1', room: 'ICU-2', diagnosis: 'Acute Myocardial Infarction' },
  { id: 'pat-4', name: 'Emily Watson', age: 28, gender: 'Female', bloodGroup: 'AB+', phone: '555-0404', email: 'emily.w@email.com', address: '321 Elm St, Springfield', admissionDate: '2026-01-20', status: 'Admitted', assignedDoctor: 'doc-3', assignedNurse: 'nurse-1', room: '205-B', diagnosis: 'Fractured Femur' },
  { id: 'pat-5', name: 'David Lee', age: 67, gender: 'Male', bloodGroup: 'A-', phone: '555-0405', email: 'david.l@email.com', address: '654 Cedar Ln, Shelbyville', admissionDate: '2026-01-12', status: 'Admitted', assignedDoctor: 'doc-2', assignedNurse: 'nurse-2', room: '402-C', diagnosis: 'Stroke Recovery' },
  { id: 'pat-6', name: 'Sarah Miller', age: 41, gender: 'Female', bloodGroup: 'B-', phone: '555-0406', email: 'sarah.m@email.com', address: '987 Birch Dr, Capital City', admissionDate: '2026-01-22', status: 'Outpatient', assignedDoctor: 'doc-1', assignedNurse: 'nurse-1', diagnosis: 'Hypertension' },
  { id: 'pat-7', name: 'Thomas Brown', age: 73, gender: 'Male', bloodGroup: 'O+', phone: '555-0407', email: 'thomas.b@email.com', address: '147 Maple Ct, Springfield', admissionDate: '2026-01-08', status: 'Discharged', assignedDoctor: 'doc-3', assignedNurse: 'nurse-2', diagnosis: 'Hip Replacement Recovery' },
  { id: 'pat-8', name: 'Anna Kim', age: 35, gender: 'Female', bloodGroup: 'A+', phone: '555-0408', email: 'anna.k@email.com', address: '258 Walnut St, Shelbyville', admissionDate: '2026-01-25', status: 'Admitted', assignedDoctor: 'doc-2', assignedNurse: 'nurse-2', room: '310-A', diagnosis: 'Epilepsy Management' },
];

export const doctors: Doctor[] = [
  { id: 'doc-1', name: 'Dr. James Wilson', specialization: 'Cardiology', department: 'Cardiology', phone: '555-0201', email: 'wilson@medicare.com', status: 'Available', patientsCount: 12, experience: '15 years', qualification: 'MD, FACC' },
  { id: 'doc-2', name: 'Dr. Emily Chen', specialization: 'Neurology', department: 'Neurology', phone: '555-0202', email: 'chen@medicare.com', status: 'Busy', patientsCount: 9, experience: '12 years', qualification: 'MD, PhD' },
  { id: 'doc-3', name: 'Dr. Michael Brown', specialization: 'Orthopedics', department: 'Orthopedics', phone: '555-0203', email: 'brown@medicare.com', status: 'In Surgery', patientsCount: 8, experience: '10 years', qualification: 'MD, FAAOS' },
  { id: 'doc-4', name: 'Dr. Rebecca Martinez', specialization: 'Pediatrics', department: 'Pediatrics', phone: '555-0204', email: 'martinez@medicare.com', status: 'Available', patientsCount: 15, experience: '8 years', qualification: 'MD, FAAP' },
  { id: 'doc-5', name: 'Dr. Andrew Davis', specialization: 'General Surgery', department: 'Surgery', phone: '555-0205', email: 'davis@medicare.com', status: 'On Leave', patientsCount: 0, experience: '20 years', qualification: 'MD, FACS' },
  { id: 'doc-6', name: 'Dr. Sophia Patel', specialization: 'Dermatology', department: 'Dermatology', phone: '555-0206', email: 'patel@medicare.com', status: 'Available', patientsCount: 11, experience: '6 years', qualification: 'MD, FAAD' },
];

export const nurses: Nurse[] = [
  { id: 'nurse-1', name: 'Lisa Anderson', department: 'Cardiology', shift: 'Morning', phone: '555-0301', email: 'anderson@medicare.com', status: 'On Duty', assignedWard: 'Ward A - 3rd Floor', patientsCount: 6 },
  { id: 'nurse-2', name: 'Maria Garcia', department: 'Neurology', shift: 'Afternoon', phone: '555-0302', email: 'garcia@medicare.com', status: 'On Duty', assignedWard: 'Ward B - 4th Floor', patientsCount: 5 },
  { id: 'nurse-3', name: 'Rachel Thompson', department: 'Orthopedics', shift: 'Night', phone: '555-0303', email: 'thompson@medicare.com', status: 'On Duty', assignedWard: 'Ward C - 2nd Floor', patientsCount: 4 },
  { id: 'nurse-4', name: 'Jennifer White', department: 'Pediatrics', shift: 'Morning', phone: '555-0304', email: 'white@medicare.com', status: 'Off Duty', assignedWard: 'Ward D - 1st Floor', patientsCount: 7 },
  { id: 'nurse-5', name: 'Karen Lewis', department: 'ICU', shift: 'Night', phone: '555-0305', email: 'lewis@medicare.com', status: 'On Duty', assignedWard: 'ICU', patientsCount: 3 },
];

export const appointments: Appointment[] = [
  { id: 'apt-1', patientId: 'pat-1', patientName: 'John Smith', doctorId: 'doc-1', doctorName: 'Dr. James Wilson', date: '2026-01-28', time: '09:00', status: 'Scheduled', type: 'Consultation', notes: 'Follow-up on cardiac assessment' },
  { id: 'apt-2', patientId: 'pat-2', patientName: 'Jane Doe', doctorId: 'doc-2', doctorName: 'Dr. Emily Chen', date: '2026-01-28', time: '10:30', status: 'Scheduled', type: 'Follow-up', notes: 'Migraine treatment review' },
  { id: 'apt-3', patientId: 'pat-3', patientName: 'Robert Taylor', doctorId: 'doc-1', doctorName: 'Dr. James Wilson', date: '2026-01-27', time: '14:00', status: 'Completed', type: 'Emergency', notes: 'Post-MI evaluation' },
  { id: 'apt-4', patientId: 'pat-4', patientName: 'Emily Watson', doctorId: 'doc-3', doctorName: 'Dr. Michael Brown', date: '2026-01-29', time: '11:00', status: 'Scheduled', type: 'Surgery', notes: 'Femur fixation surgery' },
  { id: 'apt-5', patientId: 'pat-5', patientName: 'David Lee', doctorId: 'doc-2', doctorName: 'Dr. Emily Chen', date: '2026-01-28', time: '15:00', status: 'In Progress', type: 'Follow-up', notes: 'Stroke recovery assessment' },
  { id: 'apt-6', patientId: 'pat-6', patientName: 'Sarah Miller', doctorId: 'doc-1', doctorName: 'Dr. James Wilson', date: '2026-01-30', time: '09:30', status: 'Scheduled', type: 'Consultation', notes: 'Blood pressure monitoring' },
  { id: 'apt-7', patientId: 'pat-1', patientName: 'John Smith', doctorId: 'doc-1', doctorName: 'Dr. James Wilson', date: '2026-01-25', time: '10:00', status: 'Completed', type: 'Consultation' },
  { id: 'apt-8', patientId: 'pat-8', patientName: 'Anna Kim', doctorId: 'doc-2', doctorName: 'Dr. Emily Chen', date: '2026-01-28', time: '16:00', status: 'Scheduled', type: 'Follow-up', notes: 'Epilepsy medication review' },
];

export const prescriptions: Prescription[] = [
  { id: 'presc-1', patientId: 'pat-1', patientName: 'John Smith', doctorId: 'doc-1', doctorName: 'Dr. James Wilson', date: '2026-01-25', medications: [{ name: 'Aspirin', dosage: '75mg', frequency: 'Once daily', duration: '30 days' }, { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily at night', duration: '30 days' }, { name: 'Metoprolol', dosage: '50mg', frequency: 'Twice daily', duration: '30 days' }], diagnosis: 'Coronary Artery Disease', notes: 'Monitor blood pressure weekly' },
  { id: 'presc-2', patientId: 'pat-2', patientName: 'Jane Doe', doctorId: 'doc-2', doctorName: 'Dr. Emily Chen', date: '2026-01-20', medications: [{ name: 'Sumatriptan', dosage: '50mg', frequency: 'As needed', duration: '30 days' }, { name: 'Propranolol', dosage: '40mg', frequency: 'Twice daily', duration: '30 days' }], diagnosis: 'Chronic Migraine', notes: 'Avoid triggers, maintain sleep schedule' },
  { id: 'presc-3', patientId: 'pat-3', patientName: 'Robert Taylor', doctorId: 'doc-1', doctorName: 'Dr. James Wilson', date: '2026-01-15', medications: [{ name: 'Clopidogrel', dosage: '75mg', frequency: 'Once daily', duration: '90 days' }, { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: '90 days' }, { name: 'Nitroglycerin', dosage: '0.4mg', frequency: 'As needed', duration: '90 days' }], diagnosis: 'Acute Myocardial Infarction', notes: 'Cardiac rehabilitation recommended' },
  { id: 'presc-4', patientId: 'pat-5', patientName: 'David Lee', doctorId: 'doc-2', doctorName: 'Dr. Emily Chen', date: '2026-01-18', medications: [{ name: 'Warfarin', dosage: '5mg', frequency: 'Once daily', duration: '180 days' }, { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', duration: '90 days' }], diagnosis: 'Ischemic Stroke', notes: 'Regular INR monitoring required' },
];

export const vitalSigns: VitalSign[] = [
  { id: 'vs-1', patientId: 'pat-1', patientName: 'John Smith', nurseId: 'nurse-1', date: '2026-01-27', time: '08:00', temperature: 98.4, bloodPressure: '130/85', heartRate: 78, oxygenLevel: 97, weight: 82 },
  { id: 'vs-2', patientId: 'pat-1', patientName: 'John Smith', nurseId: 'nurse-1', date: '2026-01-27', time: '14:00', temperature: 98.6, bloodPressure: '128/82', heartRate: 75, oxygenLevel: 98, weight: 82 },
  { id: 'vs-3', patientId: 'pat-3', patientName: 'Robert Taylor', nurseId: 'nurse-1', date: '2026-01-27', time: '06:00', temperature: 99.1, bloodPressure: '145/95', heartRate: 92, oxygenLevel: 94, notes: 'Elevated BP - notified Dr. Wilson' },
  { id: 'vs-4', patientId: 'pat-3', patientName: 'Robert Taylor', nurseId: 'nurse-1', date: '2026-01-27', time: '12:00', temperature: 98.8, bloodPressure: '140/90', heartRate: 88, oxygenLevel: 95 },
  { id: 'vs-5', patientId: 'pat-4', patientName: 'Emily Watson', nurseId: 'nurse-1', date: '2026-01-27', time: '08:00', temperature: 98.2, bloodPressure: '118/76', heartRate: 70, oxygenLevel: 99, weight: 63 },
  { id: 'vs-6', patientId: 'pat-5', patientName: 'David Lee', nurseId: 'nurse-2', date: '2026-01-27', time: '07:00', temperature: 98.5, bloodPressure: '150/92', heartRate: 80, oxygenLevel: 96, notes: 'Stable, continue monitoring' },
  { id: 'vs-7', patientId: 'pat-8', patientName: 'Anna Kim', nurseId: 'nurse-2', date: '2026-01-27', time: '09:00', temperature: 98.3, bloodPressure: '115/75', heartRate: 72, oxygenLevel: 99, weight: 58 },
];

export const departments: Department[] = [
  { id: 'dept-1', name: 'Cardiology', head: 'Dr. James Wilson', doctorsCount: 4, nursesCount: 6, bedsTotal: 30, bedsOccupied: 22 },
  { id: 'dept-2', name: 'Neurology', head: 'Dr. Emily Chen', doctorsCount: 3, nursesCount: 5, bedsTotal: 25, bedsOccupied: 18 },
  { id: 'dept-3', name: 'Orthopedics', head: 'Dr. Michael Brown', doctorsCount: 3, nursesCount: 4, bedsTotal: 20, bedsOccupied: 14 },
  { id: 'dept-4', name: 'Pediatrics', head: 'Dr. Rebecca Martinez', doctorsCount: 4, nursesCount: 8, bedsTotal: 35, bedsOccupied: 20 },
  { id: 'dept-5', name: 'Emergency', head: 'Dr. Andrew Davis', doctorsCount: 6, nursesCount: 10, bedsTotal: 15, bedsOccupied: 12 },
  { id: 'dept-6', name: 'ICU', head: 'Dr. James Wilson', doctorsCount: 5, nursesCount: 12, bedsTotal: 10, bedsOccupied: 8 },
];

export const billingRecords: BillingRecord[] = [
  { id: 'bill-1', patientId: 'pat-1', patientName: 'John Smith', date: '2026-01-25', items: [{ description: 'Consultation Fee', amount: 200, quantity: 1 }, { description: 'ECG', amount: 150, quantity: 1 }, { description: 'Blood Test Panel', amount: 350, quantity: 1 }, { description: 'Room Charges (per day)', amount: 500, quantity: 10 }], totalAmount: 5700, status: 'Pending', insuranceCovered: 4000 },
  { id: 'bill-2', patientId: 'pat-2', patientName: 'Jane Doe', date: '2026-01-20', items: [{ description: 'Consultation Fee', amount: 200, quantity: 1 }, { description: 'MRI Scan', amount: 1200, quantity: 1 }, { description: 'Medication', amount: 180, quantity: 1 }], totalAmount: 1580, status: 'Paid', insuranceCovered: 1200 },
  { id: 'bill-3', patientId: 'pat-3', patientName: 'Robert Taylor', date: '2026-01-15', items: [{ description: 'Emergency Admission', amount: 500, quantity: 1 }, { description: 'ICU Charges (per day)', amount: 2000, quantity: 15 }, { description: 'Cardiac Catheterization', amount: 5000, quantity: 1 }, { description: 'Medications', amount: 2500, quantity: 1 }], totalAmount: 38000, status: 'Pending', insuranceCovered: 30000 },
  { id: 'bill-4', patientId: 'pat-4', patientName: 'Emily Watson', date: '2026-01-22', items: [{ description: 'Surgery - Femur Fixation', amount: 8000, quantity: 1 }, { description: 'Anesthesia', amount: 1500, quantity: 1 }, { description: 'Room Charges (per day)', amount: 500, quantity: 5 }, { description: 'Physiotherapy', amount: 300, quantity: 3 }], totalAmount: 12900, status: 'Pending', insuranceCovered: 10000 },
  { id: 'bill-5', patientId: 'pat-7', patientName: 'Thomas Brown', date: '2026-01-08', items: [{ description: 'Hip Replacement Surgery', amount: 15000, quantity: 1 }, { description: 'Implant Cost', amount: 8000, quantity: 1 }, { description: 'Room Charges', amount: 500, quantity: 14 }], totalAmount: 30000, status: 'Paid', insuranceCovered: 25000 },
];
