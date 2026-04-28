const API_URL = 'http://127.0.0.1:8000/api';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'API request failed');
  }
  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

const getHeaders = () => {
  const headers: any = { 'Content-Type': 'application/json' };
  const userStr = localStorage.getItem('hospital_user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      // Basic Auth for simplicity as backend uses session/basic auth usually in these templates
      // For now we just pass content type, backend should handle session
    } catch (e) {}
  }
  return headers;
};

const get = async (endpoint: string) => {
  const response = await fetch(`${API_URL}/${endpoint}/`, {
    headers: getHeaders()
  });
  return handleResponse(response);
};

export const post = async (endpoint: string, data: any) => {
  const response = await fetch(`${API_URL}/${endpoint}/`, {
    method: 'POST',
    headers: getHeaders(),
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

export const loginUser = async (email: string, password: string) => post('auth/login', { email, password });
export const changePassword = async (email: string, oldPassword: string, newPassword: string, confirmPassword: string) => 
  post('auth/change-password', { email, old_password: oldPassword, new_password: newPassword, confirm_password: confirmPassword });
export const initiateMPesa = async (phone: string, amount: number, reference: string, desc: string) => post('payment/mpesa', { phone, amount, reference, desc });
export const payBill = async (billId: string, amount: number, phone: string) => post('payment/mock-payment', { billId, amount, phone });

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
export const fetchAuditLogs = () => get('audit-logs');

