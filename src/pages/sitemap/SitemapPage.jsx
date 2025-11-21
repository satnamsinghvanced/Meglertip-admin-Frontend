
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageHeader from "../../components/PageHeader";
import Pagination from "../../UI/pagination";
import { fetchSitemap, updateSitemap, createSitemap } from "../../store/slices/sitemapSlice";
import { AiTwotoneEdit } from "react-icons/ai";
import { RiDeleteBin5Line } from "react-icons/ri";
import { LuPlus } from "react-icons/lu";
import { toast } from "react-toastify";

const SitemapPage = () => {
  const dispatch = useDispatch();
  const { data: sitemap, loading, error } = useSelector((s) => s.sitemap || {});

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [form, setForm] = useState({ href: "", title: "", description: "" });

  useEffect(() => {
    dispatch(fetchSitemap());
  }, [dispatch]);

  const items = sitemap?.pages || [];
  const totalPages = Math.max(1, Math.ceil(items.length / limit));
  const paginated = items.slice((page - 1) * limit, (page - 1) * limit + limit);

  const openAdd = () => {
    setIsEditing(false);
    setEditingIndex(null);
    setForm({ href: "", title: "", description: "" });
    setShowModal(true);
  };

  const openEdit = (index) => {
    const realIndex = (page - 1) * limit + index;
    const it = items[realIndex];
    if (!it) return;
    setIsEditing(true);
    setEditingIndex(realIndex);
    setForm({ href: it.href, title: it.title, description: it.description });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.href) return toast.error("Title and href are required");

    try {
      const working = { ...(sitemap || { title: "Sitemap", description: "", pages: [] }) };
      const pages = Array.isArray(working.pages) ? [...working.pages] : [];

      if (isEditing && editingIndex !== null) {
        pages[editingIndex] = { ...form };
      } else {
        pages.push({ ...form });
      }
      working.pages = pages;

      if (sitemap && sitemap._id) {
        await dispatch(updateSitemap(working)).unwrap();
      } else {
        await dispatch(createSitemap(working)).unwrap();
      }

      toast.success(isEditing ? "Updated page" : "Added page");
      setShowModal(false);
      dispatch(fetchSitemap());
    } catch (err) {
      console.error(err);
      toast.error("Save failed");
    }
  };

  const handleDelete = async (index) => {
    const realIndex = (page - 1) * limit + index;
    const pages = [...(sitemap.pages || [])];
    pages.splice(realIndex, 1);
    const working = { ...(sitemap || {}), pages };

    try {
      await dispatch(updateSitemap(working)).unwrap();
      toast.success("Deleted");
      dispatch(fetchSitemap());
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sitemap"
        description="Manage sitemap pages"
        buttonsList={[
          { value: "Add Page", variant: "primary", icon: <LuPlus />, onClick: openAdd },
        ]}
      />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">Pages</p>
            <p className="text-xs text-slate-500">{loading ? "Loading..." : `${items.length} items`}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50 text-left text-[11px] font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Href</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {[...Array(5)].map((__, idx) => (
                      <td key={idx} className="px-6 py-6"><div className="h-4 bg-slate-100 rounded"/></td>
                    ))}
                  </tr>
                ))
              ) : items.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-6 text-center text-slate-500">No pages found</td></tr>
              ) : (
                paginated.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="px-6 py-4">{(page - 1) * limit + idx + 1}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{p.title}</td>
                    <td className="px-6 py-4 break-words">{p.href}</td>
                    <td className="px-6 py-4 break-words line-clamp-2">{p.description}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-center gap-2">
                        <button className="rounded-full border p-2 text-slate-500 hover:text-slate-900" onClick={() => openEdit(idx)}><AiTwotoneEdit size={16} /></button>
                        <button className="rounded-full border border-red-200 p-2 text-red-500 hover:bg-red-50" onClick={() => handleDelete(idx)}><RiDeleteBin5Line size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {items.length > 0 && (
          <div className="px-6 py-4">
            <Pagination totalPages={totalPages} page={page} setPage={setPage} />
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">{isEditing ? "Edit Page" : "Add Page"}</h3>
            <div className="space-y-3">
              <label className="block text-sm">Title</label>
              <input className="w-full rounded-lg border px-3 py-2" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />

              <label className="block text-sm">Href</label>
              <input className="w-full rounded-lg border px-3 py-2" value={form.href} onChange={(e) => setForm({ ...form, href: e.target.value })} />

              <label className="block text-sm">Description</label>
              <textarea className="w-full rounded-lg border px-3 py-2" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button className="rounded-full border px-4 py-2" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="rounded-full bg-primary px-4 py-2 text-white" onClick={handleSave}>{isEditing ? "Update" : "Save"}</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SitemapPage;
