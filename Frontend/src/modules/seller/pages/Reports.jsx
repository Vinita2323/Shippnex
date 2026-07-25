import React, { useState } from 'react';
import { Download, FileText, Calendar, Filter, BarChart3, TrendingUp, DollarSign } from 'lucide-react';

const Reports = () => {
  const [reportType, setReportType] = useState('sales');

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Business Reports & Analytics</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Export financial ledgers, GST reports, and warehouse turnover statement.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-md shadow-sm transition-colors cursor-pointer border-none flex items-center gap-2 text-sm">
            <Download size={16} />
            Export Excel (XLSX)
          </button>
          <button className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-md shadow-sm transition-colors cursor-pointer border-none flex items-center gap-2 text-sm">
            <FileText size={16} />
            Download PDF Report
          </button>
        </div>
      </div>

      {/* Date & Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-slate-400" />
            <span className="text-sm font-bold text-slate-700">Date Range:</span>
          </div>
          <input type="date" className="px-3 py-1.5 border border-slate-200 rounded-md text-sm outline-none font-medium" defaultValue="2026-07-01" />
          <span className="text-slate-400 font-bold">to</span>
          <input type="date" className="px-3 py-1.5 border border-slate-200 rounded-md text-sm outline-none font-medium" defaultValue="2026-07-25" />
        </div>

        <div className="flex items-center gap-3">
          <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-md text-sm font-bold text-slate-700 outline-none cursor-pointer">
            <option value="sales">Sales & Revenue Breakdown</option>
            <option value="gst">GST Tax Summary</option>
            <option value="inventory">Inventory Aging Report</option>
            <option value="buyer">Top Retailer Ledgers</option>
          </select>
        </div>
      </div>

      {/* Report Cards Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <span className="text-xs font-bold text-slate-400 uppercase">Gross Revenue (July)</span>
          <h3 className="text-3xl font-extrabold text-slate-900 mt-2">₹14,85,200</h3>
          <p className="text-xs font-bold text-emerald-600 mt-2 flex items-center gap-1"><TrendingUp size={14} /> +18.4% compared to June</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <span className="text-xs font-bold text-slate-400 uppercase">Total GST Collected (5% / 12%)</span>
          <h3 className="text-3xl font-extrabold text-slate-900 mt-2">₹1,12,450</h3>
          <p className="text-xs font-medium text-slate-500 mt-2">Ready for GSTR-1 Filing</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Units Dispatched</span>
          <h3 className="text-3xl font-extrabold text-[#ff5500] mt-2">24,500 kg</h3>
          <p className="text-xs font-medium text-slate-500 mt-2">Across 142 B2B Bulk Orders</p>
        </div>
      </div>
    </div>
  );
};

export default Reports;
