import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  useGetPermissionsQuery, 
  useCreatePermissionMutation, 
  useUpdatePermissionMutation, 
  useDeletePermissionMutation,
  useBulkDeletePermissionsMutation
} from '../features/api/apiSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTrash, faKey, faLayerGroup, 
  faChevronDown, faChevronUp, faEdit as faEditAlt 
} from '@fortawesome/free-solid-svg-icons';
import Button from '../components/atoms/Button';
import Badge from '../components/atoms/Badge';
import StatsCard from '../components/molecules/StatsCard';
import Pagination from '../components/molecules/Pagination';
import ResourceHeader from '../components/organisms/ResourceHeader';
import ResourceFilters from '../components/organisms/ResourceFilters';
import SelectionBanner from '../components/molecules/SelectionBanner';
import Modal from '../components/organisms/Modal';
import { Input, Select } from '../components/atoms/FormElements';
import { toast } from 'react-toastify';

const PermissionList = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  // API Queries
  const { data: permissions, isLoading, error, refetch } = useGetPermissionsQuery();
  const [createPermission, { isLoading: isCreating }] = useCreatePermissionMutation();
  const [updatePermission, { isLoading: isUpdating }] = useUpdatePermissionMutation();
  const [deletePermission] = useDeletePermissionMutation();
  const [bulkDelete] = useBulkDeletePermissionsMutation();

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list'); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedPermissionId, setSelectedPermissionId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeGroup, setActiveGroup] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', group: '' });
  const [isAddingNewGroup, setIsAddingNewGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Fewer per page because permissions are grouped/nested

  if (isLoading) return <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-theme-primary"></div></div>;
  if (error) return <div className="text-red-500 p-4">Error loading permissions</div>;

  const formatName = (name) => name.replace(/_/g, ' ').toUpperCase();

  const groupedPermissions = permissions?.reduce((acc, perm) => {
    const group = perm.group || (isRTL ? 'عام' : 'General');
    if (!acc[group]) acc[group] = [];
    acc[group].push(perm);
    return acc;
  }, {});

  const dynamicGroupOptions = Object.keys(groupedPermissions || {}).map(g => ({ value: g, label: g }));

  const filteredGroups = Object.entries(groupedPermissions || {}).reduce((acc, [group, perms]) => {
    const filteredPerms = perms.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filteredPerms.length > 0) acc[group] = filteredPerms;
    return acc;
  }, {});

  // Pagination Logic for Groups
  const groupEntries = Object.entries(filteredGroups);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGroups = groupEntries.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (activeGroup === null && currentGroups.length > 0) {
      setActiveGroup(currentGroups[0][0]);
  }

  const handleOpenCreateModal = () => {
    setEditMode(false);
    setFormData({ name: '', description: '', group: dynamicGroupOptions[0]?.value || '' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (permission) => {
    setEditMode(true);
    setSelectedPermissionId(permission.id);
    setFormData({ 
      name: permission.name,
      description: permission.description || '',
      group: permission.group || ''
    });
    setIsModalOpen(true);
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleBulkAction = async (action) => {
    if (action === 'delete' && selectedIds.length > 0) {
      if (window.confirm(isRTL ? `حذف ${selectedIds.length} صلاحيات؟` : `Delete ${selectedIds.length} items?`)) {
        try {
          await bulkDelete(selectedIds).unwrap();
          toast.success(isRTL ? 'تم الحذف بنجاح' : 'Deleted');
          setSelectedIds([]);
        } catch (err) {
          toast.error('Failed');
        }
      }
    }
  };

  const selectAllInGroup = (perms) => {
    const permIds = perms.map(p => p.id);
    setSelectedIds(prev => [...new Set([...prev, ...permIds])]);
  };

  const selectNoneInGroup = (perms) => {
    const permIds = perms.map(p => p.id);
    setSelectedIds(prev => prev.filter(id => !permIds.includes(id)));
  };

  const invertSelectionInGroup = (perms) => {
    const permIds = perms.map(p => p.id);
    setSelectedIds(prev => {
      const unselectedInGroup = permIds.filter(id => !prev.includes(id));
      return [...prev.filter(id => !permIds.includes(id)), ...unselectedInGroup];
    });
  };

  const handleGroupBulkDelete = async (groupPerms) => {
    const groupPermIds = groupPerms.map(p => p.id);
    const selectedInGroup = selectedIds.filter(id => groupPermIds.includes(id));
    if (selectedInGroup.length === 0) return;
    
    if (window.confirm(isRTL 
      ? `هل أنت متأكد من حذف الصلاحيات المحددة (${selectedInGroup.length}) في هذه المجموعة؟` 
      : `Are you sure you want to delete the selected permissions (${selectedInGroup.length}) in this group?`
    )) {
      try {
        await bulkDelete(selectedInGroup).unwrap();
        toast.success(isRTL ? 'تم حذف الصلاحيات بنجاح' : 'Deleted successfully');
        setSelectedIds(prev => prev.filter(id => !selectedInGroup.includes(id)));
      } catch (err) {
        toast.error('Failed');
      }
    }
  };

  const renderGroupToolbar = (group, perms) => {
    const groupPermIds = perms.map(p => p.id);
    const selectedInGroup = selectedIds.filter(id => groupPermIds.includes(id));
    const selectedCount = selectedInGroup.length;

    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 bg-slate-50/70 p-2.5 px-3 rounded-xl border border-slate-100 animate-in fade-in-50 duration-200">
        <span className="text-[10px] font-bold text-slate-500">
          {isRTL 
            ? `تم تحديد ${selectedCount} من أصل ${perms.length} صلاحيات` 
            : `${selectedCount} of ${perms.length} permissions selected`}
        </span>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white p-0.5 px-1 rounded-lg border border-slate-200 shadow-sm">
            <button
              type="button"
              onClick={() => selectAllInGroup(perms)}
              className="px-2 py-1 rounded text-[9px] font-black hover:bg-slate-50 text-theme-primary smooth-transition"
            >
              {isRTL ? "الكل" : "All"}
            </button>
            <span className="text-slate-200 text-[9px]">|</span>
            <button
              type="button"
              onClick={() => selectNoneInGroup(perms)}
              className="px-2 py-1 rounded text-[9px] font-black hover:bg-slate-50 text-slate-500 smooth-transition"
            >
              {isRTL ? "لا شيء" : "None"}
            </button>
            <span className="text-slate-200 text-[9px]">|</span>
            <button
              type="button"
              onClick={() => invertSelectionInGroup(perms)}
              className="px-2 py-1 rounded text-[9px] font-black hover:bg-slate-50 text-amber-600 smooth-transition"
            >
              {isRTL ? "عكس" : "Invert"}
            </button>
          </div>
          
          {selectedCount > 0 && (
            <button
              type="button"
              onClick={() => handleGroupBulkDelete(perms)}
              className="flex items-center gap-1.5 text-[9px] font-black bg-red-50 hover:bg-red-100 text-red-600 px-2.5 py-1.5 rounded-lg border border-red-100 smooth-transition shadow-sm"
            >
              <FontAwesomeIcon icon={faTrash} className="text-[8px]" />
              <span>{isRTL ? "حذف المحدد" : "Delete Selected"}</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  const toggleAccordion = (group) => {
    setActiveGroup(prev => prev === group ? null : group);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalGroup = isAddingNewGroup ? newGroupName : formData.group;
    try {
      if (editMode) {
        await updatePermission({ id: selectedPermissionId, ...formData, group: finalGroup }).unwrap();
        toast.success(isRTL ? 'تم التحديث' : 'Updated');
      } else {
        await createPermission({ ...formData, group: finalGroup }).unwrap();
        toast.success(isRTL ? 'تمت الإضافة' : 'Created');
      }
      setIsModalOpen(false);
      setIsAddingNewGroup(false);
      setNewGroupName('');
    } catch (err) {
      toast.error(err.data?.message || 'Error');
    }
  };

  const handleDelete = async () => {
    if (window.confirm(isRTL ? 'حذف هذه الصلاحية؟' : 'Delete?')) {
      try {
        await deletePermission(selectedPermissionId).unwrap();
        toast.success(isRTL ? 'تم الحذف' : 'Deleted');
        setIsModalOpen(false);
      } catch (err) {
        toast.error('Failed');
      }
    }
  };

  const PermissionCard = ({ perm }) => {
    const isSelected = selectedIds.includes(perm.id);
    return (
      <div 
        className={`group relative bg-white border p-3 rounded-lg shadow-sm hover:shadow-md smooth-transition flex items-start gap-3 ${isSelected ? 'border-theme-primary ring-1 ring-theme-primary bg-theme-primary-light/10' : 'border-slate-100 hover:border-theme-primary-light'}`}
      >
        <div className="pt-1">
          <input 
            type="checkbox" 
            checked={isSelected} 
            onChange={(e) => {
                e.stopPropagation();
                toggleSelect(perm.id);
            }}
            className="w-3.5 h-3.5 rounded border-slate-300 text-theme-primary focus:ring-theme-primary cursor-pointer"
          />
        </div>
        <div className="cursor-pointer flex-1 min-w-0" onClick={() => handleOpenEditModal(perm)}>
          <h4 className="text-[11px] font-black text-slate-800 truncate mb-0.5 uppercase">
            {formatName(perm.name)}
          </h4>
          <p className="text-[10px] text-slate-400 line-clamp-1 leading-tight">
            {perm.description || (isRTL ? 'لا يوجد وصف' : 'No description')}
          </p>
        </div>
        <div className="opacity-0 group-hover:opacity-100 smooth-transition pt-0.5">
            <FontAwesomeIcon icon={faEditAlt} className="text-[10px] text-theme-primary" />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-10" dir={isRTL ? 'rtl' : 'ltr'}>
      <ResourceHeader 
        title={isRTL ? 'إدارة الصلاحيات' : 'Permissions Management'} 
        onRefresh={refetch}
        onAdd={handleOpenCreateModal}
      />

      <div className="flex gap-4">
          <div className="flex-1">
            <StatsCard title={isRTL ? 'إجمالي الصلاحيات' : 'Total Permissions'} value={permissions?.length || 0} icon={faKey} color="blue" />
          </div>
          <div className="flex-1">
            <StatsCard title={isRTL ? 'إجمالي المجموعات' : 'Total Groups'} value={Object.keys(groupedPermissions || {}).length} icon={faLayerGroup} color="emerald" />
          </div>
      </div>

      <ResourceFilters 
        onSearch={(val) => { setSearchTerm(val); setCurrentPage(1); setSelectedIds([]); }} 
        onViewChange={setViewMode}
        currentView={viewMode}
        onBulkAction={handleBulkAction}
        selectedCount={selectedIds.length}
        onSelectAll={() => {
          const currentPermsIds = currentGroups.flatMap(([, perms]) => perms.map(p => p.id));
          setSelectedIds(prev => [...new Set([...prev, ...currentPermsIds])]);
        }}
        onSelectNone={() => setSelectedIds([])}
        onSelectInvert={() => {
          setSelectedIds(prev => {
            const allFilteredIds = Object.values(filteredGroups).flat().map(p => p.id);
            return allFilteredIds.filter(id => !prev.includes(id));
          });
        }}
      />

      <SelectionBanner
        selectedCount={selectedIds.length}
        currentPageCount={currentGroups.flatMap(([, perms]) => perms).length}
        totalFilteredCount={Object.values(filteredGroups).flat().length}
        onSelectAllFiltered={() => setSelectedIds(Object.values(filteredGroups).flat().map(p => p.id))}
        onClearSelection={() => setSelectedIds([])}
      />

      {viewMode === 'grid' ? (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2">
          {currentGroups.map(([group, perms]) => (
            <fieldset key={group} className="border border-slate-200 rounded-2xl p-6 bg-white/40">
              <legend className="px-5 py-1.5 bg-slate-800 text-white rounded-full text-xs font-black shadow-lg">
                {group}
              </legend>
              
              {renderGroupToolbar(group, perms)}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {perms.map(perm => <PermissionCard key={perm.id} perm={perm} />)}
              </div>
            </fieldset>
          ))}
        </div>
      ) : (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
          {currentGroups.map(([group, perms]) => {
            const isOpen = activeGroup === group;
            return (
              <div key={group} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm smooth-transition">
                <button 
                  onClick={() => toggleAccordion(group)}
                  className={`w-full flex items-center justify-between p-4 text-sm font-bold smooth-transition ${isOpen ? 'bg-slate-50 text-theme-primary' : 'text-slate-700 hover:bg-slate-50'}`}
                >
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faLayerGroup} className="text-xs opacity-50" />
                    <span>{group}</span>
                    <Badge variant="slate" className="text-[10px]">{perms.length}</Badge>
                  </div>
                  <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} className="text-[10px]" />
                </button>
                {isOpen && (
                  <div className="p-4 bg-white border-t border-slate-100 space-y-4">
                    {renderGroupToolbar(group, perms)}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {perms.map(perm => <PermissionCard key={perm.id} perm={perm} />)}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Integration */}
      <Pagination 
        totalItems={groupEntries.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      {/* Permission Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editMode ? (isRTL ? 'تعديل الصلاحية' : 'Edit Permission') : (isRTL ? 'إضافة صلاحية جديدة' : 'Add New Permission')}
        footer={
          <div className="w-full flex items-center justify-between">
            <div>
              {editMode && (
                <Button variant="ghost" icon={faTrash} onClick={handleDelete} className="text-red-500 hover:bg-red-50 text-xs">
                  {isRTL ? 'حذف' : 'Delete'}
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)} className="text-xs">{isRTL ? 'إلغاء' : 'Cancel'}</Button>
              <Button variant="primary" onClick={handleSubmit} disabled={isCreating || isUpdating} className="text-xs">
                {isRTL ? 'حفظ' : 'Save'}
              </Button>
            </div>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label={isRTL ? 'مفتاح الصلاحية' : 'Key'} 
            placeholder="e.g. view_users"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          
          <div className="space-y-1">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">{isRTL ? 'المجموعة' : 'Group'}</label>
              <button 
                type="button" 
                onClick={() => setIsAddingNewGroup(!isAddingNewGroup)}
                className="text-[10px] font-bold text-theme-primary hover:underline"
              >
                {isAddingNewGroup ? (isRTL ? 'اختر من القائمة' : 'Select from list') : (isRTL ? '+ مجموعة جديدة' : '+ New Group')}
              </button>
            </div>
            
            {isAddingNewGroup ? (
              <Input 
                placeholder={isRTL ? 'اسم المجموعة الجديدة...' : 'New group name...'}
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                autoFocus
              />
            ) : (
              <Select 
                options={dynamicGroupOptions}
                value={formData.group}
                onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                required
              />
            )}
          </div>

          <div className="space-y-1">
             <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">{isRTL ? 'الوصف' : 'Description'}</label>
             <textarea 
               className="block w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-theme-primary smooth-transition"
               rows="3"
               value={formData.description}
               onChange={(e) => setFormData({ ...formData, description: e.target.value })}
               placeholder={isRTL ? 'وصف الصلاحية...' : 'Description...'}
             ></textarea>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PermissionList;
