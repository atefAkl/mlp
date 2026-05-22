import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  useGetRolesQuery, 
  useGetPermissionsQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useBulkDeleteRolesMutation
} from '../features/api/apiSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEdit, faTrash, faUserShield, 
  faUsersGear, faKey, faCheckSquare, faSquare, 
  faChevronDown, faChevronUp
} from '@fortawesome/free-solid-svg-icons';
import Button from '../components/atoms/Button';
import Badge from '../components/atoms/Badge';
import StatsCard from '../components/molecules/StatsCard';
import Pagination from '../components/molecules/Pagination';
import ResourceHeader from '../components/organisms/ResourceHeader';
import ResourceFilters from '../components/organisms/ResourceFilters';
import SelectionBanner from '../components/molecules/SelectionBanner';
import Modal from '../components/organisms/Modal';
import { Input } from '../components/atoms/FormElements';
import { toast } from 'react-toastify';

const RoleList = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  // API Queries
  const { data: roles, isLoading, error, refetch } = useGetRolesQuery();
  const { data: permissions } = useGetPermissionsQuery();
  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();
  const [deleteRole] = useDeleteRoleMutation();
  const [bulkDelete] = useBulkDeleteRolesMutation();

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list'); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeGroupModal, setActiveGroupModal] = useState(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: []
  });

  if (isLoading) return <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-theme-primary"></div></div>;
  if (error) return <div className="text-red-500 p-4">Error loading roles</div>;

  const groupedPermissions = permissions?.reduce((acc, perm) => {
    const group = perm.group || (isRTL ? 'غير مصنف' : 'Uncategorized');
    if (!acc[group]) acc[group] = [];
    acc[group].push(perm);
    return acc;
  }, {});

  const filteredRoles = roles?.filter(role => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRoles?.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleBulkAction = async (action) => {
    if (action === 'delete' && selectedIds.length > 0) {
      if (window.confirm(isRTL ? `حذف ${selectedIds.length} أدوار؟` : `Delete ${selectedIds.length} roles?`)) {
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

  const handleOpenCreateModal = () => {
    setEditMode(false);
    setFormData({ name: '', description: '', permissions: [] });
    setIsModalOpen(true);
    if (groupedPermissions) setActiveGroupModal(Object.keys(groupedPermissions)[0]);
  };

  const handleOpenEditModal = (role) => {
    setEditMode(true);
    setSelectedRoleId(role.id);
    setFormData({
      name: role.name,
      description: role.description || '',
      permissions: role.permissions?.map(p => p.name) || []
    });
    setIsModalOpen(true);
    if (groupedPermissions) setActiveGroupModal(Object.keys(groupedPermissions)[0]);
  };

  const togglePermission = (permName) => {
    setFormData(prev => {
      const isSelected = prev.permissions.includes(permName);
      if (isSelected) {
        return { ...prev, permissions: prev.permissions.filter(p => p !== permName) };
      } else {
        return { ...prev, permissions: [...prev.permissions, permName] };
      }
    });
  };

  const handleSelectAllInGroup = (groupPerms) => {
    setFormData(prev => {
      const permNames = groupPerms.map(p => p.name);
      const newPerms = [...new Set([...prev.permissions, ...permNames])];
      return { ...prev, permissions: newPerms };
    });
  };

  const handleSelectNoneInGroup = (groupPerms) => {
    setFormData(prev => {
      const permNames = groupPerms.map(p => p.name);
      const newPerms = prev.permissions.filter(p => !permNames.includes(p));
      return { ...prev, permissions: newPerms };
    });
  };

  const handleInvertInGroup = (groupPerms) => {
    setFormData(prev => {
      const permNames = groupPerms.map(p => p.name);
      const remainingPerms = prev.permissions.filter(p => !permNames.includes(p));
      const inactiveInGroup = permNames.filter(name => !prev.permissions.includes(name));
      return { ...prev, permissions: [...remainingPerms, ...inactiveInGroup] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await updateRole({ id: selectedRoleId, ...formData }).unwrap();
        toast.success(isRTL ? 'تم التحديث' : 'Updated');
      } else {
        await createRole(formData).unwrap();
        toast.success(isRTL ? 'تمت الإضافة' : 'Created');
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.data?.message || 'Error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(isRTL ? 'حذف هذا الدور؟' : 'Delete this role?')) {
      try {
        await deleteRole(id).unwrap();
        toast.success(isRTL ? 'تم الحذف' : 'Deleted');
      } catch (err) {
        toast.error('Failed');
      }
    }
  };

  return (
    <div className="space-y-6 pb-10" dir={isRTL ? 'rtl' : 'ltr'}>
      <ResourceHeader 
        title={isRTL ? 'إدارة الأدوار' : 'Roles Management'} 
        onRefresh={refetch}
        onAdd={handleOpenCreateModal}
      />

      <div className="flex gap-4">
          <div className="flex-1">
            <StatsCard title={isRTL ? 'إجمالي الأدوار' : 'Total Roles'} value={roles?.length || 0} icon={faUserShield} color="purple" />
          </div>
          <div className="flex-1">
            <StatsCard title={isRTL ? 'إجمالي الصلاحيات' : 'Total Permissions'} value={permissions?.length || 0} icon={faKey} color="blue" />
          </div>
      </div>

      <ResourceFilters 
        onSearch={(val) => { setSearchTerm(val); setCurrentPage(1); setSelectedIds([]); }} 
        onViewChange={setViewMode}
        currentView={viewMode}
        onBulkAction={handleBulkAction}
        selectedCount={selectedIds.length}
        onSelectAll={() => setSelectedIds(currentItems.map(r => r.id))}
        onSelectNone={() => setSelectedIds([])}
        onSelectInvert={() => {
          setSelectedIds(prev => {
            const filteredIds = filteredRoles.map(r => r.id);
            return filteredIds.filter(id => !prev.includes(id));
          });
        }}
      />

      <SelectionBanner
        selectedCount={selectedIds.length}
        currentPageCount={currentItems?.length || 0}
        totalFilteredCount={filteredRoles?.length || 0}
        onSelectAllFiltered={() => setSelectedIds(filteredRoles.map(r => r.id))}
        onClearSelection={() => setSelectedIds([])}
      />

      {viewMode === 'list' ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-2">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-start">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4 w-10">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300 text-theme-primary cursor-pointer" 
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds(prev => {
                            const newIds = [...prev];
                            currentItems.forEach(r => {
                              if (!newIds.includes(r.id)) newIds.push(r.id);
                            });
                            return newIds;
                          });
                        } else {
                          setSelectedIds(prev => prev.filter(id => !currentItems.some(r => r.id === id)));
                        }
                      }}
                      checked={currentItems?.length > 0 && currentItems.every(r => selectedIds.includes(r.id))}
                    />
                  </th>
                  <th className="px-6 py-4 text-start">{isRTL ? 'الدور والوصف' : 'Role & Description'}</th>
                  <th className="px-6 py-4 text-start">{isRTL ? 'الصلاحيات' : 'Permissions'}</th>
                  <th className="px-6 py-4 text-center">{isRTL ? 'العمليات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentItems?.map((role) => (
                  <tr key={role.id} className={`hover:bg-slate-50 smooth-transition ${selectedIds.includes(role.id) ? 'bg-theme-primary-light/40' : ''}`}>
                    <td className="px-6 py-4">
                       <input 
                        type="checkbox" 
                        checked={selectedIds.includes(role.id)}
                        onChange={() => toggleSelect(role.id)}
                        className="rounded border-slate-300 text-theme-primary cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">{role.name}</span>
                        <span className="text-[10px] text-slate-400 line-clamp-1">{role.description}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {role.permissions?.slice(0, 3).map(p => (
                          <Badge key={p.id} variant="success" className="text-[9px] uppercase">{p.name.replace(/_/g, ' ')}</Badge>
                        ))}
                        {role.permissions?.length > 3 && (
                          <Badge variant="slate" className="text-[9px]">+{role.permissions.length - 3}</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <Button variant="ghost" icon={faEdit} onClick={() => handleOpenEditModal(role)} className="p-2 text-theme-primary hover:bg-theme-primary-light" />
                        <Button variant="ghost" icon={faTrash} onClick={() => handleDelete(role.id)} className="p-2 text-red-600 hover:bg-red-50" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-2">
          {currentItems?.map((role) => {
            const isSelected = selectedIds.includes(role.id);
            return (
              <div key={role.id} className={`bg-white border rounded-xl p-5 shadow-sm hover:shadow-md smooth-transition group relative ${isSelected ? 'border-theme-primary ring-1 ring-theme-primary-light bg-theme-primary-light/10' : 'border-slate-200'}`}>
                <div className="absolute top-3 right-3 rtl:left-3 rtl:right-auto">
                   <input 
                    type="checkbox" 
                    checked={isSelected}
                    onChange={() => toggleSelect(role.id)}
                    className="rounded border-slate-300 text-theme-primary cursor-pointer"
                  />
                </div>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-black text-lg border border-purple-100 mb-4">
                  <FontAwesomeIcon icon={faUsersGear} />
                </div>
                <h3 className="font-black text-slate-800 mb-1">{role.name}</h3>
                <p className="text-[10px] text-slate-400 mb-4 line-clamp-2 h-[2.5em]">{role.description || 'No description provided'}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-1.5 text-emerald-600">
                    <FontAwesomeIcon icon={faKey} className="text-[10px]" />
                    <span className="text-[11px] font-black">{role.permissions?.length || 0}</span>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 smooth-transition">
                     <Button variant="ghost" icon={faEdit} onClick={() => handleOpenEditModal(role)} className="p-2 text-theme-primary hover:bg-theme-primary-light rounded-lg" />
                     <Button variant="ghost" icon={faTrash} onClick={() => handleDelete(role.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Integration */}
      <Pagination 
        totalItems={filteredRoles?.length || 0}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      {/* Role Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editMode ? (isRTL ? 'تعديل الدور' : 'Edit Role') : (isRTL ? 'إضافة دور جديد' : 'Add New Role')}
        size="lg"
        footer={
          <div className="flex justify-end gap-2 w-full">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>{isRTL ? 'إلغاء' : 'Cancel'}</Button>
            <Button variant="primary" onClick={handleSubmit} disabled={isCreating || isUpdating}>
              {(isCreating || isUpdating) ? (isRTL ? 'جاري الحفظ...' : 'Saving...') : (isRTL ? 'حفظ البيانات' : 'Save Role')}
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label={isRTL ? 'اسم الدور' : 'Role Name'} 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <Input 
              label={isRTL ? 'الوصف التوضيحي' : 'Description'} 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
          
          <div className="space-y-3">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <FontAwesomeIcon icon={faKey} /> {isRTL ? 'تخصيص الصلاحيات' : 'Assign Permissions'}
            </label>
            
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {groupedPermissions && Object.entries(groupedPermissions).map(([group, perms]) => {
                const isOpen = activeGroupModal === group;
                const selectedCount = perms.filter(p => formData.permissions.includes(p.name)).length;
                
                return (
                  <div key={group} className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <button
                      type="button"
                      onClick={() => setActiveGroupModal(isOpen ? null : group)}
                      className={`w-full flex items-center justify-between p-3.5 text-xs font-bold smooth-transition ${isOpen ? 'bg-slate-50 text-theme-primary' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{group}</span>
                        {selectedCount > 0 && <Badge variant="primary" className="text-[9px]">{selectedCount}</Badge>}
                      </div>
                      <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} className="text-[10px]" />
                    </button>
                    
                    {isOpen && (
                      <div className="p-4 bg-white border-t border-slate-100 space-y-3 animate-in fade-in-50 duration-200">
                        {/* Local Selection Toolbar */}
                        <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100 text-[10px] font-bold text-slate-500">
                          <span className="text-slate-600 font-medium">
                            {isRTL 
                              ? `تم اختيار ${selectedCount} من أصل ${perms.length}` 
                              : `${selectedCount} of ${perms.length} selected`}
                          </span>
                          
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleSelectAllInGroup(perms)}
                              className="px-2 py-1 rounded hover:bg-white hover:shadow-sm text-theme-primary smooth-transition"
                            >
                              {isRTL ? "الكل" : "All"}
                            </button>
                            <span className="text-slate-200">|</span>
                            <button
                              type="button"
                              onClick={() => handleSelectNoneInGroup(perms)}
                              className="px-2 py-1 rounded hover:bg-white hover:shadow-sm text-slate-500 smooth-transition"
                            >
                              {isRTL ? "لا شيء" : "None"}
                            </button>
                            <span className="text-slate-200">|</span>
                            <button
                              type="button"
                              onClick={() => handleInvertInGroup(perms)}
                              className="px-2 py-1 rounded hover:bg-white hover:shadow-sm text-amber-600 smooth-transition"
                            >
                              {isRTL ? "عكس" : "Invert"}
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {perms.map(perm => {
                            const isSelected = formData.permissions.includes(perm.name);
                            return (
                              <button
                                key={perm.id}
                                type="button"
                                onClick={() => togglePermission(perm.name)}
                                className={`group relative flex items-start gap-3 p-3 rounded-xl border smooth-transition text-start ${
                                  isSelected ? 'bg-theme-primary-light border-theme-border-accent ring-1 ring-theme-primary-light/50' : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'
                                }`}
                              >
                                <FontAwesomeIcon 
                                  icon={isSelected ? faCheckSquare : faSquare} 
                                  className={`mt-0.5 text-sm ${isSelected ? 'text-theme-primary' : 'text-slate-300'}`} 
                                  key={perm.id + "-icon"}
                                />
                                <div className="flex flex-col min-w-0">
                                  <span className={`text-[11px] font-black truncate uppercase ${isSelected ? 'text-theme-primary-hover' : 'text-slate-700'}`}>
                                    {perm.name.replace(/_/g, ' ')}
                                  </span>
                                  <span className="text-[9px] text-slate-400 line-clamp-1">
                                    {perm.description || 'No description'}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RoleList;
