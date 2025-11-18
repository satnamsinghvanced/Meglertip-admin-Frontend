import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import {
  clearSelectedArticle,
  getArticleById,
} from "../../store/slices/articleSlice";

const CompanyDetailPage = () => {
  const { articleId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedCompany, loading } = useSelector((state) => state.companies);

  useEffect(() => {
    if (articleId) {
      dispatch(getArticleById(articleId));
    }
    return () => {
      dispatch(clearSelectedArticle());
    };
  }, [dispatch, articleId]);

  const headerButtons = [
    {
      value: "Back to articles",
      variant: "white",
      className:
        "border border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-white",
      onClick: () => navigate(-1),
    },
    {
      value: "Edit article",
      variant: "primary",
      className:
        "!bg-primary !text-white !border-primary hover:!bg-secondary hover:!border-secondary",
      onClick: () => navigate(`/articles/${articleId}/edit`),
    },
  ];

  if (loading && !selectedArticle) {
    return (
      <div className="space-y-6">
        <PageHeader title="Article details" />
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="h-6 w-48 animate-pulse rounded bg-slate-100" />
          <div className="mt-4 h-4 w-32 animate-pulse rounded bg-slate-100" />
          <div className="mt-6 h-48 animate-pulse rounded-xl bg-slate-100" />
        </div>
      </div>
    );
  }

  if (!selectedArticle) {
    return (
      <div className="space-y-6">
        <PageHeader title="Article details" buttonsList={headerButtons} />
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
          Article not found.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={selectedArticle.title}
        description="Preview the full content and metadata for this article."
        buttonsList={headerButtons}
      />

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {selectedArticle.image && (
          <img
            src={selectedArticle.image}
            alt={selectedArticle.title}
            className="h-72 w-full rounded-t-2xl object-cover"
          />
        )}

        <div className="space-y-6 px-6 py-6">
          <div className="grid gap-4 text-sm text-slate-600 md:grid-cols-2">
            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Category
              </p>
              <p className="mt-1 text-base font-semibold text-slate-900">
                {selectedArticle.categoryId?.title || "N/A"}
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Author
              </p>
              <p className="mt-1 text-base font-semibold text-slate-900">
                {selectedArticle.createdBy?.username || "N/A"}
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Show date
              </p>
              <p className="mt-1 text-base font-semibold text-slate-900">
                {selectedArticle.showDate
                  ? new Date(selectedArticle.showDate).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Language
              </p>
              <p className="mt-1 text-base font-semibold text-slate-900">
                {selectedArticle.language || "N/A"}
              </p>
            </div>
          </div>

          {selectedArticle.excerpt && (
            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Excerpt
              </p>
              <p className="mt-1 text-sm text-slate-700">
                {selectedArticle.excerpt}
              </p>
            </div>
          )}

          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-inner">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Description
            </p>
            <div
              className="prose mt-3 max-w-none text-slate-700"
              dangerouslySetInnerHTML={{
                __html:
                  selectedArticle.description || "<p>No description provided.</p>",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailPage;

