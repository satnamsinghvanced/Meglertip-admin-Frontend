import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader";

import { getAgents } from "../../store/slices/realEstateAgents";

const RealEstateAgentsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { agents, loading } = useSelector((state) => state.agents);
  // console.log(agents);
  useEffect(() => {
    dispatch(getAgents());
  }, [dispatch]);
  const id = agents?.[0]?._id;

  const headerButtons = [
    {
      value: "Edit Real Estate Agents Page",
      variant: "primary",
      className:
        "!bg-primary !text-white !border-primary hover:!bg-secondary hover:!border-secondary",
      onClick: () => navigate(`/real-estate-agent/${id}/edit`),
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Real Estate Agents Page" />
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="h-6 w-48 animate-pulse rounded bg-slate-100" />
          <div className="mt-4 h-4 w-32 animate-pulse rounded bg-slate-100" />
          <div className="mt-6 h-48 animate-pulse rounded-xl bg-slate-100" />
        </div>
      </div>
    );
  }

  if (!agents?.length) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Real Estate Agents Page"
          buttonsList={headerButtons}
        />
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
          No Real Estate Agents Page Found.
        </div>
      </div>
    );
  }

  const agent = agents[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title={agent?.title}
        description="Preview the full details of this real estate agent."
        buttonsList={headerButtons}
      />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="space-y-8 p-6">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { label: "Title", value: agent?.title },
              // {
              //   label: "Created At",
              //   value: new Date(agent?.createdAt).toLocaleString(),
              // },
              {
                label: "Updated At",
                value: new Date(agent?.updatedAt).toLocaleString(),
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-slate-50 p-4 border border-slate-100"
              >
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  {item.label}
                </p>
                <p className="mt-1 text-sm text-slate-900 font-medium">
                  {item.value || "N/A"}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-xl p-5 border border-slate-100 bg-white shadow-inner">
            <p className="text-xs font-semibold uppercase text-slate-500 tracking-wide">
              Description
            </p>

            <div
              className="prose mt-3 max-w-none text-slate-700 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: agent?.description || "<p>No description provided.</p>",
              }}
            />
          </div>
          <div className="rounded-xl p-5 border border-slate-100 bg-white shadow-inner">
            <p className="text-xs font-semibold uppercase text-slate-500 tracking-wide">
              Description Bottom
            </p>

            <div
              className="prose mt-3 max-w-none text-slate-700 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html:
                  agent?.descriptionBottom || "<p>No description provided.</p>",
              }}
            />
          </div>
          {/* META SEO */}
          <div className="rounded-xl p-5 border border-slate-100 bg-white shadow-inner space-y-3">
            <h2 className="font-semibold text-lg">SEO Settings</h2>

            <p>
              <strong>Meta Title:</strong> {agent?.metaTitle || "N/A"}
            </p>
            <p>
              <strong>Meta Description:</strong>{" "}
              {agent?.metaDescription || "N/A"}
            </p>
            <p>
              <strong>Meta Keywords:</strong> {agent?.metaKeywords || "N/A"}
            </p>

            {agent?.metaImage && (
              <img
                src={agent.metaImage}
                alt="Meta"
                className="h-32 w-auto rounded-md border"
              />
            )}
          </div>

          {/* OG TAGS */}
          <div className="rounded-xl p-5 border border-slate-100 bg-white shadow-inner space-y-3">
            <h2 className="font-semibold text-lg">Open Graph (OG) Tags</h2>

            <p>
              <strong>OG Title:</strong> {agent?.ogTitle || "N/A"}
            </p>
            <p>
              <strong>OG Description:</strong> {agent?.ogDescription || "N/A"}
            </p>
            <p>
              <strong>OG Type:</strong> {agent?.ogType || "N/A"}
            </p>

            {agent?.ogImage && (
              <img
                src={agent.ogImage}
                alt="OG"
                className="h-32 w-auto rounded-md border"
              />
            )}
          </div>

          {/* ADVANCED SEO */}
          <div className="rounded-xl p-5 border border-slate-100 bg-white shadow-inner space-y-3">
            <h2 className="font-semibold text-lg">Advanced SEO</h2>

            <p>
              <strong>Canonical URL:</strong> {agent?.canonicalUrl || "N/A"}
            </p>

            <p>
              <strong>JSON-LD:</strong>
            </p>
            <pre className="bg-slate-100 p-3 rounded text-xs overflow-auto">
              {agent?.jsonLd || "N/A"}
            </pre>

            <p>
              <strong>Custom Head Code:</strong>
            </p>
            <pre className="bg-slate-100 p-3 rounded text-xs overflow-auto">
              {agent?.customHead || "N/A"}
            </pre>
          </div>

          {/* ROBOTS */}
          <div className="rounded-xl p-5 border border-slate-100 bg-white shadow-inner space-y-3">
            <h2 className="font-semibold text-lg">Robots Settings</h2>

            {Object.entries(agent?.robots || {}).map(([key, val]) => (
              <p key={key}>
                <strong>{key}:</strong> {val ? "Enabled" : "Disabled"}
              </p>
            ))}
          </div>

          {/* REDIRECT */}
          {/* <div className="rounded-xl p-5 border border-slate-100 bg-white shadow-inner space-y-3">
            <h2 className="font-semibold text-lg">Redirect</h2>

            <p>
              <strong>Enabled:</strong>{" "}
              {agent?.redirect?.enabled ? "Yes" : "No"}
            </p>
            <p>
              <strong>From:</strong> {agent?.redirect?.from || "N/A"}
            </p>
            <p>
              <strong>To:</strong> {agent?.redirect?.to || "N/A"}
            </p>
            <p>
              <strong>Type:</strong> {agent?.redirect?.type || "301"}
            </p>
          </div> */}

    
        </div>
      </div>
    </div>
  );
};

export default RealEstateAgentsPage;
