import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
   faEnvelope, faCheckCircle, faTimesCircle, 
  faQuestion, faChevronDown, faChevronUp, faEye, 
  faUserCheck, faUserTimes, faQuestionCircle 
} from '@fortawesome/free-solid-svg-icons';
import Button from '../components/atoms/Button';
import StatsCard from '../components/molecules/StatsCard';
import Pagination from '../components/molecules/Pagination';
import ResourceHeader from '../components/organisms/ResourceHeader';
import ResourceFilters from '../components/organisms/ResourceFilters';
import SelectionBanner from '../components/molecules/SelectionBanner';
import Modal from '../components/organisms/Modal';
import { Input, Select } from '../components/atoms/FormElements';
import { subscribers as sampleSubscribers, subscriberTypes, subscriberRounds, subscriberStatuses, typeLabels, statusLabels } from '../data/subscribers';
import { toast } from 'react-toastify';

const typeOptions = [{ value: '', label: 'All Types' }, ...subscriberTypes];

const SubscribersPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // State
  const [subscribers, setSubscribers] = useState(sampleSubscribers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ type: '', round: '', date: '', status: '' });
  const [viewMode, setViewMode] = useState('list');
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeGroup, setActiveGroup] = useState(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState(''); 
  const [activeSubscriber, setActiveSubscriber] = useState(null);
  const [actionDate, setActionDate] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

 
  const groupedSubscribers = useMemo(() => {
    return subscribers.reduce((acc, item) => {
      const group = item.type || 'General';
      if (!acc[group]) acc[group] = [];
      acc[group].push(item);
      return acc;
    }, {});
  }, [subscribers]);


  const filteredGroups = useMemo(() => {
    return Object.entries(groupedSubscribers).reduce((acc, [group, items]) => {
      const filteredItems = items.filter((item) => {
        const matchesSearch = searchTerm === '' || 
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          item.email.toLowerCase().includes(searchTerm.toLowerCase());
          
        const matchesType = filters.type === '' || item.type === filters.type;
        const matchesRound = filters.round === '' || item.round === filters.round;
        const matchesStatus = filters.status === '' || item.status === filters.status;
        const matchesDate = filters.date === '' || item.date.startsWith(filters.date);

        return matchesSearch && matchesType && matchesRound && matchesStatus && matchesDate;
      });

      if (filteredItems.length > 0) {
        acc[group] = filteredItems;
      }
      return acc;
    }, {});
  }, [groupedSubscribers, searchTerm, filters]);

 
  const stats = useMemo(() => {
    const allFilteredItems = Object.values(filteredGroups).flat();
    return {
      total: allFilteredItems.length,
      accepted: allFilteredItems.filter((item) => item.status === 'accepted').length,
      rejected: allFilteredItems.filter((item) => item.status === 'rejected').length,
      maybe: allFilteredItems.filter((item) => item.status === 'maybe').length,
    };
  }, [filteredGroups]);

 
  const groupEntries = Object.entries(filteredGroups);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGroups = groupEntries.slice(indexOfFirstItem, indexOfLastItem);

  if (activeGroup === null && currentGroups.length > 0) {
    setActiveGroup(currentGroups[0][0]);
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Selection Handlers
  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const selectAllInGroup = (items) => {
    const itemIds = items.map(p => p.id);
    setSelectedIds(prev => [...new Set([...prev, ...itemIds])]);
  };

  const selectNoneInGroup = (items) => {
    const itemIds = items.map(p => p.id);
    setSelectedIds(prev => prev.filter(id => !itemIds.includes(id)));
  };

  const invertSelectionInGroup = (items) => {
    const itemIds = items.map(p => p.id);
    setSelectedIds(prev => {
      const unselectedInGroup = itemIds.filter(id => !prev.includes(id));
      return [...prev.filter(id => !itemIds.includes(id)), ...unselectedInGroup];
    });
  };

  const toggleAccordion = (group) => {
    setActiveGroup(prev => prev === group ? null : group);
  };

  const handleOpenModal = (mode, subscriber = null) => {
    setModalMode(mode);
    setActiveSubscriber(subscriber);
    setActionMessage('');
    setActionDate(subscriber?.date || '');
    setIsModalOpen(true);
  };

  const handleBulkDelete = () => {
    if (window.confirm(isRTL ? `هل تريد حذف ${selectedIds.length} من المشتركين المحددين؟` : `Delete ${selectedIds.length} selected subscribers?`)) {
      setSubscribers(prev => prev.filter(item => !selectedIds.includes(item.id)));
      toast.success(isRTL ? 'تم حذف المشتركين بنجاح' : 'Selected subscribers deleted');
      setSelectedIds([]);
    }
  };

  const handleGroupBulkAction = (mode, groupItems) => {
    const groupItemIds = groupItems.map(p => p.id);
    const selectedInGroup = selectedIds.filter(id => groupItemIds.includes(id));
    if (!selectedInGroup.length) return;

    setModalMode(`bulk-${mode}`);
    setIsModalOpen(true);
    setActionMessage('');
    setActionDate('');
  };

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const ids = modalMode.startsWith('bulk-') ? selectedIds : [activeSubscriber.id];
    const currentStatus = modalMode.includes('accept') ? 'accepted' : modalMode.includes('reject') ? 'rejected' : 'maybe';

    setSubscribers((prev) => prev.map((item) => {
      if (ids.includes(item.id)) {
        return { 
          ...item, 
          status: currentStatus, 
          date: currentStatus === 'accepted' ? (actionDate || item.date) : item.date 
        };
      }
      return item;
    }));

    toast.success(isRTL ? 'تم تحديث الحالة بنجاح' : 'Status updated successfully');
    if (modalMode.startsWith('bulk-')) {
      setSelectedIds(prev => prev.filter(id => !ids.includes(id)));
    }
    setIsModalOpen(false);
  };

  const renderStatusBadge = (status) => {
    const classes = {
      accepted: 'bg-emerald-100 text-emerald-700',
      rejected: 'bg-red-100 text-red-700',
      maybe: 'bg-amber-100 text-amber-700',
      pending: 'bg-slate-100 text-slate-600',
    };
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${classes[status] || classes.pending}`}>
        {statusLabels[status] || status}
      </span>
    );
  };

  const renderGroupToolbar = (group, items) => {
    const groupItemIds = items.map(p => p.id);
    const selectedInGroup = selectedIds.filter(id => groupItemIds.includes(id));
    const selectedCount = selectedInGroup.length;

    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 bg-slate-50/70 p-2.5 px-3 rounded-xl border border-slate-100 animate-in fade-in-50 duration-200">
        <span className="text-[10px] font-bold text-slate-500">
          {isRTL 
            ? `تم تحديد ${selectedCount} من أصل ${items.length} مشتركين` 
            : `${selectedCount} of ${items.length} subscribers selected`}
        </span>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white p-0.5 px-1 rounded-lg border border-slate-200 shadow-sm">
            <button type="button" onClick={() => selectAllInGroup(items)} className="px-2 py-1 rounded text-[9px] font-black hover:bg-slate-50 text-theme-primary smooth-transition">{isRTL ? "الكل" : "All"}</button>
            <span className="text-slate-200 text-[9px]">|</span>
            <button type="button" onClick={() => selectNoneInGroup(items)} className="px-2 py-1 rounded text-[9px] font-black hover:bg-slate-50 text-slate-500 smooth-transition">{isRTL ? "لا شيء" : "None"}</button>
            <span className="text-slate-200 text-[9px]">|</span>
            <button type="button" onClick={() => invertSelectionInGroup(items)} className="px-2 py-1 rounded text-[9px] font-black hover:bg-slate-50 text-amber-600 smooth-transition">{isRTL ? "عكس" : "Invert"}</button>
          </div>
          
          {selectedCount > 0 && (
            <div className="flex gap-1.5">
              <button type="button" onClick={() => handleGroupBulkAction('accept', items)} className="flex items-center gap-1 text-[9px] font-black bg-emerald-50 hover:bg-emerald-100 text-emerald-600 px-2.5 py-1.5 rounded-lg border border-emerald-100 smooth-transition shadow-sm">
                {isRTL ? "قبول المحدد" : "Accept Selected"}
              </button>
              <button type="button" onClick={() => handleGroupBulkAction('reject', items)} className="flex items-center gap-1 text-[9px] font-black bg-red-50 hover:bg-red-100 text-red-600 px-2.5 py-1.5 rounded-lg border border-red-100 smooth-transition shadow-sm">
                {isRTL ? "رفض المحدد" : "Reject Selected"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const titleDirection = isRTL ? 'rtl' : 'ltr';
  const allFilteredItemsFlat = Object.values(filteredGroups).flat();

  return (
    <div className="space-y-6 pb-10" dir={titleDirection}>
      
      <ResourceHeader 
        title={isRTL ? "إدارة المشتركين" : "Subscribers Management"}
        description={isRTL ? "عرض وتصفية المقابلات والاشتراكات التجريبية للمدربين والطلاب والشركات." : "View, filter, and manage trainer/trainee interviews plus company demo subscriptions."}
        onAddNew={null} 
      />

   
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <StatsCard title={isRTL ? "إجمالي المشتركين" : "Total Subscribers"} value={stats.total} icon={faEnvelope} color="blue" />
        <StatsCard title={isRTL ? "مقبول" : "Accepted"} value={stats.accepted} icon={faCheckCircle} color="emerald" />
        <StatsCard title={isRTL ? "مرفوض" : "Rejected"} value={stats.rejected} icon={faTimesCircle} color="red" />
        <StatsCard title={isRTL ? "محتمل" : "Maybe"} value={stats.maybe} icon={faQuestion} color="amber" />
      </div>

      <ResourceFilters 
        searchTerm={searchTerm}
        onSearch={(value) => { setSearchTerm(value); setCurrentPage(1); }}
        searchPlaceholder={isRTL ? "البحث عن اسم أو إيميل..." : "Search name or email..."}
        onViewChange={setViewMode}
        currentView={viewMode}
      >
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 w-full">
          <Select
            label={isRTL ? "النوع" : "Type"}
            options={typeOptions.map(opt => ({ ...opt, label: isRTL && opt.value === '' ? 'كل الأنواع' : opt.label }))}
            value={filters.type}
            onChange={(e) => { setFilters({ ...filters, type: e.target.value }); setCurrentPage(1); }}
          />
          <Select
            label={isRTL ? "الجولة" : "Round"}
            options={[
              { value: '', label: isRTL ? 'كل الجولات' : 'All Rounds' },
              ...subscriberRounds.filter(item => item && item.value !== '').map(r => typeof r === 'object' ? r : { value: r, label: r })
            ]}
            value={filters.round}
            onChange={(e) => { setFilters({ ...filters, round: e.target.value }); setCurrentPage(1); }}
          />
          <Input
            label={isRTL ? "التاريخ" : "Date"}
            type="date"
            value={filters.date}
            onChange={(e) => { setFilters({ ...filters, date: e.target.value }); setCurrentPage(1); }}
          />
          <Select
            label={isRTL ? "الحالة" : "Status"}
            options={[
              { value: '', label: isRTL ? 'كل الحالات' : 'All Statuses' },
              ...subscriberStatuses.filter(item => item && item.value !== '').map(s => typeof s === 'object' ? s : { value: s, label: s })
            ]}
            value={filters.status}
            onChange={(e) => { setFilters({ ...filters, status: e.target.value }); setCurrentPage(1); }}
          />
        </div>
      </ResourceFilters>

      <SelectionBanner 
        selectedCount={selectedIds.length}
        onClear={() => setSelectedIds([])}
        actions={[
          {
            label: isRTL ? 'حذف من النظام' : 'Delete From System',
            onClick: handleBulkDelete,
            variant: 'danger'
          }
        ]}
      />

      {viewMode === 'list' ? (
        <div className="space-y-4">
          {currentGroups.length > 0 ? (
            currentGroups.map(([groupType, items]) => {
              const isOpen = activeGroup === groupType;
              const currentGroupName = typeLabels[groupType] || groupType;
              return (
                <div key={groupType} className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden smooth-transition">
                  <div 
                    onClick={() => toggleAccordion(groupType)}
                    className="p-4 px-5 bg-slate-50/60 hover:bg-slate-50 flex items-center justify-between cursor-pointer smooth-transition select-none"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-theme-primary/10 flex items-center justify-center text-theme-primary">
                        <FontAwesomeIcon icon={faEnvelope} className="text-sm" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">
                          {isRTL ? `مشتركي ${currentGroupName}` : `${currentGroupName} Subscribers`}
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {isRTL ? `إدارة تفاصيل ${currentGroupName}` : `Manage details for ${currentGroupName.toLowerCase()}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-bold bg-slate-200/70 text-slate-600 px-2.5 py-1 rounded-md">
                        {items.length} {isRTL ? "عناصر" : "items"}
                      </span>
                      <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} className="text-xs text-slate-400" />
                    </div>
                  </div>

                  {isOpen && (
                    <div className="p-4 border-t border-slate-100 animate-in slide-in-from-top-2 duration-200">
                      {renderGroupToolbar(groupType, items)}
                      
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-slate-700 min-w-[800px]">
                          <thead className="bg-slate-50/50 text-slate-400 uppercase tracking-wider text-[9px] border-b border-slate-100">
                            <tr>
                              <th className="px-4 py-2.5 w-10 text-center">
                                <input 
                                  type="checkbox" 
                                  className="w-3.5 h-3.5 rounded border-slate-300 text-theme-primary focus:ring-theme-primary"
                                  onChange={(e) => {
                                    const ids = items.map((i) => i.id);
                                    setSelectedIds(prev => e.target.checked ? Array.from(new Set([...prev, ...ids])) : prev.filter((id) => !ids.includes(id)));
                                  }}
                                  checked={items.every((i) => selectedIds.includes(i.id))}
                                />
                              </th>
                              <th className="px-4 py-2.5 text-start">{isRTL ? "الاسم" : "Name"}</th>
                              <th className="px-4 py-2.5 text-start">{isRTL ? "الجولة" : "Round"}</th>
                              <th className="px-4 py-2.5 text-start">{isRTL ? "الاجتماع" : "Meeting"}</th>
                              <th className="px-4 py-2.5 text-start">{isRTL ? "التاريخ" : "Date"}</th>
                              <th className="px-4 py-2.5 text-start">{isRTL ? "الحالة" : "Status"}</th>
                              <th className="px-4 py-2.5 text-end">{isRTL ? "الإجراءات" : "Actions"}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {items.map((subscriber) => {
                              const isRowSelected = selectedIds.includes(subscriber.id);
                              return (
                                <tr key={subscriber.id} className={`${isRowSelected ? 'bg-theme-primary-light/5' : 'hover:bg-slate-50/50'} smooth-transition`}>
                                  <td className="px-4 py-3 text-center">
                                    <input 
                                      type="checkbox" 
                                      checked={isRowSelected}
                                      onChange={() => toggleSelect(subscriber.id)}
                                      className="w-3.5 h-3.5 rounded border-slate-300 text-theme-primary focus:ring-theme-primary"
                                    />
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex flex-col">
                                      <span className="font-bold text-slate-800 text-[12px]">{subscriber.name}</span>
                                      <span className="text-[10px] text-slate-400">{subscriber.email}</span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-[11px] font-semibold text-slate-600">{subscriber.round}</td>
                                  <td className="px-4 py-3 text-[11px] text-slate-500">{subscriber.meeting}</td>
                                  <td className="px-4 py-3 text-[11px] text-slate-500">{new Date(subscriber.date).toLocaleString(isRTL ? 'ar-EG' : 'en-US')}</td>
                                  <td className="px-4 py-3">{renderStatusBadge(subscriber.status)}</td>
                                  <td className="px-4 py-3 text-end">
                                    <div className="flex justify-end items-center gap-1.5">
                                      <Link to={`/dashboard/subscribers/${subscriber.type}/${subscriber.id}`} className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 smooth-transition" title={isRTL ? "عرض" : "View"}>
                                        <FontAwesomeIcon icon={faEye} className="text-[11px]" />
                                      </Link>
                                      <button onClick={() => handleOpenModal('accept', subscriber)} className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 smooth-transition" title={isRTL ? "قبول" : "Accept"}>
                                        <FontAwesomeIcon icon={faUserCheck} className="text-[11px]" />
                                      </button>
                                      <button onClick={() => handleOpenModal('reject', subscriber)} className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 smooth-transition" title={isRTL ? "رفض" : "Reject"}>
                                        <FontAwesomeIcon icon={faUserTimes} className="text-[11px]" />
                                      </button>
                                      <button onClick={() => handleOpenModal('maybe', subscriber)} className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-amber-50 smooth-transition" title={isRTL ? "محتمل" : "Maybe"}>
                                        <FontAwesomeIcon icon={faQuestionCircle} className="text-[11px]" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center p-10 bg-white border rounded-2xl text-slate-400 text-sm">
              {isRTL ? "لا توجد نتائج مطابقة للبحث" : "No matching results found"}
            </div>
          )}
        </div>
      ) : (
       
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {allFilteredItemsFlat.length > 0 ? (
            allFilteredItemsFlat.map((subscriber) => {
              const isCardSelected = selectedIds.includes(subscriber.id);
              return (
                <div 
                  key={subscriber.id} 
                  className={`bg-white border p-4 rounded-xl shadow-sm hover:shadow-md smooth-transition flex flex-col justify-between ${isCardSelected ? 'border-theme-primary ring-1 ring-theme-primary bg-theme-primary-light/5' : 'border-slate-100'}`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" checked={isCardSelected} onChange={() => toggleSelect(subscriber.id)} className="w-3.5 h-3.5 rounded border-slate-300 text-theme-primary focus:ring-theme-primary" />
                        <div>
                          <h4 className="text-[12px] font-black text-slate-800 uppercase">{subscriber.name}</h4>
                          <p className="text-[10px] text-slate-400">{subscriber.email}</p>
                        </div>
                      </div>
                      {renderStatusBadge(subscriber.status)}
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2.5 text-[11px] text-slate-600 space-y-1">
                      <p><span className="font-bold text-slate-400 uppercase text-[9px] block">{isRTL ? "الاجتماع / الجولة" : "Meeting / Round"}</span> {subscriber.meeting} • {subscriber.round}</p>
                      <p><span className="font-bold text-slate-400 uppercase text-[9px] block mt-1">{isRTL ? "التاريخ" : "Date"}</span> {new Date(subscriber.date).toLocaleString(isRTL ? 'ar-EG' : 'en-US')}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">{typeLabels[subscriber.type] || subscriber.type}</span>
                    <div className="flex gap-1">
                      <Link to={`/dashboard/subscribers/${subscriber.type}/${subscriber.id}`} className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-blue-50 smooth-transition"><FontAwesomeIcon icon={faEye} className="text-[10px]" /></Link>
                      <button onClick={() => handleOpenModal('accept', subscriber)} className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-md hover:bg-emerald-50 smooth-transition"><FontAwesomeIcon icon={faUserCheck} className="text-[10px]" /></button>
                      <button onClick={() => handleOpenModal('reject', subscriber)} className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 smooth-transition"><FontAwesomeIcon icon={faUserTimes} className="text-[10px]" /></button>
                      <button onClick={() => handleOpenModal('maybe', subscriber)} className="p-1.5 text-slate-400 hover:text-amber-600 rounded-md hover:bg-amber-50 smooth-transition"><FontAwesomeIcon icon={faQuestionCircle} className="text-[10px]" /></button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center p-10 bg-white border rounded-2xl text-slate-400 text-sm">
              {isRTL ? "لا توجد نتائج مطابقة للبحث" : "No matching results found"}
            </div>
          )}
        </div>
      )}

      <Pagination
        totalItems={groupEntries.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          modalMode.includes('accept') 
            ? (isRTL ? 'تفاصيل الموعد والجدولة' : 'Schedule Details') 
            : modalMode.includes('reject') 
            ? (isRTL ? 'إجراء الرفض' : 'Reject Action') 
            : (isRTL ? 'حالة نقص المعلومات' : 'Missing Info Status')
        }
        footer={(
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>{isRTL ? "إلغاء" : "Cancel"}</Button>
            <Button variant="primary" onClick={handleSubmit}>{isRTL ? "تأكيد" : "Submit"}</Button>
          </>
        )}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {modalMode.includes('accept') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">{isRTL ? "تاريخ ووقت الاجتماع" : "Meeting Date & Time"}</label>
                <input
                  type="datetime-local"
                  value={actionDate}
                  onChange={(e) => setActionDate(e.target.value)}
                  className="mt-2 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">{isRTL ? "البريد الإلكتروني المستهدف" : "Target Email"}</label>
                <input
                  type="email"
                  readOnly
                  value={modalMode.startsWith('bulk-') ? (isRTL ? `تم تحديد ${selectedIds.length} من المستخدمين` : `${selectedIds.length} users selected`) : (activeSubscriber?.email || '')}
                  className="mt-2 block w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-sm text-slate-500"
                />
              </div>
            </div>
          )}

          {(modalMode.includes('reject') || modalMode.includes('maybe')) && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">{isRTL ? "ملاحظات / رسالة داخلية" : "Internal Message / Notes"}</label>
              <textarea
                value={actionMessage}
                onChange={(e) => setActionMessage(e.target.value)}
                rows={4}
                className="mt-2 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder={isRTL ? "اكتب السجلات أو تعليمات الرد هنا..." : "Type the logs or response instructions..."}
              />
            </div>
          )}

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-[12px] text-slate-500 leading-relaxed">
            {modalMode.includes('accept') ? (
              isRTL ? <>هذا الإجراء يحول حالة السجل في النظام إلى <b>مقبول</b> ويقوم بجدولة موعد للمقابلة.</> : <>This execution marks the system records as <b>Accepted</b> and triggers a meeting schedule.</>
            ) : modalMode.includes('reject') ? (
              isRTL ? <>هذا الإجراء يحول حالة السجل إلى <b>مرفوض</b> ويقوم بتحديث إحصائيات لوحة التحكم فوراً.</> : <>Executing this process logs the status as <b>Rejected</b> and updates the dashboard statistics instantly.</>
            ) : (
              isRTL ? <>هذا الإجراء يحول حالة السجل إلى <b>محتمل</b> لدراسته لاحقاً في خطة العمل.</> : <>Executing this process logs the status as <b>Maybe</b> for pipeline consideration.</>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SubscribersPage;