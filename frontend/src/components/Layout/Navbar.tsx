import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold tracking-tight">⚡ GigFlow</span>
        <span className="text-xs bg-blue-500 px-2 py-0.5 rounded-full">
          Smart Leads
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-sm">
          <span className="opacity-75">Logged in as </span>
          <span className="font-semibold">{user?.name}</span>
          <span className="ml-2 text-xs bg-blue-500 px-2 py-0.5 rounded-full uppercase">
            {user?.role}
          </span>
        </div>
        <button
          onClick={logout}
          className="bg-white text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-blue-50 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;