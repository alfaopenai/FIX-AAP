import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SwitchRTL } from '@/components/ui/switch-rtl';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { User, UserCheck, Mail, Lock, Eye, EyeOff } from 'lucide-react';

// Icons for social login
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const AppleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

export default function Auth() {
  const [userType, setUserType] = useState('client');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { login, demoUsers } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // נקה שגיאה עבור השדה הזה
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'נדרש כתובת אימייל';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'כתובת אימייל לא תקינה';
    }
    
    if (!formData.password) {
      newErrors.password = 'נדרשת סיסמה';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const result = await login(formData.email, formData.password, userType);
      
      if (result.success) {
        // תמיד פותח את דף הבית לאחר התחברות
        navigate(createPageUrl('HomePage'));
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: 'שגיאה לא צפויה' });
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoData = () => {
    const demoUser = userType === 'client' ? demoUsers.client : demoUsers.serviceProvider;
    setFormData({
      email: demoUser.email,
      password: demoUser.password
    });
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // כאן יהיה הקוד להתחברות דרך Google
      // כרגע נשתמש בנתוני דמו
      const demoUser = userType === 'client' ? demoUsers.client : demoUsers.serviceProvider;
      const result = await login(demoUser.email, demoUser.password, userType);
      
      if (result.success) {
        navigate(createPageUrl('HomePage'));
      }
    } catch (error) {
      setErrors({ general: 'שגיאה בהתחברות דרך Google' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setIsLoading(true);
    try {
      // כאן יהיה הקוד להתחברות דרך Apple
      // כרגע נשתמש בנתוני דמו
      const demoUser = userType === 'client' ? demoUsers.client : demoUsers.serviceProvider;
      const result = await login(demoUser.email, demoUser.password, userType);
      
      if (result.success) {
        navigate(createPageUrl('HomePage'));
      }
    } catch (error) {
      setErrors({ general: 'שגיאה בהתחברות דרך Apple' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-foreground flex items-center justify-center p-6" dir="rtl">
      <div className="w-full max-w-md relative z-10">
        <div className="bg-blue-950 rounded-3xl shadow-2xl overflow-hidden border border-blue-900">
          {/* Blob header */}
          <div className="relative h-40 bg-gradient-to-br from-blue-800 to-indigo-800">
            <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 600 160" className="absolute inset-0 opacity-90">
              <path d="M0,0 L600,0 L600,60 C520,110 420,130 320,100 C230,70 160,120 60,150 L0,160 Z" fill="url(#g1)" opacity="0.9" />
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute top-6 left-1/2 -translate-x-1/2 transform text-center select-none">
              <h1 className="text-5xl font-extrabold text-white drop-shadow">Fix.Ai</h1>
              <div className="mt-2 flex items-center justify-center gap-3">
                <span className="inline-block h-[2px] w-10 bg-cyan-200/70 rounded-full" />
                <p className="text-cyan-100/90 font-semibold tracking-wide whitespace-nowrap">טכנולוגיה עם מגע ידני</p>
                <span className="inline-block h-[2px] w-10 bg-cyan-200/70 rounded-full" />
              </div>
            </div>
          </div>

          <div className="p-6">
            <CardHeader className="text-center space-y-4">
            
            {/* כפתורי בחירת סוג משתמש */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={userType === 'client' ? 'default' : 'outline'}
                  onClick={() => setUserType('client')}
                  className={`flex-1 py-4 px-6 rounded-2xl transition-all duration-500 transform hover:scale-105 ${
                    userType === 'client' 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/25' 
                      : 'bg-gray-900 text-white border border-gray-900 hover:bg-black'
                  }`}
                >
                  <div className="flex items-center justify-center gap-3">
                    <User className="w-5 h-5" />
                    <span className="font-semibold text-lg">לקוח</span>
                  </div>
                </Button>
                
                <Button
                  type="button"
                  variant={userType === 'service_provider' ? 'default' : 'outline'}
                  onClick={() => setUserType('service_provider')}
                  className={`flex-1 py-4 px-6 rounded-2xl transition-all duration-500 transform hover:scale-105 ${
                    userType === 'service_provider' 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/25' 
                      : 'bg-gray-900 text-white border border-gray-900 hover:bg-black'
                  }`}
                >
                  <div className="flex items-center justify-center gap-3">
                    <UserCheck className="w-5 h-5" />
                    <span className="font-semibold text-lg">נותן שירות</span>
                  </div>
                </Button>
              </div>
            </div>
            </CardHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
            {/* כתובת אימייל */}
            <div className="space-y-3">
              <Label htmlFor="email" className="text-white font-semibold text-lg">כתובת אימייל</Label>
              <div className="relative">
                <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-gray-800 border-gray-600 text-white pl-4 pr-12 py-4 rounded-2xl focus:border-cyan-500 focus:bg-gray-700 transition-all duration-300"
                  dir="ltr"
                />
              </div>
              {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
            </div>

            {/* סיסמה */}
            <div className="space-y-3">
              <Label htmlFor="password" className="text-white font-semibold text-lg">סיסמה</Label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="bg-gray-800 border-gray-600 text-white pl-12 pr-12 py-4 rounded-2xl focus:border-cyan-500 focus:bg-gray-700 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400 hover:text-white transition-colors duration-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
            </div>



              {errors.general && (
                <div className="bg-red-900/20 border border-red-700 rounded-2xl p-4">
                  <p className="text-red-400 text-sm font-medium">{errors.general}</p>
                </div>
              )}

              {/* כפתור שליחה */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-4 rounded-2xl transition-all duration-500 transform hover:scale-105 shadow-lg shadow-cyan-500/25"
              >
                {isLoading ? 'מתחבר...' : 'התחבר'}
              </Button>

              {/* מפריד */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-4 py-1 text-muted-foreground font-medium rounded-full border border-border">או</span>
                </div>
              </div>

              {/* כפתורי התחברות חברתית */}
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-10">
                  <div className="flex flex-col items-center gap-3 group">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGoogleLogin}
                      disabled={isLoading}
                      className="w-20 h-20 rounded-full border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white hover:border-blue-600 transition-all duration-500 hover:scale-110 shadow-lg hover:shadow-blue-500/25"
                      title="התחבר עם Google"
                    >
                      <GoogleIcon />
                    </Button>
                    <span className="text-sm text-blue-400 group-hover:text-blue-300 transition-colors duration-300 font-medium">Google</span>
                  </div>

                  <div className="flex flex-col items-center gap-3 group">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAppleLogin}
                      disabled={isLoading}
                      className="w-20 h-20 rounded-full border-gray-500 text-gray-400 hover:bg-gray-500 hover:text-white hover:border-gray-600 transition-all duration-500 hover:scale-110 shadow-lg hover:shadow-gray-500/25"
                      title="התחבר עם Apple"
                    >
                      <AppleIcon />
                    </Button>
                    <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300 font-medium">Apple</span>
                  </div>
                </div>
              </div>

              {/* כפתור נתונים לדוגמה */}
              <Button
                type="button"
                variant="outline"
                onClick={fillDemoData}
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-gray-500 py-4 rounded-2xl transition-all duration-300"
              >
                מלא נתונים לדוגמה ({userType === 'client' ? 'לקוח' : 'נותן שירות'})
              </Button>

              {/* מעבר להרשמה */}
              <div className="text-center pt-6">
                <button
                  type="button"
                  onClick={() => navigate('/Registration')}
                  className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors duration-300"
                >
                  אין לך חשבון? הירשם כאן
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 