// src/components/Header.js
import React from 'react';
import { LogOut } from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const Header = ({ user, setLoading }) => {

    const handleLogout = async () => {
        setLoading(true);
        try {
            await signOut(auth);
        } catch (error) {
            alert('Logout failed: ' + error.message);
        }
        setLoading(false);
    };
    
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div>
            <h1 className="text-2xl font-bold text-indigo-800">As-Salsabil Foundation</h1>
            <p className="text-sm text-gray-600">Multi-Admin Dashboard - {user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;