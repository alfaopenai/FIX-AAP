import Layout from "./Layout.jsx";

import ReportIssue from "./ReportIssue";

import Messages from "./Messages";

import Profile from "./Profile";

import FindProfessionals from "./FindProfessionals";

import Marketplace from "./Marketplace";

import HomePage from "./HomePage";

import BrowseProfessionals from "./BrowseProfessionals";

import Store from "./Store";

import Account from "./Account";

import PaymentMethods from "./PaymentMethods";

import Settings from "./Settings";

import HelpSupport from "./HelpSupport";

import ProfessionalProfile from "./ProfessionalProfile";

import Auth from "./Auth";

import Registration from "./Registration";

import ServiceProviderDashboard from "./ServiceProviderDashboard";

import ProviderJobs from "./ProviderJobs";

import ProviderMessages from "./ProviderMessages";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

import { useAuth } from '@/contexts/AuthContext';

const PAGES = {
    
    ReportIssue: ReportIssue,
    
    Messages: Messages,
    
    Profile: Profile,
    
    FindProfessionals: FindProfessionals,
    
    Marketplace: Marketplace,
    
    HomePage: HomePage,
    
    BrowseProfessionals: BrowseProfessionals,
    
    Store: Store,
    
    Account: Account,
    
    PaymentMethods: PaymentMethods,
    
    Settings: Settings,
    
    HelpSupport: HelpSupport,
    
    ProfessionalProfile: ProfessionalProfile,
    
    Auth: Auth,
    
    Registration: Registration,
    
    ServiceProviderDashboard: ServiceProviderDashboard,
    
    ProviderJobs: ProviderJobs,
    
    ProviderMessages: ProviderMessages,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Protected Route Component
function ProtectedRoute({ children, requiredUserType = null }) {
    const { isAuthenticated, userType, isLoading } = useAuth();
    
    if (isLoading) {
        return <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-foreground">טוען...</div>
        </div>;
    }
    
    if (!isAuthenticated) {
        return <Auth />;
    }
    
    if (requiredUserType && userType !== requiredUserType) {
        // Redirect to appropriate dashboard based on user type
        if (userType === 'service_provider') {
            return <ServiceProviderDashboard />;
        } else {
            return <Marketplace />;
        }
    }
    
    return children;
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const { isAuthenticated, userType } = useAuth();
    const currentPage = _getCurrentPage(location.pathname);
    
    // If not authenticated and not on auth/registration page, show auth
    if (!isAuthenticated 
        && !location.pathname.includes('/Auth') 
        && !location.pathname.includes('/Registration')) {
        return <Auth />;
    }
    

    
    // Auth and Registration pages don't need Layout
    if (location.pathname.includes('/Auth') || location.pathname.includes('/Registration')) {
        return (
            <Routes>
                <Route path="/Auth" element={<Auth />} />
                <Route path="/Registration" element={<Registration />} />
            </Routes>
        );
    }
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                <Route path="/" element={
                    <ProtectedRoute>
                        <HomePage />
                    </ProtectedRoute>
                } />
                
                <Route path="/ReportIssue" element={
                    <ProtectedRoute requiredUserType="client">
                        <ReportIssue />
                    </ProtectedRoute>
                } />
                
                <Route path="/Messages" element={
                    <ProtectedRoute>
                        <Messages />
                    </ProtectedRoute>
                } />
                
                <Route path="/Profile" element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                } />
                
                <Route path="/FindProfessionals" element={
                    <ProtectedRoute requiredUserType="client">
                        <FindProfessionals />
                    </ProtectedRoute>
                } />
                
                <Route path="/Marketplace" element={
                    <ProtectedRoute>
                        <Marketplace />
                    </ProtectedRoute>
                } />
                
                <Route path="/HomePage" element={
                    <ProtectedRoute>
                        <HomePage />
                    </ProtectedRoute>
                } />
                
                <Route path="/BrowseProfessionals" element={
                    <ProtectedRoute>
                        <BrowseProfessionals />
                    </ProtectedRoute>
                } />
                
                <Route path="/Store" element={
                    <ProtectedRoute>
                        <Store />
                    </ProtectedRoute>
                } />
                
                <Route path="/serviceproviderdashboard" element={
                    <ProtectedRoute requiredUserType="service_provider">
                        <Profile />
                    </ProtectedRoute>
                } />
                
                <Route path="/providerjobs" element={
                    <ProtectedRoute requiredUserType="service_provider">
                        <ProviderJobs />
                    </ProtectedRoute>
                } />
                
                <Route path="/providermessages" element={
                    <ProtectedRoute requiredUserType="service_provider">
                        <ProviderMessages />
                    </ProtectedRoute>
                } />
                
                <Route path="/Account" element={
                    <ProtectedRoute>
                        <Account />
                    </ProtectedRoute>
                } />
                
                <Route path="/PaymentMethods" element={
                    <ProtectedRoute requiredUserType="client">
                        <PaymentMethods />
                    </ProtectedRoute>
                } />
                
                <Route path="/Settings" element={
                    <ProtectedRoute>
                        <Settings />
                    </ProtectedRoute>
                } />
                
                <Route path="/HelpSupport" element={
                    <ProtectedRoute>
                        <HelpSupport />
                    </ProtectedRoute>
                } />
                
                <Route path="/ProfessionalProfile" element={
                    <ProtectedRoute>
                        <ProfessionalProfile />
                    </ProtectedRoute>
                } />
                
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}