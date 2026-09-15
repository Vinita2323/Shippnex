import React, { useState, useEffect, useCallback } from 'react';
import { SuperAdminHeader } from '../components/SuperAdminHeader';
import { superAdminService } from '../../../services/superAdminService';
import { FileSpreadsheet, Download, Calendar, Filter, BarChart3, Receipt, Store, Truck, DollarSign } from 'lucide-react';

export const SuperAdminReports = () => {
  const [reportType, setReportType] = useState('transactions');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const res = await superAdminService.getReports({
        reportType,
        startDate,
        endDate,
      });

      if (res.success) {
        if (reportType === 'transactions') setReportData(res.transactions || []);
        else if (reportType === 'seller-settlements') setReportData(res.settlements || []);
        else if (reportType === 'captain-settlements') setReportData(res.captains || []);
        else if (reportType === 'platform-revenue') setReportData(res.orders || []);
      }
    } catch (err) {
      console.error('Fetch report error:', err);
    } finally {
      setLoading(false);
    }
  }, [reportType, startDate, endDate]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const handleExport = () => {
    if (!reportData || reportData.length === 0) return;

    let headers = [];
    let rows = [];

    if (reportType === 'transactions') {
      headers = ['Txn ID', 'Category', 'Type', 'Amount', 'Entity', 'Status', 'Date'];
      rows = reportData.map((r) => [
        `"${r.transactionId}"`,
        `"${r.category}"`,
        `"${r.type}"`,
        r.amount,
        `"${r.entityName || r.entityType}"`,
        `"${r.status}"`,
        `"${new Date(r.createdAt).toLocaleString('en-IN')}"`,
      ]);
    } else if (reportType === 'seller-settlements') {
      headers = ['Order ID', 'Seller', 'Total Gross', 'Commission Rate', 'Commission Amount', 'Net Seller', 'Status', 'Date'];
      rows = reportData.map((r) => [
        `"${r.orderId}"`,
        `"${r.sellerName}"`,
        r.totalAmount,
        r.commissionRate,
        r.commissionAmount,
        r.netSellerAmount,
        `"${r.settlementStatus}"`,
        `"${new Date(r.createdAt).toLocaleString('en-IN')}"`,
      ]);
    } else if (reportType === 'captain-settlements') {
      headers = ['Captain Name', 'Phone', 'Vehicle', 'Wallet Balance', 'Cash Collected'];
      rows = reportData.map((r) => [
        `"${r.name}"`,
        `"${r.phone}"`,
        `"${r.vehicleType}"`,
        r.walletBalance,
        r.cashCollected,
      ]);
    } else if (reportType === 'platform-revenue') {
      headers = ['Date', 'Gross Volume', 'Items Total', 'Shipping Revenue', 'Order Count'];
      rows = reportData.map((r) => [
        `"${r._id}"`,
        r.grossVolume,
        r.itemsTotal,
        r.shippingRevenue,
        r.orderCount,
      ]);
    }

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `shippnex_${reportType}_report_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const reportTabs = [
    { id: 'transactions', label: 'Transaction Report', icon: Receipt },
    { id: 'seller-settlements', label: 'Seller Settlement Report', icon: Store },
    { id: 'captain-settlements', label: 'Captain Settlement Report', icon: Truck },
    { id: 'platform-revenue', label: 'Platform Revenue Report', icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-[#020909] text-slate-100 flex flex-col font-sans">
      <SuperAdminHeader
        title="Financial Reports & Exports"
        subtitle="Generate, filter, and export comprehensive transaction, settlement, and revenue reports"
        onRefresh={fetchReport}
        refreshing={loading}
      />

      <div className="p-6 space-y-5 flex-1 max-w-7xl mx-auto w-full">
        {/* Report Types Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {reportTabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = reportType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setReportType(tab.id)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                  isSelected
                    ? 'bg-[#06332d] border-emerald-500 text-white shadow-lg shadow-emerald-950/60'
                    : 'bg-[#051716] border-emerald-950 text-slate-400 hover:text-white hover:border-emerald-900'
                }`}
              >
                <div
                  className={`p-2 rounded-xl ${
                    isSelected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-black/30 text-slate-400'
                  }`}
                >
                  <Icon size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white m-0">{tab.label}</h4>
                  <p className="text-[10.5px] text-slate-400 m-0">Audited dataset export</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Date Filter & Export Action */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#051716] border border-emerald-950 p-3.5 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">From:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-[#020b0b] border border-emerald-950 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">To:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-[#020b0b] border border-emerald-950 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            onClick={handleExport}
            disabled={reportData.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs rounded-xl border-none cursor-pointer shadow-md transition-all"
          >
            <Download size={15} />
            <span>Export CSV Report ({reportData.length} records)</span>
          </button>
        </div>

        {/* Report Preview Table */}
        <div className="bg-[#051716] border border-emerald-950/90 rounded-3xl shadow-xl overflow-hidden">
          <div className="p-4 border-b border-emerald-950 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Live Report Preview: {reportType?.replace(/-/g, ' ').toUpperCase()}
            </span>
            <span className="text-xs text-emerald-400 font-mono font-bold">
              {reportData.length} rows loaded
            </span>
          </div>

          <div className="overflow-x-auto max-h-[500px]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#03100f] border-b border-emerald-950 text-slate-400 uppercase tracking-wider font-mono text-[10.5px] sticky top-0">
                  {reportType === 'transactions' && (
                    <>
                      <th className="py-3 px-4">Txn ID</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Entity</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Date</th>
                    </>
                  )}
                  {reportType === 'seller-settlements' && (
                    <>
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Seller Store</th>
                      <th className="py-3 px-4">Gross Sales</th>
                      <th className="py-3 px-4">Commission</th>
                      <th className="py-3 px-4">Net Seller Amount</th>
                      <th className="py-3 px-4">Status</th>
                    </>
                  )}
                  {reportType === 'captain-settlements' && (
                    <>
                      <th className="py-3 px-4">Captain Name</th>
                      <th className="py-3 px-4">Mobile</th>
                      <th className="py-3 px-4">Vehicle</th>
                      <th className="py-3 px-4">Wallet Balance</th>
                      <th className="py-3 px-4">COD Cash Collected</th>
                    </>
                  )}
                  {reportType === 'platform-revenue' && (
                    <>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Gross Volume</th>
                      <th className="py-3 px-4">Items Total</th>
                      <th className="py-3 px-4">Shipping Revenue</th>
                      <th className="py-3 px-4">Order Count</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-950/60">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">Generating report...</td>
                  </tr>
                ) : reportData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">No data found for this report and period.</td>
                  </tr>
                ) : (
                  reportData.map((item, idx) => (
                    <tr key={idx} className="hover:bg-emerald-950/20 transition-colors">
                      {reportType === 'transactions' && (
                        <>
                          <td className="py-3 px-4 font-mono font-bold text-emerald-400">{item.transactionId}</td>
                          <td className="py-3 px-4 text-white font-medium">{item.category}</td>
                          <td className="py-3 px-4 font-mono">{item.type}</td>
                          <td className="py-3 px-4 font-bold text-white font-mono">₹{Number(item.amount).toFixed(2)}</td>
                          <td className="py-3 px-4 text-slate-300">{item.entityName || item.entityType}</td>
                          <td className="py-3 px-4">{item.status}</td>
                          <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">{new Date(item.createdAt).toLocaleDateString('en-IN')}</td>
                        </>
                      )}
                      {reportType === 'seller-settlements' && (
                        <>
                          <td className="py-3 px-4 font-mono font-bold text-emerald-400">#{item.orderId}</td>
                          <td className="py-3 px-4 text-white font-bold">{item.sellerName}</td>
                          <td className="py-3 px-4 font-mono font-bold text-slate-300">₹{Number(item.totalAmount || 0).toFixed(2)}</td>
                          <td className="py-3 px-4 font-mono text-amber-400">₹{Number(item.commissionAmount || 0).toFixed(2)}</td>
                          <td className="py-3 px-4 font-mono font-black text-white">₹{Number(item.netSellerAmount || 0).toFixed(2)}</td>
                          <td className="py-3 px-4">{item.settlementStatus}</td>
                        </>
                      )}
                      {reportType === 'captain-settlements' && (
                        <>
                          <td className="py-3 px-4 text-white font-bold">{item.name}</td>
                          <td className="py-3 px-4 font-mono text-slate-300">{item.phone}</td>
                          <td className="py-3 px-4 text-slate-300">{item.vehicleType}</td>
                          <td className="py-3 px-4 font-mono font-black text-amber-400">₹{Number(item.walletBalance || 0).toFixed(2)}</td>
                          <td className="py-3 px-4 font-mono font-bold text-white">₹{Number(item.cashCollected || 0).toFixed(2)}</td>
                        </>
                      )}
                      {reportType === 'platform-revenue' && (
                        <>
                          <td className="py-3 px-4 font-mono font-bold text-emerald-400">{item._id}</td>
                          <td className="py-3 px-4 font-mono font-bold text-white">₹{Number(item.grossVolume || 0).toFixed(2)}</td>
                          <td className="py-3 px-4 font-mono text-slate-300">₹{Number(item.itemsTotal || 0).toFixed(2)}</td>
                          <td className="py-3 px-4 font-mono text-slate-300">₹{Number(item.shippingRevenue || 0).toFixed(2)}</td>
                          <td className="py-3 px-4 font-mono font-bold text-emerald-400">{item.orderCount}</td>
                        </>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
