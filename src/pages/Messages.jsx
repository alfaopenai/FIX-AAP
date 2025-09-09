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

export default function MessagesPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, userType } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [activeConversationId, setActiveConversationId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isChatVisible, setIsChatVisible] = useState(false);
    const [showActionsBar, setShowActionsBar] = useState(false);
    const handleFakeActionClick = () => {
        try {
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate(12);
            }
        } catch (_) { /* no-op */ }
        setShowActionsBar(false);
    };
    


    // Check if we need to open a specific conversation from URL params
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const conversationId = urlParams.get('conversationId');
        const requestId = urlParams.get('requestId');
        
        if (conversationId || requestId) {
            // Auto-open conversation if specified
            setActiveConversationId(conversationId || requestId);
            setIsChatVisible(true);
        }
    }, [location]);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                // Sample conversations with service providers
                const sampleConversations = [
                    {
                        id: 'conv-1',
                        providerId: 'provider-1',
                        relatedRequestId: 'req-1',
                        lastMessage: {
                            message: "אני יכול לבוא מחר בשעה 10:00. האם זה מתאים לך?",
                            created_date: new Date().toISOString(),
                            sender_id: 'provider-1'
                        },
                        unreadCount: 2,
                        provider: {
                            id: 'provider-1',
                            name: 'יוני כהן - אינסטלטור',
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
                        providerId: 'provider-2',
                        relatedRequestId: 'req-2',
                        lastMessage: {
                            message: "מצוין! אני מחכה לך מחר ב-9 בבוקר",
                            created_date: new Date(Date.now() - 3600000).toISOString(),
                            sender_id: 'provider-2'
                        },
                        unreadCount: 0,
                        provider: {
                            id: 'provider-2',
                            name: 'שרה לוי - חשמלאית',
                            profile_photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b890?w=150&h=150&fit=crop&crop=face'
                        },
                        request: {
                            id: 'req-2',
                            title: 'הקמת מערכת השקיה',
                            category: 'חשמל',
                            urgency: 'בינוני',
                            budgetMin: 800,
                            budgetMax: 1500,
                            location: 'רמת גן',
                            description: 'התקנת מערכת חשמל חדשה לחלוטין'
                        }
                    },
                    {
                        id: 'conv-3',
                        providerId: 'provider-3',
                        relatedRequestId: 'req-3',
                        lastMessage: {
                            message: "העבודה הושלמה בהצלחה! אשמח על ביקורת",
                            created_date: new Date(Date.now() - 7200000).toISOString(),
                            sender_id: 'provider-3'
                        },
                        unreadCount: 1,
                        provider: {
                            id: 'provider-3',
                            name: 'דוד מזרחי - שיפוצניק',
                            profile_photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face'
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

                const initialConv = sampleConversations[0];
                if (initialConv) {
                    setActiveConversationId(initialConv.id);
                }
            } catch (error) {
                console.error("Failed to load conversations:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // Load messages for active conversation
    useEffect(() => {
        const loadMessages = async () => {
            if (!activeConversationId) return;

            try {
                // Generate sample messages for selected conversation
                const conversation = conversations.find(c => c.id === activeConversationId);
                if (!conversation) return;
                const sampleMessages = [
                    {
                        id: 'msg-1',
                        conversationId: conversation.id,
                        senderId: 'client-1',
                        message: `שלום ${conversation.provider.name}! קיבלתי את ההצעתך לגבי \"${conversation.request.title}\".`,
                        timestamp: new Date(Date.now() - 7200000),
                        senderType: 'client'
                    },
                    {
                        id: 'msg-2',
                        conversationId: conversation.id,
                        senderId: conversation.provider.id,
                        message: conversation.lastMessage.message,
                        timestamp: new Date(conversation.lastMessage.created_date),
                        senderType: 'provider'
                    }
                ];
                setMessages(sampleMessages);
            } catch (error) {
                console.error("Failed to load messages:", error);
            }
        };

        loadMessages();
    }, [activeConversationId]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const message = {
            id: `msg-${Date.now()}`,
            conversationId: activeConversationId,
            senderId: 'client-1',
            message: newMessage,
            timestamp: new Date(),
            senderType: 'client'
        };

        setMessages(prev => [...prev, message]);
        setNewMessage('');
    };

    const filteredConversations = conversations.filter(conv =>
        conv.provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.serviceType.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeConversation = conversations.find(conv => conv.id === activeConversationId);

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('he-IL', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-background text-foreground">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
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
            `}</style>

            {/* Conversations List */}
            <div className={`w-full lg:w-1/3 border-l border-border flex flex-col ${isChatVisible ? 'hidden lg:flex' : 'flex'}`}>
                {/* Header */}
                <div className="p-6 border-b border-border bg-background/40 backdrop-blur-xl">
                    <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent mb-1">שיחות עם נותני שירות</h1>
                    <div className="h-0.5 w-20 ml-auto bg-gradient-to-l from-cyan-500 to-transparent rounded-full mb-3"></div>
                    
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="חיפוש נותני שירות ופניות..."
                            className="bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground pr-12 rounded-xl focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
                        />
                    </div>
                </div>

                {/* Conversations */}
                <div className="flex-1 overflow-y-auto">
                    {filteredConversations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                <MessageCircle className="w-8 h-8 text-gray-600" />
                            </div>
                            <p className="font-semibold text-gray-400 mb-1">אין שיחות</p>
                            <p className="text-gray-500">שיחות עם נותני שירות יופיעו כאן</p>
                        </div>
                    ) : (
                        filteredConversations.map((conversation) => (
                            <div
                                key={conversation.id}
                                onClick={() => {
                                    setActiveConversationId(conversation.id);
                                    setIsChatVisible(true);
                                }}
                                className={`p-4 border-b border-border cursor-pointer hover:bg-accent/50 transition-all duration-200 ${
                                    activeConversationId === conversation.id ? 'bg-gradient-to-l from-cyan-500/15 to-blue-500/15 border-l-4 border-l-cyan-500' : ''
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="relative">
                                        <Avatar className="w-12 h-12 border-2 border-gray-600">
                                            <AvatarImage src={conversation.provider.profile_photo} />
                                            <AvatarFallback className="bg-gray-700 text-white font-bold">
                                                {conversation.provider.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        {conversation.unreadCount > 0 && (
                                            <div className="absolute -top-2 -left-2 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                                                {conversation.unreadCount}
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="font-extrabold text-foreground truncate">{conversation.provider.name}</h3>
                                            <span className="text-xs text-muted-foreground">{formatTime(conversation.lastMessage.created_date)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge variant="outline" className="bg-cyan-500/10 text-cyan-600 border-cyan-400/40 text-xs font-semibold">
                                                {conversation.serviceType}
                                            </Badge>
                                            <Badge className={`text-xs ${
                                                conversation.status === 'פעיל' ? 'bg-green-500/20 text-green-400' :
                                                conversation.status === 'בדרך' ? 'bg-blue-500/20 text-blue-400' :
                                                'bg-gray-500/20 text-gray-400'
                                            }`}>
                                                {conversation.status}
                                            </Badge>
                                        </div>
                                        <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                                            {conversation.lastMessage.message}
                                        </p>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                <span>{conversation.location}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <DollarSign className="w-3 h-3" />
                                                <span>{conversation.budget}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 flex flex-col ${isChatVisible ? 'flex' : 'hidden lg:flex'}`}>
                {activeConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-700/50 bg-gray-900/30 backdrop-blur-xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setIsChatVisible(false)}
                                        className="lg:hidden text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-full"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                    </Button>
                                    
                                    <Avatar className="w-10 h-10 border-2 border-gray-600">
                                        <AvatarImage src={activeConversation.provider.profile_photo} />
                                        <AvatarFallback className="bg-gray-700 text-white font-bold">
                                            {activeConversation.provider.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    
                                    <div>
                                        <h3 className="font-semibold text-white">{activeConversation.provider.name}</h3>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 text-xs">
                                                {activeConversation.serviceType}
                                            </Badge>
                                            <Badge className={`text-xs ${
                                                activeConversation.status === 'פעיל' ? 'bg-green-500/20 text-green-400' :
                                                activeConversation.status === 'בדרך' ? 'bg-blue-500/20 text-blue-400' :
                                                'bg-gray-500/20 text-gray-400'
                                            }`}>
                                                {activeConversation.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-full">
                                        <Phone className="w-5 h-5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-full">
                                        <Video className="w-5 h-5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-full">
                                        <MoreVertical className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {/* Request Context */}
                            {activeConversation?.request && (
                                <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl p-4 border border-cyan-500/30">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                                        <span className="text-cyan-300 font-medium text-sm">פרטי הבקשה</span>
                                    </div>
                                    <h3 className="text-white font-semibold mb-2">{activeConversation.request.title}</h3>
                                    <p className="text-gray-300 text-sm mb-3">{activeConversation.request.description}</p>
                                    <div className="grid grid-cols-2 gap-3">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-cyan-400" />
                                                <span className="text-sm text-gray-300">{activeConversation.request.location}</span>
                                                <WazeButton
                                                    address={activeConversation.request.location}
                                                    variant="outline"
                                                    size="sm"
                                                    label="נווט ב‑Waze"
                                                    className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/50"
                                                />
                                            </div>
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="w-4 h-4 text-cyan-400" />
                                            <span className="text-sm text-gray-300">₪{activeConversation.request.budgetMin}-{activeConversation.request.budgetMax}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-cyan-400" />
                                            <span className="text-sm text-gray-300">דחיפות: {activeConversation.request.urgency}</span>
                                        </div>
                                        <Badge className="w-fit bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                                            {activeConversation.request.category}
                                        </Badge>
                                    </div>
                                </div>
                            )}
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex items-end gap-2 ${
                                        message.senderType === 'client' ? 'justify-end' : 'justify-start'
                                    }`}
                                >
                                    {message.senderType === 'provider' && (
                                        <Avatar className="w-8 h-8 border border-gray-600">
                                            <AvatarImage src={activeConversation.provider.profile_photo} />
                                            <AvatarFallback className="bg-gray-700 text-white text-xs">
                                                {activeConversation.provider.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                    
                                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                                        message.senderType === 'client'
                                            ? 'bg-gradient-to-br from-cyan-500 to-blue-500 text-white rounded-br-sm'
                                            : 'bg-gray-800/80 text-gray-100 rounded-bl-sm border border-gray-700/50'
                                    }`}>
                                        <p className="text-sm leading-relaxed">{message.message}</p>
                                        <p className={`text-xs mt-1 ${
                                            message.senderType === 'client' ? 'text-cyan-100' : 'text-gray-400'
                                        }`}>
                                            {formatTime(message.timestamp)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Message Input */}
                        <div className="p-4 border-t border-gray-700/50 bg-gray-900/30 backdrop-blur-xl">
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
                                            placeholder="הקלד הודעה לנותן השירות..." 
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
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Send className="w-8 h-8 text-gray-600" />
                            </div>
                            <p className="font-semibold text-gray-400 mb-1">בחר שיחה עם נותן שירות</p>
                            <p className="text-gray-500">בחר שיחה כדי להתחיל לתקשר עם נותן השירות</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Cart is provided globally in Layout.jsx; removed page-level duplicates */}

        </div>
    );
}