
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star } from 'lucide-react';

export default function PromoBanner() {
    return (
        <div className="px-4 py-2">
            <div className="relative bg-gradient-to-r from-yellow-500 via-orange-600 to-red-600 rounded-3xl overflow-hidden">
                <img 
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/f2501885a_image.png"
                    alt="Electrician working on a panel"
                    className="w-full h-48 object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-right">
                    <div className="flex items-center gap-2 mb-2 justify-end">
                        <span className="text-sm text-yellow-300">זמין 24/7</span>
                        <div className="w-12 h-6 bg-yellow-400 rounded-md flex items-center justify-center">
                            <span className="text-xs font-bold text-black">PRO</span>
                        </div>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-1">חשמלאי מקצועי</h2>
                    <div className="flex items-center gap-4 justify-end text-sm text-gray-300">
                        <span>תיקון קצרים • התקנות • בדיקות</span>
                        <div className="flex items-center gap-1">
                            <span>9.9</span>
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        </div>
                        <span>החל מ-₪150 ⚡</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
