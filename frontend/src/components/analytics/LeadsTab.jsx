import React, { useState, useEffect, useContext} from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const LeadsTab = () => {
  const { user } = useContext(AuthContext);
  const roles = user?.roles || user?.role || user?.userroles?.map((ur) => ur.role?.normalized_name) || [];
  const userRoles = Array.isArray(roles) ? roles : [roles];
  const normalizedRoles = userRoles.map((r) => typeof r === 'string' ? r.toUpperCase() : '');
  
  const isAdmin = normalizedRoles.includes("ADMIN");
  const isManager = normalizedRoles.includes("MANAGER");
  const isUser = !isAdmin && !isManager;

  const [leads, setLeads] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLead, setCurrentLead] = useState(null);

  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);

  const [formData, setFormData] = useState({
    emri: '', 
    mbiemri: '', 
    email: '', 
    phone_number: '', 
    campaign_id: '', 
    statusi: 'aktiv'
  });

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [leadsRes, campRes] = await Promise.all([
        axios.get('http://localhost:3000/api/analytics/leads', config).catch(() => null),
        axios.get('http://localhost:3000/api/manager/campaigns', config).catch(() => null)
      ]);
      
      if (leadsRes && Array.isArray(leadsRes.data)) {
        setLeads(leadsRes.data);
      }

      if (campRes && Array.isArray(campRes.data)) {
        setCampaigns(campRes.data);
      }
    } catch (err) {
      console.error("Error fetching leads data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const openModal = (lead = null) => {
    if (lead) {
      setCurrentLead(lead);
      setFormData({
        emri: lead.emri || '',
        mbiemri: lead.mbiemri || '',
        email: lead.email || '',
        phone_number: lead.phone_number || '',
        campaign_id: lead.campaign_id ? String(lead.campaign_id) : '',
        statusi: lead.statusi || 'aktiv'
      });
    } else {
      setCurrentLead(null);
      setFormData({
        emri: '',
        mbiemri: '',
        email: '',
        phone_number: '',
        campaign_id: '',
        statusi: 'aktiv'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      if (currentLead) {
        await axios.put(`http://localhost:3000/api/analytics/leads/${currentLead.id}`, formData, config);
      } else {
        await axios.post('http://localhost:3000/api/analytics/leads', formData, config);
      }
      fetchLeads();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving lead:", err);
      const msg = err.response?.data?.message || "An error occurred while saving the lead!";
      alert(`Error: ${msg}`);
    }
  };

 
  const triggerDeleteModal = (lead) => {
    setLeadToDelete(lead);
    setIsDeleteModalOpen(true);
  };

  
  const handleDeleteConfirm = async () => {
    if (!leadToDelete) return;
    
    const token = localStorage.getItem('accessToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.delete(`http://localhost:3000/api/analytics/leads/${leadToDelete.id}`, config);
      fetchLeads();
      setIsDeleteModalOpen(false);
      setLeadToDelete(null);
    } catch (err) {
      console.error("Error deleting lead:", err);
      alert("An error occurred while deleting the lead!");
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-bold">Loading Leads Data...</div>;

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm mt-10">
      <div className="p-8 flex justify-between items-center border-b border-slate-100">
        <div>
          <h3 className="text-slate-800 font-black text-xl">Leads Performance Report</h3>
          <p className="text-slate-400 text-sm">Track and manage contacts generated exclusively from campaigns</p>
        </div>
       {!isUser && (
          <button 
            onClick={() => openModal()}
            className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 text-sm"
          >
            + Add Lead
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
            <tr>
              <th className="px-8 py-4">Full Name</th>
              <th className="px-8 py-4">Email Address</th>
              <th className="px-8 py-4">Phone Number</th>
              <th className="px-8 py-4">Connected Campaign</th>
              <th className="px-8 py-4 text-center">Status</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {Array.isArray(leads) && leads.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/80 transition-all group">
                <td className="px-8 py-5 text-slate-800 font-bold">
                  {item.emri} {item.mbiemri}
                </td>
                <td className="px-8 py-5 text-slate-500 font-medium">
                  {item.email}
                </td>
                <td className="px-8 py-5 text-slate-500 font-medium">
                  {item.phone_number || '-'}
                </td>
                <td className="px-8 py-5 text-indigo-600 font-extrabold">
                  {item.campaign?.emertimi || `Campaign #${item.campaign_id}`}
                </td>
                <td className="px-8 py-5 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    item.statusi === 'aktiv' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {item.statusi === 'aktiv' ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-8 py-5 text-right space-x-4">
                  {!isUser && (
                    <button 
                      onClick={() => openModal(item)} 
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                    >
                      Edit
                    </button>
                  )}
                 {(isAdmin || (isManager && Number(item.user_id) === Number(user?.id))) && (
                    <button 
                      onClick={() => triggerDeleteModal(item)} 
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
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

      
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 border border-slate-100 shadow-xl">
            <h2 className="text-2xl font-black text-slate-800 mb-6">{currentLead ? 'Update Lead Info' : 'Register New Lead'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">First Name</label>
                  <input type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-700 font-medium mt-1 focus:outline-none focus:border-indigo-500" value={formData.emri} onChange={(e) => setFormData({...formData, emri: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Last Name</label>
                  <input type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-700 font-medium mt-1 focus:outline-none focus:border-indigo-500" value={formData.mbiemri} onChange={(e) => setFormData({...formData, mbiemri: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Email Address</label>
                <input type="email" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-700 font-medium mt-1 focus:outline-none focus:border-indigo-500" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Phone Number</label>
                <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-700 font-medium mt-1 focus:outline-none focus:border-indigo-500" value={formData.phone_number} onChange={(e) => setFormData({...formData, phone_number: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Campaign</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-700 font-medium mt-1 focus:outline-none focus:border-indigo-500" value={formData.campaign_id} onChange={(e) => setFormData({...formData, campaign_id: e.target.value})} required>
                  <option value="">Select Campaign</option>
                  {campaigns.map(c => <option key={c.id} value={c.id}>{c.emertimi}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Status</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-700 font-medium mt-1 focus:outline-none focus:border-indigo-500" value={formData.statusi} onChange={(e) => setFormData({...formData, statusi: e.target.value})}>
                  <option value="aktiv">Active</option>
                  <option value="joaktiv">Inactive</option>
                </select>
              </div>
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 font-bold text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 bg-indigo-600 text-white rounded-2xl font-bold py-4 shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">{currentLead ? 'Save Changes' : 'Create Lead'}</button>
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
              Lead {" "}
              <span className="font-bold text-[#475569]">
                {leadToDelete?.emri} {leadToDelete?.mbiemri}
              </span>{" "}
              will be deleted permanently.
            </p>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setLeadToDelete(null);
                }}
                className="flex-1 bg-[#f1f5f9] text-[#334155] py-4 rounded-2xl font-bold text-base hover:bg-[#e2e8f0] transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteConfirm}
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

export default LeadsTab;