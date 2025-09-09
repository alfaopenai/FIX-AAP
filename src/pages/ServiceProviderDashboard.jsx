import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CartIcon, Cart } from '@/components/ui/cart';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Bell, 
  MessageSquare, 
  DollarSign, 
  Star, 
  User, 
  Clock, 
  CheckCircle, 
  XCircle, 
  LogOut,
  MapPin,
  Phone,
  Filter,
  Search,
  Calendar,
  TrendingUp,
  ChevronDown,
  Zap,
  Wrench,
  Home,
  Droplets,
  Leaf,
  Hammer,
  Laptop,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  X,
  ShoppingCart,
  History,
  Store,
  Users,
  Briefcase,
  MessageCircle
} from 'lucide-react';
import jobsIcon from '@/assets/icons/0722e73b-ff42-4b7b-b555-ee7535911db2.png';
import messagesIcon from '@/assets/icons/54a0eeff-4ef7-4df6-bda4-f5b8cea86a4b.png';

export default function ServiceProviderDashboard() {
  const { user, logout, userType } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  

  
  // מצבי סינון
  const [filters, setFilters] = useState({
    workType: 'all',
    priceSort: 'all',
    distanceSort: 'all',
    urgency: 'all'
  });

  // אפשרויות סינון
  const workTypes = [
    { value: 'all', label: 'כל סוגי העבודה', icon: Hammer },
    { value: 'חשמל', label: 'חשמל', icon: Zap },
    { value: 'אינסטלציה', label: 'אינסטלציה', icon: Droplets },
    { value: 'גינון', label: 'גינון', icon: Leaf },
    { value: 'תיקון מחשבים', label: 'תיקון מחשבים', icon: Laptop },
    { value: 'שיפוצים', label: 'שיפוצים כלליים', icon: Home },
    { value: 'מנעולנות', label: 'מנעולנות', icon: Wrench }
  ];

  // התראות רלוונטיות לפי תחום עיסוק של המשתמש
  const userProfession = user?.profession || 'טכנאי מחשבים';
  // Weekly schedule data
  const [weeklyJobs, setWeeklyJobs] = useState([
    {
      id: 1,
      day: 'ראשון',
      date: '12/01',
      jobs: [
        {
          id: 'job-1',
          time: '09:00',
          duration: '2 שעות',
          customer: 'דן כהן',
          type: 'תיקון מחשב',
          location: 'תל אביב',
          status: 'confirmed'
        },
        {
          id: 'job-2',
          time: '14:00',
          duration: '1.5 שעות',
          customer: 'שרה לוי',
          type: 'התקנת רכיבים',
          location: 'רמת גן',
          status: 'pending'
        }
      ]
    },
    {
      id: 2,
      day: 'שני',
      date: '13/01',
      jobs: [
        {
          id: 'job-3',
          time: '10:30',
          duration: '3 שעות',
          customer: 'אמיר גולד',
          type: 'שחזור נתונים',
          location: 'פתח תקווה',
          status: 'confirmed'
        }
      ]
    },
    {
      id: 3,
      day: 'שלישי',
      date: '14/01',
      jobs: [
        {
          id: 'job-4',
          time: '11:00',
          duration: '1 שעה',
          customer: 'מיכל אבני',
          type: 'ייעוץ טכני',
          location: 'תל אביב',
          status: 'confirmed'
        },
        {
          id: 'job-5',
          time: '16:00',
          duration: '2 שעות',
          customer: 'יוסי בן דוד',
          type: 'תיקון מחשב נייד',
          location: 'חולון',
          status: 'pending'
        }
      ]
    },
    {
      id: 4,
      day: 'רביעי',
      date: '15/01',
      jobs: []
    },
    {
      id: 5,
      day: 'חמישי',
      date: '16/01',
      jobs: [
        {
          id: 'job-6',
          time: '13:00',
          duration: '4 שעות',
          customer: 'חברת טכנולוגיה',
          type: 'תחזוקה מונעת',
          location: 'רמת גן',
          status: 'confirmed'
        }
      ]
    },
    {
      id: 6,
      day: 'שישי',
      date: '17/01',
      jobs: [
        {
          id: 'job-7',
          time: '09:00',
          duration: '2 שעות',
          customer: 'רונית שמש',
          type: 'תיקון מדפסת',
          location: 'הרצליה',
          status: 'pending'
        }
      ]
    },
    {
      id: 7,
      day: 'שבת',
      date: '18/01',
      jobs: []
    }
  ]);

  const [notifications, setNotifications] = useState([
    // התראות חדשות (לא נקראו) - 2 התראות
    {
      id: 1,
      requestId: 'req-1',
      customerName: 'אלון גרוס',
      description: 'מחשב לא נדלק לאחר הפסקת חשמל - דחוף מאוד!',
      category: 'תיקון מחשבים',
      urgency: 'גבוהה',
      budget: '₪180-280',
      location: 'הרצליה - גליל ים',
      timePosted: '5 דקות',
      distance: 2.8,
      isRead: false,
      relevantTo: ['טכנאי מחשבים', 'תיקון מחשבים']
    },
    {
      id: 2,
      requestId: 'req-2',
      customerName: 'יוסי דוד',
      description: 'מסך לפטופ שבור צריך החלפה עד מחר',
      category: 'תיקון מחשבים',
      urgency: 'גבוהה',
      budget: '₪300-500',
      location: 'נתניה - מרכז העיר',
      timePosted: '12 דקות',
      distance: 12.3,
      isRead: false,
      relevantTo: ['טכנאי מחשבים', 'תיקון מחשבים']
    },
    
    // התראות שכבר נקראו - 5 התראות
    {
      id: 3,
      requestId: 'req-3',
      customerName: 'רינה אביטל',
      description: 'התקנת מחשב חדש והעברת נתונים',
      category: 'תיקון מחשבים',
      urgency: 'בינונית',
      budget: '₪120-200',
      location: 'רעננה - כפר סבא',
      timePosted: '25 דקות',
      distance: 4.2,
      isRead: true,
      relevantTo: ['טכנאי מחשבים', 'תיקון מחשבים']
    },
    {
      id: 4,
      requestId: 'req-4',
      customerName: 'משה כהן',
      description: 'מחשב איטי מאוד + ניקוי וירוסים',
      category: 'תיקון מחשבים',
      urgency: 'נמוכה',
      budget: '₪100-150',
      location: 'כפר סבא - מרכז',
      timePosted: '45 דקות',
      distance: 6.1,
      isRead: true,
      relevantTo: ['טכנאי מחשבים', 'תיקון מחשבים']
    },
    {
      id: 5,
      requestId: 'req-5',
      customerName: 'דינה לוי',
      description: 'תיקון מקלדת לפטופ שנשפכו עליה נוזלים',
      category: 'תיקון מחשבים',
      urgency: 'בינונית',
      budget: '₪150-250',
      location: 'רמת השרון - מרכז',
      timePosted: '1 שעה',
      distance: 7.5,
      isRead: true,
      relevantTo: ['טכנאי מחשבים', 'תיקון מחשבים']
    },
    {
      id: 6,
      customerName: 'אבי שמואל',
      description: 'התקנת זיכרון RAM חדש במחשב נייד',
      category: 'תיקון מחשבים',
      urgency: 'נמוכה',
      budget: '₪80-120',
      location: 'תל אביב - צפון',
      timePosted: '2 שעות',
      distance: 8.9,
      isRead: true,
      relevantTo: ['טכנאי מחשבים', 'תיקון מחשבים']
    },
    {
      id: 7,
      customerName: 'מירי ברק',
      description: 'שחזור נתונים מדיסק קשיח שהתקלקל',
      category: 'תיקון מחשבים',
      urgency: 'גבוהה',
      budget: '₪250-400',
      location: 'פתח תקווה - מרכז',
      timePosted: '3 שעות',
      distance: 11.2,
      isRead: true,
      relevantTo: ['טכנאי מחשבים', 'תיקון מחשבים']
    }
  ]);

  const priceSortOptions = [
    { value: 'all', label: 'כל המחירים', icon: DollarSign },
    { value: 'high_to_low', label: 'מחיר גבוה לנמוך', icon: ArrowDown },
    { value: 'low_to_high', label: 'מחיר נמוך לגבוה', icon: ArrowUp }
  ];

  const distanceSortOptions = [
    { value: 'all', label: 'כל המרחקים', icon: MapPin },
    { value: 'close_to_far', label: 'קרוב לרחוק', icon: ArrowUp },
    { value: 'far_to_close', label: 'רחוק לקרוב', icon: ArrowDown }
  ];

  // נתוני פניות פתוחות מעודכנים עם קטגוריות ומחירים נומריים
  const [openRequests, setOpenRequests] = useState([
    {
      id: 1,
      customerName: 'יוסי כהן',
      description: 'תיקון מחשב נייד שלא נדלק - הבעיה החלה אתמול בבוקר',
      category: 'תיקון מחשבים',
      urgency: 'גבוהה',
      budget: '₪200-300',
      budgetMin: 200,
      budgetMax: 300,
      location: 'תל אביב - רמת אביב',
      phone: '050-1234567',
      timePosted: '2 שעות',
      distance: 3.2,
      status: 'open',
      customerRating: 4.8,
      image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=400&q=60'
    },
    {
      id: 2,
      customerName: 'שרה לוי',
      description: 'התקנת מערכת הפעלה חדשה למחשב נייד + העברת קבצים',
      category: 'תיקון מחשבים',
      urgency: 'בינונית',
      budget: '₪150-250',
      budgetMin: 150,
      budgetMax: 250,
      location: 'רמת גן - הגבעה הצרפתית',
      phone: '052-9876543',
      timePosted: '4 שעות',
      distance: 5.7,
      status: 'open',
      customerRating: 4.5,
      image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=400&q=60'
    },
    {
      id: 3,
      customerName: 'דני רוזן',
      description: 'ניקוי וירוסים מהמחשב + התקנת אנטי וירוס',
      category: 'תיקון מחשבים',
      urgency: 'נמוכה',
      budget: '₪100-150',
      budgetMin: 100,
      budgetMax: 150,
      location: 'גבעתיים - קריית אונו',
      phone: '054-5555555',
      timePosted: '6 שעות',
      distance: 8.1,
      status: 'open',
      customerRating: 4.9,
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=60'
    },
    {
      id: 4,
      customerName: 'מיכל אברהם',
      description: 'תיקון לוח חשמל ראשי בבית + החלפת מפסק',
      category: 'חשמל',
      urgency: 'גבוהה',
      budget: '₪400-600',
      budgetMin: 400,
      budgetMax: 600,
      location: 'בני ברק - פרדס כץ',
      phone: '053-7777777',
      timePosted: '1 שעה',
      distance: 4.5,
      status: 'open',
      customerRating: 4.7,
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=60'
    },
    {
      id: 5,
      customerName: 'רונן ישראלי',
      description: 'נזילה מברז המטבח וצנרת תחתית שצריכה תיקון',
      category: 'אינסטלציה',
      urgency: 'גבוהה',
      budget: '₪300-500',
      budgetMin: 300,
      budgetMax: 500,
      location: 'פתח תקווה - קריית מטלון',
      phone: '050-8888888',
      timePosted: '3 שעות',
      distance: 12.3,
      status: 'open',
      customerRating: 4.6,
      image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=400&q=60'
    },
    {
      id: 6,
      customerName: 'ליאת גולן',
      description: 'עיצוב וטיפוח גינה קטנה + שתילת צמחים חדשים',
      category: 'גינון',
      urgency: 'נמוכה',
      budget: '₪250-400',
      budgetMin: 250,
      budgetMax: 400,
      location: 'רמת השרון - הרצל',
      phone: '052-1111111',
      timePosted: '5 שעות',
      distance: 15.8,
      status: 'open',
      customerRating: 5.0,
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=400&q=60'
    }
  ]);

  const stats = {
    totalRequests: 15,
    acceptedJobs: 3,
    completedJobs: 12,
    monthlyRevenue: 3200,
    rating: 4.8,
    responseTime: '2 שעות'
  };



  const handleRejectRequest = (requestId) => {
    setOpenRequests(prev => prev.filter(req => req.id !== requestId));
  };

  const getUrgencyColor = (urgency) => {
    switch(urgency) {
      case 'גבוהה': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'בינונית': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'נמוכה': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  // פונקציית סינון מתקדמת
  const getFilteredRequests = () => {
    let filtered = openRequests.filter(request => {
      const matchesSearch = request.customerName.includes(searchTerm) || 
                           request.description.includes(searchTerm) || 
                           request.category.includes(searchTerm);
      
      const matchesWorkType = filters.workType === 'all' || request.category === filters.workType;
      const matchesUrgency = filters.urgency === 'all' || request.urgency === filters.urgency;
      
      return matchesSearch && matchesWorkType && matchesUrgency;
    });

    // מיון לפי מחיר
    if (filters.priceSort === 'high_to_low') {
      filtered.sort((a, b) => b.budgetMax - a.budgetMax);
    } else if (filters.priceSort === 'low_to_high') {
      filtered.sort((a, b) => a.budgetMin - b.budgetMin);
    }

    // מיון לפי מרחק
    if (filters.distanceSort === 'close_to_far') {
      filtered.sort((a, b) => a.distance - b.distance);
    } else if (filters.distanceSort === 'far_to_close') {
      filtered.sort((a, b) => b.distance - a.distance);
    }

    return filtered;
  };

  const filteredRequests = getFilteredRequests();

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      workType: 'all',
      priceSort: 'all',
      distanceSort: 'all',
      urgency: 'all'
    });
    setSearchTerm('');
  };

  // פונקציות ניהול התראות
  const getRelevantNotifications = () => {
    return notifications.filter(notification => 
      notification.relevantTo.includes(userProfession) || 
      notification.relevantTo.includes(user?.profession)
    );
  };

  const getUnreadCount = () => {
    return getRelevantNotifications().filter(notification => !notification.isRead).length;
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId 
        ? { ...notification, isRead: true }
        : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })));
  };

  const handleNotificationClick = (notification) => {
    markNotificationAsRead(notification.id);
    // Navigate to messages with the specific request
    navigate(`/providermessages?requestId=${notification.requestId}`);
  };

  const handleAcceptRequest = (notificationId) => {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
      // Navigate to messages with the request ID to start conversation
      navigate(`/providermessages?requestId=${notification.requestId}`);
    }
  };

  // Navigation functions for weekly schedule
  const goToPreviousDay = () => {
    setCurrentDayIndex(prev => prev > 0 ? prev - 1 : weeklyJobs.length - 1);
  };

  const goToNextDay = () => {
    setCurrentDayIndex(prev => prev < weeklyJobs.length - 1 ? prev + 1 : 0);
  };

  const currentDay = weeklyJobs[currentDayIndex];

  // Navigation items for service provider (from Layout.jsx)
  const isProvider = userType === 'service_provider';
  
  const navItemsLeft = [
    { name: 'Requests', icon: Users, path: createPageUrl('ServiceProviderDashboard'), customIcon: 'https://img.icons8.com/3d-fluency/94/user-male-circle.png' },
    { name: 'Messages', icon: MessageCircle, path: createPageUrl('ProviderMessages'), customIcon: messagesIcon },
  ];

  const navItemsRight = [
    { name: 'Jobs', icon: Briefcase, path: createPageUrl('ProviderJobs'), customIcon: jobsIcon },
    { name: 'Store', icon: Store, path: createPageUrl('Store'), customIcon: 'https://img.icons8.com/3d-fluency/94/shop.png' },
  ];
  
  const allNavItemsForMobile = [...navItemsLeft, ...navItemsRight];

  // Helper function to determine if a path is active


  return (
    <div className="min-h-screen bg-background text-foreground pb-20" dir="rtl">
      <style>{`
        .glass-effect {
          backdrop-filter: blur(20px);
          background: rgba(20, 20, 20, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        @keyframes wrench-jiggle {
          0% { transform: rotate(0deg) scale(1.5); }
          25% { transform: rotate(5deg) scale(1.5); }
          50% { transform: rotate(-5deg) scale(1.5); }
          75% { transform: rotate(5deg) scale(1.5); }
          100% { transform: rotate(0deg) scale(1.5); }
        }

        .group:hover .animate-wrench {
          animation: wrench-jiggle 0.4s ease-in-out infinite;
        }
      `}</style>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-4 space-x-reverse">

              <div>
            <h1 className="text-2xl font-bold text-foreground">
                  שלום, {user?.name || 'נותן שירות'}
                </h1>
            <p className="text-primary font-medium">
                  {user?.profession || 'טכנאי מחשבים'}
                </p>
              </div>
            </div>
            
        <div className="flex items-center space-x-3 space-x-reverse">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsNotificationsOpen(true)}
            className="relative bg-secondary/60 hover:bg-accent border border-border text-foreground"
          >
                <Bell className="h-5 w-5" />
            {getUnreadCount() > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
                {getUnreadCount()}
                </span>
            )}
              </Button>

        </div>
      </div>

        {/* Stats Cards */}
      <div className="p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <TrendingUp className="h-8 w-8 text-cyan-400" />
                <span className="text-2xl font-bold text-foreground">{stats.totalRequests}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">פניות השבוע</p>
              <p className="text-green-400 text-xs">+2 מהשבוע הקודם</p>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Clock className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold text-foreground">{stats.acceptedJobs}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">עבודות פעילות</p>
              <p className="text-blue-400 text-xs">דורש טיפול</p>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <DollarSign className="h-8 w-8 text-green-400" />
                <span className="text-2xl font-bold text-foreground">₪{stats.monthlyRevenue.toLocaleString()}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">הכנסה חודשית</p>
              <p className="text-green-400 text-xs">+15% מהחודש הקודם</p>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Star className="h-8 w-8 text-yellow-400" />
                <span className="text-2xl font-bold text-foreground">{stats.rating}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">דירוג ממוצע</p>
              <p className="text-yellow-400 text-xs">מתוך 5 כוכבים</p>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Schedule - Single Day View */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-2 rounded-xl">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-extrabold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">לוח השבוע הקרוב</h2>
            <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400">
              {weeklyJobs.reduce((total, day) => total + day.jobs.length, 0)} עבודות
            </Badge>
          </div>
          
          {/* Single Day Card with Navigation */}
          <div className="max-w-2xl mx-auto">
            <Card className="bg-card border border-border overflow-hidden">
              {/* Day Header with Navigation */}
              <CardHeader className="bg-background/40 border-b border-border">
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={goToPreviousDay}
                    className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-full"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                  
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-foreground">{currentDay.day}</h3>
                    <p className="text-muted-foreground">{currentDay.date}</p>
                      </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={goToNextDay}
                    className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-full"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                    </div>
                  </CardHeader>
              
              {/* Day Content */}
              <CardContent className="p-6 space-y-4">
                {currentDay.jobs.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">📅</div>
                    <h4 className="text-xl font-semibold text-muted-foreground mb-2">יום פנוי</h4>
                    <p className="text-muted-foreground">אין עבודות מתוכננות ליום זה</p>
                  </div>
                ) : (
                  currentDay.jobs.map((job) => (
                    <div 
                      key={job.id} 
                      className={`p-4 rounded-xl border transition-all duration-200 hover:scale-105 cursor-pointer ${
                        job.status === 'confirmed' 
                          ? 'bg-green-500/10 border-green-500/30 hover:border-green-400/50' 
                          : 'bg-yellow-500/10 border-yellow-500/30 hover:border-yellow-400/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-foreground font-bold text-lg">{job.time}</span>
                        <Badge 
                          variant="outline" 
                          className={`${
                            job.status === 'confirmed' 
                              ? 'border-green-500/50 text-green-400' 
                              : 'border-yellow-500/50 text-yellow-400'
                          }`}
                        >
                          {job.status === 'confirmed' ? 'מאושר' : 'ממתין'}
                        </Badge>
                      </div>
                      <h4 className="text-foreground text-lg font-semibold mb-2">{job.customer}</h4>
                      <p className="text-muted-foreground mb-2">{job.type}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-muted-foreground">{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-cyan-400" />
                          <span className="text-cyan-400">{job.duration}</span>
                      </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Compact Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="חיפוש פניות..."
              className="bg-secondary/60 border-border text-foreground placeholder:text-muted-foreground pr-12 rounded-full focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
            />
          </div>
          
          {/* Filter Toggle Button */}
          <Button 
            variant="outline" 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="border-border text-foreground hover:bg-accent px-6"
          >
            <Filter className="h-4 w-4 mr-2" />
            סינון מתקדם
            {isFilterOpen ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
          </Button>
        </div>

        {/* Expandable Filter Panel */}
        {isFilterOpen && (
          <div className="bg-card border border-border rounded-2xl p-6 mb-6 animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Filter className="h-6 w-6 text-cyan-400" />
                <h3 className="text-xl font-bold text-foreground">סינון פניות</h3>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={clearAllFilters}
                  className="border-border text-foreground hover:bg-accent"
                >
                  נקה הכל
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsFilterOpen(false)}
                  className="text-muted-foreground hover:text-foreground hover:bg-accent"
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Work Type Filter */}
              <div className="space-y-2">
                <label className="text-muted-foreground font-medium text-sm flex items-center gap-2">
                  <Hammer className="h-4 w-4" />
                  סוג עבודה
                </label>
                <Select value={filters.workType} onValueChange={(value) => handleFilterChange('workType', value)}>
                  <SelectTrigger className="bg-secondary/60 border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border text-foreground">
                    {workTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value} className="hover:bg-accent">
                        <div className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" />
                          <span>{type.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Sort Filter */}
              <div className="space-y-2">
                <label className="text-muted-foreground font-medium text-sm flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  מיון מחיר
                </label>
                <Select value={filters.priceSort} onValueChange={(value) => handleFilterChange('priceSort', value)}>
                  <SelectTrigger className="bg-secondary/60 border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border text-foreground">
                    {priceSortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="hover:bg-accent">
                        <div className="flex items-center gap-2">
                          <option.icon className="h-4 w-4" />
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Distance Sort Filter */}
              <div className="space-y-2">
                <label className="text-muted-foreground font-medium text-sm flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  מיון מרחק
                </label>
                <Select value={filters.distanceSort} onValueChange={(value) => handleFilterChange('distanceSort', value)}>
                  <SelectTrigger className="bg-secondary/60 border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border text-foreground">
                    {distanceSortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="hover:bg-accent">
                        <div className="flex items-center gap-2">
                          <option.icon className="h-4 w-4" />
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Urgency Filter */}
              <div className="space-y-2">
                <label className="text-muted-foreground font-medium text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  דחיפות
                </label>
                <Select value={filters.urgency} onValueChange={(value) => handleFilterChange('urgency', value)}>
                  <SelectTrigger className="bg-secondary/60 border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border text-foreground">
                    <SelectItem value="all" className="hover:bg-accent">כל הרמות</SelectItem>
                    <SelectItem value="גבוהה" className="hover:bg-accent">דחיפות גבוהה</SelectItem>
                    <SelectItem value="בינונית" className="hover:bg-accent">דחיפות בינונית</SelectItem>
                    <SelectItem value="נמוכה" className="hover:bg-accent">דחיפות נמוכה</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Main Content - Open Requests */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">פניות פתוחות</h2>
            <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400 text-sm px-3 py-1">
              {filteredRequests.length} מתוך {openRequests.length} פניות
            </Badge>
          </div>
          
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-400 mb-2">אין פניות מתאימות</h3>
              <p className="text-gray-500">נסה לשנות את מונחי החיפוש או הסינון</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredRequests.map(request => (
                <Card key={request.id} className="bg-card border border-border transition-all duration-300 overflow-hidden">
                  <div className="flex flex-col lg:flex-row">
                    {/* Image */}
                    <div className="lg:w-48 h-48 lg:h-auto">
                      <img 
                        src={request.image} 
                        alt={request.category}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-foreground">{request.customerName}</h3>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-yellow-400 text-sm font-medium">{request.customerRating}</span>
                            </div>
                          </div>
                          <p className="text-muted-foreground text-lg mb-2">{request.description}</p>
                          <Badge variant="outline" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 mb-4">
                            {request.category}
                          </Badge>
                        </div>
                        
                        <Badge className={`${getUrgencyColor(request.urgency)} border font-medium`}>
                          {request.urgency}
                        </Badge>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground text-sm">{request.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground text-sm">{request.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <span className="text-green-400 text-sm font-medium">{request.budget}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-cyan-400" />
                          <span className="text-muted-foreground text-sm">{request.timePosted} • {request.distance} ק"מ</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                      <Button 
                          onClick={() => {
                            handleRejectRequest(request.id); // Remove from list
                            navigate(`/providermessages?requestId=${request.id}`); // Navigate to messages
                          }}
                          className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-medium px-6"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                          קבל פנייה
                      </Button>
                      <Button 
                        variant="outline"
                          onClick={() => handleRejectRequest(request.id)}
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        דחה
                      </Button>
                        <Button 
                          variant="ghost"
                          className="text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300"
                        >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        שלח הודעה
                      </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
                      </div>
                    </div>



      {/* Notifications Panel */}
      {isNotificationsOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsNotificationsOpen(false)}
          />
          
          {/* Notifications Panel */}
          <div className="fixed right-0 top-0 h-full w-96 bg-background border-l border-border z-50 transform transition-transform duration-300 ease-out overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-background/95">
              <div className="flex items-center gap-3">
                <Bell className="h-6 w-6 text-cyan-400" />
                <h3 className="text-xl font-bold text-foreground">התראות</h3>
                {getUnreadCount() > 0 && (
                  <Badge className="bg-red-500 text-white">
                    {getUnreadCount()} חדש
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {getUnreadCount() > 0 && (
                      <Button 
                    variant="ghost" 
                        size="sm"
                    onClick={markAllAsRead}
                    className="text-cyan-600 hover:text-cyan-500 hover:bg-accent text-xs"
                      >
                    סמן הכל כנקרא
                      </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsNotificationsOpen(false)}
                  className="text-muted-foreground hover:text-foreground hover:bg-accent"
                >
                  <X className="h-5 w-5" />
                      </Button>
                    </div>
            </div>

            {/* Notifications List */}
            <div className="p-4">
              {getRelevantNotifications().length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-400 mb-2">אין התראות חדשות</h3>
                  <p className="text-gray-500 text-sm">כל ההתראות הרלוונטיות יופיעו כאן</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {getRelevantNotifications().map(notification => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                        notification.isRead 
                          ? 'bg-gray-800/30 border-gray-700/50 opacity-70' 
                          : 'bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/30 shadow-lg shadow-cyan-500/10'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                      <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-white text-sm">{notification.customerName}</h4>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            )}
                          </div>
                          <Badge 
                            className={`text-xs ${getUrgencyColor(notification.urgency)} border font-medium`}
                          >
                            {notification.urgency}
                          </Badge>
                        </div>
                        <span className="text-xs text-gray-400">{notification.timePosted}</span>
                      </div>

                      <p className="text-gray-300 text-sm mb-3 line-clamp-2">{notification.description}</p>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-400 truncate">{notification.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-gray-400" />
                          <span className="text-green-400 font-medium">{notification.budget}</span>
                    </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-gray-400">{notification.distance} ק"מ</span>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700 text-white h-7 px-3 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAcceptRequest(notification.id);
                              markNotificationAsRead(notification.id);
                            }}
                          >
                            קבל
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-gray-600 text-gray-300 hover:bg-gray-700 h-7 px-3 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              markNotificationAsRead(notification.id);
                            }}
                          >
                            דחה
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                    </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Floating Cart Button */}
      <div className="fixed bottom-24 right-6 z-50 lg:bottom-6">
          <CartIcon />
      </div>
      
      {/* Cart Component */}
      <Cart />


    </div>
  );
} 