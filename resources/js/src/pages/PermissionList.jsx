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
  faEdit, faTrash, faKey, faLayerGroup, 
  faChevronDown, faChevronUp, faEdit as faEditAlt 
} from '@fortawesome/free-solid-svg-icons';
import Button from '../components/atoms/Button';
import Badge from '../components/atoms/Badge';
import StatsCard from '../components/molecules/StatsCard';
import Pagination from '../components/molecules/Pagination';
import ResourceHeader from '../components/organisms/ResourceHeader';
import ResourceFilters from '../components/organisms/ResourceFilters';
import Modal from '../components/organisms/Modal';
import { Input, Select } from '../components/atoms/FormElements';
import { toast } from 'react-toastify';

const PermissionList = () => {
  const { t, i18n } = useTranslation();
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

  if (isLoading) return <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;
  if (error) return <div className="text-red-500 p-4">Error loading permissions</div>;

  const formatName = (name) => name.replace(/_/g, ' ').toUpperCase();

  const groupedPermissions = permissions?.reduce((acc, perm) => {
    const group = perm.group || (t('admin.permissions.general'));
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
      if (window.confirm(t('admin.permissions.delete_items_confirm', { count: selectedIds.length }))) {
        try {
          await bulkDelete(selectedIds).unwrap();
          toast.success(t('common.deleted'));
          setSelectedIds([]);
        } catch (err) {
          toast.error('Failed');
        }
      }
    }
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
        toast.success(t('common.updated'));
      } else {
        await createPermission({ ...formData, group: finalGroup }).unwrap();
        toast.success(t('common.created'));
      }
      setIsModalOpen(false);
      setIsAddingNewGroup(false);
      setNewGroupName('');
    } catch (err) {
      toast.error(err.data?.message || 'Error');
    }
  };

  const handleDelete = async () => {
    if (window.confirm(t('admin.permissions.delete_perm_confirm'))) {
      try {
        await deletePermission(selectedPermissionId).unwrap();
        toast.success(t('common.deleted'));
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
        className={`group relative bg-white border p-3 rounded-lg shadow-sm hover:shadow-md smooth-transition flex items-start gap-3 ${isSelected ? 'border-blue-400 ring-1 ring-blue-400 bg-blue-50/10' : 'border-slate-100 hover:border-blue-200'}`}
      >
        <div className="pt-1">
          <input 
            type="checkbox" 
            checked={isSelected} 
            onChange={(e) => {
                e.stopPropagation();
                toggleSelect(perm.id);
            }}
            className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
        </div>
        <div className="cursor-pointer flex-1 min-w-0" onClick={() => handleOpenEditModal(perm)}>
          <h4 className="text-[11px] font-black text-slate-800 truncate mb-0.5 uppercase">
            {formatName(perm.name)}
          </h4>
          <p className="text-[10px] text-slate-400 line-clamp-1 leading-tight">
            {perm.description || (t('auto.no_description'))}
          </p>
        </div>
        <div className="opacity-0 group-hover:opacity-100 smooth-transition pt-0.5">
            <FontAwesomeIcon icon={faEditAlt} className="text-[10px] text-blue-400" />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-10" dir={t('auto.ltr')}>
      <ResourceHeader 
        title={t('admin.permissions.title')} 
        onRefresh={refetch}
        onAdd={handleOpenCreateModal}
      />

      <div className="flex gap-4">
          <div className="flex-1">
            <StatsCard title={t('admin.permissions.total_permissions')} value={permissions?.length || 0} icon={faKey} color="blue" />
          </div>
          <div className="flex-1">
            <StatsCard title={t('admin.permissions.total_groups')} value={Object.keys(groupedPermissions || {}).length} icon={faLayerGroup} color="emerald" />
          </div>
      </div>

      <ResourceFilters 
        onSearch={(val) => { setSearchTerm(val); setCurrentPage(1); }} 
        onViewChange={setViewMode}
        currentView={viewMode}
        onBulkAction={handleBulkAction}
        selectedCount={selectedIds.length}
      />

      {viewMode === 'grid' ? (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2">
          {currentGroups.map(([group, perms]) => (
            <fieldset key={group} className="border border-slate-200 rounded-2xl p-6 bg-white/40">
              <legend className="px-5 py-1.5 bg-slate-800 text-white rounded-full text-xs font-black shadow-lg">
                {group}
              </legend>
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
                  className={`w-full flex items-center justify-between p-4 text-sm font-bold smooth-transition ${isOpen ? 'bg-slate-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'}`}
                >
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faLayerGroup} className="text-xs opacity-50" />
                    <span>{group}</span>
                    <Badge variant="slate" className="text-[10px]">{perms.length}</Badge>
                  </div>
                  <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} className="text-[10px]" />
                </button>
                {isOpen && (
                  <div className="p-4 bg-white border-t border-slate-100">
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
        title={editMode ? (t('admin.permissions.edit_perm')) : (t('admin.permissions.add_new_perm'))}
        footer={
          <div className="w-full flex items-center justify-between">
            <div>
              {editMode && (
                <Button variant="ghost" icon={faTrash} onClick={handleDelete} className="text-red-500 hover:bg-red-50 text-xs">
                  {t('common.delete')}
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)} className="text-xs">{t('common.cancel')}</Button>
              <Button variant="primary" onClick={handleSubmit} disabled={isCreating || isUpdating} className="text-xs">
                {t('common.save')}
              </Button>
            </div>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label={t('admin.permissions.key')} 
            placeholder="e.g. view_users"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          
          <div className="space-y-1">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t('admin.permissions.group')}</label>
              <button 
                type="button" 
                onClick={() => setIsAddingNewGroup(!isAddingNewGroup)}
                className="text-[10px] font-bold text-blue-600 hover:underline"
              >
                {isAddingNewGroup ? (t('admin.permissions.select_from_list')) : (t('admin.permissions.new_group'))}
              </button>
            </div>
            
            {isAddingNewGroup ? (
              <Input 
                placeholder={t('admin.permissions.new_group_name')}
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
             <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t('common.description')}</label>
             <textarea 
               className="block w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 smooth-transition"
               rows="3"
               value={formData.description}
               onChange={(e) => setFormData({ ...formData, description: e.target.value })}
               placeholder={t('admin.permissions.description_placeholder')}
             ></textarea>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PermissionList;
