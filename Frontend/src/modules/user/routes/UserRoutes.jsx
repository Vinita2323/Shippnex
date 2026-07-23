import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from '../pages/Home';
import Categories from '../pages/Categories';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Payment from '../pages/Payment';
import TrackOrder from '../pages/TrackOrder';
import Orders from '../pages/Orders';
import Profile from '../pages/Profile';
import Login from '../pages/Login';
import ProductDetails from '../pages/ProductDetails';
import Wishlist from '../pages/Wishlist';
import Notifications from '../pages/Notifications';
import BottomNav from '../components/BottomNav';
import AccountInfo from '../pages/AccountInfo';
import SavedAddresses from '../pages/SavedAddresses';
import Security from '../pages/Security';
import Terms from '../pages/Terms';
import Faqs from '../pages/Faqs';
import HelpSupport from '../pages/HelpSupport';
import TransportHome from '../pages/transport/TransportHome';
import LocationSelection from '../pages/transport/LocationSelection';
import GoodsDetails from '../pages/transport/GoodsDetails';
import VehicleSelection from '../pages/transport/VehicleSelection';
import FareSummary from '../pages/transport/FareSummary';
import BookingCompleted from '../pages/transport/BookingCompleted';
import TransportBookingDetails from '../pages/transport/TransportBookingDetails';

const UserRoutes = () => {
  const location = useLocation();
  const isCart = location.pathname === '/cart';
  const isCheckout = location.pathname === '/checkout';
  const isPayment = location.pathname === '/payment';
  const isTrackOrder = location.pathname === '/track-order';
  const isProfile = location.pathname === '/profile';
  const isLogin = location.pathname === '/login';
  const isProductDetails = location.pathname.startsWith('/product');
  const isWishlist = location.pathname === '/wishlist';
  const isNotifications = location.pathname === '/notifications';
  const isPlaceholder = ['/account-information', '/saved-addresses', '/security', '/terms', '/faqs', '/support'].includes(location.pathname);
  
  // Transport flow routes that should hide the bottom nav
  const isTransportFlow = ['/transport/location', '/transport/goods', '/transport/vehicle', '/transport/summary', '/transport/success', '/transport/booking-details'].includes(location.pathname);
  
  // Do NOT hide bottom nav on /transport
  const hideBottomNav = isCart || isCheckout || isPayment || isTrackOrder || isProfile || isLogin || isProductDetails || isWishlist || isNotifications || isPlaceholder || isTransportFlow;

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/orders" element={<Orders />} />
        
        {/* Transport Routes */}
        <Route path="/transport" element={<TransportHome />} />
        <Route path="/transport/location" element={<LocationSelection />} />
        <Route path="/transport/goods" element={<GoodsDetails />} />
        <Route path="/transport/vehicle" element={<VehicleSelection />} />
        <Route path="/transport/summary" element={<FareSummary />} />
        <Route path="/transport/success" element={<BookingCompleted />} />
        <Route path="/transport/booking-details" element={<TransportBookingDetails />} />

        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/account-information" element={<AccountInfo />} />
        <Route path="/saved-addresses" element={<SavedAddresses />} />
        <Route path="/security" element={<Security />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/faqs" element={<Faqs />} />
        <Route path="/support" element={<HelpSupport />} />
      </Routes>
      
      {/* Shared Navigation - Hidden during checkout/payment flow */}
      {!hideBottomNav && <BottomNav />}
    </>
  );
};

export default UserRoutes;
