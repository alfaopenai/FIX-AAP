import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// Cart is provided globally in Layout.jsx
import { WazeButton } from '@/components/ui/waze-button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  ArrowRight,
  MessageSquare, 
  DollarSign, 
  Star, 
  Clock, 
  CheckCircle, 
  MapPin,
  Phone,
  Calendar,
  User,
  FileText,
  Timer,
  Users,
  Briefcase,
  MessageCircle,
  Store,
  Wrench,
  ArrowLeft,
  Home,
  XCircle,
  Search,
  Filter,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function ProviderJobs() {
  const { user, userType } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  


  // מצבי סינון
  const [filters, setFilters] = useState({
    workType: 'all',
    priceSort: 'all',
    distanceSort: 'all',
    urgency: 'all'
  });

  // אפשרויות סינון
  const workTypes = [
    { value: 'all', label: 'כל סוגי העבודה', icon: Users },
    { value: 'חשמל', label: 'חשמל', icon: User },
    { value: 'אינסטלציה', label: 'אינסטלציה', icon: User },
    { value: 'גינון', label: 'גינון', icon: User },
    { value: 'תיקון מחשבים', label: 'תיקון מחשבים', icon: User },
    { value: 'שיפוצים', label: 'שיפוצים כלליים', icon: User },
    { value: 'מנעולנות', label: 'מנעולנות', icon: User }
  ];

  const priceSortOptions = [
    { value: 'all', label: 'כל המחירים', icon: DollarSign },
    { value: 'high_to_low', label: 'מחיר גבוה לנמוך', icon: ArrowRight },
    { value: 'low_to_high', label: 'מחיר נמוך לגבוה', icon: ArrowRight }
  ];

  const distanceSortOptions = [
    { value: 'all', label: 'כל המרחקים', icon: MapPin },
    { value: 'close_to_far', label: 'קרוב לרחוק', icon: ArrowRight },
    { value: 'far_to_close', label: 'רחוק לקרוב', icon: ArrowRight }
  ];

  // נתוני פניות פתוחות לדוגמה
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
      description: 'הגדרת רשת אלחוטית חדשה ופתרון בעיות חיבור',
      category: 'תיקון מחשבים',
      urgency: 'בינונית',
      budget: '₪180-280',
      budgetMin: 180,
      budgetMax: 280,
      location: 'בני ברק - פרדס כץ',
      phone: '053-7777777',
      timePosted: '1 יום',
      distance: 7.3,
      status: 'open',
      customerRating: 4.7,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=60'
    }
  ]);

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
      <div className="flex items-center justify-center p-6 border-b border-border">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">מרקטפלייס עבודות</h1>
          <p className="text-primary font-medium">מצא עבודות חדשות וקבל פניות פתוחות</p>
        </div>
      </div>

      <div className="p-6">
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
                  <Users className="h-4 w-4" />
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
                          <Clock className="h-4 w-4 text-cyan-600" />
                          <span className="text-muted-foreground text-sm">{request.timePosted} • {request.distance} ק"מ</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 flex-wrap">
                        <Button 
                          onClick={() => {
                            handleRejectRequest(request.id);
                            // Open mapped conversation and auto-start chat
                            navigate(`/providermessages?requestId=req-${request.id}&autostart=1`);
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
                        <WazeButton
                          address={request.location}
                          variant="outline"
                          size="default"
                          label="נווט ב‑Waze"
                          className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/50"
                        />
                      </div>
                    </div>
                  </div>
              </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cart is provided globally in Layout.jsx; removed page-level duplicates */}


    </div>
  );
} 