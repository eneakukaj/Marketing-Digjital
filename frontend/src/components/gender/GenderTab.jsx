import React, { useState, useEffect } from "react";
import axios from "axios";

const GenderTab = () => {
  const [genders, setGenders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGender, setCurrentGender] = useState(null);
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [genderToDelete, setGenderToDelete] = useState(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const res = await axios.get(
        "http://localhost:3000/api/genders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setGenders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (gender = null) => {
    setErrorMessage("");

    if (gender) {
      setCurrentGender(gender);
      setName(gender.name || "");
    } else {
      setCurrentGender(null);
      setName("");
    }

    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("accessToken");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const payload = {
        name,
      };

      if (currentGender) {
        await axios.put(
          `http://localhost:3000/api/genders/${currentGender.id}`,
          payload,
          config
        );
      } else {
        await axios.post(
          "http://localhost:3000/api/genders",
          payload,
          config
        );
      }

      await fetchData();
      setIsModalOpen(false);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || "Error saving gender"
      );
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">
          Gender Management
        </h2>

        <button
          onClick={() => openModal()}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition-all"
        >
          + Add Gender
        </button>
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-50">
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
              Gender
            </th>

            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-50">
          {genders.map((gender) => (
            <tr
              key={gender.id}
              className="group hover:bg-slate-50/50 transition-colors"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold uppercase">
                    {gender.name?.charAt(0)}
                  </div>

                  <div className="text-sm font-bold text-slate-800">
                    {gender.name}
                  </div>
                </div>
              </td>

              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => openModal(gender)}
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                >
                  Edit
                </button>

                <button
                  onClick={() => {
                    setGenderToDelete(gender);
                    setIsDeleteModalOpen(true);
                  }}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-slate-800 mb-6">
              {currentGender ? "Edit Gender" : "Add Gender"}
            </h3>

            {errorMessage && (
              <div className="mb-4 p-4 bg-rose-50 text-rose-600 text-sm font-bold rounded-2xl">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <label className="text-xs font-bold text-slate-500 ml-1">
                Gender Name
              </label>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm mt-1 mb-6 focus:ring-2 focus:ring-indigo-500"
                required
              />

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-100 text-slate-700 py-4 rounded-2xl font-bold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/30 backdrop-blur-[2px]">
          <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-[440px] text-center shadow-2xl">
            <h3 className="text-[26px] font-bold mb-3">
              Are you sure?
            </h3>

            <p className="text-slate-500 mb-10">
              Gender{" "}
              <span className="font-bold">
                {genderToDelete?.name}
              </span>{" "}
              will be deleted permanently.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setGenderToDelete(null);
                }}
                className="flex-1 bg-slate-100 text-slate-700 py-4 rounded-2xl font-bold"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  try {
                    const token =
                      localStorage.getItem("accessToken");

                    await axios.delete(
                      `http://localhost:3000/api/genders/${genderToDelete.id}`,
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    );

                    await fetchData();

                    setIsDeleteModalOpen(false);
                    setGenderToDelete(null);
                  } catch (err) {
                    alert(
                      err.response?.data?.message ||
                        "Cannot delete gender."
                    );
                  }
                }}
                className="flex-1 bg-rose-600 text-white py-4 rounded-2xl font-bold"
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

export default GenderTab;