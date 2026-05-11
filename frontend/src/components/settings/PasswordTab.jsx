import React, { useState } from "react";
import axios from "axios";

const PasswordTab = () => {
  const [data, setData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const token = localStorage.getItem("accessToken");

  const handleChange = async (e) => {
    e.preventDefault();

    await axios.put(
      "http://localhost:3000/api/settings/change-password",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Password changed");
    setData({ oldPassword: "", newPassword: "" });
  };

  return (
    <form onSubmit={handleChange} className="space-y-4">
      <input
        type="password"
        className="w-full p-3 bg-slate-50 rounded-xl"
        placeholder="Old Password"
        value={data.oldPassword}
        onChange={(e) =>
          setData({ ...data, oldPassword: e.target.value })
        }
      />

      <input
        type="password"
        className="w-full p-3 bg-slate-50 rounded-xl"
        placeholder="New Password"
        value={data.newPassword}
        onChange={(e) =>
          setData({ ...data, newPassword: e.target.value })
        }
      />

      <button className="bg-rose-600 text-white px-6 py-2 rounded-xl font-bold">
        Change Password
      </button>
    </form>
  );
};

export default PasswordTab;