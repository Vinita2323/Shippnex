import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { AdminSidebar } from '../components/AdminSidebar';
import { AdminHeader } from '../components/AdminHeader';
import { AdminDashboard } from '../pages/AdminDashboard';
import { 
  UserManagement, 
  SellerManagement, 
  DriverManagement, 
  WarehouseManagement, 
  CategoryManagement, 
  ProductManagement, 
  OrderManagement, 
  DeliveryManagement, 
  PaymentManagement, 
  CouponManagement, 
  ReportManagement, 
  NotificationManagement, 
  RoleManagement, 
  SettingManagement 
} from '../pages/AdminSubPages';

export const AdminLayout = () => {
  const { activeTab, setActiveTab } = useAdmin();

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard onNavigate={(tab) => setActiveTab(tab)} />;
      case 'users':
        return <UserManagement />;
      case 'sellers':
        return <SellerManagement />;
      case 'drivers':
        return <DriverManagement />;
      case 'warehouses':
        return <WarehouseManagement />;
      case 'categories':
        return <CategoryManagement />;
      case 'products':
        return <ProductManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'deliveries':
        return <DeliveryManagement />;
      case 'payments':
        return <PaymentManagement />;
      case 'coupons':
        return <CouponManagement />;
      case 'reports':
        return <ReportManagement />;
      case 'notifications':
        return <NotificationManagement />;
      case 'roles':
        return <RoleManagement />;
      case 'settings':
        return <SettingManagement />;
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
