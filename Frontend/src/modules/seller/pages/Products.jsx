import React, { useState } from 'react';
import { Plus, Search, Filter, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';

const mockProducts = [
  { id: 'PROD-101', name: 'Premium Basmati Rice', sku: 'RICE-BAS-01', category: 'Grains & Flours', stock: 1250, price: 75.00, status: 'Published' },
  { id: 'PROD-102', name: 'Refined Sunflower Oil', sku: 'OIL-SUN-05', category: 'Oil & Ghee', stock: 450, price: 140.00, status: 'Published' },
  { id: 'PROD-103', name: 'Organic Toor Dal', sku: 'DAL-TOO-01', category: 'Spices & Masala', stock: 80, price: 120.00, status: 'Low Stock' },
  { id: 'PROD-104', name: 'Whole Wheat Atta (5kg)', sku: 'ATTA-WH-05', category: 'Grains & Flours', stock: 0, price: 250.00, status: 'Out of Stock' },
  { id: 'PROD-105', name: 'Himalayan Pink Salt', sku: 'SALT-PNK-01', category: 'Spices & Masala', stock: 500, price: 85.00, status: 'Draft' },
];

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredProducts = mockProducts.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Products</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage your warehouse inventory catalog.</p>
        </div>
        <button className="bg-[#ff5500] hover:bg-[#e64d00] text-white font-bold py-2.5 px-4 rounded-xl shadow-sm transition-colors cursor-pointer border-none flex items-center gap-2">
          <Plus size={18} strokeWidth={2.5} />
          Add New Product
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between bg-slate-50/50">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search by product name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#ff5500] focus:ring-1 focus:ring-[#ff5500] text-sm font-medium transition-all"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 bg-white rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors">
              <Filter size={16} />
              Filter
            </button>
            <select className="px-3 py-2 border border-slate-200 bg-white rounded-lg text-sm font-semibold text-slate-600 outline-none focus:border-[#ff5500] cursor-pointer">
              <option>All Categories</option>
              <option>Grains & Flours</option>
              <option>Oil & Ghee</option>
              <option>Spices & Masala</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-4 font-bold w-12"><input type="checkbox" className="rounded text-[#ff5500] focus:ring-[#ff5500]" /></th>
                <th className="px-6 py-4 font-bold">Product Details</th>
                <th className="px-6 py-4 font-bold">Category</th>
                <th className="px-6 py-4 font-bold">Price (₹)</th>
                <th className="px-6 py-4 font-bold">Stock</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium text-slate-700 divide-y divide-slate-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4"><input type="checkbox" className="rounded text-[#ff5500] focus:ring-[#ff5500]" /></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                        <span className="text-slate-400 font-bold text-xs">IMG</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 leading-tight">{product.name}</span>
                        <span className="text-xs text-slate-500 font-semibold">{product.sku}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{product.category}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">₹{product.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`font-bold ${product.stock === 0 ? 'text-red-600' : product.stock < 100 ? 'text-orange-600' : 'text-slate-900'}`}>
                      {product.stock} units
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={product.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 bg-white rounded-md border border-slate-200 shadow-sm cursor-pointer" title="View"><Eye size={16} /></button>
                      <button className="p-1.5 text-slate-400 hover:text-orange-600 bg-white rounded-md border border-slate-200 shadow-sm cursor-pointer" title="Edit"><Edit size={16} /></button>
                      <button className="p-1.5 text-slate-400 hover:text-red-600 bg-white rounded-md border border-slate-200 shadow-sm cursor-pointer" title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-500 font-medium">
                    No products found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-600 font-medium bg-white">
          <div>Showing 1 to {filteredProducts.length} of {mockProducts.length} entries</div>
          <div className="flex gap-1">
            <button className="px-3 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50 cursor-pointer">Previous</button>
            <button className="px-3 py-1.5 border border-[#ff5500] bg-[#ff5500] text-white rounded-md font-bold cursor-pointer">1</button>
            <button className="px-3 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50 cursor-pointer">2</button>
            <button className="px-3 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50 cursor-pointer">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  let styles = '';
  switch(status) {
    case 'Published': styles = 'bg-emerald-100 text-emerald-700'; break;
    case 'Draft': styles = 'bg-slate-100 text-slate-700'; break;
    case 'Low Stock': styles = 'bg-orange-100 text-orange-700'; break;
    case 'Out of Stock': styles = 'bg-red-100 text-red-700'; break;
    default: styles = 'bg-blue-100 text-blue-700';
  }
  return <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${styles}`}>{status}</span>;
}

export default Products;
