import React, { useState, useRef, useEffect } from 'react';
import ServiceProviderDashboard from './ServiceProviderDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Camera, Image as ImageIcon, FileText } from 'lucide-react';
// import { InvokeLLM } from '@/api/integrations';

export default function HomePage() {
    const navigate = useNavigate();
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);
    const scrollAreaRef = useRef(null);
    const [showActionsBar, setShowActionsBar] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [conversations, setConversations] = useState(() => ([
        {
            id: 'conv-1',
            title: 'התקנת ראוטר',
            createdAt: Date.now() - 86400000,
            messages: [
                { id: 'u1', text: 'איך מגדירים ראוטר חדש?', sender: 'user' },
                { id: 'a1', text: 'כבה והדלק את המודם, חבר כבל WAN לראוטר וגש לעמוד ההגדרות בכתובת 192.168.1.1.', sender: 'ai' },
            ],
        },
        {
            id: 'conv-2',
            title: 'נזילה בכיור',
            createdAt: Date.now() - 43200000,
            messages: [
                { id: 'u2', text: 'יש נזילה עדינה מתחת לכיור, מה לבדוק קודם?', sender: 'user' },
                { id: 'a2', text: 'בדוק את חיבור ה־P-trap והדק את האומים. אם האטם סדוק, החלף.', sender: 'ai' },
            ],
        },
        {
            id: 'conv-3',
            title: 'צבע לקיר',
            createdAt: Date.now() - 7200000,
            messages: [
                { id: 'u3', text: 'איזה צבע מומלץ לסלון מואר?', sender: 'user' },
                { id: 'a3', text: 'גווני שמנת/אבן בהירים עם גימור eggshell יתנו עומק וניקוי קל.', sender: 'ai' },
            ],
        },
    ]));
    const [activeConversationId, setActiveConversationId] = useState('new');
    const handleFakeActionClick = () => {
        try {
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate(12);
            }
        } catch (_) { /* no-op */ }
        setShowActionsBar(false);
    };

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    };

    useEffect(() => {
        // Scroll to top when component mounts and show default clean view
        window.scrollTo(0, 0);
        setMessages([]);
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        const trimmed = input.trim();
        if (!trimmed) return;

        // If starting from a clean screen, create a new conversation first
        let currentConvId = activeConversationId;
        if (activeConversationId === 'new') {
            currentConvId = 'conv-' + Date.now();
            const newConv = {
                id: currentConvId,
                title: 'שיחה חדשה',
                createdAt: Date.now(),
                messages: [],
            };
            setConversations(prev => [newConv, ...prev]);
            setActiveConversationId(currentConvId);
        }

        // Add user message
        const userMsg = { id: 'user-' + Date.now(), text: trimmed, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        // Reflect in conversation store
        const convIdForSave = currentConvId;
        setConversations(prev => prev.map(c => c.id === convIdForSave ? { ...c, messages: [...c.messages, userMsg] } : c));
        setInput('');

        // Show typing indicator
        setIsThinking(true);

        try {
            // Build conversation context prompt (Hebrew, keep style concise)
            const conversationHistory = [...messages, userMsg]
                .slice(-10)
                .map(m => `${m.sender === 'user' ? 'משתמש' : 'עוזר'}: ${m.text}`)
                .join('\n');

            const systemInstruction = `אתה עוזר בית חכם של Fix. ענה בעברית, בקצרה וברורה, והתאם לסגנון הבועות הקיים בצ'אט. אל תכלול קידוד או תווים מיוחדים לא נחוצים.`;

            const prompt = `${systemInstruction}\n\nשיחה:\n${conversationHistory}\n\nענה להודעה האחרונה של המשתמש בלבד.`;

            const res = await fetch('http://localhost:8787/api/llm/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, model: import.meta.env.VITE_LLM_MODEL || undefined })
            });
            if (!res.ok) throw new Error('LLM request failed');
            const data = await res.json();
            const aiResponseText = data.text || 'מצטער, לא הצלחתי לעבד את הבקשה.';

            const aiMsg = { id: 'ai-' + Date.now(), text: aiResponseText, sender: 'ai' };
            setMessages(prev => [...prev, aiMsg]);
            setConversations(prev => prev.map(c => c.id === convIdForSave ? { ...c, messages: [...c.messages, aiMsg] } : c));
        } catch (error) {
            const aiMsg = { id: 'ai-' + Date.now(), text: 'אירעה שגיאה בעת קבלת תשובת AI. נסו שוב.', sender: 'ai' };
            setMessages(prev => [...prev, aiMsg]);
            setConversations(prev => prev.map(c => c.id === convIdForSave ? { ...c, messages: [...c.messages, aiMsg] } : c));
            // eslint-disable-next-line no-console
            console.error('InvokeLLM failed:', error);
        } finally {
            setIsThinking(false);
        }
    };

    const openConversation = (id) => {
        const target = conversations.find(c => c.id === id);
        if (!target) return;
        setActiveConversationId(id);
        setMessages(target.messages);
        setIsHistoryOpen(false);
        // Scroll to bottom after switching
        setTimeout(scrollToBottom, 50);
    };

    const createNewConversation = () => {
        const id = 'conv-' + Date.now();
        const newConv = {
            id,
            title: 'שיחה חדשה',
            createdAt: Date.now(),
            messages: [],
        };
        setConversations(prev => [newConv, ...prev]);
        setActiveConversationId(id);
        setMessages([]);
        setIsHistoryOpen(false);
        setTimeout(scrollToBottom, 50);
    };

    return (
        <div className="fixed inset-0 bg-background text-foreground overflow-hidden" dir="rtl">
            {/* Fixed Header */}
            <div className="absolute top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
                <div className="flex items-center justify-between p-6 mt-2">
                    <div className="flex items-center gap-2">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="relative w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 border border-gray-700/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                        onClick={() => setIsHistoryOpen(v => !v)}
                        aria-label="היסטוריית צ'אטים"
                    >
                        <div className="flex flex-col gap-1">
                            <div className="w-4 h-0.5 bg-gray-400 rounded-full"></div>
                            <div className="w-3 h-0.5 bg-gray-400 rounded-full"></div>
                            <div className="w-4 h-0.5 bg-gray-400 rounded-full"></div>
                        </div>
                        {/* Notification dot */}
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full border-2 border-black"></div>
                    </Button>
                    <Button 
                        variant="outline" 
                        className="h-12 px-4 border-border text-foreground hover:bg-accent rounded-2xl font-semibold"
                        onClick={createNewConversation}
                    >
                        התחלת שיחה חדשה
                    </Button>
                    </div>
                    
                    <h1 className="text-2xl font-bold text-foreground">Fix</h1>
                    
                    <div className="w-10"></div>
                </div>
            </div>

            {/* Scrollable Messages Area */}
            <div 
                ref={scrollAreaRef}
                className="absolute inset-0 overflow-y-auto px-4 md:px-6" 
                style={{
                    top: '100px', // Height of header + some padding
                    bottom: '270px', // Height of input area + bottom bar + padding
                }}
            >
                <div className="max-w-2xl mx-auto py-4">
                    {/* Welcome Message - Show only when no messages */}
                    {messages.length === 0 && (
                        <div className="flex flex-col justify-center items-center h-full min-h-[400px] text-center">
                            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent animate-fade-in-up mb-8">איך אוכל לעזור לך היום?</h2>
                        </div>
                    )}
                    
                    {/* Chat Messages */}
                    <div className="space-y-4">
                        {messages.map(msg => (
                            <div 
                                key={msg.id} 
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
                            >
                                <div className={`${
                                    msg.sender === 'user' 
                                        ? 'bg-gradient-to-br from-cyan-500 to-blue-500 rounded-br-none text-white' 
                                        : 'bg-secondary rounded-bl-none text-foreground'
                                } px-4 py-3 rounded-2xl shadow-lg max-w-[80%] whitespace-pre-line break-words`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isThinking && (
                            <div className="flex justify-start animate-fade-in-up">
                                <div className="bg-secondary text-foreground px-4 py-3 rounded-2xl rounded-bl-none shadow-lg max-w-[80%]">
                                    <div className="flex items-center gap-1" aria-label="AI is typing">
                                        <span className="typing-dot" />
                                        <span className="typing-dot" />
                                        <span className="typing-dot" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div ref={messagesEndRef} className="h-4"></div>
                </div>
            </div>

            {/* Right-side Chat History Drawer */}
            <div className={`fixed top-[84px] bottom-0 right-0 z-40 w-80 max-w-[85vw] bg-background/95 border-l border-border backdrop-blur-xl transform transition-transform duration-300 ${isHistoryOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-4 border-b border-border flex items-center justify-between">
                    <h3 className="text-lg font-semibold">היסטוריית צ'אטים</h3>
                    <Button variant="ghost" size="sm" onClick={() => setIsHistoryOpen(false)} className="text-muted-foreground hover:text-foreground">סגור</Button>
                </div>
                <div className="overflow-y-auto h-full p-2 pb-24">
                    {conversations.map(conv => {
                        const last = conv.messages[conv.messages.length - 1];
                        const preview = (last?.text || '').slice(0, 50);
                        const active = conv.id === activeConversationId;
                        return (
                            <button key={conv.id} onClick={() => openConversation(conv.id)} className={`w-full text-right p-3 rounded-xl border transition-colors mb-2 ${active ? 'border-cyan-500/50 bg-cyan-500/10' : 'border-border hover:bg-accent/10'}`}>
                                <div className="text-sm text-muted-foreground font-semibold mb-1 truncate">{conv.title}</div>
                                <div className="text-xs text-muted-foreground truncate">{preview}</div>
                            </button>
                        );
                    })}
                </div>
            </div>
            
            {/* Fixed Bottom Input Area */}
            <div className="absolute left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border p-6" style={{ bottom: '170px' }}>
                <div className="max-w-2xl mx-auto">
                    <div className="relative">
                        <div className="flex items-center gap-2">
                            {/* Plus Button with Popover */}
                            <Popover open={showActionsBar} onOpenChange={setShowActionsBar}>
                                <PopoverTrigger asChild>
                                    <button 
                                        type="button"
                                        className="flex-shrink-0 transition-transform duration-300 hover:scale-110 active:scale-95"
                                        aria-label="Add attachment"
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
                            
                            {/* Chat Bubble Container */}
                            <div className="chat-bubble-container flex-1 bg-gradient-to-br from-gray-100 to-gray-300 rounded-full py-2 px-4 shadow-2xl">
                                {/* Input Content */}
                                <div className="flex items-center gap-2">
                                    {/* Input Field */}
                                    <Input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="מה הבעיה.."
                                        className="flex-1 bg-transparent border-0 text-gray-800 placeholder:text-gray-500 focus:ring-0 focus:outline-none text-right text-base font-medium"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage();
                                            }
                                        }}
                                    />
                                    
                                    {/* Send Button */}
                                    <button 
                                        onClick={handleSendMessage}
                                        className="flex-shrink-0 transition-transform duration-300 hover:scale-110 active:scale-95"
                                        aria-label="Send message"
                                    >
                                        <img 
                                            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/1e373d855_image.png" 
                                            alt="Send" 
                                            className="w-8 h-8" 
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .chat-bubble-container {
                    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                    box-shadow: 
                        0 25px 50px -12px rgba(0, 0, 0, 0.25),
                        0 0 0 1px rgba(255, 255, 255, 0.05),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(20px);
                    transform: translateZ(0);
                }
                
                .chat-bubble-container:hover {
                    transform: translateY(-2px) translateZ(0);
                    box-shadow: 
                        0 32px 64px -12px rgba(0, 0, 0, 0.35),
                        0 0 0 1px rgba(255, 255, 255, 0.05),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fade-in-up {
                    animation: fadeInUp 0.5s ease-out;
                }

                /* Typing indicator */
                @keyframes typingBounce {
                    0%, 80%, 100% { transform: translateY(0); opacity: 0.35; }
                    40% { transform: translateY(-4px); opacity: 1; }
                }
                .typing-dot {
                    width: 6px;
                    height: 6px;
                    background: #e5e7eb; /* text-gray-200 */
                    border-radius: 9999px;
                    display: inline-block;
                    animation: typingBounce 1.2s infinite ease-in-out;
                }
                .typing-dot:nth-child(2) { animation-delay: 0.15s; }
                .typing-dot:nth-child(3) { animation-delay: 0.3s; }

                /* Custom scrollbar for messages area */
                ::-webkit-scrollbar {
                    width: 6px;
                }

                ::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 3px;
                }

                ::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 3px;
                }

                ::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div>
    );
}