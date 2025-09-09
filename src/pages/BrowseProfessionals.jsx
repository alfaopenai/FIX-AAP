
import React, { useState, useEffect } from 'react';
import { Professional } from '@/api/entities';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Sparkles } from 'lucide-react';
import ProfessionalCard from '@/components/browse/ProfessionalCard';

const shuffle = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
};

export default function BrowseProfessionalsPage() {
    const [allProfessionals, setAllProfessionals] = useState([]);
    const [shuffledProfessionals, setShuffledProfessionals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showAll, setShowAll] = useState(false); // false = recommended-only, true = show all

    const categories = [
        { id: 'all', name: 'הכל', imageUrl: 'https://images.unsplash.com/photo-1517994112540-009c47ea476b?auto=format&fit=crop&w=400&q=60' },
        { id: 'plumbing', name: 'אינסטלטורים', imageUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/48c9a6ab8_image.png' },
        { id: 'electrical', name: 'חשמלאים', imageUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/605f11031_image.png' },
        { id: 'moving_and_deliveries', name: 'הובלות ומשלוחים', imageUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/8a6377854_image.png' }
    ];

    useEffect(() => {
        const fetchProfessionals = async () => {
            setLoading(true);
            
            // Mock data for prototype
            const mockProfessionals = [
                {
                    id: 'pro-1',
                    business_name: 'ProFix Plumbing',
                    bio: 'Licensed plumber with 15+ years of experience. Specializing in emergency repairs and bathroom renovations.',
                    rating: 4.9,
                    review_count: 127,
                    profile_photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
                    specialties: ['plumbing'],
                    years_experience: 15,
                    service_areas: ['Downtown', 'Midtown', 'Uptown'],
                    response_time: 'within_hour',
                    verified_background: true,
                    verified_reviews: true
                },
                {
                    id: 'pro-2',
                    business_name: 'אביגיל צביעת',
                    bio: 'צביעת דירות ובתים באיכות גבוהה. ייעוץ צבעים בחינם.',
                    rating: 4.9,
                    review_count: 85,
                    profile_photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b890?w=150&h=150&fit=crop&crop=face',
                    specialties: ['painting'],
                    years_experience: 8,
                    service_areas: ['Tel Aviv', 'Ramat Gan', 'Givatayim'],
                    response_time: 'within_2_hours',
                    verified_background: true,
                    verified_reviews: true
                },
                {
                    id: 'pro-3',
                    business_name: 'הצבעים של יוסי',
                    bio: 'צביעה מקצועית לבתים ומשרדים. עם ניסיון של 10 שנים.',
                    rating: 4.9,
                    review_count: 120,
                    profile_photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
                    specialties: ['painting'],
                    years_experience: 10,
                    service_areas: ['Jerusalem', 'Beit Shemesh', 'Modi\'in'],
                    response_time: 'within_hour',
                    verified_background: true,
                    verified_reviews: true
                },
                {
                    id: 'pro-4',
                    business_name: 'Elite Electrical Services',
                    bio: 'Master electrician providing safe and reliable electrical services for homes and businesses.',
                    rating: 4.8,
                    review_count: 89,
                    profile_photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
                    specialties: ['electrical'],
                    years_experience: 12,
                    service_areas: ['North Tel Aviv', 'Herzliya', 'Ra\'anana'],
                    response_time: 'within_2_hours',
                    verified_background: true,
                    verified_reviews: true
                },
                {
                    id: 'pro-5',
                    business_name: 'דני אינסטלטור מקצועי',
                    bio: 'שירותי אינסטלציה מקצועיים. זמין 24/7 לחירום.',
                    rating: 4.7,
                    review_count: 203,
                    profile_photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
                    specialties: ['plumbing'],
                    years_experience: 18,
                    service_areas: ['Haifa', 'Kiryat Ata', 'Kiryat Bialik'],
                    response_time: 'within_hour',
                    verified_background: true,
                    verified_reviews: true
                },
                {
                    id: 'pro-6',
                    business_name: 'מוטי חשמלאי',
                    bio: 'שירותי חשמל ביתיים ומסחריים. התקנות ותיקונים.',
                    rating: 4.6,
                    review_count: 156,
                    profile_photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
                    specialties: ['electrical'],
                    years_experience: 14,
                    service_areas: ['Beer Sheva', 'Ashdod', 'Ashkelon'],
                    response_time: 'within_3_hours',
                    verified_background: true,
                    verified_reviews: true
                },
                {
                    id: 'pro-7',
                    business_name: 'אברהם אינסטלציה',
                    bio: 'איתור נזילות עם מצלמה תרמית, תיקוני סתימות והתקנות.',
                    rating: 4.5,
                    review_count: 74,
                    profile_photo: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=150&h=150&fit=crop&crop=face',
                    specialties: ['plumbing'],
                    years_experience: 9,
                    service_areas: ['פתח תקווה', 'ראש העין', 'כפר סבא'],
                    response_time: 'within_2_hours',
                    verified_background: true,
                    verified_reviews: true
                },
                {
                    id: 'pro-8',
                    business_name: 'אלופים בהובלות',
                    bio: 'הובלות קטנות וגדולות, שירותי פירוק והרכבה, ביטוח מלא.',
                    rating: 4.7,
                    review_count: 162,
                    profile_photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
                    specialties: ['moving_and_deliveries'],
                    years_experience: 11,
                    service_areas: ['ת״א', 'ר״ג', 'גבעתיים', 'חולון'],
                    response_time: 'within_hour',
                    verified_background: true,
                    verified_reviews: true
                },
                {
                    id: 'pro-9',
                    business_name: 'אור חשמל',
                    bio: 'פתרונות תאורה חכמים, לוחות חשמל ושדרוג תשתיות.',
                    rating: 4.85,
                    review_count: 133,
                    profile_photo: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=150&h=150&fit=crop&crop=face',
                    specialties: ['electrical'],
                    years_experience: 13,
                    service_areas: ['מרכז', 'שפלה'],
                    response_time: 'within_hour',
                    verified_background: true,
                    verified_reviews: true
                },
                {
                    id: 'pro-10',
                    business_name: 'צבע פלוס',
                    bio: 'צבעי מומלץ עם דגש על גימור נקי ומהיר. כולל תיקוני שפכטל.',
                    rating: 4.6,
                    review_count: 92,
                    profile_photo: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face',
                    specialties: ['painting'],
                    years_experience: 7,
                    service_areas: ['צפון'],
                    response_time: 'within_3_hours',
                    verified_background: true,
                    verified_reviews: true
                },
                {
                    id: 'pro-11',
                    business_name: 'איתי הובלות',
                    bio: 'הובלות סטודנטים מהירות וזולות, כולל הובלות פסנתרים.',
                    rating: 4.4,
                    review_count: 58,
                    profile_photo: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=150&h=150&fit=crop&crop=face',
                    specialties: ['moving_and_deliveries'],
                    years_experience: 5,
                    service_areas: ['מרכז', 'דרום'],
                    response_time: 'within_2_hours',
                    verified_background: false,
                    verified_reviews: true
                }
            ];
            
            setAllProfessionals(mockProfessionals);
            setShuffledProfessionals(shuffle(mockProfessionals));
            setLoading(false);
        };
        fetchProfessionals();
    }, []);

    // Sync selected category with URL (?category=...)
    useEffect(() => {
        const q = new URLSearchParams(location.search);
        const cat = q.get('category') || 'all';
        setSelectedCategory(cat);
        setShowAll(false); // reset to recommended when category changes or external nav
    }, [location.search]);

    const categoryCounts = categories.reduce((acc, category) => {
        if (category.id === 'all') {
            acc[category.id] = allProfessionals.length;
        } else {
            acc[category.id] = allProfessionals.filter(pro => pro.specialties?.includes(category.id)).length;
        }
        return acc;
    }, {});
    
    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(createPageUrl('FindProfessionals') + `?search=${searchQuery.trim()}`);
        }
    };

    // Professionals to display based on selected category + showAll/recommended
    const basePros = selectedCategory === 'all'
        ? allProfessionals
        : allProfessionals.filter(p => p.specialties?.includes(selectedCategory));
    const recommendedPros = [...basePros].sort((a,b) => (b.rating || 0) - (a.rating || 0)).slice(0, 4);
    const displayedProfessionals = showAll ? basePros : recommendedPros;

    return (
        <div className="min-h-screen bg-background text-foreground" dir="rtl">
            {/* Static background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/6 -right-40 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-pink-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/3 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 rounded-full blur-3xl"></div>
                <div className="absolute top-2/3 right-1/4 w-40 h-40 bg-gradient-to-br from-yellow-500/10 to-orange-500/5 rounded-full blur-2xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 pb-12 relative z-10">
                <div className="relative mb-8 max-w-2xl mx-auto mt-8">
                    {/* Glowing search container */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-300"></div>
                        <div className="relative">
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400 transition-colors duration-300 group-hover:text-cyan-300" />
                            <Input 
                                placeholder="חיפוש בעלי מקצוע..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearch}
                                className="w-full bg-secondary/60 backdrop-blur-xl border-border rounded-full h-14 pr-12 text-base text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 hover:bg-secondary/70"
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                <Sparkles className="w-5 h-5 text-yellow-400" />
                            </div>
                        </div>
                    </div>
                </div>

                <section className="mb-12">
                    <div className="flex justify-between items-center mb-6">
                        <div className="relative">
                            <h2 className="text-3xl font-bold bg-gradient-to-l from-purple-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent">
                                קטגוריות
                            </h2>
                            <div className="absolute -bottom-1 right-0 w-20 h-1 bg-gradient-to-l from-purple-500 to-cyan-500 rounded-full"></div>
                        </div>
                        <Button
                            variant="ghost"
                            onClick={() => navigate(createPageUrl('BrowseProfessionals'))}
                            className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-full px-6 transition-all duration-300 hover:scale-105"
                        >
                            הצג הכל ✨
                        </Button>
                    </div>
                    
                    <div className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4" style={{ scrollbarWidth: 'none', '-ms-overflow-style': 'none' }}>
                        {categories.filter(c => c.id !== 'all').map((category, index) => (
                            <div
                                key={category.id}
                                onClick={() => navigate(createPageUrl('BrowseProfessionals') + `?category=${category.id}`)}
                                className={`group flex-shrink-0 w-52 rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ring-1 ${selectedCategory===category.id ? 'ring-cyan-400/70' : 'ring-gray-700/50'} hover:ring-2 hover:ring-cyan-400/50 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20 bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl`}
                            >
                                    <div className="relative overflow-hidden">
                                        <img 
                                            src={category.imageUrl} 
                                            alt={category.name} 
                                            className="w-full h-36 object-cover transition-transform duration-700 group-hover:scale-110" 
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        
                                        {/* Floating count badge */}
                                        <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm rounded-full px-3 py-1 border border-cyan-400/50 transform transition-all duration-300 group-hover:scale-110 group-hover:bg-cyan-400/20">
                                            <span className="text-cyan-300 text-xs font-bold">{categoryCounts[category.id] || 0}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="p-4 bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm">
                                        <h3 className="font-semibold text-white text-lg transition-colors duration-300 group-hover:text-cyan-300 mb-1">
                                            {category.name}
                                        </h3>
                                        <p className="text-sm text-gray-400 transition-colors duration-300 group-hover:text-gray-300">
                                            {categoryCounts[category.id] || 0} בעלי מקצוע
                                        </p>
                                    </div>
                                    
                                    {/* Bottom glow line */}
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                </div>
                        ))}
                    </div>
                </section>
                
                <section>
                    <div className="mb-6 flex items-center justify-between">
                        <div className="relative">
                            <h2 className="text-3xl font-bold text-right bg-gradient-to-l from-cyan-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                {(() => {
                                    const catName = selectedCategory === 'all' ? '' : (categories.find(c=>c.id===selectedCategory)?.name || '');
                                    if (selectedCategory === 'all') {
                                        return showAll ? 'בעלי מקצוע' : 'בעלי מקצוע מומלצים';
                                    }
                                    return showAll ? catName : `${catName} מומלצים`;
                                })()}
                            </h2>
                            <div className="absolute -bottom-1 right-0 w-32 h-1 bg-gradient-to-l from-cyan-400 via-purple-400 to-pink-400 rounded-full"></div>
                        </div>

                        {/* Toggle: Show all vs recommended (left side) */}
                        {showAll ? (
                            <Button
                                variant="outline"
                                onClick={() => setShowAll(false)}
                                className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10"
                            >
                                {selectedCategory === 'all' ? 'הצג רק מומלצים' : `הצג רק ${categories.find(c=>c.id===selectedCategory)?.name || ''} המומלצים`}
                            </Button>
                        ) : (
                            <Button
                                variant="outline"
                                onClick={() => setShowAll(true)}
                                className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10"
                            >
                                {selectedCategory === 'all' ? 'הצג את כל בעלי המקצוע' : `הצג את כל ${categories.find(c=>c.id===selectedCategory)?.name || ''}`}
                            </Button>
                        )}
                    </div>
                    
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/30 rounded-2xl p-6 h-64 backdrop-blur-sm">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-16 h-16 bg-gray-700/50 rounded-full"></div>
                                        <div className="flex-1">
                                            <div className="w-3/4 h-4 bg-gray-700/50 rounded mb-2"></div>
                                            <div className="w-1/2 h-3 bg-gray-700/50 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="w-full h-3 bg-gray-700/50 rounded mb-4"></div>
                                    <div className="flex gap-2">
                                        <div className="w-16 h-6 bg-gray-700/50 rounded"></div>
                                        <div className="w-16 h-6 bg-gray-700/50 rounded"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {displayedProfessionals.map((pro, index) => (
                                <div 
                                    key={pro.id}
                                    className="hover:animate-float"
                                >
                                    <ProfessionalCard professional={pro} />
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float:hover {
                    animation: float 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
