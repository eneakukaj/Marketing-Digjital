import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UsersTab = ({ users, refreshUsers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({ emri: '', mbiemri: '', email: '', statusi: 'aktiv' });
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchRoles = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const res = await axios.get("http://localhost:3000/api/admin/roles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoles(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchRoles(); }, []);

  const openModal = (user = null) => {
    setErrorMessage("");
    if (user) {
      setCurrentUser(user);
      setFormData({
        emri: user.emri || '',
        mbiemri: user.mbiemri || '',
        email: user.email || '',
        statusi: user.statusi || 'aktiv'
      });
      setSelectedRole(user?.userroles?.[0]?.role?.id || "");
    } else {
      setCurrentUser(null);
      setFormData({ emri: '', mbiemri: '', email: '', statusi: 'aktiv' });
      setSelectedRole("");
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setErrorMessage("");
  const token = localStorage.getItem('accessToken');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  try {
    let targetUserId;

    if (currentUser) {
      const updateData = {
        emri: formData.emri,
        mbiemri: formData.mbiemri,
        email: formData.email,
        statusi: formData.statusi
      };
      await axios.put(`http://localhost:3000/api/admin/users/${currentUser.id}`, updateData, config);
      targetUserId = currentUser.id;
    } else {
      const res = await axios.post("http://localhost:3000/api/admin/users", { ...formData, password_hash: "default123" }, config);
      targetUserId = res.data.id;
    }

    if (selectedRole && targetUserId) {
      try{
      await axios.post("http://localhost:3000/api/admin/users/assign-role", { 
        user_id: Number(targetUserId), 
        role_id: Number(selectedRole) 
      }, config);
    }
    catch (roleErr) {
    }
  }
    setIsModalOpen(false);
    await refreshUsers();
  } catch (err) {
    setErrorMessage(err.response?.data?.message || "Operation failed.");
  }
};

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">User Management</h2>
        <button onClick={() => openModal()} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition-all">+ Add User</button>
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-50">
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">User & Email</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {users.map((user) => (
            <tr key={user.id} className="group hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold uppercase">{user.emri?.charAt(0)}</div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">{user.emri} {user.mbiemri}</div>
                    <div className="text-xs text-slate-400">{user.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-600 uppercase">
                  {user.userroles?.[0]?.role?.emertimi || 'No Role'}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${user.statusi === 'aktiv' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {user.statusi}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <button onClick={() => openModal(user)} className="text-indigo-600 font-bold mr-4 text-sm hover:underline">Edit</button>
                <button onClick={() => { if(window.confirm("Delete?")) axios.delete(`http://localhost:3000/api/admin/users/${user.id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }).then(refreshUsers) }} className="text-rose-600 font-bold text-sm hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
            <h3 className="text-xl font-bold text-slate-800 mb-6">{currentUser ? 'Edit User' : 'Add New User'}</h3>
            {errorMessage && <div className="mb-4 p-4 bg-rose-50 text-rose-600 text-sm font-bold rounded-2xl italic">{errorMessage}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 ml-1">First Name</label>
                  <input className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm mt-1 focus:ring-2 focus:ring-indigo-500" value={formData.emri} onChange={(e) => setFormData({...formData, emri: e.target.value})} required />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 ml-1">Last Name</label>
                  <input className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm mt-1 focus:ring-2 focus:ring-indigo-500" value={formData.mbiemri} onChange={(e) => setFormData({...formData, mbiemri: e.target.value})} required />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 ml-1">Email Address</label>
                <input type="email" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm mt-1 focus:ring-2 focus:ring-indigo-500" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 ml-1">Assign Role</label>
                  <select className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm mt-1 focus:ring-2 focus:ring-indigo-500 appearance-none" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} required>
                    <option value="">Select Role</option>
                    {roles.map(r => <option key={r.id} value={r.id}>{r.emertimi}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 ml-1">Status</label>
                  <select className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm mt-1 focus:ring-2 focus:ring-indigo-500 appearance-none" value={formData.statusi} onChange={(e) => setFormData({...formData, statusi: e.target.value})}>
                    <option value="aktiv">Aktiv</option>
                    <option value="pasiv">Pasiv</option>
                  </select>
                </div>
              </div>
              <button className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition-all mt-2">Save User</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTab;