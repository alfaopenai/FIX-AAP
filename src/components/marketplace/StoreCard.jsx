import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card } from '@/components/ui/card';
import { Star, Clock, Truck, MapPin, Image } from 'lucide-react';

export default function StoreCard({ store }) {
    
    // תמונות ברירת מחדל לפי קטגוריה
    const getDefaultImageByCategory = (categories) => {
        if (!categories || categories.length === 0) {
            return 'https://images.unsplash.com/photo-1607082349566-18747f98eebc?auto=format&fit=crop&w=400&q=80';
        }
        
        const category = categories[0];
        const categoryImages = {
            'tools': 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=400&q=80',
            'gardening': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=400&q=80',
            'electrical_supplies': 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=400&q=80',
            'building_materials': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&q=80',
            'paint': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80',
            'painting_supplies': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80',
            'plumbing': 'https://images.unsplash.com/photo-1581091012184-7d83e7d61a1a?auto=format&fit=crop&w=400&q=80'
        };
        
        return categoryImages[category] || 'https://images.unsplash.com/photo-1607082349566-18747f98eebc?auto=format&fit=crop&w=400&q=80';
    };
    
    const imageUrl = store.image_url && store.image_url.startsWith('http') 
        ? store.image_url 
        : getDefaultImageByCategory(store.categories);

    return (
        <Link to={createPageUrl("Store") + "?storeId=" + store.id} className="block group">
            <Card className="relative bg-card border border-border rounded-2xl overflow-hidden transition-all duration-500 group-hover:scale-[1.015] group-hover:shadow-md">
                {/* Top image */}
                <div className="relative overflow-hidden">
                    <img 
                        src={imageUrl} 
                        alt={store.name}
                        className="w-full h-40 object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                            e.target.src = getDefaultImageByCategory(store.categories);
                        }}
                    />
                    {/* Light overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent"></div>

                    {/* Rating badge */}
                    {store.rating && (
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 border border-yellow-400/50 shadow-sm">
                            <div className="flex items-center gap-1.5">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="text-gray-900 text-sm font-bold">{store.rating?.toFixed(1)}</span>
                            </div>
                        </div>
                    )}

                    {/* Recommended */}
                    {store.rating && store.rating >= 4.5 && (
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow">
                            מומלץ ⭐
                        </div>
                    )}
                </div>
                
                <div className="p-4 text-right relative z-10">
                    <h3 className="font-extrabold text-base md:text-lg tracking-tight bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent mb-1">
                        {store.name}
                    </h3>
                    <div className="h-0.5 w-14 ml-auto bg-gradient-to-l from-cyan-500 to-transparent rounded-full mb-2"></div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {store.description || store.categories?.join(' • ')}
                    </p>
                    
                    {/* Info chips */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                            {store.delivery_time && (
                                <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 rounded-lg px-3 py-1.5 border border-blue-200">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-xs font-medium">{store.delivery_time}</span>
                                </div>
                            )}
                            {store.delivery_fee !== undefined && (
                                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 rounded-lg px-3 py-1.5 border border-emerald-200">
                                    <Truck className="w-4 h-4" />
                                    <span className="text-xs font-medium">
                                        {store.delivery_fee === 0 ? 'משלוח חינם' : `₪${store.delivery_fee} משלוח`}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center justify-start gap-2">
                            {store.distance !== undefined && store.distance !== Infinity && (
                                <div className="flex items-center gap-1.5 bg-purple-50 text-purple-700 rounded-lg px-3 py-1.5 border border-purple-200">
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-xs font-medium">{store.distance.toFixed(1)} ק"מ</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* bottom accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-60"></div>
            </Card>
        </Link>
    );
}