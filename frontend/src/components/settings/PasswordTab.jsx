import React, { useState } from "react";
import axios from "axios";

const PasswordTab = () => {
  const [data, setData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const token = localStorage.getItem("accessToken");

  const handleChange = async (e) => {
    e.preventDefault();
    try{
    await axios.put(
      "http://localhost:3000/api/settings/change-password",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setIsSuccessModalOpen(true);
    setData({ oldPassword: "", newPassword: "" });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleChange} className="space-y-4">
      <input
        type="password"
        className="w-full p-3 bg-slate-50 rounded-xl"
        placeholder="Old Password"
        value={data.oldPassword}
        onChange={(e) =>
          setData({ ...data, oldPassword: e.target.value })
        }
        required
      />

      <input
        type="password"
        className="w-full p-3 bg-slate-50 rounded-xl"
        placeholder="New Password"
        value={data.newPassword}
        onChange={(e) =>
          setData({ ...data, newPassword: e.target.value })
        }
        required
      />

      <button className="bg-rose-600 text-white px-6 py-2 rounded-xl font-bold">
        Change Password
      </button>
    </form>

    {isSuccessModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/30 backdrop-blur-[2px]">
          <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-[400px] text-center shadow-2xl border border-slate-100/50 mx-4">
            <h3 className="text-[24px] font-bold text-[#1e293b] mb-3 tracking-tight">
              Password Changed
            </h3>
            <p className="text-[#64748b] text-sm leading-relaxed mb-8 px-4">
              Your security credentials have been updated successfully.
            </p>
            <button
              type="button"
              onClick={() => setIsSuccessModalOpen(false)}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-base hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordTab;