import React, { useState } from 'react';
import axios from 'axios';

const UsersTab = ({ users, refreshUsers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({emri : '', mbiemri : '', email:'', statusi: 'aktiv'});

  const openModal = (user = null) => {
    if (user) {
      setCurrentUser(user);
      setFormData({ emri: user.emri, mbiemri: user.mbiemri, email: user.email, statusi: user.statusi });
    } else {
      setCurrentUser(null);
      setFormData({ emri: '', mbiemri: '', email: '', statusi: 'aktiv' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentUser) {
        await axios.put(`http://localhost:3000/api/users/${currentUser.id}`, formData);
      } else {
        await axios.post(`http://localhost:3000/api/users`, { ...formData, password_hash: 'default123' });
      }
      await refreshUsers();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Operation failed", err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/users/${currentUser.id}`);
      await refreshUsers();
      setIsDeleteModalOpen(false);
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="font-bold text-2xl text-slate-800">User Management</h3>
          <p className="text-slate-400 text-sm">Manage users and their roles</p>
        </div>

        <button
          onClick={() => openModal()}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          Add New User
        </button>
      </div>

      <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="text-xs text-slate-400 uppercase tracking-wider border-b border-slate-50">
              <th className="pb-4 font-semibold">User</th>
              <th className="pb-4 font-semibold">Surname</th>
              <th className="pb-4 font-semibold">Email</th>
              <th className="pb-4 font-semibold">Status</th>
              <th className="pb-4 text-right font-semibold">Actions</th>
            </tr>
        </thead>

        <tbody className="divide-y divide-slate-50">
            {users.map(user => (
             <tr key={user.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="py-4 font-medium text-slate-700">{user.emri}</td>
                <td className="py-4 font-medium text-slate-700">{user.mbiemri}</td>
                <td className="py-4 text-slate-500 text-sm">{user.email}</td>
                <td className="py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    user.statusi === 'aktiv' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {user.statusi === 'aktiv' ? 'Active' : 'Inactive'}
                  </span>
                </td>
              <td className="py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => openModal(user)}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => { setCurrentUser(user); setIsDeleteModalOpen(true); }}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">
                {currentUser ? 'Edit User' : 'Create New User'}
                </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black text-2xl">&times;
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 ml-1">First Name</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500"
                  value={formData.emri} 
                  onChange={(e) => setFormData({...formData, emri: e.target.value})} 
                  required 
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 ml-1">Last Name</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500"
                  value={formData.mbiemri} 
                  onChange={(e) => setFormData({...formData, mbiemri: e.target.value})} 
                  required 
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 ml-1">Email Address</label>
                <input 
                  type="email" 
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500"
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  required 
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 ml-1">Account Status</label>
                <select 
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500"
                  value={formData.statusi} 
                  onChange={(e) => setFormData({...formData, statusi: e.target.value})}
                >
                  <option value="aktiv">Active</option>
                  <option value="joaktiv">Inactive</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold mt-4 hover:bg-indigo-700 transition-all">
                {currentUser ? 'Update User' : 'Create User'}
              </button>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm text-center shadow-2xl border border-slate-100">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Are you sure?</h3>
            <p className="text-slate-500 text-sm mb-8">
              This action cannot be undone. User <b>{currentUser?.emri}</b> will be deleted permanently.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsDeleteModalOpen(false)} 
                className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete} 
                className="flex-1 bg-rose-600 text-white py-3 rounded-xl font-bold hover:bg-rose-700 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTab;