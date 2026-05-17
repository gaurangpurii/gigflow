export interface IUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'sales';
}

export interface ILead {
  _id: string;
  name: string;
  email: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source: 'Website' | 'Instagram' | 'Referral';
  createdBy: { name: string; email: string };
  createdAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LeadsResponse {
  success: boolean;
  data: ILead[];
  pagination: PaginationMeta;
}

export interface FilterState {
  status: string;
  source: string;
  search: string;
  sort: 'latest' | 'oldest';
  page: number;
}