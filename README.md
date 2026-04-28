MediCare HMS — Hospital Management System
A full-stack hospital management system built with React + TypeScript on the frontend and Django REST Framework on the backend. Designed for Kenyan healthcare facilities, it supports five distinct user roles with role-specific dashboards, M-Pesa billing integration, live audit logging, and a mandatory password-change flow on first login.


Table of Contents
Features
Tech Stack
Project Structure
Getting Started
User Roles & Access
API Reference
M-Pesa Integration
Audit Logging
Demo Credentials


Features
Role-based access control — five roles (Administrator, Doctor, Nurse, Receptionist, Patient), each with a protected dashboard and scoped data access
Forced password change — all new users are flagged must_change_password=True and redirected to a change-password screen before accessing any page
Live audit logs — every login attempt, patient registration, billing action, and user management event is recorded in real time and visible to the administrator
M-Pesa billing — patients can pay bills via M-Pesa STK Push (Safaricom Daraja API); a mock payment endpoint is included for local development
Partial payment tracking — billing records track paidAmount, totalAmount, insuranceCovered, and payment_status (Unpaid / Partial / Paid)
PDF & Excel export — the reports module lets the administrator export hospital analytics as PDF or XLSX
Recharts dashboards — revenue over time, appointment status distribution, and patient demographics rendered as interactive charts
Patient-scoped billing — patients can only see their own billing records; all other roles see all records


Tech Stack
Frontend
Package
Version
Purpose
React
19
UI framework
TypeScript
5.9
Type safety
Vite
7
Build tool & dev server
Tailwind CSS
4
Utility-first styling
React Router DOM
7
Client-side routing
Recharts
3
Data visualisation
jsPDF + autoTable
4 / 5
PDF export
xlsx
0.18
Excel export

Backend
Package
Purpose
Django 6
Web framework
Django REST Framework
REST API
django-cors-headers
Cross-origin requests
SQLite
Default database (swap for Postgres in production)



Project Structure
Hospital-Management/

├── django_backend/

│   ├── api/

│   │   ├── models.py          # User, Patient, Doctor, Nurse, Appointment,

│   │   │                      # Prescription, VitalSign, Department,

│   │   │                      # BillingRecord, AuditLog

│   │   ├── serializers.py     # DRF serializers for all models

│   │   ├── views.py           # ViewSets + login, change-password,

│   │   │                      # M-Pesa, mock-payment endpoints

│   │   ├── urls.py            # API route registration

│   │   ├── mpesa.py           # Safaricom Daraja STK Push client

│   │   └── migrations/        # Database migrations

│   └── hospital_system/

│       └── settings.py        # Django configuration

│

└── src/

    ├── App.tsx                # Routes + ProtectedRoute guard

    ├── context/

    │   ├── AuthContext.tsx    # Auth state, login, logout, updatePassword

    │   └── DataContext.tsx    # Shared data fetching

    ├── pages/

    │   ├── Login.tsx          # Role selector + sign-in form

    │   ├── ChangePassword.tsx # Forced first-login password change

    │   ├── admin/             # AdminDashboard, Doctors, Nurses, Patients,

    │   │                      # Receptionists, Departments, Appointments,

    │   │                      # Billing, Reports, AuditLogs

    │   ├── doctor/            # Dashboard, Patients, Appointments,

    │   │                      # Prescriptions, Schedule

    │   ├── nurse/             # Dashboard, Patients, Vitals,

    │   │                      # Medications, Ward

    │   ├── patient/           # Dashboard, Appointments, Records,

    │   │                      # Prescriptions, Billing

    │   └── receptionist/      # Dashboard, Patients, Appointments

    ├── types/index.ts         # Shared TypeScript interfaces

    └── utils/

        ├── api.ts             # All fetch helpers (get/post/put/remove)

        └── aiEngine.ts        # AI assistant utilities


Getting Started
Prerequisites
Python 3.11+
Node.js 18+
pip
1. Clone the repository
git clone https://github.com/K-error1/Hospital-Management.git

cd Hospital-Management
2. Backend setup
cd django_backend

# Install dependencies

pip install django djangorestframework django-cors-headers

# Apply migrations

python manage.py migrate

# Seed demo data (if a management command is available)

python manage.py seed_data

# Start the development server

python manage.py runserver

The API will be available at http://127.0.0.1:8000/api/.
3. Frontend setup
# From the project root

npm install

npm run dev

The app will be available at http://localhost:5173.

