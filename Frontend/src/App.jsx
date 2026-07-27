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

function App() {
  const location = useLocation();
  const isDriverRoute = location.pathname.startsWith('/driver');
  const isSellerRoute = location.pathname.startsWith('/seller');
  const isAdminRoute = location.pathname.startsWith('/admin');
  const bypassSplash = isDriverRoute || isSellerRoute || isAdminRoute;
  const [showSplash, setShowSplash] = useState(!bypassSplash);

  if (showSplash && !bypassSplash) {
    return <SplashScreen onGetStarted={() => setShowSplash(false)} />;
  }

  return (
    <div className="App">
      <WishlistProvider>
        <CartProvider>
          <OrderProvider>
            <TransportProvider>
              <Routes>
                <Route path="/driver/*" element={<DeliveryRoutes />} />
                <Route path="/seller/*" element={<SellerRoutes />} />
                <Route path="/admin/*" element={<AdminRoutes />} />
                <Route path="/*" element={<UserRoutes />} />
              </Routes>
            </TransportProvider>
          </OrderProvider>
        </CartProvider>
      </WishlistProvider>
    </div>
  );
}

export default App;
