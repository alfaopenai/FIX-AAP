

import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import mainButtonIcon from '@/assets/icons/6dd8341a-ee29-4f28-914d-7006578775e1.png';
import jobsIcon from '@/assets/icons/0722e73b-ff42-4b7b-b555-ee7535911db2.png';
import messagesIcon from '@/assets/icons/54a0eeff-4ef7-4df6-bda4-f5b8cea86a4b.png';
import { MessageCircle, User, Store, Users, Bot, LogOut, Briefcase, ShoppingBag, Wrench, Home } from "lucide-react";
import { CartIcon, Cart } from "@/components/ui/cart";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [indicatorStyle, setIndicatorStyle] = useState({ opacity: 0 });
  const itemRefs = useRef([]);
  const [hoveredIndex, setHoveredIndex] = useState(null); // New state for hover effect
  // Reset itemRefs.current on each render to ensure fresh references
  // This is a common pattern when dynamically adding/removing refs in a map.
  itemRefs.current = [];

  const handleLogout = () => {
    logout();
    navigate(createPageUrl('Auth'));
  }; 

  // Determine user type
  const { userType } = useAuth();
  const isProvider = userType === 'service_provider';

  // Fixed navigation items for all pages - same as requested
  const navItemsLeft = isProvider ? [
    // Provider view: Store → Marketplace מוצרים, Jobs → פניות פתוחות
    { name: 'Store', icon: ShoppingBag, path: createPageUrl('Marketplace'), customIcon: 'https://img.icons8.com/3d-fluency/94/shop.png' },
    { name: 'Jobs', icon: Briefcase, path: createPageUrl('ProviderJobs'), customIcon: jobsIcon },
  ] : [
    // Client view: Store → Marketplace מוצרים, Jobs → חיפוש בעלי מקצוע
    { name: 'Store', icon: ShoppingBag, path: createPageUrl('Marketplace'), customIcon: 'https://img.icons8.com/3d-fluency/94/shop.png' },
    { name: 'Jobs', icon: Briefcase, path: createPageUrl('BrowseProfessionals'), customIcon: jobsIcon },
  ];

  const navItemsRight = [
    { name: 'Messages', icon: MessageCircle, path: isProvider ? createPageUrl('ProviderMessages') : createPageUrl('Messages'), customIcon: messagesIcon },
    { name: 'Profile', icon: Users, path: isProvider ? createPageUrl('ServiceProviderDashboard') : createPageUrl('Profile'), customIcon: 'https://img.icons8.com/3d-fluency/94/user-male-circle.png' },
  ];
  
  // For the mobile navigation indicator, we only include the items that will be measured.
  const allNavItemsForMobile = [...navItemsLeft, ...navItemsRight];

  // Helper function to determine if a path is active
  const isActive = (path) => location.pathname === path || (path === createPageUrl("HomePage") && location.pathname === createPageUrl("Dashboard"));

  // Function to add elements to the ref array
  const addToRefs = (el) => {
    if (el && !itemRefs.current.includes(el)) {
      itemRefs.current.push(el);
    }
  };

  // Calculate active item index outside useEffect for use in dependency array
  const activeItemIndex = allNavItemsForMobile.findIndex(item => isActive(item.path));

  // Effect to reset scroll position when location changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Effect to calculate and set the indicator's position and size
  useEffect(() => {
    // Determine the target index: hovered item takes precedence over active item
    const targetIndex = hoveredIndex !== null ? hoveredIndex : activeItemIndex;
    
    // Get the DOM node for the target item
    const targetNode = itemRefs.current[targetIndex];

    if (targetNode) {
      // Set the style for the indicator based on the target item's position and size
      setIndicatorStyle({
        left: targetNode.offsetLeft,
        width: targetNode.offsetWidth,
        height: targetNode.offsetHeight,
        opacity: 1, // Make the indicator visible
      });
    } else {
      // If no item is active or hovered (or node not found), hide the indicator
      // Only hide if there's no active item AND no hover, otherwise, the indicator should be visible for the active item.
      if (activeItemIndex === -1 && hoveredIndex === null) {
        setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
      } else if (hoveredIndex === null && activeItemIndex !== -1) {
        // If an active item exists but its node wasn't found (shouldn't happen if refs are correctly populated), hide.
        setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
      }
    }
  }, [hoveredIndex, activeItemIndex, location.pathname, allNavItemsForMobile.length]); // Re-run when location changes, hover state changes, active item changes, or nav items count changes

  return (
    <div className="min-h-screen bg-background text-foreground overflow-y-auto">
      <style>{`
        .floating-card {
          backdrop-filter: blur(20px);
          background: color-mix(in oklab, var(--background) 85%, black 15%);
          border: 1px solid color-mix(in oklab, var(--foreground) 10%, transparent 90%);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .glass-effect {
          backdrop-filter: blur(20px);
          background: color-mix(in oklab, var(--background) 80%, black 20%);
          border: 1px solid color-mix(in oklab, var(--foreground) 10%, transparent 90%);
        }

        @keyframes wrench-jiggle {
          0% { transform: rotate(0deg) scale(1.5); }
          25% { transform: rotate(5deg) scale(1.5); }
          50% { transform: rotate(-5deg) scale(1.5); }
          75% { transform: rotate(5deg) scale(1.5); }
          100% { transform: rotate(0deg) scale(1.5); }
        }

        .group:hover .animate-wrench {
          animation: wrench-jiggle 0.4s ease-in-out infinite;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out; }
      `}</style>

      {/* Logout Button - Only on Profile Pages */}
      {(location.pathname === createPageUrl('Profile') || location.pathname === createPageUrl('ServiceProviderDashboard')) && (
        <div className="fixed top-4 left-4 flex gap-2 z-[60] hide-when-cart-open">
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="icon"
            className="bg-gray-900/90 hover:bg-red-600/90 border border-gray-600 text-white hover:text-white rounded-full backdrop-blur-sm transition-all duration-300 shadow-lg hover:shadow-red-500/30"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Main Content - Full Height */}
      <main className="pb-24 lg:pb-0">
        <div className="lg:ml-64">
            {children}
        </div>
      </main>

      {/* Enhanced Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass-effect lg:hidden h-20 z-50 border-t border-white/10">
        {/* Sliding Glass Indicator */}
        <div
          className="absolute top-1/2 -translate-y-1/2 rounded-2xl transition-all duration-300 ease-in-out"
          style={{ ...indicatorStyle }}
        >
          <div className="w-full h-full bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"></div>
        </div>

        <div className="flex justify-around items-center h-full px-2">
            {allNavItemsForMobile.map((item, index) => (
              <React.Fragment key={item.name}>
                {/* Insert a spacer div for the center button after the first two items */}
                {index === 2 && <div className="w-20 flex-shrink-0"></div>}
                <Link
                  ref={addToRefs} // Attach ref to the Link component
                  to={item.path}
                  onMouseEnter={() => setHoveredIndex(index)} // Set hovered index on mouse enter
                  onMouseLeave={() => setHoveredIndex(null)} // Reset hovered index on mouse leave
                  className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 z-10`}
                  onClick={() => {
                    if (item.name === 'Profile') {
                      // Force navigation to profile page
                      navigate(item.path);
                    }
                  }}
                >
                  {item.customIcon ? (
                    <img src={item.customIcon} alt={item.name} className={item.name === 'Messages' ? "w-12 h-12" : "w-10 h-10"} />
                  ) : (
                    <item.icon className="w-6 h-6 text-foreground" />
                  )}
                  {/* Item names are removed from mobile nav for cleaner icon-only display */}
                </Link>
              </React.Fragment>
            ))}
        </div>
        
        {/* Center button to AI chat (no circular background) */}
        <Link 
          to={createPageUrl('HomePage')} 
          className="group absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-28 h-28 hover:scale-110 transition-transform duration-300"
        >
          <img 
            src={mainButtonIcon} 
            alt="Main Button" 
            className="w-28 h-28 object-contain"
          />
        </Link>
        

      </nav>

      {/* Enhanced Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:left-0 lg:top-0 lg:bottom-0 lg:w-64 lg:glass-effect lg:border-r lg:border-white/10 lg:flex lg:flex-col">
         <div className="flex items-center justify-center p-6 border-b border-white/10">
              <div className="h-20 w-20 rounded-full flex items-center justify-center">
                <img 
                  src={mainButtonIcon} 
                  alt="Logo" 
                  className="w-20 h-20 rounded-full" 
                />
              </div>
        </div>
        <div className="p-4 space-y-2 flex-1">
          {/* Desktop sidebar includes all items, including the Home item */}
          {[...navItemsLeft, { name: "Home", icon: Bot, path: isProvider ? createPageUrl("ServiceProviderDashboard") : createPageUrl("HomePage") }, ...navItemsRight].map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 ${
                isActive(item.path)
                  ? "bg-gradient-to-r from-blue-500/20 to-cyan-400/20 text-white font-bold border border-blue-500/30 shadow-lg shadow-blue-500/10"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.customIcon ? (
                <img src={item.customIcon} alt={item.name} className={item.name === 'Messages' ? "w-10 h-10" : "w-8 h-8"} />
              ) : (
                <item.icon className="w-5 h-5" />
              )}
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </div>
        

              </aside>
        
        {/* Floating Cart Button */}
        <div className="fixed bottom-24 right-6 z-50 lg:bottom-6">
            <CartIcon />
        </div>

        {/* Cart Component */}
        <Cart />
      </div>
    );
  }