Note: The frontend expects the Django server running at http://127.0.0.1:8000. This is configured in src/utils/api.ts. Update API_URL if your backend runs on a different host or port.


User Roles & Access
Role
Login Email (demo)
Default Password
Dashboard Path
Administrator
admin@medicare.co.ke
password123
/administrator
Doctor
otieno@medicare.co.ke
password123
/doctor
Nurse
akinyi@medicare.co.ke
password123
/nurse
Receptionist
alice@medicare.co.ke
password123
/receptionist
Patient
john@email.co.ke
password123
/patient


All accounts are created with must_change_password=True. On first login, users are redirected to /change-password and must set a new password (min. 8 characters, must differ from the current one) before accessing their dashboard.
What each role can do
Administrator — full system access: manage doctors, nurses, receptionists, patients, departments, appointments, billing, view reports with chart exports, and read the live audit log.

Doctor — view assigned patients, manage appointments, write prescriptions, view personal schedule.

Nurse — monitor patients, record vital signs, manage medications, view ward assignments.

Receptionist — register new patients, manage appointments.

Patient — view personal dashboard, appointments, medical records, prescriptions, and billing with M-Pesa payment option.


API Reference
Base URL: http://127.0.0.1:8000/api/
Resource endpoints (Django REST Framework)
Method
Endpoint
Description
GET/POST
/users/
List or create users
GET/PUT/DELETE
/users/{id}/
Retrieve, update, or delete a user
GET/POST
/patients/
List or register patients
GET/POST
/doctors/
List or add doctors
GET/POST
/nurses/
List or add nurses
GET/POST
/appointments/
List or create appointments
GET/POST
/prescriptions/
List or create prescriptions
GET/POST
/vitals/
List or record vital signs
GET/POST
/departments/
List or create departments
GET/POST
/billing/
List or create billing records
GET
/audit-logs/
Read-only list of all audit events

Auth & action endpoints
Method
Endpoint
Description
POST
/auth/login/
Authenticate and receive user object
POST
/auth/change-password/
Change password for authenticated user
POST
/payment/mpesa/
Initiate real M-Pesa STK Push
POST
/payment/mock-payment/
Simulate payment (local dev)

Example: Login
curl -X POST http://127.0.0.1:8000/api/auth/login/ \

  -H "Content-Type: application/json" \

  -d '{"email": "admin@medicare.co.ke", "password": "password123"}'
Example: Change password
curl -X POST http://127.0.0.1:8000/api/auth/change-password/ \

  -H "Content-Type: application/json" \

  -d '{

    "email": "admin@medicare.co.ke",

    "old_password": "password123",

    "new_password": "SecurePass2026",

    "confirm_password": "SecurePass2026"

  }'


M-Pesa Integration
The system integrates with Safaricom Daraja API for M-Pesa STK Push payments.

The MPesaClient class in django_backend/api/mpesa.py handles token generation and STK Push requests. For local development, the actual Daraja HTTP call is mocked — the mock-payment endpoint instead updates the BillingRecord directly, simulating a 2-second processing delay.

To enable real M-Pesa payments:

Register on the Safaricom Developer Portal
Obtain your consumer_key, consumer_secret, and passkey
Replace the placeholder values in mpesa.py
Uncomment the real requests.post(...) call in initiate_stk_push
Set a valid public CallBackURL for payment confirmation

Phone numbers are automatically normalised from 07XXXXXXXX to 2547XXXXXXXX format.


Audit Logging
Every significant action in the system is recorded to the AuditLog table with the user's email, role, action name, details, and a UTC timestamp.

Events that are currently logged:

User login (success and failure)
Password change
User created / updated / deleted
Patient registered / updated / deleted
Bill generated

The AuditLog endpoint (GET /api/audit-logs/) is read-only and returns entries ordered by most recent first. The Administrator dashboard displays these with real-time refresh, timestamp formatting in East Africa Time (en-KE locale), and colour-coded security events (login/password actions highlighted in red).

To add logging to additional actions, call the log_action(user, action, details) helper inside any viewset's perform_create, perform_update, or perform_destroy method in views.py.


Demo Credentials
Role
Email
Password
Administrator
admin@medicare.co.ke
password123
Doctor
otieno@medicare.co.ke
password123
Nurse
akinyi@medicare.co.ke
password123
Receptionist
alice@medicare.co.ke
password123
Patient
john@email.co.ke
password123


All demo accounts will prompt for a password change on first login. Use any password of 8+ characters that differs from password123.


