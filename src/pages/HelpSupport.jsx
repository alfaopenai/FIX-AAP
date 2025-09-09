
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronLeft, AlertTriangle, HelpCircle, Shield, MessageSquare } from 'lucide-react';

export default function HelpSupportPage() {
    const navigate = useNavigate();

    const helpItems = [
        { 
            title: 'דווח על בעיה', 
            icon: AlertTriangle,
            hasChevron: true
        },
        { 
            title: 'שאלות נפוצות', 
            icon: HelpCircle,
            hasChevron: true
        },
        { 
            title: 'עזרה בפרטיות ואבטחה', 
            icon: Shield,
            hasChevron: true
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
                        className="text-foreground hover:bg-accent rounded-full"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                    <div className="flex-1 text-center">
                        <h1 className="text-2ל font-bold text-foreground">עזרה ותמיכה</h1>
                    </div>
                    <div className="w-10"></div>
                </div>

                <div className="px-4 space-y-1">
                    {helpItems.map((item, index) => (
                        <div key={index} className="flex items-center justify-between py-4 border-b border-border cursor-pointer hover:bg-accent/10">
                            <div className="flex items-center gap-3">
                                <item.icon className="w-5 h-5 text-cyan-400" />
                                <h3 className="text-foreground font-medium text-lg">
                                    {item.title}
                                </h3>
                            </div>
                            <div className="flex items-center gap-3">
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
