// src/pages/footer/FooterListPage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiTwotoneEdit } from "react-icons/ai";
import { RiDeleteBin5Line } from "react-icons/ri";
import { LuPlus } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import PageHeader from "../../components/PageHeader";
import Pagination from "../../UI/pagination";
import { fetchFooter, updateFooter } from "../../store/slices/footerSlice";

const TABS = [
  "articles",
  "places",
  "companies",
  "exploreLinks",
  "socialLinks",
  "contactInfo",
  "footerLinks",
];

const FooterListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { footer, loading, error } = useSelector((s) => s.footer || {});

  const [activeTab, setActiveTab] = useState("articles");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    dispatch(fetchFooter());
  }, [dispatch]);

  const items = footer?.[activeTab] || [];
  const totalPages = Math.max(1, Math.ceil(items.length / limit));
  const paginated = items.slice((page - 1) * limit, (page - 1) * limit + limit);

  const handleDelete = async (index) => {
    try {
      const realIndex = (page - 1) * limit + index;
      const pages = [...items];
      pages.splice(realIndex, 1);
      const working = { ...(footer || {}), [activeTab]: pages };
      await dispatch(updateFooter(working)).unwrap();
      toast.success("Deleted");
      dispatch(fetchFooter());
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Footer"
        description="Manage site footer content"
        buttonsList={[
          {
            value: "Add",
            variant: "primary",
            icon: <LuPlus size={18} />,
            onClick: () => navigate(`/footer/create/${activeTab}`),
            className:
              "!bg-primary !text-white !border-primary hover:!bg-secondary hover:!border-secondary",
          },
        ]}
      />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex gap-2 border-b px-6 py-3">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => {
                setActiveTab(t);
                setPage(1);
              }}
              className={`px-3 py-2 rounded-lg text-sm ${
                t === activeTab ? "bg-slate-100 text-slate-900 font-semibold" : "text-slate-500"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">{activeTab}</p>
            <p className="text-xs text-slate-500">{loading ? "Loading..." : `${items.length} items`}</p>
          </div>
          {/* Link to special article selector if on articles tab */}
          {activeTab === "articles" && (
            <div>
              <button
                onClick={() => navigate("/footer/create/articles/select")}
                className="rounded-full border px-3 py-2 text-sm"
              >
                Add From Articles
              </button>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50 text-left text-[11px] font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3">#</th>
                {/* adapt headers */}
                {["articles", "places", "companies"].includes(activeTab) && (
                  <>
                    <th className="px-6 py-3">Title</th>
                    <th className="px-6 py-3">Href</th>
                    <th className="px-6 py-3">Actions</th>
                  </>
                )}
                {["exploreLinks", "footerLinks"].includes(activeTab) && (
                  <>
                    <th className="px-6 py-3">Text</th>
                    <th className="px-6 py-3">Href</th>
                    <th className="px-6 py-3">Actions</th>
                  </>
                )}
                {activeTab === "socialLinks" && (
                  <>
                    <th className="px-6 py-3">Icon</th>
                    <th className="px-6 py-3">Href</th>
                    <th className="px-6 py-3">New Page</th>
                    <th className="px-6 py-3">Actions</th>
                  </>
                )}
                {activeTab === "contactInfo" && (
                  <>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Value</th>
                    <th className="px-6 py-3">Href</th>
                    <th className="px-6 py-3">New Page</th>
                    <th className="px-6 py-3">Actions</th>
                  </>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-600">
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {[...Array(6)].map((__, idx) => (
                      <td key={idx} className="px-6 py-6">
                        <div className="h-4 bg-slate-100 rounded" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-6 text-center text-slate-500">
                    No items found
                  </td>
                </tr>
              ) : (
                paginated.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="px-6 py-4">{(page - 1) * limit + idx + 1}</td>

                    {["articles", "places", "companies"].includes(activeTab) && (
                      <>
                        <td className="px-6 py-4 font-medium text-slate-900">{item.title}</td>
                        <td className="px-6 py-4 break-words">{item.href}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              className="rounded-full border p-2 text-slate-500 hover:text-slate-900"
                              onClick={() => navigate(`/footer/edit/${activeTab}/${(page - 1) * limit + idx}`)}
                            >
                              <AiTwotoneEdit size={16} />
                            </button>
                            <button
                              className="rounded-full border border-red-200 p-2 text-red-500 hover:bg-red-50"
                              onClick={() => handleDelete(idx)}
                            >
                              <RiDeleteBin5Line size={16} />
                            </button>
                          </div>
                        </td>
                      </>
                    )}

                    {["exploreLinks", "footerLinks"].includes(activeTab) && (
                      <>
                        <td className="px-6 py-4 font-medium text-slate-900">{item.text}</td>
                        <td className="px-6 py-4">{item.href}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              className="rounded-full border p-2 text-slate-500 hover:text-slate-900"
                              onClick={() => navigate(`/footer/edit/${activeTab}/${(page - 1) * limit + idx}`)}
                            >
                              <AiTwotoneEdit size={16} />
                            </button>
                            <button
                              className="rounded-full border border-red-200 p-2 text-red-500 hover:bg-red-50"
                              onClick={() => handleDelete(idx)}
                            >
                              <RiDeleteBin5Line size={16} />
                            </button>
                          </div>
                        </td>
                      </>
                    )}

                    {activeTab === "socialLinks" && (
                      <>
                        <td className="px-6 py-4 font-medium text-slate-900">{item.icon}</td>
                        <td className="px-6 py-4">{item.href}</td>
                        <td className="px-6 py-4">{item.newPage ? "Yes" : "No"}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              className="rounded-full border p-2 text-slate-500 hover:text-slate-900"
                              onClick={() => navigate(`/footer/edit/${activeTab}/${(page - 1) * limit + idx}`)}
                            >
                              <AiTwotoneEdit size={16} />
                            </button>
                            <button
                              className="rounded-full border border-red-200 p-2 text-red-500 hover:bg-red-50"
                              onClick={() => handleDelete(idx)}
                            >
                              <RiDeleteBin5Line size={16} />
                            </button>
                          </div>
                        </td>
                      </>
                    )}

                    {activeTab === "contactInfo" && (
                      <>
                        <td className="px-6 py-4 font-medium text-slate-900">{item.type}</td>
                        <td className="px-6 py-4">{item.value}</td>
                        <td className="px-6 py-4">{item.href}</td>
                        <td className="px-6 py-4">{item.newPage ? "Yes" : "No"}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              className="rounded-full border p-2 text-slate-500 hover:text-slate-900"
                              onClick={() => navigate(`/footer/edit/${activeTab}/${(page - 1) * limit + idx}`)}
                            >
                              <AiTwotoneEdit size={16} />
                            </button>
                            <button
                              className="rounded-full border border-red-200 p-2 text-red-500 hover:bg-red-50"
                              onClick={() => handleDelete(idx)}
                            >
                              <RiDeleteBin5Line size={16} />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
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
    </div>
  );
};

export default FooterListPage;
