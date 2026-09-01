import React, { useState, useEffect } from 'react';
import { Download, ChevronDown, FileText, FileSpreadsheet, CheckCircle2, AlertCircle, XCircle, RefreshCw } from 'lucide-react';
import { orderService } from '../../../services/authService';

const Return = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [pageSize, setPageSize] = useState(10);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    setLoading(true);
    try {
      const res = await orderService.getSellerNotifications().catch(() => null);
      if (res && Array.isArray(res.notifications)) {
        const returnList = res.notifications
          .filter(n => n.status === 'REJECTED' || n.status === 'Rejected' || n.status === 'RETURNED')
          .map((n, idx) => ({
            id: `RET-${n.orderId || idx + 1}`,
            orderId: n.orderId || `#ORD-${idx + 1}`,
            customer: n.customerDetails?.name || 'Customer',
            product: (n.items || []).map(i => i.name || i.product?.name).filter(Boolean).join(', ') || 'Ordered Item',
            reason: n.rejectionReason || 'Customer requested return / rejected',
            status: n.status === 'REJECTED' || n.status === 'Rejected' ? 'Rejected' : 'Approved',
            date: n.createdAt ? new Date(n.createdAt).toLocaleDateString() : 'Today'
          }));
        setReturns(returnList);
      } else {
        setReturns([]);
      }
    } catch (e) {
      setReturns([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredReturns = returns.filter(r => {
    const matchesSearch = r.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const exportReturns = (format = 'csv') => {
    if (filteredReturns.length === 0) {
      alert('No return data available to export.');
      return;
    }

    const headers = ['Return ID', 'Order ID', 'Customer', 'Product', 'Reason', 'Status', 'Date'];
    const rows = filteredReturns.map(r => [
      `"${r.id}"`,
      `"${r.orderId}"`,
      `"${r.customer}"`,
      `"${r.product}"`,
      `"${r.reason}"`,
      `"${r.status}"`,
      `"${r.date}"`
    ]);

    const csvString = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Returns_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportMenu(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans pb-12">
      
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Returns & RTO Management</h1>
        <p className="text-sm font-normal text-slate-500 mt-1">Track customer return requests, quality checks, and refunds.</p>
      </div>

      {/* Main Unified Card Container */}
      <div className="rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-white">
        
        {/* Light Orange Banner Header */}
        <div className="bg-[#ff7526] px-5 py-3.5 flex justify-between items-center">
          <h2 className="text-white font-semibold text-lg tracking-wide">View Returns & RTO List</h2>
          <span className="text-white/90 text-xs font-medium">Total Items: {filteredReturns.length}</span>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 bg-white border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 text-sm font-normal text-slate-700">
          
          {/* Status Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-normal">Status</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 bg-white outline-none focus:border-[#ff7526] cursor-pointer text-sm font-normal transition-all"
            >
              <option value="All">All Status</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
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
              placeholder="Search Return ID, Customer, Product..."
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
                  onClick={() => exportReturns('csv')}
                  className="w-full px-4 py-2.5 text-left text-sm font-normal text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer bg-transparent border-none"
                >
                  <FileText size={16} className="text-[#ff7526]" />
                  Export as CSV
                </button>
                <button
                  onClick={() => exportReturns('excel')}
                  className="w-full px-4 py-2.5 text-left text-sm font-normal text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer bg-transparent border-none"
                >
                  <FileSpreadsheet size={16} className="text-emerald-600" />
                  Export as Excel (.csv)
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[13px] uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-4 font-semibold">Return ID</th>
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Product</th>
                <th className="px-6 py-4 font-semibold">Reason</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[15px] font-normal text-slate-700 divide-y divide-slate-100">
              {filteredReturns.slice(0, pageSize).map((ret) => (
                <tr key={ret.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-semibold text-[#ff7526]">{ret.id}</td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{ret.orderId}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900">{ret.customer}</td>
                  <td className="px-6 py-4 text-slate-700 font-normal">{ret.product}</td>
                  <td className="px-6 py-4 text-slate-500 text-sm font-normal">{ret.reason}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={ret.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => alert(`Review Return Request ${ret.id}`)}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-orange-50 hover:text-[#ff7526] border border-slate-200 rounded-md font-medium text-xs cursor-pointer transition-colors"
                    >
                      Review Request
                    </button>
                  </td>
                </tr>
              ))}
              {filteredReturns.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400 text-sm font-normal">
                    No return requests match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  if (status === 'Approved') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle2 size={13} />
        Approved
      </span>
    );
  }
  if (status === 'Pending Approval') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
        <AlertCircle size={13} />
        Pending Approval
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
      <XCircle size={13} />
      Rejected
    </span>
  );
};

export default Return;
