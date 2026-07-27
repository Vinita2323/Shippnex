import React from 'react';
import { StatWidget, StatusBadge } from '../components/AdminUIComponents';
import { 
  mockStats, 
  mockRevenueChartData, 
  mockOrders, 
  mockWarehouses 
} from '../mock/adminMockData';
import { 
  Users, 
  Store, 
  Truck, 
  Warehouse, 
  ShoppingCart, 
  DollarSign, 
  Clock, 
  AlertTriangle, 
  UserCheck, 
  ArrowUpRight,
  TrendingUp,
  Plus
} from 'lucide-react';

export const AdminDashboard = ({ onNavigate }) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Orange Hero Banner matching Seller Dashboard Overview */}
      <div className="bg-[#ff5500] text-white rounded-2xl p-6 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="relative z-10">
          <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 text-white px-3 py-1 rounded-full">
            SUPER ADMIN DASHBOARD OVERVIEW
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-white mt-2 tracking-tight">
            Welcome back, System Administrator! 👋
          </h1>
          <p className="text-xs md:text-sm text-white/90 mt-1 max-w-xl">
            Here is your live platform performance, seller compliance queue, warehouse operations, and financial metrics for today.
          </p>
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <button 
            onClick={() => onNavigate('sellers')}
            className="px-4 py-2.5 bg-white text-[#ff5500] hover:bg-slate-100 text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5 border-none"
          >
            <UserCheck size={16} />
            <span>Pending Approvals ({mockStats.pendingSellerApprovals.value})</span>
          </button>
        </div>
      </div>

      {/* Grid of Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatWidget 
          title="TOTAL USERS" 
          value={mockStats.totalUsers.value} 
          change={mockStats.totalUsers.change} 
          isPositive={mockStats.totalUsers.isPositive} 
          icon={Users}
          onClick={() => onNavigate('users')}
        />
        <StatWidget 
          title="TOTAL SELLERS" 
          value={mockStats.totalSellers.value} 
          change={mockStats.totalSellers.change} 
          isPositive={mockStats.totalSellers.isPositive} 
          icon={Store}
          onClick={() => onNavigate('sellers')}
        />
        <StatWidget 
          title="TOTAL DRIVERS" 
          value={mockStats.totalDrivers.value} 
          change={mockStats.totalDrivers.change} 
          isPositive={mockStats.totalDrivers.isPositive} 
          icon={Truck}
          onClick={() => onNavigate('drivers')}
        />
        <StatWidget 
          title="ACTIVE WAREHOUSES" 
          value={mockStats.totalWarehouses.value} 
          change={mockStats.totalWarehouses.change} 
          isPositive={mockStats.totalWarehouses.isPositive} 
          icon={Warehouse}
          onClick={() => onNavigate('warehouses')}
        />

        <StatWidget 
          title="ORDERS TODAY" 
          value={mockStats.ordersToday.value} 
          change={mockStats.ordersToday.change} 
          isPositive={mockStats.ordersToday.isPositive} 
          icon={ShoppingCart}
          onClick={() => onNavigate('orders')}
        />
        <StatWidget 
          title="REVENUE TODAY" 
          value={mockStats.revenueToday.value} 
          change={mockStats.revenueToday.change} 
          isPositive={mockStats.revenueToday.isPositive} 
          icon={DollarSign}
          onClick={() => onNavigate('payments')}
        />
        <StatWidget 
          title="PENDING ORDERS" 
          value={mockStats.pendingOrders.value} 
          change={mockStats.pendingOrders.change} 
          isPositive={mockStats.pendingOrders.isPositive} 
          icon={Clock}
          onClick={() => onNavigate('orders')}
        />
        <StatWidget 
          title="RUNNING DELIVERIES" 
          value={mockStats.runningDeliveries.value} 
          change={mockStats.runningDeliveries.change} 
          isPositive={mockStats.runningDeliveries.isPositive} 
          icon={Truck}
          onClick={() => onNavigate('deliveries')}
        />
      </div>

      {/* Charts & Capacity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue & Growth Chart */}
        <div className="lg:col-span-2 bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <TrendingUp size={16} className="text-[#ff5500]" />
                Weekly Revenue & Sales Trend
              </h3>
              <p className="text-[11px] text-slate-500">Overview of daily gross revenue across hubs</p>
            </div>
            <span className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md border border-slate-200">
              YTD +38.4%
            </span>
          </div>

          {/* Bar Chart */}
          <div className="h-40 flex items-end justify-between gap-3 pt-4 px-2 border-b border-slate-100">
            {mockRevenueChartData.map((item, idx) => {
              const maxRevenue = Math.max(...mockRevenueChartData.map(d => d.revenue));
              const heightPercent = Math.round((item.revenue / maxRevenue) * 85); // scaled properly up to 85%
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative h-full justify-end">
                  <span className="text-[10px] font-mono font-semibold text-slate-600 mb-0.5">${(item.revenue / 1000).toFixed(0)}k</span>
                  <div 
                    className="w-full bg-[#ff5500] hover:bg-[#e04a00] rounded-t-md transition-all duration-300 min-h-[16px]"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[11px] font-medium text-slate-600">{item.month}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2.5">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded bg-[#ff5500] inline-block" /> Gross Sales
            </span>
            <span className="font-mono text-slate-800 font-bold">Total Platform Volume: $10.6M</span>
          </div>
        </div>

        {/* Hub Capacity */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Warehouse size={18} className="text-[#002625]" />
              Warehouse Storage
            </h3>
            <button 
              onClick={() => onNavigate('warehouses')}
              className="text-xs text-[#ff5500] hover:underline flex items-center font-bold"
            >
              Manage <ArrowUpRight size={12} />
            </button>
          </div>

          <div className="space-y-3.5 my-auto">
            {mockWarehouses.map((wh) => (
              <div key={wh.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-900 truncate max-w-[170px]">{wh.name}</span>
                  <span className={wh.utilization > 85 ? 'text-rose-600 font-bold' : 'text-emerald-600'}>{wh.utilization}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      wh.utilization > 85 ? 'bg-rose-500' : 'bg-[#ff5500]'
                    }`}
                    style={{ width: `${wh.utilization}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>{wh.city}</span>
                  <span>{wh.activeOrders} active orders</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <span className="text-xs text-slate-500">Total Capacity: <strong className="text-slate-900 font-mono">360,000 sq ft</strong></span>
          </div>
        </div>
      </div>

      {/* Tables & Approvals Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShoppingCart size={18} className="text-[#ff5500]" />
              Live Platform Orders
            </h3>
            <button 
              onClick={() => onNavigate('orders')}
              className="text-xs text-[#ff5500] hover:underline flex items-center gap-1 font-bold"
            >
              View All Orders <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Seller Store</th>
                  <th className="py-2.5 px-3">Total</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {mockOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-[#ff5500]">{ord.id}</td>
                    <td className="py-3 px-3 font-medium text-slate-900">{ord.customer}</td>
                    <td className="py-3 px-3 text-slate-600">{ord.seller}</td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">{ord.total}</td>
                    <td className="py-3 px-3">
                      <StatusBadge status={ord.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Items */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
              <AlertTriangle size={18} className="text-amber-500" />
              Requires Attention
            </h3>
            <div className="space-y-3">
              <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Seller Approvals</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">9 stores waiting for KYC audit</p>
                </div>
                <button 
                  onClick={() => onNavigate('sellers')}
                  className="px-2.5 py-1 bg-amber-500 text-white text-[11px] font-bold rounded-lg border-none cursor-pointer"
                >
                  Review
                </button>
              </div>

              <div className="p-3.5 bg-sky-50/50 rounded-xl border border-sky-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Driver Licenses</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">15 drivers pending review</p>
                </div>
                <button 
                  onClick={() => onNavigate('drivers')}
                  className="px-2.5 py-1 bg-sky-600 text-white text-[11px] font-bold rounded-lg border-none cursor-pointer"
                >
                  Inspect
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-500">
              System Audit Status: <span className="text-emerald-600 font-bold">Operational</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
