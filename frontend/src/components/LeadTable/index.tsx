import React from 'react';
import { ILead } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface LeadTableProps {
  leads: ILead[];
  onEdit: (lead: ILead) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}

const statusColors: Record<string, string> = {
  New: 'bg-blue-100 text-blue-700',
  Contacted: 'bg-yellow-100 text-yellow-700',
  Qualified: 'bg-green-100 text-green-700',
  Lost: 'bg-red-100 text-red-700',
};

const sourceColors: Record<string, string> = {
  Website: 'bg-purple-100 text-purple-700',
  Instagram: 'bg-pink-100 text-pink-700',
  Referral: 'bg-orange-100 text-orange-700',
};

const LeadTable: React.FC<LeadTableProps> = ({ leads, onEdit, onDelete, loading }) => {
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-gray-400">
        <span className="text-4xl mb-2">📭</span>
        <p className="text-sm">No leads found. Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Source</th>
            <th className="px-4 py-3">Created At</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {leads.map((lead) => (
            <tr key={lead._id} className="hover:bg-gray-50 transition">
              <td className="px-4 py-3 font-medium text-gray-800">{lead.name}</td>
              <td className="px-4 py-3 text-gray-500">{lead.email}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[lead.status]}`}>
                  {lead.status}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${sourceColors[lead.source]}`}>
                  {lead.source}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-400">
                {new Date(lead.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 flex gap-2">
                <button
                  onClick={() => onEdit(lead)}
                  className="text-blue-600 hover:underline text-xs font-medium"
                >
                  Edit
                </button>
                {user?.role === 'admin' && (
                  <button
                    onClick={() => onDelete(lead._id)}
                    className="text-red-500 hover:underline text-xs font-medium"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadTable;