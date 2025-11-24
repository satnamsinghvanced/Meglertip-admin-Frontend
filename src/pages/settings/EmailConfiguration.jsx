import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageHeader from "../../components/PageHeader";
import { useNavigate } from "react-router-dom";
import {
  getSmtpConfig,
  saveSmtpConfig,
  updateSmtpConfig,
  clearSmtpState,
} from "../../store/slices/smtpSlice"
import { toast } from "react-toastify";

const requiredFields = ["host", "port", "user", "pass", "fromEmail"];

const SMTPSettings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { config: smtp, loading } = useSelector((state) => state.smtp);

  const [form, setForm] = useState({
    host: "",
    port: "",
    secure: false,
    user: "",
    pass: "",
    fromEmail: "",
    active: true,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(getSmtpConfig());
    return () => dispatch(clearSmtpState());
  }, [dispatch]);

  useEffect(() => {
    if (!smtp) return;

    setForm({
      host: smtp.host ?? "",
      port: smtp.port ?? "",
      secure: smtp.secure ?? false,
      user: smtp.user ?? "",
      pass: smtp.pass ?? "",
      fromEmail: smtp.fromEmail ?? "",
      active: smtp.active ?? true,
    });
  }, [smtp]);

  const validateField = (name, value) => {
    let msg = "";
    if (requiredFields.includes(name) && !value) {
      msg = `${name} is required`;
    }
    setErrors((prev) => ({ ...prev, [name]: msg }));
    return msg === "";
  };

  const validateAll = () => {
    const newErrors = {};
    requiredFields.forEach((f) => {
      if (!form[f]) newErrors[f] = `${f} is required`;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAll()) {
      toast.error("Please fix all errors before saving");
      return;
    }

    setSubmitting(true);

    try {
      if (smtp) {
        await dispatch(updateSmtpConfig(form)).unwrap();
        toast.success("SMTP Updated Successfully");
      } else {
        await dispatch(saveSmtpConfig(form)).unwrap();
        toast.success("SMTP Saved Successfully");
      }
    } catch (err) {
      toast.error(err?.message || "Failed to save SMTP");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="SMTP Settings"
        description="Manage SMTP email configuration for your system."
      />

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6"
      >
        {/* HOST + PORT */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* HOST */}
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">
              Host <span className="text-red-500">*</span>
            </label>
            <input
              name="host"
              value={form.host}
              onChange={handleChange}
              className={`mt-1 w-full rounded-xl border px-3 py-2 ${
                errors.host ? "border-red-500" : "border-slate-300"
              }`}
            />
            {errors.host && (
              <p className="text-xs text-red-600 mt-1">{errors.host}</p>
            )}
          </div>

          {/* PORT */}
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">
              Port <span className="text-red-500">*</span>
            </label>
            <input
              name="port"
              type="number"
              value={form.port}
              onChange={handleChange}
              className={`mt-1 w-full rounded-xl border px-3 py-2 ${
                errors.port ? "border-red-500" : "border-slate-300"
              }`}
            />
            {errors.port && (
              <p className="text-xs text-red-600 mt-1">{errors.port}</p>
            )}
          </div>
        </div>

        {/* USER + PASSWORD */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">
              User <span className="text-red-500">*</span>
            </label>
            <input
              name="user"
              value={form.user}
              onChange={handleChange}
              className={`mt-1 w-full rounded-xl border px-3 py-2 ${
                errors.user ? "border-red-500" : "border-slate-300"
              }`}
            />
            {errors.user && (
              <p className="text-xs text-red-600 mt-1">{errors.user}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              name="pass"
              type="password"
              value={form.pass}
              onChange={handleChange}
              className={`mt-1 w-full rounded-xl border px-3 py-2 ${
                errors.pass ? "border-red-500" : "border-slate-300"
              }`}
            />
            {errors.pass && (
              <p className="text-xs text-red-600 mt-1">{errors.pass}</p>
            )}
          </div>
        </div>

        {/* FROM EMAIL */}
        <div>
          <label className="text-xs font-semibold uppercase text-slate-500">
            From Email <span className="text-red-500">*</span>
          </label>
          <input
            name="fromEmail"
            value={form.fromEmail}
            onChange={handleChange}
            className={`mt-1 w-full rounded-xl border px-3 py-2 ${
              errors.fromEmail ? "border-red-500" : "border-slate-300"
            }`}
          />
          {errors.fromEmail && (
            <p className="text-xs text-red-600 mt-1">{errors.fromEmail}</p>
          )}
        </div>

        {/* CHECKBOXES */}
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
            className="!relative"
              type="checkbox"
              name="secure"
              checked={form.secure}
              onChange={handleChange}
            />
            Secure (SSL/TLS)
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              className="!relative"
              type="checkbox"
              name="active"
              checked={form.active}
              onChange={handleChange}
            />
            Active
          </label>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={submitting || loading}
          className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow hover:bg-secondary disabled:opacity-50"
        >
          {submitting ? "Saving…" : "Save SMTP Settings"}
        </button>
      </form>
    </div>
  );
};

export default SMTPSettings;
