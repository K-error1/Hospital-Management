const API_URL = 'http://127.0.0.1:8000/api';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'API request failed');
  }
  return response.json();
};

const get = async (endpoint: string) => {
  const response = await fetch(`${API_URL}/${endpoint}/`);
  return handleResponse(response);
};

export const post = async (endpoint: string, data: any) => {
  const response = await fetch(`${API_URL}/${endpoint}/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

export const put = async (endpoint: string, id: string | number, data: any) => {
  const response = await fetch(`${API_URL}/${endpoint}/${id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

export const remove = async (endpoint: string, id: string | number) => {
  const response = await fetch(`${API_URL}/${endpoint}/${id}/`, {
    method: 'DELETE'
  });
  if (response.status === 204) return true;
  return handleResponse(response);
};

export const loginUser = async (email: string, password: string) =>post('auth/login', { email, password });
export const initiateMPesa = async (phone: string, amount: number, reference: string, desc: string) => post('payment/mpesa', { phone, amount, reference, desc });

// Legacy getters for DataContext
export const fetchUsers = () => get('users');
export const fetchPatients = () => get('patients');
export const fetchDoctors = () => get('doctors');
export const fetchNurses = () => get('nurses');
export const fetchAppointments = () => get('appointments');
export const fetchBilling = () => get('billing');
export const fetchDepartments = () => get('departments');
export const fetchVitals = () => get('vitals');
export const fetchPrescriptions = () => get('prescriptions');

