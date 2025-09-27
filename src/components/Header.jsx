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
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      {/* Responsive Container */}
      <div className="w-full max-w-none xs:max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-8xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
        
        {/* Header Content - Responsive Layout */}
        <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center 
                        py-3 xs:py-4 sm:h-16 gap-2 xs:gap-4">
          
          {/* Brand Section - Responsive Typography */}
          <div className="flex-1 min-w-0">
            <h1 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-indigo-800 
                           leading-tight truncate">
              As-Salsabil Foundation
            </h1>
            
            {/* User Info - Responsive Display */}
            <div className="flex flex-col xs:flex-row xs:items-center xs:gap-2 mt-0.5 xs:mt-1">
              <div className="flex items-center gap-1 xs:gap-2">
                <span className="text-xs xs:text-sm text-gray-600 font-medium truncate max-w-[200px] xs:max-w-[250px] sm:max-w-none">
                  {user?.email}
                </span>
              </div>
            </div>
          </div>
          
          {/* Logout Button - Responsive */}
          <div className="flex-shrink-0">
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 xs:gap-2 
                         text-gray-600 hover:text-gray-800 
                         transition-all duration-200 ease-in-out
                         p-2 xs:p-2.5 sm:p-3
                         rounded-md xs:rounded-lg 
                         hover:bg-gray-100 active:bg-gray-200
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50
                         transform hover:scale-105 active:scale-95
                         text-sm xs:text-base font-medium
                         border border-transparent hover:border-gray-200
                         shadow-sm hover:shadow-md"
              aria-label="Logout from dashboard"
            >
              <LogOut size={16} className="xs:w-5 xs:h-5 flex-shrink-0" />
              <span className="hidden xs:inline">Logout</span>
              {/* Mobile-only text */}
              <span className="xs:hidden">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Mobile User Info Bar (Alternative Layout for Very Small Screens) */}
        <div className="block xs:hidden border-t border-gray-100 py-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Logged in as:</span>
            <span className="font-medium text-gray-700 truncate max-w-[180px]">
              {user?.email}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;