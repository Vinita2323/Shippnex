import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import ProtectedRoute from '../../../components/ProtectedRoute';
import Home from '../pages/Home';
import Categories from '../pages/Categories';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Payment from '../pages/Payment';
import TrackOrder from '../pages/TrackOrder';
import Orders from '../pages/Orders';
import Profile from '../pages/Profile';
import Login from '../pages/Login';
import VerifyOtp from '../pages/VerifyOtp';
import ProductDetails from '../pages/ProductDetails';
import Wishlist from '../pages/Wishlist';
import FlashSale from '../pages/FlashSale';
import BestSelling from '../pages/BestSelling';
import AllSellers from '../pages/AllSellers';
import SellerStore from '../pages/SellerStore';
import LocationSelectionPage from '../pages/LocationSelectionPage';
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
import TransportRegistration from '../pages/transport/TransportRegistration';

const UserRoutes = () => {
  const location = useLocation();
  const isCart = location.pathname === '/cart';
  const isCheckout = location.pathname === '/checkout';
  const isPayment = location.pathname === '/payment';
  const isTrackOrder = location.pathname === '/track-order';
  const isProfile = location.pathname === '/profile';
  const isLogin = location.pathname === '/login';
  const isVerifyOtp = location.pathname === '/verify-otp';
  const isProductDetails = location.pathname.startsWith('/product');
  const isSellerStore = location.pathname.startsWith('/store');
  const isWishlist = location.pathname === '/wishlist';
  const isFlashSale = location.pathname === '/flash-sale';
  const isNotifications = location.pathname === '/notifications';
  const isLocation = location.pathname === '/location';
  const isPlaceholder = ['/account-information', '/saved-addresses', '/security', '/terms', '/privacy', '/faqs', '/support'].includes(location.pathname);
  
  // Transport flow routes that should hide the bottom nav
  const isTransportFlow = ['/transport/register', '/transport/location', '/transport/goods', '/transport/vehicle', '/transport/summary', '/transport/success', '/transport/booking-details'].includes(location.pathname);
  
  const hideBottomNav = isCart || isCheckout || isPayment || isTrackOrder || isProfile || isLogin || isVerifyOtp || isProductDetails || isSellerStore || isWishlist || isFlashSale || isNotifications || isLocation || isPlaceholder || isTransportFlow;

  return (
    <>
      <Routes>
        {/* Public Browsing Routes (Accessible to Guests) */}
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/sellers" element={<AllSellers />} />
        <Route path="/store/:sellerId" element={<SellerStore />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/flash-sale" element={<FlashSale />} />
        <Route path="/bestseller" element={<BestSelling />} />
        <Route path="/location" element={<LocationSelectionPage />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Terms />} />
        <Route path="/faqs" element={<Faqs />} />
        <Route path="/support" element={<HelpSupport />} />

        {/* Protected User Routes (Requires User Authentication) */}
        <Route element={<ProtectedRoute role="user" />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/account-information" element={<AccountInfo />} />
          <Route path="/saved-addresses" element={<SavedAddresses />} />
          <Route path="/security" element={<Security />} />
          
          {/* Transport Routes */}
          <Route path="/transport" element={<TransportHome />} />
          <Route path="/transport/register" element={<TransportRegistration />} />
          <Route path="/transport/location" element={<LocationSelection />} />
          <Route path="/transport/goods" element={<GoodsDetails />} />
          <Route path="/transport/vehicle" element={<VehicleSelection />} />
          <Route path="/transport/summary" element={<FareSummary />} />
          <Route path="/transport/success" element={<BookingCompleted />} />
          <Route path="/transport/booking-details" element={<TransportBookingDetails />} />
        </Route>
      </Routes>
      
      {/* Shared Navigation */}
      {!hideBottomNav && <BottomNav />}
    </>
  );
};

export default UserRoutes;
