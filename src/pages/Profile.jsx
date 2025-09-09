
import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    ChevronLeft,
    ChevronRight,
    Settings,
    HelpCircle,
    User as UserIcon,
    CreditCard,
    LogOut,
    Home,
    ArrowRight,
    MapPin,
    Clock,
    DollarSign,
    Shield,
    Edit,
    Star,
    CheckCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from '@/components/ui/ThemeToggle';
// Helper function to create page URLs
const createPageUrl = (pageName) => `/${pageName}`;

export default function ProfilePage() {
    const navigate = useNavigate();
    const { userType } = useAuth();
    const { theme, setTheme } = useTheme();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Mock data for professional service provider
                const mockUser = {
                    full_name: "טכנאי מחשבים מקצועי",
                    email: "technician@example.com",
                    profile_picture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
                    years_experience: 8,
                    review_count: 167,
                    rating: 4.8,
                    service_areas: "תל אביב, רמת גן, גבעתיים, קריית אונו, רמת השרון",
                    response_time: "תוך שעתיים",
                    hourly_rate: "₪120/שעה",
                    certifications: [
                        { name: "רקע מאומת", verified: true },
                        { name: "ביקורות מאומתות", verified: true },
                        { name: "ביטוח מאומת", verified: true }
                    ]
                };
                setUser(mockUser);
            } catch (error) {
                console.error("Failed to load profile data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const InfoCard = ({ title, icon: Icon, content, children, onEdit }) => (
        <div className="bg-gray-800/60 border border-gray-700/50 rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-white font-medium">{title}</h3>
                </div>
                {onEdit && (
                    <button 
                        onClick={onEdit}
                        className="flex items-center gap-1 text-cyan-400 text-sm hover:text-cyan-300 transition-colors"
                    >
                        <Edit className="w-4 h-4" />
                        ערוך
                    </button>
                )}
            </div>
            {content && <p className="text-gray-300 text-sm">{content}</p>}
            {children}
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-black text-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
            </div>
        );
    }
    
    if (!user) {
        return <div className="flex items-center justify-center h-screen bg-black text-white">לא נמצא משתמש.</div>;
    }

    // Different layouts for client vs service provider
    if (userType !== 'service_provider') {
        // Simple client profile layout
        const menuItems = [
            { title: 'מידע אישי', icon: UserIcon, path: createPageUrl('Account') },
            { title: 'אמצעי תשלום', icon: CreditCard, path: createPageUrl('PaymentMethods') },
            { title: 'הגדרות', icon: Settings, path: createPageUrl('Settings') },
            { title: 'עזרה ותמיכה', icon: HelpCircle, path: createPageUrl('HelpSupport') },
        ];

        return (
            <div className="bg-background min-h-screen text-foreground" dir="rtl">
                

                {/* Theme toggle - top right side */}
                <div className="fixed top-4 right-4 z-[70] select-none">
                    <ThemeToggle />
                </div>

                <div className="max-w-md mx-auto p-6 pt-24">
                    {/* Profile Header */}
                    <div className="flex flex-col items-center text-center mb-8">
                        <Avatar className="w-24 h-24 border-4 border-cyan-500/50 shadow-lg shadow-cyan-500/10 mb-4">
                            <AvatarImage src={user.profile_picture} />
                            <AvatarFallback className="bg-gray-800 text-white text-2xl">{user.full_name?.[0]}</AvatarFallback>
                        </Avatar>
                        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent mb-1">{user.full_name?.split(' ')[0]}</h1>
                        <p className="text-primary text-sm font-medium mb-3">{user.email}</p>
                    </div>

                    {/* Menu List */}
                    <div className="space-y-4">
                        {menuItems.map((item, idx) => (
                            <Button
                                key={idx}
                                onClick={() => navigate(item.path)}
                                variant="ghost"
                                className="w-full flex justify-between items-center bg-gray-800/60 hover:bg-gray-700/60 border border-gray-700/50 rounded-2xl px-4 py-6 text-white"
                            >
                                <div className="flex items-center gap-3 text-lg">
                                    <ChevronLeft className="w-4 h-4 text-gray-400" />
                                    <span>{item.title}</span>
                                </div>
                                <item.icon className="w-5 h-5 text-cyan-400" />
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Service provider detailed profile layout
    return (
        <div className="bg-background min-h-screen text-foreground" dir="rtl">
            {/* Navigation Arrows */}
            <div className="fixed top-4 left-4 z-50">
                <Button
                    variant="ghost"
                    size="icon"
                    className="bg-gray-900/90 hover:bg-cyan-600/90 border border-gray-600 text-cyan-400 hover:text-white rounded-full backdrop-blur-sm transition-all duration-300"
                >
                    <ChevronLeft className="h-5 w-5" />
                </Button>
            </div>
            
            

            {/* Theme toggle - top right side; hide when cart is open to avoid overlap */}
            <div className={`fixed top-4 right-4 z-[70] select-none hide-when-cart-open`}> 
                <ThemeToggle />
            </div>
            
            <div className="max-w-md mx-auto p-6 pt-16">
                {/* Profile Header */}
                <div className="flex flex-col items-center text-center mb-8">
                    <Avatar className="w-24 h-24 border-4 border-cyan-500/50 shadow-lg shadow-cyan-500/10 mb-4">
                        <AvatarImage src={user.profile_picture} />
                        <AvatarFallback className="bg-gray-800 text-white text-2xl">{user.full_name?.[0]}</AvatarFallback>
                    </Avatar>
                    <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent mb-1">{user.full_name}</h1>
                    <p className="text-primary text-sm font-medium mb-3">{user.email}</p>
                    
                    {/* Experience and Rating */}
                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                            <UserIcon className="w-4 h-4 text-primary" />
                            <span className="text-primary font-medium">{user.years_experience} שנים</span>
                            <span className="text-primary font-medium">({user.review_count})</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-primary font-semibold">{user.rating}</span>
                        </div>
                    </div>
                </div>

                {/* Information Cards */}
                <div className="space-y-4">
                    <InfoCard 
                        title="אזורי שירות" 
                        icon={MapPin} 
                        content={user.service_areas}
                        onEdit={() => console.log('Edit service areas')}
                    />
                    
                    <InfoCard 
                        title="זמן תגובה" 
                        icon={Clock} 
                        content={user.response_time}
                        onEdit={() => console.log('Edit response time')}
                    />
                    
                    <InfoCard 
                        title="תעריף שעתי" 
                        icon={DollarSign} 
                        content={user.hourly_rate}
                        onEdit={() => console.log('Edit hourly rate')}
                    />
                    
                    <InfoCard 
                        title="אישורים" 
                        icon={Shield}
                        onEdit={() => console.log('Edit certifications')}
                    >
                        <div className="space-y-2">
                            {user.certifications.map((cert, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                    <span className="text-gray-300 text-sm">{cert.name}</span>
                                </div>
                            ))}
                        </div>
                    </InfoCard>
                    
                    <InfoCard 
                        title="מידע מקצועי" 
                        icon={UserIcon}
                        onEdit={() => console.log('Edit professional info')}
                    />
                    
                    <InfoCard 
                        title="אישורים" 
                        icon={Shield}
                        onEdit={() => console.log('Edit certifications 2')}
                    />
                    
                    <InfoCard 
                        title="אמצעי תשלום" 
                        icon={CreditCard}
                        onEdit={() => console.log('Edit payment methods')}
                    />
                    
                    
                    
                    <InfoCard 
                        title="עזרה ותמיכה" 
                        icon={HelpCircle}
                        onEdit={() => console.log('Edit help and support')}
                    />
                </div>
            </div>
        </div>
    );
}

