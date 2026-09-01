import React, { useState, useEffect } from 'react';
import { Download, FileText, Calendar, TrendingUp, FileSpreadsheet, Percent, CheckCircle2, RefreshCw } from 'lucide-react';
import { orderService } from '../../../services/authService';

const Reports = () => {
  const [reportType, setReportType] = useState('sales');
  const [fromDate, setFromDate] = useState('2026-07-01');
  const [toDate, setToDate] = useState('2026-09-01');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [reportDetails, setReportDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await orderService.getSellerNotifications().catch(() => null);
      if (res && Array.isArray(res.notifications)) {
        const rows = res.notifications.map((n, idx) => {
          const gross = Number(n.totalAmount || 0);
          const gst = Number((gross * 0.05).toFixed(2));
          const net = Number(n.netSellerAmount || (gross - gst).toFixed(2));
          return {
            id: `REP-${String(idx + 1).padStart(2, '0')}`,
            date: n.createdAt ? new Date(n.createdAt).toLocaleDateString() : 'Today',
            orderId: n.orderId ? `#${n.orderId}` : `#ORD-${idx + 1}`,
            grossSales: `₹${gross.toFixed(2)}`,
            gstAmount: `₹${gst.toFixed(2)}`,
            netPayout: `₹${net.toFixed(2)}`,
            rawGross: gross,
            rawGst: gst,
            status: n.settlementStatus === 'SETTLED' ? 'Settled' : (n.status === 'DELIVERED' ? 'Settled' : 'Pending')
          };
        });
        setReportDetails(rows);
      } else {
        setReportDetails([]);
      }
    } catch (e) {
      setReportDetails([]);
    } finally {
      setLoading(false);
    }
  };

  const totalGrossRevenue = reportDetails.reduce((sum, r) => sum + (r.rawGross || 0), 0);
  const totalGst = reportDetails.reduce((sum, r) => sum + (r.rawGst || 0), 0);

  const handleExport = (format = 'excel') => {
    if (reportDetails.length === 0) {
      alert('No report data available to export.');
      return;
    }
    const headers = ['Report ID', 'Date', 'Order ID', 'Gross Sales', 'GST Amount', 'Net Payout', 'Status'];
    const rows = reportDetails.map(r => [
      `"${r.id}"`,
      `"${r.date}"`,
      `"${r.orderId}"`,
      `"${r.grossSales}"`,
      `"${r.gstAmount}"`,
      `"${r.netPayout}"`,
      `"${r.status}"`
    ]);

    const csvString = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Business_Sales_Report_${fromDate}_to_${toDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportMenu(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Business Reports & Analytics</h1>
          <p className="text-sm font-normal text-slate-500 mt-1">Export financial ledgers, GST reports, and warehouse turnover statement.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleExport('excel')}
            className="bg-[#ff7526] hover:bg-[#e65507] text-white font-medium py-2.5 px-4 rounded-lg shadow-sm transition-colors cursor-pointer border-none flex items-center gap-2 text-sm"
          >
            <FileSpreadsheet size={16} />
            Export Excel (XLSX)
          </button>
          <button 
            onClick={() => handleExport('pdf')}
            className="bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 px-4 rounded-lg shadow-sm transition-colors cursor-pointer border-none flex items-center gap-2 text-sm"
          >
            <FileText size={16} />
            Download PDF Report
          </button>
        </div>
      </div>

      {/* Date & Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-[#ff7526]" />
            <span className="text-sm font-normal text-slate-600">Date Range:</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 p-1 border border-slate-200 rounded-lg">
            <input 
              type="date" 
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-transparent border-none outline-none text-slate-700 text-sm font-normal cursor-pointer"
            />
            <span className="text-slate-400 font-normal">to</span>
            <input 
              type="date" 
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-transparent border-none outline-none text-slate-700 text-sm font-normal cursor-pointer"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={reportType} 
            onChange={(e) => setReportType(e.target.value)} 
            className="px-3.5 py-2 border border-slate-200 rounded-lg text-sm font-normal text-slate-700 bg-white outline-none focus:border-[#ff7526] cursor-pointer"
          >
            <option value="sales">Sales & Revenue Breakdown</option>
            <option value="gst">GST Tax Summary</option>
            <option value="inventory">Inventory Aging Report</option>
            <option value="buyer">Top Retailer Ledgers</option>
          </select>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Gross Revenue</span>
          <h3 className="text-3xl font-semibold text-slate-900">₹{totalGrossRevenue.toFixed(2)}</h3>
          <p className="text-xs font-normal text-emerald-600 flex items-center gap-1">
            <TrendingUp size={14} /> Total Settled & Pending Sales
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total GST Estimated</span>
          <h3 className="text-3xl font-semibold text-slate-900">₹{totalGst.toFixed(2)}</h3>
          <p className="text-xs font-normal text-slate-500">Ready for GSTR-1 Filing</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Orders</span>
          <h3 className="text-3xl font-semibold text-[#ff7526]">{reportDetails.length}</h3>
          <p className="text-xs font-normal text-slate-500">Store Order Statement</p>
        </div>

      </div>

      {/* Main Card Table Container */}
      <div className="rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-white">
        
        {/* Light Orange Banner Header */}
        <div className="bg-[#ff7526] px-5 py-3.5 flex justify-between items-center">
          <h2 className="text-white font-semibold text-lg tracking-wide">Detailed Sales & Revenue Statement</h2>
          <span className="text-white/90 text-xs font-medium">Total Entries: {reportDetails.length}</span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[13px] uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-4 font-semibold">Report ID</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Gross Sales</th>
                <th className="px-6 py-4 font-semibold">GST Amount</th>
                <th className="px-6 py-4 font-semibold">Net Payout</th>
                <th className="px-6 py-4 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="text-[15px] font-normal text-slate-700 divide-y divide-slate-100">
              {reportDetails.length > 0 ? (
                reportDetails.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{item.id}</td>
                    <td className="px-6 py-4 font-normal text-slate-600 text-sm">{item.date}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{item.orderId}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{item.grossSales}</td>
                    <td className="px-6 py-4 text-slate-600 font-normal">{item.gstAmount}</td>
                    <td className="px-6 py-4 font-semibold text-[#ff7526]">{item.netPayout}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold ${
                        item.status === 'Settled' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        <CheckCircle2 size={13} />
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400 text-sm italic">
                    {loading ? 'Loading report entries...' : 'No orders or transactions found for this store yet.'}
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

export default Reports;
