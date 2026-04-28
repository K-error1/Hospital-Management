from django.core.management.base import BaseCommand
from api.models import User, Patient, Doctor, Nurse, Appointment, Prescription, VitalSign, Department, BillingRecord


class Command(BaseCommand):
    help = 'Seeds database with complete Kenyan dummy data'

    def handle(self, *args, **kwargs):
        # ── Users ──────────────────────────────────────────────────────────────
        users = [
            {'id': 'admin-1', 'name': 'Sarah Wanjiru', 'email': 'admin@medicare.co.ke', 'role': 'administrator', 'phone': '+254 712 345 678'},
            {'id': 'doc-1', 'name': 'Dr. James Otieno', 'email': 'otieno@medicare.co.ke', 'role': 'doctor', 'specialization': 'Cardiology', 'department': 'Cardiology', 'phone': '+254 722 100 200'},
            {'id': 'doc-2', 'name': 'Dr. Emily Mutua', 'email': 'mutua@medicare.co.ke', 'role': 'doctor', 'specialization': 'Neurology', 'department': 'Neurology', 'phone': '+254 733 400 500'},
            {'id': 'doc-3', 'name': 'Dr. Michael Kamau', 'email': 'kamau@medicare.co.ke', 'role': 'doctor', 'specialization': 'Orthopedics', 'department': 'Orthopedics', 'phone': '+254 755 600 700'},
            {'id': 'nurse-1', 'name': 'Lisa Akinyi', 'email': 'akinyi@medicare.co.ke', 'role': 'nurse', 'department': 'Cardiology', 'phone': '+254 799 800 900'},
            {'id': 'nurse-2', 'name': 'Maria Wamalwa', 'email': 'wamalwa@medicare.co.ke', 'role': 'nurse', 'department': 'Neurology', 'phone': '+254 711 222 333'},
            {'id': 'pat-1', 'name': 'John Ochieng', 'email': 'john@email.co.ke', 'role': 'patient', 'phone': '+254 744 555 666'},
            {'id': 'pat-2', 'name': 'Jane Njoroge', 'email': 'jane@email.co.ke', 'role': 'patient', 'phone': '+254 777 888 999'},
            {'id': 'pat-3', 'name': 'Robert Kipchoge', 'email': 'robert@email.co.ke', 'role': 'patient', 'phone': '+254 720 111 222'},
            {'id': 'recep-1', 'name': 'Alice Wambui', 'email': 'alice@medicare.co.ke', 'role': 'receptionist', 'phone': '+254 700 333 444'},
        ]
        for u in users:
            User.objects.update_or_create(id=u['id'], defaults=u)

        # ── Doctors ─────────────────────────────────────────────────────────────
        doctors = [
            {'id': 'doc-1', 'name': 'Dr. James Otieno', 'specialization': 'Cardiology', 'department': 'Cardiology', 'phone': '+254 722 100 200', 'email': 'otieno@medicare.co.ke', 'status': 'Available', 'patientsCount': 12, 'experience': '15 years', 'qualification': 'MD, FACC'},
            {'id': 'doc-2', 'name': 'Dr. Emily Mutua', 'specialization': 'Neurology', 'department': 'Neurology', 'phone': '+254 733 400 500', 'email': 'mutua@medicare.co.ke', 'status': 'Busy', 'patientsCount': 9, 'experience': '12 years', 'qualification': 'MD, PhD'},
            {'id': 'doc-3', 'name': 'Dr. Michael Kamau', 'specialization': 'Orthopedics', 'department': 'Orthopedics', 'phone': '+254 755 600 700', 'email': 'kamau@medicare.co.ke', 'status': 'In Surgery', 'patientsCount': 8, 'experience': '10 years', 'qualification': 'MD, FAAOS'},
            {'id': 'doc-4', 'name': 'Dr. Rebecca Naliaka', 'specialization': 'Pediatrics', 'department': 'Pediatrics', 'phone': '+254 766 800 900', 'email': 'naliaka@medicare.co.ke', 'status': 'Available', 'patientsCount': 15, 'experience': '8 years', 'qualification': 'MD, FAAP'},
        ]
        for d in doctors:
            Doctor.objects.update_or_create(id=d['id'], defaults=d)

        # ── Nurses ──────────────────────────────────────────────────────────────
        nurses = [
            {'id': 'nurse-1', 'name': 'Lisa Akinyi', 'department': 'Cardiology', 'shift': 'Morning', 'phone': '+254 799 800 900', 'email': 'akinyi@medicare.co.ke', 'status': 'On Duty', 'assignedWard': 'Ward A - 3rd Floor', 'patientsCount': 6},
            {'id': 'nurse-2', 'name': 'Maria Wamalwa', 'department': 'Neurology', 'shift': 'Afternoon', 'phone': '+254 711 222 333', 'email': 'wamalwa@medicare.co.ke', 'status': 'On Duty', 'assignedWard': 'Ward B - 4th Floor', 'patientsCount': 5},
            {'id': 'nurse-3', 'name': 'Grace Chebet', 'department': 'Orthopedics', 'shift': 'Night', 'phone': '+254 700 111 222', 'email': 'chebet@medicare.co.ke', 'status': 'Off Duty', 'assignedWard': 'Ward C - 2nd Floor', 'patientsCount': 4},
        ]
        for n in nurses:
            Nurse.objects.update_or_create(id=n['id'], defaults=n)

        # ── Patients ────────────────────────────────────────────────────────────
        patients = [
            {'id': 'pat-1', 'name': 'John Ochieng', 'age': 45, 'gender': 'Male', 'bloodGroup': 'A+', 'phone': '+254 744 555 666', 'email': 'john@email.co.ke', 'address': 'Ngong Road, Nairobi', 'admissionDate': '2026-01-15', 'status': 'Admitted', 'assignedDoctor': 'doc-1', 'assignedNurse': 'nurse-1', 'room': '301-A', 'diagnosis': 'Coronary Artery Disease'},
            {'id': 'pat-2', 'name': 'Jane Njoroge', 'age': 32, 'gender': 'Female', 'bloodGroup': 'B+', 'phone': '+254 777 888 999', 'email': 'jane@email.co.ke', 'address': 'Nyali, Mombasa', 'admissionDate': '2026-01-18', 'status': 'Outpatient', 'assignedDoctor': 'doc-2', 'assignedNurse': 'nurse-2', 'room': None, 'diagnosis': 'Migraine'},
            {'id': 'pat-3', 'name': 'Robert Kipchoge', 'age': 58, 'gender': 'Male', 'bloodGroup': 'O-', 'phone': '+254 720 111 222', 'email': 'robert@email.co.ke', 'address': 'Milimani, Kisumu', 'admissionDate': '2026-01-10', 'status': 'Critical', 'assignedDoctor': 'doc-1', 'assignedNurse': 'nurse-1', 'room': 'ICU-2', 'diagnosis': 'Acute Myocardial Infarction'},
            {'id': 'pat-4', 'name': 'Emily Nduta', 'age': 28, 'gender': 'Female', 'bloodGroup': 'AB+', 'phone': '+254 788 333 444', 'email': 'emily@email.co.ke', 'address': 'Westlands, Nairobi', 'admissionDate': '2026-01-20', 'status': 'Admitted', 'assignedDoctor': 'doc-3', 'assignedNurse': 'nurse-1', 'room': '205-B', 'diagnosis': 'Fractured Femur'},
            {'id': 'pat-5', 'name': 'David Mwangi', 'age': 67, 'gender': 'Male', 'bloodGroup': 'A-', 'phone': '+254 700 999 000', 'email': 'david@email.co.ke', 'address': 'Nakuru Town, Nakuru', 'admissionDate': '2026-01-12', 'status': 'Admitted', 'assignedDoctor': 'doc-2', 'assignedNurse': 'nurse-2', 'room': '402-C', 'diagnosis': 'Stroke Recovery'},
            {'id': 'pat-6', 'name': 'Sarah Atieno', 'age': 41, 'gender': 'Female', 'bloodGroup': 'B-', 'phone': '+254 701 234 567', 'email': 'sarah@email.co.ke', 'address': 'Kibera, Nairobi', 'admissionDate': '2026-01-22', 'status': 'Outpatient', 'assignedDoctor': 'doc-1', 'assignedNurse': 'nurse-1', 'room': None, 'diagnosis': 'Hypertension'},
            {'id': 'pat-7', 'name': 'Thomas Omondi', 'age': 73, 'gender': 'Male', 'bloodGroup': 'O+', 'phone': '+254 722 345 678', 'email': 'thomas@email.co.ke', 'address': 'Runda, Nairobi', 'admissionDate': '2026-01-08', 'status': 'Discharged', 'assignedDoctor': 'doc-3', 'assignedNurse': 'nurse-2', 'room': None, 'diagnosis': 'Hip Replacement Recovery'},
            {'id': 'pat-8', 'name': 'Anna Wambui', 'age': 35, 'gender': 'Female', 'bloodGroup': 'A+', 'phone': '+254 733 567 890', 'email': 'anna@email.co.ke', 'address': 'Karen, Nairobi', 'admissionDate': '2026-01-25', 'status': 'Admitted', 'assignedDoctor': 'doc-2', 'assignedNurse': 'nurse-2', 'room': '310-A', 'diagnosis': 'Epilepsy Management'},
        ]
        for p in patients:
            Patient.objects.update_or_create(id=p['id'], defaults=p)

        # ── Departments ─────────────────────────────────────────────────────────
        departments = [
            {'id': 'dept-1', 'name': 'Cardiology', 'head': 'Dr. James Otieno', 'doctorsCount': 4, 'nursesCount': 6, 'bedsTotal': 30, 'bedsOccupied': 22},
            {'id': 'dept-2', 'name': 'Neurology', 'head': 'Dr. Emily Mutua', 'doctorsCount': 3, 'nursesCount': 5, 'bedsTotal': 25, 'bedsOccupied': 15},
            {'id': 'dept-3', 'name': 'Orthopedics', 'head': 'Dr. Michael Kamau', 'doctorsCount': 3, 'nursesCount': 4, 'bedsTotal': 20, 'bedsOccupied': 10},
            {'id': 'dept-4', 'name': 'Pediatrics', 'head': 'Dr. Rebecca Naliaka', 'doctorsCount': 2, 'nursesCount': 4, 'bedsTotal': 20, 'bedsOccupied': 12},
            {'id': 'dept-5', 'name': 'Emergency', 'head': 'Dr. James Otieno', 'doctorsCount': 5, 'nursesCount': 8, 'bedsTotal': 15, 'bedsOccupied': 13},
        ]
        for dept in departments:
            Department.objects.update_or_create(id=dept['id'], defaults=dept)

        # ── Appointments ────────────────────────────────────────────────────────
        appointments = [
            {'id': 'apt-1', 'patientId': 'pat-1', 'patientName': 'John Ochieng', 'doctorId': 'doc-1', 'doctorName': 'Dr. James Otieno', 'date': '2026-01-28', 'time': '09:00', 'status': 'Scheduled', 'type': 'Consultation', 'notes': 'Regular cardiac follow-up'},
            {'id': 'apt-2', 'patientId': 'pat-2', 'patientName': 'Jane Njoroge', 'doctorId': 'doc-2', 'doctorName': 'Dr. Emily Mutua', 'date': '2026-01-28', 'time': '10:30', 'status': 'Scheduled', 'type': 'Follow-up', 'notes': 'MRI results review'},
            {'id': 'apt-3', 'patientId': 'pat-3', 'patientName': 'Robert Kipchoge', 'doctorId': 'doc-1', 'doctorName': 'Dr. James Otieno', 'date': '2026-01-27', 'time': '08:00', 'status': 'Completed', 'type': 'Emergency', 'notes': 'ICU assessment'},
            {'id': 'apt-4', 'patientId': 'pat-4', 'patientName': 'Emily Nduta', 'doctorId': 'doc-3', 'doctorName': 'Dr. Michael Kamau', 'date': '2026-01-29', 'time': '11:00', 'status': 'Scheduled', 'type': 'Consultation', 'notes': 'Post-surgery check'},
            {'id': 'apt-5', 'patientId': 'pat-5', 'patientName': 'David Mwangi', 'doctorId': 'doc-2', 'doctorName': 'Dr. Emily Mutua', 'date': '2026-01-26', 'time': '14:00', 'status': 'Completed', 'type': 'Follow-up', 'notes': 'Stroke recovery assessment'},
            {'id': 'apt-6', 'patientId': 'pat-1', 'patientName': 'John Ochieng', 'doctorId': 'doc-1', 'doctorName': 'Dr. James Otieno', 'date': '2026-01-20', 'time': '09:30', 'status': 'Completed', 'type': 'Consultation', 'notes': 'Initial cardiac assessment'},
            {'id': 'apt-7', 'patientId': 'pat-6', 'patientName': 'Sarah Atieno', 'doctorId': 'doc-1', 'doctorName': 'Dr. James Otieno', 'date': '2026-01-30', 'time': '15:00', 'status': 'Scheduled', 'type': 'Follow-up', 'notes': 'BP medication review'},
            {'id': 'apt-8', 'patientId': 'pat-8', 'patientName': 'Anna Wambui', 'doctorId': 'doc-2', 'doctorName': 'Dr. Emily Mutua', 'date': '2026-01-28', 'time': '13:00', 'status': 'In Progress', 'type': 'Consultation', 'notes': 'Seizure management review'},
        ]
        for a in appointments:
            Appointment.objects.update_or_create(id=a['id'], defaults=a)

        # ── Prescriptions ───────────────────────────────────────────────────────
        prescriptions = [
            {
                'id': 'presc-1',
                'patientId': 'pat-1', 'patientName': 'John Ochieng',
                'doctorId': 'doc-1', 'doctorName': 'Dr. James Otieno',
                'date': '2026-01-20', 'diagnosis': 'Coronary Artery Disease',
                'medications': [
                    {'name': 'Aspirin', 'dosage': '75mg', 'frequency': 'Once daily', 'duration': '6 months'},
                    {'name': 'Atorvastatin', 'dosage': '40mg', 'frequency': 'Once daily at night', 'duration': '6 months'},
                    {'name': 'Metoprolol', 'dosage': '25mg', 'frequency': 'Twice daily', 'duration': '3 months'},
                ],
                'notes': 'Avoid strenuous activity. Monitor blood pressure daily.',
            },
            {
                'id': 'presc-2',
                'patientId': 'pat-2', 'patientName': 'Jane Njoroge',
                'doctorId': 'doc-2', 'doctorName': 'Dr. Emily Mutua',
                'date': '2026-01-18', 'diagnosis': 'Migraine',
                'medications': [
                    {'name': 'Sumatriptan', 'dosage': '50mg', 'frequency': 'As needed (max 2/day)', 'duration': '30 days'},
                    {'name': 'Paracetamol', 'dosage': '500mg', 'frequency': 'Every 6 hours if needed', 'duration': '7 days'},
                ],
                'notes': 'Avoid bright lights and loud noise during attacks.',
            },
            {
                'id': 'presc-3',
                'patientId': 'pat-5', 'patientName': 'David Mwangi',
                'doctorId': 'doc-2', 'doctorName': 'Dr. Emily Mutua',
                'date': '2026-01-15', 'diagnosis': 'Stroke Recovery',
                'medications': [
                    {'name': 'Warfarin', 'dosage': '5mg', 'frequency': 'Once daily', 'duration': '12 months'},
                    {'name': 'Amlodipine', 'dosage': '10mg', 'frequency': 'Once daily', 'duration': '6 months'},
                    {'name': 'Physiotherapy exercises', 'dosage': 'As prescribed', 'frequency': 'Daily', 'duration': '6 months'},
                ],
                'notes': 'INR monitoring every 2 weeks. Strict physiotherapy adherence required.',
            },
        ]
        for p in prescriptions:
            Prescription.objects.update_or_create(id=p['id'], defaults=p)

        # ── Vital Signs ─────────────────────────────────────────────────────────
        vitals = [
            {'id': 'vital-1', 'patientId': 'pat-1', 'patientName': 'John Ochieng', 'nurseId': 'nurse-1', 'date': '2026-01-27', 'time': '08:00', 'temperature': 37.0, 'bloodPressure': '145/90', 'heartRate': 88, 'oxygenLevel': 96, 'weight': 82.5, 'notes': 'Slightly elevated BP'},
            {'id': 'vital-2', 'patientId': 'pat-3', 'patientName': 'Robert Kipchoge', 'nurseId': 'nurse-1', 'date': '2026-01-27', 'time': '08:30', 'temperature': 37.9, 'bloodPressure': '160/100', 'heartRate': 102, 'oxygenLevel': 91, 'weight': 75.0, 'notes': 'Critical — fever and low SpO2. Doctor notified.'},
            {'id': 'vital-3', 'patientId': 'pat-4', 'patientName': 'Emily Nduta', 'nurseId': 'nurse-1', 'date': '2026-01-27', 'time': '09:00', 'temperature': 37.2, 'bloodPressure': '118/75', 'heartRate': 74, 'oxygenLevel': 99, 'weight': 60.0, 'notes': None},
            {'id': 'vital-4', 'patientId': 'pat-2', 'patientName': 'Jane Njoroge', 'nurseId': 'nurse-2', 'date': '2026-01-27', 'time': '10:00', 'temperature': 36.9, 'bloodPressure': '120/80', 'heartRate': 72, 'oxygenLevel': 98, 'weight': 58.5, 'notes': None},
            {'id': 'vital-5', 'patientId': 'pat-5', 'patientName': 'David Mwangi', 'nurseId': 'nurse-2', 'date': '2026-01-27', 'time': '10:30', 'temperature': 37.2, 'bloodPressure': '135/85', 'heartRate': 80, 'oxygenLevel': 95, 'weight': 78.0, 'notes': 'Mild fever. Monitoring.'},
            {'id': 'vital-6', 'patientId': 'pat-1', 'patientName': 'John Ochieng', 'nurseId': 'nurse-1', 'date': '2026-01-26', 'time': '08:00', 'temperature': 36.8, 'bloodPressure': '140/88', 'heartRate': 84, 'oxygenLevel': 97, 'weight': 82.5, 'notes': None},
            {'id': 'vital-7', 'patientId': 'pat-8', 'patientName': 'Anna Wambui', 'nurseId': 'nurse-2', 'date': '2026-01-27', 'time': '11:00', 'temperature': 37.1, 'bloodPressure': '122/78', 'heartRate': 76, 'oxygenLevel': 98, 'weight': 55.0, 'notes': None},
        ]
        for v in vitals:
            VitalSign.objects.update_or_create(id=v['id'], defaults=v)

        # ── Billing ─────────────────────────────────────────────────────────────
        billing = [
            {'id': 'bill-1', 'patientId': 'pat-1', 'patientName': 'John Ochieng', 'date': '2026-01-25', 'totalAmount': 570000, 'status': 'Pending', 'insuranceCovered': 400000, 'items': [{'description': 'Consultation Fee', 'amount': 20000, 'quantity': 1}, {'description': 'ECG', 'amount': 15000, 'quantity': 1}, {'description': 'Blood Test Panel', 'amount': 35000, 'quantity': 1}, {'description': 'Room Charges (per day)', 'amount': 50000, 'quantity': 10}]},
            {'id': 'bill-2', 'patientId': 'pat-2', 'patientName': 'Jane Njoroge', 'date': '2026-01-20', 'totalAmount': 158000, 'status': 'Paid', 'insuranceCovered': 120000, 'paymentMethod': 'bank', 'paymentRef': 'BANK-202601201', 'items': [{'description': 'Consultation Fee', 'amount': 20000, 'quantity': 1}, {'description': 'MRI Scan', 'amount': 120000, 'quantity': 1}, {'description': 'Medication', 'amount': 18000, 'quantity': 1}]},
            {'id': 'bill-3', 'patientId': 'pat-3', 'patientName': 'Robert Kipchoge', 'date': '2026-01-15', 'totalAmount': 3800000, 'status': 'Pending', 'insuranceCovered': 3000000, 'items': [{'description': 'Emergency Admission', 'amount': 50000, 'quantity': 1}, {'description': 'ICU Charges (per day)', 'amount': 200000, 'quantity': 15}, {'description': 'Cardiac Catheterization', 'amount': 500000, 'quantity': 1}, {'description': 'Medications', 'amount': 250000, 'quantity': 1}]},
            {'id': 'bill-4', 'patientId': 'pat-4', 'patientName': 'Emily Nduta', 'date': '2026-01-22', 'totalAmount': 850000, 'status': 'Pending', 'insuranceCovered': 700000, 'items': [{'description': 'Surgery Fee', 'amount': 500000, 'quantity': 1}, {'description': 'Anaesthesia', 'amount': 120000, 'quantity': 1}, {'description': 'Ward Charges (per day)', 'amount': 30000, 'quantity': 5}, {'description': 'X-Ray', 'amount': 80000, 'quantity': 1}]},
            {'id': 'bill-5', 'patientId': 'pat-5', 'patientName': 'David Mwangi', 'date': '2026-01-14', 'totalAmount': 420000, 'status': 'Paid', 'insuranceCovered': 350000, 'paymentMethod': 'mpesa', 'paymentRef': 'MPESA-QWTX09Z', 'items': [{'description': 'Consultation Fee', 'amount': 20000, 'quantity': 1}, {'description': 'CT Scan', 'amount': 200000, 'quantity': 1}, {'description': 'Physiotherapy Sessions', 'amount': 25000, 'quantity': 8}]},
        ]
        for b in billing:
            BillingRecord.objects.update_or_create(id=b['id'], defaults=b)

        self.stdout.write(self.style.SUCCESS(
            'Successfully seeded: 9 users, 4 doctors, 3 nurses, 8 patients, 5 departments, '
            '8 appointments, 3 prescriptions, 7 vitals, 5 billing records!'
        ))
