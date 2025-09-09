
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// Temporarily disconnect Base44 data for this screen; use our new server
// import { Store, Product } from '@/api/entities';
import { apiGet } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select';
import { 
    Heart, 
    Share, 
    Star, 
    Clock, 
    Truck, 
    Plus, 
    Search,
    Filter,
    ArrowRight,
    Package,
    TrendingUp,
    ShoppingCart,
    Home
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import StoreCard from '@/components/marketplace/StoreCard';
// removed side sheet; we will navigate to a full screen view per subcategory

// Mock stores data for fallback
const getMockStoreData = (storeId) => {
    const mockStores = {
        'mock_1': {
            id: 'mock_1',
            name: 'בניין צבי - חומרי בניין',
            description: 'חומרי בניין איכותיים במחירים הוגנים. מגוון רחב של מוצרים לכל פרויקט בניה.',
            image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
            categories: ['building_materials'],
            rating: 4.7,
            delivery_time: "45-90 דקות",
            delivery_fee: 25
        },
        'mock_2': {
            id: 'mock_2',
            name: 'גינת עדן - מרכז גינון',
            description: 'הכל לגינה שלכם - צמחים, עציצים, כלי גינון וייעוץ מקצועי',
            image_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
            categories: ['gardening'],
            rating: 4.4,
            delivery_time: "1-2 שעות",
            delivery_fee: 30
        },
        'mock_3': {
            id: 'mock_3',
            name: 'אלקטרו פלוס - חשמל ותאורה',
            description: 'פתרונות חשמל מתקדמים לבית ולעסק. מוצרי תאורה איכותיים.',
            image_url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400',
            categories: ['electrical_supplies'],
            rating: 4.6,
            delivery_time: "30-60 דקות",
            delivery_fee: 20
        },
        'mock_4': {
            id: 'mock_4',
            name: 'צבעי פסגה - מרכז צבע',
            description: 'צבעים איכותיים וציוד צביעה מקצועי. ייעוץ צבעים חינם.',
            image_url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400',
            categories: ['painting_supplies'],
            rating: 4.5,
            delivery_time: "1-3 שעות",
            delivery_fee: 35
        },
        'mock_5': {
            id: 'mock_5',
            name: 'כלי מקצוע - ציוד מקצועי',
            description: 'כלי עבודה מקצועיים ואביזרים. איכות גבוהה במחירים נוחים.',
            image_url: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400',
            categories: ['tools'],
            rating: 4.8,
            delivery_time: "2-4 שעות",
            delivery_fee: 40
        },
        'mock_6': {
            id: 'mock_6',
            name: 'הום סנטר - הכל לבית',
            description: 'פתרונות שלמים לבית ולגינה. חנות הדגל שלנו.',
            image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
            categories: ['building_materials', 'tools', 'gardening'],
            rating: 4.3,
            delivery_time: "1-2 שעות",
            delivery_fee: 25
        },
        'mock_7': {
            id: 'mock_7',
            name: 'מגה חשמל - סופר משלוח',
            description: 'ציוד חשמל מקצועי עם משלוח מהיר. שירות 24/7.',
            image_url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400',
            categories: ['electrical_supplies'],
            rating: 4.9,
            delivery_time: "20-45 דקות",
            delivery_fee: 0
        },
        'mock_8': {
            id: 'mock_8',
            name: 'גרין גארדן - משלוח חינם',
            description: 'מרכז גינון מקצועי עם משלוח חינם מעל ₪200. ייעוץ חינם.',
            image_url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400',
            categories: ['gardening'],
            rating: 4.6,
            delivery_time: "1-3 שעות",
            delivery_fee: 0
        },
        'mock_9': {
            id: 'mock_9',
            name: 'פרימיום טולס - כלים מקצועיים',
            description: 'כלי עבודה איכותיים למקצוענים ולחובבים. אחריות מלאה.',
            image_url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400',
            categories: ['tools'],
            rating: 4.7,
            delivery_time: "2-5 שעות",
            delivery_fee: 15
        }
    };

    // If specific storeId exists, return it. Otherwise, return a default store based on storeId hash
    if (mockStores[storeId]) {
        return mockStores[storeId];
    }

    // Generate a consistent store based on storeId
    const storeKeys = Object.keys(mockStores);
    const hashIndex = storeId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % storeKeys.length;
    const baseStore = mockStores[storeKeys[hashIndex]];
    
    return {
        ...baseStore,
        id: storeId,
        name: `${baseStore.name.split(' - ')[0]} - סניף מיוחד`,
        description: `${baseStore.description} חנות מובילה באזור עם שירות מעולה.`
    };
};

// Mock products data for the store
const generateMockProducts = (storeId, storeCategories = []) => {
    const productTemplates = [
        // Tools
        { name: "מקדחה אלחוטית", category: "tools", price: 299.99, originalPrice: 349.99, brand: "Bosch", stock: 15, image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400" },
        { name: "מסור חשמלי", category: "tools", price: 199.99, originalPrice: null, brand: "Makita", stock: 8, image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400" },
        { name: "מברג חשמלי", category: "tools", price: 89.99, originalPrice: 120.99, brand: "Black & Decker", stock: 23, image: "https://images.unsplash.com/photo-1609194513211-d8b7ef5a5b17?w=400" },
        { name: "פטיש כבד", category: "tools", price: 45.99, originalPrice: null, brand: "Stanley", stock: 34, image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400" },
        { name: "מפתחות רגילים", category: "tools", price: 25.99, originalPrice: 35.99, brand: "Gedore", stock: 67, image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400" },
        
        // Electrical
        { name: "מנורת LED", category: "electrical_supplies", price: 49.99, originalPrice: null, brand: "Philips", stock: 45, image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400" },
        { name: "כבל חשמל", category: "electrical_supplies", price: 25.99, originalPrice: 35.99, brand: "Generic", stock: 67, image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400" },
        { name: "מתג חשמל", category: "electrical_supplies", price: 15.99, originalPrice: null, brand: "Legrand", stock: 89, image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400" },
        { name: "נורת LED חכמה", category: "electrical_supplies", price: 79.99, originalPrice: 99.99, brand: "Xiaomi", stock: 23, image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400" },
        
        // Gardening
        { name: "צמח נוי", category: "gardening", price: 35.99, originalPrice: null, brand: "פרחי השדה", stock: 12, image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400" },
        { name: "אדמה לעציצים", category: "gardening", price: 18.99, originalPrice: 24.99, brand: "Garden Plus", stock: 34, image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400" },
        { name: "זרעים לגינה", category: "gardening", price: 12.99, originalPrice: null, brand: "Eden Seeds", stock: 56, image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400" },
        { name: "עציץ קרמיקה", category: "gardening", price: 45.99, originalPrice: 59.99, brand: "Pottery Pro", stock: 18, image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400" },
        
        // Painting
        { name: "צבע קיר לבן", category: "painting_supplies", price: 79.99, originalPrice: null, brand: "Tambour", stock: 19, image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400" },
        { name: "מברשת צביעה", category: "painting_supplies", price: 12.99, originalPrice: 17.99, brand: "Professional", stock: 42, image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400" },
        { name: "גלילי צבע", category: "painting_supplies", price: 8.99, originalPrice: null, brand: "Paint Master", stock: 78, image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400" },
        { name: "פרימר לקירות", category: "painting_supplies", price: 65.99, originalPrice: 79.99, brand: "Nirlat", stock: 25, image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400" },
        
        // Building Materials
        { name: "בלוקי בטון", category: "building_materials", price: 4.99, originalPrice: null, brand: "בטון ראשון", stock: 156, image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400" },
        { name: "חול בניין", category: "building_materials", price: 89.99, originalPrice: 99.99, brand: "חומרי בניין", stock: 28, image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400" },
        { name: "מלט לבנייה", category: "building_materials", price: 25.99, originalPrice: null, brand: "נשר", stock: 67, image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400" },
        { name: "לבנים אדומות", category: "building_materials", price: 1.50, originalPrice: 2.00, brand: "לבנים בע״מ", stock: 450, image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400" }
    ];

    // Filter products by store categories or return all if no specific categories
    let relevantProducts = productTemplates;
    if (storeCategories && storeCategories.length > 0) {
        relevantProducts = productTemplates.filter(product => 
            storeCategories.includes(product.category)
        );
        
        // Add some random products to make it more diverse
        const otherProducts = productTemplates.filter(product => 
            !storeCategories.includes(product.category)
        );
        relevantProducts = [...relevantProducts, ...otherProducts.slice(0, 3)];
    }

    return relevantProducts.map((template, index) => ({
        ...template,
        id: `${storeId}_product_${index}`,
        store_id: storeId,
        is_featured: Math.random() > 0.7,
        rating: 3.5 + Math.random() * 1.5,
        reviews_count: Math.floor(Math.random() * 200) + 10
    }));
};

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function StorePage() {
    const query = useQuery();
    const navigate = useNavigate();
    const storeId = query.get('storeId');
    const { addItem } = useCart();
    const { userType } = useAuth();
    
    const [store, setStore] = useState(null);
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [priceFilter, setPriceFilter] = useState('all');
    const [sortBy, setSortBy] = useState('featured');
    // subcategory view via query param for full-screen navigation

    const categories = [
        { value: 'all', label: 'כל הקטגוריות' },
        { value: 'tools', label: 'כלי עבודה' },
        { value: 'electrical_supplies', label: 'חשמל ותאורה' },
        { value: 'gardening', label: 'גינון' },
        { value: 'painting_supplies', label: 'צבע וציוד צביעה' },
        { value: 'building_materials', label: 'חומרי בניין' }
    ];

    const priceRanges = [
        { value: 'all', label: 'כל המחירים' },
        { value: '0-50', label: 'עד ₪50' },
        { value: '50-100', label: '₪50-100' },
        { value: '100-200', label: '₪100-200' },
        { value: '200+', label: 'מעל ₪200' }
    ];

    useEffect(() => {
        const fetchStoreData = async () => {
            if (!storeId) {
                setLoading(false);
                return;
            }
            
            try {
                setLoading(true);
                
                // Try to get store from our server first
                let fetchedStore = null;
                try {
                    fetchedStore = await apiGet(`/api/stores/${storeId}`);
                } catch (_) {
                    // ignore
                }
                
                // If not found in API, use mock data (for prototype)
                if (!fetchedStore) {
                    fetchedStore = getMockStoreData(storeId);
                }
                
                // Always have store data for prototype
                setStore(fetchedStore);
                const mockProducts = generateMockProducts(storeId, fetchedStore.categories);
                setAllProducts(mockProducts);
                setFilteredProducts(mockProducts);
                
            } catch (error) {
                console.error("Failed to fetch store data:", error);
                // Even on error, provide mock data for prototype
                const mockStore = getMockStoreData(storeId);
                setStore(mockStore);
                const mockProducts = generateMockProducts(storeId, mockStore.categories);
                setAllProducts(mockProducts);
                setFilteredProducts(mockProducts);
            } finally {
                setLoading(false);
            }
        };
        
        if (storeId) {
            fetchStoreData();
        } else {
            setLoading(false);
        }
    }, [storeId]);

    // Filter and search products
    useEffect(() => {
        let filtered = [...allProducts];

        // Search filter
        if (searchQuery.trim()) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.brand.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Category filter
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }

        // Price filter
        if (priceFilter !== 'all') {
            const [min, max] = priceFilter.split('-').map(p => p.replace('+', ''));
            filtered = filtered.filter(product => {
                if (priceFilter === '200+') return product.price >= 200;
                return product.price >= parseInt(min) && product.price <= parseInt(max);
            });
        }

        // Sort products
        switch (sortBy) {
            case 'price_low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price_high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case 'name':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default: // featured
                filtered.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
        }

        setFilteredProducts(filtered);
    }, [allProducts, searchQuery, selectedCategory, priceFilter, sortBy]);

    const handleAddToCart = (product, event) => {
        addItem(product);
        
        // Create animated element that flies to cart
        if (event?.target) {
            createFlyToCartAnimation(product, event.target);
        }
    };

    const createFlyToCartAnimation = (product, sourceElement) => {
        // Get source element position
        const sourceRect = sourceElement.getBoundingClientRect();
        
        // Find cart icon (try both mobile and desktop)
        const cartIcon = document.querySelector('[data-cart-icon]') || 
                         document.querySelector('button[aria-label="Cart"]') ||
                         document.querySelector('.cart-icon');
        
        if (!cartIcon) return;
        
        const cartRect = cartIcon.getBoundingClientRect();
        
        // Create animated element
        const flyingElement = document.createElement('div');
        flyingElement.innerHTML = `
            <div class="w-8 h-8 rounded-lg overflow-hidden border-2 border-cyan-400 shadow-xl bg-white transform">
                <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover" />
            </div>
        `;
        
        // Style the flying element
        flyingElement.style.cssText = `
            position: fixed;
            left: ${sourceRect.left + sourceRect.width / 2 - 16}px;
            top: ${sourceRect.top + sourceRect.height / 2 - 16}px;
            z-index: 1000;
            pointer-events: none;
            transition: all 1.2s cubic-bezier(0.23, 1, 0.32, 1);
            will-change: transform, opacity;
        `;
        
        document.body.appendChild(flyingElement);
        
        // Trigger animation after a frame
        requestAnimationFrame(() => {
            flyingElement.style.transform = `translate(${cartRect.left - sourceRect.left}px, ${cartRect.top - sourceRect.top}px) scale(0.5)`;
            flyingElement.style.opacity = '0';
        });
        
        // Remove element after animation
        setTimeout(() => {
            if (flyingElement.parentNode) {
                flyingElement.parentNode.removeChild(flyingElement);
            }
            
            // Add bounce effect to cart icon
            if (cartIcon) {
                cartIcon.style.transform = 'scale(1.2)';
                cartIcon.style.transition = 'transform 0.2s ease-out';
                setTimeout(() => {
                    cartIcon.style.transform = 'scale(1)';
                }, 200);
            }
        }, 1200);
    };

    const featuredProducts = allProducts.filter(p => p.is_featured).slice(0, 6);
    const bestSellers = allProducts.sort((a, b) => b.reviews_count - a.reviews_count).slice(0, 6);

    if (loading) {
        return (
            <div className="bg-background text-foreground min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p>טוען חנות...</p>
                </div>
            </div>
        );
    }

    // Note: We always provide mock data for prototype, so store should never be null
    // Safety check (should not happen in prototype mode)
    if (!store) {
        return (
            <div className="bg-background text-foreground min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p>טוען נתונים...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background text-foreground min-h-screen" dir="rtl">
            {/* Back to Home Button (for Service Providers) */}
            {userType === 'service_provider' && (
                <div className="fixed top-4 left-4 z-50">
                    <Button
                        onClick={() => navigate('/serviceproviderdashboard')}
                        variant="ghost"
                        size="icon"
                        className="bg-gray-900/90 hover:bg-cyan-600/90 border border-gray-600 text-white hover:text-white rounded-full backdrop-blur-sm transition-all duration-300 shadow-lg hover:shadow-cyan-500/30"
                    >
                        <Home className="h-5 w-5" />
                    </Button>
                </div>
            )}
            
            {/* Store Header */}
            <div className="relative">
                <img 
                    src={store.image_url}
                    alt={store.name}
                    className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {/* Back Button */}
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-4 right-4 bg-black/50 text-white rounded-full"
                    onClick={() => {
                        if (userType === 'service_provider') {
                            navigate('/serviceproviderdashboard');
                        } else {
                            navigate('/Marketplace');
                        }
                    }}
                >
                    <ArrowRight className="w-5 h-5" />
                </Button>
                
                {/* Store Actions */}
                <div className="absolute top-4 left-4 flex gap-2">
                    <Button variant="ghost" size="icon" className="bg-black/50 text-white rounded-full">
                        <Heart className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="bg-black/50 text-white rounded-full">
                        <Share className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Store Info */}
            <div className="p-6 border-b border-gray-800">
                <h1 className="text-2xl font-bold text-white mb-2">{store.name}</h1>
                <p className="text-gray-400 mb-4">{store.description}</p>
                
                <div className="flex items-center gap-6 text-sm text-gray-300 mb-4">
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{store.rating?.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-cyan-400" />
                        <span>{store.delivery_time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Truck className="w-4 h-4 text-green-400" />
                        <span>{store.delivery_fee === 0 ? 'משלוח חינם' : `₪${store.delivery_fee}`}</span>
                    </div>
                </div>
            </div>

            {/* Search only */}
            <div className="p-6 border-b border-gray-800 bg-gray-900/30">
                {/* Search Bar */}
                <div className="relative max-w-2xl">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="חיפוש מוצרים..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white pr-10 text-right"
                    />
                </div>
            </div>

            <div className="p-6 space-y-8">
                {/* If subcategory param is present – render a full screen list */}
                {(() => {
                    const subKey = query.get('subcategory');
                    const primary = store.categories?.[0];
                    const subs = getStoreSubcategories(primary);
                    const activeSub = subs.find(s => s.key === subKey);
                    if (!activeSub) return null;
                    const subProducts = allProducts.filter(p => filterBySubcategory(p, activeSub, primary));
                    return (
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold">{activeSub.label}</h2>
                                <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800" onClick={() => navigate(`/Store?storeId=${storeId}`)}>חזרה לחנות</Button>
                            </div>
                            {subProducts.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                                    {subProducts.map(p => (
                                        <ProductCard key={p.id} product={p} onAddToCart={(product, event) => handleAddToCart(product, event)} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-gray-400 py-10">אין מוצרים בקטגוריה זו</div>
                            )}
                        </section>
                    );
                })()}
                {/* Featured Products */}
                {(!query.get('subcategory')) && featuredProducts.length > 0 && (
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="w-5 h-5 text-cyan-400" />
                            <h2 className="text-xl font-bold">מוצרים מומלצים</h2>
                        </div>
                        <div className="flex gap-3 overflow-x-auto snap-x pb-1">
                            {featuredProducts.map((product) => (
                                <div key={product.id} className="snap-start min-w-[160px]">
                                    <ProductCard 
                                        product={product} 
                                        onAddToCart={(product, event) => handleAddToCart(product, event)}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Best Sellers */}
                {(!query.get('subcategory')) && bestSellers.length > 0 && (
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="w-5 h-5 text-yellow-400" />
                            <h2 className="text-xl font-bold">הנמכרים ביותר</h2>
                        </div>
                        <div className="flex gap-3 overflow-x-auto snap-x pb-1">
                            {bestSellers.map((product) => (
                                <div key={product.id} className="snap-start min-w-[160px]">
                                    <ProductCard 
                                        product={product} 
                                        onAddToCart={(product, event) => handleAddToCart(product, event)}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Category Tiles (Wolt-style) */}
                {(!query.get('subcategory')) && (
                <section>
                    <div className="mb-3">
                        <h2 className="text-xl font-bold">קטגוריות בחנות</h2>
                        <p className="text-sm text-gray-400">בחר קטגוריה כדי לראות מוצרים מתאימים</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {getStoreSubcategories(store.categories?.[0]).map((c) => (
                            <button
                                key={c.key}
                                onClick={() => navigate(`/Store?storeId=${storeId}&subcategory=${c.key}`)}
                                className="group bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden text-right shadow hover:shadow-cyan-500/10 transition-all hover:-translate-y-0.5"
                            >
                                <div className="relative h-28 flex items-center justify-center">
                                    <img src={c.icon} alt="" className="w-20 h-20 object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]" />
                                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/10 to-transparent" />
                                </div>
                                <div className="px-3 py-2 bg-white/5">
                                    <div className="font-semibold">{c.label}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </section>
                )}
            </div>
            
            <style jsx>{`
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
}

// Product Card Component
const ProductCard = ({ product, onAddToCart }) => {
    const hasDiscount = product.originalPrice && product.originalPrice > product.price;
    const discountPercent = hasDiscount ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

    return (
        <Card className="bg-gray-900/50 border border-gray-700/30 rounded-xl overflow-hidden group hover:bg-gray-800/50 transition-all">
            <div className="relative">
                <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-20 object-cover bg-white"
                />
                
                {/* Add to Cart Button */}
                <Button 
                    size="icon" 
                    className="absolute top-1 left-1 w-6 h-6 bg-cyan-400 hover:bg-cyan-500 text-black rounded-full transition-all"
                    onClick={(e) => onAddToCart(product, e)}
                >
                    <Plus className="w-3 h-3" />
                </Button>
                
                {/* Badges */}
                {product.is_featured && (
                    <div className="absolute top-1 right-1 bg-gradient-to-r from-cyan-400 to-blue-500 text-black px-1.5 py-0.5 rounded text-xs font-bold">
                        מומלץ
                    </div>
                )}
                
                {hasDiscount && (
                    <div className="absolute bottom-1 right-1 bg-red-500 text-white px-1.5 py-0.5 rounded text-xs font-bold">
                        -{discountPercent}%
                    </div>
                )}
                
                {/* Stock indicator */}
                {product.stock < 10 && (
                    <div className="absolute bottom-1 left-1 bg-orange-500 text-white px-1.5 py-0.5 rounded text-xs font-bold">
                        {product.stock}
                    </div>
                )}
            </div>
            
            <div className="p-2 text-right">
                <h3 className="font-medium text-white text-xs leading-tight mb-1 line-clamp-2">{product.name}</h3>
                {product.brand && (
                    <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
                )}
                
                {/* Rating */}
                <div className="flex items-center gap-1 mb-1.5">
                    <Star className="w-2.5 h-2.5 text-yellow-400 fill-current" />
                    <span className="text-xs text-yellow-400">{product.rating.toFixed(1)}</span>
                    <span className="text-xs text-gray-500">({product.reviews_count})</span>
                </div>
                
                {/* Price */}
                <div className="flex items-center justify-between">
                    <div className="text-right">
                        {hasDiscount && (
                            <span className="text-xs text-gray-500 line-through block">₪{product.originalPrice.toFixed(0)}</span>
                        )}
                        <span className="text-cyan-400 font-bold text-sm">₪{product.price.toFixed(0)}</span>
                    </div>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="text-cyan-400 hover:text-cyan-300 p-1 h-6 w-6"
                        onClick={(e) => onAddToCart(product, e)}
                    >
                        <ShoppingCart className="w-3 h-3" />
                    </Button>
                </div>
            </div>
        </Card>
    );
};

// Helpers: subcategories per store type with 3D icons
function getStoreSubcategories(primaryCategory) {
    const icon = (url) => url;
    const sets = {
        'electrical_supplies': [
            { key: 'bulbs', label: 'נורות ותאורה', icon: icon('https://img.icons8.com/3d-fluency/96/light-bulb.png') },
            { key: 'cables', label: 'כבלים ושקעים', icon: icon('https://img.icons8.com/3d-fluency/96/electricity.png') },
            { key: 'smart', label: 'בית חכם', icon: icon('https://img.icons8.com/3d-fluency/96/internet-of-things.png') },
            { key: 'tools', label: 'כלי חשמלאים', icon: icon('https://img.icons8.com/3d-fluency/96/toolbox.png') }
        ],
        'tools': [
            { key: 'drills', label: 'מקדחות', icon: icon('https://img.icons8.com/3d-fluency/96/drill.png') },
            { key: 'saws', label: 'מסורים', icon: icon('https://img.icons8.com/3d-fluency/96/saw.png') },
            { key: 'hand', label: 'כלי יד', icon: icon('https://img.icons8.com/3d-fluency/96/hammer.png') },
            { key: 'kits', label: 'סטים', icon: icon('https://img.icons8.com/3d-fluency/96/toolbox.png') }
        ],
        'gardening': [
            { key: 'plants', label: 'צמחים', icon: icon('https://img.icons8.com/3d-fluency/96/potted-plant.png') },
            { key: 'care', label: 'דישון והשקיה', icon: icon('https://img.icons8.com/3d-fluency/96/watering-can.png') },
            { key: 'tools', label: 'כלי גינון', icon: icon('https://img.icons8.com/3d-fluency/96/garden-shears.png') },
            { key: 'pots', label: 'עציצים ואדניות', icon: icon('https://img.icons8.com/3d-fluency/96/plant-under-sun.png') }
        ],
        'painting_supplies': [
            { key: 'paints', label: 'צבעים', icon: icon('https://img.icons8.com/3d-fluency/96/paint-bucket.png') },
            { key: 'rollers', label: 'גלילים ומברשות', icon: icon('https://img.icons8.com/3d-fluency/96/paint-roller.png') },
            { key: 'prep', label: 'הכנה ושפכטל', icon: icon('https://img.icons8.com/3d-fluency/96/paint-palette.png') },
            { key: 'tapes', label: 'סרטי מסקינג', icon: icon('https://img.icons8.com/3d-fluency/96/duct-tape.png') }
        ],
        'building_materials': [
            { key: 'cement', label: 'מלט וחומרי מליטה', icon: icon('https://img.icons8.com/3d-fluency/96/bricks.png') },
            { key: 'wood', label: 'עץ ולבידים', icon: icon('https://img.icons8.com/3d-fluency/96/wood.png') },
            { key: 'insulation', label: 'בידוד ואיטום', icon: icon('https://img.icons8.com/3d-fluency/96/brick-wall.png') },
            { key: 'hardware', label: 'ברזל וחומרי גלם', icon: icon('https://img.icons8.com/3d-fluency/96/steel-beam.png') }
        ]
    };
    return sets[primaryCategory] || sets['tools'];
}

// map subcategory item to product by category
function filterBySubcategory(product, subcat, primaryCategory) {
    if (!subcat) return true;
    const map = {
        electrical_supplies: {
            bulbs: ['electrical_supplies'],
            cables: ['electrical_supplies'],
            smart: ['electrical_supplies'],
            tools: ['tools']
        },
        tools: {
            drills: ['tools'],
            saws: ['tools'],
            hand: ['tools'],
            kits: ['tools']
        },
        gardening: {
            plants: ['gardening'],
            care: ['gardening'],
            tools: ['tools'],
            pots: ['gardening']
        },
        painting_supplies: {
            paints: ['painting_supplies'],
            rollers: ['painting_supplies'],
            prep: ['painting_supplies'],
            tapes: ['painting_supplies']
        },
        building_materials: {
            cement: ['building_materials'],
            wood: ['building_materials'],
            insulation: ['building_materials'],
            hardware: ['building_materials']
        }
    };
    const keys = map[primaryCategory]?.[subcat.key] || [];
    return keys.includes(product.category);
}
