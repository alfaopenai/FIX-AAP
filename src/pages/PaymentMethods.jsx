
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
    ArrowRight, 
    MapPin, 
    CreditCard, 
    Truck, 
    Clock,
    Check,
    AlertTriangle,
    Trash2,
    Edit3,
    Plus,
    Gift
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ApplePayLogo = () => (
    <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/703681557_ChatGPTImageJul25202512_58_19PM.png" alt="Apple Pay" className="h-8 w-auto" />
);

const GooglePayLogo = () => (
    <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/2ffdb5399_ChatGPTImageJul25202512_58_16PM.png" alt="Google Pay" className="h-8 w-auto" />
);

export default function CheckoutPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { items, getTotalPrice, clearCart } = useCart();
    
    const [deliveryMethod, setDeliveryMethod] = useState('standard');
    const [paymentMethod, setPaymentMethod] = useState('credit_card');
    const [deliveryAddress, setDeliveryAddress] = useState({
        street: '',
        city: 'תל אביב',
        apartment: '',
        floor: '',
        notes: ''
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderConfirmed, setOrderConfirmed] = useState(false);

    const isCheckout = location.search.includes('checkout=true');
    const [isEditing, setIsEditing] = useState(false);
    const [creditCards, setCreditCards] = useState([
        {
            id: 1,
            type: 'Visa',
            lastFour: '4567',
            expiryMonth: '12',
            expiryYear: '26',
            holderName: 'אהרן כהן',
            isDefault: true
        },
        {
            id: 2,
            type: 'Mastercard',
            lastFour: '8901',
            expiryMonth: '08',
            expiryYear: '25',
            holderName: 'אהרן כהן',
            isDefault: false
        }
    ]);
    const [newCard, setNewCard] = useState({
        number: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        holderName: ''
    });
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    // If not checkout mode and no items, show payment methods management
    if (!isCheckout) {
        return (
            <div className="bg-black min-h-screen text-white" dir="rtl">
                <div className="max-w-md mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 pt-6 mb-4">
                        <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => navigate(-1)}
                            className="text-white hover:bg-gray-800 rounded-full"
                        >
                            <ArrowRight className="w-6 h-6" />
                        </Button>
                        <div className="flex-1 text-center">
                            <h1 className="text-xl font-medium text-white">אמצעי תשלום</h1>
                        </div>
                        <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setIsEditing(!isEditing)}
                            className="text-cyan-400 hover:bg-gray-800 rounded-full"
                        >
                            <Edit3 className="w-5 h-5" />
                        </Button>
                    </div>

                    <div className="px-4 space-y-4">
                        {/* Existing Cards */}
                        {creditCards.map((card) => (
                            <Card key={card.id} className="bg-gray-900/50 border-gray-700 p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">
                                                {card.type === 'Visa' ? 'VISA' : 'MC'}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">•••• {card.lastFour}</p>
                                            <p className="text-gray-400 text-sm">{card.expiryMonth}/{card.expiryYear}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {card.isDefault && (
                                            <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                                                ברירת מחדל
                                            </Badge>
                                        )}
                                        {isEditing && (
                                            <Button 
                                                variant="ghost" 
                                                size="sm"
                                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                onClick={() => setDeleteConfirm(card.id)}
                                            >
                                                <Trash2 className="w-4 h-4 ml-1" />
                                                הסר
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-t border-gray-700">
                                    <p className="text-gray-300 text-sm">{card.holderName}</p>
                                </div>
                            </Card>
                        ))}

                        {/* Add New Card */}
                        <Card className="bg-gray-900/50 border-gray-700 border-dashed p-4">
                            <Button 
                                variant="ghost" 
                                className="w-full h-16 flex items-center justify-center gap-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                                onClick={() => setIsEditing(true)}
                            >
                                <Plus className="w-5 h-5" />
                                הוסף כרטיס אשראי חדש
                            </Button>
                        </Card>

                        {/* New Card Form */}
                        {isEditing && (
                            <Card className="bg-gray-900/50 border-gray-700 p-4">
                                <h3 className="text-lg font-semibold mb-4">הוסף כרטיס חדש</h3>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="cardNumber" className="text-white">מספר כרטיס</Label>
                                        <Input
                                            id="cardNumber"
                                            placeholder="1234 5678 9012 3456"
                                            value={newCard.number}
                                            onChange={(e) => setNewCard(prev => ({...prev, number: e.target.value}))}
                                            className="bg-gray-800 border-gray-600 text-white mt-1"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <Label htmlFor="expiryMonth" className="text-white">חודש</Label>
                                            <Input
                                                id="expiryMonth"
                                                placeholder="12"
                                                value={newCard.expiryMonth}
                                                onChange={(e) => setNewCard(prev => ({...prev, expiryMonth: e.target.value}))}
                                                className="bg-gray-800 border-gray-600 text-white mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="expiryYear" className="text-white">שנה</Label>
                                            <Input
                                                id="expiryYear"
                                                placeholder="26"
                                                value={newCard.expiryYear}
                                                onChange={(e) => setNewCard(prev => ({...prev, expiryYear: e.target.value}))}
                                                className="bg-gray-800 border-gray-600 text-white mt-1"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="cvv" className="text-white">CVV</Label>
                                        <Input
                                            id="cvv"
                                            placeholder="123"
                                            value={newCard.cvv}
                                            onChange={(e) => setNewCard(prev => ({...prev, cvv: e.target.value}))}
                                            className="bg-gray-800 border-gray-600 text-white mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="holderName" className="text-white">שם בעל הכרטיס</Label>
                                        <Input
                                            id="holderName"
                                            placeholder="אהרן כהן"
                                            value={newCard.holderName}
                                            onChange={(e) => setNewCard(prev => ({...prev, holderName: e.target.value}))}
                                            className="bg-gray-800 border-gray-600 text-white mt-1"
                                        />
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <Button 
                                            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                                            onClick={() => {
                                                if (newCard.number && newCard.holderName) {
                                                    const newId = Math.max(...creditCards.map(c => c.id)) + 1;
                                                    setCreditCards(prev => [...prev, {
                                                        id: newId,
                                                        type: newCard.number.startsWith('4') ? 'Visa' : 'Mastercard',
                                                        lastFour: newCard.number.slice(-4),
                                                        expiryMonth: newCard.expiryMonth,
                                                        expiryYear: newCard.expiryYear,
                                                        holderName: newCard.holderName,
                                                        isDefault: creditCards.length === 0
                                                    }]);
                                                    setNewCard({ number: '', expiryMonth: '', expiryYear: '', cvv: '', holderName: '' });
                                                    setIsEditing(false);
                                                }
                                            }}
                                        >
                                            שמור כרטיס
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            onClick={() => {
                                                setIsEditing(false);
                                                setNewCard({ number: '', expiryMonth: '', expiryYear: '', cvv: '', holderName: '' });
                                            }}
                                            className="flex-1"
                                        >
                                            ביטול
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {/* Delete Confirmation Dialog */}
                        {deleteConfirm && (
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                <Card className="bg-gray-900 border-gray-700 p-6 mx-4 max-w-sm">
                                    <h3 className="text-lg font-semibold text-white mb-2">מחיקת כרטיס אשראי</h3>
                                    <p className="text-gray-300 mb-4">
                                        האם אתה בטוח שברצונך למחוק את הכרטיס המסתיים ב-{creditCards.find(c => c.id === deleteConfirm)?.lastFour}?
                                    </p>
                                    <div className="flex gap-3">
                                        <Button 
                                            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                                            onClick={() => {
                                                setCreditCards(prev => prev.filter(c => c.id !== deleteConfirm));
                                                setDeleteConfirm(null);
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4 ml-2" />
                                            מחק
                                        </Button>
                                        <Button 
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => setDeleteConfirm(null)}
                                        >
                                            ביטול
                                        </Button>
                                    </div>
                                </Card>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // If checkout mode but no items, redirect
    if (items.length === 0) {
        return (
            <div className="bg-black min-h-screen text-white flex items-center justify-center" dir="rtl">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">אין פריטים בסל</h2>
                    <Button onClick={() => navigate('/Marketplace')} variant="outline">
                        עבור לחנויות
                    </Button>
                </div>
            </div>
        );
    }

    const deliveryOptions = [
        { 
            id: 'standard', 
            name: 'משלוח רגיל', 
            time: '2-4 ימי עסקים', 
            price: 25,
            description: 'משלוח בדואר רשום'
        },
        { 
            id: 'express', 
            name: 'משלוח מהיר', 
            time: '24 שעות', 
            price: 45,
            description: 'שליח עד הבית'
        },
        { 
            id: 'pickup', 
            name: 'איסוף עצמי', 
            time: 'תוך שעתיים', 
            price: 0,
            description: 'מהחנות בתל אביב'
        }
    ];

    const paymentOptions = [
        { id: 'credit_card', name: 'כרטיס אשראי', icon: CreditCard },
        { id: 'apple_pay', name: 'Apple Pay', icon: ApplePayLogo },
        { id: 'google_pay', name: 'Google Pay', icon: GooglePayLogo }
    ];

    const selectedDelivery = deliveryOptions.find(opt => opt.id === deliveryMethod);
    const subtotal = getTotalPrice();
    const deliveryFee = selectedDelivery?.price || 0;
    const total = subtotal + deliveryFee;

    const handlePlaceOrder = async () => {
        setIsProcessing(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setOrderConfirmed(true);
        setIsProcessing(false);
        clearCart();
    };

    if (orderConfirmed) {
        return (
            <div className="bg-black min-h-screen text-white flex items-center justify-center p-6" dir="rtl">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold mb-4">ההזמנה אושרה!</h1>
                    <p className="text-gray-400 mb-6">
                        תקבל הודעה כשההזמנה תצא לדרך
                    </p>
                    <div className="space-y-3">
                        <Button 
                            onClick={() => navigate('/Marketplace')}
                            className="w-full bg-cyan-500 hover:bg-cyan-600 text-black"
                        >
                            המשך קניות
                        </Button>
                        <Button 
                            onClick={() => navigate('/Profile')}
                            variant="outline"
                            className="w-full"
                        >
                            צפייה בהזמנות
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-black min-h-screen text-white" dir="rtl">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center p-4 pt-6 mb-4 border-b border-gray-800">
                    <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => navigate(-1)}
                        className="text-white hover:bg-gray-800 rounded-full"
                    >
                        <ArrowRight className="w-6 h-6" />
                    </Button>
                    <div className="flex-1 text-center">
                        <h1 className="text-xl font-medium text-white">סיכום הזמנה</h1>
                    </div>
                    <div className="w-10"></div>
                </div>

                <div className="px-4 pb-6 space-y-6">
                    {/* Order Items */}
                    <Card className="bg-gray-900/50 border-gray-800 p-4">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Gift className="w-5 h-5 text-cyan-400" />
                            פריטים בהזמנה ({items.length})
                        </h2>
                        <div className="space-y-3 max-h-48 overflow-y-auto">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-3 p-2 bg-gray-800/30 rounded-lg">
                                    <img 
                                        src={item.image || item.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=100&q=60'}
                                        alt={item.name}
                                        className="w-10 h-10 object-cover rounded-lg bg-white"
                                    />
                                    <div className="flex-1 text-right">
                                        <h4 className="font-medium text-white text-sm">{item.name}</h4>
                                        <p className="text-xs text-gray-400">{item.brand}</p>
                                        <div className="flex justify-between items-center mt-1">
                                            <span className="text-cyan-400 font-bold">₪{(item.price * item.quantity).toFixed(2)}</span>
                                            <span className="text-gray-400 text-sm">כמות: {item.quantity}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Delivery Address */}
                    <Card className="bg-gray-900/50 border-gray-800 p-4">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-green-400" />
                            כתובת משלוח
                        </h2>
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <Input
                                    placeholder="עיר"
                                    value={deliveryAddress.city}
                                    onChange={(e) => setDeliveryAddress({...deliveryAddress, city: e.target.value})}
                                    className="bg-gray-800 border-gray-700 text-white text-right"
                                />
                                <Input
                                    placeholder="רחוב ומספר"
                                    value={deliveryAddress.street}
                                    onChange={(e) => setDeliveryAddress({...deliveryAddress, street: e.target.value})}
                                    className="bg-gray-800 border-gray-700 text-white text-right"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <Input
                                    placeholder="קומה (אופציונלי)"
                                    value={deliveryAddress.floor}
                                    onChange={(e) => setDeliveryAddress({...deliveryAddress, floor: e.target.value})}
                                    className="bg-gray-800 border-gray-700 text-white text-right"
                                />
                                <Input
                                    placeholder="דירה"
                                    value={deliveryAddress.apartment}
                                    onChange={(e) => setDeliveryAddress({...deliveryAddress, apartment: e.target.value})}
                                    className="bg-gray-800 border-gray-700 text-white text-right"
                                />
                            </div>
                            <Textarea
                                placeholder="הערות למשלוח (אופציונלי)"
                                value={deliveryAddress.notes}
                                onChange={(e) => setDeliveryAddress({...deliveryAddress, notes: e.target.value})}
                                className="bg-gray-800 border-gray-700 text-white text-right"
                                rows={2}
                            />
                        </div>
                    </Card>

                    {/* Delivery Method */}
                    <Card className="bg-gray-900/50 border-gray-800 p-4">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Truck className="w-5 h-5 text-blue-400" />
                            אופן משלוח
                        </h2>
                        <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod}>
                            {deliveryOptions.map((option) => (
                                <div key={option.id} className="flex items-center space-x-2 p-3 rounded-lg border border-gray-700 hover:border-gray-600">
                                    <div className="flex-1 text-right">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-cyan-400 font-bold">
                                                    {option.price === 0 ? 'חינם' : `₪${option.price}`}
                                                </span>
                                                {option.price === 0 && (
                                                    <Badge variant="secondary" className="bg-green-600 text-white">חינם</Badge>
                                                )}
                                            </div>
                                            <Label htmlFor={option.id} className="font-medium text-white cursor-pointer">
                                                {option.name}
                                            </Label>
                                        </div>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-gray-400 text-sm">{option.description}</span>
                                            <div className="flex items-center gap-1 text-gray-400 text-sm">
                                                <Clock className="w-3 h-3" />
                                                {option.time}
                                            </div>
                                        </div>
                                    </div>
                                    <RadioGroupItem value={option.id} id={option.id} />
                                </div>
                            ))}
                        </RadioGroup>
                    </Card>

                    {/* Payment Method */}
                    <Card className="bg-gray-900/50 border-gray-800 p-4">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-purple-400" />
                            אמצעי תשלום
                        </h2>
                        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                            {paymentOptions.map((option) => (
                                <div key={option.id} className="flex items-center space-x-2 p-3 rounded-lg border border-gray-700 hover:border-gray-600">
                                    <div className="flex-1 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {option.id === 'credit_card' ? (
                                                <CreditCard className="w-6 h-6 text-gray-400" />
                                            ) : (
                                                <option.icon />
                                            )}
                                        </div>
                                        <Label htmlFor={option.id} className="font-medium text-white cursor-pointer">
                                            {option.name}
                                        </Label>
                                    </div>
                                    <RadioGroupItem value={option.id} id={option.id} />
                                </div>
                            ))}
                        </RadioGroup>
                    </Card>

                    {/* Order Summary */}
                    <Card className="bg-gray-900/50 border-gray-800 p-4">
                        <h2 className="text-lg font-semibold mb-4">סיכום עלויות</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-white">₪{subtotal.toFixed(2)}</span>
                                <span className="text-gray-400">סכום ביניים</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white">
                                    {deliveryFee === 0 ? 'חינם' : `₪${deliveryFee.toFixed(2)}`}
                                </span>
                                <span className="text-gray-400">משלוח</span>
                            </div>
                            <div className="border-t border-gray-700 pt-2 mt-2">
                                <div className="flex justify-between text-lg font-bold">
                                    <span className="text-cyan-400">₪{total.toFixed(2)}</span>
                                    <span className="text-white">סה"כ לתשלום</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Place Order Button */}
                    <div className="sticky bottom-0 bg-black/95 p-4 -mx-4">
                        <Button 
                            onClick={handlePlaceOrder}
                            disabled={isProcessing || !deliveryAddress.street || !deliveryAddress.city}
                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-black font-bold py-4 text-lg"
                        >
                            {isProcessing ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                    מעבד הזמנה...
                                </div>
                            ) : (
                                `בצע הזמנה - ₪${total.toFixed(2)}`
                            )}
                        </Button>
                        
                        {(!deliveryAddress.street || !deliveryAddress.city) && (
                            <div className="flex items-center gap-2 mt-2 text-orange-400 text-sm">
                                <AlertTriangle className="w-4 h-4" />
                                נא למלא כתובת משלוח מלאה
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
