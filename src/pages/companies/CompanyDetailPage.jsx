import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import {
  clearSelectedCompany,
  getCompanyById,
} from "../../store/slices/companySlice";

const CompanyDetailPage = () => {
  const { companyId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedCompany, loading } = useSelector((state) => state.companies);

  console.log(selectedCompany, "selected Company data");

  useEffect(() => {
    if (companyId) {
      dispatch(getCompanyById(companyId));
    }
    return () => {
      dispatch(clearSelectedCompany());
    };
  }, [dispatch, companyId]);

  const headerButtons = [
    {
      value: "Back to Companies",
      variant: "white",
      className:
        "border border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-white",
      onClick: () => navigate(-1),
    },
    {
      value: "Edit Company",
      variant: "primary",
      className:
        "!bg-primary !text-white !border-primary hover:!bg-secondary hover:!border-secondary",
      onClick: () => navigate(`/company/${companyId}/edit`),
    },
  ];

  if (loading && !selectedCompany) {
    return (
      <div className="space-y-6">
        <PageHeader title="Company details" />
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="h-6 w-48 animate-pulse rounded bg-slate-100" />
          <div className="mt-4 h-4 w-32 animate-pulse rounded bg-slate-100" />
          <div className="mt-6 h-48 animate-pulse rounded-xl bg-slate-100" />
        </div>
      </div>
    );
  }

  if (!selectedCompany) {
    return (
      <div className="space-y-6">
        <PageHeader title="Company details" buttonsList={headerButtons} />
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
          Company not found.
        </div>
      </div>
    );
  }

return (
  <div className="space-y-6">
    <PageHeader
      title={selectedCompany.companyName}
      description="Preview the full content for this company."
      buttonsList={headerButtons}
    />

    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {selectedCompany.companyImage ? (
        <img
          src={selectedCompany.companyImage}
          alt={selectedCompany.companyName}
          className="h-64 w-full object-cover"
        />
      ) : (
        <div className="h-64 w-full flex items-center justify-center bg-slate-100 text-slate-400 text-sm">
          No image uploaded
        </div>
      )}

      <div className="space-y-6 p-6">

        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Address (Competitor)", value: selectedCompany.address },
            // { label: "Email", value: selectedCompany.email },
            // { label: "Zip Code", value: selectedCompany.zipCode },
            { label: "Broker Sites", value: selectedCompany.brokerSites },
            { label: "Website Address", value: selectedCompany.websiteAddress },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-xl bg-slate-50 p-4 border border-slate-100"
            >
              <p className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
                {item.label}
              </p>
              <p className="mt-1 text-sm text-slate-900 font-medium">
                {item.value || "N/A"}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
          <p className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
            Extractor
          </p>

          <div className="mt-2 space-y-1">
            {Array.isArray(selectedCompany.extractor) &&
            selectedCompany.extractor.length > 0 ? (
              selectedCompany.extractor.map((item, idx) => (
                <div key={idx} className="flex gap-2 text-sm text-slate-900">
                  <span className="text-slate-400">•</span>
                  <span>{item}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-900 font-medium">N/A</p>
            )}
          </div>
        </div>

        {selectedCompany.excerpt && (
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
            <p className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
              Excerpt
            </p>
            <p className="mt-2 text-sm text-slate-700 leading-relaxed">
              {selectedCompany.excerpt}
            </p>
          </div>
        )}

        <div className="rounded-xl p-5 border border-slate-100 bg-white shadow-inner">
          <p className="text-xs font-semibold uppercase text-slate-500 tracking-wide">
            Description
          </p>

          <div
            className="prose mt-3 max-w-none text-slate-700"
            dangerouslySetInnerHTML={{
              __html:
                selectedCompany.description ||
                "<p>No description provided.</p>",
            }}
          />
        </div>
      </div>
    </div>
  </div>
);

};

export default CompanyDetailPage;
