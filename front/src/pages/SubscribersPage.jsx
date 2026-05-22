import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faEnvelope, faCheckCircle, faTimesCircle, faQuestion, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import Button from '../components/atoms/Button';
import { Input, Select } from '../components/atoms/FormElements';
import Modal from '../components/organisms/Modal';
import StatsCard from '../components/molecules/StatsCard';
import Pagination from '../components/molecules/Pagination';
import { subscribers as sampleSubscribers, subscriberTypes, subscriberRounds, subscriberStatuses, typeLabels, statusLabels } from '../data/subscribers';
import { toast } from 'react-toastify';

const typeOptions = [{ value: '', label: 'All Types' }, ...subscriberTypes];

const SubscribersPage = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [filters, setFilters] = useState({ type: '', round: '', date: '', name: '', status: '' });
  const [viewMode, setViewMode] = useState('list');
  const [selectedIds, setSelectedIds] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('');
  const [activeSubscriber, setActiveSubscriber] = useState(null);
  const [actionDate, setActionDate] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [subscribers, setSubscribers] = useState(sampleSubscribers);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredSubscribers = useMemo(() => {
    return subscribers.filter((item) => {
      const sameType = filters.type ? item.type === filters.type : true;
      const sameRound = filters.round ? item.round === filters.round : true;
      const sameStatus = filters.status ? item.status === filters.status : true;
      const sameName = filters.name ? item.name.toLowerCase().includes(filters.name.toLowerCase()) : true;
      const sameDate = filters.date ? item.date.startsWith(filters.date) : true;
      return sameType && sameRound && sameStatus && sameName && sameDate;
    });
  }, [filters, subscribers]);

  const grouped = useMemo(() => {
    return filteredSubscribers.reduce((groups, subscriber) => {
      const key = subscriber.type;
      if (!groups[key]) groups[key] = [];
      groups[key].push(subscriber);
      return groups;
    }, {});
  }, [filteredSubscribers]);

  const stats = useMemo(() => {
    const total = filteredSubscribers.length;
    const accepted = filteredSubscribers.filter((item) => item.status === 'accepted').length;
    const rejected = filteredSubscribers.filter((item) => item.status === 'rejected').length;
    const maybe = filteredSubscribers.filter((item) => item.status === 'maybe').length;
    const pending = filteredSubscribers.filter((item) => item.status === 'pending').length;
    return { total, accepted, rejected, maybe, pending };
  }, [filteredSubscribers]);

  const allIds = filteredSubscribers.map((item) => item.id);
  const currentItems = filteredSubscribers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const isSelected = (id) => selectedIds.includes(id);
  const toggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]));
  };

  const handleBulkAction = (mode) => {
    if (!selectedIds.length) {
      toast.warning('Select at least one subscriber first');
      return;
    }
    setModalMode(mode);
    setModalOpen(true);
    setActionMessage('');
    setActionDate('');
  };

  const handleAction = (mode, subscriber = null) => {
    setModalMode(mode);
    setActiveSubscriber(subscriber);
    setModalOpen(true);
    setActionMessage('');
    setActionDate(subscriber?.date || '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === 'accept' || modalMode === 'bulk-accept') {
      const ids = modalMode === 'bulk-accept' ? selectedIds : [activeSubscriber.id];
      setSubscribers((prev) => prev.map((item) => ids.includes(item.id) ? { ...item, status: 'accepted', date: actionDate || item.date } : item));
      toast.success(`Invitation scheduled for ${ids.length} subscriber(s)`);
      if (modalMode === 'bulk-accept') setSelectedIds([]);
    } else if (modalMode === 'reject' || modalMode === 'bulk-reject') {
      const ids = modalMode === 'bulk-reject' ? selectedIds : [activeSubscriber.id];
      setSubscribers((prev) => prev.map((item) => ids.includes(item.id) ? { ...item, status: 'rejected' } : item));
      toast.info(`Rejected ${ids.length} subscriber(s)`);
      if (modalMode === 'bulk-reject') setSelectedIds([]);
    } else if (modalMode === 'maybe' || modalMode === 'bulk-maybe') {
      const ids = modalMode === 'bulk-maybe' ? selectedIds : [activeSubscriber.id];
      setSubscribers((prev) => prev.map((item) => ids.includes(item.id) ? { ...item, status: 'maybe' } : item));
      toast.info(`Marked ${ids.length} subscriber(s) as maybe`);
      if (modalMode === 'bulk-maybe') setSelectedIds([]);
    }
    setModalOpen(false);
  };

  const handleSelection = (type) => {
    if (type === 'all') setSelectedIds(allIds);
    if (type === 'none') setSelectedIds([]);
    if (type === 'invert') setSelectedIds(allIds.filter((id) => !selectedIds.includes(id)));
  };

  const renderStatusBadge = (status) => {
    const classes = {
      accepted: 'bg-emerald-100 text-emerald-700',
      rejected: 'bg-red-100 text-red-700',
      maybe: 'bg-amber-100 text-amber-700',
      pending: 'bg-slate-100 text-slate-600',
    };
    return (
      <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold ${classes[status]}`}>
        <FontAwesomeIcon icon={status === 'accepted' ? faCheckCircle : status === 'rejected' ? faTimesCircle : status === 'maybe' ? faQuestion : faEnvelope} className="text-[10px]" />
        {statusLabels[status]}
      </span>
    );
  };

  const resetFilters = () => {
    setFilters({ type: '', round: '', date: '', name: '', status: '' });
  };

  const titleDirection = isRTL ? 'rtl' : 'ltr';

  return (
    <div className="space-y-6 pb-10" dir={titleDirection}>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Subscribers Management</h1>
          <p className="mt-2 text-sm text-slate-500 max-w-2xl">View, filter, and manage trainer/trainee interviews plus company demo subscriptions from one dashboard.</p>
        </div>
        <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
          <Button variant="secondary" icon={faRotateRight} onClick={resetFilters} className="uppercase text-[10px] font-bold">Reset Filters</Button>
          <Button variant="primary" icon={faFilter} onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')} className="uppercase text-[10px] font-bold">
            {viewMode === 'list' ? 'Grid View' : 'List View'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Subscribers" value={stats.total} icon={faEnvelope} color="blue" />
        <StatsCard title="Accepted" value={stats.accepted} icon={faCheckCircle} color="emerald" />
        <StatsCard title="Rejected" value={stats.rejected} icon={faTimesCircle} color="red" />
        <StatsCard title="Maybe" value={stats.maybe} icon={faQuestion} color="amber" />
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          <Select
            label="Type"
            options={typeOptions}
            value={filters.type}
            onChange={(e) => { setFilters({ ...filters, type: e.target.value }); setCurrentPage(1); }}
          />
          <Select
            label="Round"
            options={subscriberRounds.filter((item) => item.value)}
            value={filters.round}
            onChange={(e) => { setFilters({ ...filters, round: e.target.value }); setCurrentPage(1); }}
          />
          <Input
            label="Date"
            type="date"
            value={filters.date}
            onChange={(e) => { setFilters({ ...filters, date: e.target.value }); setCurrentPage(1); }}
          />
          <Input
            label="Name"
            type="text"
            value={filters.name}
            onChange={(e) => { setFilters({ ...filters, name: e.target.value }); setCurrentPage(1); }}
            placeholder="Search name..."
          />
          <Select
            label="Status"
            options={subscriberStatuses}
            value={filters.status}
            onChange={(e) => { setFilters({ ...filters, status: e.target.value }); setCurrentPage(1); }}
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Bulk actions:</span>
            <Button variant="secondary" className="text-[11px] px-3" onClick={() => handleSelection('all')}>Select All</Button>
            <Button variant="secondary" className="text-[11px] px-3" onClick={() => handleSelection('none')}>Select None</Button>
            <Button variant="secondary" className="text-[11px] px-3" onClick={() => handleSelection('invert')}>Invert</Button>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[11px] text-slate-500">{selectedIds.length} selected</span>
            <Button variant="danger" className="text-[11px] px-3" onClick={() => handleBulkAction('bulk-reject')} disabled={!selectedIds.length}>Reject</Button>
            <Button variant="secondary" className="text-[11px] px-3" onClick={() => handleBulkAction('bulk-maybe')} disabled={!selectedIds.length}>Maybe</Button>
            <Button variant="primary" className="text-[11px] px-3" onClick={() => handleBulkAction('bulk-accept')} disabled={!selectedIds.length}>Accept</Button>
          </div>
        </div>
      </div>

      {viewMode === 'list' ? (
        Object.entries(grouped).map(([groupType, items]) => (
          <div key={groupType} className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{typeLabels[groupType]} Subscribers</h2>
                <p className="text-sm text-slate-500">Manage interview/demo details for {typeLabels[groupType].toLowerCase()} subscriptions.</p>
              </div>
              <div className="text-xs uppercase tracking-widest text-slate-500">{items.length} items</div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-slate-700 min-w-[900px]">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3 w-12"><input type="checkbox" className="rounded border-slate-300 text-blue-600" onChange={(e) => {
                      const ids = items.map((item) => item.id);
                      setSelectedIds((prev) => e.target.checked ? Array.from(new Set([...prev, ...ids])) : prev.filter((id) => !ids.includes(id)));
                    }} checked={items.every((item) => selectedIds.includes(item.id))} /></th>
                    <th className="px-5 py-3 text-start">Name</th>
                    <th className="px-5 py-3 text-start">Round</th>
                    <th className="px-5 py-3 text-start">Meeting</th>
                    <th className="px-5 py-3 text-start">Date</th>
                    <th className="px-5 py-3 text-start">Status</th>
                    <th className="px-5 py-3 text-end">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((subscriber) => (
                    <tr key={subscriber.id} className={`${isSelected(subscriber.id) ? 'bg-blue-50/40' : 'hover:bg-slate-50'} transition-colors`}>
                      <td className="px-5 py-4"><input type="checkbox" checked={isSelected(subscriber.id)} onChange={() => toggleSelect(subscriber.id)} className="rounded border-slate-300 text-blue-600" /></td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-slate-900">{subscriber.name}</span>
                          <span className="text-[11px] text-slate-500">{subscriber.email}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">{subscriber.round}</td>
                      <td className="px-5 py-4">{subscriber.meeting}</td>
                      <td className="px-5 py-4">{new Date(subscriber.date).toLocaleString()}</td>
                      <td className="px-5 py-4">{renderStatusBadge(subscriber.status)}</td>
                      <td className="px-5 py-4 text-end space-x-1 rtl:space-x-reverse flex flex-wrap justify-end gap-2">
                        <Link to={`/dashboard/subscribers/${subscriber.type}/${subscriber.id}`} className="text-slate-600 hover:text-blue-600 text-xs font-black uppercase tracking-widest">View</Link>
                        <Button variant="primary" className="text-[11px] px-3" onClick={() => handleAction('accept', subscriber)}>Accept</Button>
                        <Button variant="danger" className="text-[11px] px-3" onClick={() => handleAction('reject', subscriber)}>Reject</Button>
                        <Button variant="secondary" className="text-[11px] px-3" onClick={() => handleAction('maybe', subscriber)}>Maybe</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {Object.entries(grouped).map(([groupType, items]) => (
            <div key={groupType} className="bg-white border border-slate-200 rounded-3xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{typeLabels[groupType]}</h2>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{items.length} subscribers</p>
                </div>
                <span className="text-xs rounded-full bg-slate-100 px-3 py-1 text-slate-600">{groupType}</span>
              </div>
              <div className="space-y-4">
                {items.slice(0, 4).map((subscriber) => (
                  <div key={subscriber.id} className="border border-slate-200 rounded-3xl p-4 hover:shadow-lg transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-slate-900">{subscriber.name}</h3>
                        <p className="text-[11px] text-slate-500">{subscriber.meeting} • {subscriber.round}</p>
                      </div>
                      <div>{renderStatusBadge(subscriber.status)}</div>
                    </div>
                    <div className="mt-4 text-[12px] text-slate-600 space-y-2">
                      <p><span className="font-semibold">Email:</span> {subscriber.email}</p>
                      <p><span className="font-semibold">Date:</span> {new Date(subscriber.date).toLocaleString()}</p>
                      <p><span className="font-semibold">Note:</span> {subscriber.note}</p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link to={`/dashboard/subscribers/${subscriber.type}/${subscriber.id}`} className="text-blue-600 text-xs font-black uppercase tracking-widest">View</Link>
                      <Button variant="primary" className="text-[11px] px-3" onClick={() => handleAction('accept', subscriber)}>Accept</Button>
                      <Button variant="danger" className="text-[11px] px-3" onClick={() => handleAction('reject', subscriber)}>Reject</Button>
                      <Button variant="secondary" className="text-[11px] px-3" onClick={() => handleAction('maybe', subscriber)}>Maybe</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination
        totalItems={filteredSubscribers.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalMode.includes('accept') ? 'Schedule Interview / Demo' : modalMode.includes('reject') ? 'Reject Subscriber' : 'Mark Maybe'}
        footer={(
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit}>Submit</Button>
          </>
        )}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {modalMode.includes('accept') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">Meeting Date & Time</label>
                <input
                  type="datetime-local"
                  value={actionDate}
                  onChange={(e) => setActionDate(e.target.value)}
                  className="mt-2 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">Email</label>
                <input
                  type="email"
                  readOnly
                  value={activeSubscriber?.email || ''}
                  className="mt-2 block w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50"
                />
              </div>
            </div>
          )}

          {(modalMode.includes('reject') || modalMode.includes('maybe')) && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">Message</label>
              <textarea
                value={actionMessage}
                onChange={(e) => setActionMessage(e.target.value)}
                rows={5}
                className="mt-2 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write a reason or instruction for the subscriber"
              />
            </div>
          )}

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            {modalMode.includes('accept') ? (
              <>Submitting this form will mark the subscription as <b>Accepted</b> and schedule the selected interview/demo slot.</>
            ) : modalMode.includes('reject') ? (
              <>This will update the status to <b>Rejected</b> and send the subscriber a rejection reason.</>
            ) : (
              <>This will update the status to <b>Maybe</b> and notify the subscriber about missing data or next steps.</>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SubscribersPage;
