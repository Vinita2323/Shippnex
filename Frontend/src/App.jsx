import React, { useState } from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
import SplashScreen from './modules/user/pages/SplashScreen';
import UserRoutes from './modules/user/routes/UserRoutes';
import DeliveryRoutes from './modules/delivery/routes/DeliveryRoutes';
import SellerRoutes from './modules/seller/routes/SellerRoutes';
import AdminRoutes from './modules/admin/routes/AdminRoutes';
import { CartProvider } from './modules/user/context/CartContext';
import { WishlistProvider } from './modules/user/context/WishlistContext';
import { OrderProvider } from './modules/user/context/OrderContext';
import { TransportProvider } from './modules/user/context/TransportContext';

import { LocationProvider } from './context/LocationContext';

function App() {
  const location = useLocation();
  const isCaptainRoute = location.pathname.startsWith('/captain');
  const isSellerRoute = location.pathname.startsWith('/seller');
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // Bypass splash screen if accessing any specific sub-route or if splash has already been dismissed
  const isSpecificRoute = location.pathname !== '/' && location.pathname !== '';
  const hasSeenSplash = typeof window !== 'undefined' && sessionStorage.getItem('shippnex_splash_seen') === 'true';
  const bypassSplash = isCaptainRoute || isSellerRoute || isAdminRoute || isSpecificRoute || hasSeenSplash;

  const [showSplash, setShowSplash] = useState(!bypassSplash);

  const handleGetStarted = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('shippnex_splash_seen', 'true');
    }
    setShowSplash(false);
  };

  if (showSplash && !bypassSplash) {
    return <SplashScreen onGetStarted={handleGetStarted} />;
  }

  return (
    <div className="App">
      <LocationProvider>
        <WishlistProvider>
          <CartProvider>
            <OrderProvider>
              <TransportProvider>
                <Routes>
                  <Route path="/captain/*" element={<DeliveryRoutes />} />
                  <Route path="/seller/*" element={<SellerRoutes />} />
                  <Route path="/admin/*" element={<AdminRoutes />} />
                  <Route path="/*" element={<UserRoutes />} />
                </Routes>
              </TransportProvider>
            </OrderProvider>
          </CartProvider>
        </WishlistProvider>
      </LocationProvider>
    </div>
  );
}

export default App;
