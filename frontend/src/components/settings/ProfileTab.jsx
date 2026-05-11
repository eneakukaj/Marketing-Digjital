import React, { useEffect, useState } from "react";
import axios from "axios";

const ProfileTab = () => {
  const [profile, setProfile] = useState({});
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

    await axios.put(
      "http://localhost:3000/api/settings/profile",
      profile,
      config
    );

    alert("Profile updated");
  };

  return (
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
  );
};

export default ProfileTab;