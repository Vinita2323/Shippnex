import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, IndianRupee, ShoppingBag, 
  Package, Clock, CheckCircle2, AlertCircle, ArrowRight, Plus, Calendar, Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const mockRecentOrders = [
  { id: '#ORD-8821', customer: 'FreshMart Groceries', date: 'Today, 10:42 AM', amount: '₹14,500.00', status: 'Pending', items: 12 },
  { id: '#ORD-8820', customer: 'Daily Needs Superstore', date: 'Today, 09:15 AM', amount: '₹8,250.00', status: 'Packed', items: 6 },
  { id: '#ORD-8819', customer: 'Super Saver Market', date: 'Yesterday, 04:30 PM', amount: '₹22,100.00', status: 'Out for Delivery', items: 18 },
  { id: '#ORD-8818', customer: 'City Mega Wholesaler', date: 'Yesterday, 02:10 PM', amount: '₹4,800.00', status: 'Delivered', items: 4 },
  { id: '#ORD-8817', customer: 'Rajesh Retail Traders', date: '25 Jul 2026', amount: '₹38,900.00', status: 'Delivered', items: 25 },
];

const chartData = [
  { day: 'Mon', val: 45, amount: '₹45,000' },
  { day: 'Tue', val: 65, amount: '₹65,000' },
  { day: 'Wed', val: 40, amount: '₹40,000' },
  { day: 'Thu', val: 80, amount: '₹80,000' },
  { day: 'Fri', val: 55, amount: '₹55,000' },
  { day: 'Sat', val: 95, amount: '₹95,000' },
  { day: 'Sun', val: 70, amount: '₹70,000' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('This Week');

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans pb-12">
      
      {/* Top Welcome Header Banner */}
      <div className="bg-gradient-to-r from-[#ff7526] via-[#ff6814] to-[#e65507] rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1.5 z-10">
          <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs">
            Seller Dashboard Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white pt-1">
            Welcome back, Harshvardhan! 👋
          </h1>
          <p className="text-sm font-normal text-white/90 max-w-xl">
            Here is your live store performance, sales revenue analytics, and pending order dispatches for today.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 shrink-0">
          <button 
            onClick={() => navigate('/seller/product/add')}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-[#ff7526] font-medium text-sm rounded-lg border-none cursor-pointer transition-all shadow-sm flex items-center gap-2"
          >
            <Plus size={18} />
            Add New Product
          </button>
        </div>

        {/* Decorative background glow circle */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* Time Range Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 text-slate-700 text-sm font-normal">
          <Calendar size={18} className="text-[#ff7526]" />
          <span>Showing stats for:</span>
          <span className="font-semibold text-slate-900">{timeRange}</span>
        </div>

        <div className="flex items-center gap-2">
          {['Today', 'This Week', 'This Month', 'This Year'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                timeRange === range
                  ? 'bg-[#ff7526] text-white shadow-2xs font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Main Key Performance Indicator (KPI) Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI 1: Revenue */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Revenue</span>
            <div className="w-9 h-9 rounded-lg bg-orange-50 border border-orange-200 text-[#ff7526] flex items-center justify-center">
              <IndianRupee size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-semibold text-slate-900">₹84,250.00</h3>
            <p className="text-xs font-normal text-emerald-600 mt-1 flex items-center gap-1">
              <TrendingUp size={14} /> +12.5% vs last week
            </p>
          </div>
        </div>

        {/* KPI 2: Total Orders */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Orders</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
              <ShoppingBag size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-semibold text-slate-900">142</h3>
            <p className="text-xs font-normal text-emerald-600 mt-1 flex items-center gap-1">
              <TrendingUp size={14} /> +5.2% vs last week
            </p>
          </div>
        </div>

        {/* KPI 3: Products Sold */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Products Sold</span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
              <Package size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-semibold text-slate-900">845</h3>
            <p className="text-xs font-normal text-rose-500 mt-1 flex items-center gap-1">
              <TrendingDown size={14} /> -2.1% vs last week
            </p>
          </div>
        </div>

        {/* KPI 4: Pending Dispatches */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Pending Dispatches</span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
              <Clock size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-semibold text-slate-900">24</h3>
            <p className="text-xs font-normal text-amber-600 mt-1 flex items-center gap-1">
              <AlertCircle size={14} /> Requires attention
            </p>
          </div>
        </div>

      </div>

      {/* Grid Section: Sales Analytics Chart & Order Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sales Analytics Chart Card */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Weekly Revenue & Sales Trend</h3>
              <p className="text-xs font-normal text-slate-400 mt-0.5">Overview of daily gross revenue in Rupees</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                <span className="w-3 h-3 rounded-full bg-[#ff7526]"></span>
                Gross Sales
              </div>
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="h-64 flex items-end justify-between gap-3 pt-6 px-2">
            {chartData.map((item, i) => (
              <div key={i} className="w-full flex flex-col items-center group relative cursor-pointer">
                {/* Tooltip on Hover */}
                <div className="absolute -top-9 bg-slate-900 text-white text-xs font-medium py-1 px-2.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity shadow-md pointer-events-none z-10 whitespace-nowrap">
                  {item.amount}
                </div>

                {/* Bar */}
                <div className="w-full max-w-[42px] bg-slate-100 rounded-t-lg relative overflow-hidden h-[210px] flex items-end">
                  <div 
                    className="w-full bg-gradient-to-t from-[#ff7526] to-[#ff9e66] rounded-t-lg transition-all duration-500 group-hover:from-[#e65507] group-hover:to-[#ff7526]"
                    style={{ height: `${item.val}%` }}
                  ></div>
                </div>

                {/* Day Label */}
                <span className="mt-3 text-xs font-medium text-slate-500">{item.day}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 font-normal gap-2">
            <span>Peak Sales Day: <strong className="font-semibold text-slate-800">Saturday (₹95,000)</strong></span>
            <span>Avg. Daily Sales: <strong className="font-semibold text-slate-800">₹64,285</strong></span>
          </div>
        </div>

        {/* Order Fulfillment Status Breakdown */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-semibold text-slate-900">Order Fulfillment</h3>
            <p className="text-xs font-normal text-slate-400 mt-0.5">Live order processing statuses</p>
          </div>

          <div className="space-y-4">
            <FulfillmentRow label="Pending Packaging" count="24" color="bg-amber-500" total={189} />
            <FulfillmentRow label="Ready for Pickup" count="18" color="bg-blue-500" total={189} />
            <FulfillmentRow label="Out for Delivery" count="45" color="bg-purple-500" total={189} />
            <FulfillmentRow label="Delivered Today" count="102" color="bg-emerald-500" total={189} />
            <FulfillmentRow label="Cancelled / Returned" count="3" color="bg-rose-500" total={189} />
          </div>

          <div className="pt-2">
            <button 
              onClick={() => navigate('/seller/orders')}
              className="w-full py-2.5 bg-orange-50 hover:bg-orange-100/80 text-[#ff7526] font-medium text-xs rounded-lg cursor-pointer transition-colors border border-orange-200 flex items-center justify-center gap-1.5"
            >
              Manage All Orders
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

      </div>

      {/* Main Card Container: Recent Bulk Orders */}
      <div className="rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-white">
        
        {/* Light Orange Title Banner */}
        <div className="bg-[#ff7526] px-5 py-3.5 flex justify-between items-center">
          <h2 className="text-white font-semibold text-lg tracking-wide">Recent Bulk Orders</h2>
          <button 
            onClick={() => navigate('/seller/orders')}
            className="text-white/90 hover:text-white text-xs font-medium bg-transparent border-none cursor-pointer flex items-center gap-1"
          >
            View All Orders
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Recent Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[13px] uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Customer / Store</th>
                <th className="px-6 py-4 font-semibold">Date & Time</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-[15px] font-normal text-slate-700 divide-y divide-slate-100">
              {mockRecentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-semibold text-[#ff7526]">{order.id}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {order.customer}
                    <span className="block text-xs font-normal text-slate-400 mt-0.5">{order.items} Items</span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-normal text-sm">{order.date}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900">{order.amount}</td>
                  <td className="px-6 py-4">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => navigate('/seller/orders')}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-orange-50 hover:text-[#ff7526] border border-slate-200 rounded-md font-medium text-xs cursor-pointer transition-colors"
                    >
                      View Order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};

const FulfillmentRow = ({ label, count, color, total }) => {
  const percentage = Math.round((Number(count) / total) * 100);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs font-normal">
        <span className="text-slate-700 font-medium">{label}</span>
        <span className="text-slate-900 font-semibold">{count}</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

const OrderStatusBadge = ({ status }) => {
  if (status === 'Delivered') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle2 size={13} />
        Delivered
      </span>
    );
  }
  if (status === 'Out for Delivery') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
        <Clock size={13} />
        Out for Delivery
      </span>
    );
  }
  if (status === 'Packed') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
        <Package size={13} />
        Packed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
      <AlertCircle size={13} />
      Pending
    </span>
  );
};

export default Dashboard;
