import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const BudgetTab = ({ campaigns }) => {
  const [budgets, setBudgets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    campaign_id: "",
    shuma_totale: "",
    shuma_shpenzuar: "",
    shuma_mbetur: "",
  });

  const fetchBudgets = async () => {
    try {
      const res = await api.get("/manager/budgets");
      setBudgets(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch budgets", err);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/manager/budgets", {
        campaign_id: Number(formData.campaign_id),
        shuma_totale: Number(formData.shuma_totale),
        shuma_shpenzuar: Number(formData.shuma_shpenzuar),
        shuma_mbetur: Number(formData.shuma_mbetur),
      });

      setFormData({
        campaign_id: "",
        shuma_totale: "",
        shuma_shpenzuar: "",
        shuma_mbetur: "",
      });

      setIsModalOpen(false);
      fetchBudgets();
    } catch (err) {
      console.error("Failed to create budget", err);
      alert(
        err.response?.data?.message ||
          "Failed to create budget"
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/manager/budgets/${id}`);
      fetchBudgets();
    } catch (err) {
      console.error("Delete failed", err);
      alert(
        err.response?.data?.message ||
          "Failed to delete budget"
      );
    }
  };

  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="font-bold text-2xl text-slate-800">
            Budget Management
          </h3>

          <p className="text-slate-400 text-sm">
            Manage campaign budgets and expenses
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          Add New Budget
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs text-slate-400 uppercase tracking-wider border-b border-slate-50">
              <th className="pb-4 font-semibold">
                Campaign ID
              </th>

              <th className="pb-4 font-semibold">
                Total Amount
              </th>

              <th className="pb-4 font-semibold">
                Spent Amount
              </th>

              <th className="pb-4 font-semibold">
                Remaining Amount
              </th>

              <th className="pb-4 text-right font-semibold">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {budgets.map((budget) => (
              <tr
                key={budget.id}
                className="group hover:bg-slate-50/50 transition-colors"
              >
                <td className="py-4 text-slate-700">
                  {budget.campaign_id}
                </td>

                <td className="py-4 text-slate-500 text-sm">
                  {budget.shuma_totale}
                </td>

                <td className="py-4 text-slate-500 text-sm">
                  {budget.shuma_shpenzuar}
                </td>

                <td className="py-4 text-slate-500 text-sm">
                  {budget.shuma_mbetur}
                </td>

                <td className="py-4 text-right">
                  <button
                    onClick={() =>
                      handleDelete(budget.id)
                    }
                    className="text-rose-600 font-bold"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {budgets.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="py-10 text-center text-slate-400 text-sm"
                >
                  No budgets found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-6">
              Create New Budget
            </h3>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <select
                className="w-full bg-slate-50 rounded-2xl p-4"
                value={formData.campaign_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    campaign_id: e.target.value,
                  })
                }
                required
              >
                <option value="">
                  Select Campaign
                </option>

                {campaigns.map((campaign) => (
                  <option
                    key={campaign.id}
                    value={campaign.id}
                  >
                    {campaign.emertimi}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Total Amount"
                className="w-full bg-slate-50 rounded-2xl p-4"
                value={formData.shuma_totale}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    shuma_totale: e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Spent Amount"
                className="w-full bg-slate-50 rounded-2xl p-4"
                value={formData.shuma_shpenzuar}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    shuma_shpenzuar:
                      e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Remaining Amount"
                className="w-full bg-slate-50 rounded-2xl p-4"
                value={formData.shuma_mbetur}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    shuma_mbetur:
                      e.target.value,
                  })
                }
              />

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold"
              >
                Create Budget
              </button>

              <button
                type="button"
                onClick={() =>
                  setIsModalOpen(false)
                }
                className="w-full bg-slate-100 text-slate-600 py-3 rounded-2xl font-bold"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetTab;