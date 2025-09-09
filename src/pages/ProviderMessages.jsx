import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Message, User, Professional, Issue } from '@/api/entities';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send, Phone, Video, MoreVertical, Search, ArrowLeft, Clock, MapPin, DollarSign, User as UserIcon, Users, Briefcase, MessageCircle, Store, Wrench, Home, Camera, Image as ImageIcon, FileText } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from 'date-fns';
import { CartIcon, Cart } from '@/components/ui/cart';
import { WazeButton } from '@/components/ui/waze-button';
import { createPageUrl } from '@/utils';

export default function ProviderMessagesPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, userType } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [activeConversationId, setActiveConversationId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isChatVisible, setIsChatVisible] = useState(false);
    const [showActionsBar, setShowActionsBar] = useState(false);
    const [viewMode, setViewMode] = useState('messages'); // 'messages' | 'requests'
    const handleFakeActionClick = () => {
        try {
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate(12);
            }
        } catch (_) { /* no-op */ }
        setShowActionsBar(false);
    };
    


    // Check if we need to open a specific conversation from URL params and set view mode
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const conversationId = urlParams.get('conversationId');
        const requestId = urlParams.get('requestId');
        const autostart = urlParams.get('autostart') === '1';
        const mode = urlParams.get('mode');
        if (mode === 'requests') setViewMode('requests'); else setViewMode('messages');
        
        if (conversationId || requestId) {
            // Auto-open conversation if specified
            setActiveConversationId(conversationId || requestId);
            setIsChatVisible(true);
            // If autostart is requested, send a friendly first message
            if (autostart) {
                setTimeout(() => {
                    setNewMessage('היי! קיבלתי את הפנייה שלך ואשמח לעזור. מתי נוח לך שנדבר?');
                }, 0);
            }
        }
    }, [location]);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                // Create sample conversation data for service provider
                const sampleConversations = [
                    {
                        id: 'conv-1',
                        clientId: 'client-1',
                        relatedRequestId: 'req-1',
                        lastMessage: {
                            message: "תודה שהסכמת לטפל בבקשה! מתי אתה זמין לבוא לבדוק?",
                            created_date: new Date().toISOString(),
                            sender_id: 'client-1'
                        },
                        unreadCount: 2,
                        client: {
                            id: 'client-1',
                            name: 'יוני כהן',
                            profile_photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
                        },
                        request: {
                            id: 'req-1',
                            title: 'תיקון דליפה במטבח',
                            category: 'אינסטלציה',
                            urgency: 'דחוף',
                            budgetMin: 200,
                            budgetMax: 500,
                            location: 'תל אביב',
                            description: 'יש דליפה מהברז במטבח שצריך תיקון מיידי'
                        }
                    },
                    {
                        id: 'conv-2',
                        clientId: 'client-2',
                        relatedRequestId: 'req-2',
                        lastMessage: {
                            message: "מצוין! אני מחכה לך מחר ב-9 בבוקר",
                            created_date: new Date(Date.now() - 3600000).toISOString(),
                            sender_id: 'client-2'
                        },
                        unreadCount: 0,
                        client: {
                            id: 'client-2',
                            name: 'שרה לוי',
                            profile_photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b977?w=150&h=150&fit=crop&crop=face'
                        },
                        request: {
                            id: 'req-2',
                            title: 'הקמת מערכת השקיה',
                            category: 'גינון',
                            urgency: 'בינוני',
                            budgetMin: 800,
                            budgetMax: 1500,
                            location: 'רמת גן',
                            description: 'רוצה להקים מערכת השקיה אוטומטית בגינה'
                        }
                    },
                    {
                        id: 'conv-3',
                        clientId: 'client-3',
                        relatedRequestId: 'req-3',
                        lastMessage: {
                            message: "איך ההתקדמות? יש עדכון על מועד ההתחלה?",
                            created_date: new Date(Date.now() - 86400000).toISOString(),
                            sender_id: 'client-3'
                        },
                        unreadCount: 1,
                        client: {
                            id: 'client-3',
                            name: 'דוד מזרחי',
                            profile_photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
                        },
                        request: {
                            id: 'req-3',
                            title: 'שיפוץ חדר שינה',
                            category: 'שיפוצים',
                            urgency: 'נמוך',
                            budgetMin: 3000,
                            budgetMax: 6000,
                            location: 'חיפה',
                            description: 'שיפוץ מלא של חדר שינה כולל צביעה ורצפה'
                        }
                    }
                ];

                setConversations(sampleConversations);
                // Seed pending requests list
                setPendingRequests([
                    {
                        id: 'req-11',
                        client: { id: 'client-11', name: 'אורי מימון', profile_photo: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=150&h=150&fit=crop&crop=face' },
                        request: { title: 'הגדרת ראוטר חדש', category: 'תיקון מחשבים', urgency: 'בינוני', budgetMin: 150, budgetMax: 250, location: 'פתח תקווה', description: 'נתב חדש בבית, צריך הגדרה ואבטחה' }
                    },
                    {
                        id: 'req-12',
                        client: { id: 'client-12', name: 'נוי כהן', profile_photo: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=150&h=150&fit=crop&crop=face' },
                        request: { title: 'התקנת נקודת חשמל נוספת', category: 'חשמל', urgency: 'דחוף', budgetMin: 300, budgetMax: 600, location: 'גבעתיים', description: 'נדרש להוסיף נקודת חשמל בסלון' }
                    }
                ]);
                
                // Auto-select conversation from URL or first one
                const urlParams = new URLSearchParams(location.search);
                const targetId = urlParams.get('conversationId') || urlParams.get('requestId');
                const targetConversation = targetId 
                    ? sampleConversations.find(c => c.id === targetId || c.relatedRequestId === targetId)
                    : sampleConversations[0];
                
                if (targetConversation) {
                    setActiveConversationId(targetConversation.id);
                    loadConversationMessages(targetConversation.id, sampleConversations);
                }

            } catch (error) {
                console.error("Failed to load messages:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [location]);

    const loadConversationMessages = (conversationId, allConversations = conversations) => {
        const activeConv = allConversations.find(c => c.id === conversationId);
        if (!activeConv) return;

        // Sample messages based on conversation
        const sampleMessages = [
            {
                id: 'msg-1',
                message: `שלום ${activeConv.client.name}! קיבלתי את הבקשה שלך לגבי "${activeConv.request.title}". יש לי ניסיון רב בתחום ואשמח לעזור.`,
                created_date: new Date(Date.now() - 7200000).toISOString(),
                sender_id: user?.id
            },
            {
                id: 'msg-2',
                message: "שלום! זה נשמע מעולה. מה הזמינות שלך השבוע?",
                created_date: new Date(Date.now() - 5400000).toISOString(),
                sender_id: activeConv.client.id
            },
            {
                id: 'msg-3',
                message: activeConv.lastMessage.message,
                created_date: activeConv.lastMessage.created_date,
                sender_id: activeConv.lastMessage.sender_id
            }
        ];

        setMessages(sampleMessages);
        
        // Mark conversation as read
        setConversations(prev => prev.map(conv => 
            conv.id === conversationId 
                ? { ...conv, unreadCount: 0 }
                : conv
        ));
    };

    const handleConversationClick = (conversationId) => {
        setActiveConversationId(conversationId);
        loadConversationMessages(conversationId);
        setIsChatVisible(true);
        
        // Update URL without page reload
        const newUrl = `/ProviderMessages?conversationId=${conversationId}`;
        window.history.replaceState({}, '', newUrl);
    };

    const approveRequest = (reqId) => {
        const req = pendingRequests.find(r => r.id === reqId);
        if (!req) return;
        const newConvId = `conv-from-${reqId}`;
        const newConv = {
            id: newConvId,
            clientId: req.client.id,
            relatedRequestId: req.id,
            lastMessage: {
                message: 'ברוך הבא לצ׳אט! קיבלתי את הבקשה שלך.',
                created_date: new Date().toISOString(),
                sender_id: user?.id
            },
            unreadCount: 0,
            client: req.client,
            request: {
                id: req.id,
                title: req.request.title,
                category: req.request.category,
                urgency: req.request.urgency,
                budgetMin: req.request.budgetMin,
                budgetMax: req.request.budgetMax,
                location: req.request.location,
                description: req.request.description
            }
        };
        setConversations(prev => [newConv, ...prev]);
        setPendingRequests(prev => prev.filter(r => r.id !== reqId));
        navigate('/ProviderMessages?mode=messages&conversationId=' + newConvId);
    };

    const handleBackToList = () => {
        setIsChatVisible(false);
        // Clear URL params
        window.history.replaceState({}, '', '/ProviderMessages');
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConversationId) return;

        const newMsg = {
            id: 'msg-' + Date.now(),
            message: newMessage,
            created_date: new Date().toISOString(),
            sender_id: user?.id
        };

        setMessages(prev => [...prev, newMsg]);
        setNewMessage('');

        // Update last message in conversation
        setConversations(prev => prev.map(conv =>
            conv.id === activeConversationId
                ? {
                    ...conv,
                    lastMessage: {
                        message: newMessage,
                        created_date: new Date().toISOString(),
                        sender_id: user?.id
                    }
                }
                : conv
        ));
    };

    const activeConvDetails = conversations.find(c => c.id === activeConversationId);

    const filteredConversations = conversations.filter(conv =>
        conv.client?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.request?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.request?.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-background text-foreground flex pb-20" dir="rtl">
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
            
            

            {/* Sidebar - Conversations & Requests */}
            <div className={`w-full md:w-96 bg-card/70 backdrop-blur-xl border-l border-border flex-col ${isChatVisible ? 'hidden md:flex' : 'flex'}`}>
                {/* Header */}
                <div className="p-6 border-b border-border">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex gap-2">
                            <Button variant={viewMode === 'messages' ? 'default' : 'outline'} size="sm" onClick={() => navigate('/ProviderMessages?mode=messages')} className={`${viewMode==='messages' ? 'bg-primary text-primary-foreground' : 'text-foreground border-border'} rounded-full`}>
                                הודעות
                            </Button>
                            <Button variant={viewMode === 'requests' ? 'default' : 'outline'} size="sm" onClick={() => navigate('/ProviderMessages?mode=requests')} className={`${viewMode==='requests' ? 'bg-primary text-primary-foreground' : 'text-foreground border-border'} rounded-full`}>
                                בקשות
                            </Button>
                        </div>
                        {viewMode === 'requests' && (
                            <Badge className="bg-cyan-500/20 text-cyan-700 border-cyan-500/30">
                                {pendingRequests.length}
                            </Badge>
                        )}
                    </div>
                    
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        <Input
                            placeholder="חיפוש לקוחות ופרויקטים..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-secondary/60 border-border text-foreground placeholder:text-muted-foreground rounded-full pr-10 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        />
                    </div>
                </div>
                
                {/* List */}
                <div className="flex-1 overflow-y-auto">
                    {viewMode === 'messages' ? filteredConversations.map(conv => (
                        <div key={conv.id} 
                             onClick={() => handleConversationClick(conv.id)}
                             className={`p-4 cursor-pointer transition-all duration-200 border-b border-border hover:bg-accent/50 ${
                                 activeConversationId === conv.id 
                                     ? 'bg-gradient-to-l from-cyan-500/15 to-blue-500/15 border-r-4 border-r-cyan-500' 
                                     : ''
                             }`}>
                            <div className="flex gap-3 items-start">
                                <div className="relative">
                                    <Avatar className="w-12 h-12 border-2 border-border">
                                        <AvatarImage src={conv.client?.profile_photo} />
                                        <AvatarFallback className="bg-gray-200 text-gray-700 font-bold">
                                            {conv.client?.name?.[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-extrabold text-foreground truncate">{conv.client?.name}</h3>
                                        <span className="text-xs text-muted-foreground">
                                            {format(new Date(conv.lastMessage.created_date), 'HH:mm')}
                                        </span>
                                    </div>
                                    
                                    {/* Request Info */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="outline" className="text-xs bg-cyan-500/10 border-cyan-500/30 text-cyan-700">
                                            {conv.request?.category}
                                        </Badge>
                                        <Badge variant="outline" className={`text-xs ${
                                            conv.request?.urgency === 'דחוף' ? 'bg-red-500/10 border-red-500/30 text-red-600' :
                                            conv.request?.urgency === 'בינוני' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-600' :
                                            'bg-green-500/10 border-green-500/30 text-green-600'
                                        }`}>
                                            {conv.request?.urgency}
                                        </Badge>
                                    </div>
                                    
                                    <h4 className="text-sm font-medium text-foreground mb-1">{conv.request?.title}</h4>
                                    <p className="text-xs text-muted-foreground truncate">{conv.lastMessage.message}</p>
                                    
                                    {/* Quick Info */}
                                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            <span>{conv.request?.location}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <DollarSign className="w-3 h-3" />
                                            <span>₪{conv.request?.budgetMin}-{conv.request?.budgetMax}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {conv.unreadCount > 0 && (
                                    <Badge className="bg-cyan-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
                                        {conv.unreadCount}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    )) : (
                        pendingRequests.map(req => (
                            <div key={req.id} className="p-4 border-b border-border">
                                <div className="flex gap-3 items-start">
                                    <Avatar className="w-12 h-12 border border-border">
                                        <AvatarImage src={req.client?.profile_photo} />
                                        <AvatarFallback className="bg-gray-200 text-gray-700 font-bold">
                                            {req.client?.name?.[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-1">
                                            <h3 className="font-extrabold text-foreground truncate">{req.client?.name}</h3>
                                            <Badge variant="outline" className={`text-xs ${
                                                req.request?.urgency === 'דחוף' ? 'bg-red-500/10 border-red-500/30 text-red-600' :
                                                req.request?.urgency === 'בינוני' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-600' :
                                                'bg-green-500/10 border-green-500/30 text-green-600'
                                            }`}>
                                                {req.request?.urgency}
                                            </Badge>
                                        </div>
                                        <h4 className="text-sm font-medium text-foreground mb-1">{req.request?.title}</h4>
                                        <p className="text-xs text-muted-foreground mb-2">{req.request?.description}</p>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <MapPin className="w-3 h-3" />
                                            <span>{req.request?.location}</span>
                                            <DollarSign className="w-3 h-3 ml-2" />
                                            <span>₪{req.request?.budgetMin}-{req.request?.budgetMax}</span>
                                        </div>
                                        <div className="mt-3 flex gap-2">
                                            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => approveRequest(req.id)}>אשר והעבר להודעות</Button>
                                            <Button size="sm" variant="outline" className="border-border text-foreground hover:bg-accent">דחה</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                    
                    {(viewMode==='messages' ? filteredConversations.length === 0 : pendingRequests.length === 0) && (
                        <div className="p-8 text-center text-muted-foreground">
                            <UserIcon className="w-12 h-12 mx-auto mb-3" />
                            <h3 className="font-medium mb-1">{viewMode==='messages' ? 'אין שיחות' : 'אין בקשות ממתינות'}</h3>
                            <p className="text-sm">{viewMode==='messages' ? 'שיחות עם לקוחות יופיעו כאן' : 'כאשר תאשר בקשה, היא תועבר לכאן כשיחה'}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Window */}
            <div className={`flex-1 flex-col bg-background/50 backdrop-blur-xl ${!isChatVisible ? 'hidden md:flex' : 'flex'}`}>
                {activeConvDetails ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-border bg-background/60 backdrop-blur-xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Button variant="ghost" size="icon" className="md:hidden" onClick={handleBackToList}>
                                        <ArrowLeft className="w-5 h-5" />
                                    </Button>
                                    
                                    <Avatar className="w-10 h-10 border border-border">
                                        <AvatarImage src={activeConvDetails.client?.profile_photo} />
                                        <AvatarFallback className="bg-gray-200 text-gray-700 font-bold">
                                            {activeConvDetails.client?.name?.[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    
                                    <div>
                                        <h2 className="font-extrabold text-foreground">{activeConvDetails.client?.name}</h2>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <span className="text-sm text-green-600">פעיל עכשיו</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" className="hover:bg-accent rounded-full">
                                        <Phone className="w-5 h-5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="hover:bg-accent rounded-full">
                                        <Video className="w-5 h-5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="hover:bg-accent rounded-full">
                                        <MoreVertical className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                        
                        {/* Messages */}
                        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                            {/* Request Context */}
                            <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl p-4 border border-cyan-500/30">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                                    <span className="text-cyan-700 font-medium text-sm">פרטי הבקשה</span>
                                </div>
                                <h3 className="text-foreground font-semibold mb-2">{activeConvDetails.request?.title}</h3>
                                <p className="text-muted-foreground text-sm mb-3">{activeConvDetails.request?.description}</p>
                                
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-cyan-600" />
                                        <span className="text-sm text-muted-foreground">{activeConvDetails.request?.location}</span>
                                        <WazeButton
                                            address={activeConvDetails.request?.location}
                                            variant="outline"
                                            size="sm"
                                            label="נווט ב‑Waze"
                                            className="border-cyan-500/30 text-cyan-600 hover:bg-cyan-500/10 hover:border-cyan-500/50"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-cyan-600" />
                                        <span className="text-sm text-muted-foreground">₪{activeConvDetails.request?.budgetMin}-{activeConvDetails.request?.budgetMax}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-cyan-600" />
                                        <span className="text-sm text-muted-foreground">דחיפות: {activeConvDetails.request?.urgency}</span>
                                    </div>
                                    <Badge className="w-fit bg-cyan-500/15 text-cyan-700 border-cyan-500/30">
                                        {activeConvDetails.request?.category}
                                    </Badge>
                                </div>
                            </div>
                            
                            {messages.map(msg => (
                                <div key={msg.id} className={`flex gap-3 ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                                    {msg.sender_id !== user?.id && (
                                        <Avatar className="w-8 h-8 border border-border">
                                            <AvatarImage src={activeConvDetails.client?.profile_photo} />
                                            <AvatarFallback className="bg-gray-200 text-gray-700 text-xs font-bold">
                                                {activeConvDetails.client?.name?.[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                    
                                    <div className={`max-w-xs lg:max-w-md p-4 rounded-2xl ${
                                        msg.sender_id === user?.id 
                                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-br-lg' 
                                            : 'bg-secondary/60 text-foreground rounded-bl-lg border border-border'
                                    }`}>
                                        <p className="mb-1">{msg.message}</p>
                                        <p className={`text-xs ${
                                            msg.sender_id === user?.id ? 'text-cyan-100' : 'text-muted-foreground'
                                        }`}>
                                            {format(new Date(msg.created_date), 'HH:mm')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Message Input */}
                        <div className="p-4 border-t border-border bg-background/60 backdrop-blur-xl">
                            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                                <Popover open={showActionsBar} onOpenChange={setShowActionsBar}>
                                    <PopoverTrigger asChild>
                                        <button
                                            type="button"
                                            aria-label="Add attachment"
                                            className="flex-shrink-0 transition-transform duration-300 hover:scale-110 active:scale-95"
                                        >
                                            <img
                                                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/1a6b7a1e7_image.png"
                                                alt="Add"
                                                className="w-12 h-12"
                                            />
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent side="top" align="center" className="border-white/20 bg-white/10 backdrop-blur-xl p-3 rounded-2xl w-56 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                                        <div className="flex flex-col gap-2">
                                            <Button type="button" onClick={handleFakeActionClick} variant="ghost" className="w-full justify-start gap-3 text-white bg-white/5 rounded-xl px-4 py-3 border border-white/20 shadow-[0_12px_20px_-8px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.35)] hover:bg-white/10 hover:-translate-y-0.5 active:translate-y-0 transition-all">
                                                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.6),_0_8px_18px_rgba(0,163,255,0.35)]">
                                                    <Camera className="w-5 h-5" />
                                                </span>
                                                <span className="font-medium">מצלמה</span>
                                            </Button>
                                            <Button type="button" onClick={handleFakeActionClick} variant="ghost" className="w-full justify-start gap-3 text-white bg-white/5 rounded-xl px-4 py-3 border border-white/20 shadow-[0_12px_20px_-8px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.35)] hover:bg-white/10 hover:-translate-y-0.5 active:translate-y-0 transition-all">
                                                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-fuchsia-400 to-purple-500 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.6),_0_8px_18px_rgba(216,112,255,0.35)]">
                                                    <ImageIcon className="w-5 h-5" />
                                                </span>
                                                <span className="font-medium">גלריה</span>
                                            </Button>
                                            <Button type="button" onClick={handleFakeActionClick} variant="ghost" className="w-full justify-start gap-3 text-white bg-white/5 rounded-xl px-4 py-3 border border-white/20 shadow-[0_12px_20px_-8px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.35)] hover:bg-white/10 hover:-translate-y-0.5 active:translate-y-0 transition-all">
                                                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.6),_0_8px_18px_rgba(255,193,7,0.35)]">
                                                    <FileText className="w-5 h-5" />
                                                </span>
                                                <span className="font-medium">מסמכים</span>
                                            </Button>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                                
                                <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-300 rounded-full py-2 px-4 shadow-2xl">
                                    <div className="flex items-center gap-2">
                                        <Input 
                                            value={newMessage} 
                                            onChange={e => setNewMessage(e.target.value)} 
                                            placeholder="הקלד הודעה ללקוח..." 
                                            className="flex-1 bg-transparent border-0 text-gray-800 placeholder:text-gray-500 focus:ring-0 focus:outline-none text-right text-base font-medium"
                                        />
                                        <Button 
                                            type="submit" 
                                            size="icon" 
                                            className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-lg shadow-cyan-500/25 flex-shrink-0"
                                            disabled={!newMessage.trim()}
                                        >
                                            <Send className="w-5 h-5"/>
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Actions Popover handled above */}
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                                <Send className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <p className="font-semibold mb-1">בחר שיחה עם לקוח</p>
                            <p className="text-sm">בחר שיחה כדי להתחיל לתקשר עם הלקוח</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Cart is provided globally in Layout.jsx; removed page-level duplicates */}


        </div>
    );
}