import { useState, useEffect, useCallback } from 'react';
import { ILead, PaginationMeta, FilterState } from '../types';
import { getLeadsApi, deleteLeadApi } from '../api/leads';

const useLeads = (filters: FilterState) => {
  const [leads, setLeads] = useState<ILead[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLeadsApi(filters);
      setLeads(data.data);
      setPagination(data.pagination);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.page,
    filters.search,
    filters.sort,
    filters.source,
    filters.status,
  ]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const deleteLead = async (id: string) => {
    try {
      await deleteLeadApi(id);
      fetchLeads();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    }
  };

  return { leads, pagination, loading, error, refetch: fetchLeads, deleteLead };
};

export default useLeads;