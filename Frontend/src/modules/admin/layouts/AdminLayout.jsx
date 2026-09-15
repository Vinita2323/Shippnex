import React from 'react';
import { useAdmin } from '../context/useAdmin';
import { AdminSidebar } from '../components/AdminSidebar';
import { AdminHeader } from '../components/AdminHeader';
import { AdminDashboard } from '../pages/AdminDashboard';
import { 
  UserManagement, 
  SellerManagement, 
  SellersOverview,
  CaptainManagement, 
  CategoryManagement, 
  BrandManagement,
  ProductManagement,
  AddProductPage, 
  SkuAuditManagement,
  OrderManagement, 
  DeliveryManagement, 
  CouponManagement, 
  ReportManagement, 
  FaqManagement, 
  RoleManagement, 
  SettingManagement,
  TaxManagement,
  AdminProfile
} from '../pages/AdminSubPages';
import {
  SellerMembershipPlans,
  SellerMembershipSubscriptions,
  CaptainMembershipPlans,
  CaptainMembershipSubscriptions,
} from '../pages/MembershipPages';
import {
  PromotionDashboard,
  PromoHomeSection,
  PromoCategoryProducts,
  PromoBestseller,
  PromoStrip,
  PromoLowestPrices,
  PromoShopByStore,
  PromoHomeBanners,
  PromoFlashSale
} from '../pages/PromotionPages';

import { AdminLocationDashboard } from '../pages/AdminLocationDashboard';
import { PolicyManagement } from '../pages/PolicyManagement';
import { ProfileEditRequests } from '../pages/ProfileEditRequests';

const FinancialAuthorityTransferred = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-2xl mx-auto mt-12">
    <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center text-2xl font-bold mb-4">
      🔒
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-2">Financial Authority Restricted</h3>
    <p className="text-sm text-slate-600 max-w-md mb-6 leading-relaxed">
      In accordance with platform governance, all financial operations including wallets, settlements, payouts, transactions, and commission management have been moved exclusively to the <strong className="text-slate-900">Super Admin Panel</strong>.
    </p>
    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
      Operational administrators are restricted to catalog, inventory, order fulfillment, customers, and fleet operations.
    </div>
  </div>
);

export const AdminLayout = () => {
  const { activeTab, setActiveTab } = useAdmin();

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'seller-registration-fee':
      case 'seller_registration_fee':
      case 'registration_fee':
      case 'seller-fee':
        return <FinancialAuthorityTransferred />;
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
      case 'orders_return':
        return <OrderManagement />;
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
          {renderActiveTabContent()}
        </main>
      </div>
    </div>
  );
};
