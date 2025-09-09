import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// Removed Card components to align design with Auth screen
import { SwitchRTL } from '@/components/ui/switch-rtl';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { User, UserCheck, Mail, Lock, Eye, EyeOff, ArrowRight, MapPin, Phone, Wrench, Clock, DollarSign, Camera } from 'lucide-react';

export default function Registration() {
  const [userType, setUserType] = useState('client');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    // שדות לקוח
    fullName: '',
    address: '',
    // משותפים
    email: '',
    password: '',
    // שדות נותן שירות
    firstName: '',
    lastName: '',
    phone: '',
    profession: '',
    experienceYears: '',
    hourlyRate: '',
    serviceAreas: '',
    responseTime: '',
    bio: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
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
    
    if (userType === 'service_provider') {
      if (!formData.firstName.trim()) newErrors.firstName = 'נדרש שם פרטי';
      if (!formData.lastName.trim()) newErrors.lastName = 'נדרש שם משפחה';
    } else {
      if (!formData.fullName.trim()) newErrors.fullName = 'נדרש שם מלא';
    }
    
    if (!formData.email) {
      newErrors.email = 'נדרש כתובת אימייל';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'כתובת אימייל לא תקינה';
    }
    
    if (!formData.password) {
      newErrors.password = 'נדרשת סיסמה';
    } else if (formData.password.length < 6) {
      newErrors.password = 'סיסמה חייבת להכיל לפחות 6 תווים';
    }
    
    if (userType !== 'service_provider') {
      if (!formData.address.trim()) newErrors.address = 'נדרש כתובת מלאה';
    }
    
    if (userType === 'service_provider') {
      if (!formData.phone.trim() || formData.phone.replace(/\D/g, '').length < 9) newErrors.phone = 'מספר טלפון לא תקין';
      if (!formData.profession.trim()) newErrors.profession = 'נדרש להזין מקצוע';
      // שדות רשות: נבדקים רק אם מולאו
      if (formData.experienceYears !== '' && (isNaN(Number(formData.experienceYears)) || Number(formData.experienceYears) < 0 || Number(formData.experienceYears) > 60)) newErrors.experienceYears = 'שנות ותק 0–60';
      if (formData.hourlyRate !== '' && (isNaN(Number(formData.hourlyRate)) || Number(formData.hourlyRate) <= 0)) newErrors.hourlyRate = 'תעריף לשעה חייב להיות מספר חיובי';
      // אזורי שירות וזמן תגובה — רשות
      if (formData.serviceAreas && !formData.serviceAreas.trim()) newErrors.serviceAreas = 'נא למלא או להשאיר ריק';
      // responseTime לא נדרש, אין בדיקה
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const name = userType === 'service_provider'
        ? `${formData.firstName} ${formData.lastName}`.trim()
        : formData.fullName;

      const userData = {
        name,
        email: formData.email,
        address: userType === 'service_provider' ? null : formData.address,
        phone: userType === 'service_provider' ? formData.phone : null,
        profession: userType === 'service_provider' ? formData.profession : null,
        experienceYears: userType === 'service_provider' ? (formData.experienceYears !== '' ? Number(formData.experienceYears) : null) : null,
        hourlyRate: userType === 'service_provider' ? (formData.hourlyRate !== '' ? Number(formData.hourlyRate) : null) : null,
        serviceAreas: userType === 'service_provider' ? formData.serviceAreas : null,
        responseTime: userType === 'service_provider' ? formData.responseTime : null,
        bio: userType === 'service_provider' ? formData.bio : null,
      };
      
      const result = await register(userData, userType);
      
      if (result.success) {
        // ניתוב לפי סוג המשתמש
        if (userType === 'client') {
          navigate(createPageUrl('Marketplace'));
        } else {
          navigate(createPageUrl('ServiceProviderDashboard'));
        }
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: 'שגיאה לא צפויה' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-foreground flex items-center justify-center p-6" dir="rtl">
      <div className="w-full max-w-lg relative z-10">
        <div className="bg-blue-950 rounded-3xl shadow-2xl overflow-hidden border border-blue-900">
          {/* Blob header to match Auth */}
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
            {/* מתג לבחירת סוג משתמש */}
            <div className="bg-gray-900 rounded-xl p-4 space-y-3 border border-gray-900 shadow-md text-white">
              <Label className="text-white font-medium text-center block">סוג המשתמש</Label>
              <div className="flex items-center justify-between gap-3">
                <div 
                  className={`flex items-center space-x-2 space-x-reverse cursor-pointer p-3 rounded-lg transition-all flex-1 justify-center ${
                    userType === 'client' 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25' 
                      : 'bg-gray-900 text-white border border-gray-900 hover:bg-black'
                  }`}
                  onClick={() => setUserType('client')}
                >
                  <User className="w-4 h-4" />
                  <span className="font-medium">לקוח</span>
                </div>
                
                <div className="flex items-center justify-center p-2">
                  <SwitchRTL
                    checked={userType === 'service_provider'}
                    onCheckedChange={(checked) => setUserType(checked ? 'service_provider' : 'client')}
                    className="data-[state=checked]:bg-cyan-500 data-[state=unchecked]:bg-gray-600 scale-110"
                  />
                </div>
                
                <div 
                  className={`flex items-center space-x-2 space-x-reverse cursor-pointer p-3 rounded-lg transition-all flex-1 justify-center ${
                    userType === 'service_provider' 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25' 
                      : 'bg-gray-900 text-white border border-gray-900 hover:bg-black'
                  }`}
                  onClick={() => setUserType('service_provider')}
                >
                  <UserCheck className="w-4 h-4" />
                  <span className="font-medium">נותן שירות</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              {/* הערת מידע כללית */}
              <div className="rounded-xl border border-blue-900/60 bg-blue-900/30 text-blue-100 p-3 text-sm">
                ניתן לעדכן את הפרטים מאוחר יותר במסך הפרופיל.
              </div>
              {/* שם מלא (לקוח) או שם פרטי/משפחה (נותן שירות) */}
              {userType === 'service_provider' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-white">שם פרטי <span className="text-red-400">*</span></Label>
                    <div className="relative">
                      <User className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="ישראל"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="bg-gray-800 border-gray-600 text-white pl-3 pr-10 focus:border-cyan-500"
                      />
                    </div>
                    {errors.firstName && <p className="text-red-400 text-sm">{errors.firstName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-white">שם משפחה <span className="text-red-400">*</span></Label>
                    <div className="relative">
                      <User className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="כהן"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="bg-gray-800 border-gray-600 text-white pl-3 pr-10 focus:border-cyan-500"
                      />
                    </div>
                    {errors.lastName && <p className="text-red-400 text-sm">{errors.lastName}</p>}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-white">שם מלא <span className="text-red-400">*</span></Label>
                  <div className="relative">
                    <User className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="השם המלא שלך"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="bg-gray-800 border-gray-600 text-white pl-3 pr-10 focus:border-cyan-500"
                    />
                  </div>
                  {errors.fullName && <p className="text-red-400 text-sm">{errors.fullName}</p>}
                </div>
              )}

              {/* כתובת אימייל */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">כתובת אימייל <span className="text-red-400">*</span></Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-gray-800 border-gray-600 text-white pl-3 pr-10 focus:border-cyan-500"
                    dir="ltr"
                  />
                </div>
                {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
              </div>

              {/* סיסמה */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">סיסמה <span className="text-red-400">*</span></Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="לפחות 6 תווים"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="bg-gray-800 border-gray-600 text-white pl-10 pr-10 focus:border-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-3 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
              </div>

              {/* הוסרו שדות גיל ומין לפי בקשה */}

              {/* כתובת מגורים ללקוח בלבד */}
              {userType !== 'service_provider' && (
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-white">כתובת מגורים <span className="text-red-400">*</span></Label>
                  <div className="relative">
                    <MapPin className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                    <Textarea
                      id="address"
                      name="address"
                      placeholder="רחוב, מספר בית, עיר, מיקוד"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="bg-gray-800 border-gray-600 text-white pl-3 pr-10 focus:border-cyan-500 min-h-[80px]"
                      rows={3}
                    />
                  </div>
                  {errors.address && <p className="text-red-400 text-sm">{errors.address}</p>}
                </div>
              )}

              {/* שדות נותן שירות */}
              {userType === 'service_provider' && (
                <>
                  {/* טלפון */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white">מספר טלפון <span className="text-red-400">*</span></Label>
                    <div className="relative">
                      <Phone className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="050-0000000"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="bg-gray-800 border-gray-600 text-white pl-3 pr-10 focus:border-cyan-500"
                        dir="ltr"
                      />
                    </div>
                    {errors.phone && <p className="text-red-400 text-sm">{errors.phone}</p>}
                  </div>

                  {/* מקצוע */}
                  <div className="space-y-2">
                    <Label htmlFor="profession" className="text-white">מקצוע <span className="text-red-400">*</span></Label>
                    <div className="relative">
                      <Wrench className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="profession"
                        name="profession"
                        type="text"
                        placeholder="למשל: חשמלאי, אינסטלטור"
                        value={formData.profession}
                        onChange={handleInputChange}
                        className="bg-gray-800 border-gray-600 text-white pl-3 pr-10 focus:border-cyan-500"
                      />
                    </div>
                    {errors.profession && <p className="text-red-400 text-sm">{errors.profession}</p>}
                  </div>

                  {/* שנות ותק + תעריף לשעה */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="experienceYears" className="text-white">שנות ותק</Label>
                      <div className="relative">
                        <Clock className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="experienceYears"
                          name="experienceYears"
                          type="number"
                          placeholder="למשל: 5"
                          value={formData.experienceYears}
                          onChange={handleInputChange}
                          className="bg-gray-800 border-gray-600 text-white pl-3 pr-10 focus:border-cyan-500"
                          min="0"
                          max="60"
                        />
                      </div>
                      {errors.experienceYears && <p className="text-red-400 text-sm">{errors.experienceYears}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hourlyRate" className="text-white">תעריף לשעה (₪)</Label>
                      <div className="relative">
                        <DollarSign className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="hourlyRate"
                          name="hourlyRate"
                          type="number"
                          placeholder="למשל: 180"
                          value={formData.hourlyRate}
                          onChange={handleInputChange}
                          className="bg-gray-800 border-gray-600 text-white pl-3 pr-10 focus:border-cyan-500"
                          min="1"
                        />
                      </div>
                      {errors.hourlyRate && <p className="text-red-400 text-sm">{errors.hourlyRate}</p>}
                    </div>
                  </div>

                  {/* אזורי שירות */}
                  <div className="space-y-2">
                    <Label htmlFor="serviceAreas" className="text-white">אזורי שירות</Label>
                    <Input
                      id="serviceAreas"
                      name="serviceAreas"
                      type="text"
                      placeholder="למשל: תל אביב, רמת גן, גבעתיים"
                      value={formData.serviceAreas}
                      onChange={handleInputChange}
                      className="bg-gray-800 border-gray-600 text-white focus:border-cyan-500"
                    />
                    {errors.serviceAreas && <p className="text-red-400 text-sm">{errors.serviceAreas}</p>}
                  </div>

                  {/* זמן תגובה */}
                  <div className="space-y-2">
                    <Label className="text-white">בחר זמן תגובה</Label>
                    <Select value={formData.responseTime} onValueChange={(value) => handleInputChange({ target: { name: 'responseTime', value } })}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white focus:border-cyan-500">
                        <SelectValue placeholder="בחר זמן תגובה" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">מיידי</SelectItem>
                        <SelectItem value="within_1h">עד שעה</SelectItem>
                        <SelectItem value="within_3h">עד 3 שעות</SelectItem>
                        <SelectItem value="within_day">עד סוף היום</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.responseTime && <p className="text-red-400 text-sm">{errors.responseTime}</p>}
                  </div>

                  {/* תיאור קצר/התמחויות */}
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-white">תיאור קצר / תחומי התמחות</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      placeholder="ספר בקצרה עליך ועל תחומי ההתמחות שלך..."
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="bg-gray-800 border-gray-600 text-white pl-3 pr-3 focus:border-cyan-500 min-h-[90px]"
                    />
                  </div>

                  {/* אישורים/תעודות - כפתור פקטיבי */}
                  <div className="flex items-center justify-between gap-4 p-3 bg-gray-900 rounded-lg border border-gray-900 shadow-md">
                    <div className="text-gray-100 text-sm">בקרוב ניתן יהיה להעלות תעודות (לא לחיץ כעת)</div>
                    <button type="button" className="p-2 rounded-xl bg-gray-900 text-white hover:bg-black border border-gray-900 shadow-md hover:shadow-lg">
                      <Camera className="w-5 h-5" />
                    </button>
                  </div>
                </>
              )}

              {errors.general && (
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{errors.general}</p>
                </div>
              )}

              {/* כפתור הרשמה */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-4 rounded-2xl transition-all duration-500 transform hover:scale-105 shadow-lg shadow-cyan-500/25"
              >
                {isLoading ? 'נרשם...' : 'הירשם'}
                {!isLoading && <ArrowRight className="w-4 h-4 mr-2" />}
              </Button>

              {/* חזרה להתחברות */}
              <div className="text-center pt-6">
                <button
                  type="button"
                  onClick={() => navigate('/Auth')}
                  className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors duration-300"
                >
                  יש לך כבר חשבון? התחבר כאן
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 