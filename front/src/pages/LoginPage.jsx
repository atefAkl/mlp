import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import Button from '../components/atoms/Button';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/auth/authSlice';
import { useLoginMutation } from '../features/api/apiSlice';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('admin@quest.com');
  const [password, setPassword] = useState('');
  const isRTL = i18n.language === 'ar';

  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userData = await login({ email, password }).unwrap();
      dispatch(setCredentials({ 
        user: userData.user, 
        token: userData.token 
      }));
      toast.success(isRTL ? 'تم تسجيل الدخول بنجاح' : 'Logged in successfully');
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to login:', err);
      const errorMessage = err.data?.message || (isRTL ? 'بيانات الاعتماد غير صحيحة' : 'Invalid credentials');
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-theme-bg-page p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden border border-slate-200">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-theme-primary mb-2">STITCH</h1>
            <p className="text-slate-500">{t('common.login')}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {isRTL ? 'البريد الإلكتروني' : 'Email Address'}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pr-3 flex items-center text-slate-400">
                  <FontAwesomeIcon icon={faEnvelope} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 rtl:pr-10 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary focus:border-transparent smooth-transition"
                  placeholder="admin@quest.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {isRTL ? 'كلمة المرور' : 'Password'}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pr-3 flex items-center text-slate-400">
                  <FontAwesomeIcon icon={faLock} />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 rtl:pr-10 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary focus:border-transparent smooth-transition"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-2.5 text-lg"
              icon={faRightToBracket}
              disabled={isLoading}
            >
              {isLoading ? (isRTL ? 'جاري التحميل...' : 'Loading...') : t('common.login')}
            </Button>
          </form>
        </div>
        
        <div className="bg-slate-50 px-8 py-4 border-t border-slate-200 text-center">
          <p className="text-sm text-slate-500">
            {isRTL ? 'نسيت كلمة المرور؟' : 'Forgot your password?'} 
            <a href="#" className="text-theme-primary font-semibold hover:underline ml-1 rtl:mr-1">
              {isRTL ? 'استعادة' : 'Reset'}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
