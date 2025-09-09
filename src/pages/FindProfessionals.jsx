import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Professional, Issue, Message, User } from '@/api/entities';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, ShieldCheck, Send, MapPin, Briefcase, ArrowLeft } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createPageUrl } from '@/utils';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const categoryNames = {
    plumbing: "אינסטלטורים",
    electrical: "חשמלאים",
    moving_and_deliveries: "הובלות ומשלוחים",
    painting: "צביעה",
};

// Mock professionals fallback for categories
const MOCK_PROFESSIONALS = [
    {
        id: 'mock-pl-1',
        business_name: 'דוד האינסטלטור',
        bio: 'אינסטלטור מוסמך לטיפול בסתימות, נזילות והתקנות. זמין 24/7.',
        rating: 4.8,
        review_count: 112,
        profile_photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        specialties: ['plumbing'],
        years_experience: 12,
        service_areas: ['תל אביב', 'גבעתיים', 'רמת גן'],
        response_time: 'within_hour',
    },
    {
        id: 'mock-pl-2',
        business_name: 'יוסי שירותי אינסטלציה',
        bio: 'שיפוץ חדרי אמבטיה ותיקוני חירום. מחירים הוגנים ושירות מהיר.',
        rating: 4.7,
        review_count: 89,
        profile_photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b977?w=150&h=150&fit=crop&crop=face',
        specialties: ['plumbing'],
        years_experience: 10,
        service_areas: ['ראשון לציון', 'בת ים', 'חולון'],
        response_time: 'within_2_hours',
    },
    {
        id: 'mock-el-1',
        business_name: 'מוטי חשמלאי מוסמך',
        bio: 'כל עבודות החשמל לבית ולעסק. אחריות מלאה על כל עבודה.',
        rating: 4.9,
        review_count: 143,
        profile_photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        specialties: ['electrical'],
        years_experience: 14,
        service_areas: ['הרצליה', 'רעננה', 'כפר סבא'],
        response_time: 'within_hour',
    },
    {
        id: 'mock-mv-1',
        business_name: 'אבירים הובלות',
        bio: 'הובלות דירות ומשרדים, צוות מקצועי וזהיר. קרטונים וחומרי אריזה כלולים.',
        rating: 4.6,
        review_count: 210,
        profile_photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        specialties: ['moving_and_deliveries'],
        years_experience: 7,
        service_areas: ['כל הארץ'],
        response_time: 'within_3_hours',
    },
    {
        id: 'mock-pa-1',
        business_name: 'צבעי פסגה',
        bio: 'צביעת דירות, חדרים ומשרדים. ייעוץ חינם להתאמת צבעים.',
        rating: 4.8,
        review_count: 98,
        profile_photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b890?w=150&h=150&fit=crop&crop=face',
        specialties: ['painting'],
        years_experience: 9,
        service_areas: ['מרכז'],
        response_time: 'within_2_hours',
    },
];

