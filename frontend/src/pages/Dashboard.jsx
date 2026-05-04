import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="p-8 text-white text-center">
      <h1 className="text-4xl font-bold mb-4">Dashboard i AdVantage</h1>
      <p className="text-gray-400 mb-8">Mirësevini, {user?.emri || 'Përdorues'}!</p>
      
      <div className="bg-white/5 border border-white/10 p-6 rounded-2xl max-w-md mx-auto">
        <p className="mb-4 text-sm text-gray-300">
          Këtu do të shfaqen statistikat e fushatave tuaja së shpejti.
        </p>
        <button 
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-xl transition"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Dashboard;