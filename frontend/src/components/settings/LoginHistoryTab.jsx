import React, { useEffect, useState } from "react";
import axios from "axios";

const LoginHistoryTab = () => {
  const [tokens, setTokens] = useState([]);
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
  const [tokenToRevoke, setTokenToRevoke] = useState(null);
  const token = localStorage.getItem("accessToken");

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const fetchTokens = async () => {
    try{
    const res = await axios.get(
      "http://localhost:3000/api/admin/tokens",
      config
    );
    setTokens(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  const revokeToken = async (id) => {
    try{
    await axios.put(
      `http://localhost:3000/api/admin/tokens/revoke/${id}`,
      {},
      config
    );
      await fetchTokens();
      setIsRevokeModalOpen(false);
      setTokenToRevoke(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      {tokens.map((t) => (
        <div
          key={t.id}
          className="p-4 bg-slate-50 rounded-xl flex justify-between items-center"
        >
          <div>
            <p className="text-xs font-bold">User #{t.user_id}</p>
            <p className="text-[10px] text-gray-400 truncate w-80">
              {t.token}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500">
              {t.revoked ? "Revoked" : "Active"}
            </span>

          {!t.revoked && (
              <button
                onClick={() => {
                  setTokenToRevoke(t);
                  setIsRevokeModalOpen(true);
                }}
                className="text-xs text-red-600 font-bold bg-red-50 px-3 py-1 rounded-lg hover:bg-red-100 transition-colors"
              >
                Revoke
              </button>
            )}
          </div>
        </div>
      ))}
      {isRevokeModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/30 backdrop-blur-[2px]">
          <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-[440px] text-center shadow-2xl border border-slate-100/50 mx-4">
            <h3 className="text-[26px] font-bold text-[#1e293b] mb-3 tracking-tight">
              Revoke Session?
            </h3>
            <p className="text-[#64748b] text-base leading-relaxed mb-10 px-4">
              Are you sure you want to revoke Token <span className="font-bold text-[#475569]">#{tokenToRevoke?.id}</span>? This device will be signed out.
            </p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => {
                  setIsRevokeModalOpen(false);
                  setTokenToRevoke(null);
                }}
                className="flex-1 bg-[#f1f5f9] text-[#334155] py-4 rounded-2xl font-bold text-base hover:bg-[#e2e8f0] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => revokeToken(tokenToRevoke.id)}
                className="flex-1 bg-[#d97706] text-white py-4 rounded-2xl font-bold text-base hover:bg-[#b45309] transition-colors shadow-md shadow-amber-100"
              >
                Revoke
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginHistoryTab;