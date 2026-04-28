# Architecture Documentation

## System Architecture Overview

The Hospital Management System follows a **client-server architecture** with a clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser / Client                          │
├─────────────────────────────────────────────────────────────┤
│                  React + TypeScript                          │
│         (Vite Build Tool, Tailwind CSS Styling)              │
├─────────────────────────────────────────────────────────────┤
│                    HTTP/REST API                             │
├─────────────────────────────────────────────────────────────┤
│              Django REST Framework Backend                   │
│          (Authentication, Business Logic, Validation)        │
├─────────────────────────────────────────────────────────────┤
│                    PostgreSQL Database                       │
│          (Persistent Data Storage & Relationships)           │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Component Hierarchy

```
App
├── Layout
│   ├── Header
│   ├── Sidebar
│   └── Main Content
│       ├── Dashboard Page
│       ├── Patients Page
│       ├── Appointments Page
│       ├── Doctors Page
│       └── Billing Page
└── Footer
```

### State Management

- **React Hooks**: useState, useEffect, useContext for local state
- **API Services**: Centralized service layer for HTTP calls
- **Custom Hooks**: Reusable logic (useAuth, useFetch, etc.)

### Directory Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Header, Footer, Sidebar, etc.
│   ├── forms/          # Form components
│   ├── cards/          # Card components
│   └── modals/         # Modal dialogs
├── pages/              # Page-level components
│   ├── Dashboard.tsx
│   ├── Patients.tsx
│   ├── Appointments.tsx
│   ├── Doctors.tsx
│   └── Billing.tsx
├── services/           # API services
│   ├── api.ts         # Axios instance configuration
│   ├── patientService.ts
│   ├── appointmentService.ts
│   ├── doctorService.ts
│   └── authService.ts
├── types/             # TypeScript interfaces
│   ├── Patient.ts
│   ├── Appointment.ts
│   ├── Doctor.ts
│   └── API.ts
├── styles/            # Global styles
│   ├── globals.css
│   └── tailwind.config.js
├── hooks/             # Custom React hooks
│   ├── useAuth.ts
│   ├── useFetch.ts
│   └── useForm.ts
├── utils/             # Utility functions
│   ├── formatDate.ts
│   ├── validators.ts
│   └── constants.ts
├── App.tsx            # Root component
└── main.tsx           # React DOM entry point
```

## Backend Architecture

### Django App Structure

```
django_backend/
├── manage.py          # Django management script
├── requirements.txt   # Python dependencies
├── config/           # Django configuration
│   ├── settings.py
│   ├── urls.py       # Main URL routing
│   ├── asgi.py
│   └── wsgi.py
├── core/             # Core functionality
│   ├── models.py     # Base models, mixins
│   ├── serializers.py
│   └── views.py
├── patients/         # Patients app
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   └── admin.py
├── appointments/     # Appointments app
├── doctors/          # Doctors app
├── billing/          # Billing app
└── static/           # Static files
```

### API Layer Architecture

```
Request → URL Router → View/ViewSet → Serializer → Model
                                    ↓
                              Business Logic
                                    ↓
                            Database Query/Update
                                    ↓
Response ← Serializer ← Model Instance(s)
```

### Model Relationships

```
User (Django User Model)
├── Patient (One-to-One)
│   ├── Medical History (One-to-Many)
│   └── Appointment (One-to-Many)
│       └── Doctor (Foreign Key)
├── Doctor (One-to-One)
│   ├── Specialization (Foreign Key)
│   ├── Department (Foreign Key)
│   └── Appointment (One-to-Many)
└── Staff (One-to-One)
    └── Department (Foreign Key)

Appointment
├── Patient (Foreign Key)
├── Doctor (Foreign Key)
├── Department (Foreign Key)
└── Billing Record (One-to-One)

Billing
├── Patient (Foreign Key)
├── Appointment (Foreign Key)
└── Payment (One-to-Many)
```

## Data Flow

### Patient Registration Flow

```
1. User fills registration form (Frontend)
         ↓
2. Frontend validates data locally
         ↓
3. Frontend sends POST to /api/patients/ (Backend)
         ↓
4. Django serializer validates data
         ↓
5. Model is created in database
         ↓
6. User account created
         ↓
7. Response sent back to frontend
         ↓
8. User redirected to login
```

### Appointment Scheduling Flow

```
1. Patient selects date/doctor (Frontend)
         ↓
2. Frontend fetches available slots
         ↓
3. Patient selects time slot
         ↓
4. Frontend sends POST to /api/appointments/ (Backend)
         ↓
5. Slot availability validated
         ↓
6. Appointment created in database
         ↓
7. Notification sent (email/SMS)
         ↓
8. Confirmation shown to patient
```

## Authentication & Authorization

### Authentication Flow

```
User Login
    ↓
POST /api/auth/login/ with credentials
    ↓
Django validates credentials
    ↓
Token generated (JWT or DRF Token)
    ↓
Token stored in frontend (localStorage/sessionStorage)
    ↓
Token included in all subsequent requests
    ↓
User logged in
```

### Authorization Levels

- **Patient**: Can view own records, schedule appointments, view billing
- **Doctor**: Can view patient records, create prescriptions, update appointments
- **Staff**: Can manage appointments, view reports
- **Admin**: Full access to all features and settings

## API Endpoint Organization

### Versioning

```
/api/v1/
├── auth/
│   ├── login/
│   ├── logout/
│   ├── register/
│   └── refresh-token/
├── patients/
│   ├── (GET, POST, PUT, DELETE)
│   └── {id}/medical-history/
├── appointments/
│   ├── (GET, POST, PUT, DELETE)
│   └── {id}/cancel/
├── doctors/
│   ├── (GET)
│   └── {id}/availability/
├── billing/
│   ├── (GET)
│   └── {id}/payment/
└── admin/
    └── (user management, reports)
```

## Error Handling

### Frontend Error Handling

```
API Call
    ↓
Success? → Display Data
    ↓ (No)
Status Code?
    ├─ 400 → Display validation errors
    ├─ 401 → Redirect to login
    ├─ 403 → Show access denied
    ├─ 404 → Show not found
    ├─ 500 → Show server error
    └─ Other → Show generic error
```

### Backend Error Responses

```json
{
  "error": true,
  "message": "Error description",
  "details": {
    "field": ["error message"]
  },
  "status_code": 400
}
```

## Performance Optimization

### Frontend Optimizations
- Code splitting with Vite
- Lazy loading of routes
- Image optimization
- Caching strategies
- Minification and bundling

### Backend Optimizations
- Database query optimization with select_related/prefetch_related
- Pagination for list endpoints
- Caching frequently accessed data
- Database indexing on commonly queried fields

## Security Measures

### Frontend Security
- Input validation and sanitization
- CSRF token for POST requests
- Secure token storage
- XSS prevention

### Backend Security
- CORS configuration
- SQL injection prevention (ORM)
- Rate limiting
- Authentication & Authorization
- HTTPS enforcement
- Secure password hashing

## Deployment Architecture

### Development Environment
```
Local Machine
├── Frontend (npm run dev)
├── Backend (python manage.py runserver)
└── SQLite Database
```

### Production Environment
```
Cloud Server
├── Frontend (Static Files on CDN/Nginx)
├── Backend (Gunicorn + Django)
├── Database (PostgreSQL)
└── Load Balancer (optional)
```

## Monitoring & Logging

### Frontend Monitoring
- Error tracking (Sentry integration ready)
- Performance monitoring
- User analytics

### Backend Monitoring
- Request/response logging
- Database query logging
- Error tracking
- Server health checks
