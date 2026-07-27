import React, { useState } from 'react';
import { Search, Download, ChevronDown, Eye, Printer, FileSpreadsheet, FileText } from 'lucide-react';

const mockOrders = [
  { id: '#ORD-9021', customer: 'Shree Krishna Retailers', itemsCount: 14, total: '₹48,200', orderDate: '27-07-2026', deliveryDate: '29-07-2026', rawDate: '2026-07-27', status: 'Pending', payment: 'Paid (UPI)', address: 'Sector 18, Gurugram' },
  { id: '#ORD-9020', customer: 'Gupta Kirana Superstore', itemsCount: 22, total: '₹84,500', orderDate: '27-07-2026', deliveryDate: '28-07-2026', rawDate: '2026-07-27', status: 'Packed', payment: 'Credit (15 Days)', address: 'Karol Bagh, Delhi' },
  { id: '#ORD-9019', customer: 'FreshBazaar Wholesale', itemsCount: 8, total: '₹18,900', orderDate: '26-07-2026', deliveryDate: '28-07-2026', rawDate: '2026-07-26', status: 'Dispatched', payment: 'Paid (Net Banking)', address: 'Noida Sector 62' },
  { id: '#ORD-9018', customer: 'Aman General Mart', itemsCount: 45, total: '₹1,24,000', orderDate: '26-07-2026', deliveryDate: '27-07-2026', rawDate: '2026-07-26', status: 'Delivered', payment: 'Paid (COD)', address: 'Connaught Place, Delhi' },
  { id: '#ORD-9017', customer: 'SuperSaver Mart', itemsCount: 5, total: '₹12,400', orderDate: '23-07-2026', deliveryDate: '-', rawDate: '2026-07-23', status: 'Cancelled', payment: 'Refunded', address: 'Faridabad NIT-3' },
];

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const filteredOrders = mockOrders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    const matchesFrom = !fromDate || o.rawDate >= fromDate;
    const matchesTo = !toDate || o.rawDate <= toDate;
    return matchesSearch && matchesStatus && matchesFrom && matchesTo;
  });

  const exportOrders = (format = 'csv') => {
    if (filteredOrders.length === 0) {
      alert('No orders available to export for current filter criteria.');
      return;
    }

    const headers = ['Order ID', 'Buyer Shop', 'Address', 'Order Date', 'Deliver Date', 'Items', 'Total Bill', 'Payment', 'Status'];
    const rows = filteredOrders.map(o => [
      `"${o.id}"`,
      `"${o.customer}"`,
      `"${o.address}"`,
      `"${o.orderDate}"`,
      `"${o.deliveryDate}"`,
      `"${o.itemsCount} Products"`,
      `"${o.total}"`,
      `"${o.payment}"`,
      `"${o.status}"`
    ]);

    const csvString = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Order_Report_${new Date().toISOString().slice(0, 10)}.${format === 'excel' ? 'csv' : 'csv'}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportMenu(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* Unified Single Card Container */}
      <div className="rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-white">
        
        {/* Light Orange Header Title Banner */}
        <div className="bg-[#ff7526] px-5 py-3.5 flex justify-between items-center">
          <h2 className="text-white font-semibold text-lg tracking-wide">View Order List</h2>
          <span className="text-white/90 text-xs font-medium">Total Items: {filteredOrders.length}</span>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 bg-white border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 text-sm font-normal text-slate-700">
          
          {/* From - To Date Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-600 font-normal">From - To Order Date</span>
            <div className="flex items-center gap-1 bg-slate-50 p-1 border border-slate-200 rounded-lg">
              <input 
                type="date" 
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="bg-transparent border-none outline-none text-slate-700 text-sm font-normal cursor-pointer"
              />
              <span className="text-slate-400 font-normal">-</span>
              <input 
                type="date" 
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="bg-transparent border-none outline-none text-slate-700 text-sm font-normal cursor-pointer"
              />
            </div>
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-normal">Status</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 bg-white outline-none focus:border-[#ff7526] cursor-pointer text-sm font-normal transition-all"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Packed">Packed</option>
              <option value="Dispatched">Dispatched</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Page Size Dropdown */}
          <div>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 bg-white outline-none focus:border-[#ff7526] cursor-pointer text-sm font-normal"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          {/* Search Field */}
          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-normal">Search:</span>
            <input
              type="text"
              placeholder="Search by Order ID, Status, or Ar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 outline-none focus:border-[#ff7526] text-sm font-normal w-48 sm:w-64 transition-all"
            />
          </div>

          {/* Export Button & Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="bg-[#ff7526] hover:bg-[#e65507] text-white font-medium py-1.5 px-4 rounded-lg shadow-sm transition-colors cursor-pointer border-none flex items-center gap-1.5 text-sm"
            >
              <Download size={15} />
              Export
              <ChevronDown size={15} />
            </button>

            {/* Export Dropdown Menu */}
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-20 animate-in fade-in zoom-in-95 duration-150">
                <button
                  onClick={() => exportOrders('csv')}
                  className="w-full px-4 py-2.5 text-left text-sm font-normal text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer bg-transparent border-none"
                >
                  <FileText size={16} className="text-[#ff7526]" />
                  Export as CSV
                </button>
                <button
                  onClick={() => exportOrders('excel')}
                  className="w-full px-4 py-2.5 text-left text-sm font-normal text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer bg-transparent border-none"
                >
                  <FileSpreadsheet size={16} className="text-emerald-600" />
                  Export as Excel (.csv)
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[13px] uppercase tracking-wider border-b border-slate-100">
                <th className="px-5 py-4 font-semibold">Order ID</th>
                <th className="px-5 py-4 font-semibold">Buyer Shop</th>
                <th className="px-5 py-4 font-semibold">Order Date</th>
                <th className="px-5 py-4 font-semibold">Deliver Date</th>
                <th className="px-5 py-4 font-semibold">Items</th>
                <th className="px-5 py-4 font-semibold">Total Bill</th>
                <th className="px-5 py-4 font-semibold">Payment</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-[15px] font-normal text-slate-700 divide-y divide-slate-100">
              {filteredOrders.slice(0, pageSize).map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-4 font-semibold text-slate-900">{order.id}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900">{order.customer}</span>
                      <span className="text-[13px] text-slate-400 font-normal">{order.address}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm font-normal text-slate-600">{order.orderDate}</td>
                  <td className="px-5 py-4 text-sm font-normal text-slate-600">{order.deliveryDate}</td>
                  <td className="px-5 py-4 font-normal">{order.itemsCount} Products</td>
                  <td className="px-5 py-4 font-semibold text-slate-900">{order.total}</td>
                  <td className="px-5 py-4 text-sm font-normal text-slate-600">{order.payment}</td>
                  <td className="px-5 py-4">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-orange-50 hover:text-[#ff7526] border border-slate-200 rounded-md font-medium text-xs cursor-pointer transition-colors"
                    >
                      View Order
                    </button>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-slate-400 text-sm font-normal">
                    No orders match your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Modal Drawer */}
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
                <h2 className="text-xl font-bold text-slate-900">Order Details {selectedOrder.id}</h2>
                <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer bg-transparent border-none font-bold text-lg">✕</button>
              </div>

              <div className="mt-4 space-y-4">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-xs text-slate-400 font-semibold uppercase">Customer Info</span>
                  <p className="font-semibold text-slate-900 mt-1">{selectedOrder.customer}</p>
                  <p className="text-xs text-slate-500">{selectedOrder.address}</p>
                </div>

                <div className="space-y-2">
                  <span className="text-xs text-slate-400 font-semibold uppercase">Order Items</span>
                  <div className="flex justify-between text-sm py-2 border-b border-slate-100">
                    <span>1. Premium Basmati Rice (100kg Bag)</span>
                    <span className="font-semibold">₹7,500</span>
                  </div>
                  <div className="flex justify-between text-sm py-2 border-b border-slate-100">
                    <span>2. Sunflower Oil 15L Tin x 4</span>
                    <span className="font-semibold">₹6,400</span>
                  </div>
                  <div className="flex justify-between text-sm py-2 border-b border-slate-100">
                    <span>3. Whole Wheat Atta 50kg x 5</span>
                    <span className="font-semibold">₹5,000</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex justify-between text-base font-bold">
                <span>Total Amount:</span>
                <span className="text-[#ff661a]">{selectedOrder.total}</span>
              </div>
              <button className="w-full bg-[#ff661a] hover:bg-[#e65507] text-white py-3 rounded-md font-semibold cursor-pointer transition-colors border-none">
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
  if (status === 'Pending') style = 'bg-amber-50 text-amber-700 border border-amber-200';
  if (status === 'Packed') style = 'bg-blue-50 text-blue-700 border border-blue-200';
  if (status === 'Dispatched') style = 'bg-purple-50 text-purple-700 border border-purple-200';
  if (status === 'Delivered') style = 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  if (status === 'Cancelled') style = 'bg-red-50 text-red-700 border border-red-200';
  return <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${style}`}>{status}</span>;
};

export default Orders;
