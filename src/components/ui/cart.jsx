import React, { useEffect, useRef, useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
    Sheet, 
    SheetContent, 
    SheetDescription, 
    SheetHeader, 
    SheetTitle, 
    SheetTrigger,
    SheetClose
} from '@/components/ui/sheet';
import { ShoppingCart, Plus, Minus, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import cartIcon from '@/assets/icons/8d117ad4-7673-499c-b00a-ba90ae8b7dba.png';

export const CartIcon = () => {
  const { getTotalItems, openCart } = useCart();
  const totalItems = getTotalItems();

  const containerRef = useRef(null);
  const [pos, setPos] = useState(() => {
    try {
      const saved = localStorage.getItem('cartIconPosition');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return { x: null, y: null }; // will be set on mount (bottom-right)
  });
  const [anchor, setAnchor] = useState(() => {
    try {
      const saved = localStorage.getItem('cartIconAnchor');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return { h: 'right', v: 'bottom', offsetX: 24, offsetY: 96 };
  });
  const [relative, setRelative] = useState(() => {
    try {
      const saved = localStorage.getItem('cartIconRelative');
      if (saved) return JSON.parse(saved); // { xRatio: 0..1, yRatio: 0..1 }
    } catch (_) {}
    return null;
  });
  const dragState = useRef({ dragging: false, startX: 0, startY: 0, originX: 0, originY: 0, moved: false });

  useEffect(() => {
    const setDefault = () => {
      const size = (containerRef.current?.offsetWidth) || 80;
      const margin = 24;
      setPos(prev => {
        if (prev.x !== null && prev.y !== null) return prev;
        return { x: window.innerWidth - size - margin, y: window.innerHeight - size - 96 };
      });
      // Ensure anchor exists as default bottom-right
      setAnchor(prev => prev || { h: 'right', v: 'bottom', offsetX: margin, offsetY: 96 });
    };

    const clampToViewport = () => {
      const size = (containerRef.current?.offsetWidth) || 80;
      const min = 8;
      const maxX = Math.max(min, window.innerWidth - size - min);
      const maxY = Math.max(min, window.innerHeight - size - min);
      // If anchored to a corner, keep offsets and recompute by edges; else clamp absolute
      if (anchor && anchor.h && anchor.v) {
        setAnchor(prev => {
          if (!prev || !prev.h || !prev.v) return prev;
          const nextOffsetX = Math.min(Math.max((prev.offsetX ?? min), min), maxX);
          const nextOffsetY = Math.min(Math.max((prev.offsetY ?? min), min), maxY);
          return { ...prev, offsetX: nextOffsetX, offsetY: nextOffsetY };
        });
      } else if (relative) {
        const x = Math.min(Math.max(relative.xRatio * (window.innerWidth - size), min), maxX);
        const y = Math.min(Math.max(relative.yRatio * (window.innerHeight - size), min), maxY);
        setPos({ x, y });
      } else {
        setPos(prev => {
          const current = (prev.x === null || prev.y === null)
            ? { x: window.innerWidth - size - 24, y: window.innerHeight - size - 96 }
            : prev;
          const next = {
            x: Math.min(Math.max(current.x, min), maxX),
            y: Math.min(Math.max(current.y, min), maxY),
          };
          return next;
        });
      }
    };

    // Initialize and clamp once on mount
    setDefault();
    clampToViewport();

    // React to viewport changes
    window.addEventListener('resize', clampToViewport);
    window.addEventListener('orientationchange', clampToViewport);
    const vv = window.visualViewport;
    if (vv && vv.addEventListener) vv.addEventListener('resize', clampToViewport);

    return () => {
      window.removeEventListener('resize', clampToViewport);
      window.removeEventListener('orientationchange', clampToViewport);
      if (vv && vv.removeEventListener) vv.removeEventListener('resize', clampToViewport);
    };
  }, []);

  useEffect(() => {
    try {
      if (pos.x !== null && pos.y !== null) {
        localStorage.setItem('cartIconPosition', JSON.stringify(pos));
      }
    } catch (_) {}
  }, [pos]);

  useEffect(() => {
    try {
      if (anchor && anchor.h && anchor.v) {
        localStorage.setItem('cartIconAnchor', JSON.stringify(anchor));
      }
    } catch (_) {}
  }, [anchor]);

  useEffect(() => {
    try {
      if (relative && typeof relative.xRatio === 'number' && typeof relative.yRatio === 'number') {
        localStorage.setItem('cartIconRelative', JSON.stringify(relative));
      }
    } catch (_) {}
  }, [relative]);

  const onPointerDown = (e) => {
    if (!containerRef.current) return;
    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    dragState.current = {
      dragging: true,
      startX: e.clientX,
      startY: e.clientY,
      originX: rect.left,
      originY: rect.top,
      moved: false,
    };
    // While dragging, use absolute positioning
    setAnchor(null);
    // During drag, ignore relative anchoring; we'll compute new ratios on drop
    // Keep existing relative until pointer up
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const onPointerMove = (e) => {
    if (!dragState.current.dragging) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    if (Math.abs(dx) + Math.abs(dy) > 3) dragState.current.moved = true;

    // New position clamped to viewport
    const size = (containerRef.current?.offsetWidth) || 80;
    const min = 8;
    const newX = Math.max(min, Math.min(dragState.current.originX + dx, window.innerWidth - size - min));
    const newY = Math.max(min, Math.min(dragState.current.originY + dy, window.innerHeight - size - min));
    setPos({ x: newX, y: newY });
  };

  const onPointerUp = () => {
    if (!dragState.current.dragging) return;
    const wasMoved = dragState.current.moved;
    dragState.current.dragging = false;
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    if (!wasMoved) {
      openCart();
    } else {
      // Decide anchoring: if close enough to a corner, anchor; otherwise free mode by percentage
      const size = (containerRef.current?.offsetWidth) || 80;
      const threshold = 32; // px from edges to consider as anchored
      const distLeft = pos.x;
      const distTop = pos.y;
      const distRight = Math.max(0, window.innerWidth - (pos.x + size));
      const distBottom = Math.max(0, window.innerHeight - (pos.y + size));
      const nearLeft = distLeft <= threshold;
      const nearTop = distTop <= threshold;
      const nearRight = distRight <= threshold;
      const nearBottom = distBottom <= threshold;

      if ((nearLeft || nearRight) && (nearTop || nearBottom)) {
        const h = nearLeft ? 'left' : 'right';
        const v = nearTop ? 'top' : 'bottom';
        const offsetX = nearLeft ? distLeft : distRight;
        const offsetY = nearTop ? distTop : distBottom;
        setAnchor({ h, v, offsetX: Math.round(offsetX), offsetY: Math.round(offsetY) });
        setRelative(null);
      } else {
        setAnchor(null);
        const xRatio = Math.max(0, Math.min(1, pos.x / Math.max(1, window.innerWidth - size)));
        const yRatio = Math.max(0, Math.min(1, pos.y / Math.max(1, window.innerHeight - size)));
        setRelative({ xRatio, yRatio });
      }
    }
  };

  let style;
  if (anchor && anchor.h && anchor.v) {
    const ox = Math.max(0, Number.isFinite(anchor.offsetX) ? anchor.offsetX : 0);
    const oy = Math.max(0, Number.isFinite(anchor.offsetY) ? anchor.offsetY : 0);
    style = { [anchor.h]: ox, [anchor.v]: oy };
  } else if (pos.x !== null && pos.y !== null) {
    style = { left: pos.x, top: pos.y };
  } else {
    style = { right: 24, bottom: 96 };
  }

  return (
    <div
      ref={containerRef}
      className="fixed z-[60] w-20 h-20 cursor-pointer select-none touch-none"
      style={style}
      onPointerDown={onPointerDown}
      data-cart-icon="true"
      aria-label="Open cart"
    >
      <div className="relative w-full h-full hover:scale-110 transition-all duration-200">
        <img src={cartIcon} alt="Cart" className="w-full h-full object-contain" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-white text-cyan-500 text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold border-2 border-cyan-400">
            {totalItems}
          </span>
        )}
      </div>
    </div>
  );
};

export const Cart = () => {
    const { 
        items, 
        updateQuantity, 
        removeItem, 
        getTotalPrice, 
        clearCart,
        isOpen,
        openCart,
        closeCart 
    } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        closeCart();
        navigate(createPageUrl("PaymentMethods") + "?checkout=true");
    };

    // Ensure the body always reflects current open state (robust against edge cases)
    useEffect(() => {
        try {
            if (isOpen) document.body.classList.add('cart-open');
            else document.body.classList.remove('cart-open');
        } catch (_) {}
        return () => {
            try { document.body.classList.remove('cart-open'); } catch (_) {}
        };
    }, [isOpen]);

    return (
        <Sheet open={isOpen} onOpenChange={(open) => {
            try {
                if (open) document.body.classList.add('cart-open');
                else document.body.classList.remove('cart-open');
            } catch (_) {}
            if (open) openCart(); else closeCart();
        }}>
            <SheetContent side="left" className="w-full sm:w-96 bg-black text-white border-gray-800" dir="rtl">
                <SheetHeader className="text-right pr-10">
                    <div className="flex items-center justify-between">
                        {/* Rely on the built-in close button from SheetContent; remove duplicate here */}
                        <div>
                            <SheetTitle className="text-white text-xl">הסל שלי</SheetTitle>
                            <SheetDescription className="text-gray-400">
                                {items.length} פריטים בסל
                            </SheetDescription>
                        </div>
                    </div>
                </SheetHeader>

                <div className="flex flex-col h-full mt-6">
                    {items.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center">
                            <ShoppingCart className="w-16 h-16 text-gray-600 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-400 mb-2">הסל ריק</h3>
                            <p className="text-gray-500 mb-4">הוסף מוצרים כדי להתחיל לקנות</p>
                            <SheetClose asChild>
                                <Button 
                                    variant="outline"
                                    onClick={() => navigate(createPageUrl("Marketplace"))}
                                    className="border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black"
                                >
                                    עבור לחנויות
                                </Button>
                            </SheetClose>
                        </div>
                    ) : (
                        <>
                            {/* Cart Items */}
                            <div className="flex-1 overflow-y-auto space-y-4">
                                {items.map((item) => (
                                    <Card key={item.id} className="bg-gray-900/50 border-gray-800 p-4 relative">
                                        {/* Close Button */}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute top-2 right-2 w-6 h-6 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-full"
                                            onClick={() => removeItem(item.id)}
                                        >
                                            <X className="w-3 h-3" />
                                        </Button>
                                        
                                        <div className="flex gap-3">
                                            <img 
                                                src={item.image || item.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=100&q=60'}
                                                alt={item.name}
                                                className="w-12 h-12 object-cover rounded-lg bg-white"
                                            />
                                            <div className="flex-1 text-right pr-6">
                                                <h4 className="font-semibold text-white text-sm">{item.name}</h4>
                                                {item.brand && (
                                                    <p className="text-xs text-gray-400 mb-1">{item.brand}</p>
                                                )}
                                                <p className="text-cyan-400 font-bold">₪{item.price.toFixed(2)}</p>
                                                
                                                {/* Quantity Controls */}
                                                <div className="flex items-center justify-center mt-2">
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="w-8 h-8 border-gray-600"
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </Button>
                                                        <span className="w-8 text-center text-white font-semibold">
                                                            {item.quantity}
                                                        </span>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="w-8 h-8 border-gray-600"
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            {/* Cart Summary */}
                            <div className="border-t border-gray-800 pt-4 pb-20 space-y-4">
                                <div className="flex justify-between items-center text-right">
                                    <span className="text-xl font-bold text-white">₪{getTotalPrice().toFixed(2)}</span>
                                    <span className="text-lg text-gray-300">סה"כ:</span>
                                </div>
                                
                                <div className="space-y-2">
                                    <Button 
                                        onClick={handleCheckout}
                                        className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3"
                                        disabled={items.length === 0}
                                    >
                                        המשך לתשלום
                                    </Button>
                                    <Button 
                                        variant="outline"
                                        onClick={clearCart}
                                        className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                                    >
                                        רוקן סל
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}; 