export default function FindProfessionalsPage() {
    const query = useQuery();
    const navigate = useNavigate();
    const [professionals, setProfessionals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("כל בעלי המקצוע");
    const category = query.get('category');
    const searchQuery = query.get('search');
    
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [selectedProfessional, setSelectedProfessional] = useState(null);
    const [userIssues, setUserIssues] = useState([]);
    const [selectedIssueId, setSelectedIssueId] = useState('');
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchProfessionals = async () => {
            setLoading(true);
            try {
                // Try live data first
                const user = await User.me().catch(() => null);
                if (user) setCurrentUser(user);

                let allPros = [];
                try {
                    allPros = await Professional.list();
                } catch (_) {
                    allPros = [];
                }

                // Fallback to mocks if none
                if (!Array.isArray(allPros) || allPros.length === 0) {
                    allPros = MOCK_PROFESSIONALS;
                }

                // Filter by category and search
                let filteredPros = allPros;
                if (category) {
                    filteredPros = filteredPros.filter(p => p.specialties?.includes(category));
                    setTitle(categoryNames[category] || "בעלי מקצוע");
                }
                if (searchQuery) {
                    filteredPros = filteredPros.filter(p => p.business_name?.toLowerCase().includes(searchQuery.toLowerCase()));
                    setTitle(`תוצאות חיפוש עבור "${searchQuery}"`);
                }

                // If still empty (e.g., unknown category) show some mocks anyway
                if (filteredPros.length === 0) {
                    filteredPros = MOCK_PROFESSIONALS.filter(p => !category || p.specialties?.includes(category));
                }

                setProfessionals(filteredPros);
            } catch (error) {
                console.error("Failed to fetch data:", error);
                // Hard fallback
                const filtered = MOCK_PROFESSIONALS.filter(p => !category || p.specialties?.includes(category));
                setProfessionals(filtered);
            } finally {
                setLoading(false);
            }
        };
        fetchProfessionals();
    }, [category, searchQuery]);
    
    const openContactModal = async (pro) => {
        setSelectedProfessional(pro);
        if (userIssues.length === 0 && currentUser) {
            const issues = await Issue.filter({ created_by: currentUser.email, status: 'analyzed' });
            setUserIssues(issues);
        }
        setIsContactModalOpen(true);
    };
    
    const handleSendProposal = async () => {
        if (!selectedIssueId || !selectedProfessional || !currentUser) return;
        const conversationId = `${selectedIssueId}-${selectedProfessional.id}`;

        await Message.create({
            conversation_id: conversationId,
            sender_id: currentUser.id,
            recipient_id: selectedProfessional.id,
            message: `שלום, אשמח לקבל הצעת מחיר עבור פנייה שפתחתי.`,
            related_issue_id: selectedIssueId,
            message_type: 'proposal'
        });
        
        setIsContactModalOpen(false);
        navigate(createPageUrl("Messages"));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            </div>
        );
    }

    return (
        <div className="bg-background text-foreground min-h-screen" dir="rtl">
            <div className="max-w-7xl mx-auto p-4 lg:p-8">
                 <header className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" size="icon" className="text-foreground hover:bg-accent" onClick={() => navigate(-1)}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">{title}</h1>
                </header>

                {professionals.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {professionals.map(pro => (
                            <Card key={pro.id} className="bg-gray-900/50 border border-gray-800/50 rounded-2xl overflow-hidden flex flex-col">
                                <CardContent className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center gap-4 mb-4">
                                        <Avatar className="w-16 h-16 border-2 border-cyan-500/30">
                                            <AvatarImage src={pro.profile_photo} />
                                            <AvatarFallback className="bg-gray-700">{pro.business_name?.[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-white">{pro.business_name}</h3>
                                            {pro.rating && (
                                                <div className="flex items-center gap-1.5 text-sm text-gray-400 mt-1">
                                                    <Star className="w-4 h-4 text-yellow-400 fill-current" /> 
                                                    <span className="font-semibold text-white">{pro.rating.toFixed(1)}</span>
                                                    <span>({pro.review_count} ביקורות)</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-300 mb-4 line-clamp-2 flex-1">{pro.bio}</p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {pro.specialties?.map(spec => <Badge key={spec} variant="outline" className="text-cyan-300 bg-cyan-900/50 border-cyan-700/50">{spec}</Badge>)}
                                    </div>
                                    <div className="space-y-2 text-sm text-gray-400 mb-4">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-cyan-400" />
                                            <span>אזורי שירות: {pro.service_area?.join(', ')}</span>
                                        </div>
                                        {pro.insurance_verified && 
                                            <div className="flex items-center gap-2 text-green-400">
                                                <ShieldCheck className="w-4 h-4" /> 
                                                <span>ביטוח מאומת</span>
                                            </div>
                                        }
                                    </div>
                                    <Button onClick={() => openContactModal(pro)} className="w-full mt-auto bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded-xl py-3">
                                        <Send className="w-4 h-4 ml-2" />
                                        שלח בקשה
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-lg font-semibold text-white">לא נמצאו בעלי מקצוע</p>
                        <p className="text-gray-400 mt-2">נסה לחפש בשם אחר או לבחור קטגוריה שונה.</p>
                        <Button onClick={() => navigate(createPageUrl("BrowseProfessionals"))} className="mt-6">חזור לקטגוריות</Button>
                    </div>
                )}
            </div>

            <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
                <DialogContent className="bg-gray-900 text-white border-gray-700" dir="rtl">
                    <DialogHeader>
                        <DialogTitle>יצירת קשר עם {selectedProfessional?.business_name}</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            בחר את הפנייה שברצונך לשלוח לבעל המקצוע.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <label className="text-sm font-medium mb-2 block">בחר פנייה</label>
                        <Select value={selectedIssueId} onValueChange={setSelectedIssueId}>
                             <SelectTrigger className="bg-gray-800 border-gray-600">
                                <SelectValue placeholder="בחר את הפנייה שלך..." />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 text-white border-gray-600">
                                {userIssues.map(issue => (
                                    <SelectItem key={issue.id} value={issue.id} className="focus:bg-gray-700">{issue.title}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="border-gray-600 hover:bg-gray-700" onClick={() => setIsContactModalOpen(false)}>ביטול</Button>
                        <Button onClick={handleSendProposal} disabled={!selectedIssueId} className="bg-cyan-500 hover:bg-cyan-600 text-black">שלח בקשה</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}