import { FilterState } from '../types';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const getLeadsApi = async (filters: FilterState) => {
  const params = new URLSearchParams();
  params.append('page', filters.page.toString());
  params.append('sort', filters.sort);
  if (filters.status) params.append('status', filters.status);
  if (filters.source) params.append('source', filters.source);
  if (filters.search) params.append('search', filters.search);

  const res = await fetch(`${BASE_URL}/leads?${params.toString()}`, {
    headers: getHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch leads');
  return data;
};

export const createLeadApi = async (lead: {
  name: string;
  email: string;
  status: string;
  source: string;
}) => {
  const res = await fetch(`${BASE_URL}/leads`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(lead),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create lead');
  return data;
};

export const updateLeadApi = async (
  id: string,
  lead: Partial<{ name: string; email: string; status: string; source: string }>
) => {
  const res = await fetch(`${BASE_URL}/leads/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(lead),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update lead');
  return data;
};

export const deleteLeadApi = async (id: string) => {
  const res = await fetch(`${BASE_URL}/leads/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete lead');
  return data;
};

export const exportLeadsApi = async () => {
  const res = await fetch(`${BASE_URL}/leads/export`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error('Failed to export leads');
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'leads.csv';
  a.click();
  window.URL.revokeObjectURL(url);
};