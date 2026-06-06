import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useCreateSubscriptionMutation,
  useGetSubscriptionMetaQuery,
} from "../features/api/apiSlice";

const TABS = [
  { key: "trainee", label: "Trainee" },
  { key: "trainer", label: "Trainer" },
  { key: "company", label: "Company" },
];

const initialState = {
  email: "",
  full_name: "",
  country_id: "",
  accept_conditions: false,
  stack_id: "",
  round_id: "",
  position_id: "",
  interview_times: [],
  cv: null,
  brand_name: "",
  company_field_id: "",
  package_range_id: "",
  cr_number: "",
  extra_information: "",
  cr: null,
};

const SubscribePage = () => {
  const navigate = useNavigate();
  const [activeType, setActiveType] = useState("trainee");
  const [form, setForm] = useState(initialState);
  const [feedback, setFeedback] = useState("");

  const { data: meta, isLoading: isMetaLoading } =
    useGetSubscriptionMetaQuery();
  const [createSubscription, { isLoading: isSubmitting }] =
    useCreateSubscriptionMutation();

  useEffect(() => {
    if (!meta) return;

    setForm((prev) => ({
      ...prev,
      country_id: prev.country_id || String(meta.countries?.[0]?.id || ""),
      stack_id: prev.stack_id || String(meta.stacks?.[0]?.id || ""),
      round_id: prev.round_id || String(meta.rounds?.[0]?.id || ""),
      position_id: prev.position_id || String(meta.positions?.[0]?.id || ""),
      company_field_id:
        prev.company_field_id || String(meta.company_fields?.[0]?.id || ""),
      package_range_id:
        prev.package_range_id || String(meta.package_ranges?.[0]?.id || ""),
    }));
  }, [meta]);

  const canSubmit = useMemo(() => {
    if (
      !form.email ||
      !form.full_name ||
      !form.country_id ||
      !form.accept_conditions
    )
      return false;

    if (activeType === "trainee") {
      return (
        !!form.stack_id && !!form.round_id && form.interview_times.length > 0
      );
    }

    if (activeType === "trainer") {
      return !!form.position_id && form.interview_times.length > 0 && !!form.cv;
    }

    return (
      !!form.brand_name &&
      !!form.company_field_id &&
      !!form.package_range_id &&
      !!form.cr_number
    );
  }, [activeType, form]);

  const onTextChange = (key) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onFileChange = (key) => (e) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, [key]: file }));
  };

  const onToggleTime = (slot) => {
    setForm((prev) => {
      const exists = prev.interview_times.includes(slot);
      return {
        ...prev,
        interview_times: exists
          ? prev.interview_times.filter((s) => s !== slot)
          : [...prev.interview_times, slot],
      };
    });
  };

  const extractError = (err) => {
    if (err?.data?.message) return err.data.message;

    const errors = err?.data?.errors;
    if (errors && typeof errors === "object") {
      const firstKey = Object.keys(errors)[0];
      if (firstKey && Array.isArray(errors[firstKey])) {
        return errors[firstKey][0];
      }
    }

    return "Submission failed. Please check form fields and try again.";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setFeedback("");

    const fd = new FormData();
    fd.append("type", activeType);
    fd.append("email", form.email);
    fd.append("full_name", form.full_name);
    fd.append("country_id", form.country_id);
    fd.append("accept_conditions", form.accept_conditions ? "1" : "0");

    if (activeType === "trainee") {
      fd.append("stack_id", form.stack_id);
      fd.append("round_id", form.round_id);
      form.interview_times.forEach((slot) =>
        fd.append("interview_times[]", slot),
      );
      if (form.cv) fd.append("cv", form.cv);
    }

    if (activeType === "trainer") {
      fd.append("position_id", form.position_id);
      form.interview_times.forEach((slot) =>
        fd.append("interview_times[]", slot),
      );
      if (form.cv) fd.append("cv", form.cv);
    }

    if (activeType === "company") {
      fd.append("brand_name", form.brand_name);
      fd.append("company_field_id", form.company_field_id);
      fd.append("package_range_id", form.package_range_id);
      fd.append("cr_number", form.cr_number);
      fd.append("extra_information", form.extra_information || "");
      if (form.cr) fd.append("cr", form.cr);
    }

    try {
      const res = await createSubscription(fd).unwrap();
      setFeedback(res?.message || "Submitted successfully. Redirecting...");
      navigate(`/subscription/${res.subscription_id}`);
    } catch (err) {
      setFeedback(extractError(err));
    }
  };

  const renderInterviewTimes = () => (
    <div className="space-y-2">
      <p className="text-sm font-medium text-slate-700">Interview Times</p>
      <div className="grid grid-cols-2 gap-2">
        {(meta?.interview_times || []).map((slot) => (
          <label
            key={slot}
            className="flex items-center gap-2 rounded border border-slate-200 p-2 text-sm"
          >
            <input
              type="checkbox"
              checked={form.interview_times.includes(slot)}
              onChange={() => onToggleTime(slot)}
            />
            <span>{slot}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-4xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">
            Subscription Form
          </h1>
          <Link className="text-sm text-blue-600 hover:underline" to="/">
            Back to Home
          </Link>
        </div>

        <div className="mb-6 flex gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                setActiveType(tab.key);
                setFeedback("");
              }}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                activeType === tab.key
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {isMetaLoading ? (
          <p className="text-slate-600">Loading options...</p>
        ) : (
          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-1 text-sm">
                <span>Email</span>
                <input
                  className="w-full rounded border border-slate-300 px-3 py-2"
                  type="email"
                  value={form.email}
                  onChange={onTextChange("email")}
                />
              </label>
              <label className="space-y-1 text-sm">
                <span>Full Name</span>
                <input
                  className="w-full rounded border border-slate-300 px-3 py-2"
                  type="text"
                  value={form.full_name}
                  onChange={onTextChange("full_name")}
                />
              </label>
              <label className="space-y-1 text-sm">
                <span>Country</span>
                <select
                  className="w-full rounded border border-slate-300 px-3 py-2"
                  value={form.country_id}
                  onChange={onTextChange("country_id")}
                >
                  {(meta?.countries || []).map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="mt-6 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.accept_conditions}
                  onChange={onTextChange("accept_conditions")}
                />
                <span>Accept Conditions</span>
              </label>
            </div>

            {activeType === "trainee" && (
              <div className="space-y-4 rounded-lg border border-slate-200 p-4">
                <h2 className="font-semibold text-slate-900">Trainee Fields</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-1 text-sm">
                    <span>Stack</span>
                    <select
                      className="w-full rounded border border-slate-300 px-3 py-2"
                      value={form.stack_id}
                      onChange={onTextChange("stack_id")}
                    >
                      {(meta?.stacks || []).map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <input type="hidden" value={form.round_id} readOnly />
                  <label className="space-y-1 text-sm md:col-span-2">
                    <span>CV (optional, pdf/md)</span>
                    <input
                      className="w-full rounded border border-slate-300 px-3 py-2"
                      type="file"
                      accept=".pdf,.md"
                      onChange={onFileChange("cv")}
                    />
                  </label>
                </div>
                {renderInterviewTimes()}
              </div>
            )}

            {activeType === "trainer" && (
              <div className="space-y-4 rounded-lg border border-slate-200 p-4">
                <h2 className="font-semibold text-slate-900">Trainer Fields</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-1 text-sm">
                    <span>Position</span>
                    <select
                      className="w-full rounded border border-slate-300 px-3 py-2"
                      value={form.position_id}
                      onChange={onTextChange("position_id")}
                    >
                      {(meta?.positions || []).map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1 text-sm">
                    <span>CV (required, pdf/md)</span>
                    <input
                      className="w-full rounded border border-slate-300 px-3 py-2"
                      type="file"
                      accept=".pdf,.md"
                      onChange={onFileChange("cv")}
                    />
                  </label>
                </div>
                {renderInterviewTimes()}
              </div>
            )}

            {activeType === "company" && (
              <div className="space-y-4 rounded-lg border border-slate-200 p-4">
                <h2 className="font-semibold text-slate-900">Company Fields</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-1 text-sm">
                    <span>Brand (Trademark)</span>
                    <input
                      className="w-full rounded border border-slate-300 px-3 py-2"
                      type="text"
                      value={form.brand_name}
                      onChange={onTextChange("brand_name")}
                    />
                  </label>
                  <label className="space-y-1 text-sm">
                    <span>Field</span>
                    <select
                      className="w-full rounded border border-slate-300 px-3 py-2"
                      value={form.company_field_id}
                      onChange={onTextChange("company_field_id")}
                    >
                      {(meta?.company_fields || []).map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1 text-sm">
                    <span>Package (Num of trainees)</span>
                    <select
                      className="w-full rounded border border-slate-300 px-3 py-2"
                      value={form.package_range_id}
                      onChange={onTextChange("package_range_id")}
                    >
                      {(meta?.package_ranges || []).map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1 text-sm">
                    <span>CR Number</span>
                    <input
                      className="w-full rounded border border-slate-300 px-3 py-2"
                      type="text"
                      value={form.cr_number}
                      onChange={onTextChange("cr_number")}
                    />
                  </label>
                  <label className="space-y-1 text-sm md:col-span-2">
                    <span>CR File (optional, pdf/md)</span>
                    <input
                      className="w-full rounded border border-slate-300 px-3 py-2"
                      type="file"
                      accept=".pdf,.md"
                      onChange={onFileChange("cr")}
                    />
                  </label>
                  <label className="space-y-1 text-sm md:col-span-2">
                    <span>Extra Information</span>
                    <textarea
                      className="w-full rounded border border-slate-300 px-3 py-2"
                      rows={4}
                      value={form.extra_information}
                      onChange={onTextChange("extra_information")}
                    />
                  </label>
                </div>
              </div>
            )}

            {feedback && (
              <p className="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                {feedback}
              </p>
            )}

            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {isSubmitting ? "Submitting..." : "Submit Subscription"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SubscribePage;
