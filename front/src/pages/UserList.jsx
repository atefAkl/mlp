import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  useGetUsersQuery, 
  useGetRolesQuery, 
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useToggleUserStatusMutation
} from '../features/api/apiSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEdit, faTrash, faUser, faUsers, faUserShield, 
  faUserCheck, faUserClock, faEnvelope, faLock, faToggleOn, faToggleOff 
} from '@fortawesome/free-solid-svg-icons';
import Button from '../components/atoms/Button';
import Badge from '../components/atoms/Badge';
import StatsCard from '../components/molecules/StatsCard';
import ResourceHeader from '../components/organisms/ResourceHeader';
import ResourceFilters from '../components/organisms/ResourceFilters';
import Modal from '../components/organisms/Modal';
import { Input, Select } from '../components/atoms/FormElements';
import { toast } from 'react-toastify';

const UserList = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  // API Hooks
  const { data: users, isLoading, error, refetch } = useGetUsersQuery();
  const { data: roles } = useGetRolesQuery();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [toggleStatus] = useToggleUserStatusMutation();

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: ''
  });

  if (isLoading) return <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;
  if (error) return <div className="text-red-500 p-4">Error loading users</div>;

  const filteredUsers = users?.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenCreateModal = () => {
    setEditMode(false);
    setFormData({ name: '', email: '', password: '', role: '' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setEditMode(true);
    setSelectedUserId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // Keep empty for security
      role: user.roles?.[0]?.name || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await updateUser({ id: selectedUserId, ...formData }).unwrap();
        toast.success(isRTL ? 'تم تحديث البيانات' : 'User updated successfully');
      } else {
        await createUser(formData).unwrap();
        toast.success(isRTL ? 'تم إضافة المستخدم' : 'User created successfully');
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(isRTL ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id).unwrap();
        toast.success(isRTL ? 'تم الحذف' : 'User deleted');
      } catch (err) {
        toast.error('Delete failed');
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleStatus(id).unwrap();
      toast.info(isRTL ? 'تم تغيير الحالة' : 'Status changed');
    } catch (err) {
      toast.error('Failed to change status');
    }
  };

  const roleOptions = roles?.map(r => ({ value: r.name, label: r.name })) || [];

  return (
    <div className="space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <ResourceHeader 
        title={t('common.users')} 
        breadcrumbs={[{ label: t('common.users') }]} 
        onRefresh={refetch}
        onAdd={handleOpenCreateModal}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatsCard title={isRTL ? 'إجمالي المستخدمين' : 'Total Users'} value={users?.length || 0} icon={faUsers} color="blue" />
        <StatsCard title={isRTL ? 'نشط الآن' : 'Active'} value={users?.filter(u => u.is_active).length} icon={faUserCheck} color="emerald" />
        <StatsCard title={isRTL ? 'غير نشط' : 'Inactive'} value={users?.filter(u => !u.is_active).length} icon={faUserClock} color="amber" />
        <StatsCard title={isRTL ? 'مدراء' : 'Admins'} value={users?.filter(u => u.roles?.some(r => r.name === 'مدير التطبيق')).length} icon={faUserShield} color="purple" />
      </div>

      <ResourceFilters onSearch={setSearchTerm} />

      <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-start">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="px-4 py-2 text-start">ID</th>
                <th className="px-4 py-2 text-start">{isRTL ? 'المستخدم' : 'User'}</th>
                <th className="px-4 py-2 text-start">{isRTL ? 'الحالة' : 'Status'}</th>
                <th className="px-4 py-2 text-start">{isRTL ? 'الأدوار' : 'Roles'}</th>
                <th className="px-4 py-2 text-center">{isRTL ? 'العمليات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers?.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 smooth-transition">
                  <td className="px-4 py-2 text-slate-500 text-xs">#{user.id}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                        <FontAwesomeIcon icon={faUser} className="text-xs" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{user.name}</span>
                        <span className="text-[10px] text-slate-400">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <button 
                      onClick={() => handleToggleStatus(user.id)}
                      className={`flex items-center gap-2 text-lg ${user.is_active ? 'text-emerald-500' : 'text-slate-300'} hover:opacity-80 transition-all`}
                    >
                      <FontAwesomeIcon icon={user.is_active ? faToggleOn : faToggleOff} />
                      <span className="text-[10px] font-bold uppercase">{user.is_active ? (isRTL ? 'نشط' : 'Active') : (isRTL ? 'معطل' : 'Disabled')}</span>
                    </button>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex flex-wrap gap-1">
                      {user.roles?.map(role => (
                        <Badge key={role.id} variant="primary">{role.name}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex justify-center gap-1">
                      <Button variant="ghost" icon={faEdit} onClick={() => handleOpenEditModal(user)} className="p-1.5 text-blue-600 hover:bg-blue-50" />
                      <Button variant="ghost" icon={faTrash} onClick={() => handleDelete(user.id)} className="p-1.5 text-red-600 hover:bg-red-50" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editMode ? (isRTL ? 'تعديل بيانات المستخدم' : 'Edit User Data') : (isRTL ? 'إضافة مستخدم جديد' : 'Add New User')}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              {isRTL ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button variant="primary" onClick={handleSubmit} disabled={isCreating || isUpdating}>
              {(isCreating || isUpdating) ? (isRTL ? 'جاري الحفظ...' : 'Saving...') : (isRTL ? 'حفظ التغييرات' : 'Save Changes')}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label={isRTL ? 'الاسم بالكامل' : 'Full Name'} 
            icon={faUser} 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <Input 
            label={isRTL ? 'البريد الإلكتروني' : 'Email Address'} 
            icon={faEnvelope} 
            type="email" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <Input 
            label={isRTL ? 'كلمة المرور' : 'Password'} 
            icon={faLock} 
            type="password" 
            placeholder={editMode ? (isRTL ? 'اتركها فارغة لعدم التغيير' : 'Leave blank to keep current') : '••••••••'}
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required={!editMode}
          />
          <Select 
            label={isRTL ? 'الدور الوظيفي' : 'Role'} 
            icon={faUserShield}
            options={[{ value: '', label: isRTL ? 'اختر الدور...' : 'Select Role...' }, ...roleOptions]}
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
