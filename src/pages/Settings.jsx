
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, ChevronLeft, Globe, Bell, Key, RefreshCw, LogOut, Trash2 } from 'lucide-react';

export default function SettingsPage() {
    const navigate = useNavigate();

    const settingsItems = [
        { 
            title: 'שפה', 
            icon: Globe,
            value: 'עברית',
            hasChevron: true
        },
        { 
            title: 'התראות', 
            icon: Bell,
            hasSwitch: true,
            switchValue: true
        },
        { 
            title: 'שינוי סיסמה', 
            icon: Key,
            hasChevron: true
        },
        { 
            title: 'החלף משתמש', 
            icon: RefreshCw,
            hasChevron: true
        },
        { 
            title: 'התנתקות', 
            icon: LogOut,
            hasChevron: true,
            isDangerous: true
        },
        { 
            title: 'מחיקת חשבון', 
            icon: Trash2,
            hasChevron: true,
            isDangerous: true
        }
    ];

    return (
        <div className="bg-background min-h-screen text-foreground" dir="rtl">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-4 pt-6 mb-4">
                    <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => navigate(-1)}
                        className="text-white hover:bg-gray-800 rounded-full"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                    <div className="flex-1 text-center">
                        <h1 className="text-2xl font-bold text-white">הגדרות</h1>
                    </div>
                    <div className="w-10"></div>
                </div>

                <div className="px-4 space-y-1">
                    {settingsItems.map((item, index) => (
                        <div key={index} className="flex items-center justify-between py-4 border-b border-border">
                            <div className="flex items-center gap-3">
                                <item.icon className="w-5 h-5 text-cyan-400" />
                                <h3 className={`font-medium text-lg ${item.isDangerous ? 'text-red-400' : 'text-foreground'}`}>
                                    {item.title}
                                </h3>
                            </div>
                            <div className="flex items-center gap-3">
                                {item.hasSwitch && (
                                    <Switch
                                        checked={item.switchValue}
                                        className="data-[state=checked]:bg-cyan-500"
                                    />
                                )}
                                {item.value && (
                                    <span className="text-muted-foreground text-right">{item.value}</span>
                                )}
                                {item.hasChevron && (
                                    <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
