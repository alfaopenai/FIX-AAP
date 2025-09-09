import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Heart } from 'lucide-react';

export default function ServiceCard({ professional }) {
    const [isLiked, setIsLiked] = useState(false);

    const imageUrl = professional.portfolio?.[0]?.photos?.[0] || professional.profile_photo || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=400&q=60';
    const price = professional.pricing?.minimum_charge || professional.pricing?.hourly_rate;
    const location = professional.service_area?.[0] || "מיקום לא צוין";

    return (
        <div className="group bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800/50 transition-all hover:border-cyan-500/50 hover:bg-gray-800/50">
            <div className="relative">
                <img src={imageUrl} alt={professional.business_name} className="w-full h-40 object-cover" />
                <Button 
                    size="icon" 
                    variant="ghost" 
                    className="absolute top-2 right-2 bg-black/50 text-white rounded-full backdrop-blur-sm hover:bg-black/70"
                    onClick={(e) => {
                        e.preventDefault();
                        setIsLiked(!isLiked);
                    }}
                >
                    <Heart className={`w-5 h-5 transition-all ${isLiked ? 'text-red-500 fill-current' : ''}`} />
                </Button>
            </div>
            <div className="p-4">
                {professional.rating && (
                    <div className="flex items-center gap-1 text-sm mb-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-bold text-white">{professional.rating.toFixed(1)}</span>
                        <span className="text-gray-400">({professional.review_count || 0})</span>
                    </div>
                )}
                <p className="font-medium text-white leading-tight mb-1 truncate">{professional.business_name}</p>
                <p className="text-sm text-gray-400">
                    {price ? `החל מ-₪${price}` : 'צרו קשר למחיר'}
                </p>
            </div>
        </div>
    );
}