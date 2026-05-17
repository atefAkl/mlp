import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { subscriberTypes, typeLabels, subscribers, statusLabels } from '../data/subscribers';
import Button from '../components/atoms/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEnvelope, faCalendarDay, faUser, faClipboardList } from '@fortawesome/free-solid-svg-icons';

const SubscriberDetails = () => {
  const { type, id } = useParams();
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const subscriber = subscribers.find((item) => item.type === type && item.id === id);

  if (!subscriber) {
    return (
      <div className="p-6 bg-white rounded-3xl border border-red-100 shadow-sm text-center">
        <h2 className="text-xl font-bold text-slate-900">Subscriber Not Found</h2>
        <p className="mt-3 text-sm text-slate-500">Please choose a valid subscriber from the dashboard list.</p>
        <div className="mt-6">
          <Link to="/dashboard/subscribers">
            <Button variant="primary" className="text-[11px] px-4">Back to Subscribers</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Subscriber Details</h1>
          <p className="mt-2 text-sm text-slate-500">Detailed view for {typeLabels[subscriber.type]} subscription and interview/demo scheduling.</p>
        </div>
        <Link to="/dashboard/subscribers">
          <Button variant="secondary" icon={faArrowLeft} className="text-[11px] px-4">Back to list</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-6">
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6">
          <div className="flex items-center justify-between gap-3 mb-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Subscription Type</p>
              <h2 className="mt-2 text-xl font-bold text-slate-900">{typeLabels[subscriber.type]}</h2>
            </div>
            <div className="rounded-full bg-blue-600 w-14 h-14 flex items-center justify-center text-white text-lg font-black">
              {subscriber.name.charAt(0)}
            </div>
          </div>
          <div className="space-y-4 text-sm text-slate-600">
            <div className="flex items-center gap-3"><FontAwesomeIcon icon={faUser} className="text-blue-600" /><span className="font-semibold">Name:</span> {subscriber.name}</div>
            <div className="flex items-center gap-3"><FontAwesomeIcon icon={faEnvelope} className="text-slate-500" /><span className="font-semibold">Email:</span> {subscriber.email}</div>
            <div className="flex items-center gap-3"><FontAwesomeIcon icon={faCalendarDay} className="text-slate-500" /><span className="font-semibold">Scheduled:</span> {new Date(subscriber.date).toLocaleString()}</div>
            <div className="flex items-center gap-3"><FontAwesomeIcon icon={faClipboardList} className="text-slate-500" /><span className="font-semibold">Round:</span> {subscriber.round}</div>
            <div className="flex items-center gap-3"><span className="font-semibold">Meeting:</span> {subscriber.meeting}</div>
            <div className="flex items-center gap-3"><span className="font-semibold">Status:</span> {statusLabels[subscriber.status]}</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Subscription Summary</h2>
          <p className="text-sm text-slate-600 leading-relaxed">The subscriber request belongs to the {typeLabels[subscriber.type]} group and is currently in <span className="font-semibold text-slate-900">{statusLabels[subscriber.status]}</span> status. Use this page to review the interview/demo schedule, adjust status, or send follow-up instructions.</p>
          <div className="mt-6 grid gap-3">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Note</p>
              <p className="mt-2 text-sm text-slate-700">{subscriber.note}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Next Step</p>
              <p className="mt-2 text-sm text-slate-700">Schedule the final {subscriber.meeting.toLowerCase()} and confirm via email.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriberDetails;
