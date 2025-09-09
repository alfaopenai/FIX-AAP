import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function ProductCard({ product }) {
    const hasDiscount = product.original_price && product.original_price > product.price;

    const { addItem } = useCart();

    return (
        <Card className="bg-card border border-border rounded-2xl overflow-hidden group hover:shadow-md transition-all">
            <div className="relative">
                <img 
                    src={product.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=60'} 
                    alt={product.name}
                    className="w-full h-32 object-cover bg-white"
                />
                <Button 
                    size="icon" 
                    onClick={() => addItem(product, 1)}
                    className="absolute top-2 left-2 w-8 h-8 bg-white/90 text-blue-700 hover:bg-blue-600 hover:text-white rounded-full shadow-sm transition-all"
                >
                    <Plus className="w-4 h-4" />
                </Button>
                {hasDiscount && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
                        חיסכון
                    </div>
                )}
            </div>
            <div className="p-4 text-right">
                <h3 className="font-extrabold text-sm leading-tight bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent mb-1">{product.name}</h3>
                {product.brand && (
                    <p className="text-xs text-muted-foreground mb-2">{product.brand}</p>
                )}
                <div className="flex justify-end items-end gap-2">
                    {hasDiscount && (
                        <span className="text-xs text-muted-foreground line-through">₪ {product.original_price}</span>
                    )}
                    <p className="text-blue-700 font-bold text-base">₪ {product.price.toFixed(2)}</p>
                </div>
            </div>
        </Card>
    );
}