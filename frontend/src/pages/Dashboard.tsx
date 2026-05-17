import React, { useState } from 'react';
import { FilterState, ILead } from '../types';
import useLeads from '../hooks/useLeads';
import useDebounce from '../hooks/useDebounce';
import Navbar from '../components/Layout/Navbar';
import Filters from '../components/Filters';
import LeadTable from '../components/LeadTable';
import LeadForm from '../components/LeadForm';
import { exportLeadsApi } from '../api/leads';

const Dashboard: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    status: '',
    source: '',
    search: '',
    sort: 'latest',
    page: 1,
  });

  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 300);

  const activeFilters: FilterState = {
    ...filters,
    search: debouncedSearch,
  };

  const { leads, pagination, loading, error, refetch, deleteLead } =
    useLeads(activeFilters);

  const [showForm, setShowForm] = useState(false);
  const [editLead, setEditLead] = useState<ILead | null>(null);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    if (key === 'search') {
      setSearchInput(value);
      setFilters((prev) => ({ ...prev, page: 1 }));
    } else {
      setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
    }
  };

  const handleEdit = (lead: ILead) => {
    setEditLead(lead);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      await deleteLead(id);
    }
  };

  const handleExport = async () => {
    try {
      await exportLeadsApi();
    } catch (err) {
      alert('Failed to export leads');
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditLead(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-5">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Leads Dashboard</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {pagination.total} total leads
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-800 transition"
          >
            + Add Lead
          </button>
        </div>

        {/* Filters */}
        <Filters
          filters={{ ...filters, search: searchInput }}
          onFilterChange={handleFilterChange}
          onExport={handleExport}
        />

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <LeadTable
            leads={leads}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() =>
                setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
              }
              disabled={filters.page === 1}
              className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">
              Page {filters.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() =>
                setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
              }
              disabled={filters.page === pagination.totalPages}
              className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Lead Form Modal */}
      {showForm && (
        <LeadForm
          onClose={handleCloseForm}
          onSuccess={refetch}
          editLead={editLead}
        />
      )}
    </div>
  );
};

export default Dashboard;