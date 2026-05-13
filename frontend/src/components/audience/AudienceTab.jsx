import React, { useState } from 'react';
import axios from 'axios';

const AudienceTab = ({ audiences, refreshAudiences }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAudience, setCurrentAudience] = useState(null);
  const [formData, setFormData] = useState({
    emertimi: '', pershkrimi: '', mosha_min: '', mosha_max: '', gjinia: 'Të gjithë', lokacioni: '', interesat: ''
  });

  const openModal = (audience = null) => {
    if (audience) {
      setCurrentAudience(audience);
      setFormData({ ...audience });
    } else {
      setCurrentAudience(null);
      setFormData({ emertimi: '', pershkrimi: '', mosha_min: '', mosha_max: '', gjinia: 'Të gjithë', lokacioni: '', interesat: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    try {
      if (currentAudience) {
        await axios.put(`http://localhost:3000/api/audiences/${currentAudience.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post("http://localhost:3000/api/audiences", formData, {
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
    <div className="p-4">
      <button onClick={() => openModal()} className="mb-4 bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-all">
        + Create New Audience
      </button>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-slate-400 text-sm uppercase">
            <th className="p-4">Name</th>
            <th className="p-4">Age Group</th>
            <th className="p-4">Location</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody className="text-slate-600">
          {audiences.map((aud) => (
            <tr key={aud.id} className="border-t border-slate-50 hover:bg-slate-50/50">
              <td className="p-4 font-semibold">{aud.emertimi}</td>
              <td className="p-4">{aud.mosha_min} - {aud.mosha_max}</td>
              <td className="p-4">{aud.lokacioni}</td>
              <td className="p-4 flex gap-2">
                <button onClick={() => openModal(aud)} className="text-indigo-600 font-bold text-sm">Edit</button>
                <button onClick={() => handleDelete(aud.id)} className="text-red-500 font-bold text-sm">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Simple Modal logic follows the same style as UsersTab */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md animate-in zoom-in duration-300">
            <h2 className="text-xl font-black mb-6">{currentAudience ? 'Edit Audience' : 'New Audience'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input className="w-full bg-slate-50 border-none rounded-2xl p-4" placeholder="Audience Name" value={formData.emertimi} onChange={(e) => setFormData({...formData, emertimi: e.target.value})} required />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" className="w-full bg-slate-50 border-none rounded-2xl p-4" placeholder="Min Age" value={formData.mosha_min} onChange={(e) => setFormData({...formData, mosha_min: e.target.value})} />
                <input type="number" className="w-full bg-slate-50 border-none rounded-2xl p-4" placeholder="Max Age" value={formData.mosha_max} onChange={(e) => setFormData({...formData, mosha_max: e.target.value})} />
              </div>
              <input className="w-full bg-slate-50 border-none rounded-2xl p-4" placeholder="Location" value={formData.lokacioni} onChange={(e) => setFormData({...formData, lokacioni: e.target.value})} />
              <textarea className="w-full bg-slate-50 border-none rounded-2xl p-4" placeholder="Interests" value={formData.interesat} onChange={(e) => setFormData({...formData, interesat: e.target.value})} />
              
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 font-bold text-slate-400">Cancel</button>
                <button type="submit" className="flex-1 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudienceTab;