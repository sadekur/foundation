// src/components/LoginScreen.js
import React, { useState } from 'react';
import { Eye, EyeOff, Loader } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword('');
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-3 xs:p-4 sm:p-6 lg:p-8">
      {/* Login Card - Responsive width and spacing */}
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xs xs:max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl p-4 xs:p-6 sm:p-8 lg:p-10">
        
        {/* Header - Responsive text sizes */}
        <div className="text-center mb-4 xs:mb-6 sm:mb-8">
          <h1 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold text-indigo-800 mb-1 xs:mb-2 leading-tight">
            As-Salsabil Foundation
          </h1>
          <p className="text-xs xs:text-sm sm:text-base text-gray-600">
            Admin Access System
          </p>
        </div>
        
        {/* Login Form - Responsive spacing */}
        <form onSubmit={handleLogin} className="space-y-3 xs:space-y-4 sm:space-y-5">
          
          {/* Email Field */}
          <div>
            <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-1 xs:mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 xs:p-3 sm:p-3.5 border border-gray-300 rounded-md xs:rounded-lg 
                         text-sm xs:text-base
                         focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                         transition-all duration-200 ease-in-out
                         hover:border-gray-400"
              placeholder="Enter admin email"
              required
            />
          </div>
          
          {/* Password Field */}
          <div>
            <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-1 xs:mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 xs:p-3 sm:p-3.5 pr-10 xs:pr-12 border border-gray-300 rounded-md xs:rounded-lg 
                           text-sm xs:text-base
                           focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                           transition-all duration-200 ease-in-out
                           hover:border-gray-400"
                placeholder="Enter password"
                required
              />
              {/* Password Toggle Button - Responsive positioning */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 xs:right-3 top-1/2 transform -translate-y-1/2 
                           text-gray-400 hover:text-gray-600 
                           transition-colors duration-200
                           p-1 rounded-full hover:bg-gray-100
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? 
                  <EyeOff size={16} className="xs:w-5 xs:h-5" /> : 
                  <Eye size={16} className="xs:w-5 xs:h-5" />
                }
              </button>
            </div>
          </div>
          
          {/* Login Button - Responsive sizing */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white 
                       p-2.5 xs:p-3 sm:p-3.5 
                       text-sm xs:text-base sm:text-lg font-medium
                       rounded-md xs:rounded-lg 
                       hover:bg-indigo-700 active:bg-indigo-800
                       transition-all duration-200 ease-in-out
                       disabled:opacity-50 disabled:cursor-not-allowed
                       focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50
                       flex items-center justify-center
                       transform hover:scale-[1.02] active:scale-[0.98]
                       shadow-md hover:shadow-lg"
          >
            {loading ? (
              <>
                <Loader className="animate-spin h-4 w-4 xs:h-5 xs:w-5 mr-2" />
                <span className="text-sm xs:text-base">Logging in...</span>
              </>
            ) : (
              <span className="text-sm xs:text-base">Login</span>
            )}
          </button>
        </form>

        {/* Footer - Optional responsive footer */}
        <div className="mt-4 xs:mt-6 sm:mt-8 text-center">
          <p className="text-xs sm:text-sm text-gray-500">
            Secure admin access for foundation management
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;