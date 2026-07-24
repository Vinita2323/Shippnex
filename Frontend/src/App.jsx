import React, { useState } from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
import SplashScreen from './modules/user/pages/SplashScreen';
import UserRoutes from './modules/user/routes/UserRoutes';
import DeliveryRoutes from './modules/delivery/routes/DeliveryRoutes';
import { CartProvider } from './modules/user/context/CartContext';
import { WishlistProvider } from './modules/user/context/WishlistContext';
import { OrderProvider } from './modules/user/context/OrderContext';
import { TransportProvider } from './modules/user/context/TransportContext';

function App() {
  const location = useLocation();
  const isDriverRoute = location.pathname.startsWith('/driver');
  const [showSplash, setShowSplash] = useState(!isDriverRoute);

  if (showSplash && !isDriverRoute) {
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
