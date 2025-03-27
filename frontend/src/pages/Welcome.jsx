import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-teal-500 py-20 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">
              Welcome, {user.forenames}!
            </h1>
            <p className="text-lg text-gray-600">
              We're glad to see you here
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg shadow">
                <p className="text-sm text-gray-500">Username</p>
                <p className="text-lg font-medium text-gray-800">{user.username}</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow">
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-lg font-medium text-gray-800">{user.email}</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow">
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="text-lg font-medium text-gray-800">{user.forenames} {user.surname}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate('/fitness')}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Go to Fitness
            </button>
            <button
              onClick={() => navigate('/mood-log')}
              className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Log Your Mood
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome; 