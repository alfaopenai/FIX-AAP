import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Professional, Issue, Message, User } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, ShieldCheck, Send, MapPin, Award, Clock, ArrowLeft } from 'lucide-react';
// Removed Dialog and Select imports - using direct navigation instead
import { createPageUrl } from '@/utils';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function ProfessionalProfilePage() {
    const query = useQuery();
    const navigate = useNavigate();
    const professionalId = query.get('id');
    
    const [professional, setProfessional] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Removed modal states - using direct navigation instead
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!professionalId) {
                setLoading(false);
                return;
            }
            setLoading(true);
            
            // Mock data for prototype - same as in BrowseProfessionals
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
                }
            ];
            
            try {
                // Mock current user for prototype
                const mockUser = {
                    id: 'user-1',
                    email: 'user@example.com',
                    name: 'משתמש לדוגמה'
                };
                setCurrentUser(mockUser);

                const foundPro = mockProfessionals.find(p => p.id === professionalId);
                if (foundPro) {
                    setProfessional(foundPro);
                } else {
                    // If specific ID not found, show the first professional as default
                    setProfessional(mockProfessionals[0]);
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
                // Even on error, show a default professional for prototype
                setProfessional(mockProfessionals[0]);
            }
            setLoading(false);
        };
        fetchData();
    }, [professionalId]);
    
    // Removed modal functions - using direct navigation instead

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            </div>
        );
    }
    
    // Always show a professional for prototype - removed "not found" state

    const categoryNames = {
        plumbing: "אינסטלטור",
        electrical: "חשמלאי", 
        painting: "צבעי",
        carpentry: "נגר"
    };

    const responseTimeMap = {
        within_hour: "תוך שעה",
        within_2_hours: "תוך שעתיים",
        within_3_hours: "תוך 3 שעות"
    };

    return (
        <div className="bg-background text-foreground min-h-screen" dir="rtl">
            <div className="max-w-6xl mx-auto p-4 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Side - General Info */}
                    <div className="order-2 lg:order-1">
                        <Card className="bg-card border border-border rounded-2xl">
                            <CardHeader>
                                <CardTitle className="text-2xl font-extrabold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent mb-4">מידע כללי</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 text-base">
                                {professional.rating && (
                                    <div className="flex items-center gap-3">
                                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                        <span className="font-bold text-foreground text-lg">{professional.rating.toFixed(1)}</span>
                                        <span className="text-muted-foreground">({professional.review_count} ביקורות)</span>
                                    </div>
                                )}
                                
                                {professional.years_experience && (
                                    <div className="flex items-center gap-3">
                                        <Award className="w-5 h-5 text-cyan-400" />
                                        <span className="text-muted-foreground">{professional.years_experience} שנות ניסיון</span>
                                    </div>
                                )}
                                
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-5 h-5 text-cyan-400" />
                                    <div className="text-muted-foreground">
                                        <div className="text-sm text-muted-foreground">אזורי שירות:</div>
                                        <div>{professional.service_areas?.join(', ')}</div>
                                    </div>
                                </div>
                                
                                {professional.response_time && (
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-5 h-5 text-cyan-400" />
                                        <span className="text-muted-foreground">זמן תגובה: {responseTimeMap[professional.response_time] || professional.response_time}</span>
                                    </div>
                                )}
                                
                                {professional.verified_reviews && (
                                    <div className="flex items-center gap-3 text-green-700">
                                        <ShieldCheck className="w-5 h-5" /> 
                                        <span>ביקורות מאומתת</span>
                                    </div>
                                )}
                                
                                {professional.verified_background && (
                                    <div className="flex items-center gap-3 text-green-700">
                                        <ShieldCheck className="w-5 h-5" /> 
                                        <span>רקע מאומת</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Side - Professional Details */}
                    <div className="order-1 lg:order-2">
                        <Card className="bg-card border border-border rounded-2xl">
                            <CardContent className="p-8">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex-1">
                                        <h1 className="text-3xl font-bold text-foreground mb-4">{professional.business_name}</h1>
                                        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">{professional.bio}</p>
                                        
                                        {/* Specialty Badge */}
                                        <div className="mb-6">
                                            {professional.specialties?.slice(0, 1).map(spec => (
                                                <Badge 
                                                    key={spec} 
                                                    className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-0 px-4 py-2 text-sm rounded-full"
                                                >
                                                    {categoryNames[spec] || spec}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="relative mr-6">
                                        <Avatar className="w-20 h-20 border-3 border-cyan-500/50">
                                            <AvatarImage src={professional.profile_photo} />
                                            <AvatarFallback className="bg-gradient-to-br from-cyan-600 to-blue-600 text-white font-bold text-2xl">
                                                {professional.business_name?.[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        {/* Gold achievement badge */}
                                        {professional.rating && professional.rating > 4.5 && (
                                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-2 border-gray-900">
                                                <Award className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <Button 
                                    onClick={() => navigate(createPageUrl("Messages") + `?newChat=${professional.id}&name=${encodeURIComponent(professional.business_name)}`)} 
                                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl py-4 text-lg transition-all duration-300 hover:scale-105 shadow-lg"
                                >
                                    <Send className="w-5 h-5 ml-2" />
                                    שלח בקשה להצעת מחיר
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}