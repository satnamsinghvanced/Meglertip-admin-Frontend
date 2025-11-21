import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader";

import {
    getAgentById,
} from "../../store/slices/realEstateAgents";

const RealEstateAgentsFormPage = () => {
  const { id } = useParams();
    const isEditMode = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedAgent, loading } = useSelector((state) => state.agents);
console.log(selectedAgent)
  useEffect(() => {
    if (isEditMode && id) {
      dispatch(getAgentById(id));
    }
  }, [dispatch, isEditMode, id]);

  const headerButtons = [
    {
      value: "Back to Real Estate Agents Page",
      variant: "primary",
      className:
        "!bg-primary !text-white !border-primary hover:!bg-secondary hover:!border-secondary",
      onClick: () => navigate(`/real-estate-agents`),
    },
  ];

  if (loading && !selectedAgent) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit Real Estate Agents Page" />
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="h-6 w-48 animate-pulse rounded bg-slate-100" />
          <div className="mt-4 h-4 w-32 animate-pulse rounded bg-slate-100" />
          <div className="mt-6 h-48 animate-pulse rounded-xl bg-slate-100" />
        </div>
      </div>
    );
  }

  if (!selectedAgent) {
    return (
      <div className="space-y-6">
        <PageHeader title="Real Estate Agents Page" buttonsList={headerButtons} />
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
          No Real Estate Agents Page Found.
        </div>
      </div>
    );
  }

  const agent = selectedAgent;

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
              {
                label: "Created At",
                value: new Date(agent?.createdAt).toLocaleString(),
              },
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

        </div>
      </div>
    </div>
  );
};

export default RealEstateAgentsFormPage;
