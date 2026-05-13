import React, { useState } from 'react';
import axios from 'axios';

const AudienceTab = ({ audiences, refreshAudiences }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAudience, setCurrentAudience] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State për filtrin
  const [formData, setFormData] = useState({
    emertimi: '', pershkrimi: '', mosha_min: '', mosha_max: '', gjinia: 'All', lokacioni: '', interesat: ''
  });

  const filteredAudiences = audiences.filter(aud => 
    aud.emertimi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    aud.lokacioni.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (audience = null) => {
    if (audience) {
      setCurrentAudience(audience);
      setFormData({ ...audience });
    } else {
      setCurrentAudience(null);
      setFormData({ emertimi: '', pershkrimi: '', mosha_min: '', mosha_max: '', gjinia: 'All', lokacioni: '', interesat: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    const dataToSend = {
      ...formData,
      mosha_min: parseInt(formData.mosha_min) || 0,
      mosha_max: parseInt(formData.mosha_max) || 0
    };

    try {
      if (currentAudience) {
        await axios.put(`http://localhost:3000/api/audiences/${currentAudience.id}`, dataToSend, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post("http://localhost:3000/api/audiences", dataToSend, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      refreshAudiences();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    const token = localStorage.getItem("accessToken");
    try {
      await axios.delete(`http://localhost:3000/api/audiences/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      refreshAudiences();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
        <div className="w-1/3">
          <input 
            type="text" 
            placeholder="Search by name or location..." 
            className="w-full px-5 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-sm text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button 
          onClick={() => openModal()} 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
        >
          Create Audience
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-slate-400 text-xs uppercase tracking-widest bg-slate-50/50">
              <th className="p-4">Name</th>
              <th className="p-4">Age Group</th>
              <th className="p-4">Gender</th>
              <th className="p-4">Location</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-slate-600 text-sm">
            {filteredAudiences.length > 0 ? (
              filteredAudiences.map((aud) => (
                <tr key={aud.id} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-bold text-slate-800">{aud.emertimi}</td>
                  <td className="p-4">{aud.mosha_min} - {aud.mosha_max} yrs</td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase">
                      {aud.gjinia}
                    </span>
                  </td>
                  <td className="p-4">{aud.lokacioni}</td>
                  <td className="p-4 text-right space-x-4">
                  <button 
                   onClick={() => openModal(aud)} 
                   className="text-slate-400 font-bold transition-all duration-200 hover:text-indigo-600 active:scale-95"
                   >
                   Edit
                  </button>
                  <button 
                  onClick={() => handleDelete(aud.id)} 
                  className="text-slate-400 font-bold transition-all duration-200 hover:text-rose-500 active:scale-95"
                  >
                  Delete
                  </button>
                  </td>
                  </tr>
                 ))
                 ) : (
              <tr>
                <td colSpan="5" className="p-10 text-center text-slate-400 font-medium">
                  No audiences found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-black text-slate-800 mb-8">
              {currentAudience ? 'Edit Audience' : 'New Audience'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                className="w-full bg-slate-100 border-none rounded-2xl p-4" 
                placeholder="Audience Name" 
                value={formData.emertimi} 
                onChange={(e) => setFormData({...formData, emertimi: e.target.value})} 
                required 
              />

              <div className="grid grid-cols-2 gap-4">
                <input type="number" className="w-full bg-slate-100 border-none rounded-2xl p-4" placeholder="Min Age" value={formData.mosha_min} onChange={(e) => setFormData({...formData, mosha_min: e.target.value})} />
                <input type="number" className="w-full bg-slate-100 border-none rounded-2xl p-4" placeholder="Max Age" value={formData.mosha_max} onChange={(e) => setFormData({...formData, mosha_max: e.target.value})} />
              </div>

              <select 
                className="w-full bg-slate-100 border-none rounded-2xl p-4 text-slate-600 appearance-none"
                value={formData.gjinia}
                onChange={(e) => setFormData({...formData, gjinia: e.target.value})}
              >
                <option value="All">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              <input className="w-full bg-slate-100 border-none rounded-2xl p-4" placeholder="Location" value={formData.lokacioni} onChange={(e) => setFormData({...formData, lokacioni: e.target.value})} />
              <textarea className="w-full bg-slate-100 border-none rounded-2xl p-4 h-32" placeholder="Interests & Behaviors" value={formData.interesat} onChange={(e) => setFormData({...formData, interesat: e.target.value})} />
              
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 font-bold text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 bg-indigo-600 text-white rounded-2xl font-bold py-4 shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudienceTab;