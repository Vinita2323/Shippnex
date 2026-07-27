import React, { useState } from 'react';
import { AlertTriangle, Plus, Search, Download, ChevronDown, FileText, FileSpreadsheet } from 'lucide-react';

const mockInventory = [
  { id: 'INV-101', name: 'Premium Basmati Rice', category: 'Grains & Flours', available: 1250, reserved: 200, unit: 'kg', threshold: 300, status: 'In Stock' },
  { id: 'INV-102', name: 'Refined Sunflower Oil', category: 'Oil & Ghee', available: 450, reserved: 80, unit: 'Liters', threshold: 200, status: 'In Stock' },
  { id: 'INV-103', name: 'Organic Toor Dal', category: 'Spices & Masala', available: 80, reserved: 30, unit: 'kg', threshold: 150, status: 'Low Stock' },
  { id: 'INV-104', name: 'Whole Wheat Atta (50kg)', category: 'Grains & Flours', available: 0, reserved: 0, unit: 'Bags', threshold: 50, status: 'Out of Stock' },
  { id: 'INV-105', name: 'Himalayan Pink Salt', category: 'Spices & Masala', available: 500, reserved: 50, unit: 'Packets', threshold: 100, status: 'In Stock' },
];

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [pageSize, setPageSize] = useState(10);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [inventory, setInventory] = useState(mockInventory);

  const filtered = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAdjustStock = (id, delta) => {
    setInventory(inventory.map(item => {
      if (item.id === id) {
        const newAvailable = Math.max(0, item.available + delta);
        let newStatus = 'In Stock';
        if (newAvailable === 0) newStatus = 'Out of Stock';
        else if (newAvailable < item.threshold) newStatus = 'Low Stock';
        return { ...item, available: newAvailable, status: newStatus };
      }
      return item;
    }));
  };

  const exportInventory = (format = 'csv') => {
    if (filtered.length === 0) {
      alert('No inventory data available to export.');
      return;
    }

    const headers = ['Inventory ID', 'Item Name', 'Category', 'Available Stock', 'Reserved Stock', 'Status'];
    const rows = filtered.map(item => [
      `"${item.id}"`,
      `"${item.name}"`,
      `"${item.category}"`,
      `"${item.available} ${item.unit}"`,
      `"${item.reserved} ${item.unit}"`,
      `"${item.status}"`
    ]);

    const csvString = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Inventory_Stock_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportMenu(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Warehouse Inventory & Stock</h1>
          <p className="text-sm font-normal text-slate-500 mt-1">Real-time stock audit and stock refill alerts.</p>
        </div>
        <button 
          onClick={() => alert('Opening Stock Level Adjustment Dialog...')}
          className="bg-[#ff7526] hover:bg-[#e65507] text-white font-medium py-2.5 px-4 rounded-lg shadow-sm transition-colors cursor-pointer border-none flex items-center gap-2 text-sm"
        >
          <Plus size={18} strokeWidth={2} />
          Adjust Stock Level
        </button>
      </div>

      {/* Low Stock Alert Banner */}
      <div className="bg-orange-50/80 border border-orange-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#ff7526] text-white rounded-lg flex items-center justify-center font-bold shrink-0">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 text-sm">Low Stock Alert</h4>
            <p className="text-xs text-slate-600 font-normal">2 items are currently below safety threshold. Restock recommended to prevent order fulfillment delays.</p>
          </div>
        </div>
        <button 
          onClick={() => setStatusFilter('Low Stock')}
          className="px-3.5 py-1.5 bg-[#ff7526] hover:bg-[#e65507] text-white font-medium text-xs rounded-lg border-none cursor-pointer transition-colors shadow-xs"
        >
          Restock Now
        </button>
      </div>

      {/* Main Unified Card Container */}
      <div className="rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-white">
        
        {/* Light Orange Header Title Banner */}
        <div className="bg-[#ff7526] px-5 py-3.5 flex justify-between items-center">
          <h2 className="text-white font-semibold text-lg tracking-wide">View Inventory & Stock List</h2>
          <span className="text-white/90 text-xs font-medium">Total Items: {filtered.length}</span>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 bg-white border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 text-sm font-normal text-slate-700">
          
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-normal">Filter By Category</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 bg-white outline-none focus:border-[#ff7526] cursor-pointer text-sm font-normal transition-all"
            >
              <option value="All">All Category</option>
              <option value="Grains & Flours">Grains & Flours</option>
              <option value="Oil & Ghee">Oil & Ghee</option>
              <option value="Spices & Masala">Spices & Masala</option>
            </select>
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
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
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
              placeholder="Search item name..."
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
                  onClick={() => exportInventory('csv')}
                  className="w-full px-4 py-2.5 text-left text-sm font-normal text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer bg-transparent border-none"
                >
                  <FileText size={16} className="text-[#ff7526]" />
                  Export as CSV
                </button>
                <button
                  onClick={() => exportInventory('excel')}
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
                <th className="px-6 py-4 font-semibold">Item Name</th>
                <th className="px-6 py-4 font-semibold">Available Stock</th>
                <th className="px-6 py-4 font-semibold">Reserved</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Quick Stock Audit</th>
              </tr>
            </thead>
            <tbody className="text-[15px] font-normal text-slate-700 divide-y divide-slate-100">
              {filtered.slice(0, pageSize).map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    <div>
                      {item.name}
                      <span className="block text-xs font-normal text-slate-400 mt-0.5">{item.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-semibold ${item.available === 0 ? 'text-red-600' : item.available < item.threshold ? 'text-amber-600' : 'text-slate-900'}`}>
                      {item.available} {item.unit}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-normal text-sm">{item.reserved} {item.unit}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button 
                        onClick={() => handleAdjustStock(item.id, 50)}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-md font-medium text-xs border border-emerald-200 cursor-pointer transition-colors"
                      >
                        + Add
                      </button>
                      <button 
                        onClick={() => handleAdjustStock(item.id, -50)}
                        className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 rounded-md font-medium text-xs border border-red-200 cursor-pointer transition-colors"
                      >
                        - Deduct
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400 text-sm font-normal">
                    No inventory items match your search criteria.
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
  let style = 'bg-slate-100 text-slate-700 border border-slate-200';
  if (status === 'In Stock') style = 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  if (status === 'Low Stock') style = 'bg-amber-50 text-amber-700 border border-amber-200';
  if (status === 'Out of Stock') style = 'bg-red-50 text-red-700 border border-red-200';
  return <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${style}`}>{status}</span>;
};

export default Inventory;
