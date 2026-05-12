# 🏥 MediCare HMS — Hospital Management System

A full-stack hospital management system built with **React + TypeScript** on the frontend and **Django REST Framework** on the backend. Designed for Kenyan healthcare facilities, it supports five distinct user roles with granular access control, real-time audit logging, M-Pesa payment integration, and interactive dashboards.

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [👥 User Roles & Access](#-user-roles--access)
- [📡 API Reference](#-api-reference)
- [💳 M-Pesa Integration](#-m-pesa-integration)
- [📝 Audit Logging](#-audit-logging)
- [🔐 Demo Credentials](#-demo-credentials)

---

## ✨ Features

- ✅ **Role-Based Access Control** — Five roles (Administrator, Doctor, Nurse, Receptionist, Patient), each with protected dashboards and scoped data access
- 🔑 **Forced Password Change** — New users must change passwords before accessing any page
- 📊 **Live Audit Logs** — Real-time recording of logins, registrations, billing actions, and user management events
- 💰 **M-Pesa Billing** — Patients can pay bills via M-Pesa STK Push; mock payment endpoint included for development
- 💳 **Partial Payment Tracking** — Track `paidAmount`, `totalAmount`, `insuranceCovered`, and `payment_status`
- 📄 **PDF & Excel Export** — Export hospital analytics as PDF or XLSX
- 📈 **Interactive Dashboards** — Revenue charts, appointment distributions, and patient demographics powered by Recharts
- 👤 **Patient-Scoped Billing** — Patients see only their billing records; other roles see all records

---

## 🛠️ Tech Stack

### Frontend

| Package | Version | Purpose |
|---------|---------|---------|
| React | 19 | UI framework |
| TypeScript | 5.9 | Type safety |
| Vite | 7 | Build tool & dev server |
| Tailwind CSS | 4 | Utility-first styling |
| React Router DOM | 7 | Client-side routing |
| Recharts | 3 | Data visualization |
| jsPDF + autoTable | 4 / 5 | PDF export |
| xlsx | 0.18 | Excel export |

### Backend

| Package | Purpose |
|---------|---------|
| Django 6 | Web framework |
| Django REST Framework | REST API |
| django-cors-headers | Cross-origin requests |
| SQLite | Default database (Postgres recommended for production) |

---

## 📁 Project Structure

```
Hospital-Management/
├── django_backend/
│   ├── api/
│   │   ├── models.py              # Core models (User, Patient, Doctor, Appointment, etc.)
│   │   ├── serializers.py         # DRF serializers
│   │   ├── views.py               # ViewSets & endpoints
│   │   ├── urls.py                # API routes
│   │   ├── mpesa.py               # M-Pesa Daraja client
│   │   └── migrations/            # Database migrations
│   └── hospital_system/
│       └── settings.py            # Django configuration
│
└── src/
    ├── App.tsx                    # Routes & ProtectedRoute guard
    ├── context/
    │   ├── AuthContext.tsx        # Auth state management
    │   └── DataContext.tsx        # Shared data fetching
    ├── pages/
    │   ├── Login.tsx              # Role selector & sign-in
    │   ├── ChangePassword.tsx     # Forced password change
    │   ├── admin/                 # Admin dashboard & modules
    │   ├── doctor/                # Doctor dashboard & modules
    │   ├── nurse/                 # Nurse dashboard & modules
    │   ├── patient/               # Patient dashboard & modules
    │   └── receptionist/          # Receptionist dashboard & modules
    ├── types/index.ts             # TypeScript interfaces
    └── utils/
        ├── api.ts                 # Fetch helpers
        └── aiEngine.ts            # AI assistant utilities
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- npm or yarn
- pip

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/K-error1/Hospital-Management.git
cd Hospital-Management
```

### 2️⃣ Backend Setup

```bash
cd django_backend

# Install dependencies
pip install django djangorestframework django-cors-headers

# Apply migrations
python manage.py migrate

# Seed demo data (if available)
python manage.py seed_data

# Start the development server
python manage.py runserver
```

The API will be available at **http://127.0.0.1:8000/api/**

### 3️⃣ Frontend Setup

```bash
# From the project root
npm install
npm run dev
```

The app will be available at **http://localhost:5173**

> **Note:** The frontend expects Django running at `http://127.0.0.1:8000`. Update `API_URL` in `src/utils/api.ts` if your backend runs on a different host or port.

---

## 👥 User Roles & Access

### Login Credentials

| Role | Email | Password | Dashboard Path |
|------|-------|----------|-----------------|
| 👨‍💼 Administrator | `admin@medicare.co.ke` | `password123` | `/administrator` |
| 👨‍⚕️ Doctor | `otieno@medicare.co.ke` | `password123` | `/doctor` |
| 👩‍⚕️ Nurse | `akinyi@medicare.co.ke` | `password123` | `/nurse` |
| 👨‍💻 Receptionist | `alice@medicare.co.ke` | `password123` | `/receptionist` |
| 🧑‍🤝‍🧑 Patient | `john@email.co.ke` | `password123` | `/patient` |

> ⚠️ **Important:** All accounts are created with `must_change_password=True`. On first login, users must set a new password (min. 8 characters, must differ from the current one).

### Role Permissions

| Role | Permissions |
|------|-------------|
| **Administrator** | Full system access: manage doctors, nurses, receptionists, patients, departments, appointments, billing, export reports, view live audit logs |
| **Doctor** | View assigned patients, manage appointments, write prescriptions, view personal schedule |
| **Nurse** | Monitor patients, record vital signs, manage medications, view ward assignments |
| **Receptionist** | Register new patients, manage appointments |
| **Patient** | View personal dashboard, appointments, medical records, prescriptions, billing with M-Pesa payment |

---

## 📡 API Reference

**Base URL:** `http://127.0.0.1:8000/api/`

### Resource Endpoints (CRUD)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/users/` | List or create users |
| GET/PUT/DELETE | `/users/{id}/` | Retrieve, update, or delete a user |
| GET/POST | `/patients/` | List or register patients |
| GET/POST | `/doctors/` | List or add doctors |
| GET/POST | `/nurses/` | List or add nurses |
| GET/POST | `/appointments/` | List or create appointments |
| GET/POST | `/prescriptions/` | List or create prescriptions |
| GET/POST | `/vitals/` | List or record vital signs |
| GET/POST | `/departments/` | List or create departments |
| GET/POST | `/billing/` | List or create billing records |
| GET | `/audit-logs/` | Read-only list of all audit events |

### Authentication & Action Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login/` | Authenticate and receive user object |
| POST | `/auth/change-password/` | Change password for authenticated user |
| POST | `/payment/mpesa/` | Initiate real M-Pesa STK Push |
| POST | `/payment/mock-payment/` | Simulate payment (local dev) |

### Example Requests

**Login:**
```bash
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@medicare.co.ke", "password": "password123"}'
```

**Change Password:**
```bash
curl -X POST http://127.0.0.1:8000/api/auth/change-password/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@medicare.co.ke",
    "old_password": "password123",
    "new_password": "SecurePass2026",
    "confirm_password": "SecurePass2026"
  }'
```

---

## 💳 M-Pesa Integration

The system integrates with **Safaricom Daraja API** for M-Pesa STK Push payments. The `MPesaClient` class in `django_backend/api/mpesa.py` handles token generation and STK Push requests.

**For local development:** The actual Daraja HTTP call is mocked via the `mock-payment` endpoint.

### Enable Real M-Pesa Payments

1. Register on the [Safaricom Developer Portal](https://developer.safaricom.co.ke/)
2. Obtain your `consumer_key`, `consumer_secret`, and `passkey`
3. Replace placeholder values in `mpesa.py`
4. Uncomment the real `requests.post(...)` call in `initiate_stk_push()`
5. Set a valid public `CallBackURL` for payment confirmation

> **Note:** Phone numbers are automatically normalized from `07XXXXXXXX` to `2547XXXXXXXX` format.

---

## 📝 Audit Logging

Every significant action is recorded to the `AuditLog` table with user email, role, action name, details, and UTC timestamp.

### Logged Events

- 🔓 User login (success and failure)
- 🔑 Password changes
- 👤 User created / updated / deleted
- 🏥 Patient registered / updated / deleted
- 💰 Bills generated

### Access Audit Logs

The read-only `GET /api/audit-logs/` endpoint returns entries ordered by most recent first. The Administrator dashboard displays these with real-time refresh and timestamp formatting.

### Add Custom Logging

To log additional actions, call `log_action(user, action, details)` in your viewset's `perform_create`, `perform_update`, or `perform_destroy` method:

```python
def perform_create(self, serializer):
    instance = serializer.save()
    log_action(self.request.user, "patient_created", f"Patient {instance.id} registered")
```

---

## 🔐 Demo Credentials

All demo accounts prompt for a password change on first login. Use any password of 8+ characters that differs from `password123`.

| Role | Email | Initial Password |
|------|-------|------------------|
| Administrator | `admin@medicare.co.ke` | `password123` |
| Doctor | `otieno@medicare.co.ke` | `password123` |
| Nurse | `akinyi@medicare.co.ke` | `password123` |
| Receptionist | `alice@medicare.co.ke` | `password123` |
| Patient | `john@email.co.ke` | `password123` |

---

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

## 📞 Support

For questions or issues, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ for Kenyan healthcare facilities**
