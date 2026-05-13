import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetRolesQuery } from '../features/api/apiSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faUserShield, faShieldHalved, faUsersGear, faKey } from '@fortawesome/free-solid-svg-icons';
import Button from '../components/atoms/Button';
import Badge from '../components/atoms/Badge';
import StatsCard from '../components/molecules/StatsCard';
import ResourceHeader from '../components/organisms/ResourceHeader';
import ResourceFilters from '../components/organisms/ResourceFilters';

const RoleList = () => {
  const { t, i18n } = useTranslation();
  const { data: roles, isLoading, error, refetch } = useGetRolesQuery();
  const isRTL = i18n.language === 'ar';
  const [searchTerm, setSearchTerm] = useState('');

  if (isLoading) return <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;
  if (error) return <div className="text-red-500 p-4">Error loading roles</div>;

  const filteredRoles = roles?.filter(role => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const breadcrumbs = [
    { label: isRTL ? 'الإعدادات' : 'Settings' },
    { label: isRTL ? 'الأدوار' : 'Roles' }
  ];

  return (
    <div className="space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <ResourceHeader 
        title={isRTL ? 'إدارة الأدوار' : 'Roles Management'} 
        breadcrumbs={breadcrumbs} 
        onRefresh={refetch}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <StatsCard title={isRTL ? 'إجمالي الأدوار' : 'Total Roles'} value={roles?.length || 0} icon={faUserShield} color="purple" />
        <StatsCard title={isRTL ? 'أدوار النظام' : 'System Roles'} value="1" icon={faShieldHalved} color="blue" />
        <StatsCard title={isRTL ? 'صلاحيات مربوطة' : 'Linked Permissions'} value="15" icon={faKey} color="emerald" />
      </div>

      <ResourceFilters onSearch={setSearchTerm} />

      <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-start">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="px-4 py-2 text-start w-10">
                  <input type="checkbox" className="rounded border-slate-300" />
                </th>
                <th className="px-4 py-2 text-start">ID</th>
                <th className="px-4 py-2 text-start">{isRTL ? 'اسم الدور' : 'Role Name'}</th>
                <th className="px-4 py-2 text-start">{isRTL ? 'الحارس' : 'Guard'}</th>
                <th className="px-4 py-2 text-start">{isRTL ? 'تاريخ الإنشاء' : 'Created At'}</th>
                <th className="px-4 py-2 text-center">{isRTL ? 'العمليات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRoles?.map((role) => (
                <tr key={role.id} className="hover:bg-slate-50 smooth-transition">
                  <td className="px-4 py-2">
                    <input type="checkbox" className="rounded border-slate-300" />
                  </td>
                  <td className="px-4 py-2 text-slate-500 text-xs">#{role.id}</td>
                  <td className="px-4 py-2 font-medium text-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-100">
                        <FontAwesomeIcon icon={faUsersGear} className="text-xs" />
                      </div>
                      {role.name}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-slate-600">
                    <Badge variant="slate">{role.guard_name}</Badge>
                  </td>
                  <td className="px-4 py-2 text-slate-500 text-xs">
                    {new Date(role.created_at).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex justify-center gap-1">
                      <Button variant="ghost" icon={faEdit} className="p-1.5 text-blue-600 hover:bg-blue-50" tooltip="Edit" />
                      <Button variant="ghost" icon={faTrash} className="p-1.5 text-red-600 hover:bg-red-50" tooltip="Delete" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RoleList;
