import React, { useState } from 'react';
import { Search, Filter, Eye, Printer, CheckCircle, Clock, Truck, Package, XCircle } from 'lucide-react';

const mockOrders = [
  { id: '#ORD-9021', customer: 'Shree Krishna Retailers', itemsCount: 14, total: '₹48,200', date: 'Today, 11:30 AM', status: 'Pending', payment: 'Paid (UPI)', address: 'Sector 18, Gurugram' },
  { id: '#ORD-9020', customer: 'Gupta Kirana Superstore', itemsCount: 22, total: '₹84,500', date: 'Today, 09:15 AM', status: 'Packed', payment: 'Credit (15 Days)', address: 'Karol Bagh, Delhi' },
  { id: '#ORD-9019', customer: 'FreshBazaar Wholesale', itemsCount: 8, total: '₹18,900', date: 'Yesterday', status: 'Dispatched', payment: 'Paid (Net Banking)', address: 'Noida Sector 62' },
  { id: '#ORD-9018', customer: 'Aman General Mart', itemsCount: 45, total: '₹1,24,000', date: 'Yesterday', status: 'Delivered', payment: 'Paid (COD)', address: 'Connaught Place, Delhi' },
  { id: '#ORD-9017', customer: 'SuperSaver Mart', itemsCount: 5, total: '₹12,400', date: '23 Jul 2026', status: 'Cancelled', payment: 'Refunded', address: 'Faridabad NIT-3' },
];

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = mockOrders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          o.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Bulk Order Management</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage, pack, and generate invoices for B2B buyer orders.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-md shadow-sm transition-colors cursor-pointer border-none flex items-center gap-2 text-sm">
            <Printer size={16} />
            Print Daily Packing Slips
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-bold text-slate-500 overflow-x-auto">
        {['All', 'Pending', 'Packed', 'Dispatched', 'Delivered', 'Cancelled'].map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`pb-3 border-b-2 cursor-pointer transition-colors whitespace-nowrap bg-transparent border-none ${statusFilter === status ? 'border-[#ff5500] text-[#ff5500]' : 'border-transparent text-slate-600 hover:text-slate-900'}`}
          >
            {status} ({status === 'All' ? mockOrders.length : mockOrders.filter(o => o.status === status).length})
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col">
        {/* Search */}
        <div className="p-4 border-b border-slate-100 flex gap-4 bg-slate-50/50">
          <div className="relative w-full sm:w-96">
            <Search size={18} className="text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search order ID, shopkeeper name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-md outline-none focus:border-[#ff5500] text-sm font-medium"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-4 font-bold">Order ID</th>
                <th className="px-6 py-4 font-bold">Buyer Shop</th>
                <th className="px-6 py-4 font-bold">Items</th>
                <th className="px-6 py-4 font-bold">Total Bill</th>
                <th className="px-6 py-4 font-bold">Payment</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium text-slate-700 divide-y divide-slate-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{order.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">{order.customer}</span>
                      <span className="text-xs text-slate-400 font-normal">{order.address}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{order.itemsCount} Products</td>
                  <td className="px-6 py-4 font-extrabold text-slate-900">{order.total}</td>
                  <td className="px-6 py-4 text-xs font-semibold text-slate-600">{order.payment}</td>
                  <td className="px-6 py-4">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-orange-50 hover:text-[#ff5500] border border-slate-200 rounded-md font-bold text-xs cursor-pointer transition-colors"
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

      {/* Order Modal Drawer Mock */}
      {selectedOrder && (
        <div 
          onClick={() => setSelectedOrder(null)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-end z-30 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white h-full p-6 overflow-y-auto space-y-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300"
          >
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h2 className="text-xl font-extrabold text-slate-900">Order Details {selectedOrder.id}</h2>
                <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer bg-transparent border-none font-bold text-lg">✕</button>
              </div>

              <div className="mt-4 space-y-4">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-xs text-slate-400 font-bold uppercase">Customer Info</span>
                  <p className="font-bold text-slate-900 mt-1">{selectedOrder.customer}</p>
                  <p className="text-xs text-slate-500">{selectedOrder.address}</p>
                </div>

                <div className="space-y-2">
                  <span className="text-xs text-slate-400 font-bold uppercase">Order Items</span>
                  <div className="flex justify-between text-sm py-2 border-b border-slate-100">
                    <span>1. Premium Basmati Rice (100kg Bag)</span>
                    <span className="font-bold">₹7,500</span>
                  </div>
                  <div className="flex justify-between text-sm py-2 border-b border-slate-100">
                    <span>2. Sunflower Oil 15L Tin x 4</span>
                    <span className="font-bold">₹6,400</span>
                  </div>
                  <div className="flex justify-between text-sm py-2 border-b border-slate-100">
                    <span>3. Whole Wheat Atta 50kg x 5</span>
                    <span className="font-bold">₹5,000</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex justify-between text-base font-extrabold">
                <span>Total Amount:</span>
                <span className="text-[#ff5500]">{selectedOrder.total}</span>
              </div>
              <button className="w-full bg-[#ff5500] hover:bg-[#e64d00] text-white py-3 rounded-md font-bold cursor-pointer transition-colors border-none">
                Mark as Packed & Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const OrderStatusBadge = ({ status }) => {
  let style = 'bg-slate-100 text-slate-700';
  if (status === 'Pending') style = 'bg-orange-50 text-orange-700 border border-orange-200';
  if (status === 'Packed') style = 'bg-blue-50 text-blue-700 border border-blue-200';
  if (status === 'Dispatched') style = 'bg-purple-50 text-purple-700 border border-purple-200';
  if (status === 'Delivered') style = 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  if (status === 'Cancelled') style = 'bg-red-50 text-red-700 border border-red-200';
  return <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${style}`}>{status}</span>;
};

export default Orders;
