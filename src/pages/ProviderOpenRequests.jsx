import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Search } from 'lucide-react';

export default function ProviderOpenRequests() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // placeholder data
  const categories = ['אינסטלציה', 'חשמל', 'מיזוג אוויר', 'נגרים', 'שיפוצים'];

  const [filters, setFilters] = React.useState({
    category: 'all',
    maxPrice: 1000,
    maxDistance: 50,
    search: ''
  });

  const fullRequests = [
    { id: 1, title: 'החלפת גוף חימום', description:'דוד שמש', customer: 'יוסי', urgency: 'גבוהה', category: 'אינסטלציה', price: 400, distance: 12, createdAt: Date.now() - 7200000 },
    { id: 2, title: 'תיקון לוח חשמל', description:'ממסר פחת נופל', customer: 'שרה', urgency: 'בינונית', category: 'חשמל', price: 550, distance: 8, createdAt: Date.now() - 36000000 },
    { id: 3, title: 'מזגן לא מקרר', description:'מילוי גז', customer: 'דני', urgency: 'נמוכה', category: 'מיזוג אוויר', price: 900, distance: 30, createdAt: Date.now() - 18000000 },
    { id: 4, title: 'שיפוץ חדר אמבטיה', description:'החלפת קרמיקה', customer: 'ליאורה', urgency: 'גבוהה', category: 'שיפוצים', price: 1500, distance: 60, createdAt: Date.now() - 90000000 },
  ];

  const filteredRequests = fullRequests
    .filter(r => (filters.category==='all' || r.category===filters.category))
    .filter(r => r.price <= filters.maxPrice)
    .filter(r => r.distance <= filters.maxDistance)
    .filter(r => r.title.includes(filters.search) || r.description.includes(filters.search) || r.customer.includes(filters.search))
    .sort((a,b)=> a.createdAt - b.createdAt); // oldest first

  const handleTake = (id) => {
    // future: call API
    navigate(createPageUrl('ProviderJobs'));
  };

  // add after imports mapping images
  const catImages = {
    'אינסטלציה': 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=600&q=60',
    'חשמל': 'https://images.unsplash.com/photo-1581091870621-1a35f18b4e59?auto=format&fit=crop&w=600&q=60',
    'מיזוג אוויר': 'https://images.unsplash.com/photo-1604881993254-0459870a24c4?auto=format&fit=crop&w=600&q=60',
    'שיפוצים': 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=600&q=60',
    'נגרים': 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=600&q=60',
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 space-y-6" dir="rtl">
      <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">פניות פתוחות</h1>

      {/* Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-4 bg-card/70 backdrop-blur-sm p-4 rounded-xl border border-border">
        {/* Category */}
        <div className="w-full lg:w-1/4">
          <label className="block mb-1 text-sm font-medium text-muted-foreground">קטגוריה</label>
          <Select value={filters.category} onValueChange={(val)=>setFilters(prev=>({...prev,category:val}))}>
            <SelectTrigger className="bg-secondary/60 border-border text-foreground">
              <SelectValue placeholder="בחר" />
            </SelectTrigger>
            <SelectContent className="bg-background text-foreground border-border">
              <SelectItem value="all">הכול</SelectItem>
              {categories.map(c=> (<SelectItem key={c} value={c}>{c}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>

        {/* Max Price */}
        <div className="w-full lg:w-1/4">
          <label className="block mb-1 text-sm font-medium text-muted-foreground">מחיר עד: ₪{filters.maxPrice}</label>
          <Slider min={100} max={2000} step={100} value={[filters.maxPrice]} onValueChange={(val)=>setFilters(prev=>({...prev,maxPrice:val[0]}))} className="w-full" />
        </div>

        {/* Max Distance */}
        <div className="w-full lg:w-1/4">
          <label className="block mb-1 text-sm font-medium text-muted-foreground">מרחק עד: {filters.maxDistance} ק"מ</label>
          <Slider min={5} max={100} step={5} value={[filters.maxDistance]} onValueChange={(val)=>setFilters(prev=>({...prev,maxDistance:val[0]}))} className="w-full" />
        </div>

        {/* Search */}
        <div className="flex-1">
          <label className="block mb-1 text-sm font-medium text-muted-foreground">חיפוש</label>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="text" value={filters.search} onChange={(e)=>setFilters(prev=>({...prev,search:e.target.value}))} placeholder="חיפוש פנייה..." className="w-full bg-secondary/60 border border-border rounded-full py-2 pr-10 pl-4 text-foreground placeholder:text-muted-foreground focus:outline-none" />
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map(req => (
          <Card key={req.id} className="bg-card border border-border rounded-2xl overflow-hidden group hover:shadow-md transition-all">
            <div className="relative">
              <img src={catImages[req.category] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=60'} alt={req.title} className="w-full h-40 object-cover" />
              {/* urgency badge */}
              <Badge className="absolute top-2 left-2" variant={req.urgency==='גבוהה'?'destructive':'default'}>{req.urgency}</Badge>
              {/* rating placeholder maybe price */}
              <div className="absolute top-2 right-2 bg-background/80 text-foreground px-2 py-1 rounded-xl text-sm border border-border">₪{req.price}</div>
            </div>
            <div className="p-4 text-right space-y-2">
              <h3 className="font-semibold text-foreground text-lg leading-tight">{req.title}</h3>
              <p className="text-sm text-muted-foreground leading-snug">{req.description}</p>
              <div className="flex flex-wrap gap-2 mt-2 text-xs">
                <span className="bg-secondary/60 px-3 py-1 rounded-full border border-border">לקוח: {req.customer}</span>
                <span className="bg-secondary/60 px-3 py-1 rounded-full border border-border">מרחק {req.distance} ק"מ</span>
              </div>
              <div className="mt-4 flex justify-end">
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={()=>handleTake(req.id)}>קח פנייה</Button>
              </div>
            </div>
          </Card>
        ))}
        {filteredRequests.length === 0 && (
          <p className="text-center text-gray-400 mt-8">אין פניות מתאימות</p>
        )}
      </div>
    </div>
  );
} 