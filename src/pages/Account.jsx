import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, ChevronLeft, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AccountPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [editKey, setEditKey] = useState(null);
    const [tempInput, setTempInput] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const mockUser = {
                    full_name: "אהרן",
                    email: "aaron@gmail.com",
                    phone: "0584458956",
                    profile_picture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
                };
                setUser(mockUser);
            } catch (error) {
                console.error("Failed to load user data:", error);
            }
        };
        fetchData();
    }, []);

    const accountItems = [
        { 
            title: 'תמונת פרופיל', 
            key: 'profile_picture',
            type: 'avatar'
        },
        { 
            title: 'אימייל', 
            value: user?.email,
            key: 'email',
            type: 'text'
        },
        { 
            title: 'מספר נייד', 
            value: user?.phone,
            key: 'phone',
            type: 'text'
        },
        { 
            title: 'שם', 
            value: user?.full_name,
            key: 'full_name',
            type: 'text'
        }
    ];

    if (!user) {
        return (
            <div className="bg-background min-h-screen text-foreground flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen text-foreground" dir="rtl">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-4 pt-6 mb-4">
                    <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => navigate(-1)}
                        className="text-foreground hover:bg-accent rounded-full"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                    <div className="flex-1 text-center">
                        <h1 className="text-2xl font-bold text-foreground">מידע אישי</h1>
                    </div>
                    <div className="w-10"></div>
                </div>

                <div className="px-4 space-y-1">
                    {/* Account Information */}
                    {accountItems.map((item, index) => {
                        const isEditing = editKey === item.key;
                        return (
                            <div key={index} className="flex items-center justify-between py-4 border-b border-border">
                                <div className="flex-1">
                                    <h3 className="text-foreground font-medium text-lg">{item.title}</h3>
                                </div>
                                <div className="flex items-center gap-3">
                                    {/* Value or input */}
                                    {!isEditing && (
                                        <>
                                            {item.type === 'avatar' ? (
                                                <Avatar className="w-10 h-10" onClick={() => {
                                                    setEditKey(item.key);
                                                    setTempInput(user[item.key]);
                                                }}>
                                                    <AvatarImage src={user.profile_picture} />
                                                    <AvatarFallback className="bg-cyan-500 text-white text-sm">
                                                        {user.full_name?.[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                            ) : (
                                                <span 
                                                    className="text-muted-foreground text-right cursor-pointer" 
                                                    style={{ direction: item.key === 'email' || item.key === 'phone' ? 'ltr' : 'rtl' }}
                                                    onClick={() => {
                                                        setEditKey(item.key);
                                                        setTempInput(user[item.key]);
                                                    }}
                                                >
                                                    {user[item.key]}
                                                </span>
                                            )}
                                            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                                        </>
                                    )}

                                    {/* Editing mode */}
                                    {isEditing && (
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="text"
                                                value={tempInput}
                                                onChange={(e) => setTempInput(e.target.value)}
                                                className="bg-secondary border-border text-foreground h-8 w-40"
                                            />
                                            <Button 
                                                size="icon" 
                                                variant="ghost" 
                                                className="text-green-400 hover:bg-accent"
                                                onClick={() => {
                                                    setUser(prev => ({ ...prev, [item.key]: tempInput }));
                                                    setEditKey(null);
                                                }}
                                            >
                                                <Check className="w-4 h-4" />
                                            </Button>
                                            <Button 
                                                size="icon" 
                                                variant="ghost" 
                                                className="text-red-400 hover:bg-accent"
                                                onClick={() => setEditKey(null)}
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}