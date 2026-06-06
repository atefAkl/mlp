import React from "react";
import { Link, useParams } from "react-router-dom";
import { useGetPublicSubscriptionQuery } from "../features/api/apiSlice";

const SubscriptionSummaryPage = () => {
  const { publicId } = useParams();
  const { data, isLoading, error } = useGetPublicSubscriptionQuery(publicId, {
    skip: !publicId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-6">
          Loading subscription details...
        </div>
      </div>
    );
  }

  if (error || !data?.subscription) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="mx-auto max-w-3xl rounded-xl border border-red-200 bg-white p-6 text-red-600">
          Unable to load subscription details.
          <div className="mt-4">
            <Link className="text-blue-600 hover:underline" to="/subscribe">
              Back to Subscribe
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const sub = data.subscription;
  const timeSlots = sub?.details?.time_slots || [];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">
          Subscription Summary
        </h1>
        <p className="mt-2 text-slate-600">
          Please keep this subscription ID for future reference.
        </p>

        <div className="mt-6 grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
          <p>
            <strong>Subscription ID:</strong> {data.subscription_id}
          </p>
          <p>
            <strong>Type:</strong> {sub.type || "-"}
          </p>
          <p>
            <strong>Status:</strong> {sub.status || "-"}
          </p>
          <p>
            <strong>Full Name:</strong> {sub.full_name || "-"}
          </p>
          <p>
            <strong>Email:</strong> {sub.email || "-"}
          </p>
          <p>
            <strong>Country:</strong> {sub.country?.name || "-"}
          </p>
        </div>

        {Array.isArray(timeSlots) && timeSlots.length > 0 && (
          <div className="mt-4 rounded-lg border border-slate-200 p-4">
            <h2 className="mb-2 font-semibold text-slate-900">
              Interview Times
            </h2>
            <ul className="list-disc pl-5 text-sm text-slate-700">
              {timeSlots.map((slot) => (
                <li key={slot.id || slot.value}>{slot.value}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <Link
            className="rounded-lg bg-blue-600 px-4 py-2 text-white"
            to="/subscribe"
          >
            Create Another
          </Link>
          <Link
            className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700"
            to="/"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSummaryPage;
