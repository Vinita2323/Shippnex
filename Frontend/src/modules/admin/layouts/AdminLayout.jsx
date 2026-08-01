import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { AdminSidebar } from '../components/AdminSidebar';
import { AdminHeader } from '../components/AdminHeader';
import { AdminDashboard } from '../pages/AdminDashboard';
import { 
  UserManagement, 
  SellerManagement, 
  SellersOverview,
  CaptainManagement, 
  WarehouseManagement, 
  CategoryManagement, 
  BrandManagement,
  ProductManagement, 
  SkuAuditManagement,
  OrderManagement, 
  DeliveryManagement, 
  PaymentManagement, 
  AdminWalletFinance,
  AdminWithdrawals,
  AdminSellerTransactions,
  AdminCashCollection,
  CouponManagement, 
  ReportManagement, 
  FaqManagement, 
  RoleManagement, 
  SettingManagement,
  TaxManagement,
  AdminProfile
} from '../pages/AdminSubPages';
import {
  PromotionDashboard,
  PromoHomeSection,
  PromoCategoryProducts,
  PromoBestseller,
  PromoStrip,
  PromoLowestPrices,
  PromoShopByStore,
  PromoHomeBanners
} from '../pages/PromotionPages';

import { AdminLocationDashboard } from '../pages/AdminLocationDashboard';

export const AdminLayout = () => {
  const { activeTab, setActiveTab } = useAdmin();

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'location':
        return <AdminLocationDashboard />;
      case 'dashboard':
        return <AdminDashboard onNavigate={(tab) => setActiveTab(tab)} />;
      case 'profile':
        return <AdminProfile />;
      case 'users':
        return <UserManagement />;
      case 'sellers':
      case 'seller':
        return <SellersOverview />;
      case 'manage_sellers':
      case 'seller_list':
        return <SellerManagement />;
      case 'captains':
      case 'delivery_boy':
        return <CaptainManagement />;
      case 'warehouses':
      case 'manage_location':
        return <WarehouseManagement />;
      case 'categories':
        return <CategoryManagement initialSubcategoriesOnly={false} />;
      case 'subcategories':
        return <CategoryManagement initialSubcategoriesOnly={true} />;
      case 'brands':
        return <BrandManagement />;
      case 'products':
        return <ProductManagement />;
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
        return <PaymentManagement />;
      case 'wallet':
        return <AdminWalletFinance />;
      case 'withdrawals':
        return <AdminWithdrawals />;
      case 'seller_transaction':
        return <AdminSellerTransactions />;
      case 'cash_collection':
        return <AdminCashCollection />;
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
      case 'reports':
        return <ReportManagement />;
      case 'faqs':
        return <FaqManagement />;
      case 'roles':
        return <RoleManagement />;
      case 'settings':
      case 'payment_list':
      case 'sms_gateway':
      case 'customer_app_policy':
      case 'delivery_app_policy':
      case 'billing_charges':
        return <SettingManagement />;
      case 'system_user':
        return <UserManagement />;
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
