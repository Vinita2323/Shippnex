import React from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, ShoppingBag, 
  Package, Clock, CheckCircle, XCircle 
} from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Overview</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Here's what's happening with your warehouse today.</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 shadow-sm cursor-pointer">
            <option>Today</option>
            <option>Last 7 Days</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-colors cursor-pointer border-none">
            Generate Report
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Revenue" 
          value="₹84,250" 
          trend="+12.5%" 
          isPositive={true} 
          icon={<DollarSign size={20} className="text-blue-600" />} 
          bgColor="bg-blue-50"
        />
        <StatCard 
          title="Total Orders" 
          value="142" 
          trend="+5.2%" 
          isPositive={true} 
          icon={<ShoppingBag size={20} className="text-emerald-600" />} 
          bgColor="bg-emerald-50"
        />
        <StatCard 
          title="Products Sold" 
          value="845" 
          trend="-2.1%" 
          isPositive={false} 
          icon={<Package size={20} className="text-orange-600" />} 
          bgColor="bg-orange-50"
        />
        <StatCard 
          title="Pending Dispatches" 
          value="24" 
          trend="+18%" 
          isPositive={false} 
          icon={<Clock size={20} className="text-purple-600" />} 
          bgColor="bg-purple-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold text-slate-800">Sales Analytics</h3>
            <div className="flex gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 mt-1.5"></span>
              <span className="text-xs font-semibold text-slate-500">Revenue</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 mt-1.5 ml-2"></span>
              <span className="text-xs font-semibold text-slate-500">Orders</span>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {/* Simple CSS Chart Mockup */}
            {[40, 65, 45, 80, 50, 95, 75].map((val, i) => (
              <div key={i} className="w-full flex justify-center group relative cursor-pointer">
                <div className="w-full max-w-[32px] bg-blue-100 rounded-t-md relative overflow-hidden h-[240px]">
                  <div className="absolute bottom-0 w-full bg-blue-500 rounded-t-md transition-all duration-500 group-hover:bg-blue-600" style={{ height: `${val}%` }}></div>
                </div>
                {/* Tooltip */}
                <div className="absolute -top-10 bg-slate-800 text-white text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {val * 1000}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between px-4 mt-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <h3 className="text-base font-bold text-slate-800 mb-6">Order Status</h3>
          <div className="space-y-5">
            <StatusRow title="Pending Packaging" count="24" color="bg-orange-500" icon={<Package size={14} className="text-white" />} />
            <StatusRow title="Ready for Pickup" count="18" color="bg-blue-500" icon={<CheckCircle size={14} className="text-white" />} />
            <StatusRow title="Out for Delivery" count="45" color="bg-purple-500" icon={<Clock size={14} className="text-white" />} />
            <StatusRow title="Delivered Today" count="102" color="bg-emerald-500" icon={<CheckCircle size={14} className="text-white" />} />
            <StatusRow title="Cancelled/Returned" count="3" color="bg-red-500" icon={<XCircle size={14} className="text-white" />} />
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-base font-bold text-slate-800">Recent Bulk Orders</h3>
          <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 bg-transparent border-none cursor-pointer">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-bold">Order ID</th>
                <th className="px-6 py-4 font-bold">Customer (Shop)</th>
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 font-bold">Amount</th>
                <th className="px-6 py-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium text-slate-700 divide-y divide-slate-100">
              <OrderRow id="#ORD-8821" customer="FreshMart Groceries" date="Today, 10:42 AM" amount="₹14,500" status="Pending" statusColor="bg-orange-100 text-orange-700" />
              <OrderRow id="#ORD-8820" customer="Daily Needs Store" date="Today, 09:15 AM" amount="₹8,250" status="Packed" statusColor="bg-blue-100 text-blue-700" />
              <OrderRow id="#ORD-8819" customer="Super Saver Supermarket" date="Yesterday" amount="₹22,100" status="Out for Delivery" statusColor="bg-purple-100 text-purple-700" />
              <OrderRow id="#ORD-8818" customer="City Mega Store" date="Yesterday" amount="₹4,800" status="Delivered" statusColor="bg-emerald-100 text-emerald-700" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, trend, isPositive, icon, bgColor }) => (
  <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-xl ${bgColor}`}>{icon}</div>
      <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
        {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        {trend}
      </div>
    </div>
    <div>
      <h4 className="text-slate-500 text-sm font-semibold mb-1">{title}</h4>
      <span className="text-2xl font-extrabold text-slate-900 tracking-tight">{value}</span>
    </div>
  </div>
);

const StatusRow = ({ title, count, color, icon }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className={`w-7 h-7 rounded-lg ${color} flex items-center justify-center shadow-sm`}>{icon}</div>
      <span className="text-sm font-semibold text-slate-700">{title}</span>
    </div>
    <span className="text-sm font-bold text-slate-900">{count}</span>
  </div>
);

const OrderRow = ({ id, customer, date, amount, status, statusColor }) => (
  <tr className="hover:bg-slate-50 transition-colors cursor-pointer group">
    <td className="px-6 py-4 font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{id}</td>
    <td className="px-6 py-4">{customer}</td>
    <td className="px-6 py-4 text-slate-500">{date}</td>
    <td className="px-6 py-4 font-bold">{amount}</td>
    <td className="px-6 py-4">
      <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${statusColor}`}>{status}</span>
    </td>
  </tr>
);

export default Dashboard;
