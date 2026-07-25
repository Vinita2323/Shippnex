import React, { useState } from 'react';
import { AlertTriangle, ArrowUpRight, ArrowDownRight, RefreshCw, Search, Plus, SlidersHorizontal } from 'lucide-react';

const mockInventory = [
  { id: 'INV-101', name: 'Premium Basmati Rice', batch: 'BT-2026-08', available: 1250, reserved: 200, unit: 'kg', threshold: 300, status: 'In Stock', warehouseRack: 'A-12-04' },
  { id: 'INV-102', name: 'Refined Sunflower Oil', batch: 'BT-2026-09', available: 450, reserved: 80, unit: 'Liters', threshold: 200, status: 'In Stock', warehouseRack: 'B-04-01' },
  { id: 'INV-103', name: 'Organic Toor Dal', batch: 'BT-2026-05', available: 80, reserved: 30, unit: 'kg', threshold: 150, status: 'Low Stock', warehouseRack: 'C-01-08' },
  { id: 'INV-104', name: 'Whole Wheat Atta (50kg)', batch: 'BT-2026-02', available: 0, reserved: 0, unit: 'Bags', threshold: 50, status: 'Out of Stock', warehouseRack: 'A-08-02' },
  { id: 'INV-105', name: 'Himalayan Pink Salt', batch: 'BT-2026-11', available: 500, reserved: 50, unit: 'Packets', threshold: 100, status: 'In Stock', warehouseRack: 'D-02-05' },
];

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [inventory, setInventory] = useState(mockInventory);

  const filtered = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.batch.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.warehouseRack.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Warehouse Inventory & Stock</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Real-time stock audit, warehouse rack allocations, and stock refill alerts.</p>
        </div>
        <button className="bg-[#ff5500] hover:bg-[#e64d00] text-white font-bold py-2.5 px-4 rounded-md shadow-sm transition-colors cursor-pointer border-none flex items-center gap-2 text-sm">
          <Plus size={18} strokeWidth={2.5} />
          Adjust Stock Level
        </button>
      </div>

      {/* Low Stock Banner */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 text-white rounded-lg flex items-center justify-center font-bold">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h4 className="font-bold text-orange-950 text-sm">Low Stock Alert</h4>
            <p className="text-xs text-orange-800 font-medium">2 items are currently below safety threshold. Restock recommended to prevent order fulfillment delays.</p>
          </div>
        </div>
        <button className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-md border-none cursor-pointer">
          Restock Now
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between bg-slate-50/50">
          <div className="relative w-full sm:w-96">
            <Search size={18} className="text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search item, batch, or rack location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-md outline-none focus:border-[#ff5500] text-sm font-medium"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 bg-white rounded-md text-sm font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer">
            <SlidersHorizontal size={16} />
            Filter Racks
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-4 font-bold">Item Name</th>
                <th className="px-6 py-4 font-bold">Batch No.</th>
                <th className="px-6 py-4 font-bold">Rack Allocation</th>
                <th className="px-6 py-4 font-bold">Available Stock</th>
                <th className="px-6 py-4 font-bold">Reserved</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Quick Stock Audit</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium text-slate-700 divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{item.name}</td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{item.batch}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-slate-100 font-mono text-xs rounded border border-slate-200 font-bold text-slate-700">{item.warehouseRack}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-extrabold ${item.available === 0 ? 'text-red-600' : item.available < item.threshold ? 'text-orange-600' : 'text-slate-900'}`}>
                      {item.available} {item.unit}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-semibold">{item.reserved} {item.unit}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${item.status === 'In Stock' ? 'bg-emerald-50 text-emerald-700' : item.status === 'Low Stock' ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-700'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded font-bold text-xs border border-emerald-200 cursor-pointer">+ Add</button>
                      <button className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-700 rounded font-bold text-xs border border-red-200 cursor-pointer">- Deduct</button>
                    </div>
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

export default Inventory;
