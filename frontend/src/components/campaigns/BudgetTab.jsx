import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const BudgetTab = ({ campaigns }) => {
  const [budgets, setBudgets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBudget, setCurrentBudget] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState(null);

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

const openModal = (budget = null) => {
  if (budget) {
    setCurrentBudget(budget);

    setFormData({
      campaign_id: budget.campaign_id || "",
      shuma_totale: budget.shuma_totale || "",
      shuma_shpenzuar: budget.shuma_shpenzuar || "",
      shuma_mbetur: budget.shuma_mbetur || "",
    });
  } else {
    setCurrentBudget(null);

    setFormData({
      campaign_id: "",
      shuma_totale: "",
      shuma_shpenzuar: "",
      shuma_mbetur: "",
    });
  }

  setIsModalOpen(true);
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
  campaign_id: Number(formData.campaign_id),
  shuma_totale: Number(formData.shuma_totale),
  shuma_shpenzuar: Number(formData.shuma_shpenzuar),
  shuma_mbetur: Number(formData.shuma_mbetur),
};

if (currentBudget) {
  await api.put(
    `/manager/budgets/${currentBudget.id}`,
    payload
  );
} else {
  await api.post("/manager/budgets", payload);
}
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

  const handleDelete = async () => {
  try {
    await api.delete(`/manager/budgets/${budgetToDelete.id}`);
    fetchBudgets();
    setIsDeleteModalOpen(false);
    setBudgetToDelete(null);
  } catch (err) {
    console.error("Delete failed", err);
    alert(err.response?.data?.message || "Failed to delete budget");
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
          onClick={() => openModal()}
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
    <div className="flex justify-end gap-2">
      <button
        onClick={() => openModal(budget)}
        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
      >
        Edit
      </button>

      <button
        onClick={() => {
          setBudgetToDelete(budget);
          setIsDeleteModalOpen(true);
        }}
        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
      >
        Delete
      </button>
    </div>
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
              {currentBudget ? "Edit Budget" : "Create New Budget"}
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
                {currentBudget ? "Update Budget" : "Create Budget"}
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

      {isDeleteModalOpen && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/30 backdrop-blur-[2px]">
    <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-[440px] text-center shadow-2xl border border-slate-100/50 mx-4">
      <h3 className="text-[26px] font-bold text-[#1e293b] mb-3 tracking-tight">
        Are you sure?
      </h3>

      <p className="text-[#64748b] text-base leading-relaxed mb-10 px-4">
        Budget for campaign{" "}
        <span className="font-bold text-[#475569]">
          #{budgetToDelete?.campaign_id}
        </span>{" "}
        will be deleted permanently.
      </p>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => {
            setIsDeleteModalOpen(false);
            setBudgetToDelete(null);
          }}
          className="flex-1 bg-[#f1f5f9] text-[#334155] py-4 rounded-2xl font-bold text-base hover:bg-[#e2e8f0] transition-colors"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleDelete}
          className="flex-1 bg-[#e11d48] text-white py-4 rounded-2xl font-bold text-base hover:bg-[#be123c] transition-colors shadow-md shadow-rose-100"
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

export default BudgetTab;