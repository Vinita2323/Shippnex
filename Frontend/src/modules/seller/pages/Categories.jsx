import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, FolderTree, Layers, CheckCircle2, XCircle } from 'lucide-react';

const initialCategories = [
  { id: 'CAT-01', name: 'Grains & Flours', slug: 'grains-flours', subcategoriesCount: 6, productsCount: 42, status: 'Active', icon: '🌾' },
  { id: 'CAT-02', name: 'Edible Oils & Ghee', slug: 'oils-ghee', subcategoriesCount: 4, productsCount: 28, status: 'Active', icon: '🛢️' },
  { id: 'CAT-03', name: 'Spices & Masala', slug: 'spices-masala', subcategoriesCount: 12, productsCount: 95, status: 'Active', icon: '🌶️' },
  { id: 'CAT-04', name: 'Pulses & Rice', slug: 'pulses-rice', subcategoriesCount: 5, productsCount: 34, status: 'Active', icon: '🍚' },
  { id: 'CAT-05', name: 'Dry Fruits & Nuts', slug: 'dry-fruits', subcategoriesCount: 8, productsCount: 19, status: 'Inactive', icon: '🥜' },
  { id: 'CAT-06', name: 'Packaged Snacks', slug: 'packaged-snacks', subcategoriesCount: 10, productsCount: 60, status: 'Active', icon: '📦' },
];

const Categories = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState(initialCategories);

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Category Management</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Organize warehouse inventory into parent and sub-categories.</p>
        </div>
        <button className="bg-[#ff5500] hover:bg-[#e64d00] text-white font-bold py-2.5 px-4 rounded-md shadow-sm transition-colors cursor-pointer border-none flex items-center gap-2">
          <Plus size={18} strokeWidth={2.5} />
          Add Category
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between bg-slate-50/50">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search category name or slug..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-md outline-none focus:border-[#ff5500] text-sm font-medium transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500">Total Categories: <strong className="text-slate-900">{categories.length}</strong></span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-4 font-bold">Category</th>
                <th className="px-6 py-4 font-bold">Slug</th>
                <th className="px-6 py-4 font-bold">Sub-Categories</th>
                <th className="px-6 py-4 font-bold">Products</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium text-slate-700 divide-y divide-slate-100">
              {filteredCategories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-xl shrink-0">
                        {cat.icon}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{cat.name}</span>
                        <span className="text-xs text-slate-400 font-medium">{cat.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{cat.slug}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                      <FolderTree size={16} className="text-slate-400" />
                      {cat.subcategoriesCount} Sub-types
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">{cat.productsCount} Items</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold ${cat.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                      {cat.status === 'Active' ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                      {cat.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-slate-400 hover:text-orange-600 bg-white rounded-md border border-slate-200 shadow-sm cursor-pointer" title="Edit"><Edit size={16} /></button>
                      <button className="p-1.5 text-slate-400 hover:text-red-600 bg-white rounded-md border border-slate-200 shadow-sm cursor-pointer" title="Delete"><Trash2 size={16} /></button>
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

export default Categories;
