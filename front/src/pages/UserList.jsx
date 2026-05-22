import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { 
  useGetUsersQuery, 
  useCreateUserMutation, 
  useUpdateUserMutation, 
  useDeleteUserMutation, 
  useToggleUserStatusMutation,
  useBulkDeleteUsersMutation,
  useGetRolesQuery 
} from '../features/api/apiSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faUserCheck, faUserTimes, faUsers, faUserShield, faEnvelope, faCircle } from '@fortawesome/free-solid-svg-icons';
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

const UserList = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const currentUser = useSelector((state) => state.auth.user);
  
  // API Queries
  const { data: users, isLoading, error, refetch } = useGetUsersQuery();
  const { data: roles } = useGetRolesQuery();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [toggleStatus] = useToggleUserStatusMutation();
  const [bulkDelete] = useBulkDeleteUsersMutation();

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list'); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'متدرب'
  });

  if (isLoading) return <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-theme-primary"></div></div>;
  if (error) {
    console.error('Error loading users:', error);
    return (
      <div className="text-red-500 p-4 bg-red-50 rounded-xl border border-red-200 m-6 font-semibold text-center" dir={isRTL ? 'rtl' : 'ltr'}>
        {isRTL ? 'حدث خطأ أثناء تحميل المستخدمين:' : 'Error loading users:'} {error.status || ''} - {error.data?.message || error.error || JSON.stringify(error)}
      </div>
    );
  }

  const filteredUsers = users?.filter(user => 
    user.id !== currentUser?.id &&
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers?.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleBulkAction = async (action) => {
    if (action === 'delete' && selectedIds.length > 0) {
      if (window.confirm(isRTL ? `حذف ${selectedIds.length} مستخدمين؟` : `Delete ${selectedIds.length} users?`)) {
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
    setFormData({ name: '', email: '', password: '', role: 'متدرب' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setEditMode(true);
    setSelectedUserId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      password: '', 
      role: user.roles?.[0]?.name || 'متدرب'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await updateUser({ id: selectedUserId, ...formData }).unwrap();
        toast.success(isRTL ? 'تم التحديث' : 'Updated');
      } else {
        await createUser(formData).unwrap();
        toast.success(isRTL ? 'تمت الإضافة' : 'Created');
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.data?.message || 'Error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(isRTL ? 'هل أنت متأكد؟' : 'Are you sure?')) {
      try {
        await deleteUser(id).unwrap();
        toast.success(isRTL ? 'تم الحذف' : 'Deleted');
      } catch (err) {
        toast.error('Failed');
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleStatus(id).unwrap();
      toast.success(isRTL ? 'تم تغيير الحالة' : 'Status updated');
    } catch (err) {
      toast.error('Failed');
    }
  };

  const roleOptions = roles?.map(r => ({ value: r.name, label: r.name })) || [];

  return (
    <div className="space-y-6 pb-10" dir={isRTL ? 'rtl' : 'ltr'}>
      <ResourceHeader 
        title={isRTL ? 'إدارة المستخدمين' : 'Users Management'} 
        description={isRTL ? 'إدارة حسابات مستخدمي النظام وتخصيص الأدوار وتفعيل أو تعطيل الحسابات.' : 'Manage user accounts, roles assignment, and account activation status.'}
        onRefresh={refetch}
        onAdd={handleOpenCreateModal}
      />

      <div className="flex gap-4">
        <div className="flex-1">
          <StatsCard title={isRTL ? 'إجمالي المستخدمين' : 'Total Users'} value={users?.length || 0} icon={faUsers} color="blue" />
        </div>
        <div className="flex-1">
          <StatsCard title={isRTL ? 'مستخدمين نشطين' : 'Active Users'} value={users?.filter(u => u.is_active).length || 0} icon={faUserCheck} color="emerald" />
        </div>
        <div className="flex-1">
          <StatsCard title={isRTL ? 'حسابات معطلة' : 'Disabled'} value={users?.filter(u => !u.is_active).length || 0} icon={faUserTimes} color="amber" />
        </div>
      </div>

      <ResourceFilters 
        onSearch={(val) => { setSearchTerm(val); setCurrentPage(1); setSelectedIds([]); }} 
        onViewChange={setViewMode}
        currentView={viewMode}
        onBulkAction={handleBulkAction}
        selectedCount={selectedIds.length}
        onSelectAll={() => setSelectedIds(currentItems.map(u => u.id))}
        onSelectNone={() => setSelectedIds([])}
        onSelectInvert={() => {
          setSelectedIds(prev => {
            const filteredIds = filteredUsers.map(u => u.id);
            return filteredIds.filter(id => !prev.includes(id));
          });
        }}
      />

      <SelectionBanner 
        selectedCount={selectedIds.length}
        currentPageCount={currentItems?.length || 0}
        totalFilteredCount={filteredUsers?.length || 0}
        onSelectAllFiltered={() => setSelectedIds(filteredUsers.map(u => u.id))}
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
                            currentItems.forEach(u => {
                              if (!newIds.includes(u.id)) newIds.push(u.id);
                            });
                            return newIds;
                          });
                        } else {
                          setSelectedIds(prev => prev.filter(id => !currentItems.some(u => u.id === id)));
                        }
                      }}
                      checked={currentItems?.length > 0 && currentItems.every(u => selectedIds.includes(u.id))}
                    />
                  </th>
                  <th className="px-6 py-4 text-start">{isRTL ? 'المستخدم' : 'User'}</th>
                  <th className="px-6 py-4 text-start">{isRTL ? 'الدور' : 'Role'}</th>
                  <th className="px-6 py-4 text-center">{isRTL ? 'الحالة' : 'Status'}</th>
                  <th className="px-6 py-4 text-center">{isRTL ? 'العمليات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentItems?.map((user) => (
                  <tr key={user.id} className={`hover:bg-slate-50 smooth-transition ${selectedIds.includes(user.id) ? 'bg-theme-primary-light/40' : ''}`}>
                    <td className="px-6 py-4">
                       <input 
                        type="checkbox" 
                        checked={selectedIds.includes(user.id)}
                        onChange={() => toggleSelect(user.id)}
                        className="rounded border-slate-300 text-theme-primary cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold border border-slate-200">
                          {user.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">{user.name}</span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <FontAwesomeIcon icon={faEnvelope} className="text-[10px]" />
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {user.roles?.map(role => (
                          <Badge key={role.id} variant="primary" className="text-[9px]">{role.name}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => handleToggleStatus(user.id)} className="focus:outline-none">
                        <Badge variant={user.is_active ? 'success' : 'danger'}>
                          <FontAwesomeIcon icon={faCircle} className="text-[6px] me-1.5" />
                          {user.is_active ? (isRTL ? 'نشط' : 'Active') : (isRTL ? 'معطل' : 'Disabled')}
                        </Badge>
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <Button variant="ghost" icon={faEdit} onClick={() => handleOpenEditModal(user)} className="p-2 text-theme-primary hover:bg-theme-primary-light" tooltip={isRTL ? 'تعديل' : 'Edit'} />
                        <Button variant="ghost" icon={faTrash} onClick={() => handleDelete(user.id)} className="p-2 text-red-600 hover:bg-red-50" tooltip={isRTL ? 'حذف' : 'Delete'} />
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
          {currentItems?.map((user) => {
            const isSelected = selectedIds.includes(user.id);
            return (
              <div key={user.id} className={`bg-white border rounded-xl p-5 shadow-sm hover:shadow-md smooth-transition group relative ${isSelected ? 'border-theme-primary ring-1 ring-theme-primary-light bg-theme-primary-light/10' : 'border-slate-200'}`}>
                <div className="absolute top-3 right-3 rtl:left-3 rtl:right-auto">
                   <input 
                    type="checkbox" 
                    checked={isSelected}
                    onChange={() => toggleSelect(user.id)}
                    className="rounded border-slate-300 text-theme-primary cursor-pointer"
                  />
                </div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-theme-primary-light text-theme-primary flex items-center justify-center font-black text-lg border border-theme-primary-light/50">
                    {user.name.charAt(0)}
                  </div>
                </div>
                <h3 className="font-black text-slate-800 mb-1">{user.name}</h3>
                <p className="text-[10px] text-slate-400 mb-4 truncate">{user.email}</p>
                
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faUserShield} className="text-slate-300 text-xs" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                       {user.roles?.[0]?.name || 'No Role'}
                    </span>
                  </div>
                  <button onClick={() => handleToggleStatus(user.id)}>
                     <Badge variant={user.is_active ? 'success' : 'danger'} className="text-[8px]">
                      {user.is_active ? (isRTL ? 'نشط' : 'Active') : (isRTL ? 'معطل' : 'Disabled')}
                    </Badge>
                  </button>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-50 flex justify-end gap-2 opacity-0 group-hover:opacity-100 smooth-transition">
                   <Button variant="ghost" icon={faEdit} onClick={() => handleOpenEditModal(user)} className="p-2 text-theme-primary hover:bg-theme-primary-light rounded-lg" tooltip={isRTL ? 'تعديل' : 'Edit'} />
                   <Button variant="ghost" icon={faTrash} onClick={() => handleDelete(user.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" tooltip={isRTL ? 'حذف' : 'Delete'} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Integration */}
      <Pagination 
        totalItems={filteredUsers?.length || 0}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      {/* User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editMode ? (isRTL ? 'تعديل بيانات المستخدم' : 'Edit User') : (isRTL ? 'إضافة مستخدم جديد' : 'Add New User')}
        footer={
          <div className="flex gap-2 justify-end w-full">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>{isRTL ? 'إلغاء' : 'Cancel'}</Button>
            <Button variant="primary" onClick={handleSubmit} disabled={isCreating || isUpdating}>
              {(isCreating || isUpdating) ? (isRTL ? 'جاري الحفظ...' : 'Saving...') : (isRTL ? 'حفظ البيانات' : 'Save User')}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label={isRTL ? 'الاسم الكامل' : 'Full Name'} 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <Input 
            label={isRTL ? 'البريد الإلكتروني' : 'Email'} 
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <Input 
            label={isRTL ? 'كلمة المرور' : 'Password'} 
            type="password"
            placeholder={editMode ? (isRTL ? 'اتركه فارغاً لعدم التغيير' : 'Leave blank to keep current') : ''}
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required={!editMode}
          />
          <Select 
            label={isRTL ? 'دور المستخدم' : 'User Role'} 
            options={roleOptions}
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
            required
          />
        </form>
      </Modal>
    </div>
  );
};

export default UserList;
