import React, { useEffect, useState } from "react";
import axios from "axios";

const TokensTab = () => {
  const [tokens, setTokens] = useState([]);
  const [selectedToken, setSelectedToken] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTokens = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const res = await axios.get(
        "http://localhost:3000/api/admin/tokens",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTokens(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");

      await axios.delete(
        `http://localhost:3000/api/admin/tokens/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchTokens();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRevoke = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");

      await axios.put(
        `http://localhost:3000/api/admin/tokens/revoke/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchTokens();
    } catch (err) {
      console.error(err);
    }
  };

  const openModal = (token) => {
    setSelectedToken(token);
    setIsModalOpen(true);
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">
          Token Management
        </h2>

        <div className="bg-indigo-50 text-indigo-600 px-5 py-3 rounded-2xl font-bold text-sm">
          {tokens.length} Tokens
        </div>
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-50">
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
              Token
            </th>

            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
              User
            </th>

            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
              Expires
            </th>

            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
              Status
            </th>

            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-50">
          {tokens.map((token) => {
            const isRevoked = token.revoked;
            const isExpired =
              new Date(token.expires) < new Date();

            return (
              <tr
                key={token.id}
                className="group hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold shrink-0">
                      T
                    </div>

                    <div>
                      <div className="text-sm font-bold text-slate-800 max-w-[240px] truncate">
                        {token.token}
                      </div>

                      <div className="text-xs text-slate-400">
                        ID #{token.id}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                  User #{token.user_id}
                </td>

                <td className="px-6 py-4 text-sm text-slate-500">
                  {new Date(token.expires).toLocaleDateString()}
                </td>

                <td className="px-6 py-4">
                  {isRevoked ? (
                    <span className="bg-rose-100 text-rose-600 text-xs font-bold px-3 py-1 rounded-full">
                      Revoked
                    </span>
                  ) : isExpired ? (
                    <span className="bg-amber-100 text-amber-600 text-xs font-bold px-3 py-1 rounded-full">
                      Expired
                    </span>
                  ) : (
                    <span className="bg-emerald-100 text-emerald-600 text-xs font-bold px-3 py-1 rounded-full">
                      Active
                    </span>
                  )}
                </td>

                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => openModal(token)}
                    className="text-indigo-600 font-bold mr-4 text-sm hover:underline"
                  >
                    View
                  </button>

                  {!isRevoked && (
                    <button
                      onClick={() => handleRevoke(token.id)}
                      className="text-amber-600 font-bold mr-4 text-sm hover:underline"
                    >
                      Revoke
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(token.id)}
                    className="text-rose-600 font-bold text-sm hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {isModalOpen && selectedToken && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 text-2xl"
            >
              &times;
            </button>

            <h3 className="text-2xl font-bold text-slate-800 mb-8">
              Token Details
            </h3>

            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Token
                </label>

                <div className="bg-slate-50 mt-2 rounded-2xl p-4 text-sm break-all text-slate-700">
                  {selectedToken.token}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    User ID
                  </label>

                  <div className="bg-slate-50 mt-2 rounded-2xl p-4 text-sm text-slate-700">
                    {selectedToken.user_id}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Token ID
                  </label>

                  <div className="bg-slate-50 mt-2 rounded-2xl p-4 text-sm text-slate-700">
                    #{selectedToken.id}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Created At
                  </label>

                  <div className="bg-slate-50 mt-2 rounded-2xl p-4 text-sm text-slate-700">
                    {new Date(
                      selectedToken.created_at
                    ).toLocaleString()}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Expires
                  </label>

                  <div className="bg-slate-50 mt-2 rounded-2xl p-4 text-sm text-slate-700">
                    {new Date(
                      selectedToken.expires
                    ).toLocaleString()}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Revoked At
                </label>

                <div className="bg-slate-50 mt-2 rounded-2xl p-4 text-sm text-slate-700">
                  {selectedToken.revoked
                    ? new Date(
                        selectedToken.revoked
                      ).toLocaleString()
                    : "Not revoked"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokensTab;