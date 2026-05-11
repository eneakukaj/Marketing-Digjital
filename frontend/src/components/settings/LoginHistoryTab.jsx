import React, { useEffect, useState } from "react";
import axios from "axios";

const LoginHistoryTab = () => {
  const [tokens, setTokens] = useState([]);
  const token = localStorage.getItem("accessToken");

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const fetchTokens = async () => {
    const res = await axios.get(
      "http://localhost:3000/api/admin/tokens",
      config
    );

    setTokens(res.data);
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  const revokeToken = async (id) => {
    await axios.put(
      `http://localhost:3000/api/admin/tokens/revoke/${id}`,
      {},
      config
    );

    fetchTokens();
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
            <p className="text-xs">
              Expires: {new Date(t.expires).toLocaleDateString()}
            </p>
          </div>

          <button
            onClick={() => revokeToken(t.id)}
            className="text-rose-600 font-bold text-sm"
          >
            Revoke
          </button>
        </div>
      ))}
    </div>
  );
};

export default LoginHistoryTab;