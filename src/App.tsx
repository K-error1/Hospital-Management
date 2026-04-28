import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import ChangePassword from './pages/ChangePassword';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminDoctors from './pages/admin/AdminDoctors';
import AdminNurses from './pages/admin/AdminNurses';
import AdminPatients from './pages/admin/AdminPatients';
import AdminReceptionists from './pages/admin/AdminReceptionists';
import AdminDepartments from './pages/admin/AdminDepartments';
import AdminAppointments from './pages/admin/AdminAppointments';
import AdminBilling from './pages/admin/AdminBilling';
import AdminReports from './pages/admin/AdminReports';
import AdminAuditLogs from './pages/admin/AdminAuditLogs';

// Doctor pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorPatients from './pages/doctor/DoctorPatients';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import DoctorPrescriptions from './pages/doctor/DoctorPrescriptions';
import DoctorSchedule from './pages/doctor/DoctorSchedule';

// Nurse pages
import NurseDashboard from './pages/nurse/NurseDashboard';
import NursePatients from './pages/nurse/NursePatients';
import NurseVitals from './pages/nurse/NurseVitals';
import NurseMedications from './pages/nurse/NurseMedications';
import NurseWard from './pages/nurse/NurseWard';

// Patient pages
import PatientDashboard from './pages/patient/PatientDashboard';
import PatientAppointments from './pages/patient/PatientAppointments';
import PatientRecords from './pages/patient/PatientRecords';
import PatientPrescriptions from './pages/patient/PatientPrescriptions';
import PatientBilling from './pages/patient/PatientBilling';

// Receptionist pages
import ReceptionistDashboard from './pages/receptionist/ReceptionistDashboard';
import ReceptionistPatients from './pages/receptionist/ReceptionistPatients';
import ReceptionistAppointments from './pages/receptionist/ReceptionistAppointments';

import { ReactNode } from 'react';
import { UserRole } from './types';

function ProtectedRoute({ children, allowedRole }: { children: ReactNode; allowedRole: UserRole }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.must_change_password) {
    return <Navigate to="/change-password" replace />;
  }

  if (user?.role !== allowedRole) {
    return <Navigate to={`/${user?.role}`} replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated 
            ? <Navigate to={user?.must_change_password ? "/change-password" : `/${user?.role}`} replace /> 
            : <Login />
        }
      />

      <Route
        path="/change-password"
        element={
          isAuthenticated 
            ? (user?.must_change_password ? <ChangePassword /> : <Navigate to={`/${user?.role}`} replace />)
            : <Navigate to="/login" replace />
        }
      />

      {/* Administrator Routes */}
      <Route
        element={
          <ProtectedRoute allowedRole="administrator">
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/administrator" element={<AdminDashboard />} />
        <Route path="/administrator/doctors" element={<AdminDoctors />} />
        <Route path="/administrator/nurses" element={<AdminNurses />} />
        <Route path="/administrator/receptionists" element={<AdminReceptionists />} />
        <Route path="/administrator/patients" element={<AdminPatients />} />
        <Route path="/administrator/departments" element={<AdminDepartments />} />
        <Route path="/administrator/appointments" element={<AdminAppointments />} />
        <Route path="/administrator/billing" element={<AdminBilling />} />
        <Route path="/administrator/reports" element={<AdminReports />} />
        <Route path="/administrator/audit" element={<AdminAuditLogs />} />
      </Route>

      {/* Doctor Routes */}
      <Route
        element={
          <ProtectedRoute allowedRole="doctor">
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/doctor/patients" element={<DoctorPatients />} />
        <Route path="/doctor/appointments" element={<DoctorAppointments />} />
        <Route path="/doctor/prescriptions" element={<DoctorPrescriptions />} />
        <Route path="/doctor/schedule" element={<DoctorSchedule />} />
      </Route>

      {/* Nurse Routes */}
      <Route
        element={
          <ProtectedRoute allowedRole="nurse">
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/nurse" element={<NurseDashboard />} />
        <Route path="/nurse/patients" element={<NursePatients />} />
        <Route path="/nurse/vitals" element={<NurseVitals />} />
        <Route path="/nurse/medications" element={<NurseMedications />} />
        <Route path="/nurse/ward" element={<NurseWard />} />
      </Route>

      {/* Patient Routes */}
      <Route
        element={
          <ProtectedRoute allowedRole="patient">
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/patient" element={<PatientDashboard />} />
        <Route path="/patient/appointments" element={<PatientAppointments />} />
        <Route path="/patient/records" element={<PatientRecords />} />
        <Route path="/patient/prescriptions" element={<PatientPrescriptions />} />
        <Route path="/patient/billing" element={<PatientBilling />} />
      </Route>

      {/* Receptionist Routes */}
      <Route
        element={
          <ProtectedRoute allowedRole="receptionist">
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/receptionist" element={<ReceptionistDashboard />} />
        <Route path="/receptionist/patients" element={<ReceptionistPatients />} />
        <Route path="/receptionist/appointments" element={<ReceptionistAppointments />} />
      </Route>

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <AppRoutes />
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
