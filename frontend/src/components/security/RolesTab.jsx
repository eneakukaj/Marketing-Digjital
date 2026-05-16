import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RolesTab = () => {
  const [roles, setRoles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const [formData, setFormData] = useState({ emertimi: '', pershkrimi: '' });
  const [errorMessage, setErrorMessage] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);

  const fetchData = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      const res = await axios.get('http://localhost:3000/api/admin/roles',{
      headers: { Authorization: `Bearer ${token}` }
      });
      setRoles(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, []);

  const openModal = (role = null) => {
    setErrorMessage("");
    if (role) {
      setCurrentRole(role);
      setFormData({ 
        emertimi: role.emertimi || '', 
        pershkrimi: role.pershkrimi || '' 
      });
    } else {
      setCurrentRole(null);
      setFormData({ emertimi: '', pershkrimi: '' });
    }
    setIsModalOpen(true);
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    
    const token = localStorage.getItem('accessToken'); 
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const payload = {
      emertimi: formData.emertimi || formData.emri, 
      pershkrimi: formData.pershkrimi
    };

    try {
      if (currentRole) {
        await axios.put(`http://localhost:3000/api/admin/roles/${currentRole.id}`, payload, config);
      } else {
        await axios.post('http://localhost:3000/api/admin/roles', payload, config);
      }
      await fetchData();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Errors:", err.response?.data);
      setErrorMessage(err.response?.data?.message || "Admin access required.");
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">Role Management</h2>
        <button onClick={() => openModal()} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition-all">+ Add Role</button>
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-50">
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Role & Description</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {roles.map((role) => (
            <tr key={role.id} className="group hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold uppercase shrink-0">
                    {role.emertimi?.charAt(0) || 'R'}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">{role.emertimi}</div>
                    <div className="text-xs text-slate-400 max-w-xs truncate">{role.pershkrimi}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <button onClick={() => openModal(role)} className="text-indigo-600 font-bold mr-4 text-sm hover:underline">Edit</button>
                <button onClick={() => { setRoleToDelete(role); setIsDeleteModalOpen(true);}} className="text-rose-600 font-bold text-sm hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 relative">
            <h3 className="text-xl font-bold text-slate-800 mb-6">{currentRole ? 'Edit Role' : 'Add New Role'}</h3>
            
            {errorMessage && <div className="mb-4 p-4 bg-rose-50 text-rose-600 text-sm font-bold rounded-2xl italic">{errorMessage}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 ml-1">Role Name</label>
                <input 
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm mt-1 focus:ring-2 focus:ring-indigo-500" 
                  value={formData.emertimi} 
                  onChange={(e) => setFormData({...formData, emertimi: e.target.value})} 
                  required 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 ml-1">Description</label>
                <textarea 
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm mt-1 min-h-[100px] resize-none focus:ring-2 focus:ring-indigo-500" 
                  value={formData.pershkrimi} 
                  onChange={(e) => setFormData({...formData, pershkrimi: e.target.value})} 
                />
              </div>
         <div className="flex gap-4 pt-2">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="flex-1 bg-slate-100 text-slate-700 py-4 rounded-2xl font-bold text-base hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold text-base hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100"
          >
            Save User
          </button>
        </div>
            </form>
          </div>
        </div>
      )}

    {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/30 backdrop-blur-[2px]">
          <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-[440px] text-center shadow-2xl border border-slate-100/50 mx-4">
            <h3 className="text-[26px] font-bold text-[#1e293b] mb-3 tracking-tight">
              Are you sure?
            </h3>
            <p className="text-[#64748b] text-base leading-relaxed mb-10 px-4">
              Role <span className="font-bold text-[#475569]">{roleToDelete?.emertimi}</span> will be deleted permanently.
            </p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setRoleToDelete(null);
                }}
                className="flex-1 bg-[#f1f5f9] text-[#334155] py-4 rounded-2xl font-bold text-base hover:bg-[#e2e8f0] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const token = localStorage.getItem('accessToken');
                  const config = { headers: { Authorization: `Bearer ${token}` } };
                  try {
                    await axios.delete(`http://localhost:3000/api/admin/roles/${roleToDelete.id}`, config);
                    await fetchData();
                    setIsDeleteModalOpen(false);
                    setRoleToDelete(null);
                  } catch (err) { 
                    console.error(err);
                    alert("Cannot delete role."); 
                  }
                }}
                className="flex-1 bg-[#e11d48] text-white py-4 rounded-2xl font-bold text-base hover:bg-[#be123c] transition-colors shadow-md shadow-rose-100"
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

export default RolesTab;