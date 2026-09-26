import React, { lazy, Suspense } from 'react';
import { useAdmin } from '../context/useAdmin';
import { AdminSidebar } from '../components/AdminSidebar';
import { AdminHeader } from '../components/AdminHeader';
import PageSkeleton from '../../../components/PageSkeleton';

// Lazy-loaded Admin Subpages and Features
const AdminDashboard = lazy(() => import('../pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));

const UserManagement = lazy(() => import('../pages/AdminSubPages').then(m => ({ default: m.UserManagement })));
const SellerManagement = lazy(() => import('../pages/AdminSubPages').then(m => ({ default: m.SellerManagement })));
const SellersOverview = lazy(() => import('../pages/AdminSubPages').then(m => ({ default: m.SellersOverview })));
const CaptainManagement = lazy(() => import('../pages/AdminSubPages').then(m => ({ default: m.CaptainManagement })));
const CategoryManagement = lazy(() => import('../pages/AdminSubPages').then(m => ({ default: m.CategoryManagement })));
const BrandManagement = lazy(() => import('../pages/AdminSubPages').then(m => ({ default: m.BrandManagement })));
const ProductManagement = lazy(() => import('../pages/AdminSubPages').then(m => ({ default: m.ProductManagement })));
const AddProductPage = lazy(() => import('../pages/AdminSubPages').then(m => ({ default: m.AddProductPage })));
const SkuAuditManagement = lazy(() => import('../pages/AdminSubPages').then(m => ({ default: m.SkuAuditManagement })));
const OrderManagement = lazy(() => import('../pages/AdminSubPages').then(m => ({ default: m.OrderManagement })));
const DeliveryManagement = lazy(() => import('../pages/AdminSubPages').then(m => ({ default: m.DeliveryManagement })));
const CouponManagement = lazy(() => import('../pages/AdminSubPages').then(m => ({ default: m.CouponManagement })));
const ReportManagement = lazy(() => import('../pages/AdminSubPages').then(m => ({ default: m.ReportManagement })));
const FaqManagement = lazy(() => import('../pages/AdminSubPages').then(m => ({ default: m.FaqManagement })));
const RoleManagement = lazy(() => import('../pages/AdminSubPages').then(m => ({ default: m.RoleManagement })));
const SettingManagement = lazy(() => import('../pages/AdminSubPages').then(m => ({ default: m.SettingManagement })));
const TaxManagement = lazy(() => import('../pages/AdminSubPages').then(m => ({ default: m.TaxManagement })));
const AdminProfile = lazy(() => import('../pages/AdminSubPages').then(m => ({ default: m.AdminProfile })));

// Membership Pages
const SellerMembershipPlans = lazy(() => import('../pages/MembershipPages').then(m => ({ default: m.SellerMembershipPlans })));
const SellerMembershipSubscriptions = lazy(() => import('../pages/MembershipPages').then(m => ({ default: m.SellerMembershipSubscriptions })));
const CaptainMembershipPlans = lazy(() => import('../pages/MembershipPages').then(m => ({ default: m.CaptainMembershipPlans })));
const CaptainMembershipSubscriptions = lazy(() => import('../pages/MembershipPages').then(m => ({ default: m.CaptainMembershipSubscriptions })));

// Promotion Pages
const PromotionDashboard = lazy(() => import('../pages/PromotionPages').then(m => ({ default: m.PromotionDashboard })));
const PromoHomeSection = lazy(() => import('../pages/PromotionPages').then(m => ({ default: m.PromoHomeSection })));
const PromoCategoryProducts = lazy(() => import('../pages/PromotionPages').then(m => ({ default: m.PromoCategoryProducts })));
const PromoBestseller = lazy(() => import('../pages/PromotionPages').then(m => ({ default: m.PromoBestseller })));
const PromoStrip = lazy(() => import('../pages/PromotionPages').then(m => ({ default: m.PromoStrip })));
const PromoLowestPrices = lazy(() => import('../pages/PromotionPages').then(m => ({ default: m.PromoLowestPrices })));
const PromoShopByStore = lazy(() => import('../pages/PromotionPages').then(m => ({ default: m.PromoShopByStore })));
const PromoHomeBanners = lazy(() => import('../pages/PromotionPages').then(m => ({ default: m.PromoHomeBanners })));
const PromoFlashSale = lazy(() => import('../pages/PromotionPages').then(m => ({ default: m.PromoFlashSale })));

// Dedicated Feature Pages
const AdminLocationDashboard = lazy(() => import('../pages/AdminLocationDashboard').then(m => ({ default: m.AdminLocationDashboard || m.default })));
const PolicyManagement = lazy(() => import('../pages/PolicyManagement').then(m => ({ default: m.PolicyManagement || m.default })));
const ProfileEditRequests = lazy(() => import('../pages/ProfileEditRequests').then(m => ({ default: m.ProfileEditRequests || m.default })));
const CaptainRegistrationFeeAdmin = lazy(() => import('../pages/CaptainRegistrationFeeAdmin').then(m => ({ default: m.CaptainRegistrationFeeAdmin || m.default })));
const SellerRegistrationFeeAdmin = lazy(() => import('../pages/SellerRegistrationFeeAdmin').then(m => ({ default: m.SellerRegistrationFeeAdmin || m.default })));
const CommissionManagement = lazy(() => import('../pages/CommissionManagement').then(m => ({ default: m.CommissionManagement || m.default })));
const ReferralManagement = lazy(() => import('../pages/ReferralManagement').then(m => ({ default: m.ReferralManagement || m.default })));
const ReferralDashboard = lazy(() => import('../pages/ReferralManagement').then(m => ({ default: m.ReferralDashboard })));
const ReferralSettings = lazy(() => import('../pages/ReferralManagement').then(m => ({ default: m.ReferralSettings })));
const ReferralList = lazy(() => import('../pages/ReferralManagement').then(m => ({ default: m.ReferralList })));
const ReturnManagement = lazy(() => import('../pages/ReturnManagement').then(m => ({ default: m.ReturnManagement || m.default })));
const TransportManagement = lazy(() => import('../pages/TransportManagement').then(m => ({ default: m.TransportManagement || m.default })));
const PricingChargesManagement = lazy(() => import('../pages/PricingChargesManagement').then(m => ({ default: m.PricingChargesManagement || m.default })));

const FinancialAuthorityTransferred = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-2xl mx-auto mt-12">
    <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center text-2xl font-bold mb-4">
      🔒
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-2">Financial Authority Restricted</h3>
    <p className="text-sm text-slate-600 max-w-md mb-6 leading-relaxed">
      In accordance with platform governance, all financial operations including wallets, settlements, payouts, and ledger adjustments have been moved to the Super Admin Panel.
    </p>
    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
      Commission Management is active and accessible via the dedicated Commission Management section.
    </div>
  </div>
);

export const AdminLayout = () => {
  const { activeTab, setActiveTab } = useAdmin();

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'referral_dashboard':
      case 'referral-dashboard':
        return <ReferralDashboard onNavigateTab={(tab) => setActiveTab(tab)} />;
      case 'referral_settings':
      case 'referral-settings':
        return <ReferralSettings />;
      case 'referral_list':
      case 'referral-list':
      case 'referrals':
        return <ReferralList />;
      case 'referral_management':
      case 'referral-management':
      case 'referral':
        return <ReferralManagement />;
      case 'commission_management':
      case 'commission-management':
      case 'commissions':
      case 'commission':
        return <CommissionManagement />;
      case 'pricing_charges':
      case 'pricing-charges':
      case 'pricing':
      case 'charges':
        return <PricingChargesManagement initialTab="transport" />;
      case 'pricing_transport':
      case 'pricing-transport':
      case 'transport_pricing':
      case 'transport_charges':
        return <PricingChargesManagement initialTab="transport" />;
      case 'pricing_delivery':
      case 'pricing-delivery':
      case 'delivery_pricing':
      case 'delivery_charges':
        return <PricingChargesManagement initialTab="delivery" />;
      case 'captain-registration-fee':
      case 'captain_registration_fee':
      case 'captain_fee':
        return <CaptainRegistrationFeeAdmin />;
      case 'seller-registration-fee':
      case 'seller_registration_fee':
      case 'registration_fee':
      case 'seller-fee':
        return <SellerRegistrationFeeAdmin />;
      case 'location':
        return <AdminLocationDashboard />;
      case 'dashboard':
        return <AdminDashboard onNavigate={(tab) => setActiveTab(tab)} />;
      case 'profile':
        return <AdminProfile />;
      case 'profile_edit_requests':
      case 'profile_requests':
        return <ProfileEditRequests />;
      case 'users':
      case 'customers':
        return <UserManagement />;
      case 'sellers':
      case 'seller':
        return <SellersOverview />;
      case 'manage_sellers':
      case 'manage-sellers':
      case 'seller_list':
        return <SellerManagement />;
      case 'captains':
      case 'captain':
      case 'delivery_boy':
      case 'delivery-boy':
        return <CaptainManagement />;
      case 'categories':
        return <CategoryManagement initialSubcategoriesOnly={false} />;
      case 'subcategories':
        return <CategoryManagement initialSubcategoriesOnly={true} />;
      case 'brands':
        return <BrandManagement />;
      case 'products':
        return <ProductManagement />;
      case 'add_product':
        return <AddProductPage />;
      case 'sku_audit':
        return <SkuAuditManagement />;
      case 'taxes':
        return <TaxManagement />;
      case 'orders':
      case 'orders_all':
      case 'orders_pending':
      case 'orders_received':
      case 'orders_processed':
      case 'orders_shipped':
      case 'orders_out_for_delivery':
      case 'orders_delivered':
      case 'orders_cancelled':
        return <OrderManagement />;
      case 'orders_return':
      case 'returns':
      case 'return_management':
        return <ReturnManagement />;
      case 'transport':
      case 'transport_all':
      case 'vehicle_logistics':
      case 'logistics':
        return <TransportManagement initialTab="ALL" />;
      case 'transport_searching':
        return <TransportManagement initialTab="SEARCHING_CAPTAIN" />;
      case 'transport_active':
      case 'transport_in_progress':
        return <TransportManagement initialTab="IN_PROGRESS" />;
      case 'transport_completed':
        return <TransportManagement initialTab="RIDE_COMPLETED" />;
      case 'transport_cancelled':
        return <TransportManagement initialTab="CANCELLED" />;
      case 'deliveries':
        return <DeliveryManagement />;
      case 'fund_transfer':
      case 'wallet':
      case 'withdrawals':
      case 'seller_transaction':
      case 'cash_collection':
        return <FinancialAuthorityTransferred />;
      case 'coupons':
        return <CouponManagement />;
      case 'promo_dashboard':
        return <PromotionDashboard />;
      case 'promo_home_section':
        return <PromoHomeSection />;
      case 'promo_category_products':
        return <PromoCategoryProducts />;
      case 'promo_bestseller':
        return <PromoBestseller />;
      case 'promo_strip':
        return <PromoStrip />;
      case 'promo_lowest_prices':
        return <PromoLowestPrices />;
      case 'promo_shop_by_store':
        return <PromoShopByStore />;
      case 'promo_home_banners':
        return <PromoHomeBanners />;
      case 'promo_flash_sale':
        return <PromoFlashSale />;
      case 'reports':
        return <ReportManagement />;
      case 'faqs':
        return <FaqManagement />;
      case 'roles':
        return <RoleManagement />;
      case 'settings':
      case 'payment_list':
      case 'sms_gateway':
      case 'billing_charges':
        return <SettingManagement />;
      case 'policies':
      case 'policy_management':
      case 'customer_app_policy':
      case 'delivery_app_policy':
      case 'seller_app_policy':
        return <PolicyManagement />;
      case 'system_user':
        return <UserManagement />;
      case 'seller_membership_plans':
        return <SellerMembershipPlans />;
      case 'seller_memberships':
        return <SellerMembershipSubscriptions />;
      case 'captain_membership_plans':
        return <CaptainMembershipPlans />;
      case 'captain_memberships':
        return <CaptainMembershipSubscriptions />;
      default:
        return <AdminDashboard onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-slate-800 overflow-hidden select-none">
      {/* Super Admin Sidebar (Preserved) */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header like Seller Panel */}
        <AdminHeader />

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Suspense fallback={<PageSkeleton />}>
            {renderActiveTabContent()}
          </Suspense>
        </main>
      </div>
    </div>
  );
};
