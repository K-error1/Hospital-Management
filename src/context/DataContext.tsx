import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../utils/api';
import { Patient, Doctor, Nurse, Appointment, Prescription, VitalSign, Department, BillingRecord } from '../types';

interface DataContextType {
  patients: Patient[];
  doctors: Doctor[];
  nurses: Nurse[];
  appointments: Appointment[];
  prescriptions: Prescription[];
  vitalSigns: VitalSign[];
  departments: Department[];
  billingRecords: BillingRecord[];
  loading: boolean;
  refetch: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<Omit<DataContextType, 'loading' | 'refetch'>>({
    patients: [],
    doctors: [],
    nurses: [],
    appointments: [],
    prescriptions: [],
    vitalSigns: [],
    departments: [],
    billingRecords: []
  });
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [
        patientsInfo, doctorsInfo, nursesInfo, 
        appointmentsInfo, prescriptionsInfo, 
        vitalsInfo, departmentsInfo, billingInfo
      ] = await Promise.all([
        api.fetchPatients(),
        api.fetchDoctors(),
        api.fetchNurses(),
        api.fetchAppointments(),
        api.fetchPrescriptions(),
        api.fetchVitals(),
        api.fetchDepartments(),
        api.fetchBilling()
      ]);

      setData({
        patients: patientsInfo,
        doctors: doctorsInfo,
        nurses: nursesInfo,
        appointments: appointmentsInfo,
        prescriptions: prescriptionsInfo,
        vitalSigns: vitalsInfo,
        departments: departmentsInfo,
        billingRecords: billingInfo
      });
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <DataContext.Provider value={{ ...data, loading, refetch: loadData }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
