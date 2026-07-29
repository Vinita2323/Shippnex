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
  Plus,
  List,
  Layers,
  Package,
  ClipboardList,
  CheckCircle2,
  XCircle,
  ShoppingBag
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

      {/* Primary 10 Metrics Cards Grid (Compact) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
        {/* Total User */}
        <div 
          onClick={() => onNavigate('users')}
          className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-sm transition-all duration-200 group cursor-pointer flex flex-col justify-between"
        >
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center mb-1.5 shrink-0">
            <Users size={15} />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500 leading-tight">Total User</p>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#ff5500] transition-colors mt-0.5 leading-none">
              {mockStats.totalUsers.value}
            </h3>
          </div>
        </div>

        {/* Total Category */}
        <div 
          onClick={() => onNavigate('categories')}
          className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-sm transition-all duration-200 group cursor-pointer flex flex-col justify-between"
        >
          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center mb-1.5 shrink-0">
            <List size={15} />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500 leading-tight">Total Category</p>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#ff5500] transition-colors mt-0.5 leading-none">
              {mockStats.totalCategories.value}
            </h3>
          </div>
        </div>

        {/* Total Subcategory */}
        <div 
          onClick={() => onNavigate('categories')}
          className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-sm transition-all duration-200 group cursor-pointer flex flex-col justify-between"
        >
          <div className="w-7 h-7 rounded-lg bg-pink-50 text-pink-500 flex items-center justify-center mb-1.5 shrink-0">
            <Layers size={15} />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500 leading-tight">Total Subcategory</p>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#ff5500] transition-colors mt-0.5 leading-none">
              {mockStats.totalSubcategories.value}
            </h3>
          </div>
        </div>

        {/* Total Product */}
        <div 
          onClick={() => onNavigate('products')}
          className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-sm transition-all duration-200 group cursor-pointer flex flex-col justify-between"
        >
          <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center mb-1.5 shrink-0">
            <ShoppingBag size={15} />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500 leading-tight">Total Product</p>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#ff5500] transition-colors mt-0.5 leading-none">
              {mockStats.totalProducts.value}
            </h3>
          </div>
        </div>

        {/* Total Orders */}
        <div 
          onClick={() => onNavigate('orders')}
          className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-sm transition-all duration-200 group cursor-pointer flex flex-col justify-between"
        >
          <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-500 flex items-center justify-center mb-1.5 shrink-0">
            <ClipboardList size={15} />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500 leading-tight">Total Orders</p>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#ff5500] transition-colors mt-0.5 leading-none">
              {mockStats.totalOrders.value}
            </h3>
          </div>
        </div>

        {/* Completed Orders */}
        <div 
          onClick={() => onNavigate('orders')}
          className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-sm transition-all duration-200 group cursor-pointer flex flex-col justify-between"
        >
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1.5 shrink-0">
            <CheckCircle2 size={15} />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500 leading-tight">Completed Orders</p>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#ff5500] transition-colors mt-0.5 leading-none">
              {mockStats.completedOrders.value}
            </h3>
          </div>
        </div>

        {/* Pending Orders */}
        <div 
          onClick={() => onNavigate('orders')}
          className="bg-white p-3 rounded-xl border border-emerald-400/80 shadow-2xs hover:shadow-sm transition-all duration-200 group cursor-pointer flex flex-col justify-between"
        >
          <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-500 flex items-center justify-center mb-1.5 shrink-0">
            <ClipboardList size={15} />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500 leading-tight">Pending Orders</p>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#ff5500] transition-colors mt-0.5 leading-none">
              {mockStats.pendingOrders.value}
            </h3>
          </div>
        </div>

        {/* Cancelled Orders */}
        <div 
          onClick={() => onNavigate('orders')}
          className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-sm transition-all duration-200 group cursor-pointer flex flex-col justify-between"
        >
          <div className="w-7 h-7 rounded-lg bg-red-50 text-red-500 flex items-center justify-center mb-1.5 shrink-0">
            <XCircle size={15} />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500 leading-tight">Cancelled Orders</p>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#ff5500] transition-colors mt-0.5 leading-none">
              {mockStats.cancelledOrders.value}
            </h3>
          </div>
        </div>

        {/* Product Sold Out */}
        <div 
          onClick={() => onNavigate('products')}
          className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-sm transition-all duration-200 group cursor-pointer flex flex-col justify-between"
        >
          <div className="w-7 h-7 rounded-lg bg-pink-50 text-pink-500 flex items-center justify-center mb-1.5 shrink-0">
            <ShoppingBag size={15} />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500 leading-tight">Product Sold Out</p>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#ff5500] transition-colors mt-0.5 leading-none">
              {mockStats.productSoldOut.value}
            </h3>
          </div>
        </div>

        {/* Product low on Stock */}
        <div 
          onClick={() => onNavigate('products')}
          className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-sm transition-all duration-200 group cursor-pointer flex flex-col justify-between"
        >
          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center mb-1.5 shrink-0">
            <ShoppingBag size={15} />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500 leading-tight">Product low on Stock</p>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#ff5500] transition-colors mt-0.5 leading-none">
              {mockStats.lowStockProducts.value}
            </h3>
          </div>
        </div>
      </div>

      {/* Secondary Operations Grid (Compact) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
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
          title="REVENUE TODAY" 
          value={mockStats.revenueToday.value} 
          change={mockStats.revenueToday.change} 
          isPositive={mockStats.revenueToday.isPositive} 
          icon={DollarSign}
          onClick={() => onNavigate('payments')}
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
                  <span className="text-[10px] font-mono font-semibold text-slate-600 mb-0.5">₹{(item.revenue / 1000).toFixed(0)}k</span>
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
            <span className="font-mono text-slate-800 font-bold">Total Platform Volume: ₹10.6M</span>
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

      {/* New Orders & Top Sellers Tables (Styled according to ShippNex Theme) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* View New Orders */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            {/* Header Banner matching ShippNex Dark Teal Theme */}
            <div className="bg-[#002625] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                <ShoppingCart size={18} className="text-[#ff5500]" />
                View New Orders
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-white/10 text-white/90 px-2.5 py-1 rounded-full">
                Live Feed
              </span>
            </div>

            <div className="p-5 space-y-4">
              {/* Show Entries Control */}
              <div className="flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span>Show</span>
                  <select className="border border-slate-200 rounded-lg px-2.5 py-1 bg-slate-50 text-xs font-semibold text-slate-800 outline-none focus:border-[#ff5500]">
                    <option>10</option>
                    <option>25</option>
                    <option>50</option>
                  </select>
                  <span>entries</span>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto border border-slate-200/80 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-3.5">ID ↕</th>
                      <th className="py-3 px-3.5">USER DETAILS</th>
                      <th className="py-3 px-3.5">O. DATE ↕</th>
                      <th className="py-3 px-3.5">STATUS ↕</th>
                      <th className="py-3 px-3.5 text-right">AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3.5 font-mono font-bold text-[#ff5500]">ORD1784732281209325</td>
                      <td className="py-3 px-3.5 font-semibold text-slate-900">Sujay Gupta</td>
                      <td className="py-3 px-3.5 text-slate-500 font-mono">22/7/2026</td>
                      <td className="py-3 px-3.5"><StatusBadge status="Pending" /></td>
                      <td className="py-3 px-3.5 text-right font-mono font-bold text-slate-900">₹1,480.00</td>
                    </tr>
                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3.5 font-mono font-bold text-[#ff5500]">ORD1784085563185506</td>
                      <td className="py-3 px-3.5 font-semibold text-slate-900">KUMKUM SRIVASTAVA</td>
                      <td className="py-3 px-3.5 text-slate-500 font-mono">15/7/2026</td>
                      <td className="py-3 px-3.5"><StatusBadge status="Cancelled" /></td>
                      <td className="py-3 px-3.5 text-right font-mono font-bold text-slate-900">₹1,200.00</td>
                    </tr>
                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3.5 font-mono font-bold text-[#ff5500]">ORD1784085540698717</td>
                      <td className="py-3 px-3.5 font-semibold text-slate-900">KUMKUM SRIVASTAVA</td>
                      <td className="py-3 px-3.5 text-slate-500 font-mono">15/7/2026</td>
                      <td className="py-3 px-3.5"><StatusBadge status="Cancelled" /></td>
                      <td className="py-3 px-3.5 text-right font-mono font-bold text-slate-900">₹1,150.00</td>
                    </tr>
                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3.5 font-mono font-bold text-[#ff5500]">ORD1783784745338285</td>
                      <td className="py-3 px-3.5 font-semibold text-slate-900">Deepak kumar</td>
                      <td className="py-3 px-3.5 text-slate-500 font-mono">11/7/2026</td>
                      <td className="py-3 px-3.5"><StatusBadge status="Completed" /></td>
                      <td className="py-3 px-3.5 text-right font-mono font-bold text-slate-900">₹2,450.00</td>
                    </tr>
                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3.5 font-mono font-bold text-[#ff5500]">ORD1783784503734275</td>
                      <td className="py-3 px-3.5 font-semibold text-slate-900">Deepak kumar</td>
                      <td className="py-3 px-3.5 text-slate-500 font-mono">11/7/2026</td>
                      <td className="py-3 px-3.5"><StatusBadge status="Cancelled" /></td>
                      <td className="py-3 px-3.5 text-right font-mono font-bold text-slate-900">₹2,100.00</td>
                    </tr>
                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3.5 font-mono font-bold text-[#ff5500]">ORD1783781163578991</td>
                      <td className="py-3 px-3.5 font-semibold text-slate-900">Ansh kumar</td>
                      <td className="py-3 px-3.5 text-slate-500 font-mono">11/7/2026</td>
                      <td className="py-3 px-3.5"><StatusBadge status="Cancelled" /></td>
                      <td className="py-3 px-3.5 text-right font-mono font-bold text-slate-900">₹2,800.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Footer Pagination Controls */}
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
            <span>Showing 1 to 6 of 14 entries</span>
            <div className="flex items-center gap-1">
              <button className="px-3 py-1 border border-slate-200 rounded-lg text-slate-400 cursor-not-allowed bg-white">&lt;</button>
              <button className="px-3 py-1 border border-[#ff5500] bg-[#ff5500] text-white rounded-lg font-bold shadow-xs">1</button>
              <button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-700 bg-white font-medium">&gt;</button>
            </div>
          </div>
        </div>

        {/* View Top Seller */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            {/* Header Banner matching ShippNex Dark Teal Theme */}
            <div className="bg-[#002625] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                <Store size={18} className="text-[#ff5500]" />
                View Top Seller
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-white/10 text-white/90 px-2.5 py-1 rounded-full">
                Leaderboard
              </span>
            </div>

            <div className="p-5 space-y-4">
              {/* Show Entries Control */}
              <div className="flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span>Show</span>
                  <select className="border border-slate-200 rounded-lg px-2.5 py-1 bg-slate-50 text-xs font-semibold text-slate-800 outline-none focus:border-[#ff5500]">
                    <option>10</option>
                    <option>25</option>
                    <option>50</option>
                  </select>
                  <span>entries</span>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto border border-slate-200/80 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-3.5">ID ↕</th>
                      <th className="py-3 px-3.5">SELLER NAME</th>
                      <th className="py-3 px-3.5">STORE NAME</th>
                      <th className="py-3 px-3.5 text-right">TOTAL REVENUE ↕</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3.5 font-mono text-slate-500 truncate max-w-[120px]">695cbdc15cd5cbace1782a0e</td>
                      <td className="py-3 px-3.5 font-semibold text-slate-900">Harsh shop</td>
                      <td className="py-3 px-3.5 text-[#ff5500] font-medium">Harshvardhan</td>
                      <td className="py-3 px-3.5 text-right font-mono font-bold text-slate-900">₹ 59,666.00</td>
                    </tr>
                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3.5 font-mono text-slate-500 truncate max-w-[120px]">695b7d5ea0b51822cd33332b</td>
                      <td className="py-3 px-3.5 font-semibold text-slate-900">appzeto</td>
                      <td className="py-3 px-3.5 text-[#ff5500] font-medium">Appzeto E-commerce</td>
                      <td className="py-3 px-3.5 text-right font-mono font-bold text-slate-900">₹ 900.00</td>
                    </tr>
                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3.5 font-mono text-slate-500 truncate max-w-[120px]">69d4efce71d41c6d982a2e0d</td>
                      <td className="py-3 px-3.5 font-semibold text-slate-900">Deepak kumar</td>
                      <td className="py-3 px-3.5 text-[#ff5500] font-medium">The Ranchi Store</td>
                      <td className="py-3 px-3.5 text-right font-mono font-bold text-slate-900">₹ 440.00</td>
                    </tr>
                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3.5 font-mono text-slate-500 truncate max-w-[120px]">6a2125c5255c12dbcf2b3c97</td>
                      <td className="py-3 px-3.5 font-semibold text-slate-900">durga turi</td>
                      <td className="py-3 px-3.5 text-[#ff5500] font-medium">DURGA CHAAT STORE</td>
                      <td className="py-3 px-3.5 text-right font-mono font-bold text-slate-900">₹ 180.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Footer Pagination Controls */}
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
            <span>Showing 1 to 4 of 4 entries</span>
            <div className="flex items-center gap-1">
              <button className="px-3 py-1 border border-slate-200 rounded-lg text-slate-400 cursor-not-allowed bg-white">&lt;</button>
              <button className="px-3 py-1 border border-[#ff5500] bg-[#ff5500] text-white rounded-lg font-bold shadow-xs">1</button>
              <button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-700 bg-white font-medium">&gt;</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
