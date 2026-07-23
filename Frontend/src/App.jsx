import React, { useState } from 'react';
import SplashScreen from './modules/user/pages/SplashScreen';
import UserRoutes from './modules/user/routes/UserRoutes';
import { CartProvider } from './modules/user/context/CartContext';
import { WishlistProvider } from './modules/user/context/WishlistContext';
import { OrderProvider } from './modules/user/context/OrderContext';
import { TransportProvider } from './modules/user/context/TransportContext';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onGetStarted={() => setShowSplash(false)} />;
  }

  return (
    <div className="App">
      <WishlistProvider>
        <CartProvider>
          <OrderProvider>
            <TransportProvider>
              <UserRoutes />
            </TransportProvider>
          </OrderProvider>
        </CartProvider>
      </WishlistProvider>
    </div>
  );
}

export default App;
