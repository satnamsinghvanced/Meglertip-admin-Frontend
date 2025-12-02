// src/pages/footer/EditFooterItemPage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import PageHeader from "../../components/PageHeader";
import { fetchFooter, updateFooter } from "../../store/slices/footerSlice";

const EditFooterItemPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tab, index } = useParams();
  const { footer } = useSelector((s) => s.footer || {});

  const [form, setForm] = useState(null);

  useEffect(() => {
    if (!footer) dispatch(fetchFooter());
  }, [dispatch, footer]);

  useEffect(() => {
    if (tab === "address") {
      setForm(footer.address || {});
    } else {
      const arr = footer[tab] || [];
      const idx = parseInt(index, 10);
      const item = arr[idx];

      if (!item) {
        toast.error("Item not found");
        navigate("/footer");
        return;
      }
      setForm(item);
    }
  }, [footer, tab, index, navigate]);

  const handleSave = async () => {
    try {
      const arr = [...(footer[tab] || [])];
      arr[parseInt(index, 10)] = form;
      const working = { ...(footer || {}), [tab]: arr };
      await dispatch(updateFooter(working)).unwrap();
      toast.success("Updated");
      navigate("/footer");
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  if (!form) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <PageHeader title={`Edit ${tab}`} description={`Edit ${tab} item`} />
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="space-y-4">
          {["articles", "places", "companies"].includes(tab) && (
            <>
              <label className="block text-sm">Title</label>
              <input
                className="w-full rounded-lg border px-3 py-2"
                value={form.title || ""}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />

              <label className="block text-sm">Href</label>
              <input
                className="w-full rounded-lg border px-3 py-2"
                value={form.href || ""}
                onChange={(e) => setForm({ ...form, href: e.target.value })}
              />
            </>
          )}

          {["exploreLinks", "footerLinks"].includes(tab) && (
            <>
              <label className="block text-sm">Text</label>
              <input
                className="w-full rounded-lg border px-3 py-2"
                value={form.text || ""}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
              />

              <label className="block text-sm">Href</label>
              <input
                className="w-full rounded-lg border px-3 py-2"
                value={form.href || ""}
                onChange={(e) => setForm({ ...form, href: e.target.value })}
              />
            </>
          )}
          {["footerText"].includes(tab) && (
            <>
              <label className="block text-sm">Text</label>
              <input
                className="w-full rounded-lg border px-3 py-2"
                value={form.text || ""}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
              />
            </>
          )}
          {["address"].includes(tab) && (
            <>
              <label className="block text-sm">Address</label>
              <input
                className="w-full rounded-lg border px-3 py-2"
                value={form.text || ""}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
              />
            </>
          )}

          {tab === "socialLinks" && (
            <>
              <label className="block text-sm">Icon</label>
              <select
                className="w-full rounded-lg border px-3 py-2"
                value={form.icon || ""}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
              >
                <option value="">Select Icon</option>
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="linkedin">LinkedIn</option>
                <option value="youtube">YouTube</option>
                <option value="twitter">Twitter</option>
              </select>

              <label className="block text-sm">Href</label>
              <input
                className="w-full rounded-lg border px-3 py-2"
                value={form.href || ""}
                onChange={(e) => setForm({ ...form, href: e.target.value })}
              />

              <div className="flex items-center gap-2">
                <input
                  id="newpage"
                  type="checkbox"
                  className="!relative"
                  checked={form.newPage || false}
                  onChange={(e) =>
                    setForm({ ...form, newPage: e.target.checked })
                  }
                />
                <label htmlFor="newpage" className="text-sm">
                  Open in new page
                </label>
              </div>
            </>
          )}

          {tab === "contactInfo" && (
            <>
              <label className="block text-sm">Type</label>
              <select
                className="w-full rounded-lg border px-3 py-2"
                value={form.type || ""}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="">Select Type</option>
                <option value="phone">Phone</option>
                <option value="email">Email</option>
                <option value="location">Location</option>
              </select>

              <label className="block text-sm">Value</label>
              <input
                className="w-full rounded-lg border px-3 py-2"
                value={form.value || ""}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
              />

              <label className="block text-sm">Href</label>
              <input
                className="w-full rounded-lg border px-3 py-2"
                value={form.href || ""}
                onChange={(e) => setForm({ ...form, href: e.target.value })}
              />

              <div className="flex items-center gap-2">
                <input
                  id="contact-newpage"
                  type="checkbox"
                  className="!relative"
                  checked={form.newPage || false}
                  onChange={(e) =>
                    setForm({ ...form, newPage: e.target.checked })
                  }
                />
                <label htmlFor="contact-newpage" className="text-sm">
                  Open in new page
                </label>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            className="rounded-full border px-4 py-2"
            onClick={() => navigate("/footer")}
          >
            Cancel
          </button>
          <button
            className="rounded-full bg-primary px-4 py-2 text-white"
            onClick={handleSaveHandler}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );

  async function handleSaveHandler() {
    try {
      let working = { ...(footer || {}) };

      if (tab === "address") {
        working.address = form;
      } else {
        const arr = [...(footer[tab] || [])];
        arr[parseInt(index, 10)] = form;
        working[tab] = arr;
      }
      await dispatch(updateFooter({ body: working })).unwrap();
      toast.success("Updated");
      navigate("/footer");
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  }
};

export default EditFooterItemPage;
