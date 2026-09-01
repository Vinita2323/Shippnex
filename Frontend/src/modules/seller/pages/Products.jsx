import React, { useState, useEffect } from 'react';
import { Plus, Search, Download, ChevronDown, Edit, Trash2, Eye, FileText, FileSpreadsheet, CheckCircle2, RefreshCw, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { productService, authService } from '../../../services/authService';

const Products = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [pageSize, setPageSize] = useState(10);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);

  const fetchProducts = async () => {
    setLoading(true);
    let apiProds = [];
    try {
      // 1. Get logged-in seller info
      let sellerData = null;
      try {
        const cached = localStorage.getItem('shippnex_seller_data');
        if (cached) sellerData = JSON.parse(cached);
      } catch (e) {}

      if (!sellerData?._id) {
        const profRes = await authService.getSellerProfile().catch(() => null);
        if (profRes?.seller) sellerData = profRes.seller;
      }

      const sellerId = sellerData?._id || sellerData?.id;
      const sellerName = sellerData?.businessName || sellerData?.ownerName;

      // Pass sellerId so backend only returns products belonging to this seller
      const params = {};
      if (sellerId) params.sellerId = sellerId;
      if (sellerName) params.seller = sellerName;

      const res = await productService.getProducts(params);
      if (res && res.products && Array.isArray(res.products)) {
        apiProds = res.products;
      }
    } catch (err) {
      console.warn('Error fetching products from API:', err.message);
    }

    const formattedApi = apiProds.map(ap => ({
      id: ap._id || ap.id || ap.sku,
      _id: ap._id,
      name: ap.name,
      sku: ap.sku || ap.id || 'SKU-001',
      category: ap.category || 'General',
      subCategory: ap.subCategory || '',
      stock: Number(ap.stock !== undefined ? ap.stock : 0),
      price: Number(ap.salePrice || ap.mrp || ap.price || 0),
      mrp: Number(ap.mrp || 0),
      status: ap.status || 'Published',
      image: ap.mainImage || ap.image || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100&auto=format&fit=crop&q=80',
    }));

    // Populate category dropdown from loaded products
    const cats = Array.from(new Set(formattedApi.map(p => p.category))).filter(Boolean);
    setCategoriesList(cats);

    setProducts(formattedApi);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (p.sku || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredProducts.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`Are you sure you want to delete "${product.name}"?`)) return;
    if (product._id) {
      try {
        await productService.deleteProduct(product._id);
      } catch (e) {}
    }
    const localProds = JSON.parse(localStorage.getItem('shippnex_custom_products') || '[]');
    const updatedLocal = localProds.filter(p => (p._id || p.id) !== product.id && p.name !== product.name);
    localStorage.setItem('shippnex_custom_products', JSON.stringify(updatedLocal));
    fetchProducts();
  };

  const exportProducts = (format = 'csv') => {
    if (filteredProducts.length === 0) {
      alert('No product data available to export.');
      return;
    }

    const headers = ['Product ID', 'Product Name', 'SKU', 'Category', 'Price (INR)', 'Stock', 'Status'];
    const rows = filteredProducts.map(p => [
      `"${p.id}"`,
      `"${p.name}"`,
      `"${p.sku}"`,
      `"${p.category}"`,
      `"${Number(p.price).toFixed(2)}"`,
      `"${p.stock} units"`,
      `"${p.status}"`
    ]);

    const csvString = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Products_Catalog_${new Date().toISOString().slice(0, 10)}.csv`);
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
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Products</h1>
          <p className="text-sm font-normal text-slate-500 mt-1">Manage your store product catalog.</p>
        </div>
        <button 
          onClick={() => navigate('/seller/product/add')}
          className="bg-[#ff7526] hover:bg-[#e65507] text-white font-medium py-2.5 px-4 rounded-lg shadow-sm transition-colors cursor-pointer border-none flex items-center gap-2 text-sm"
        >
          <Plus size={18} strokeWidth={2} />
          Add New Product
        </button>
      </div>

      {/* Main Unified Card Container */}
      <div className="rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-white">
        
        {/* Light Orange Header Title Banner */}
        <div className="bg-[#ff7526] px-5 py-3.5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h2 className="text-white font-semibold text-lg tracking-wide">View Product List</h2>
            <button
              onClick={fetchProducts}
              className="p-1 text-white/80 hover:text-white rounded-md bg-white/10 hover:bg-white/20 transition-all border-none cursor-pointer flex items-center gap-1 text-xs"
              title="Refresh Products List"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
          <span className="text-white/90 text-xs font-medium">Total Items: {filteredProducts.length}</span>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 bg-white border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 text-sm font-normal text-slate-700">
          
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-normal">Category</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 bg-white outline-none focus:border-[#ff7526] cursor-pointer text-sm font-normal transition-all"
            >
              <option value="All">All Categories</option>
              {categoriesList.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
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
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
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
              placeholder="Search product name or SKU..."
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
                  onClick={() => exportProducts('csv')}
                  className="w-full px-4 py-2.5 text-left text-sm font-normal text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer bg-transparent border-none"
                >
                  <FileText size={16} className="text-[#ff7526]" />
                  Export as CSV
                </button>
                <button
                  onClick={() => exportProducts('excel')}
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
                <th className="px-5 py-4 font-semibold w-10">
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll} 
                    checked={selectedIds.length === filteredProducts.length && filteredProducts.length > 0} 
                    className="rounded text-[#ff7526] focus:ring-[#ff7526] cursor-pointer" 
                  />
                </th>
                <th className="px-5 py-4 font-semibold">Product Details</th>
                <th className="px-5 py-4 font-semibold">Category</th>
                <th className="px-5 py-4 font-semibold">Price (₹)</th>
                <th className="px-5 py-4 font-semibold">Stock</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[15px] font-normal text-slate-700 divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500 text-sm font-medium">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw size={16} className="animate-spin text-[#ff7526]" />
                      Loading product catalog...
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.slice(0, pageSize).map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-4">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(product.id)}
                      onChange={() => handleSelectOne(product.id)}
                      className="rounded text-[#ff7526] focus:ring-[#ff7526] cursor-pointer" 
                    />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 overflow-hidden">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package size={18} className="text-slate-400" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 leading-tight">{product.name}</span>
                        <span className="text-[13px] text-slate-400 font-normal">{product.sku}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm font-normal text-slate-600">{product.category}</td>
                  <td className="px-5 py-4 font-semibold text-slate-900">₹{Number(product.price).toFixed(2)}</td>
                  <td className="px-5 py-4 text-sm">
                    <span className={`font-semibold ${product.stock === 0 ? 'text-red-600' : product.stock < 100 ? 'text-orange-600' : 'text-slate-900'}`}>
                      {product.stock} units
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={product.status} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => alert(`Viewing details for ${product.name}`)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 bg-white rounded-md border border-slate-200 shadow-xs cursor-pointer transition-colors" 
                        title="View Product"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => navigate('/seller/product/add')}
                        className="p-1.5 text-slate-500 hover:text-[#ff7526] bg-white rounded-md border border-slate-200 shadow-xs cursor-pointer transition-colors" 
                        title="Edit Product"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product)}
                        className="p-1.5 text-slate-500 hover:text-red-600 bg-white rounded-md border border-slate-200 shadow-xs cursor-pointer transition-colors" 
                        title="Delete Product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {!loading && filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400 text-sm font-normal">
                    No products found in database. Click "+ Add New Product" to create your first item.
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
  if (status === 'Published' || status === 'In Stock') style = 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  if (status === 'Low Stock') style = 'bg-amber-50 text-amber-700 border border-amber-200';
  if (status === 'Out of Stock' || status === 'Draft') style = 'bg-red-50 text-red-700 border border-red-200';
  return <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${style}`}>{status}</span>;
};

export default Products;
