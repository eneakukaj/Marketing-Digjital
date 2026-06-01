import React, { useState, useEffect, useContext } from "react";
import api from "../../api/axios"; 
import { AuthContext } from "../../context/AuthContext"; 

const SocialMediaTab = () => {
  const { user } = useContext(AuthContext); 
  const [platforma, setPlatforma] = useState("Instagram");
  const [customPlatform, setCustomPlatform] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [linkedAccounts, setLinkedAccounts] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);

  const fetchSocialChannels = async () => {
    try {
      const res = await api.get("/channels");
      const socialOnly = res.data.filter(ch => ch.lloji === "Custom Social");
      setLinkedAccounts(socialOnly);
    } catch (err) {
      console.error("Error fetching social channels:", err);
    }
  };

  useEffect(() => {
    fetchSocialChannels();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setPlatforma("Instagram");
    setCustomPlatform("");
    setUsername("");
    setMessage({ type: "", text: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (account) => {
    setMessage({ type: "", text: "" });
    setEditingId(account.id);
    
    const cleanPlatform = account.emertimi.split(" ")[0];
    if (["Instagram", "Facebook", "LinkedIn", "TikTok"].includes(cleanPlatform)) {
      setPlatforma(cleanPlatform);
      setCustomPlatform("");
    } else {
      setPlatforma("Other");
      setCustomPlatform(cleanPlatform);
    }
    
    const extractedUsername = account.emertimi.includes("@") 
      ? account.emertimi.split("@")[1].replace(")", "") 
      : "";
    setUsername(extractedUsername);
    setIsModalOpen(true);
  };

  const openDeleteModal = (account) => {
    setAccountToDelete(account);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!accountToDelete) return;
    try {
      await api.delete(`/channels/${accountToDelete.id}`);
      setIsDeleteModalOpen(false);
      setAccountToDelete(null);
      fetchSocialChannels();
    } catch (err) {
      console.error("Error deleting channel:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    const platformaFinale = platforma === "Other" ? customPlatform : platforma;
    const activeUserId = user?.id || user?.user?.id || 1;

    try {
      if (editingId) {
        await api.put(`/channels/${editingId}`, {
          emertimi: `${platformaFinale} (@${username})`,
          url: `https://${platformaFinale.toLowerCase()}.com/${username}`
        });
      } else {
        await api.post("/channels", {
          isSocial: true,
          platforma: platformaFinale,
          username: username,
          user_id: activeUserId
        });
      }

      setUsername("");
      setCustomPlatform("");
      setPlatforma("Instagram");
      setIsModalOpen(false); 
      fetchSocialChannels(); 
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: err.response?.data?.message || "Operation failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800 tracking-tight">Linked Accounts</h3>
          <p className="text-xs text-gray-400">Active dynamic channels available for your campaigns.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-indigo-600 text-white font-bold text-sm px-5 py-3 rounded-2xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Link Account
        </button>
      </div>

      {linkedAccounts.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-slate-200 rounded-[2rem] text-sm text-slate-400 bg-slate-50/30">
          No social media accounts linked yet. Click the button above to add one.
        </div>
      ) : (
        <div className="overflow-hidden border border-slate-100 rounded-[2rem] shadow-sm bg-white">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="p-5">Channel Display Name</th>
                <th className="p-5">Type</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm text-slate-700">
              {linkedAccounts.map((ac) => (
                <tr key={ac.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-5 font-semibold text-slate-800">{ac.emertimi}</td>
                  <td className="p-5 text-xs text-slate-500">{ac.lloji}</td>
                  <td className="p-5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 uppercase">
                      {ac.statusi}
                    </span>
                  </td>
                  <td className="p-5 text-right space-x-3">
                    <button
                      onClick={() => openEditModal(ac)}
                      className="p-2 text-slate-400 hover:text-indigo-600"
      
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(ac)}
                      className="p-2 text-slate-400 hover:text-rose-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/30 backdrop-blur-[2px]">
          <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-[480px] shadow-2xl border border-slate-100/50 mx-4 relative animate-in fade-in zoom-in-95 duration-150">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-[26px] font-bold text-slate-800 mb-1 tracking-tight">
              {editingId ? "Update Social Link" : "Link Social Account"}
            </h3>
            <p className="text-sm text-gray-400 mb-8">
              {editingId ? "Modify your dynamic channel information." : "Connect a custom profile to use in your marketing workflows."}
            </p>

            {message.text && (
              <div className={`p-4 rounded-2xl mb-6 text-xs font-semibold ${message.type === "success" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Platform</label>
                <select
                  value={platforma}
                  onChange={(e) => setPlatforma(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl p-4 text-sm text-slate-700 font-semibold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                  disabled={editingId}
                >
                  <option value="Instagram">Instagram</option>
                  <option value="Facebook">Facebook</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Other">Other...</option>
                </select>
              </div>

              {platforma === "Other" && (
                <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-100">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Custom Platform Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Pinterest"
                    value={customPlatform}
                    onChange={(e) => setCustomPlatform(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl p-4 text-sm text-slate-700 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                    required
                    disabled={editingId}
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Username / Handle</label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-slate-400 text-sm font-bold">@</span>
                  <input
                    type="text"
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl p-4 pl-9 text-sm text-slate-700 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-100 text-slate-700 py-4 rounded-2xl font-bold text-base hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold text-base hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100 disabled:opacity-50"
                >
                  {loading ? "Saving..." : editingId ? "Save Changes" : "Link Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/30 backdrop-blur-[2px]">
          <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-[440px] text-center shadow-2xl border border-slate-100/50 mx-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-[26px] font-bold text-[#1e293b] mb-3 tracking-tight">
              Are you sure?
            </h3>

            <p className="text-[#64748b] text-base leading-relaxed mb-10 px-4">
              Social account{" "}
              <span className="font-bold text-[#475569]">
                {accountToDelete?.emertimi}
              </span>{" "}
              will be deleted permanently.
            </p>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setAccountToDelete(null);
                }}
                className="flex-1 bg-[#f1f5f9] text-[#334155] py-4 rounded-2xl font-bold text-base hover:bg-[#e2e8f0] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
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

export default SocialMediaTab;