import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const AudienceTab = ({ audiences, refreshAudiences }) => {
  const { user } = useContext(AuthContext);

  const roles =
    user?.roles ||
    user?.role ||
    user?.userroles?.map((ur) => ur.role?.normalized_name) ||
    [];

  const normalizedRoles = (Array.isArray(roles) ? roles : [roles]).map((r) =>
    typeof r === "string"
      ? r.toUpperCase()
      : (r?.role?.normalized_name || r?.normalized_name || "").toUpperCase()
  );

  const canModify =
    normalizedRoles.includes("ADMIN") ||
    normalizedRoles.includes("MANAGER");

  const [genders, setGenders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAudience, setCurrentAudience] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    emertimi: "",
    pershkrimi: "",
    mosha_min: "",
    mosha_max: "",
    gender_id: "",
    lokacioni: "",
    interesat: "",
  });

  const fetchGenders = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get("http://localhost:3000/api/genders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setGenders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGenders();
  }, []);

  const filteredAudiences = audiences.filter(
    (a) =>
      a.emertimi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.lokacioni?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (audience = null) => {
    if (!canModify) return;

    if (audience) {
      setCurrentAudience(audience);
      setFormData({
        emertimi: audience.emertimi || "",
        pershkrimi: audience.pershkrimi || "",
        mosha_min: audience.mosha_min || "",
        mosha_max: audience.mosha_max || "",
        gender_id: audience.gender_id || "",
        lokacioni: audience.lokacioni || "",
        interesat: audience.interesat || "",
      });
    } else {
      setCurrentAudience(null);
      setFormData({
        emertimi: "",
        pershkrimi: "",
        mosha_min: "",
        mosha_max: "",
        gender_id: "",
        lokacioni: "",
        interesat: "",
      });
    }

    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canModify) return;

    try {
      const token = localStorage.getItem("accessToken");

      const payload = {
        ...formData,
        mosha_min: formData.mosha_min ? Number(formData.mosha_min) : null,
        mosha_max: formData.mosha_max ? Number(formData.mosha_max) : null,
        gender_id: formData.gender_id ? Number(formData.gender_id) : null,
      };

      if (currentAudience) {
        await axios.put(
          `http://localhost:3000/api/audiences/${currentAudience.id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post("http://localhost:3000/api/audiences", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      await refreshAudiences();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!canModify || !currentAudience) return;

    try {
      const token = localStorage.getItem("accessToken");

      await axios.delete(
        `http://localhost:3000/api/audiences/${currentAudience.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await refreshAudiences();
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      <div className="flex justify-between items-center bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
        <input
          className="w-1/3 px-5 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          placeholder="Search audiences..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {canModify && (
          <button
            onClick={() => openModal()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl font-bold shadow-lg transition-all"
          >
            + Add Audience
          </button>
        )}
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs uppercase text-slate-400 bg-slate-50">
              <th className="p-4">Name</th>
              <th className="p-4">Age</th>
              <th className="p-4">Gender</th>
              <th className="p-4">Location</th>
            </tr>
          </thead>

          <tbody>
            {filteredAudiences.map((a) => (
              <tr key={a.id} className="border-t hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-800">{a.emertimi}</td>
                <td className="p-4">
                  {a.mosha_min} - {a.mosha_max}
                </td>
                <td className="p-4">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold">
                    {a.gender?.name || "No gender"}
                  </span>
                </td>
                <td className="p-4">{a.lokacioni}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">

            <h3 className="text-xl font-bold text-slate-800 mb-6">
              {currentAudience ? "Edit Audience" : "Add Audience"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm"
                placeholder="Audience Name"
                value={formData.emertimi}
                onChange={(e) =>
                  setFormData({ ...formData, emertimi: e.target.value })
                }
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm"
                  placeholder="Min Age"
                  value={formData.mosha_min}
                  onChange={(e) =>
                    setFormData({ ...formData, mosha_min: e.target.value })
                  }
                />

                <input
                  type="number"
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm"
                  placeholder="Max Age"
                  value={formData.mosha_max}
                  onChange={(e) =>
                    setFormData({ ...formData, mosha_max: e.target.value })
                  }
                />
              </div>

              <select
                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm"
                value={formData.gender_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    gender_id: Number(e.target.value),
                  })
                }
              >
                <option value="">Select Gender</option>
                {genders.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>

              <input
                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm"
                placeholder="Location"
                value={formData.lokacioni}
                onChange={(e) =>
                  setFormData({ ...formData, lokacioni: e.target.value })
                }
              />

              <textarea
                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm h-28"
                placeholder="Interests"
                value={formData.interesat}
                onChange={(e) =>
                  setFormData({ ...formData, interesat: e.target.value })
                }
              />

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 shadow-md"
                >
                  Save
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 w-[420px] text-center">
            <h3 className="text-xl font-bold mb-3">Are you sure?</h3>
            <p className="text-slate-500 mb-6">
              This audience will be deleted permanently.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 bg-slate-100 py-3 rounded-xl font-bold"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="flex-1 bg-rose-600 text-white py-3 rounded-xl font-bold"
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

export default AudienceTab;