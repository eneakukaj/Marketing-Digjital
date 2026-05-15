import React, { useEffect, useState } from "react";
import axios from "axios";

const ProfileTab = () => {
  const [profile, setProfile] = useState({});
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const token = localStorage.getItem("accessToken");

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await axios.get(
        "http://localhost:3000/api/settings/profile",
        config
      );
      setProfile(res.data);
    };

    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try{
    await axios.put(
      "http://localhost:3000/api/settings/profile",
      profile,
      config
    );
    setIsSuccessModalOpen(true);
    } catch (err) {
    }
  };

  return (
    <>
      <form onSubmit={handleUpdate} className="space-y-4">
      <input
        className="w-full p-3 bg-slate-50 rounded-xl"
        placeholder="Emri"
        value={profile.emri || ""}
        onChange={(e) =>
          setProfile({ ...profile, emri: e.target.value })
        }
      />

      <input
        className="w-full p-3 bg-slate-50 rounded-xl"
        placeholder="Mbiemri"
        value={profile.mbiemri || ""}
        onChange={(e) =>
          setProfile({ ...profile, mbiemri: e.target.value })
        }
      />

      <input
        className="w-full p-3 bg-slate-50 rounded-xl"
        placeholder="Email"
        value={profile.email || ""}
        onChange={(e) =>
          setProfile({ ...profile, email: e.target.value })
        }
      />

      <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold">
        Save Changes
      </button>
    </form>

    {isSuccessModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/30 backdrop-blur-[2px]">
          <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-[400px] text-center shadow-2xl border border-slate-100/50 mx-4">
            <h3 className="text-[24px] font-bold text-[#1e293b] mb-3 tracking-tight">
              Success!
            </h3>
            <p className="text-[#64748b] text-sm leading-relaxed mb-8 px-4">
              Your profile details have been successfully updated.
            </p>
            <button
              type="button"
              onClick={() => setIsSuccessModalOpen(false)}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-base hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100"
            >
              Great
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileTab;