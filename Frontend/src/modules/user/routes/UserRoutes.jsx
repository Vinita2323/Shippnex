import React, { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import ProtectedRoute from '../../../components/ProtectedRoute';
import PageSkeleton from '../../../components/PageSkeleton';
import Home from '../pages/Home';
import BottomNav from '../components/BottomNav';

const Categories = lazy(() => import('../pages/Categories'));
const Cart = lazy(() => import('../pages/Cart'));
const Checkout = lazy(() => import('../pages/Checkout'));
const Payment = lazy(() => import('../pages/Payment'));
const TrackOrder = lazy(() => import('../pages/TrackOrder'));
const Orders = lazy(() => import('../pages/Orders'));
const Profile = lazy(() => import('../pages/Profile'));
const Login = lazy(() => import('../pages/Login'));
const VerifyOtp = lazy(() => import('../pages/VerifyOtp'));
const ProductDetails = lazy(() => import('../pages/ProductDetails'));
const Wishlist = lazy(() => import('../pages/Wishlist'));
const FlashSale = lazy(() => import('../pages/FlashSale'));
const BestSelling = lazy(() => import('../pages/BestSelling'));
const AllSellers = lazy(() => import('../pages/AllSellers'));
const SellerStore = lazy(() => import('../pages/SellerStore'));
const LocationSelectionPage = lazy(() => import('../pages/LocationSelectionPage'));
const Notifications = lazy(() => import('../pages/Notifications'));
const AccountInfo = lazy(() => import('../pages/AccountInfo'));
const SavedAddresses = lazy(() => import('../pages/SavedAddresses'));
const Security = lazy(() => import('../pages/Security'));
const Terms = lazy(() => import('../pages/Terms'));
const Faqs = lazy(() => import('../pages/Faqs'));
const HelpSupport = lazy(() => import('../pages/HelpSupport'));
const TransportHome = lazy(() => import('../pages/transport/TransportHome'));
const LocationSelection = lazy(() => import('../pages/transport/LocationSelection'));
const GoodsDetails = lazy(() => import('../pages/transport/GoodsDetails'));
const VehicleSelection = lazy(() => import('../pages/transport/VehicleSelection'));
const FareSummary = lazy(() => import('../pages/transport/FareSummary'));
const BookingCompleted = lazy(() => import('../pages/transport/BookingCompleted'));
const TransportBookingDetails = lazy(() => import('../pages/transport/TransportBookingDetails'));
const TransportRegistration = lazy(() => import('../pages/transport/TransportRegistration'));

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
      <Suspense fallback={<PageSkeleton />}>
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
      </Suspense>
      
      {/* Shared Navigation */}
      {!hideBottomNav && <BottomNav />}
    </>
  );
};

export default UserRoutes;
