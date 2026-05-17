import React, { useState } from 'react';
import { createLeadApi, updateLeadApi } from '../../api/leads';
import { ILead } from '../../types';

interface LeadFormProps {
  onClose: () => void;
  onSuccess: () => void;
  editLead?: ILead | null;
}

const LeadForm: React.FC<LeadFormProps> = ({ onClose, onSuccess, editLead }) => {
  const [formData, setFormData] = useState({
    name: editLead?.name || '',
    email: editLead?.email || '',
    status: editLead?.status || 'New',
    source: editLead?.source || 'Website',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setError('Name and email are required');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (editLead) {
        await updateLeadApi(editLead._id, formData);
      } else {
        await createLeadApi(formData);
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          {editLead ? 'Edit Lead' : 'Add New Lead'}
        </h2>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
          </select>
          <select
            name="source"
            value={formData.source}
            onChange={handleChange}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Website">Website</option>
            <option value="Instagram">Instagram</option>
            <option value="Referral">Referral</option>
          </select>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-blue-700 text-white text-sm font-semibold py-2 rounded-lg hover:bg-blue-800 transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : editLead ? 'Update Lead' : 'Create Lead'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 text-sm font-semibold py-2 rounded-lg hover:bg-gray-200 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadForm;