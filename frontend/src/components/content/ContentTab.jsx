import React, { useState } from "react";
import api from "../../api/axios";

const ContentTab = ({ contents, refreshContents }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentContent, setCurrentContent] = useState(null);

  const [formData, setFormData] = useState({
    campaign_id: "",
    titulli: "",
    lloji: "",
    permbajtja: "",
    media_url: "",
    statusi: "draft",
  });

  const openModal = (content = null) => {
    if (content) {
      setCurrentContent(content);
      setFormData({
        campaign_id: content.campaign_id || "",
        titulli: content.titulli || "",
        lloji: content.lloji || "",
        permbajtja: content.permbajtja || "",
        media_url: content.media_url || "",
        statusi: content.statusi || "draft",
      });
    } else {
      setCurrentContent(null);
      setFormData({
        campaign_id: "",
        titulli: "",
        lloji: "",
        permbajtja: "",
        media_url: "",
        statusi: "draft",
      });
    }

    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        campaign_id: Number(formData.campaign_id),
      };

      if (currentContent) {
        await api.put(`/manager/contents/${currentContent.id}`, payload);
      } else {
        await api.post("/manager/contents", payload);
      }

      await refreshContents();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Operation failed", err);
      alert(err.response?.data?.message || err.response?.data?.error || "Operation failed");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/manager/contents/${currentContent.id}`);
      await refreshContents();
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error("Delete failed", err);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="font-bold text-2xl text-slate-800">Content Management</h3>
          <p className="text-slate-400 text-sm">Manage campaign content and media</p>
        </div>

        <button
          onClick={() => openModal()}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all"
        >
          Add New Content
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs text-slate-400 uppercase tracking-wider border-b border-slate-50">
              <th className="pb-4 font-semibold">Title</th>
              <th className="pb-4 font-semibold">Type</th>
              <th className="pb-4 font-semibold">Campaign ID</th>
              <th className="pb-4 font-semibold">Status</th>
              <th className="pb-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {contents.map((content) => (
              <tr key={content.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-4 font-medium text-slate-700">{content.titulli}</td>
                <td className="py-4 text-slate-500 text-sm">{content.lloji || "N/A"}</td>
                <td className="py-4 text-slate-500 text-sm">{content.campaign_id}</td>
                <td className="py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      content.statusi === "published"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {content.statusi === "published" ? "Published" : "Draft"}
                  </span>
                </td>

                <td className="py-4 text-right">
                  <button
                    onClick={() => openModal(content)}
                    className="p-2 text-slate-400 hover:text-indigo-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => {
                      setCurrentContent(content);
                      setIsDeleteModalOpen(true);
                    }}
                    className="p-2 text-slate-400 hover:text-rose-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {contents.length === 0 && (
              <tr>
                <td colSpan="5" className="py-10 text-center text-slate-400 text-sm">
                  No content found
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
              {currentContent ? "Edit Content" : "Create New Content"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="number"
                placeholder="Campaign ID"
                className="w-full bg-slate-50 rounded-2xl p-4"
                value={formData.campaign_id}
                onChange={(e) => setFormData({ ...formData, campaign_id: e.target.value })}
                required
              />

              <input
                type="text"
                placeholder="Title"
                className="w-full bg-slate-50 rounded-2xl p-4"
                value={formData.titulli}
                onChange={(e) => setFormData({ ...formData, titulli: e.target.value })}
                required
              />

              <select
                className="w-full bg-slate-50 rounded-2xl p-4"
                value={formData.lloji}
                onChange={(e) => setFormData({ ...formData, lloji: e.target.value })}
              >
                <option value="">Select type</option>
                <option value="post">Post</option>
                <option value="video">Video</option>
                <option value="image">Image</option>
                <option value="ad">Ad</option>
              </select>

              <textarea
                placeholder="Content"
                className="w-full bg-slate-50 rounded-2xl p-4 min-h-[90px]"
                value={formData.permbajtja}
                onChange={(e) => setFormData({ ...formData, permbajtja: e.target.value })}
              />

              <input
                type="text"
                placeholder="Media URL"
                className="w-full bg-slate-50 rounded-2xl p-4"
                value={formData.media_url}
                onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
              />

              <select
                className="w-full bg-slate-50 rounded-2xl p-4"
                value={formData.statusi}
                onChange={(e) => setFormData({ ...formData, statusi: e.target.value })}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold"
              >
                {currentContent ? "Update Content" : "Create Content"}
              </button>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-full bg-slate-100 text-slate-600 py-3 rounded-2xl font-bold"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm text-center shadow-2xl border border-slate-100">
            <div className="text-4xl mb-4">⚠️</div>

            <h3 className="text-xl font-bold text-slate-800 mb-2">Are you sure?</h3>

            <p className="text-slate-500 text-sm mb-8">
              Content <b>{currentContent?.titulli}</b> will be deleted permanently.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold"
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

export default ContentTab;