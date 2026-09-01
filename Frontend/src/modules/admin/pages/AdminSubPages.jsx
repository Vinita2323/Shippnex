import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/useAdmin';
import { StatusBadge, Drawer } from '../components/AdminUIComponents';
import { categoryService, bannerService, productService, walletService, captainService, fcmService } from '../../../services/authService';
import { mockUsers, mockSellers, mockCaptains, mockWarehouses, mockCategories, mockProducts, mockOrders, mockDeliveries, mockPayments, mockCoupons, mockNotifications, mockRoles, mockFaqs } from '../mock/adminMockData';
import { 
  Search, 
  Download, 
  Plus, 
  Eye, 
  Truck, 
  Send,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Store,
  Package,
  MapPin,
  Phone,
  Clock,
  Navigation,
  Edit3,
  Pencil,
  Trash2,
  Upload,
  CheckCircle,
  FileText,
  DollarSign,
  Boxes,
  Image,
  Tag,
  RefreshCw
} from 'lucide-react';

/* =========================================================================
   1. USER MANAGEMENT PAGE
   ========================================================================= */
export const UserManagement = () => {
  const [users] = useState(mockUsers);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / entriesPerPage) || 1;
  const indexOfLastItem = currentPage * entriesPerPage;
  const indexOfFirstItem = indexOfLastItem - entriesPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleEntriesChange = (e) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900">User Management</h2>
          <p className="text-xs text-slate-500">View, search, filter, and manage platform customer accounts</p>
        </div>
        <button 
          onClick={() => alert('Exporting Users CSV (UI Only)')}
          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Download size={15} /> Export Users
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search user by name or email..."
              value={search}
              onChange={handleSearchChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#ff5500]"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Show</span>
            <select
              value={entriesPerPage}
              onChange={handleEntriesChange}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 font-semibold focus:outline-none focus:border-[#ff5500]"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>entries</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Orders</th>
                <th className="py-3 px-4">Wallet</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {currentUsers.length > 0 ? (
                currentUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                        <div>
                          <p className="font-bold text-slate-900 leading-none">{u.name}</p>
                          <span className="text-[10px] text-slate-400 font-mono">{u.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-slate-900">{u.email}</p>
                      <p className="text-[10px] text-slate-400">{u.phone}</p>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{u.ordersCount}</td>
                    <td className="py-3 px-4 font-mono font-bold text-[#ff5500]">{u.walletBalance}</td>
                    <td className="py-3 px-4 text-slate-500 font-mono">{u.joinedDate}</td>
                    <td className="py-3 px-4"><StatusBadge status={u.status} /></td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button 
                        onClick={() => { setSelectedUser(u); setIsDrawerOpen(true); }}
                        className="p-1.5 bg-slate-100 hover:bg-[#ff5500] hover:text-white text-slate-700 rounded-lg transition-colors border-none cursor-pointer"
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400 italic text-xs">
                    No users found matching search criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer & Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-500">
          <span>
            Showing {filteredUsers.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} entries
          </span>
          
          <div className="inline-flex rounded-xl border border-slate-200 p-0.5 bg-slate-50 items-center">
            <button 
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 border-none bg-transparent cursor-pointer disabled:opacity-40"
            >
              ‹
            </button>
            <span className="px-3 py-1 bg-[#ff5500] text-white text-xs font-bold rounded-lg shadow-2xs">
              {currentPage} of {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 border-none bg-transparent cursor-pointer disabled:opacity-40"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="User Profile Drawer">
        {selectedUser && (
          <div className="space-y-4">
            <div className="text-center pb-4 border-b border-slate-100">
              <img src={selectedUser.avatar} alt={selectedUser.name} className="w-20 h-20 rounded-full mx-auto mb-2 object-cover border-2 border-[#ff5500]" />
              <h3 className="text-lg font-bold text-slate-900">{selectedUser.name}</h3>
              <p className="text-xs text-[#ff5500] font-mono">{selectedUser.id}</p>
            </div>
            <div className="space-y-2 text-xs text-slate-600">
              <p><strong className="text-slate-900">Email:</strong> {selectedUser.email}</p>
              <p><strong className="text-slate-900">Phone:</strong> {selectedUser.phone}</p>
              <p><strong className="text-slate-900">Status:</strong> <StatusBadge status={selectedUser.status} /></p>
              <p><strong className="text-slate-900">Total Orders:</strong> {selectedUser.ordersCount}</p>
              <p><strong className="text-slate-900">Wallet Balance:</strong> <span className="text-[#ff5500] font-mono font-bold">{selectedUser.walletBalance}</span></p>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

/* =========================================================================
   2. SELLER MANAGEMENT PAGE (VIEW SELLER LIST)
   ========================================================================= */
export const SellerManagement = () => {
  const [sellers, setSellers] = React.useState([]);

  React.useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/sellers');
      const data = await res.json();
      if (data.success) {
        const mappedSellers = data.sellers.map(s => ({
          ...s,
          id: s._id,
          name: s.ownerName || s.businessName,
          storeName: s.businessName,
          contactPhone: s.phone,
          contactEmail: s.email || '-',
          logoText: s.businessName.substring(0, 2).toUpperCase(),
          logoBg: 'bg-emerald-500',
          balance: '0.00',
          commission: '0.00%',
          categoriesCount: 0,
          assignedCategories: [],
          status: s.status === 'pending' ? 'Pending' : (s.status === 'approved' ? 'Approved' : 'Rejected'),
          needApproval: s.status === 'pending' ? 'Yes' : 'No'
        }));
        setSellers(mappedSellers);
      }
    } catch (err) {
      console.error('Error fetching sellers:', err);
    }
  };

  const [searchQuery, setSearchQuery] = React.useState('');
  const [entriesPerPage, setEntriesPerPage] = React.useState('10');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [sortField, setSortField] = React.useState('id');
  const [sortDirection, setSortDirection] = React.useState('asc');

  // Modal / Drawer States
  const [selectedSellerCategoryDrawer, setSelectedSellerCategoryDrawer] = React.useState(null);
  const [editingSellerModal, setEditingSellerModal] = React.useState(null);
  const [editFormData, setEditFormData] = React.useState({ name: '', storeName: '', commission: '', balance: '' });
  const [previewDocImage, setPreviewDocImage] = React.useState(null);

  // Column Sort Handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // CSV Export Action
  const handleExportCSV = () => {
    const rows = [['Seller ID', 'Name', 'Store Name', 'Contact Phone', 'Contact Email', 'Balance', 'Commission', 'Status', 'Need Approval'].join(',')];
    sellers.forEach(s => {
      rows.push([`"${s.id}"`, `"${s.name}"`, `"${s.storeName}"`, `"${s.contactPhone}"`, `"${s.contactEmail}"`, `"${s.balance}"`, `"${s.commission}"`, `"${s.status}"`, `"${s.needApproval}"`].join(','));
    });
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `shippnex_seller_list_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  // Toggle Approval Status
  const handleToggleStatus = async (id) => {
    const seller = sellers.find(s => s.id === id);
    if (!seller) return;
    
    const nextStatus = seller.status === 'Approved' ? 'pending' : 'approved';
    try {
      const res = await fetch(`http://localhost:5000/api/admin/sellers/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      const data = await res.json();
      if (data.success) {
        setSellers(prev => prev.map(s => {
          if (s.id === id) {
            const displayStatus = nextStatus === 'approved' ? 'Approved' : 'Pending';
            return { ...s, status: displayStatus, needApproval: displayStatus === 'Approved' ? 'No' : 'Yes' };
          }
          return s;
        }));
      } else {
        alert(data.message || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  // Delete Action
  const handleDeleteSeller = (id) => {
    if (window.confirm('Are you sure you want to remove this seller record?')) {
      setSellers(prev => prev.filter(s => s.id !== id));
    }
  };

  // Open Edit Modal
  const openEditModal = (seller) => {
    setEditingSellerModal(seller);
    setEditFormData({
      name: seller.name,
      storeName: seller.storeName,
      commission: seller.commission,
      balance: seller.balance
    });
  };

  // Save Edit Modal
  const handleSaveEdit = (e) => {
    e.preventDefault();
    setSellers(prev => prev.map(s => s.id === editingSellerModal.id ? {
      ...s,
      name: editFormData.name,
      storeName: editFormData.storeName,
      commission: editFormData.commission.endsWith('%') ? editFormData.commission : `${editFormData.commission}%`,
      balance: editFormData.balance
    } : s));
    setEditingSellerModal(null);
  };

  // Filtered & Sorted Sellers
  const filteredSellers = React.useMemo(() => {
    let result = sellers.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.contactEmail.toLowerCase().includes(searchQuery.toLowerCase())
    );

    result.sort((a, b) => {
      let aVal = a[sortField] || '';
      let bVal = b[sortField] || '';
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [sellers, searchQuery, sortField, sortDirection]);

  // Pagination bounds
  const totalPages = Math.max(1, Math.ceil(filteredSellers.length / Number(entriesPerPage)));
  const displayedSellers = filteredSellers.slice((currentPage - 1) * Number(entriesPerPage), currentPage * Number(entriesPerPage));

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header & Breadcrumb */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Sellers & Merchants</h1>
        <div className="text-xs text-slate-500 font-medium">
          Dashboard / <span className="text-[#ff5500] font-semibold">Seller List</span>
        </div>
      </div>

      {/* Main Card Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Light Orange Header Banner */}
        <div className="bg-[#fff4ed] border-b border-orange-200/70 text-[#002625] px-6 py-4 flex items-center justify-between">
          <h2 className="text-base font-bold tracking-tight text-[#002625] flex items-center gap-2">
            <ChevronRight size={18} className="text-[#ff5500]" />
            View Seller List
          </h2>
          <span className="text-[10px] uppercase font-extrabold tracking-wider bg-[#ff5500] text-white px-3 py-1 rounded-full shadow-2xs">
            {sellers.length} Registered Sellers
          </span>
        </div>

        <div className="p-6 space-y-4">
          {/* Toolbar Controls: Show entries dropdown, Export, Search */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-medium text-slate-600">
            <div className="flex items-center gap-2">
              <span>Show</span>
              <select 
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-slate-200 rounded-xl px-2.5 py-1.5 bg-slate-50 text-xs text-slate-800 outline-none focus:border-[#ff5500] cursor-pointer"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
              <span>entries</span>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={handleExportCSV}
                className="px-4 py-1.5 bg-[#002625] hover:bg-[#003837] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 border-none cursor-pointer shadow-2xs transition-all active:scale-95"
              >
                <Download size={13} className="text-[#ff5500]" /> Export
              </button>

              <div className="flex items-center gap-1.5">
                <span>Search:</span>
                <input 
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-44 border border-slate-200 rounded-xl px-3 py-1.5 bg-slate-50 text-xs text-slate-800 outline-none focus:border-[#ff5500]"
                />
              </div>
            </div>
          </div>

          {/* Seller Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider select-none">
                  <th onClick={() => handleSort('id')} className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/70">Id ⇅</th>
                  <th onClick={() => handleSort('name')} className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/70">Name ⇅</th>
                  <th onClick={() => handleSort('storeName')} className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/70">Store Name ⇅</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4 text-center">Logo</th>
                  <th onClick={() => handleSort('balance')} className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/70">Balance ⇅</th>
                  <th onClick={() => handleSort('commission')} className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/70">Commission ⇅</th>
                  <th className="py-3.5 px-4">Categories</th>
                  <th onClick={() => handleSort('status')} className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/70">Status ⇅</th>
                  <th className="py-3.5 px-4 text-center">Need Approval?</th>
                  <th className="py-3.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {displayedSellers.length > 0 ? (
                  displayedSellers.map((seller) => (
                    <tr key={seller.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-500" title={seller.id}>
                        #{seller.id.slice(-6).toUpperCase()}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{seller.name}</td>
                      <td className="py-3.5 px-4 text-slate-800 font-semibold">{seller.storeName}</td>
                      <td className="py-3.5 px-4 space-y-0.5">
                        <p className="font-mono text-slate-800 font-medium">{seller.contactPhone}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{seller.contactEmail}</p>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`w-8 h-8 rounded-full ${seller.logoBg} text-white font-extrabold flex items-center justify-center mx-auto text-xs shadow-2xs`}>
                          {seller.logoText}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">₹{seller.balance}</td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">{seller.commission}</td>
                      <td className="py-3.5 px-4">
                        <button 
                          onClick={() => setSelectedSellerCategoryDrawer(seller)}
                          className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 border-none cursor-pointer transition-colors"
                        >
                          <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                            {seller.categoriesCount}
                          </span>
                          <span>View Details →</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          seller.status === 'Approved' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {seller.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`text-xs font-bold ${seller.needApproval === 'Yes' ? 'text-rose-500' : 'text-slate-400'}`}>
                          {seller.needApproval}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button 
                            onClick={() => {
                              setEditFormData({ name: seller.name, storeName: seller.storeName, commission: seller.commission, balance: seller.balance });
                              setEditingSellerModal(seller);
                            }}
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg border border-emerald-200 cursor-pointer transition-colors flex items-center gap-1 font-semibold text-xs px-2"
                            title="View Seller Details"
                          >
                            <Eye size={13} /> View
                          </button>
                          <button 
                            onClick={() => {
                              setEditFormData({ name: seller.name, storeName: seller.storeName, commission: seller.commission, balance: seller.balance });
                              setEditingSellerModal(seller);
                            }}
                            className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg border border-blue-200 cursor-pointer transition-colors"
                            title="Edit Seller Details"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button 
                            onClick={() => handleDeleteSeller(seller.id)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg border border-rose-200 cursor-pointer transition-colors"
                            title="Delete Seller"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="py-8 text-center text-slate-400 italic text-xs">
                      No seller accounts found matching search criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer & Pagination */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-500">
            <span>Showing {displayedSellers.length > 0 ? (currentPage - 1) * Number(entriesPerPage) + 1 : 0} to {Math.min(currentPage * Number(entriesPerPage), filteredSellers.length)} of {filteredSellers.length} entries</span>
            
            <div className="inline-flex rounded-xl border border-slate-200 p-0.5 bg-slate-50">
              <button 
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 border-none bg-transparent cursor-pointer disabled:opacity-40"
              >
                ‹
              </button>
              <button className="px-3 py-1 bg-[#ff5500] text-white text-xs font-bold rounded-lg shadow-2xs border-none cursor-pointer">
                {currentPage} of {totalPages}
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 border-none bg-transparent cursor-pointer disabled:opacity-40"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Category Details Modal/Drawer */}
      {selectedSellerCategoryDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-fadeIn">
            <div className="bg-[#002625] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <ChevronRight size={16} className="text-[#ff5500]" />
                {selectedSellerCategoryDrawer.storeName} - Categories
              </h3>
              <button 
                onClick={() => setSelectedSellerCategoryDrawer(null)}
                className="text-slate-400 hover:text-white border-none bg-transparent cursor-pointer text-lg font-bold"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
                <p className="text-slate-500">Seller Name: <span className="font-bold text-slate-900">{selectedSellerCategoryDrawer.name}</span></p>
                <p className="text-slate-500">Seller ID: <span className="font-mono text-[#ff5500] font-bold">{selectedSellerCategoryDrawer.id}</span></p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-700 mb-2">Assigned Product Categories:</h4>
                <div className="space-y-2">
                  {selectedSellerCategoryDrawer.assignedCategories.map((catName, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-xs">
                      <span className="font-bold text-emerald-900">📁 {catName}</span>
                      <span className="text-[10px] bg-emerald-600 text-white font-extrabold px-2 py-0.5 rounded-md">Active</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button 
                  onClick={() => setSelectedSellerCategoryDrawer(null)}
                  className="px-4 py-2 bg-[#ff5500] hover:bg-[#e04a00] text-white text-xs font-bold rounded-xl border-none cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Seller Comprehensive Modal */}
      {editingSellerModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-fadeIn my-8 max-h-[90vh] flex flex-col">
            
            {/* Modal Header matching Light Orange Theme */}
            <div className="bg-[#fff4ed] border-b border-orange-200/70 text-[#002625] px-6 py-4 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-base font-bold text-[#002625] m-0">
                  Edit Seller - {editingSellerModal.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  View and manage seller details
                </p>
              </div>
              <button 
                onClick={() => setEditingSellerModal(null)}
                className="text-slate-400 hover:text-slate-800 border-none bg-transparent cursor-pointer text-xl font-bold p-1"
              >
                ×
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
              
              {/* Status Bar with Approve & Reject */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    editingSellerModal.status === 'Approved' 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {editingSellerModal.status}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={async () => {
                      try {
                        const res = await fetch(`http://localhost:5000/api/admin/sellers/${editingSellerModal.id}/status`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ status: 'approved' })
                        });
                        const data = await res.json();
                        if (data.success) {
                          setSellers(prev => prev.map(s => s.id === editingSellerModal.id ? { ...s, status: 'Approved', needApproval: 'No' } : s));
                          setEditingSellerModal(prev => ({ ...prev, status: 'Approved', needApproval: 'No' }));
                          alert('Seller has been approved successfully!');
                        }
                      } catch (err) { console.error(err); }
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl border-none cursor-pointer flex items-center gap-1.5 shadow-2xs transition-all"
                  >
                    ✓ Approve
                  </button>
                  <button 
                    onClick={async () => {
                      try {
                        const res = await fetch(`http://localhost:5000/api/admin/sellers/${editingSellerModal.id}/status`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ status: 'rejected' })
                        });
                        const data = await res.json();
                        if (data.success) {
                          setSellers(prev => prev.map(s => s.id === editingSellerModal.id ? { ...s, status: 'Rejected', needApproval: 'Yes' } : s));
                          setEditingSellerModal(prev => ({ ...prev, status: 'Rejected', needApproval: 'Yes' }));
                          alert('Seller application has been rejected.');
                        }
                      } catch (err) { console.error(err); }
                    }}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl border-none cursor-pointer flex items-center gap-1.5 shadow-2xs transition-all"
                  >
                    ✕ Reject
                  </button>
                </div>
              </div>

              {/* 1. Basic Information Card */}
              <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="text-sm font-bold text-slate-800 m-0">Basic Information</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">Seller Name</label>
                    <input 
                      type="text"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-[#ff5500]"
                    />
                  </div>

                  <div>
                    <label className="text-slate-500 font-medium block mb-1">Store Name</label>
                    <input 
                      type="text"
                      value={editFormData.storeName}
                      onChange={(e) => setEditFormData({ ...editFormData, storeName: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-[#ff5500]"
                    />
                  </div>

                  <div>
                    <label className="text-slate-500 font-medium block mb-1">Email</label>
                    <input 
                      type="email"
                      defaultValue={editingSellerModal.contactEmail}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-[#ff5500]"
                    />
                  </div>

                  <div>
                    <label className="text-slate-500 font-medium block mb-1">Phone</label>
                    <input 
                      type="text"
                      defaultValue={editingSellerModal.contactPhone}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-[#ff5500]"
                    />
                  </div>

                  <div>
                    <label className="text-slate-500 font-medium block mb-1">Business Type</label>
                    <input 
                      type="text"
                      defaultValue={editingSellerModal.businessType || 'N/A'}
                      readOnly
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-500 font-medium block mb-1">Store Logo</label>
                    {editingSellerModal.storeLogo ? (
                      <img src={editingSellerModal.storeLogo} alt="Logo" className="h-12 w-12 object-contain rounded-lg border border-slate-200 bg-white" />
                    ) : (
                      <span className="text-xs text-slate-400">No logo</span>
                    )}
                  </div>

                  <div>
                    <label className="text-slate-500 font-medium block mb-1">Commission (%)</label>
                    <div className="flex gap-2">
                      <input 
                        type="number"
                        min="0"
                        max="100"
                        value={editFormData.commission}
                        onChange={(e) => setEditFormData({ ...editFormData, commission: e.target.value })}
                        className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-[#ff5500]"
                        placeholder="e.g. 10"
                      />
                      <button 
                        type="button"
                        onClick={async () => {
                          try {
                            const res = await walletService.updateSellerCommission(editingSellerModal._id, editFormData.commission);
                            alert(res.message || `Commission set to ${editFormData.commission}%`);
                            fetchSellers();
                          } catch (err) {
                            alert(err.response?.data?.message || err.message || 'Failed to update commission');
                          }
                        }}
                        className="px-4 py-2.5 bg-[#ff7526] hover:bg-[#e65507] text-white font-extrabold rounded-xl border-none cursor-pointer shadow-sm transition-all"
                      >
                        Set Rate
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Address Information Card */}
              <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-800 m-0">Address Information</h4>
                  <button 
                    type="button"
                    onClick={() => alert('Address information updated')}
                    className="px-3.5 py-1.5 bg-[#002625] hover:bg-[#003837] text-white font-bold rounded-xl border-none cursor-pointer"
                  >
                    Update Address
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">Address</label>
                    <input 
                      type="text"
                      defaultValue={editingSellerModal.warehouseLocation?.storeAddress || 'N/A'}
                      readOnly
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-500 font-medium block mb-1">City</label>
                      <input 
                        type="text"
                        defaultValue={editingSellerModal.warehouseLocation?.city || 'N/A'}
                        readOnly
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 font-medium block mb-1">State / Pincode</label>
                      <input 
                        type="text"
                        defaultValue={`${editingSellerModal.warehouseLocation?.state || ''} ${editingSellerModal.warehouseLocation?.pincode || ''}`.trim() || 'N/A'}
                        readOnly
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-500 font-medium block mb-1">Latitude</label>
                      <input 
                        type="text"
                        defaultValue={editingSellerModal.warehouseLocation?.location?.coordinates?.[1] || 'N/A'}
                        readOnly
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 font-medium block mb-1">Longitude</label>
                      <input 
                        type="text"
                        defaultValue={editingSellerModal.warehouseLocation?.location?.coordinates?.[0] || 'N/A'}
                        readOnly
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Service Area Visualization */}
              <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="text-sm font-bold text-slate-800 m-0">Service Area Visualization</h4>
                
                <div className="flex gap-2 max-w-md items-end">
                  <div className="flex-1">
                    <label className="text-slate-500 font-medium block mb-1">Service Radius (km)</label>
                    <input 
                      type="text"
                      defaultValue={editingSellerModal.serviceRadius || 'N/A'}
                      readOnly
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none"
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={() => alert('Service radius updated')}
                    className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl border-none cursor-pointer"
                  >
                    Update Radius
                  </button>
                </div>

                {/* Map Graphic Preview */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 h-52 bg-slate-200">
                  <img 
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=900&auto=format&fit=crop&q=80" 
                    alt="Service Area Map" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-teal-900/20 pointer-events-none flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full border-2 border-[#ff5500] bg-[#ff5500]/20 flex items-center justify-center">
                      <span className="bg-[#002625] text-white px-2 py-0.5 rounded font-mono text-[10px] font-bold">📍 5.1 km Radius</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Tax Information */}
              <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-800 m-0">Tax Information</h4>
                  <button 
                    type="button"
                    onClick={() => alert('Tax info updated')}
                    className="px-3.5 py-1.5 bg-[#002625] hover:bg-[#003837] text-white font-bold rounded-xl border-none cursor-pointer"
                  >
                    Update Tax Info
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">PAN Card</label>
                    <input 
                      type="text"
                      placeholder="ABCDE1234F"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-[#ff5500]"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">Tax Name (GST Name)</label>
                    <input 
                      type="text"
                      placeholder="Enter registered GST Name"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-[#ff5500]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-500 font-medium block mb-1">Tax Number (GST Number)</label>
                  <input 
                    type="text"
                    placeholder="22AAAAA0000A1Z5"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-[#ff5500]"
                  />
                </div>
              </div>

              {/* 5. Bank Information */}
              <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="text-sm font-bold text-slate-800 m-0">Bank Information</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">Account Name</label>
                    <input 
                      type="text"
                      placeholder="Enter Account Name"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-[#ff5500]"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">Bank Name</label>
                    <input 
                      type="text"
                      placeholder="State Bank of India / HDFC"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-[#ff5500]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">Branch</label>
                    <input 
                      type="text"
                      placeholder="Main Branch Name"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-[#ff5500]"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">Account Number</label>
                    <input 
                      type="text"
                      placeholder="00000012345678"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-[#ff5500]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-500 font-medium block mb-1">IFSC Code</label>
                  <input 
                    type="text"
                    placeholder="SBIN0001234"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-[#ff5500]"
                  />
                </div>
              </div>

              {/* 6. Uploaded Verification Documents */}
              <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="text-sm font-bold text-slate-800 m-0">Uploaded Verification Documents</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 block">GST Certificate / Photo</span>
                      {editingSellerModal.gstPhoto && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">Attached</span>
                      )}
                    </div>
                    {editingSellerModal.gstPhoto ? (
                      <div className="space-y-2">
                        <div 
                          className="relative group cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-slate-900 h-44 flex items-center justify-center"
                          onClick={() => setPreviewDocImage({ title: `GST Certificate - ${editingSellerModal.storeName || editingSellerModal.name}`, src: editingSellerModal.gstPhoto })}
                        >
                          <img 
                            src={editingSellerModal.gstPhoto} 
                            alt="GST Document" 
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform" 
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs gap-1.5 backdrop-blur-[1px]">
                            <Eye size={16} /> View Document
                          </div>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setPreviewDocImage({ title: `GST Certificate - ${editingSellerModal.storeName || editingSellerModal.name}`, src: editingSellerModal.gstPhoto })}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ff5500] hover:text-[#e04a00] border-none bg-transparent cursor-pointer p-0"
                        >
                          <Eye size={14} /> Open in Same Tab Preview
                        </button>
                      </div>
                    ) : (
                      <div className="h-28 flex items-center justify-center bg-slate-50 rounded-lg border border-dashed border-slate-200 text-xs text-slate-400">
                        No GST Document uploaded
                      </div>
                    )}
                  </div>

                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 block">Bank Passbook / Cancelled Cheque</span>
                      {editingSellerModal.bankPassbookPhoto && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">Attached</span>
                      )}
                    </div>
                    {editingSellerModal.bankPassbookPhoto ? (
                      <div className="space-y-2">
                        <div 
                          className="relative group cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-slate-900 h-44 flex items-center justify-center"
                          onClick={() => setPreviewDocImage({ title: `Bank Passbook - ${editingSellerModal.storeName || editingSellerModal.name}`, src: editingSellerModal.bankPassbookPhoto })}
                        >
                          <img 
                            src={editingSellerModal.bankPassbookPhoto} 
                            alt="Bank Passbook Document" 
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform" 
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs gap-1.5 backdrop-blur-[1px]">
                            <Eye size={16} /> View Document
                          </div>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setPreviewDocImage({ title: `Bank Passbook - ${editingSellerModal.storeName || editingSellerModal.name}`, src: editingSellerModal.bankPassbookPhoto })}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ff5500] hover:text-[#e04a00] border-none bg-transparent cursor-pointer p-0"
                        >
                          <Eye size={14} /> Open in Same Tab Preview
                        </button>
                      </div>
                    ) : (
                      <div className="h-28 flex items-center justify-center bg-slate-50 rounded-lg border border-dashed border-slate-200 text-xs text-slate-400">
                        No Bank Passbook uploaded
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end shrink-0">
              <button 
                type="button"
                onClick={() => {
                  setSellers(prev => prev.map(s => s.id === editingSellerModal.id ? { ...s, name: editFormData.name, storeName: editFormData.storeName, commission: editFormData.commission } : s));
                  setEditingSellerModal(null);
                }}
                className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl border-none cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* SELLER LIGHTBOX DOCUMENT IMAGE PREVIEW (SAME TAB) */}
      {previewDocImage && (
        <div 
          className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewDocImage(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-3.5 bg-slate-900 text-white flex justify-between items-center">
              <h4 className="text-xs font-bold text-white m-0 flex items-center gap-2">
                <FileText size={16} className="text-[#ff5500]" />
                {previewDocImage.title}
              </h4>
              <button 
                onClick={() => setPreviewDocImage(null)} 
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border-none cursor-pointer text-lg font-bold"
              >
                ×
              </button>
            </div>
            <div className="p-4 bg-slate-950 flex items-center justify-center overflow-auto max-h-[75vh]">
              <img 
                src={previewDocImage.src} 
                alt={previewDocImage.title} 
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl shadow-lg" 
              />
            </div>
            <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
              <span className="text-[11px] text-slate-500 font-medium">Viewing document on same page</span>
              <button 
                onClick={() => setPreviewDocImage(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl border-none cursor-pointer shadow-sm transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   3. CAPTAIN MANAGEMENT PAGE
   ========================================================================= */
export const CaptainManagement = () => {
  const [captains, setCaptains] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  // Filters & State
  const [statusFilter, setStatusFilter] = React.useState('All');
  const [availabilityFilter, setAvailabilityFilter] = React.useState('All');
  const [search, setSearch] = React.useState('');
  const [entriesPerPage, setEntriesPerPage] = React.useState(10);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [sortField, setSortField] = React.useState(null);
  const [sortOrder, setSortOrder] = React.useState('asc');

  // Modals & Drawer State
  const [selectedCaptain, setSelectedCaptain] = React.useState(null);
  const [editingCaptain, setEditingCaptain] = React.useState(null);
  const [previewDocImage, setPreviewDocImage] = React.useState(null);

  // Fetch Live Captains from Backend API
  const fetchCaptains = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await captainService.getAllCaptains();
      if (res && res.success) {
        const mapped = (res.captains || []).map(c => ({
          _id: c._id,
          id: c._id.slice(-6).toUpperCase(),
          name: c.name || 'Captain Partner',
          mobile: c.phone || '',
          email: c.email || 'N/A',
          address: c.currentAddress || c.workingArea?.city || 'N/A',
          city: c.city || c.workingArea?.city || 'N/A',
          commission: 'Standard',
          balance: `₹${Number(c.walletBalance || 0).toFixed(2)}`,
          cashCollected: `₹${Number(c.cashCollected || 0).toFixed(2)}`,
          status: c.status || 'pending',
          available: c.isOnline ? 'Online' : 'Offline',
          raw: c,
        }));
        setCaptains(mapped);
      }
    } catch (err) {
      console.error('Error fetching captains:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchCaptains();
  }, [fetchCaptains]);

  // Sorting Handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Filtered & Sorted Captains
  const filteredCaptains = captains.filter(d => {
    const statusUpper = (d.status || '').toUpperCase();
    const filterUpper = statusFilter.toUpperCase();
    
    const matchesStatus = 
      statusFilter === 'All' || 
      statusUpper === filterUpper;

    const matchesAvailability = availabilityFilter === 'All' || d.available === availabilityFilter;
    const matchesSearch = 
      (d.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (d.mobile || '').toLowerCase().includes(search.toLowerCase()) ||
      (d.address || '').toLowerCase().includes(search.toLowerCase()) ||
      (d.city || '').toLowerCase().includes(search.toLowerCase()) ||
      (d.id || '').toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesAvailability && matchesSearch;
  });

  const sortedCaptains = [...filteredCaptains].sort((a, b) => {
    if (!sortField) return 0;
    let valA = a[sortField] || '';
    let valB = b[sortField] || '';
    if (typeof valA === 'string' && valA.startsWith('₹')) {
      valA = parseFloat(valA.replace('₹', '').replace(',', '')) || 0;
      valB = parseFloat(valB.replace('₹', '').replace(',', '')) || 0;
    }
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination Math
  const totalPages = Math.ceil(sortedCaptains.length / entriesPerPage) || 1;
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedCaptains = sortedCaptains.slice(startIndex, startIndex + entriesPerPage);

  // Live Status Change Handler (Approve / Pending / Reject)
  const handleToggleCaptainStatus = async (id, newStatus) => {
    try {
      const res = await captainService.toggleCaptainStatus(id, newStatus);
      if (res.success) {
        alert(res.message || `Captain status updated to ${newStatus.toUpperCase()}`);
        fetchCaptains();
      } else {
        alert(res.message || 'Failed to update status');
      }
    } catch (err) {
      alert(`Error updating status: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this captain application permanently?')) {
      try {
        const res = await captainService.deleteCaptain(id);
        if (res.success) {
          alert(res.message || 'Captain deleted successfully');
          fetchCaptains();
        }
      } catch (err) {
        alert(`Error deleting captain: ${err.message}`);
      }
    }
  };

  const handleExportCSV = () => {
    const headers = ['Id', 'Name', 'Mobile', 'Address', 'City', 'Commission', 'Balance', 'Cash Collected', 'Status', 'Available'];
    const rows = sortedCaptains.map(d => [d.id, `"${d.name}"`, d.mobile, `"${d.address}"`, `"${d.city}"`, d.commission, d.balance, d.cashCollected, d.status, d.available]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `shippnex_delivery_boy_list_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Title & Breadcrumb */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Captains</h1>
        <div className="text-xs text-slate-500 font-medium">
          Dashboard / <span className="text-[#ff5500] font-semibold">View Captain List</span>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Light Orange Header Banner */}
        <div className="bg-[#fff4ed] border-b border-orange-200/70 text-[#002625] px-6 py-4 flex items-center justify-between">
          <h2 className="text-base font-bold tracking-tight text-[#002625] flex items-center gap-2 m-0">
            <ChevronRight size={18} className="text-[#ff5500]" />
            View Captain List
          </h2>
        </div>

        {/* Filter Toolbar Section */}
        <div className="p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
            
            {/* Left Filter Controls */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-slate-600 font-medium">Status:</span>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-[#ff5500] cursor-pointer"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-600 font-medium">Availability:</span>
                <select 
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-[#ff5500] cursor-pointer"
                >
                  <option value="All">All Availability</option>
                  <option value="Available">Available</option>
                  <option value="Not Available">Not Available</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-600 font-medium">Search:</span>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search by name, mobile, address..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-56 bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-[#ff5500]"
                  />
                </div>
              </div>
            </div>

            {/* Right Controls: Refresh & Export */}
            <div className="flex items-center gap-2">
              <button 
                onClick={fetchCaptains}
                disabled={loading}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border-none cursor-pointer flex items-center gap-1.5 transition-all active:scale-95 shrink-0"
                title="Reload Latest Data"
              >
                <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>

              <button 
                onClick={handleExportCSV}
                className="px-4 py-2 bg-[#ff5500] hover:bg-[#e04a00] text-white text-xs font-bold rounded-xl border-none cursor-pointer flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 shrink-0"
              >
                <Download size={14} /> Export v
              </button>
            </div>
          </div>

          {/* Show Entries Dropdown */}
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span>Show</span>
            <select 
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-xs text-slate-800 outline-none focus:border-[#ff5500] cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>entries</span>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                  <th onClick={() => handleSort('id')} className="py-3 px-3 cursor-pointer select-none">Id ⇅</th>
                  <th onClick={() => handleSort('name')} className="py-3 px-3 cursor-pointer select-none">Name ⇅</th>
                  <th onClick={() => handleSort('mobile')} className="py-3 px-3 cursor-pointer select-none">Mobile ⇅</th>
                  <th className="py-3 px-3">Address</th>
                  <th onClick={() => handleSort('city')} className="py-3 px-3 cursor-pointer select-none">City ⇅</th>
                  <th className="py-3 px-3">Commission</th>
                  <th onClick={() => handleSort('balance')} className="py-3 px-3 cursor-pointer select-none">Balance ⇅</th>
                  <th onClick={() => handleSort('cashCollected')} className="py-3 px-3 cursor-pointer select-none">Cash Collected ⇅</th>
                  <th onClick={() => handleSort('status')} className="py-3 px-3 cursor-pointer select-none">Status ⇅</th>
                  <th onClick={() => handleSort('available')} className="py-3 px-3 cursor-pointer select-none">Available ⇅</th>
                  <th className="py-3 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {paginatedCaptains.length > 0 ? (
                  paginatedCaptains.map((captain) => (
                    <tr key={captain.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-mono text-slate-500">{captain.id}</td>
                      <td className="py-3 px-3 font-bold text-slate-900">{captain.name}</td>
                      <td className="py-3 px-3 font-mono">{captain.mobile}</td>
                      <td className="py-3 px-3 text-slate-600 max-w-[140px] truncate" title={captain.address}>{captain.address}</td>
                      <td className="py-3 px-3 font-medium">{captain.city}</td>
                      <td className="py-3 px-3 font-semibold text-slate-600">{captain.commission}</td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-800">{captain.balance}</td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-800">{captain.cashCollected}</td>
                      
                      {/* Status Badge */}
                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          (captain.status || '').toLowerCase() === 'approved' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : (captain.status || '').toLowerCase() === 'pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {(captain.status || 'pending').toUpperCase()}
                        </span>
                      </td>

                      {/* Availability Badge */}
                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          captain.available === 'Online' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {captain.available}
                        </span>
                      </td>

                      {/* Interactive Action Buttons */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* View Icon */}
                          <button 
                            onClick={() => setSelectedCaptain(captain)}
                            className="p-1 rounded-md text-sky-600 hover:bg-sky-50 border-none bg-transparent cursor-pointer transition-colors"
                            title="View Details"
                          >
                            <Eye size={15} />
                          </button>

                          {/* Approve Button */}
                          {(captain.status || '').toLowerCase() !== 'approved' && (
                            <button 
                              onClick={() => handleToggleCaptainStatus(captain._id, 'approved')}
                              className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 cursor-pointer transition-colors text-[10px] font-bold flex items-center gap-1"
                              title="Approve Captain"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                              Approve
                            </button>
                          )}

                          {/* Reject Button */}
                          {(captain.status || '').toLowerCase() !== 'rejected' && (
                            <button 
                              onClick={() => handleToggleCaptainStatus(captain._id, 'rejected')}
                              className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 cursor-pointer transition-colors text-[10px] font-bold flex items-center gap-1"
                              title="Reject Captain"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                              Reject
                            </button>
                          )}

                          {/* Delete Icon */}
                          <button 
                            onClick={() => handleDelete(captain._id)}
                            className="p-1 rounded-md text-rose-600 hover:bg-rose-50 border-none bg-transparent cursor-pointer transition-colors"
                            title="Delete Captain"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="py-8 text-center text-slate-400 font-medium">
                      No captains found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 pt-2">
            <div>
              Showing {startIndex + 1} to {Math.min(startIndex + entriesPerPage, sortedCaptains.length)} of {sortedCaptains.length} entries
            </div>

            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer font-bold transition-all"
              >
                ‹
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold border cursor-pointer transition-all ${
                    currentPage === page 
                      ? 'bg-[#ff5500] text-white border-[#ff5500] shadow-2xs' 
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer font-bold transition-all"
              >
                ›
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* VIEW DETAILS CENTERED MODAL */}
      {selectedCaptain && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-white border-b border-slate-100 p-6 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-4">
                {selectedCaptain.raw?.documents?.profilePhoto ? (
                  <img
                    src={selectedCaptain.raw.documents.profilePhoto}
                    alt={selectedCaptain.name}
                    onClick={() => setPreviewDocImage({ title: 'Captain Live Selfie', src: selectedCaptain.raw.documents.profilePhoto })}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm cursor-pointer hover:scale-105 transition-transform shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#15803d] flex items-center justify-center font-black text-xl border border-emerald-100 shrink-0">
                    {selectedCaptain.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-extrabold text-[#002625] m-0">{selectedCaptain.name}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      (selectedCaptain.status || '').toLowerCase() === 'approved' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : (selectedCaptain.status || '').toLowerCase() === 'pending'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {(selectedCaptain.status || 'pending').toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono mt-0.5 m-0">ID: {selectedCaptain.id} • Mobile: {selectedCaptain.mobile}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {(selectedCaptain.status || '').toLowerCase() !== 'approved' && (
                  <button 
                    onClick={() => {
                      handleToggleCaptainStatus(selectedCaptain._id, 'approved');
                      setSelectedCaptain(null);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer transition-colors text-xs font-bold flex items-center gap-1.5 shadow-sm border-none"
                  >
                    Approve Application
                  </button>
                )}

                <button 
                  onClick={() => setSelectedCaptain(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 border-none cursor-pointer flex items-center justify-center text-lg font-bold transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 space-y-6 overflow-y-auto text-xs flex-1">

              {/* Quick Financial Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Wallet Balance</p>
                  <p className="text-base font-extrabold text-emerald-600">{selectedCaptain.balance}</p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Cash Collected</p>
                  <p className="text-base font-extrabold text-[#ff5500]">{selectedCaptain.cashCollected}</p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Duty Status</p>
                  <p className="text-sm font-bold text-slate-800">{selectedCaptain.available}</p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Registered On</p>
                  <p className="text-xs font-bold text-slate-700">
                    {selectedCaptain.raw?.createdAt ? new Date(selectedCaptain.raw.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Section 1: Personal Information */}
              <div className="border border-slate-100 rounded-2xl p-4 bg-white space-y-3">
                <h4 className="text-xs font-black text-[#15803d] uppercase tracking-wider border-b border-slate-100 pb-2 m-0">
                  1. Personal Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-700">
                  <div><span className="text-slate-400 font-medium block text-[10px]">Full Name:</span> <span className="font-bold text-slate-900">{selectedCaptain.raw?.name || selectedCaptain.name}</span></div>
                  <div><span className="text-slate-400 font-medium block text-[10px]">Primary Mobile:</span> <span className="font-bold text-slate-900">{selectedCaptain.raw?.phone || selectedCaptain.mobile}</span></div>
                  <div><span className="text-slate-400 font-medium block text-[10px]">Alternate Mobile:</span> <span className="font-semibold text-slate-800">{selectedCaptain.raw?.alternateMobile || 'N/A'}</span></div>
                  <div><span className="text-slate-400 font-medium block text-[10px]">Email ID:</span> <span className="font-semibold text-slate-800">{selectedCaptain.raw?.email || selectedCaptain.email || 'N/A'}</span></div>
                  <div><span className="text-slate-400 font-medium block text-[10px]">Date of Birth:</span> <span className="font-semibold text-slate-800">{selectedCaptain.raw?.dob || 'N/A'}</span></div>
                  <div><span className="text-slate-400 font-medium block text-[10px]">Age:</span> <span className="font-semibold text-slate-800">{selectedCaptain.raw?.age || 'N/A'}</span></div>
                  <div><span className="text-slate-400 font-medium block text-[10px]">Father's Name:</span> <span className="font-semibold text-slate-800">{selectedCaptain.raw?.fatherName || 'N/A'}</span></div>
                </div>
              </div>

              {/* Section 2: Address & Location */}
              <div className="border border-slate-100 rounded-2xl p-4 bg-white space-y-3">
                <h4 className="text-xs font-black text-[#15803d] uppercase tracking-wider border-b border-slate-100 pb-2 m-0">
                  2. Address & Emergency Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-700">
                  <div className="sm:col-span-2"><span className="text-slate-400 font-medium block text-[10px]">Current Address:</span> <span className="font-semibold text-slate-800">{selectedCaptain.raw?.currentAddress || selectedCaptain.address || 'N/A'}</span></div>
                  <div><span className="text-slate-400 font-medium block text-[10px]">Emergency Contact:</span> <span className="font-bold text-rose-600">{selectedCaptain.raw?.emergencyContact || 'N/A'}</span></div>
                  <div className="sm:col-span-2"><span className="text-slate-400 font-medium block text-[10px]">Permanent Address:</span> <span className="font-semibold text-slate-800">{selectedCaptain.raw?.permanentAddress || 'N/A'}</span></div>
                  <div><span className="text-slate-400 font-medium block text-[10px]">City / State / PIN:</span> <span className="font-semibold text-slate-800">{`${selectedCaptain.raw?.city || selectedCaptain.city || 'N/A'}, ${selectedCaptain.raw?.state || ''} ${selectedCaptain.raw?.pinCode || ''}`}</span></div>
                </div>
              </div>

              {/* Section 3: Identity & Vehicle Details */}
              <div className="border border-slate-100 rounded-2xl p-4 bg-white space-y-3">
                <h4 className="text-xs font-black text-[#15803d] uppercase tracking-wider border-b border-slate-100 pb-2 m-0">
                  3. Identity & Vehicle Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-700">
                  <div><span className="text-slate-400 font-medium block text-[10px]">Vehicle Type:</span> <span className="font-bold text-[#ff5500]">{selectedCaptain.raw?.vehicleType || selectedCaptain.vehicle || 'Two Wheeler'}</span></div>
                  <div><span className="text-slate-400 font-medium block text-[10px]">Driving License No:</span> <span className="font-bold font-mono text-slate-900">{selectedCaptain.raw?.drivingLicenseNumber || 'N/A'}</span></div>
                  <div><span className="text-slate-400 font-medium block text-[10px]">Aadhaar Number:</span> <span className="font-bold font-mono text-slate-900">{selectedCaptain.raw?.aadhaarNumber || 'N/A'}</span></div>
                  <div><span className="text-slate-400 font-medium block text-[10px]">RC Number:</span> <span className="font-semibold font-mono text-slate-800">{selectedCaptain.raw?.rcNumber || 'N/A'}</span></div>
                  <div><span className="text-slate-400 font-medium block text-[10px]">Insurance Number:</span> <span className="font-semibold text-slate-800">{selectedCaptain.raw?.vehicleInsuranceNumber || 'N/A'}</span></div>
                  <div><span className="text-slate-400 font-medium block text-[10px]">Insurance Valid Till:</span> <span className="font-semibold text-slate-800">{selectedCaptain.raw?.insuranceValidTill || 'N/A'}</span></div>
                </div>
              </div>

              {/* Section 4: Bank Details */}
              <div className="border border-slate-100 rounded-2xl p-4 bg-white space-y-3">
                <h4 className="text-xs font-black text-[#15803d] uppercase tracking-wider border-b border-slate-100 pb-2 m-0">
                  4. Bank & Payout Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-700">
                  <div><span className="text-slate-400 font-medium block text-[10px]">Bank Name:</span> <span className="font-bold text-slate-900">{selectedCaptain.raw?.bankDetails?.bankName || 'N/A'}</span></div>
                  <div><span className="text-slate-400 font-medium block text-[10px]">Account Holder:</span> <span className="font-semibold text-slate-800">{selectedCaptain.raw?.bankDetails?.accountHolderName || 'N/A'}</span></div>
                  <div><span className="text-slate-400 font-medium block text-[10px]">Account Number:</span> <span className="font-mono font-bold text-slate-900">{selectedCaptain.raw?.bankDetails?.accountNumber || 'N/A'}</span></div>
                  <div><span className="text-slate-400 font-medium block text-[10px]">IFSC Code:</span> <span className="font-mono font-bold text-slate-900">{selectedCaptain.raw?.bankDetails?.ifscCode || 'N/A'}</span></div>
                  <div><span className="text-slate-400 font-medium block text-[10px]">Branch Name:</span> <span className="font-semibold text-slate-800">{selectedCaptain.raw?.bankDetails?.branchName || 'N/A'}</span></div>
                  <div><span className="text-slate-400 font-medium block text-[10px]">UPI ID:</span> <span className="font-semibold text-[#15803d]">{selectedCaptain.raw?.bankDetails?.upiId || 'N/A'}</span></div>
                </div>
              </div>

              {/* Section 5: Uploaded KYC Documents & Photos */}
              <div className="border border-slate-100 rounded-2xl p-4 bg-white space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-black text-[#15803d] uppercase tracking-wider m-0">
                    5. Uploaded Documents & Real Scans
                  </h4>
                  <span className="text-[10px] text-slate-400 font-semibold">Click any image to view in full resolution</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
                  {/* Captain Live Selfie */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-700 uppercase">Live Selfie</span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          selectedCaptain.raw?.documents?.profilePhoto ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {selectedCaptain.raw?.documents?.profilePhoto ? 'Attached' : 'Pending'}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">
                        Captain Photo Verification
                      </p>
                    </div>

                    {selectedCaptain.raw?.documents?.profilePhoto ? (
                      <div 
                        onClick={() => setPreviewDocImage({ title: 'Captain Live Selfie', src: selectedCaptain.raw.documents.profilePhoto })}
                        className="relative group cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-black aspect-video flex items-center justify-center"
                      >
                        <img 
                          src={selectedCaptain.raw.documents.profilePhoto} 
                          alt="Captain Live Selfie" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-[10px] gap-1">
                          <Eye size={14} /> View Full
                        </div>
                      </div>
                    ) : (
                      <div className="h-20 bg-slate-100 border border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 text-[10px] font-medium">
                        <span>No selfie uploaded</span>
                      </div>
                    )}
                  </div>

                  {/* Driving License */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-700 uppercase">Driving License</span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          selectedCaptain.raw?.documents?.drivingLicense ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {selectedCaptain.raw?.documents?.drivingLicense ? 'Attached' : 'Pending'}
                        </span>
                      </div>
                      <p className="font-mono text-[10px] text-slate-500 truncate mt-0.5">
                        {selectedCaptain.raw?.drivingLicenseNumber || 'No DL No.'}
                      </p>
                    </div>

                    {selectedCaptain.raw?.documents?.drivingLicense ? (
                      <div 
                        onClick={() => setPreviewDocImage({ title: 'Driving License', src: selectedCaptain.raw.documents.drivingLicense })}
                        className="relative group cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-black aspect-video flex items-center justify-center"
                      >
                        <img 
                          src={selectedCaptain.raw.documents.drivingLicense} 
                          alt="Driving License" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-[10px] gap-1">
                          <Eye size={14} /> View Full
                        </div>
                      </div>
                    ) : (
                      <div className="h-20 bg-slate-100 border border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 text-[10px] font-medium">
                        <span>No image uploaded</span>
                      </div>
                    )}
                  </div>

                  {/* RC Document */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-700 uppercase">Vehicle RC</span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          selectedCaptain.raw?.documents?.rcDocument ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {selectedCaptain.raw?.documents?.rcDocument ? 'Attached' : 'Pending'}
                        </span>
                      </div>
                      <p className="font-mono text-[10px] text-slate-500 truncate mt-0.5">
                        {selectedCaptain.raw?.rcNumber || 'No RC No.'}
                      </p>
                    </div>

                    {selectedCaptain.raw?.documents?.rcDocument ? (
                      <div 
                        onClick={() => setPreviewDocImage({ title: 'Vehicle RC Document', src: selectedCaptain.raw.documents.rcDocument })}
                        className="relative group cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-black aspect-video flex items-center justify-center"
                      >
                        <img 
                          src={selectedCaptain.raw.documents.rcDocument} 
                          alt="RC Document" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-[10px] gap-1">
                          <Eye size={14} /> View Full
                        </div>
                      </div>
                    ) : (
                      <div className="h-20 bg-slate-100 border border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 text-[10px] font-medium">
                        <span>No image uploaded</span>
                      </div>
                    )}
                  </div>

                  {/* Aadhaar Card */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-700 uppercase">Aadhaar Card</span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          selectedCaptain.raw?.documents?.aadhaarFront ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {selectedCaptain.raw?.documents?.aadhaarFront ? 'Attached' : 'Pending'}
                        </span>
                      </div>
                      <p className="font-mono text-[10px] text-slate-500 truncate mt-0.5">
                        {selectedCaptain.raw?.aadhaarNumber || 'No Aadhaar No.'}
                      </p>
                    </div>

                    {selectedCaptain.raw?.documents?.aadhaarFront || selectedCaptain.raw?.documents?.aadhaarBack ? (
                      <div 
                        onClick={() => setPreviewDocImage({ title: 'Aadhaar Card', src: selectedCaptain.raw.documents.aadhaarFront || selectedCaptain.raw.documents.aadhaarBack })}
                        className="relative group cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-black aspect-video flex items-center justify-center"
                      >
                        <img 
                          src={selectedCaptain.raw.documents.aadhaarFront || selectedCaptain.raw.documents.aadhaarBack} 
                          alt="Aadhaar Card" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-[10px] gap-1">
                          <Eye size={14} /> View Full
                        </div>
                      </div>
                    ) : (
                      <div className="h-20 bg-slate-100 border border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 text-[10px] font-medium">
                        <span>No image uploaded</span>
                      </div>
                    )}
                  </div>

                  {/* Vehicle Insurance */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-700 uppercase">Insurance Policy</span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          selectedCaptain.raw?.documents?.insuranceDoc ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {selectedCaptain.raw?.documents?.insuranceDoc ? 'Attached' : 'Pending'}
                        </span>
                      </div>
                      <p className="font-mono text-[10px] text-slate-500 truncate mt-0.5">
                        {selectedCaptain.raw?.vehicleInsuranceNumber || 'No Policy No.'}
                      </p>
                    </div>

                    {selectedCaptain.raw?.documents?.insuranceDoc ? (
                      <div 
                        onClick={() => setPreviewDocImage({ title: 'Vehicle Insurance Policy', src: selectedCaptain.raw.documents.insuranceDoc })}
                        className="relative group cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-black aspect-video flex items-center justify-center"
                      >
                        <img 
                          src={selectedCaptain.raw.documents.insuranceDoc} 
                          alt="Insurance Policy" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-[10px] gap-1">
                          <Eye size={14} /> View Full
                        </div>
                      </div>
                    ) : (
                      <div className="h-20 bg-slate-100 border border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 text-[10px] font-medium">
                        <span>No image uploaded</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">Shippnex Captain Command Center</span>
              <button 
                onClick={() => setSelectedCaptain(null)}
                className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl border-none cursor-pointer transition-colors shadow-sm"
              >
                Close Modal
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ADMIN LIGHTBOX DOCUMENT IMAGE PREVIEW */}
      {previewDocImage && (
        <div 
          className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewDocImage(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-3.5 bg-slate-900 text-white flex justify-between items-center">
              <h4 className="text-xs font-bold text-white m-0 flex items-center gap-2">
                <FileText size={16} className="text-[#97fc43]" />
                {previewDocImage.title}
              </h4>
              <button 
                onClick={() => setPreviewDocImage(null)} 
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border-none cursor-pointer"
              >
                ×
              </button>
            </div>
            <div className="p-4 bg-slate-950 flex items-center justify-center overflow-auto max-h-[75vh]">
              <img 
                src={previewDocImage.src} 
                alt={previewDocImage.title} 
                className="max-h-[70vh] w-auto object-contain rounded-xl shadow-lg" 
              />
            </div>
            <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setPreviewDocImage(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl border-none cursor-pointer"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT captain MODAL */}
      {editingCaptain && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-fadeIn">
            <div className="bg-[#fff4ed] border-b border-orange-200/70 p-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#002625] m-0">Edit Captain - {editingCaptain.name}</h3>
              <button 
                onClick={() => setEditingCaptain(null)}
                className="text-slate-400 hover:text-slate-900 border-none bg-transparent cursor-pointer text-lg font-bold"
              >
                ×
              </button>
            </div>
            
            <div className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Name</label>
                <input 
                  type="text" 
                  value={editingCaptain.name}
                  onChange={(e) => setEditingCaptain({ ...editingCaptain, name: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#ff5500]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Mobile</label>
                  <input 
                    type="text" 
                    value={editingCaptain.mobile}
                    onChange={(e) => setEditingCaptain({ ...editingCaptain, mobile: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#ff5500]"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">City</label>
                  <input 
                    type="text" 
                    value={editingCaptain.city}
                    onChange={(e) => setEditingCaptain({ ...editingCaptain, city: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#ff5500]"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Address</label>
                <input 
                  type="text" 
                  value={editingCaptain.address}
                  onChange={(e) => setEditingCaptain({ ...editingCaptain, address: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#ff5500]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Balance (₹)</label>
                  <input 
                    type="text" 
                    value={editingCaptain.balance}
                    onChange={(e) => setEditingCaptain({ ...editingCaptain, balance: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#ff5500]"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Cash Collected (₹)</label>
                  <input 
                    type="text" 
                    value={editingCaptain.cashCollected}
                    onChange={(e) => setEditingCaptain({ ...editingCaptain, cashCollected: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#ff5500]"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
              <button 
                onClick={() => setEditingCaptain(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border-none cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setCaptains(prev => prev.map(d => d.id === editingCaptain.id ? editingCaptain : d));
                  setEditingCaptain(null);
                }}
                className="px-5 py-2 bg-[#ff5500] hover:bg-[#e04a00] text-white text-xs font-bold rounded-xl border-none cursor-pointer shadow-2xs"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   4. WAREHOUSE MANAGEMENT PAGE
   ========================================================================= */
export const WarehouseManagement = () => {
  const [warehouses, setWarehouses] = React.useState(mockWarehouses);
  const [search, setSearch] = React.useState('');

  const filtered = warehouses.filter(w => 
    w.name.toLowerCase().includes(search.toLowerCase()) || 
    w.city.toLowerCase().includes(search.toLowerCase()) ||
    w.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header & Breadcrumb */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Fulfillment Warehouses</h1>
        <div className="text-xs text-slate-500 font-medium">
          Dashboard / <span className="text-[#ff5500] font-semibold">Warehouses & Hubs</span>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Light Orange Header Banner with Search Bar */}
        <div className="bg-[#fff4ed] border-b border-orange-200/70 text-[#002625] px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-base font-bold tracking-tight text-[#002625] flex items-center gap-2 m-0">
              <MapPin size={18} className="text-[#ff5500]" />
              Warehouse Locations & Fulfillment Hubs
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5 m-0">
              Showing active fulfillment hubs, exact physical addresses, and capacity utilization
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search warehouse or address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-[#ff5500] transition-all"
              />
            </div>

            <button 
              onClick={() => alert('Add New Hub Drawer')}
              className="px-4 py-2 bg-[#ff5500] hover:bg-[#e04a00] text-white text-xs font-bold rounded-xl border-none cursor-pointer flex items-center gap-1.5 shadow-2xs transition-all shrink-0 active:scale-95"
            >
              <Plus size={15} /> Add Hub
            </button>
          </div>
        </div>

        {/* Compact Cards Grid (2 Columns on Desktop, 1 on Mobile) */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((w) => (
              <div 
                key={w.id} 
                className="bg-white rounded-2xl border border-slate-200 hover:border-orange-300 shadow-2xs hover:shadow-md transition-all p-4 flex flex-col justify-between space-y-3 relative group"
              >
                {/* Top Row: Hub Name & Status Pill */}
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-orange-50 text-[#ff5500] font-mono font-bold text-[10px] rounded-md border border-orange-200">
                        {w.id}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 tracking-tight m-0">{w.name}</h3>
                    </div>
                    <p className="text-xs text-slate-500 font-semibold m-0">{w.city}</p>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-full border border-emerald-200 shrink-0">
                    ● {w.status}
                  </span>
                </div>

                {/* Streamlined Address & Manager Info Block */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/80 space-y-2 text-xs">
                  <div className="flex items-start gap-2 text-slate-700 font-medium">
                    <MapPin size={15} className="text-[#ff5500] shrink-0 mt-0.5" />
                    <span className="leading-snug text-slate-700">{w.address}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1.5 border-t border-slate-200/50">
                    <span>Manager: <strong className="text-slate-900 font-semibold">{w.manager}</strong></span>
                    <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
                      <Clock size={12} /> {w.hours}
                    </span>
                  </div>
                </div>

                {/* Storage Utilization Bar */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center text-[11px] font-bold">
                    <span className="text-slate-500 uppercase tracking-wider text-[10px]">Storage Utilization</span>
                    <span className="text-slate-900">{w.utilization}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        w.utilization > 85 ? 'bg-rose-500' : w.utilization > 70 ? 'bg-[#ff5500]' : 'bg-emerald-500'
                      }`} 
                      style={{ width: `${w.utilization}%` }} 
                    />
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

/* =========================================================================
   4.5. BRAND MANAGEMENT PAGE
   ========================================================================= */
export const BrandManagement = () => {
  const [brands, setBrands] = React.useState([
    { id: '751452', name: 'Amul', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=100&auto=format&fit=crop&q=80' },
    { id: '3c02a3', name: 'Mother Dairy', image: 'https://images.unsplash.com/photo-1528751014936-863e6e7a319c?w=100&auto=format&fit=crop&q=80' },
    { id: '768417', name: 'test br', image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=100&auto=format&fit=crop&q=80' }
  ]);

  const [brandName, setBrandName] = React.useState('');
  const [brandImage, setBrandImage] = React.useState('');
  const [editingId, setEditingId] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [entriesPerPage, setEntriesPerPage] = React.useState('10');
  const [currentPage, setCurrentPage] = React.useState(1);

  // File Upload Handler
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBrandImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add / Edit Brand Form Action
  const handleSubmitBrand = (e) => {
    e.preventDefault();
    if (!brandName.trim()) {
      alert('Please enter a Brand Name');
      return;
    }

    if (editingId) {
      setBrands(prev => prev.map(b => b.id === editingId ? {
        ...b,
        name: brandName,
        image: brandImage || b.image
      } : b));
      setEditingId(null);
    } else {
      const newBrand = {
        id: Math.random().toString(36).substring(2, 8),
        name: brandName,
        image: brandImage || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=100&auto=format&fit=crop&q=80'
      };
      setBrands(prev => [newBrand, ...prev]);
    }

    setBrandName('');
    setBrandImage('');
  };

  // Edit Action
  const handleEdit = (brand) => {
    setEditingId(brand.id);
    setBrandName(brand.name);
    setBrandImage(brand.image);
  };

  // Delete Action
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      setBrands(prev => prev.filter(b => b.id !== id));
    }
  };

  // CSV Export Action
  const handleExportCSV = () => {
    const rows = [['ID', 'Brand Name', 'Image URL'].join(',')];
    brands.forEach(b => {
      rows.push([`"${b.id}"`, `"${b.name}"`, `"${b.image}"`].join(','));
    });
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `shippnex_brands_export_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
  };

  // Filtered Brands
  const filteredBrands = brands.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header & Breadcrumb */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Brand</h1>
        <div className="text-xs text-slate-500 font-medium">
          Home / <span className="text-[#ff5500] font-semibold">Dashboard</span>
        </div>
      </div>

      {/* Grid Layout: Add Brand (Left) & View Brand (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side Card: Add Brand / Edit Brand */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Card Header matching Light Orange Theme */}
          <div className="bg-[#fff4ed] border-b border-orange-200/70 text-[#002625] px-6 py-4 flex items-center justify-between">
            <h2 className="text-sm font-bold tracking-tight text-[#002625] flex items-center gap-2">
              <Plus size={16} className="text-[#ff5500]" />
              {editingId ? 'Edit Brand' : 'Add Brand'}
            </h2>
          </div>

          <form onSubmit={handleSubmitBrand} className="p-6 space-y-5">
            {/* Brand Name Input */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Brand Name: *
              </label>
              <input 
                type="text" 
                required
                placeholder="Enter Brand Name"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#ff5500] bg-slate-50/50"
              />
            </div>

            {/* Brand Image Upload Box */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Brand Image:
              </label>
              
              <label className="w-full border-2 border-dashed border-slate-200 hover:border-[#ff5500] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/40 group">
                <input 
                  type="file" 
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                
                {brandImage ? (
                  <div className="flex flex-col items-center gap-2">
                    <img 
                      src={brandImage} 
                      alt="Brand Preview" 
                      className="w-20 h-14 rounded-xl object-contain border border-slate-200 bg-white p-1 shadow-2xs" 
                    />
                    <span className="text-[11px] text-[#ff5500] font-bold">Click to Change Image</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-400 group-hover:text-[#ff5500] transition-colors">
                    <Upload size={24} />
                    <span className="text-xs font-bold text-slate-600">Choose File</span>
                    <span className="text-[10px] text-slate-400">Max 5MB (JPG, PNG, WEBP)</span>
                  </div>
                )}
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex items-center gap-2 pt-2">
              <button 
                type="submit"
                className="w-full py-2.5 bg-[#ff5500] hover:bg-[#e04a00] text-white text-xs font-bold rounded-xl border-none cursor-pointer shadow-xs transition-all active:scale-98"
              >
                {editingId ? 'Update Brand' : 'Add Brand'}
              </button>
              {editingId && (
                <button 
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setBrandName('');
                    setBrandImage('');
                  }}
                  className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border-none cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Side Card: View Brand Table */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Card Header matching Dark Teal Theme */}
          <div className="bg-[#002625] text-white px-6 py-4 flex items-center justify-between">
            <h2 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
              <ChevronRight size={16} className="text-[#ff5500]" />
              View Brand
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white/90 px-2.5 py-1 rounded-full">
              {brands.length} Total Brands
            </span>
          </div>

          <div className="p-6 space-y-4">
            {/* Toolbar Controls: Show entries dropdown, Export, Search */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-medium text-slate-600">
              <div className="flex items-center gap-2">
                <span>Show</span>
                <select 
                  value={entriesPerPage}
                  onChange={(e) => setEntriesPerPage(e.target.value)}
                  className="border border-slate-200 rounded-xl px-2.5 py-1.5 bg-slate-50 text-xs text-slate-800 outline-none focus:border-[#ff5500]"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
                <span>entries</span>
              </div>

              <div className="flex items-center gap-3">
                {/* Export Button */}
                <button 
                  onClick={handleExportCSV}
                  className="px-3.5 py-1.5 bg-[#002625] hover:bg-[#003837] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 border-none cursor-pointer shadow-2xs transition-all active:scale-95"
                >
                  <Download size={13} className="text-[#ff5500]" /> Export
                </button>

                {/* Search Input */}
                <div className="flex items-center gap-1.5">
                  <span>Search:</span>
                  <input 
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-40 border border-slate-200 rounded-xl px-3 py-1.5 bg-slate-50 text-xs text-slate-800 outline-none focus:border-[#ff5500]"
                  />
                </div>
              </div>
            </div>

            {/* Brand Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">BRAND NAME</th>
                    <th className="py-3 px-4">BRAND IMAGE</th>
                    <th className="py-3 px-4 text-center">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredBrands.length > 0 ? (
                    filteredBrands.map((brand) => (
                      <tr key={brand.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-medium text-slate-500">{brand.id}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">{brand.name}</td>
                        <td className="py-3 px-4">
                          <img 
                            src={brand.image} 
                            alt={brand.name} 
                            className="w-14 h-10 rounded-lg object-contain bg-white border border-slate-100 p-1 shadow-2xs" 
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => handleEdit(brand)}
                              className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg border border-blue-200 cursor-pointer transition-colors"
                              title="Edit Brand"
                            >
                              <Edit3 size={13} />
                            </button>
                            <button 
                              onClick={() => handleDelete(brand.id)}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg border border-rose-200 cursor-pointer transition-colors"
                              title="Delete Brand"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-6 text-center text-slate-400 italic text-xs">
                        No brands found matching "{searchQuery}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer & Pagination */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-500">
              <span>Showing 1 to {filteredBrands.length} of {brands.length} entries</span>
              
              <div className="inline-flex rounded-xl border border-slate-200 p-0.5 bg-slate-50">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 border-none bg-transparent cursor-pointer"
                >
                  ‹
                </button>
                <button className="px-3 py-1 bg-[#ff5500] text-white text-xs font-bold rounded-lg shadow-2xs border-none cursor-pointer">
                  {currentPage}
                </button>
                <button 
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 border-none bg-transparent cursor-pointer"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

/* =========================================================================
   5. CATEGORIES PAGE
   ========================================================================= */
export const CategoryManagement = ({ initialSubcategoriesOnly = false }) => {
  const [viewMode, setViewMode] = React.useState('tree'); // 'tree' or 'list'
  const [activeCategoryTab, setActiveCategoryTab] = React.useState(initialSubcategoriesOnly ? 'subcategories' : 'all');
  const [expanded, setExpanded] = React.useState({ 'cat-1': true, 'sub-1': true, 'cat-2': true });
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('All Status');

  React.useEffect(() => {
    setActiveCategoryTab(initialSubcategoriesOnly ? 'subcategories' : 'all');
  }, [initialSubcategoriesOnly]);

  // Live State Data for Categories Tree (Fetched from DB)
  const [treeData, setTreeData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [uploadingImage, setUploadingImage] = React.useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoryService.getCategories();
      if (res.success && res.categories) {
        // Map backend category format into flat array first
        const flatCategories = res.categories.map((c, index) => ({
          id: c._id,
          name: c.name,
          status: c.status || 'Active',
          header: 'General',
          subcategoriesCount: 0,
          order: c.priority || index + 1,
          image: c.image || '/uploads/categories/default.png',
          parent: c.parent,
          subcategories: []
        }));

        const categoryMap = {};
        flatCategories.forEach(c => categoryMap[c.id] = c);
        
        const tree = [];
        const initialExpanded = {};
        
        flatCategories.forEach(c => {
          initialExpanded[c.id] = true; // Auto-expand ALL categories by default
          if (c.parent && categoryMap[c.parent]) {
            categoryMap[c.parent].subcategories.push(c);
            categoryMap[c.parent].subcategoriesCount = categoryMap[c.parent].subcategories.length;
          } else {
            tree.push(c);
          }
        });

        setTreeData(tree);
        setExpanded(initialExpanded);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCategories();
  }, []);

  // Modal Control States
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [addModalType, setAddModalType] = React.useState('category'); // 'category' or 'subcategory'
  const [selectedParentId, setSelectedParentId] = React.useState(null);
  const [selectedParentName, setSelectedParentName] = React.useState('');

  // Form Input States
  const [formData, setFormData] = React.useState({
    name: '',
    header: 'General',
    status: 'Active',
    order: '1',
    imageUrl: '/uploads/categories/default.png'
  });

  // Handle Category Image Device Upload
  const handleCategoryImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append('image', file);

    try {
      setUploadingImage(true);
      const res = await bannerService.uploadImage(fd, 'categories');
      if (res.success && res.imageUrl) {
        setFormData(prev => ({ ...prev, imageUrl: res.imageUrl }));
      }
    } catch (err) {
      alert('Image upload failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploadingImage(false);
    }
  };

  // Edit Modal State
  const [editingItem, setEditingItem] = React.useState(null);

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleExpandAll = () => {
    const allIds = {};
    treeData.forEach(cat => {
      allIds[cat.id] = true;
      if (cat.subcategories) {
        cat.subcategories.forEach(sub => {
          allIds[sub.id] = true;
        });
      }
    });
    setExpanded(allIds);
  };

  const handleCollapseAll = () => {
    setExpanded({});
  };

  // Open Modal Handlers with Parent Name
  const openAddCategoryModal = () => {
    setAddModalType('category');
    setSelectedParentId(null);
    setSelectedParentName('');
    setFormData({
      name: '',
      header: 'General',
      status: 'Active',
      order: (treeData.length + 1).toString(),
      imageUrl: '/uploads/categories/default.png'
    });
    setIsAddModalOpen(true);
  };

  const openAddSubcategoryModal = (cat) => {
    setAddModalType('subcategory');
    setSelectedParentId(cat.id);
    setSelectedParentName(cat.name);
    setFormData({
      name: '',
      header: 'General',
      status: 'Active',
      order: '1',
      imageUrl: '/uploads/categories/default.png'
    });
    setIsAddModalOpen(true);
  };

  const openEditCategoryModal = (cat) => {
    setAddModalType('category');
    setSelectedParentId(null);
    setSelectedParentName('');
    setEditingItem(cat);
    setFormData({
      name: cat.name,
      header: cat.header || 'General',
      status: cat.status,
      order: String(cat.order || '1'),
      imageUrl: cat.image || '/uploads/categories/default.png'
    });
    setIsAddModalOpen(true);
  };

  const openAddNestedSubcategoryModal = (sub) => {
    setAddModalType('nested_subcategory');
    setSelectedParentId(sub.id);
    setSelectedParentName(sub.name);
    setFormData({
      name: '',
      header: 'General',
      status: 'Active',
      order: '1',
      imageUrl: '/uploads/categories/default.png'
    });
    setIsAddModalOpen(true);
  };

  // Create Category / Subcategory Action
  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter a category name');
      return;
    }

    try {
      if (editingItem) {
        await categoryService.updateCategory(editingItem.id, {
          name: formData.name.trim(),
          status: formData.status,
          priority: Number(formData.order) || 1,
          image: formData.imageUrl
        });
      } else {
        await categoryService.createCategory({
          name: formData.name.trim(),
          status: formData.status,
          priority: Number(formData.order) || treeData.length + 1,
          image: formData.imageUrl,
          parent: (addModalType === 'subcategory' || addModalType === 'nested_subcategory') ? selectedParentId : null
        });
      }
      setIsAddModalOpen(false);
      setEditingItem(null);
      fetchCategories();
    } catch (err) {
      alert('Failed to save category: ' + (err.response?.data?.message || err.message));
    }
  };

  // Toggle Active / Deactivate Status
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
      await categoryService.updateCategory(id, { status: newStatus });
      fetchCategories();
    } catch (err) {
      alert('Failed to update category status');
    }
  };

  // Delete Item Action
  const handleDeleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category item?')) return;
    try {
      await categoryService.deleteCategory(id);
      fetchCategories();
    } catch (err) {
      alert('Failed to delete category');
    }
  };

  // Export Categories to Real CSV File Download
  const handleExportCSV = () => {
    const rows = [];
    rows.push(['ID', 'Level', 'Category Name', 'Parent Category', 'Status', 'Sort Order'].join(','));

    treeData.forEach((cat) => {
      rows.push([
        `"${cat.id}"`,
        '"Root Category"',
        `"${cat.name.replace(/"/g, '""')}"`,
        '"None"',
        `"${cat.status}"`,
        `"${cat.order}"`
      ].join(','));

      if (cat.subcategories && cat.subcategories.length > 0) {
        cat.subcategories.forEach((sub) => {
          rows.push([
            `"${sub.id}"`,
            '"Subcategory"',
            `"${sub.name.replace(/"/g, '""')}"`,
            `"${cat.name.replace(/"/g, '""')}"`,
            `"${sub.status}"`,
            `"${sub.order}"`
          ].join(','));

          if (sub.children && sub.children.length > 0) {
            sub.children.forEach((child) => {
              rows.push([
                `"${child.id}"`,
                '"Sub-subcategory"',
                `"${child.name.replace(/"/g, '""')}"`,
                `"${sub.name.replace(/"/g, '""')}"`,
                `"${child.status}"`,
                `"${child.order}"`
              ].join(','));
            });
          }
        });
      }
    });

    const csvString = rows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `shippnex_categories_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter Categories by Search & Status
  const filteredTreeData = treeData.filter(cat => {
    const matchesSearch = cat.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || cat.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-5 animate-fadeIn relative">
      {/* Top Breadcrumb & Title */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {activeCategoryTab === 'subcategories' ? 'Sub Categories Management' : 'Category Management'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {activeCategoryTab === 'subcategories' 
              ? 'View, organize and manage all store subcategories and sub-subcategories' 
              : 'View and manage main store taxonomy structure'}
          </p>
        </div>
        
        {/* Category Mode Switcher Pills */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button 
            onClick={() => setActiveCategoryTab('all')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg border-none cursor-pointer transition-all ${
              activeCategoryTab === 'all' 
                ? 'bg-[#002625] text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Categories
          </button>
          <button 
            onClick={() => setActiveCategoryTab('subcategories')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg border-none cursor-pointer transition-all ${
              activeCategoryTab === 'subcategories' 
                ? 'bg-[#ff5500] text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sub Categories
          </button>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header Bar matching Light Orange Theme */}
        <div className="bg-[#fff4ed] border-b border-orange-200/70 text-[#002625] px-6 py-4 flex items-center justify-between">
          <h2 className="text-base font-bold tracking-tight text-[#002625] flex items-center gap-2">
            <ChevronRight size={18} className="text-[#ff5500]" />
            Category Management
          </h2>
          <span className="text-[10px] uppercase font-extrabold tracking-wider bg-[#ff5500] text-white px-3 py-1 rounded-full shadow-2xs">
            Taxonomy Structure ({treeData.length} Root Categories)
          </span>
        </div>

        {/* Toolbar & Controls */}
        <div className="p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              {/* Add Category / Subcategory Button depending on mode */}
              {activeCategoryTab === 'subcategories' ? (
                <button 
                  onClick={() => openAddSubcategoryModal(treeData[0] || { id: 'cat-1', name: 'General Category' })}
                  className="px-4 py-2 bg-[#ff5500] hover:bg-[#e04a00] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 border-none cursor-pointer shadow-xs transition-all active:scale-95"
                >
                  <Plus size={15} /> Add Subcategory
                </button>
              ) : (
                <button 
                  onClick={openAddCategoryModal}
                  className="px-4 py-2 bg-[#ff5500] hover:bg-[#e04a00] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 border-none cursor-pointer shadow-xs transition-all active:scale-95"
                >
                  <Plus size={15} /> Add Category
                </button>
              )}

              {/* View Toggle (Tree View / List View) */}
              <div className="inline-flex rounded-xl border border-slate-200 p-0.5 bg-slate-50">
                <button 
                  onClick={() => setViewMode('tree')}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all border-none cursor-pointer ${
                    viewMode === 'tree' ? 'bg-[#002625] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tree View
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all border-none cursor-pointer ${
                    viewMode === 'list' ? 'bg-[#002625] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  List View
                </button>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <span>Status:</span>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-slate-200 rounded-xl px-3 py-1.5 bg-slate-50 text-xs font-semibold text-slate-800 outline-none focus:border-[#ff5500]"
                >
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>

              {/* Search Bar */}
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <span>Search:</span>
                <input 
                  type="text" 
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 border border-slate-200 rounded-xl px-3.5 py-1.5 bg-slate-50 text-xs text-slate-800 outline-none focus:border-[#ff5500]"
                />
              </div>
            </div>

            {/* Export Button - ShippNex Dark Teal */}
            <button 
              onClick={handleExportCSV}
              className="px-4 py-2 bg-[#002625] hover:bg-[#003837] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 border-none cursor-pointer shadow-xs transition-all active:scale-95"
            >
              <Download size={14} className="text-[#ff5500]" /> Export CSV
            </button>
          </div>

          {/* Expand / Collapse All Controls */}
          {viewMode === 'tree' && (
            <div className="flex items-center gap-2 pt-1">
              <button 
                onClick={handleExpandAll}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 cursor-pointer transition-all active:scale-95"
              >
                Expand All
              </button>
              <button 
                onClick={handleCollapseAll}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 cursor-pointer transition-all active:scale-95"
              >
                Collapse All
              </button>
            </div>
          )}

          {/* Categories Tree View Content */}
          {viewMode === 'tree' ? (
            <div className="space-y-4 pt-2">
              {activeCategoryTab === 'subcategories' ? (
                /* Flat Subcategories View Mode */
                filteredTreeData.flatMap(cat => 
                  (cat.subcategories || []).map(sub => ({ ...sub, parentName: cat.name, parentId: cat.id }))
                ).map((sub) => (
                  <div key={sub.id} className="space-y-3">
                    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center justify-between hover:border-slate-300 transition-all">
                      <div className="flex items-center gap-3">
                        {sub.children && sub.children.length > 0 ? (
                          <button 
                            onClick={() => toggleExpand(sub.id)}
                            className="text-[#ff5500] hover:text-[#e04a00] cursor-pointer bg-transparent border-none p-1"
                          >
                            {expanded[sub.id] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                          </button>
                        ) : (
                          <span className="w-5" />
                        )}
                        <img src={sub.image} alt={sub.name} className="w-12 h-12 rounded-xl object-cover border border-slate-100 shadow-2xs" />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-slate-900">{sub.name}</h3>
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-medium rounded-md">
                              Parent Category: <span className="font-semibold text-[#002625]">{sub.parentName}</span>
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                            <span className={`px-2 py-0.5 font-semibold rounded-full border ${
                              sub.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}>
                              {sub.status}
                            </span>
                            {sub.children && sub.children.length > 0 && (
                              <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 font-semibold rounded-full border border-amber-200">
                                {sub.children.length} sub-subcategories
                              </span>
                            )}
                            <span className="text-slate-400">Order: {sub.order}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => openAddNestedSubcategoryModal(sub)}
                          className="px-3.5 py-1.5 bg-[#ff5500] hover:bg-[#e04a00] text-white text-xs font-bold rounded-lg flex items-center gap-1 border-none cursor-pointer shadow-2xs transition-transform active:scale-95"
                        >
                          <Plus size={13} /> Add Sub-subcategory
                        </button>
                        <button 
                          onClick={() => handleToggleStatus(sub.id)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg border-none cursor-pointer transition-colors ${
                            sub.status === 'Active' ? 'bg-amber-100 hover:bg-amber-200 text-amber-800' : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                          }`}
                        >
                          {sub.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button 
                          onClick={() => handleDeleteItem(sub.id)}
                          className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg border-none cursor-pointer transition-colors"
                          title="Delete Subcategory"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    {expanded[sub.id] && sub.children && sub.children.length > 0 && (
                      <div className="ml-6 border-l-2 border-[#ff5500]/60 pl-4 space-y-2">
                        {sub.children.map((child) => (
                          <div key={child.id} className="bg-slate-50/70 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <ChevronRight size={14} className="text-[#ff5500]" />
                              <img src={child.image} alt={child.name} className="w-9 h-9 rounded-lg object-cover border border-slate-200" />
                              <div>
                                <div className="flex items-center gap-2">
                                  <h5 className="text-xs font-bold text-slate-900">{child.name}</h5>
                                  <span className="px-1.5 py-0.2 bg-amber-50 text-amber-700 text-[10px] font-bold rounded border border-amber-200">Sub-subcategory</span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                                  <span className={`px-1 py-0.2 font-semibold rounded border ${child.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                                    {child.status}
                                  </span>
                                  <span>Order: {child.order}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button onClick={() => handleToggleStatus(child.id)} className="p-1.5 bg-amber-500/20 text-amber-700 hover:bg-amber-500/30 rounded-md border-none cursor-pointer text-xs font-bold px-2">×</button>
                              <button onClick={() => handleDeleteItem(child.id)} className="p-1.5 bg-rose-100 hover:bg-rose-200 text-rose-600 rounded-md border-none cursor-pointer"><Trash2 size={13} /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                /* Standard Root Category Tree View */
                filteredTreeData.map((cat) => (
                  <div key={cat.id} className="space-y-3">
                    <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs flex items-center justify-between hover:border-slate-300 transition-all">
                      <div className="flex items-center gap-3">
                        <button onClick={() => toggleExpand(cat.id)} className="text-slate-400 hover:text-slate-600 cursor-pointer bg-transparent border-none p-1">
                          {expanded[cat.id] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </button>
                        <img src={cat.image} alt={cat.name} className="w-12 h-12 rounded-xl object-cover border border-slate-100 shadow-2xs" />
                        <div className="space-y-1">
                          <h3 className="text-sm font-bold text-slate-900">{cat.name}</h3>
                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                            <span className={`px-2 py-0.5 font-semibold rounded-full border ${cat.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                              {cat.status}
                            </span>
                            {(cat.subcategories ? cat.subcategories.length : 0) > 0 && (
                              <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 font-semibold rounded-full border border-amber-200">
                                {cat.subcategories.length} subcategories
                              </span>
                            )}
                            <span className="text-slate-400">Order: {cat.order}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => openAddSubcategoryModal(cat)} className="px-3.5 py-1.5 bg-[#ff5500] hover:bg-[#e04a00] text-white text-xs font-bold rounded-lg flex items-center gap-1 border-none cursor-pointer shadow-2xs transition-transform active:scale-95">
                          <Plus size={13} /> Add Subcategory
                        </button>
                        <button onClick={() => openEditCategoryModal(cat)} className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg flex items-center gap-1 border border-blue-200 cursor-pointer transition-colors" title="Edit Category">
                          <Pencil size={13} /> Edit
                        </button>
                        <button onClick={() => handleToggleStatus(cat.id, cat.status)} className={`px-3 py-1.5 text-xs font-bold rounded-lg border-none cursor-pointer transition-colors ${cat.status === 'Active' ? 'bg-amber-100 hover:bg-amber-200 text-amber-800' : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'}`}>
                          {cat.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button onClick={() => handleDeleteItem(cat.id)} className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg border-none cursor-pointer transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </div>
                    {expanded[cat.id] && cat.subcategories && cat.subcategories.length > 0 && (
                      <div className="ml-6 border-l-2 border-[#ff5500]/60 pl-4 space-y-3">
                        {cat.subcategories.map((sub) => (
                          <div key={sub.id} className="space-y-3">
                            <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-3 flex items-center justify-between hover:bg-slate-100/70 transition-all">
                              <div className="flex items-center gap-3">
                                <span className="w-5" />
                                <img src={sub.image} alt={sub.name} className="w-10 h-10 rounded-lg object-cover border border-slate-200" />
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-xs font-bold text-slate-900">{sub.name}</h4>
                                    <span className="px-2 py-0.2 bg-amber-50 text-amber-700 text-[10px] font-bold rounded border border-amber-200">Subcategory</span>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500">
                                    <span className={`px-1.5 py-0.2 font-semibold rounded border ${sub.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                                      {sub.status}
                                    </span>
                                    <span>Order: {sub.order}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <button onClick={() => handleToggleStatus(sub.id, sub.status)} className="p-1.5 bg-amber-500/20 text-amber-700 hover:bg-amber-500/30 rounded-md border-none cursor-pointer text-xs font-bold px-2">×</button>
                                <button onClick={() => handleDeleteItem(sub.id)} className="p-1.5 bg-rose-100 hover:bg-rose-200 text-rose-600 rounded-md border-none cursor-pointer"><Trash2 size={13} /></button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          ) : (
            /* List View Table Fallback */
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                    <th className="py-3 px-4">Category Name</th>
                    <th className="py-3 px-4">Header</th>
                    <th className="py-3 px-4">Sub Categories</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredTreeData.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">{c.name}</td>
                      <td className="py-3 px-4 text-slate-600">{c.header}</td>
                      <td className="py-3 px-4 font-mono font-bold text-[#ff5500]">{c.subcategories ? c.subcategories.length : 0}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${c.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEditCategoryModal(c)} className="text-xs text-blue-600 font-semibold hover:underline border-none bg-transparent cursor-pointer flex items-center gap-1">
                            <Pencil size={12} /> Edit
                          </button>
                          <button onClick={() => handleDeleteItem(c.id)} className="text-xs text-rose-600 font-semibold hover:underline border-none bg-transparent cursor-pointer">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Modal for Add Category / Add Subcategory */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-fadeIn">
            {/* Modal Header */}
            <div className="bg-[#002625] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                {editingItem ? <Pencil size={16} className="text-[#ff5500]" /> : <Plus size={16} className="text-[#ff5500]" />}
                {editingItem
                  ? 'Edit Root Category'
                  : addModalType === 'category'
                  ? 'Create New Root Category'
                  : addModalType === 'subcategory'
                  ? 'Create New Subcategory'
                  : 'Create New Sub-subcategory'}
              </h3>
              <button 
                onClick={() => { setIsAddModalOpen(false); setEditingItem(null); }}
                className="text-slate-400 hover:text-white border-none bg-transparent cursor-pointer text-lg font-bold"
              >
                ×
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveItem} className="p-6 space-y-4">
              {/* Parent Category Banner Indicator */}
              {selectedParentName && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2 flex items-center justify-between text-xs">
                  <span className="text-amber-800 font-semibold">Under Parent Category:</span>
                  <span className="font-bold text-[#002625] bg-white px-2.5 py-0.5 rounded-lg border border-amber-300 shadow-2xs">
                    📁 {selectedParentName}
                  </span>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {addModalType === 'category' 
                    ? 'Category Name *' 
                    : addModalType === 'subcategory' 
                    ? 'Subcategory Name *' 
                    : 'Sub-subcategory Name *'}
                </label>
                <input 
                  type="text" 
                  required
                  placeholder={
                    addModalType === 'category' 
                      ? 'e.g., Fruits & Vegetables' 
                      : addModalType === 'subcategory' 
                      ? 'e.g., Banana'
                      : 'e.g., Cavendish Banana / Robusta Banana'
                  }
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-[#ff5500]"
                />
              </div>

              {/* Category Image Device Upload Field */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Category Image (Upload Device File) *</label>
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-2">
                  {formData.imageUrl ? (
                    <img 
                      src={formData.imageUrl} 
                      alt="Category Preview" 
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs shrink-0" 
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-slate-400 shrink-0">
                      <Upload size={18} />
                    </div>
                  )}

                  <div className="flex-1 overflow-hidden">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleCategoryImageUpload}
                      className="text-xs text-slate-600 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#ff5500] file:text-white hover:file:bg-[#e04a00] file:cursor-pointer cursor-pointer"
                    />
                    {uploadingImage && <p className="text-[10px] text-[#ff5500] font-bold mt-1">Uploading image...</p>}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Status</label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-[#ff5500]"
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Sort Order</label>
                <input 
                  type="number" 
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-[#ff5500]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button 
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); setEditingItem(null); }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border-none cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-[#ff5500] hover:bg-[#e04a00] text-white text-xs font-bold rounded-xl border-none cursor-pointer shadow-sm transition-all"
                >
                  {editingItem ? 'Update Category' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   6. PRODUCT MANAGEMENT PAGE (VIEW STOCK MANAGEMENT)
   ========================================================================= */
export const ProductManagement = () => {
  const { setActiveTab, setEditingProductData } = useAdmin();
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [viewModalData, setViewModalData] = React.useState(null);

  const fetchAllProducts = React.useCallback(async () => {
    setLoading(true);
    let apiProducts = [];
    try {
      const res = await productService.getProducts();
      if (res && res.products && Array.isArray(res.products)) {
        apiProducts = res.products;
      }
    } catch (err) {
      console.warn('Error fetching products from API:', err.message);
    }

    const localSaved = JSON.parse(localStorage.getItem('shippnex_custom_products') || '[]');

    const defaultMock = [
      { id: '5e17-0', name: 'Pyaaj', seller: 'Keshari Vagitl Shope', category: 'Groceries & Grains', image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=100&auto=format&fit=crop&q=80', variation: '1kg', stock: 40, status: 'Published' },
      { id: '5d01-0', name: 'Aalu', seller: 'Keshari Vagitl Shope', category: 'Groceries & Grains', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=100&auto=format&fit=crop&q=80', variation: '1 kg', stock: 1000, status: 'Published' },
      { id: '3c8e-0', name: 'Khira', seller: 'Keshari Vagitl Shope', category: 'Groceries & Grains', image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=100&auto=format&fit=crop&q=80', variation: '1 kg', stock: 100, status: 'Published' },
      { id: '2f5f-0', name: 'Tamatar', seller: 'Keshari Vagitl Shope', category: 'Groceries & Grains', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=100&auto=format&fit=crop&q=80', variation: '1 kg', stock: 500, status: 'Published' }
    ];

    // 1. Convert API products from MongoDB as primary source of truth
    const combined = apiProducts.map(ap => ({
      _id: ap._id,
      id: ap._id,
      sku: ap.sku || `SKU-${ap._id.slice(-4).toUpperCase()}`,
      name: ap.name,
      seller: ap.seller || 'ShippNex Official Store',
      category: ap.category || 'Groceries & Grains',
      subCategory: ap.subCategory,
      brand: ap.brand,
      image: ap.mainImage || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100&auto=format&fit=crop&q=80',
      galleryImages: ap.galleryImages || [],
      variation: ap.unit || `${ap.unitValue || 1} ${ap.unitType || 'kg'}`,
      unitValue: ap.unitValue,
      unitType: ap.unitType,
      stock: ap.stock !== undefined ? ap.stock : 100,
      minStockLimit: ap.minStockLimit,
      status: ap.status || 'Published',
      mrp: ap.mrp,
      salePrice: ap.salePrice,
      taxRate: ap.taxRate,
      hsnCode: ap.hsnCode,
      homeSections: ap.homeSections || []
    }));

    // 2. Add local storage items only if they are not already in MongoDB
    localSaved.forEach(localItem => {
      const matchExists = combined.some(c => 
        (c._id && localItem._id && c._id === localItem._id) || 
        (c.name.trim().toLowerCase() === localItem.name.trim().toLowerCase())
      );
      if (!matchExists) {
        combined.push(localItem);
      }
    });

    defaultMock.forEach(dm => {
      if (!combined.some(c => c.id === dm.id || c.name === dm.name)) {
        combined.push(dm);
      }
    });

    setProducts(combined);
    setLoading(false);
  }, []);

  const [categories, setCategories] = React.useState([]);

  React.useEffect(() => {
    fetchAllProducts();
    const fetchCats = async () => {
      try {
        const res = await categoryService.getCategories();
        if (res.success) setCategories(res.categories.filter(c => c.status === 'Active'));
      } catch (err) {}
    };
    fetchCats();
  }, [fetchAllProducts]);

  const [categoryFilter, setCategoryFilter] = React.useState('All Category');
  const [sellerFilter, setSellerFilter] = React.useState('All Sellers');
  const [statusFilter, setStatusFilter] = React.useState('All Products');
  const [stockFilter, setStockFilter] = React.useState('All Products');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [entriesPerPage, setEntriesPerPage] = React.useState('10');
  const [currentPage, setCurrentPage] = React.useState(1);

  // Edit / Delete Actions
  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product stock item?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
      const localSaved = JSON.parse(localStorage.getItem('shippnex_custom_products') || '[]');
      const updatedLocal = localSaved.filter(p => p.id !== id);
      localStorage.setItem('shippnex_custom_products', JSON.stringify(updatedLocal));
    }
  };

  const handleEditProduct = (prod) => {
    setEditingProductData(prod);
    setActiveTab('add_product');
  };

  // CSV Export
  const handleExportCSV = () => {
    const rows = [['Variation ID', 'Name', 'Seller', 'Variation', 'Stock', 'Status'].join(',')];
    products.forEach(p => {
      rows.push([`"${p.id}"`, `"${p.name}"`, `"${p.seller}"`, `"${p.variation}"`, `"${p.stock}"`, `"${p.status}"`].join(','));
    });
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `shippnex_stock_export_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  // Filtering Logic
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.seller.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All Category' || p.category === categoryFilter;
    const matchesSeller = sellerFilter === 'All Sellers' || p.seller === sellerFilter;
    const matchesStatus = statusFilter === 'All Products' || p.status === statusFilter;
    const matchesStock = stockFilter === 'All Products' || (stockFilter === 'In Stock' ? p.stock > 0 : p.stock === 0);
    return matchesSearch && matchesCategory && matchesSeller && matchesStatus && matchesStock;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header & Breadcrumb */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Products & Stock</h1>
          <div className="text-xs text-slate-500 font-medium">
            Dashboard / <span className="text-[#ff5500] font-semibold">Stock Management</span>
          </div>
        </div>
        <button 
          onClick={() => { setEditingProductData(null); setActiveTab('add_product'); }}
          className="px-4 py-2.5 bg-[#ff5500] hover:bg-[#e04a00] text-white text-xs font-bold rounded-xl border-none cursor-pointer flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
        >
          <Plus size={16} /> Add New Product
        </button>
      </div>

      {/* View Stock Management Container Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Header Bar matching Light Orange Theme */}
        <div className="bg-[#fff4ed] border-b border-orange-200/70 text-[#002625] px-6 py-4 flex items-center justify-between">
          <h2 className="text-base font-bold tracking-tight text-[#002625] flex items-center gap-2">
            <ChevronRight size={18} className="text-[#ff5500]" />
            View Stock Management
          </h2>
          <span className="text-[10px] uppercase font-extrabold tracking-wider bg-[#ff5500] text-white px-3 py-1 rounded-full shadow-2xs">
            {products.length} Products Listed
          </span>
        </div>

        <div className="p-6 space-y-5">
          {/* Top Filter Rows */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Filter By Category</label>
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full border border-slate-300 rounded-md px-3.5 py-2.5 bg-slate-50/60 text-xs font-medium text-slate-800 outline-none focus:border-[#ff5500] focus:bg-white transition-all shadow-2xs"
              >
                <option value="All Category">All Category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Filter by Sellers</label>
              <select 
                value={sellerFilter}
                onChange={(e) => setSellerFilter(e.target.value)}
                className="w-full border border-slate-300 rounded-md px-3.5 py-2.5 bg-slate-50/60 text-xs font-medium text-slate-800 outline-none focus:border-[#ff5500] focus:bg-white transition-all shadow-2xs"
              >
                <option>All Sellers</option>
                <option>Keshari Vagitl Shope</option>
                <option>SuperStore Retailers</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Filter by Status</label>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-slate-300 rounded-md px-3.5 py-2.5 bg-slate-50/60 text-xs font-medium text-slate-800 outline-none focus:border-[#ff5500] focus:bg-white transition-all shadow-2xs"
              >
                <option>All Products</option>
                <option>Published</option>
                <option>Draft</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Filter by Stock</label>
              <select 
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="w-full border border-slate-300 rounded-md px-3.5 py-2.5 bg-slate-50/60 text-xs font-medium text-slate-800 outline-none focus:border-[#ff5500] focus:bg-white transition-all shadow-2xs"
              >
                <option>All Products</option>
                <option>In Stock</option>
                <option>Out of Stock</option>
              </select>
            </div>
          </div>

          {/* Sub Controls: Show entries, Export, Search */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs font-medium text-slate-600">
            <div className="flex items-center gap-2">
              <span>Show</span>
              <select 
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(e.target.value)}
                className="border border-slate-200 rounded-xl px-2.5 py-1.5 bg-slate-50 text-xs text-slate-800 outline-none focus:border-[#ff5500]"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
              <span>entries</span>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={handleExportCSV}
                className="px-4 py-1.5 bg-[#002625] hover:bg-[#003837] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 border-none cursor-pointer shadow-2xs transition-all active:scale-95"
              >
                <Download size={13} className="text-[#ff5500]" /> Export
              </button>

              <div className="flex items-center gap-1.5">
                <span>Search:</span>
                <input 
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-44 border border-slate-200 rounded-xl px-3 py-1.5 bg-slate-50 text-xs text-slate-800 outline-none focus:border-[#ff5500]"
                />
              </div>
            </div>
          </div>

          {/* Stock Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4">Variation Id ⇅</th>
                  <th className="py-3.5 px-4">Name ⇅</th>
                  <th className="py-3.5 px-4">Seller ⇅</th>
                  <th className="py-3.5 px-4">Image ⇅</th>
                  <th className="py-3.5 px-4">Variation ⇅</th>
                  <th className="py-3.5 px-4">Stock ⇅</th>
                  <th className="py-3.5 px-4">Status ⇅</th>
                  <th className="py-3.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-500">{prod.sku || prod.id}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{prod.name}</td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">{prod.seller}</td>
                      <td className="py-3.5 px-4">
                        <img 
                          src={prod.image} 
                          alt={prod.name} 
                          className="w-12 h-12 rounded-xl object-cover border border-slate-100 p-0.5 shadow-2xs bg-white" 
                        />
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">{prod.variation}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{prod.stock}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded-full">
                          {prod.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => setViewModalData(prod)}
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg border border-emerald-200 cursor-pointer transition-colors"
                            title="View Details"
                          >
                            <Eye size={13} />
                          </button>
                          <button 
                            onClick={() => handleEditProduct(prod)}
                            className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg border border-blue-200 cursor-pointer transition-colors"
                            title="Edit Stock"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg border border-rose-200 cursor-pointer transition-colors"
                            title="Delete Stock Item"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="py-8 text-center text-slate-400 italic text-xs">
                      No stock products found matching filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer & Pagination */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-500">
            <span>Showing 1 to {filteredProducts.length} of {products.length} entries</span>
            
            <div className="inline-flex rounded-xl border border-slate-200 p-0.5 bg-slate-50">
              <button 
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 border-none bg-transparent cursor-pointer"
              >
                ‹
              </button>
              <button className="px-3 py-1 bg-[#ff5500] text-white text-xs font-bold rounded-lg shadow-2xs border-none cursor-pointer">
                {currentPage}
              </button>
              <button 
                onClick={() => setCurrentPage(p => p + 1)}
                className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 border-none bg-transparent cursor-pointer"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Modal */}
      {viewModalData && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl animate-scaleUp border border-slate-100 relative">
            <button 
              onClick={() => setViewModalData(null)}
              className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 cursor-pointer border-none"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold text-slate-900 mb-4 border-b pb-3 border-slate-100">Product Details</h3>
            
            <div className="flex gap-4 items-start mb-4">
              <img 
                src={viewModalData.image} 
                alt={viewModalData.name} 
                className="w-24 h-24 rounded-2xl object-cover border border-slate-200 shadow-sm"
              />
              <div>
                <h4 className="text-base font-bold text-slate-900 m-0 leading-tight">{viewModalData.name}</h4>
                <p className="text-xs text-slate-500 m-0 mt-1">{viewModalData.seller}</p>
                <div className="mt-2 inline-block px-2.5 py-0.5 bg-[#fff4ed] text-[#ff5500] border border-[#ffcfb3] text-xs font-bold rounded-full">
                  {viewModalData.status}
                </div>
              </div>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500 font-medium">Category:</span>
                <span className="text-slate-900 font-semibold">{viewModalData.category}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500 font-medium">Sub Category:</span>
                <span className="text-slate-900 font-semibold">{viewModalData.subCategory || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500 font-medium">Variation:</span>
                <span className="text-slate-900 font-semibold">{viewModalData.variation}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500 font-medium">Stock:</span>
                <span className="text-slate-900 font-semibold">{viewModalData.stock}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500 font-medium">MRP:</span>
                <span className="text-slate-400 font-semibold line-through">₹{viewModalData.mrp || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Sale Price:</span>
                <span className="text-[#ff5500] font-bold text-base">₹{viewModalData.salePrice || 0}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   7. ORDERS PAGE
   ========================================================================= */
export const OrderManagement = () => {
  const { activeTab } = useAdmin();
  const [search, setSearch] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Map activeTab sub-item to status filter
  const getTabTitleAndFilter = () => {
    switch (activeTab) {
      case 'orders_pending':
        return { title: 'Pending Orders', filter: 'Pending' };
      case 'orders_received':
        return { title: 'Received Orders', filter: 'Processing' };
      case 'orders_processed':
        return { title: 'Processed Orders', filter: 'Processed' };
      case 'orders_shipped':
        return { title: 'Shipped Orders', filter: 'Dispatched' };
      case 'orders_out_for_delivery':
        return { title: 'Out for Delivery Orders', filter: 'In Transit' };
      case 'orders_delivered':
        return { title: 'Delivered Orders', filter: 'Delivered' };
      case 'orders_cancelled':
        return { title: 'Cancelled Orders', filter: 'Cancelled' };
      case 'orders_return':
        return { title: 'Returned Orders', filter: 'Return' };
      case 'orders_all':
      default:
        return { title: 'All Orders List', filter: 'All' };
    }
  };

  const { title: pageTitle, filter: statusFilter } = getTabTitleAndFilter();

  const filteredOrders = mockOrders.filter(o => {
    const matchesStatus = statusFilter === 'All' || o.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch = 
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.seller.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredOrders.length / entriesPerPage) || 1;
  const indexOfLastItem = currentPage * entriesPerPage;
  const indexOfFirstItem = indexOfLastItem - entriesPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Order ID,Customer,Seller,Warehouse,Total,Status,Date"].concat(
        filteredOrders.map(o => `"${o.id}","${o.customer}","${o.seller}","${o.warehouse}","${o.total}","${o.status}","${o.date}"`)
      ).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `orders_export_${statusFilter.toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{pageTitle}</h2>
          <p className="text-xs text-slate-500">Monitor order lifecycle, seller fulfillment, and dispatch states</p>
        </div>
        <button 
          onClick={handleExport}
          className="px-3.5 py-2 bg-[#ff661a] hover:bg-[#e65200] text-white text-xs font-bold rounded-xl transition-all border-none cursor-pointer flex items-center gap-1.5 shadow-sm"
        >
          <Download size={14} /> Export Orders
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 font-semibold focus:outline-none focus:border-[#ff661a]"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>entries</span>
          </div>

          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by Order ID, Customer..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#ff661a]"
            />
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-100 rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Seller Store</th>
                <th className="py-3 px-4">Warehouse</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {currentOrders.length > 0 ? (
                currentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#ff661a]">{o.id}</td>
                    <td className="py-3 px-4 text-slate-900 font-bold">{o.customer}</td>
                    <td className="py-3 px-4 text-slate-600">{o.seller}</td>
                    <td className="py-3 px-4 text-slate-500">{o.warehouse}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{o.total}</td>
                    <td className="py-3 px-4"><StatusBadge status={o.status} /></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400 italic text-xs">
                    No orders found matching criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs text-slate-500">
          <span>
            Showing {filteredOrders.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, filteredOrders.length)} of {filteredOrders.length} entries
          </span>

          <div className="inline-flex rounded-xl border border-slate-200 p-0.5 bg-slate-50 items-center">
            <button 
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 border-none bg-transparent cursor-pointer disabled:opacity-40"
            >
              ‹
            </button>
            <span className="px-3 py-1 bg-[#ff661a] text-white text-xs font-bold rounded-lg">
              {currentPage} of {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 border-none bg-transparent cursor-pointer disabled:opacity-40"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   8. DELIVERIES PAGE
   ========================================================================= */
export const DeliveryManagement = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Live Delivery Tracking</h2>
        <p className="text-xs text-slate-500">Captain transit timeline, OTP security status, and vehicle progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockDeliveries.map((d) => (
          <div key={d.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono text-[#ff5500] font-bold">{d.id}</span>
                <h3 className="text-base font-bold text-slate-900">Order: {d.orderId}</h3>
                <p className="text-xs text-slate-600">Captain: {d.captain}</p>
              </div>
              <StatusBadge status={d.status} />
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
              <p className="text-slate-500">From: <span className="text-slate-900">{d.pickup}</span></p>
              <p className="text-slate-500">To: <span className="text-slate-900">{d.dropoff}</span></p>
              <p className="text-slate-500">ETA: <span className="text-[#ff5500] font-bold">{d.eta}</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================================================
   9. PAYMENTS & FUND TRANSFER PAGE
   ========================================================================= */
export const PaymentManagement = () => {
  const [transfers, setTransfers] = React.useState([
    { id: 'FT-101', name: 'Vishal Patel', mobile: '9302841836', openingBalance: '₹500.00', closingBalance: '₹1500.00', amount: '₹1000.00', type: 'Credit', message: 'Weekly settlement disbursement', date: '12/09/2025' },
    { id: 'FT-102', name: 'Deepak kumar', mobile: '9031275861', openingBalance: '₹200.00', closingBalance: '₹700.00', amount: '₹500.00', type: 'Credit', message: 'Bonus cash reward', date: '12/09/2025' },
    { id: 'FT-103', name: 'Rahul sahu', mobile: '9241673736', openingBalance: '₹1200.00', closingBalance: '₹400.00', amount: '₹800.00', type: 'Debit', message: 'Cash collection deduction', date: '12/09/2025' },
  ]);

  // Filters State
  const [fromDate, setFromDate] = React.useState('2025-09-12');
  const [toDate, setToDate] = React.useState('2025-09-12');
  const [deliveryBoyFilter, setDeliveryBoyFilter] = React.useState('All Captain');
  const [methodFilter, setMethodFilter] = React.useState('All');
  const [search, setSearch] = React.useState('');
  const [perPage, setPerPage] = React.useState(10);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [sortField, setSortField] = React.useState(null);
  const [sortOrder, setSortOrder] = React.useState('asc');

  // Add Fund Transfer Modal State
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [newTransfer, setNewTransfer] = React.useState({
    deliveryBoy: 'Vishal Patel (9302841836)',
    type: 'Credit',
    amount: '',
    message: ''
  });

  // Clear Filter Handler
  const handleClearFilters = () => {
    setFromDate('');
    setToDate('');
    setDeliveryBoyFilter('All Captain');
    setMethodFilter('All');
    setSearch('');
  };

  // Sorting Handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Filter & Sort Logic
  const filteredTransfers = transfers.filter(t => {
    const matchesBoy = deliveryBoyFilter === 'All Captain' || t.name === deliveryBoyFilter;
    const matchesMethod = methodFilter === 'All' || t.type === methodFilter;
    const matchesSearch = 
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.mobile.includes(search) ||
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.message.toLowerCase().includes(search.toLowerCase());
    return matchesBoy && matchesMethod && matchesSearch;
  });

  const sortedTransfers = [...filteredTransfers].sort((a, b) => {
    if (!sortField) return 0;
    let valA = a[sortField] || '';
    let valB = b[sortField] || '';
    if (typeof valA === 'string' && valA.startsWith('₹')) {
      valA = parseFloat(valA.replace('₹', '').replace(',', '')) || 0;
      valB = parseFloat(valB.replace('₹', '').replace(',', '')) || 0;
    }
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination Math
  const totalPages = Math.ceil(sortedTransfers.length / perPage) || 1;
  const startIndex = (currentPage - 1) * perPage;
  const paginatedTransfers = sortedTransfers.slice(startIndex, startIndex + perPage);

  // CSV Export Action
  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Mobile', 'Opening Balance (₹)', 'Closing Balance (₹)', 'Amount (₹)', 'Type', 'Message', 'Date'];
    const rows = sortedTransfers.map(t => [t.id, `"${t.name}"`, t.mobile, t.openingBalance, t.closingBalance, t.amount, t.type, `"${t.message}"`, t.date]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `shippnex_fund_transfers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Add Fund Transfer Form Action
  const handleAddFundTransfer = (e) => {
    e.preventDefault();
    if (!newTransfer.amount) return;

    const [boyName, boyMobile] = newTransfer.deliveryBoy.split(' (');
    const cleanMobile = boyMobile ? boyMobile.replace(')', '') : '9302841836';
    const amountVal = parseFloat(newTransfer.amount) || 0;

    const added = {
      id: `FT-${Date.now().toString().slice(-4)}`,
      name: boyName,
      mobile: cleanMobile,
      openingBalance: '₹0.00',
      closingBalance: `₹${amountVal.toFixed(2)}`,
      amount: `₹${amountVal.toFixed(2)}`,
      type: newTransfer.type,
      message: newTransfer.message || 'Direct Fund Transfer',
      date: new Date().toLocaleDateString('en-GB')
    };

    setTransfers(prev => [added, ...prev]);
    setIsAddModalOpen(false);
    setNewTransfer({ deliveryBoy: 'Vishal Patel (9302841836)', type: 'Credit', amount: '', message: '' });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header & Breadcrumb */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Fund Transfer</h1>
        <div className="text-xs text-slate-500 font-medium">
          Dashboard / <span className="text-[#ff5500] font-semibold">View Fund Transfer</span>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Light Orange Header Banner with + Add Fund Transfer Button */}
        <div className="bg-[#fff4ed] border-b border-orange-200/70 text-[#002625] px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h2 className="text-base font-bold tracking-tight text-[#002625] flex items-center gap-2 m-0">
            <ChevronRight size={18} className="text-[#ff5500]" />
            View Fund Transfer
          </h2>

          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-[#ff5500] hover:bg-[#e04a00] text-white text-xs font-bold rounded-xl border-none cursor-pointer flex items-center gap-1.5 shadow-2xs transition-all shrink-0 active:scale-95"
          >
            <Plus size={15} /> Add Fund Transfer
          </button>
        </div>

        {/* Filter Controls Toolbar */}
        <div className="p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
            
            {/* Left Filters: From - To Date, Clear, Captain Filter, Method Filter */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                <span className="text-slate-500 font-medium">From - To Date:</span>
                <input 
                  type="date" 
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="bg-transparent text-xs text-slate-800 outline-none border-none font-medium cursor-pointer"
                />
                <span className="text-slate-400">-</span>
                <input 
                  type="date" 
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="bg-transparent text-xs text-slate-800 outline-none border-none font-medium cursor-pointer"
                />
              </div>

              <button 
                onClick={handleClearFilters}
                className="px-3.5 py-1.5 bg-slate-700 hover:bg-slate-800 text-white text-xs font-bold rounded-xl border-none cursor-pointer transition-colors"
              >
                Clear
              </button>

              <div className="flex items-center gap-2">
                <span className="text-slate-600 font-medium">Filter by Captain:</span>
                <select 
                  value={deliveryBoyFilter}
                  onChange={(e) => setDeliveryBoyFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-[#ff5500] cursor-pointer"
                >
                  <option value="All Captain">All Captain</option>
                  <option value="Vishal Patel">Vishal Patel</option>
                  <option value="Deepak kumar">Deepak kumar</option>
                  <option value="Rahul sahu">Rahul sahu</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-600 font-medium">Filter by Method:</span>
                <select 
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-[#ff5500] cursor-pointer"
                >
                  <option value="All">All</option>
                  <option value="Credit">Credit</option>
                  <option value="Debit">Debit</option>
                </select>
              </div>
            </div>

            {/* Right Controls: Per Page, Export CSV, Search */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-600 font-medium">Per Page:</span>
                <select 
                  value={perPage}
                  onChange={(e) => {
                    setPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-[#ff5500] cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <button 
                onClick={handleExportCSV}
                className="px-4 py-1.5 bg-[#ff5500] hover:bg-[#e04a00] text-white text-xs font-bold rounded-xl border-none cursor-pointer flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 shrink-0"
              >
                <Download size={14} /> Export v
              </button>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-600 font-medium">Search:</span>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-40 bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-[#ff5500]"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Table Container */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                  <th onClick={() => handleSort('id')} className="py-3.5 px-4 cursor-pointer select-none">ID ⇕</th>
                  <th onClick={() => handleSort('name')} className="py-3.5 px-4 cursor-pointer select-none">NAME ⇕</th>
                  <th onClick={() => handleSort('mobile')} className="py-3.5 px-4 cursor-pointer select-none">MOBILE ⇕</th>
                  <th onClick={() => handleSort('openingBalance')} className="py-3.5 px-4 cursor-pointer select-none">OPENING BALANCE (₹) ⇕</th>
                  <th onClick={() => handleSort('closingBalance')} className="py-3.5 px-4 cursor-pointer select-none">CLOSING BALANCE (₹) ⇕</th>
                  <th onClick={() => handleSort('amount')} className="py-3.5 px-4 cursor-pointer select-none">AMOUNT (₹) ⇕</th>
                  <th onClick={() => handleSort('type')} className="py-3.5 px-4 cursor-pointer select-none">TYPE ⇕</th>
                  <th className="py-3.5 px-4">MESSAGE ⇕</th>
                  <th onClick={() => handleSort('date')} className="py-3.5 px-4 cursor-pointer select-none">DATE ⇕</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {paginatedTransfers.length > 0 ? (
                  paginatedTransfers.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-slate-500">{t.id}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{t.name}</td>
                      <td className="py-3.5 px-4 font-mono">{t.mobile}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">{t.openingBalance}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">{t.closingBalance}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{t.amount}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          t.type === 'Credit' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-[200px] truncate" title={t.message}>{t.message}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-500">{t.date}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="py-12 text-center text-slate-400 font-medium">
                      No data available in table
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 pt-2">
            <div>
              Showing {sortedTransfers.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + perPage, sortedTransfers.length)} of {sortedTransfers.length} entries
            </div>

            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || sortedTransfers.length === 0}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer font-bold transition-all"
              >
                ‹
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold border cursor-pointer transition-all ${
                    currentPage === page 
                      ? 'bg-[#ff5500] text-white border-[#ff5500] shadow-2xs' 
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || sortedTransfers.length === 0}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer font-bold transition-all"
              >
                ›
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* ADD FUND TRANSFER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-fadeIn">
            {/* Header */}
            <div className="bg-[#fff4ed] border-b border-orange-200/70 text-[#002625] px-6 py-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-[#002625] m-0 flex items-center gap-2">
                <Plus size={18} className="text-[#ff5500]" />
                Add Fund Transfer
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-900 border-none bg-transparent cursor-pointer text-xl font-bold p-1 leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddFundTransfer} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Select Captain *</label>
                <select 
                  value={newTransfer.deliveryBoy}
                  onChange={(e) => setNewTransfer({ ...newTransfer, deliveryBoy: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-[#ff5500] bg-slate-50 cursor-pointer"
                >
                  <option value="Vishal Patel (9302841836)">Vishal Patel (9302841836)</option>
                  <option value="Deepak kumar (9031275861)">Deepak kumar (9031275861)</option>
                  <option value="Rahul sahu (9241673736)">Rahul sahu (9241673736)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Transfer Type *</label>
                  <select 
                    value={newTransfer.type}
                    onChange={(e) => setNewTransfer({ ...newTransfer, type: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 outline-none focus:border-[#ff5500] bg-slate-50 cursor-pointer"
                  >
                    <option value="Credit">Credit (Add)</option>
                    <option value="Debit">Debit (Deduct)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Amount (₹) *</label>
                  <input 
                    type="number" 
                    required
                    placeholder="0.00"
                    value={newTransfer.amount}
                    onChange={(e) => setNewTransfer({ ...newTransfer, amount: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-[#ff5500]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Message / Remark</label>
                <textarea 
                  rows="3"
                  placeholder="Reason for transfer..."
                  value={newTransfer.message}
                  onChange={(e) => setNewTransfer({ ...newTransfer, message: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none focus:border-[#ff5500] resize-none"
                ></textarea>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border-none cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 bg-[#ff5500] hover:bg-[#e04a00] text-white text-xs font-bold rounded-xl border-none cursor-pointer shadow-2xs transition-all active:scale-95"
                >
                  Transfer Funds
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   9.5. ADMIN WALLET & FINANCE PAGE
   ========================================================================= */
export const AdminWalletFinance = () => {
  const [activeTab, setActiveTab] = React.useState('all_transactions');
  const [userFilter, setUserFilter] = React.useState('All Users');
  const [typeFilter, setTypeFilter] = React.useState('All Types');
  const [search, setSearch] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  // Dynamic Data States
  const [summary, setSummary] = React.useState({
    totalCommissionEarned: 0,
    totalSettledAmount: 0,
    totalTransactions: 0,
  });
  const [settlements, setSettlements] = React.useState([]);
  const [withdrawals, setWithdrawals] = React.useState([]);

  // Fetch Live Data from Backend API
  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [settlementsRes, withdrawalsRes] = await Promise.all([
        walletService.getAdminSettlements().catch(err => {
          console.warn('Failed to fetch settlements:', err.message);
          return { summary: {}, settlements: [] };
        }),
        walletService.getAdminWithdrawals().catch(err => {
          console.warn('Failed to fetch withdrawals:', err.message);
          return { withdrawals: [] };
        }),
      ]);

      if (settlementsRes.success !== false) {
        setSummary(settlementsRes.summary || { totalCommissionEarned: 0, totalSettledAmount: 0, totalTransactions: 0 });
        setSettlements(settlementsRes.settlements || []);
      }

      if (withdrawalsRes.success !== false) {
        setWithdrawals(withdrawalsRes.withdrawals || []);
      }
    } catch (err) {
      console.error('Error fetching admin wallet data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Action Handler: Update Withdrawal Status (Approve / Reject / Complete)
  const handleUpdateWithdrawalStatus = async (id, newStatus) => {
    const remarkPrompt = newStatus === 'REJECTED' 
      ? prompt('Enter rejection reason / remark (Seller will be refunded automatically):', 'Rejected by Admin')
      : prompt('Enter optional admin remark / payment reference:', 'Processed by Admin');

    if (remarkPrompt === null) return; // User cancelled prompt

    try {
      const res = await walletService.updateWithdrawalStatus(id, newStatus, remarkPrompt);
      if (res.success) {
        alert(res.message || `Withdrawal request status updated to ${newStatus}`);
        fetchData(); // Refresh live data
      } else {
        alert(res.message || 'Failed to update withdrawal status');
      }
    } catch (err) {
      alert(`Error updating status: ${err.message}`);
    }
  };

  // Calculate dynamic metrics
  const totalPendingWithdrawalsAmt = withdrawals
    .filter(w => (w.status || '').toUpperCase() === 'PENDING')
    .reduce((acc, w) => acc + (w.amount || 0), 0);

  const totalCompletedWithdrawalsAmt = withdrawals
    .filter(w => ['APPROVED', 'COMPLETED', 'Approved', 'Completed'].includes(w.status))
    .reduce((acc, w) => acc + (w.amount || 0), 0);

  const pendingWithdrawalsCount = withdrawals.filter(w => (w.status || '').toUpperCase() === 'PENDING').length;

  // Filtered Transactions List
  const filteredSettlements = settlements.filter(s => {
    const matchesSearch = 
      (s.sellerName || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.orderId || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.paymentMethod || '').toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  // Filtered Withdrawals List
  const filteredWithdrawals = withdrawals.filter(w => {
    const statusUpper = (w.status || '').toUpperCase();
    const filterUpper = typeFilter.toUpperCase();
    
    const matchesStatus = 
      typeFilter === 'All Types' || 
      typeFilter === 'All' || 
      statusUpper === filterUpper;

    const matchesSearch = 
      (w.sellerName || '').toLowerCase().includes(search.toLowerCase()) ||
      (w.withdrawalId || '').toLowerCase().includes(search.toLowerCase()) ||
      (w.bankDetails?.bankName || '').toLowerCase().includes(search.toLowerCase()) ||
      (w.bankDetails?.accountNumber || '').toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Page Title & Refresh */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight m-0">Admin Wallet & Finance</h1>
          <p className="text-xs text-slate-500 font-medium mt-1 m-0">
            Manage settlements, track commission earnings, and process seller withdrawal payouts.
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center gap-1.5 shadow-2xs"
        >
          <svg className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21.5 2v6h-6M2.5 22v-6h6"/><path d="M2 11.5a10 10 0 0 1 18.8-4.3L21.5 8M22 12.5a10 10 0 0 1-18.8 4.2L2.5 16"/></svg>
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {/* Top Metrics Grid (Dynamic Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        
        {/* Card 1: Settled Admin Commission */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition-all space-y-1.5 relative">
          <div className="flex justify-between items-center">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
              ₹
            </div>
            <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              LIVE DATA <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500 block leading-none">Settled Admin Commission</span>
            <h2 className="text-lg font-extrabold text-purple-600 tracking-tight m-0 mt-1">
              ₹{Number(summary.settledCommissionEarned || 0).toFixed(2)}
            </h2>
          </div>
          <p className="text-[10px] text-slate-400 font-medium pt-1 border-t border-slate-100 m-0 leading-none">Finalized revenue from delivered orders</p>
        </div>

        {/* Card 2: Pending Admin Commission */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition-all space-y-1.5 relative">
          <div className="flex justify-between items-center">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
              ₹
            </div>
            <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              LIVE DATA <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            </div>
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500 block leading-none">Pending Admin Commission</span>
            <h2 className="text-lg font-extrabold text-amber-600 tracking-tight m-0 mt-1">
              ₹{Number(summary.pendingAdminCommission || 0).toFixed(2)}
            </h2>
          </div>
          <p className="text-[10px] text-slate-400 font-medium pt-1 border-t border-slate-100 m-0 leading-none">Projected revenue from in-transit orders</p>
        </div>

        {/* Card 3: Total Settled to Sellers */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition-all space-y-1.5 relative">
          <div className="flex justify-between items-center">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            </div>
            <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              LIVE DATA <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500 block leading-none">Total Net Settled to Sellers</span>
            <h2 className="text-lg font-extrabold text-emerald-600 tracking-tight m-0 mt-1">
              ₹{Number(summary.totalSettledAmount || 0).toFixed(2)}
            </h2>
          </div>
          <p className="text-[10px] text-slate-400 font-medium pt-1 border-t border-slate-100 m-0 leading-none">Credited into seller available wallets</p>
        </div>

        {/* Card 4: Pending Seller Amount */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition-all space-y-1.5 relative">
          <div className="flex justify-between items-center">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock size={16} />
            </div>
            <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              LIVE DATA <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            </div>
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500 block leading-none">Pending Seller Balances</span>
            <h2 className="text-lg font-extrabold text-blue-600 tracking-tight m-0 mt-1">
              ₹{Number(summary.pendingSellerAmount || 0).toFixed(2)}
            </h2>
          </div>
          <p className="text-[10px] text-slate-400 font-medium pt-1 border-t border-slate-100 m-0 leading-none">Owed to sellers upon delivery</p>
        </div>

        {/* Card 5: Pending Withdrawal Requests */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition-all space-y-1.5 relative">
          <div className="flex justify-between items-center">
            <div className="w-8 h-8 rounded-lg bg-[#fff4ed] text-[#ff5500] flex items-center justify-center">
              <Store size={16} />
            </div>
            <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              LIVE DATA <span className="w-1.5 h-1.5 rounded-full bg-[#ff5500] animate-pulse"></span>
            </div>
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500 block leading-none">Pending Withdrawal Requests</span>
            <h2 className="text-lg font-extrabold text-[#ff5500] tracking-tight m-0 mt-1">
              ₹{totalPendingWithdrawalsAmt.toFixed(2)}
            </h2>
          </div>
          <p className="text-[10px] text-slate-400 font-medium pt-1 border-t border-slate-100 m-0 leading-none">{pendingWithdrawalsCount} pending payout request(s)</p>
        </div>

        {/* Card 6: Total Completed Bank Payouts */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition-all space-y-1.5 relative">
          <div className="flex justify-between items-center">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileText size={16} />
            </div>
            <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              LIVE DATA <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500 block leading-none">Completed Bank Payouts</span>
            <h2 className="text-lg font-extrabold text-indigo-600 tracking-tight m-0 mt-1">
              ₹{totalCompletedWithdrawalsAmt.toFixed(2)}
            </h2>
          </div>
          <p className="text-[10px] text-slate-400 font-medium pt-1 border-t border-slate-100 m-0 leading-none">Total processed bank transfers</p>
        </div>

      </div>

      {/* Main Card with Tabbed Content */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Tab Header Navigation */}
        <div className="border-b border-slate-200 px-6 pt-3 flex items-center gap-6 bg-slate-50/50">
          <button 
            onClick={() => setActiveTab('all_transactions')}
            className={`pb-3 text-xs font-bold border-b-2 cursor-pointer transition-all flex items-center gap-2 ${
              activeTab === 'all_transactions'
                ? 'border-[#ff5500] text-[#ff5500]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>
            Seller Settlement Records ({settlements.length})
          </button>

          <button 
            onClick={() => setActiveTab('withdrawals')}
            className={`pb-3 text-xs font-bold border-b-2 cursor-pointer transition-all flex items-center gap-2 ${
              activeTab === 'withdrawals'
                ? 'border-[#ff5500] text-[#ff5500]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Withdrawal Requests
            {pendingWithdrawalsCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-rose-500 text-white font-extrabold text-[10px] flex items-center justify-center">
                {pendingWithdrawalsCount}
              </span>
            )}
          </button>
        </div>

        {/* Tab Content Section */}
        <div className="p-6 space-y-5">
          
          {/* Search & Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by order ID, seller, bank..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64 bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-[#ff5500]"
              />
            </div>
          </div>

          {/* Tab 1: Settlements Table */}
          {activeTab === 'all_transactions' && (
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                    <th className="py-3.5 px-4">Date & Time</th>
                    <th className="py-3.5 px-4">Order ID</th>
                    <th className="py-3.5 px-4">Seller Store</th>
                    <th className="py-3.5 px-4">Gross Amount</th>
                    <th className="py-3.5 px-4">Comm. Rate</th>
                    <th className="py-3.5 px-4 text-purple-700">Admin Comm. (₹)</th>
                    <th className="py-3.5 px-4 text-emerald-700">Net Seller Amount</th>
                    <th className="py-3.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {filteredSettlements.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="py-8 text-center text-slate-400">
                        No settlement records found.
                      </td>
                    </tr>
                  ) : (
                    filteredSettlements.map((s) => (
                      <tr key={s._id || s.orderId} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                          {s.createdAt ? new Date(s.createdAt).toLocaleString() : 'N/A'}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{s.orderId}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-800">{s.sellerName || 'Seller'}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">₹{Number(s.totalAmount || 0).toFixed(2)}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-600">{s.commissionRate || 10}%</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-purple-700">₹{Number(s.commissionAmount || 0).toFixed(2)}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">₹{Number(s.netSellerAmount || 0).toFixed(2)}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            s.settlementStatus === 'SETTLED' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {s.settlementStatus || 'PENDING'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 2: Withdrawal Requests View */}
          {activeTab === 'withdrawals' && (
            <div className="space-y-4">
              {/* Status Filter Pill Buttons */}
              <div className="flex flex-wrap items-center gap-2 pb-2">
                {['All', 'PENDING', 'APPROVED', 'COMPLETED', 'REJECTED'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setTypeFilter(status === 'All' ? 'All Types' : status)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                      (typeFilter === 'All Types' && status === 'All') || typeFilter.toUpperCase() === status
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              {/* Withdrawal Card List */}
              <div className="space-y-4">
                {filteredWithdrawals.length === 0 ? (
                  <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400">
                    No withdrawal requests found for this filter.
                  </div>
                ) : (
                  filteredWithdrawals.map((w) => {
                    const statusUpper = (w.status || 'PENDING').toUpperCase();
                    return (
                      <div key={w._id || w.withdrawalId} className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all p-5 space-y-4">
                        {/* Top Row */}
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-bold text-slate-900 m-0">Withdrawal Request #{w.withdrawalId}</h3>
                              <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider bg-purple-100 text-purple-700">
                                SELLER
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-slate-700 m-0">{w.sellerName || 'Seller Store'}</p>
                            <p className="text-[11px] text-slate-400 font-mono m-0">
                              Requested: {w.createdAt ? new Date(w.createdAt).toLocaleString() : 'N/A'}
                            </p>
                          </div>

                          <div className="text-right space-y-1">
                            <h2 className="text-lg font-black text-slate-900 tracking-tight m-0">₹{Number(w.amount || 0).toFixed(2)}</h2>
                            <span className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-bold ${
                              ['COMPLETED', 'Completed'].includes(statusUpper) ? 'bg-emerald-100 text-emerald-700' :
                              ['PENDING', 'Pending'].includes(statusUpper) ? 'bg-amber-100 text-amber-700' :
                              ['APPROVED', 'Approved'].includes(statusUpper) ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'
                            }`}>
                              {statusUpper}
                            </span>
                          </div>
                        </div>

                        {/* Middle Details Container */}
                        <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100 space-y-3 text-xs">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">BANK NAME</span>
                              <span className="font-bold text-slate-900">{w.bankDetails?.bankName || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">ACCOUNT NUMBER & IFSC</span>
                              <span className="font-bold text-slate-900 font-mono">
                                A/C: {w.bankDetails?.accountNumber || 'N/A'} | IFSC: {w.bankDetails?.ifscCode || 'N/A'}
                              </span>
                            </div>
                          </div>

                          {w.bankDetails?.accountHolderName && (
                            <div className="pt-2 border-t border-slate-200/50">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">ACCOUNT HOLDER</span>
                              <span className="font-mono text-slate-800 font-semibold">{w.bankDetails.accountHolderName}</span>
                            </div>
                          )}

                          {w.adminRemark && (
                            <div className="pt-2 border-t border-slate-200/50">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">ADMIN REMARK</span>
                              <span className="text-slate-800 italic">{w.adminRemark}</span>
                            </div>
                          )}
                        </div>

                        {/* Approve / Complete / Reject Buttons if Pending */}
                        {statusUpper === 'PENDING' && (
                          <div className="grid grid-cols-3 gap-3 pt-1">
                            <button 
                              onClick={() => handleUpdateWithdrawalStatus(w._id, 'APPROVED')}
                              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl border-none cursor-pointer shadow-2xs transition-all active:scale-95 text-center"
                            >
                              Approve Request
                            </button>
                            <button 
                              onClick={() => handleUpdateWithdrawalStatus(w._id, 'COMPLETED')}
                              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl border-none cursor-pointer shadow-2xs transition-all active:scale-95 text-center"
                            >
                              Complete Payout
                            </button>
                            <button 
                              onClick={() => handleUpdateWithdrawalStatus(w._id, 'REJECTED')}
                              className="w-full py-2.5 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-xl cursor-pointer transition-all active:scale-95 text-center"
                            >
                              Reject & Refund
                            </button>
                          </div>
                        )}

                        {statusUpper === 'APPROVED' && (
                          <div className="pt-1">
                            <button 
                              onClick={() => handleUpdateWithdrawalStatus(w._id, 'COMPLETED')}
                              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl border-none cursor-pointer shadow-2xs transition-all active:scale-95 text-center"
                            >
                              Mark Bank Transfer Completed
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

/* =========================================================================
   9.6. STANDALONE WITHDRAWALS MANAGEMENT PAGE
   ========================================================================= */
export const AdminWithdrawals = () => {
  const [activeFilter, setActiveFilter] = React.useState('All');
  const [withdrawals, setWithdrawals] = React.useState([
    {
      id: 'WD-001',
      title: 'Seller Withdrawal',
      role: 'SELLER',
      user: 'appzeto',
      date: 'Requested: 27/1/2026, 10:38:58 pm',
      amount: '₹510.00',
      status: 'Completed',
      paymentMethod: 'Bank Transfer',
      bankDetails: 'IDFC - 54684651684651 (undefined)',
      transactionReference: 'hjhbjh'
    },
    {
      id: 'WD-002',
      title: 'Captain Withdrawal',
      role: 'captain',
      user: 'N/A',
      date: 'Requested: 7/1/2026, 3:22:40 pm',
      amount: '₹40.00',
      status: 'Pending',
      paymentMethod: 'UPI',
      bankDetails: 'UPI ID: slovevanshi666@gmail.com',
      transactionReference: null
    },
    {
      id: 'WD-003',
      title: 'Seller Withdrawal',
      role: 'SELLER',
      user: 'Deepak Kumar',
      date: 'Requested: 28/5/2026, 2:52:17 pm',
      amount: '₹500.00',
      status: 'Completed',
      paymentMethod: 'UPI',
      bankDetails: 'Airtel payment bank - 9031275861 (AIRP0000001)',
      transactionReference: '9031275861'
    },
    {
      id: 'WD-004',
      title: 'Seller Withdrawal',
      role: 'SELLER',
      user: 'Harsh shop',
      date: 'Requested: 30/4/2026, 12:19:51 pm',
      amount: '₹100.00',
      status: 'Completed',
      paymentMethod: 'Bank Transfer',
      bankDetails: 'HDFC - 9877898789898998888898 (undefined)',
      transactionReference: 'cydf'
    }
  ]);

  const handleApprove = (id) => {
    setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: 'Approved' } : w));
  };

  const handleReject = (id) => {
    setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: 'Rejected' } : w));
  };

  const filtered = withdrawals.filter(w => activeFilter === 'All' || w.status === activeFilter);

  return (
    <div className="space-y-5 animate-fadeIn pb-12">
      {/* Top Filter Buttons matching user screenshot */}
      <div className="flex flex-wrap items-center gap-2">
        {['All', 'Pending', 'Approved', 'Completed', 'Rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setActiveFilter(status)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
              activeFilter === status
                ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Cards List matching exact reference screenshot */}
      <div className="space-y-4">
        {filtered.map((w) => (
          <div 
            key={w.id} 
            className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all p-6 space-y-4"
          >
            {/* Header Row: Title, Role Badge, Username, Date, Amount, Status Badge */}
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 m-0">{w.title}</h3>
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider ${
                    w.role === 'SELLER' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {w.role}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-700 m-0">{w.user}</p>
                <p className="text-[11px] text-slate-400 font-mono m-0">{w.date}</p>
              </div>

              <div className="text-right space-y-1">
                <h2 className="text-xl font-black text-slate-900 tracking-tight m-0">{w.amount}</h2>
                <span className={`inline-block px-3 py-0.5 rounded-full text-[11px] font-bold ${
                  w.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                  w.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                  w.status === 'Approved' ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  {w.status}
                </span>
              </div>
            </div>

            {/* Inner Details Container */}
            <div className="bg-[#fcfcfd] p-4 rounded-xl border border-slate-100 space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">PAYMENT METHOD</span>
                  <span className="font-bold text-slate-900">{w.paymentMethod}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">BANK DETAILS</span>
                  <span className="font-bold text-slate-900 font-mono">{w.bankDetails}</span>
                </div>
              </div>

              {w.transactionReference && (
                <div className="pt-2 border-t border-slate-200/50">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">TRANSACTION REFERENCE</span>
                  <span className="font-mono text-slate-800 font-semibold">{w.transactionReference}</span>
                </div>
              )}
            </div>

            {/* Approve / Reject Action Buttons for Pending Status */}
            {w.status === 'Pending' && (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button 
                  onClick={() => handleApprove(w.id)}
                  className="w-full py-2.5 bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold rounded-xl border-none cursor-pointer shadow-2xs transition-all active:scale-95 text-center"
                >
                  Approve
                </button>
                <button 
                  onClick={() => handleReject(w.id)}
                  className="w-full py-2.5 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-xl cursor-pointer transition-all active:scale-95 text-center"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================================================
   9.7. SELLER TRANSACTIONS PAGE
   ========================================================================= */
export const AdminSellerTransactions = () => {
  const [transactions, setTransactions] = React.useState([
    { id: 'ST-901', sellerName: 'Cakes n bakes', orderId: 'ORD1784732281209325', orderItemId: 'ITEM-881', productName: 'Chocolate Truffle Cake', variation: '1 kg', flag: 'Credit', amount: '₹108.00', remarks: 'Sale proceeds from Order' },
    { id: 'ST-902', sellerName: 'Harshvardhan', orderId: 'ORD1783334491042306', orderItemId: 'ITEM-882', productName: 'Basmati Rice Premium', variation: '5 kg', flag: 'Credit', amount: '₹90.00', remarks: 'Sale proceeds from Order' },
    { id: 'ST-903', sellerName: 'Apex Wholesale Grocery', orderId: 'ORD1782291049281729', orderItemId: 'ITEM-883', productName: 'Refined Sunflower Oil', variation: '1 L', flag: 'Debit', amount: '₹450.00', remarks: 'Seller Payout Settlement' },
  ]);

  // Filters State
  const [fromDate, setFromDate] = React.useState('');
  const [toDate, setToDate] = React.useState('');
  const [sellerFilter, setSellerFilter] = React.useState('All Sellers');
  const [methodFilter, setMethodFilter] = React.useState('All');
  const [search, setSearch] = React.useState('');
  const [perPage, setPerPage] = React.useState(10);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [sortField, setSortField] = React.useState(null);
  const [sortOrder, setSortOrder] = React.useState('asc');

  // Add Fund Transfer Modal State
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [newTransfer, setNewTransfer] = React.useState({
    sellerName: 'Cakes n bakes',
    flag: 'Credit',
    amount: '',
    remarks: ''
  });

  const handleClearFilters = () => {
    setFromDate('');
    setToDate('');
    setSellerFilter('All Sellers');
    setMethodFilter('All');
    setSearch('');
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredTrans = transactions.filter(t => {
    const matchesSeller = sellerFilter === 'All Sellers' || t.sellerName === sellerFilter;
    const matchesMethod = methodFilter === 'All' || t.flag === methodFilter;
    const matchesSearch = 
      t.sellerName.toLowerCase().includes(search.toLowerCase()) ||
      t.orderId.toLowerCase().includes(search.toLowerCase()) ||
      t.productName.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase());
    return matchesSeller && matchesMethod && matchesSearch;
  });

  const sortedTrans = [...filteredTrans].sort((a, b) => {
    if (!sortField) return 0;
    let valA = a[sortField] || '';
    let valB = b[sortField] || '';
    if (typeof valA === 'string' && valA.startsWith('₹')) {
      valA = parseFloat(valA.replace('₹', '').replace(',', '')) || 0;
      valB = parseFloat(valB.replace('₹', '').replace(',', '')) || 0;
    }
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedTrans.length / perPage) || 1;
  const startIndex = (currentPage - 1) * perPage;
  const paginatedTrans = sortedTrans.slice(startIndex, startIndex + perPage);

  const handleExportCSV = () => {
    const headers = ['ID', 'SELLER NAME', 'ORDER ID', 'ORDER ITEM ID', 'PRODUCT NAME', 'VARIATION', 'FLAG', 'AMOUNT', 'REMARKS'];
    const rows = sortedTrans.map(t => [t.id, `"${t.sellerName}"`, t.orderId, t.orderItemId, `"${t.productName}"`, `"${t.variation}"`, t.flag, t.amount, `"${t.remarks}"`]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `shippnex_seller_transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddFundTransfer = (e) => {
    e.preventDefault();
    if (!newTransfer.amount) return;

    const amountVal = parseFloat(newTransfer.amount) || 0;
    const added = {
      id: `ST-${Date.now().toString().slice(-4)}`,
      sellerName: newTransfer.sellerName,
      orderId: 'MANUAL_TXN',
      orderItemId: 'N/A',
      productName: 'Direct Wallet Transfer',
      variation: 'N/A',
      flag: newTransfer.flag,
      amount: `₹${amountVal.toFixed(2)}`,
      remarks: newTransfer.remarks || 'Direct Seller Fund Transfer'
    };

    setTransactions(prev => [added, ...prev]);
    setIsAddModalOpen(false);
    setNewTransfer({ sellerName: 'Cakes n bakes', flag: 'Credit', amount: '', remarks: '' });
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Page Title & Breadcrumb */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Seller Transactions</h1>
        <div className="text-xs text-slate-500 font-medium">
          Dashboard / <span className="text-[#ff5500] font-semibold">View Seller List</span>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Light Orange Header Banner matching reference screenshot with + Add Fund Transfer */}
        <div className="bg-[#fff4ed] border-b border-orange-200/70 text-[#002625] px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h2 className="text-base font-bold tracking-tight text-[#002625] flex items-center gap-2 m-0">
            <ChevronRight size={18} className="text-[#ff5500]" />
            View Seller List
          </h2>

          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-[#ff5500] hover:bg-[#e04a00] text-white text-xs font-bold rounded-xl border-none cursor-pointer flex items-center gap-1.5 shadow-2xs transition-all shrink-0 active:scale-95"
          >
            <Plus size={15} /> Add Fund Transfer
          </button>
        </div>

        {/* Filter Controls Toolbar */}
        <div className="p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
            
            {/* Left Filters: From - To Date, Clear, Filter by Seller, Filter by Method */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                <span className="text-slate-500 font-medium">From - To Date:</span>
                <input 
                  type="date" 
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="bg-transparent text-xs text-slate-800 outline-none border-none font-medium cursor-pointer"
                />
                <span className="text-slate-400">-</span>
                <input 
                  type="date" 
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="bg-transparent text-xs text-slate-800 outline-none border-none font-medium cursor-pointer"
                />
              </div>

              <button 
                onClick={handleClearFilters}
                className="px-3.5 py-1.5 bg-slate-700 hover:bg-slate-800 text-white text-xs font-bold rounded-xl border-none cursor-pointer transition-colors"
              >
                Clear
              </button>

              <div className="flex items-center gap-2">
                <span className="text-slate-600 font-medium">Filter by Seller:</span>
                <select 
                  value={sellerFilter}
                  onChange={(e) => setSellerFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-[#ff5500] cursor-pointer"
                >
                  <option value="All Sellers">All Sellers</option>
                  <option value="Cakes n bakes">Cakes n bakes</option>
                  <option value="Harshvardhan">Harshvardhan</option>
                  <option value="Apex Wholesale Grocery">Apex Wholesale Grocery</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-600 font-medium">Filter by Method:</span>
                <select 
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-[#ff5500] cursor-pointer"
                >
                  <option value="All">All</option>
                  <option value="Credit">Credit</option>
                  <option value="Debit">Debit</option>
                </select>
              </div>
            </div>

            {/* Right Controls: Per Page, Export CSV, Search */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-600 font-medium">Per Page:</span>
                <select 
                  value={perPage}
                  onChange={(e) => {
                    setPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-[#ff5500] cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <button 
                onClick={handleExportCSV}
                className="px-4 py-1.5 bg-[#ff5500] hover:bg-[#e04a00] text-white text-xs font-bold rounded-xl border-none cursor-pointer flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 shrink-0"
              >
                <Download size={14} /> Export v
              </button>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-600 font-medium">Search:</span>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-40 bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-[#ff5500]"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Table Container */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                  <th onClick={() => handleSort('id')} className="py-3.5 px-3 cursor-pointer select-none">ID ⇕</th>
                  <th onClick={() => handleSort('sellerName')} className="py-3.5 px-3 cursor-pointer select-none">SELLER NAME ⇕</th>
                  <th onClick={() => handleSort('orderId')} className="py-3.5 px-3 cursor-pointer select-none">ORDER ID ⇕</th>
                  <th onClick={() => handleSort('orderItemId')} className="py-3.5 px-3 cursor-pointer select-none">ORDER ITEM ID ⇕</th>
                  <th onClick={() => handleSort('productName')} className="py-3.5 px-3 cursor-pointer select-none">PRODUCT NAME ⇕</th>
                  <th onClick={() => handleSort('variation')} className="py-3.5 px-3 cursor-pointer select-none">VARIATION ⇕</th>
                  <th onClick={() => handleSort('flag')} className="py-3.5 px-3 cursor-pointer select-none">FLAG ⇕</th>
                  <th onClick={() => handleSort('amount')} className="py-3.5 px-3 cursor-pointer select-none">AMOUNT ⇕</th>
                  <th className="py-3.5 px-3">REMARKS ⇕</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {paginatedTrans.length > 0 ? (
                  paginatedTrans.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-3 font-mono text-slate-500">{t.id}</td>
                      <td className="py-3.5 px-3 font-bold text-slate-900">{t.sellerName}</td>
                      <td className="py-3.5 px-3 font-mono font-bold text-[#ff5500]">{t.orderId}</td>
                      <td className="py-3.5 px-3 font-mono text-slate-600">{t.orderItemId}</td>
                      <td className="py-3.5 px-3 text-slate-900 font-medium max-w-[150px] truncate" title={t.productName}>{t.productName}</td>
                      <td className="py-3.5 px-3 text-slate-600">{t.variation}</td>
                      <td className="py-3.5 px-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          t.flag === 'Credit' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {t.flag}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-slate-900">{t.amount}</td>
                      <td className="py-3.5 px-3 text-slate-600 max-w-[180px] truncate" title={t.remarks}>{t.remarks}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="py-12 text-center text-slate-400 font-medium">
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 pt-2">
            <div>
              Showing {sortedTrans.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + perPage, sortedTrans.length)} of {sortedTrans.length} entries
            </div>

            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || sortedTrans.length === 0}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer font-bold transition-all"
              >
                ‹
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold border cursor-pointer transition-all ${
                    currentPage === page 
                      ? 'bg-[#ff5500] text-white border-[#ff5500] shadow-2xs' 
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || sortedTrans.length === 0}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer font-bold transition-all"
              >
                ›
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* ADD FUND TRANSFER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-fadeIn">
            <div className="bg-[#fff4ed] border-b border-orange-200/70 text-[#002625] px-6 py-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-[#002625] m-0 flex items-center gap-2">
                <Plus size={18} className="text-[#ff5500]" />
                Add Fund Transfer
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-900 border-none bg-transparent cursor-pointer text-xl font-bold p-1 leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddFundTransfer} className="p-6 space-y-4 text-xs">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Select Seller *</label>
                <select 
                  value={newTransfer.sellerName}
                  onChange={(e) => setNewTransfer({ ...newTransfer, sellerName: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-[#ff5500] bg-slate-50 cursor-pointer"
                >
                  <option value="Cakes n bakes">Cakes n bakes</option>
                  <option value="Harshvardhan">Harshvardhan</option>
                  <option value="Apex Wholesale Grocery">Apex Wholesale Grocery</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Transfer Flag *</label>
                  <select 
                    value={newTransfer.flag}
                    onChange={(e) => setNewTransfer({ ...newTransfer, flag: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 outline-none focus:border-[#ff5500] bg-slate-50 cursor-pointer"
                  >
                    <option value="Credit">Credit (Add)</option>
                    <option value="Debit">Debit (Deduct)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Amount (₹) *</label>
                  <input 
                    type="number" 
                    required
                    placeholder="0.00"
                    value={newTransfer.amount}
                    onChange={(e) => setNewTransfer({ ...newTransfer, amount: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-[#ff5500]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Remarks</label>
                <textarea 
                  rows="3"
                  placeholder="Reason for seller transfer..."
                  value={newTransfer.remarks}
                  onChange={(e) => setNewTransfer({ ...newTransfer, remarks: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none focus:border-[#ff5500] resize-none"
                ></textarea>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border-none cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 bg-[#ff5500] hover:bg-[#e04a00] text-white text-xs font-bold rounded-xl border-none cursor-pointer shadow-2xs transition-all active:scale-95"
                >
                  Transfer Funds
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   9.8. captain CASH COLLECTION LIST PAGE
   ========================================================================= */
export const AdminCashCollection = () => {
  const [collections, setCollections] = React.useState([
    { id: '7e5ac4', name: 'Deepak kumar', orderId: 'N/A', total: '₹0.00', amount: '₹100.00', method: 'Cash', remark: '-', dateTime: '18/6/2026, 11:53:13 am' },
    { id: '8fc653', name: 'Wazahat Qureshi', orderId: 'N/A', total: '₹0.00', amount: '₹500.00', method: 'Cash', remark: 'vjdnvkdf', dateTime: '17/6/2026, 5:01:58 pm' },
    { id: '3c81a9', name: 'Vishal Patel', orderId: 'ORD17849102', total: '₹1250.00', amount: '₹1250.00', method: 'Cash', remark: 'COD settlement', dateTime: '16/6/2026, 2:15:00 pm' },
  ]);

  // Filters State
  const [fromDate, setFromDate] = React.useState('');
  const [toDate, setToDate] = React.useState('');
  const [deliveryBoyFilter, setDeliveryBoyFilter] = React.useState('All Captains');
  const [methodFilter, setMethodFilter] = React.useState('All');
  const [search, setSearch] = React.useState('');
  const [perPage, setPerPage] = React.useState(10);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [sortField, setSortField] = React.useState(null);
  const [sortOrder, setSortOrder] = React.useState('asc');

  // Add Cash Collection Modal State
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [newCollection, setNewCollection] = React.useState({
    name: 'Deepak kumar',
    orderId: 'N/A',
    amount: '',
    method: 'Cash',
    remark: ''
  });

  const handleClearFilters = () => {
    setFromDate('');
    setToDate('');
    setDeliveryBoyFilter('All Captains');
    setMethodFilter('All');
    setSearch('');
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredCollections = collections.filter(c => {
    const matchesBoy = deliveryBoyFilter === 'All Captains' || c.name === deliveryBoyFilter;
    const matchesMethod = methodFilter === 'All' || c.method === methodFilter;
    const matchesSearch = 
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.orderId.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.remark.toLowerCase().includes(search.toLowerCase());
    return matchesBoy && matchesMethod && matchesSearch;
  });

  const sortedCollections = [...filteredCollections].sort((a, b) => {
    if (!sortField) return 0;
    let valA = a[sortField] || '';
    let valB = b[sortField] || '';
    if (typeof valA === 'string' && valA.startsWith('₹')) {
      valA = parseFloat(valA.replace('₹', '').replace(',', '')) || 0;
      valB = parseFloat(valB.replace('₹', '').replace(',', '')) || 0;
    }
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedCollections.length / perPage) || 1;
  const startIndex = (currentPage - 1) * perPage;
  const paginatedCollections = sortedCollections.slice(startIndex, startIndex + perPage);

  const handleExportCSV = () => {
    const headers = ['ID', 'NAME', 'O. ID', 'TOTAL', 'AMOUNT', 'METHOD', 'REMARK', 'DATE TIME'];
    const rows = sortedCollections.map(c => [c.id, `"${c.name}"`, c.orderId, c.total, c.amount, c.method, `"${c.remark}"`, `"${c.dateTime}"`]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `shippnex_cash_collections_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddCashCollection = (e) => {
    e.preventDefault();
    if (!newCollection.amount) return;

    const amountVal = parseFloat(newCollection.amount) || 0;
    const added = {
      id: Math.random().toString(36).substring(2, 8),
      name: newCollection.name,
      orderId: newCollection.orderId || 'N/A',
      total: '₹0.00',
      amount: `₹${amountVal.toFixed(2)}`,
      method: newCollection.method,
      remark: newCollection.remark || '-',
      dateTime: new Date().toLocaleString('en-GB')
    };

    setCollections(prev => [added, ...prev]);
    setIsAddModalOpen(false);
    setNewCollection({ name: 'Deepak kumar', orderId: 'N/A', amount: '', method: 'Cash', remark: '' });
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Page Title & Breadcrumb */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Cash Collection</h1>
        <div className="text-xs text-slate-500 font-medium">
          Dashboard / <span className="text-[#ff5500] font-semibold">Captain Cash Collection List</span>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Light Orange Header Banner matching reference screenshot with + Add Cash Collection */}
        <div className="bg-[#fff4ed] border-b border-orange-200/70 text-[#002625] px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h2 className="text-base font-bold tracking-tight text-[#002625] flex items-center gap-2 m-0">
            <ChevronRight size={18} className="text-[#ff5500]" />
            Captain Cash Collection List
          </h2>

          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-[#ff5500] hover:bg-[#e04a00] text-white text-xs font-bold rounded-xl border-none cursor-pointer flex items-center gap-1.5 shadow-2xs transition-all shrink-0 active:scale-95"
          >
            <Plus size={15} /> Add Cash Collection
          </button>
        </div>

        {/* Filter Controls Toolbar */}
        <div className="p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
            
            {/* Left Filters: From - To Date, Clear, Filter by Captain, Filter by Method */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                <span className="text-slate-500 font-medium">From - To Date:</span>
                <input 
                  type="date" 
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="bg-transparent text-xs text-slate-800 outline-none border-none font-medium cursor-pointer"
                />
                <span className="text-slate-400">-</span>
                <input 
                  type="date" 
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="bg-transparent text-xs text-slate-800 outline-none border-none font-medium cursor-pointer"
                />
              </div>

              <button 
                onClick={handleClearFilters}
                className="px-3.5 py-1.5 bg-slate-700 hover:bg-slate-800 text-white text-xs font-bold rounded-xl border-none cursor-pointer transition-colors"
              >
                Clear
              </button>

              <div className="flex items-center gap-2">
                <span className="text-slate-600 font-medium">Filter by Captain:</span>
                <select 
                  value={deliveryBoyFilter}
                  onChange={(e) => setDeliveryBoyFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-[#ff5500] cursor-pointer"
                >
                  <option value="All Captains">All Captains</option>
                  <option value="Deepak kumar">Deepak kumar</option>
                  <option value="Wazahat Qureshi">Wazahat Qureshi</option>
                  <option value="Vishal Patel">Vishal Patel</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-600 font-medium">Filter by Method:</span>
                <select 
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-[#ff5500] cursor-pointer"
                >
                  <option value="All">All</option>
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                </select>
              </div>
            </div>

            {/* Right Controls: Per Page, Export CSV, Search */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-600 font-medium">Per Page:</span>
                <select 
                  value={perPage}
                  onChange={(e) => {
                    setPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-[#ff5500] cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <button 
                onClick={handleExportCSV}
                className="px-4 py-1.5 bg-[#ff5500] hover:bg-[#e04a00] text-white text-xs font-bold rounded-xl border-none cursor-pointer flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 shrink-0"
              >
                <Download size={14} /> Export v
              </button>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-600 font-medium">Search:</span>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-40 bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-[#ff5500]"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Table Container matching reference image */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                  <th onClick={() => handleSort('id')} className="py-3.5 px-4 cursor-pointer select-none">ID ⇕</th>
                  <th onClick={() => handleSort('name')} className="py-3.5 px-4 cursor-pointer select-none">NAME ⇕</th>
                  <th onClick={() => handleSort('orderId')} className="py-3.5 px-4 cursor-pointer select-none">O. ID ⇕</th>
                  <th onClick={() => handleSort('total')} className="py-3.5 px-4 cursor-pointer select-none">TOTAL ⇕</th>
                  <th onClick={() => handleSort('amount')} className="py-3.5 px-4 cursor-pointer select-none">AMOUNT ⇕</th>
                  <th onClick={() => handleSort('method')} className="py-3.5 px-4 cursor-pointer select-none">METHOD ⇕</th>
                  <th className="py-3.5 px-4">REMARK ⇕</th>
                  <th onClick={() => handleSort('dateTime')} className="py-3.5 px-4 cursor-pointer select-none">DATE TIME ⇕</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {paginatedCollections.length > 0 ? (
                  paginatedCollections.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-slate-500">{c.id}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{c.name}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-500">{c.orderId}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">{c.total}</td>
                      <td className="py-3.5 px-4 font-mono font-extrabold text-slate-900">{c.amount}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-600 border border-blue-100">
                          {c.method}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-[150px] truncate" title={c.remark}>{c.remark}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-500">{c.dateTime}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="py-12 text-center text-slate-400 font-medium">
                      No cash collection entries found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 pt-2">
            <div>
              Showing {sortedCollections.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + perPage, sortedCollections.length)} of {sortedCollections.length} entries
            </div>

            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || sortedCollections.length === 0}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer font-bold transition-all"
              >
                ‹
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold border cursor-pointer transition-all ${
                    currentPage === page 
                      ? 'bg-[#ff5500] text-white border-[#ff5500] shadow-2xs' 
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || sortedCollections.length === 0}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer font-bold transition-all"
              >
                ›
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* ADD CASH COLLECTION MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-fadeIn">
            <div className="bg-[#fff4ed] border-b border-orange-200/70 text-[#002625] px-6 py-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-[#002625] m-0 flex items-center gap-2">
                <Plus size={18} className="text-[#ff5500]" />
                Add Cash Collection
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-900 border-none bg-transparent cursor-pointer text-xl font-bold p-1 leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddCashCollection} className="p-6 space-y-4 text-xs">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Select Captain *</label>
                <select 
                  value={newCollection.name}
                  onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-[#ff5500] bg-slate-50 cursor-pointer"
                >
                  <option value="Deepak kumar">Deepak kumar</option>
                  <option value="Wazahat Qureshi">Wazahat Qureshi</option>
                  <option value="Vishal Patel">Vishal Patel</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Order ID (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="N/A"
                    value={newCollection.orderId}
                    onChange={(e) => setNewCollection({ ...newCollection, orderId: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-[#ff5500]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Amount (₹) *</label>
                  <input 
                    type="number" 
                    required
                    placeholder="0.00"
                    value={newCollection.amount}
                    onChange={(e) => setNewCollection({ ...newCollection, amount: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-[#ff5500]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Remark</label>
                <textarea 
                  rows="3"
                  placeholder="Cash collection remarks..."
                  value={newCollection.remark}
                  onChange={(e) => setNewCollection({ ...newCollection, remark: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none focus:border-[#ff5500] resize-none"
                ></textarea>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border-none cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 bg-[#ff5500] hover:bg-[#e04a00] text-white text-xs font-bold rounded-xl border-none cursor-pointer shadow-2xs transition-all active:scale-95"
                >
                  Submit Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   10. COUPONS PAGE
   ========================================================================= */
export const CouponManagement = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Coupons & Promos</h2>
          <p className="text-xs text-slate-500">Discount codes, usage limits, and expiration controls</p>
        </div>
        <button onClick={() => alert('Add Coupon (UI)')} className="px-3.5 py-2 bg-[#ff5500] hover:bg-[#e04a00] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 border-none cursor-pointer">
          <Plus size={15} /> Create Code
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockCoupons.map((c) => (
          <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-base font-extrabold font-mono text-[#ff5500] bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">{c.code}</span>
              <StatusBadge status={c.status} />
            </div>
            <p className="text-sm font-bold text-slate-900">{c.discount}</p>
            <p className="text-xs text-slate-500">Used: {c.usedCount} / {c.usageLimit}</p>
            <p className="text-[10px] text-slate-400 font-mono">Expires: {c.validTill}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================================================
   11. REPORTS PAGE
   ========================================================================= */
export const ReportManagement = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Platform Reports</h2>
        <p className="text-xs text-slate-500">System analytics, fulfillment heatmaps, and performance reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-base font-bold text-slate-900">Fulfillment Speed Analysis</h3>
          <div className="h-40 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center text-xs text-[#ff5500] font-mono font-bold">
            [ Average Dispatch Time: 24.5 mins ]
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-base font-bold text-slate-900">Seller Settlement Rate</h3>
          <div className="h-40 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center text-xs text-emerald-600 font-mono font-bold">
            [ 99.8% On-Time Payouts ]
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   12. FAQ MANAGEMENT PAGE
   ========================================================================= */
export const FaqManagement = () => {
  const [faqs, setFaqs] = useState(mockFaqs);

  // Form State for Add / Edit FAQ
  const [editingFaqId, setEditingFaqId] = useState(null);
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqCategory, setFaqCategory] = useState('General (Visible to all)');
  const [faqAnswer, setFaqAnswer] = useState('');

  // Table controls (search, filter, pagination)
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Contact details form state
  const [companyName, setCompanyName] = useState('ShippNex Logistics');
  const [companyPhone, setCompanyPhone] = useState('90312 75861');
  const [companyEmail, setCompanyEmail] = useState('contact@shippnex.com');
  const [companyWebsite, setCompanyWebsite] = useState('https://shippnex.com');
  const [supportEmail, setSupportEmail] = useState('support@shippnex.com');
  const [supportPhone, setSupportPhone] = useState('90312 75861');

  // Handle Add/Update FAQ
  const handleSaveFaq = (e) => {
    e.preventDefault();
    if (!faqQuestion.trim() || !faqAnswer.trim()) {
      alert('Please fill in both question and answer.');
      return;
    }

    if (editingFaqId) {
      const updatedList = faqs.map(f => f.id === editingFaqId ? { ...f, question: faqQuestion, category: faqCategory, answer: faqAnswer } : f);
      setFaqs(updatedList);
      // Sync with global mock data array
      const index = mockFaqs.findIndex(f => f.id === editingFaqId);
      if (index !== -1) {
        mockFaqs[index] = { id: editingFaqId, category: faqCategory, question: faqQuestion, answer: faqAnswer };
      }
      setEditingFaqId(null);
      alert('FAQ updated successfully!');
    } else {
      const newFaq = {
        id: mockFaqs.length > 0 ? Math.max(...mockFaqs.map(f => f.id)) + 1 : 1,
        category: faqCategory,
        question: faqQuestion,
        answer: faqAnswer
      };
      setFaqs([...faqs, newFaq]);
      mockFaqs.push(newFaq); // Add directly into shared mock array so user side picks it up
      alert('FAQ added successfully!');
    }
    setFaqQuestion('');
    setFaqAnswer('');
    setFaqCategory('General (Visible to all)');
  };

  const handleEditClick = (faq) => {
    setEditingFaqId(faq.id);
    setFaqQuestion(faq.question);
    setFaqCategory(faq.category);
    setFaqAnswer(faq.answer);
  };

  const handleCancelEdit = () => {
    setEditingFaqId(null);
    setFaqQuestion('');
    setFaqCategory('General (Visible to all)');
    setFaqAnswer('');
  };

  const handleDeleteClick = (id) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      const updatedList = faqs.filter(f => f.id !== id);
      setFaqs(updatedList);
      const index = mockFaqs.findIndex(f => f.id === id);
      if (index !== -1) mockFaqs.splice(index, 1);
      if (editingFaqId === id) {
        handleCancelEdit();
      }
    }
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["ID,Category,FAQ Question,FAQ Answer"].concat(
        filteredFaqs.map(f => `"${f.id}","${f.category}","${f.question.replace(/"/g, '""')}","${f.answer.replace(/"/g, '""')}"`)
      ).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "faqs_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpdateContact = (e) => {
    e.preventDefault();
    alert('Company & Contact Details updated successfully!');
  };

  // Filtered & Paginated List
  const filteredFaqs = faqs.filter(f => {
    const matchesCategory = categoryFilter === 'All Categories' || f.category === categoryFilter;
    const matchesSearch = f.question.toLowerCase().includes(search.toLowerCase()) || f.answer.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredFaqs.length / entriesPerPage) || 1;
  const indexOfLastItem = currentPage * entriesPerPage;
  const indexOfFirstItem = indexOfLastItem - entriesPerPage;
  const currentFaqs = filteredFaqs.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Header Breadcrumb Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h2 className="text-2xl font-bold text-slate-900">FAQ</h2>
        <div className="text-xs text-slate-400 font-medium">
          <span className="text-[#ff661a] hover:underline cursor-pointer">Home</span> / Dashboard
        </div>
      </div>

      {/* Main Grid: Add FAQ (Left) & View FAQ (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Section: Add / Edit FAQ */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-[#ff661a] px-5 py-3.5 flex justify-between items-center text-white">
            <h3 className="text-sm font-bold tracking-wide">{editingFaqId ? 'Edit FAQ' : 'Add FAQ'}</h3>
            {editingFaqId && (
              <button 
                type="button" 
                onClick={handleCancelEdit} 
                className="text-xs bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-lg border-none cursor-pointer"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSaveFaq} className="p-5 space-y-4 text-xs text-slate-700">
            <div>
              <label className="block font-bold text-slate-800 mb-1.5">FAQ Question</label>
              <input 
                type="text" 
                placeholder="Enter FAQ Question"
                value={faqQuestion}
                onChange={(e) => setFaqQuestion(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#ff661a] transition-colors"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1.5">FAQ Category (For User Type)</label>
              <select 
                value={faqCategory}
                onChange={(e) => setFaqCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#ff661a] transition-colors"
              >
                <option value="General (Visible to all)">General (Visible to all)</option>
                <option value="Customer">Customer</option>
                <option value="Seller">Seller</option>
                <option value="Delivery Captain">Delivery Captain</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1.5">FAQ Answer</label>
              <textarea 
                rows={5}
                placeholder="Enter FAQ Answer"
                value={faqAnswer}
                onChange={(e) => setFaqAnswer(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#ff661a] transition-colors resize-y"
                required
              />
            </div>

            <button 
              type="submit" 
              className="w-full py-2.5 bg-[#ff661a] hover:bg-[#e65200] text-white text-xs font-bold rounded-xl transition-colors border-none cursor-pointer shadow-sm mt-2"
            >
              {editingFaqId ? 'Update FAQ' : 'Add FAQ'}
            </button>
          </form>
        </div>

        {/* Right Section: View FAQ Table */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-[#ff661a] px-5 py-3.5 text-white">
            <h3 className="text-sm font-bold tracking-wide">View FAQ</h3>
          </div>

          <div className="p-4 space-y-4">
            {/* Control Bar: Show count, Filter category, Export, Search */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span>Show</span>
                  <select 
                    value={entriesPerPage}
                    onChange={(e) => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1); }}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 font-semibold focus:outline-none focus:border-[#ff661a]"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span>Filter:</span>
                  <select 
                    value={categoryFilter}
                    onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 font-semibold focus:outline-none focus:border-[#ff661a]"
                  >
                    <option value="All Categories">All Categories</option>
                    <option value="General (Visible to all)">General (Visible to all)</option>
                    <option value="Customer">Customer</option>
                    <option value="Seller">Seller</option>
                    <option value="Delivery Captain">Delivery Captain</option>
                  </select>
                </div>

                <button 
                  type="button" 
                  onClick={handleExport}
                  className="px-3 py-1 bg-[#ff661a] hover:bg-[#e65200] text-white text-xs font-bold rounded-lg border-none cursor-pointer flex items-center gap-1 transition-colors"
                >
                  <Download size={13} /> Export
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <span>Search:</span>
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                  placeholder="Search..."
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-900 focus:outline-none focus:border-[#ff661a] w-32 sm:w-40"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <th className="py-3 px-3 w-12 text-center">ID</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">FAQ Question</th>
                    <th className="py-3 px-3">FAQ Answer</th>
                    <th className="py-3 px-3 text-center w-20">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {currentFaqs.length > 0 ? (
                    currentFaqs.map((faq) => (
                      <tr key={faq.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3 text-center font-mono font-bold text-slate-500">{faq.id}</td>
                        <td className="py-3 px-3 font-medium text-slate-800">{faq.category}</td>
                        <td className="py-3 px-3 font-semibold text-slate-900">{faq.question}</td>
                        <td className="py-3 px-3 text-slate-600 max-w-xs truncate">{faq.answer}</td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button 
                              onClick={() => handleEditClick(faq)}
                              className="p-1.5 bg-slate-100 hover:bg-[#ff661a] hover:text-white text-slate-600 rounded-lg transition-colors border-none cursor-pointer"
                              title="Edit FAQ"
                            >
                              <Edit3 size={13} />
                            </button>
                            <button 
                              onClick={() => handleDeleteClick(faq.id)}
                              className="p-1.5 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 rounded-lg transition-colors border-none cursor-pointer"
                              title="Delete FAQ"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-slate-400 italic">
                        No FAQs found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs text-slate-500">
              <span>
                Showing {filteredFaqs.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, filteredFaqs.length)} of {filteredFaqs.length} entries
              </span>

              <div className="inline-flex rounded-xl border border-slate-200 p-0.5 bg-slate-50 items-center">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 border-none bg-transparent cursor-pointer disabled:opacity-40"
                >
                  ‹
                </button>
                <span className="px-3 py-1 bg-[#ff661a] text-white text-xs font-bold rounded-lg">
                  {currentPage}
                </span>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 border-none bg-transparent cursor-pointer disabled:opacity-40"
                >
                  ›
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Bottom Section: FAQ & Company Contact Details */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden max-w-4xl">
        <div className="bg-[#ff661a] px-5 py-3.5 text-white">
          <h3 className="text-sm font-bold tracking-wide">FAQ & Company Contact Details</h3>
        </div>

        <form onSubmit={handleUpdateContact} className="p-6 space-y-4 text-xs text-slate-700">
          <div>
            <label className="block font-bold text-slate-800 mb-1.5">Company Name (Invoice From)</label>
            <input 
              type="text" 
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#ff661a] transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-800 mb-1.5">Company Phone (Invoice)</label>
              <input 
                type="text" 
                value={companyPhone}
                onChange={(e) => setCompanyPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#ff661a] transition-colors"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-800 mb-1.5">Company Email (Invoice)</label>
              <input 
                type="email" 
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#ff661a] transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1.5">Company Website (Invoice)</label>
            <input 
              type="text" 
              value={companyWebsite}
              onChange={(e) => setCompanyWebsite(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#ff661a] transition-colors"
              required
            />
          </div>

          <div className="pt-2 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-800 mb-1.5">Support Email (FAQ Page)</label>
              <input 
                type="email" 
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#ff661a] transition-colors"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-800 mb-1.5">Support Phone (FAQ Page)</label>
              <input 
                type="text" 
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#ff661a] transition-colors"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-2.5 bg-[#ff661a] hover:bg-[#e65200] text-white text-xs font-bold rounded-xl transition-colors border-none cursor-pointer shadow-sm mt-4"
          >
            Update Contact Details
          </button>
        </form>
      </div>
    </div>
  );
};

/* =========================================================================
   13. NOTIFICATIONS PAGE
   ========================================================================= */
export const NotificationManagement = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Broadcast Notifications</h2>
          <p className="text-xs text-slate-500">Push alerts, SMS, and email campaign broadcasts</p>
        </div>
        <button onClick={() => alert('New Broadcast (UI)')} className="px-3.5 py-2 bg-[#ff5500] hover:bg-[#e04a00] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 border-none cursor-pointer">
          <Send size={15} /> Send Broadcast
        </button>
      </div>

      <div className="space-y-3">
        {mockNotifications.map((n) => (
          <div key={n.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900">{n.title}</h3>
              <p className="text-xs text-slate-600 mt-0.5">{n.message}</p>
              <span className="text-[10px] text-slate-400 font-mono mt-1 inline-block">{n.time}</span>
            </div>
            <StatusBadge status={n.type} />
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================================================
   13. ROLES & PERMISSIONS PAGE
   ========================================================================= */
export const RoleManagement = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Roles & Access Matrix</h2>
        <p className="text-xs text-slate-500">Configure administrative privilege matrix and staff accounts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockRoles.map((r) => (
          <div key={r.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900">{r.name}</h3>
              <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">{r.members} Members</span>
            </div>
            <p className="text-xs text-slate-600">Permissions: <strong className="text-slate-900">{r.permissions}</strong></p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================================================
   14. SYSTEM SETTINGS PAGE
   ========================================================================= */
export const SettingManagement = () => {
  const [fcmTesting, setFcmTesting] = useState(false);
  const [fcmTestResult, setFcmTestResult] = useState(null);

  const handleTestFCM = async () => {
    setFcmTesting(true);
    setFcmTestResult(null);
    try {
      const res = await fcmService.sendTestPush();
      setFcmTestResult(res);
    } catch (err) {
      setFcmTestResult({
        success: false,
        error: err.response?.data?.error || err.response?.data?.message || err.message
      });
    } finally {
      setFcmTesting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Global Platform Settings</h2>
        <p className="text-xs text-slate-500">Branding, tax rules, payment gateways, push notifications, and security configurations</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 max-w-3xl">
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-[#ff5500] uppercase tracking-wider">General Branding & Fees</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-500 block mb-1">Platform Commission Fee (%)</label>
              <input type="text" defaultValue="2.5%" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900" />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">Base Delivery Surcharge (₹)</label>
              <input type="text" defaultValue="₹4.50" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900" />
            </div>
          </div>
        </div>

        {/* Firebase Push Notifications (SOP Standard) */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Firebase Cloud Messaging (FCM)</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Push notifications for Customer orders, Merchant alerts & Delivery Captains (SOP v2.0)</p>
            </div>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[10px] font-extrabold uppercase">
              SOP Active
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="text-xs text-slate-600 space-y-1">
              <p className="m-0 font-medium">● <b>Service Worker:</b> <code className="text-[11px] bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono">/firebase-messaging-sw.js</code></p>
              <p className="m-0 font-medium">● <b>Status:</b> Ready with standard schema and fallback dispatcher.</p>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleTestFCM}
                disabled={fcmTesting}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer border-none flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {fcmTesting ? <RefreshCw size={13} className="animate-spin" /> : null}
                <span>{fcmTesting ? 'Testing FCM...' : 'Send Test Push Notification'}</span>
              </button>
            </div>

            {fcmTestResult && (
              <div className={`p-3 rounded-xl text-xs ${fcmTestResult.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}`}>
                <p className="font-bold m-0">{fcmTestResult.success ? '✅ Test Notification Dispatched:' : 'ℹ️ FCM Status:'}</p>
                <p className="m-0 text-[11px] mt-0.5">{fcmTestResult.message || fcmTestResult.error || JSON.stringify(fcmTestResult)}</p>
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button onClick={() => alert('Settings Saved Successfully')} className="px-5 py-2.5 bg-[#ff5500] hover:bg-[#e04a00] text-white text-xs font-bold rounded-xl cursor-pointer border-none">
            Save System Configurations
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   15. TAX MANAGEMENT PAGE
   ========================================================================= */
export const TaxManagement = () => {
  const [taxes, setTaxes] = useState([
    { id: 'TAX-01', name: 'GST 5%', rate: 5, hsn: '1006 (Grains & Rice)', type: 'Percentage', status: 'Active' },
    { id: 'TAX-02', name: 'GST 12%', rate: 12, hsn: '1507 (Oil & Ghee)', type: 'Percentage', status: 'Active' },
    { id: 'TAX-03', name: 'GST 18%', rate: 18, hsn: '3304 (Personal Care)', type: 'Percentage', status: 'Active' },
    { id: 'TAX-04', name: 'GST 28%', rate: 28, hsn: '8711 (Electronics)', type: 'Percentage', status: 'Active' },
    { id: 'TAX-05', name: 'Exempted (0%)', rate: 0, hsn: '0701 (Fresh Veggies)', type: 'Percentage', status: 'Active' },
  ]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTax, setNewTax] = useState({ name: '', rate: '', hsn: '', type: 'Percentage', status: 'Active' });

  const filteredTaxes = taxes.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.hsn.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddTax = (e) => {
    e.preventDefault();
    if (!newTax.name || newTax.rate === '') return;
    const created = {
      id: `TAX-0${taxes.length + 1}`,
      name: newTax.name,
      rate: Number(newTax.rate),
      hsn: newTax.hsn || 'N/A',
      type: newTax.type,
      status: newTax.status
    };
    setTaxes([...taxes, created]);
    setNewTax({ name: '', rate: '', hsn: '', type: 'Percentage', status: 'Active' });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header & Breadcrumb */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Taxes & HSN</h1>
        <div className="text-xs text-slate-500 font-medium">
          Dashboard / <span className="text-[#ff5500] font-semibold">Tax Rules</span>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Header Bar matching Light Orange Theme */}
        <div className="bg-[#fff4ed] border-b border-orange-200/70 text-[#002625] px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-base font-bold tracking-tight text-[#002625] flex items-center gap-2">
              <ChevronRight size={18} className="text-[#ff5500]" />
              Taxes & HSN Management
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure global tax slabs, GST percentages, and HSN code rules
            </p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-[#ff5500] hover:bg-[#e04a00] text-white text-xs font-bold rounded-xl border-none transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 shrink-0"
          >
            <Plus size={15} /> Add Tax Rule
          </button>
        </div>

        {/* Toolbar & Search Bar */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search tax rate or HSN code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50/60 border border-slate-200 rounded-md pl-9 pr-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-[#ff5500] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Tax Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4">TAX ID</th>
                  <th className="py-3.5 px-4">TAX NAME</th>
                  <th className="py-3.5 px-4">RATE (%)</th>
                  <th className="py-3.5 px-4">HSN CODE & CATEGORY</th>
                  <th className="py-3.5 px-4">TYPE</th>
                  <th className="py-3.5 px-4">STATUS</th>
                  <th className="py-3.5 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredTaxes.map((tax) => (
                  <tr key={tax.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">{tax.id}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{tax.name}</td>
                    <td className="py-3.5 px-4 font-extrabold text-[#ff5500]">{tax.rate}%</td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono">{tax.hsn}</td>
                    <td className="py-3.5 px-4 text-slate-500 font-medium">{tax.type}</td>
                    <td className="py-3.5 px-4"><StatusBadge status={tax.status} /></td>
                    <td className="py-3.5 px-4 text-right">
                      <button 
                        onClick={() => setTaxes(taxes.filter(t => t.id !== tax.id))}
                        className="text-rose-600 hover:text-rose-800 text-xs font-bold cursor-pointer border-none bg-transparent"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add New Tax Rule</h3>
            <form onSubmit={handleAddTax} className="space-y-3">
              <div>
                <label className="text-xs text-slate-500 block mb-1">Tax Label / Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. GST 18%"
                  value={newTax.name}
                  onChange={(e) => setNewTax({ ...newTax, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-[#ff5500]"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">Tax Rate (%)</label>
                <input 
                  type="number" 
                  required
                  placeholder="18"
                  value={newTax.rate}
                  onChange={(e) => setNewTax({ ...newTax, rate: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-[#ff5500]"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">HSN Code & Description</label>
                <input 
                  type="text" 
                  placeholder="e.g. 1006 (Grains)"
                  value={newTax.hsn}
                  onChange={(e) => setNewTax({ ...newTax, hsn: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-[#ff5500]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border-none cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-[#ff5500] text-white text-xs font-bold rounded-xl border-none cursor-pointer shadow-md"
                >
                  Save Tax Slabs
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   16. ADMIN PROFILE PAGE
   ========================================================================= */
export const AdminProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    firstName: 'Harsh kkk',
    lastName: 'Panchal',
    email: 'harshvardhanpanc145@gmail.com',
    mobile: '9111966732',
    role: 'Super Admin',
    createdAt: '12/13/2025, 4:35:56 PM'
  });

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      {/* Title Bar & Breadcrumb */}
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <h1 className="text-xl font-bold text-slate-900 m-0">Admin Profile</h1>
        <div className="text-xs text-slate-500 font-medium">
          <span className="text-blue-600 font-semibold cursor-pointer">Home</span> / <span>Profile</span>
        </div>
      </div>

      {/* Main Profile Info Card */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-4">
        {/* Card Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-base font-bold text-slate-800 m-0">Profile Information</h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold rounded-xl border-none transition-all shadow-sm cursor-pointer"
          >
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>

        {/* Card Body */}
        {isEditing ? (
          <form onSubmit={handleSave} className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">First Name</label>
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Last Name</label>
                <input
                  type="text"
                  value={profile.lastName}
                  onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Mobile</label>
                <input
                  type="text"
                  value={profile.mobile}
                  onChange={(e) => setProfile({ ...profile, mobile: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl border-none cursor-pointer shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 text-xs">
            <div>
              <span className="text-slate-500 font-medium block mb-1.5">First Name</span>
              <span className="text-slate-800 font-semibold text-sm">{profile.firstName}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block mb-1.5">Last Name</span>
              <span className="text-slate-800 font-semibold text-sm">{profile.lastName}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block mb-1.5">Email</span>
              <span className="text-slate-800 font-semibold text-sm">{profile.email}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block mb-1.5">Mobile</span>
              <span className="text-slate-800 font-semibold text-sm">{profile.mobile}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block mb-1.5">Role</span>
              <span className="inline-block bg-blue-100 text-blue-600 font-bold px-3 py-1 rounded-full text-xs">
                {profile.role}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block mb-1.5">Created At</span>
              <span className="text-slate-800 font-semibold text-sm">{profile.createdAt}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* =========================================================================
   17. SKU AUDIT MANAGEMENT PAGE
   ========================================================================= */
export const SkuAuditManagement = () => {
  const [audits, setAudits] = React.useState([
    { sku: 'SKU-MOB-001', name: 'Smartphones (128GB)', category: 'Mobile & Accessories', expectedStock: 120, physicalStock: 120, discrepancy: 0, status: 'Verified', lastAudited: 'Today, 02:15 PM' },
    { sku: 'SKU-GROC-002', name: 'Pyaaj (1kg Pack)', category: 'Groceries', expectedStock: 50, physicalStock: 40, discrepancy: -10, status: 'Discrepancy', lastAudited: 'Today, 11:30 AM' },
    { sku: 'SKU-GROC-003', name: 'Aalu (1kg Pack)', category: 'Groceries', expectedStock: 1000, physicalStock: 1000, discrepancy: 0, status: 'Verified', lastAudited: 'Yesterday' },
  ]);

  const [search, setSearch] = React.useState('');

  const filteredAudits = audits.filter(a => 
    a.sku.toLowerCase().includes(search.toLowerCase()) || 
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">SKU Audit</h1>
        <div className="text-xs text-slate-500 font-medium">
          Dashboard / <span className="text-[#ff5500] font-semibold">SKU Audit</span>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Light Orange Banner Header */}
        <div className="bg-[#fff4ed] border-b border-orange-200/70 text-[#002625] px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-base font-bold tracking-tight text-[#002625] flex items-center gap-2">
              <ChevronRight size={18} className="text-[#ff5500]" />
              SKU Stock Verification & Audit
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verify physical warehouse inventory against system stock counts
            </p>
          </div>
          <button 
            onClick={() => alert('Starting new SKU Audit scan...')}
            className="px-4 py-2 bg-[#ff5500] hover:bg-[#e04a00] text-white text-xs font-bold rounded-xl border-none transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 shrink-0"
          >
            <Plus size={15} /> Perform Audit Scan
          </button>
        </div>

        {/* Toolbar & Search */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search SKU code, product name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50/60 border border-slate-200 rounded-md pl-9 pr-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-[#ff5500] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4">SKU CODE</th>
                  <th className="py-3.5 px-4">PRODUCT NAME</th>
                  <th className="py-3.5 px-4">CATEGORY</th>
                  <th className="py-3.5 px-4">SYSTEM STOCK</th>
                  <th className="py-3.5 px-4">AUDITED STOCK</th>
                  <th className="py-3.5 px-4">DISCREPANCY</th>
                  <th className="py-3.5 px-4">STATUS</th>
                  <th className="py-3.5 px-4 text-right">LAST AUDITED</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredAudits.map((item) => (
                  <tr key={item.sku} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#ff5500]">{item.sku}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{item.name}</td>
                    <td className="py-3.5 px-4 text-slate-600">{item.category}</td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">{item.expectedStock}</td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">{item.physicalStock}</td>
                    <td className="py-3.5 px-4 font-mono font-bold">
                      <span className={item.discrepancy < 0 ? 'text-rose-600' : 'text-emerald-600'}>
                        {item.discrepancy > 0 ? `+${item.discrepancy}` : item.discrepancy}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'Verified' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-500 font-medium">{item.lastAudited}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   18. SELLERS OVERVIEW PAGE
   ========================================================================= */
/* =========================================================================
   18. SELLERS OVERVIEW PAGE (WITH FULL SELLER DETAILS VIEW)
   ========================================================================= */
export const SellersOverview = () => {
  const [sellersList] = React.useState([
    {
      id: '14301495',
      name: 'ankit keshri',
      email: 'mahadeokeshri9065036488@gmail.com',
      storeName: 'Keshari Vagitl Shope',
      logoText: 'AK',
      logoBg: 'bg-lime-500',
      status: 'Pending',
      joinedOn: '12/7/2026',
      mobile: '9065036488',
      businessType: 'Vagitable',
      areaRadius: 'Dakra (5.1km)',
      taxInfo: 'None',
      address: 'Dakra, Churi, Jharkhand 829210, India',
      products: [
        { id: 'p1', name: 'Aalu', price: 25, stock: 1000, img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format&fit=crop&q=80' },
        { id: 'p2', name: 'Khira', price: 60, stock: 100, img: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=500&auto=format&fit=crop&q=80' },
        { id: 'p3', name: 'Pyaaj', price: 1000, stock: 40, img: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&auto=format&fit=crop&q=80' },
        { id: 'p4', name: 'Tamatar', price: 70, stock: 500, img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80' }
      ]
    },
    {
      id: '11305875',
      name: 'Deepanshu Kumar',
      email: 'live11media@gmail.com',
      storeName: 'Rahi hot food',
      logoText: 'DK',
      logoBg: 'bg-[#a3e635]',
      status: 'Approved',
      joinedOn: '23/6/2026',
      mobile: '9798996821',
      businessType: 'Fast Food',
      areaRadius: 'Ranchi (10km)',
      taxInfo: 'GST18290',
      address: 'Main Road, Ranchi, Jharkhand',
      products: [
        { id: 'p5', name: 'Burger', price: 99, stock: 200, img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80' },
        { id: 'p6', name: 'Pizza', price: 249, stock: 150, img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80' }
      ]
    }
  ]);

  const [search, setSearch] = React.useState('');
  const [selectedSeller, setSelectedSeller] = React.useState(null);
  const [activeTab, setActiveTab] = React.useState('All');
  const [isAddProductModalOpen, setIsAddProductModalOpen] = React.useState(false);
  const [newProduct, setNewProduct] = React.useState({ name: '', price: '', stock: '' });

  const filtered = sellersList.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.storeName.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const fileInputRef = React.useRef(null);
  const [productImagePreview, setProductImagePreview] = React.useState(null);

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProductImagePreview(url);
    }
  };

  // Add Product Handler
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;
    const added = {
      id: `p_${Date.now()}`,
      name: newProduct.name,
      price: Number(newProduct.price),
      stock: Number(newProduct.stock || 50),
      img: productImagePreview || 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&auto=format&fit=crop&q=80'
    };
    setSelectedSeller(prev => ({
      ...prev,
      products: [...prev.products, added]
    }));
    setNewProduct({ name: '', price: '', stock: '' });
    setProductImagePreview(null);
    setIsAddProductModalOpen(false);
  };

  // Delete Product Handler
  const handleDeleteProduct = (productId) => {
    if (window.confirm('Delete this product from inventory?')) {
      setSelectedSeller(prev => ({
        ...prev,
        products: prev.products.filter(p => p.id !== productId)
      }));
    }
  };

  // IF DETAILED SELLER PAGE IS ACTIVE
  if (selectedSeller) {
    return (
      <div className="space-y-6 animate-fadeIn pb-12">
        {/* Back Button & Store Header */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSelectedSeller(null)}
            className="w-9 h-9 rounded-full bg-white border border-slate-200 shadow-2xs flex items-center justify-center text-slate-700 hover:text-[#ff5500] hover:border-[#ff5500] cursor-pointer transition-all shrink-0"
            title="Back to Sellers List"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight m-0">{selectedSeller.storeName}</h1>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
              SELLER MANAGEMENT / <span className="text-[#ff5500]">{selectedSeller.name}</span>
            </p>
          </div>
        </div>

        {/* Top Cards Grid (Profile + Shop Overview) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          {/* Card 1: Seller Profile */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between items-center text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-orange-50 text-[#ff5500] font-extrabold flex items-center justify-center text-2xl border-2 border-orange-100 shadow-2xs">
              {selectedSeller.logoText}
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 m-0">{selectedSeller.name}</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedSeller.email}</p>
            </div>

            <div className="w-full pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">MOBILE</span>
              <span className="font-mono font-bold text-slate-800">{selectedSeller.mobile}</span>
            </div>

            <div className="w-full flex justify-between items-center text-xs">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">STATUS</span>
              <span className="font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 text-[11px]">
                {selectedSeller.status}
              </span>
            </div>
          </div>

          {/* Card 2: Shop Overview */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
            <h3 className="text-sm font-bold text-slate-900 m-0 flex items-center gap-2">
              <Store size={18} className="text-[#ff5500]" /> Shop Overview
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">BUSINESS TYPE</span>
                <span className="font-bold text-slate-900 text-sm">{selectedSeller.businessType}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">AREA / RADIUS</span>
                <span className="font-bold text-slate-900 text-sm">{selectedSeller.areaRadius}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">TAX INFO</span>
                <span className="font-bold text-slate-900 text-sm">{selectedSeller.taxInfo}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">JOINED</span>
                <span className="font-bold text-slate-900 text-sm">{selectedSeller.joinedOn}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 text-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">ADDRESS</span>
              <p className="text-slate-600 italic font-medium m-0">{selectedSeller.address}</p>
            </div>
          </div>
        </div>

        {/* Section 2: Inventory Control */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          
          {/* Header Bar with + Add Product Button */}
          <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="text-sm font-bold text-slate-900 m-0 flex items-center gap-2">
              <Package size={18} className="text-[#ff5500]" /> Inventory Control
            </h3>

            <button 
              onClick={() => setIsAddProductModalOpen(true)}
              className="px-4 py-2 bg-[#ff5500] hover:bg-[#e04a00] text-white text-xs font-bold rounded-xl border-none cursor-pointer flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 shrink-0"
            >
              <Plus size={15} /> Add Product
            </button>
          </div>

          {/* Filter Pill Tabs */}
          <div className="p-6 space-y-6">
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveTab('All')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold border-none cursor-pointer transition-all ${
                  activeTab === 'All' ? 'bg-[#ff5500] text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All ({selectedSeller.products.length})
              </button>
              <button 
                onClick={() => setActiveTab('1111111111')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold border-none cursor-pointer transition-all ${
                  activeTab === '1111111111' ? 'bg-[#ff5500] text-white shadow-2xs' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                }`}
              >
                1111111111
              </button>
            </div>

            {/* Products Card Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {selectedSeller.products.map((product) => (
                <div key={product.id} className="group bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden relative hover:shadow-md transition-all">
                  {/* Action Icons Overlay */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1 z-10 opacity-90">
                    <button 
                      onClick={() => alert(`Edit product: ${product.name}`)}
                      className="w-7 h-7 rounded-full bg-white text-teal-600 border border-slate-200 shadow-2xs flex items-center justify-center cursor-pointer hover:bg-teal-50"
                      title="Edit Product"
                    >
                      <Edit3 size={12} />
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(product.id)}
                      className="w-7 h-7 rounded-full bg-white text-rose-600 border border-slate-200 shadow-2xs flex items-center justify-center cursor-pointer hover:bg-rose-50"
                      title="Delete Product"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>

                  {/* Product Image */}
                  <div className="h-32 bg-slate-50 overflow-hidden flex items-center justify-center">
                    <img 
                      src={product.img} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-3.5 space-y-2">
                    <h4 className="text-xs font-bold text-slate-900 m-0 truncate">{product.name}</h4>
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-[#ff5500] text-xs">₹{product.price}</span>
                      <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200">
                        {product.stock}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add Product Modal matching full detailed layout */}
        {isAddProductModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-fadeIn">
              {/* Header with theme color */}
              <div className="bg-[#fff4ed] border-b border-orange-200/70 text-[#002625] px-6 py-4 flex items-center justify-between">
                <h3 className="text-base font-bold text-[#002625] m-0 flex items-center gap-2">
                  <Plus size={18} className="text-[#ff5500]" />
                  Add New Product
                </h3>
                <button 
                  onClick={() => setIsAddProductModalOpen(false)}
                  className="text-slate-400 hover:text-slate-900 border-none bg-transparent cursor-pointer text-xl font-bold p-1 leading-none"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Left Column: Form Fields */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Product Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Enter product name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-[#ff5500]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                        <select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 outline-none focus:border-[#ff5500] bg-slate-50 cursor-pointer">
                          <option value="">Select</option>
                          <option value="vagitable">Vagitable</option>
                          <option value="groceries">Groceries</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Subcategory</label>
                        <select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 outline-none focus:border-[#ff5500] bg-slate-50 cursor-pointer">
                          <option value="">Select</option>
                          <option value="fresh">Fresh Vegetables</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Price</label>
                        <input 
                          type="number" 
                          required
                          placeholder="0.00"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                          className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-[#ff5500]"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Stock</label>
                        <input 
                          type="number" 
                          placeholder="0"
                          value={newProduct.stock}
                          onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                          className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-[#ff5500]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Image Upload & Description */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Product Image</label>
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-200 hover:border-[#ff5500] rounded-2xl p-4 text-center bg-slate-50/50 hover:bg-orange-50/20 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[140px] relative overflow-hidden group"
                      >
                        {productImagePreview ? (
                          <div className="relative w-full h-32">
                            <img src={productImagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl text-white font-bold text-xs">
                              Change Image
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="w-10 h-10 rounded-full bg-orange-50 text-[#ff5500] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                              <Plus size={20} />
                            </div>
                            <span className="text-xs font-bold text-slate-600 group-hover:text-[#ff5500] transition-colors">Upload Image</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
                      <textarea 
                        rows="3"
                        placeholder="Brief description..."
                        className="w-full border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none focus:border-[#ff5500] resize-none"
                      ></textarea>
                    </div>
                  </div>

                </div>

                {/* Modal Action Buttons */}
                <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
                  <button 
                    type="button"
                    onClick={() => setIsAddProductModalOpen(false)}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border-none cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2.5 bg-[#ff5500] hover:bg-[#e04a00] text-white text-xs font-bold rounded-xl border-none cursor-pointer shadow-2xs transition-all active:scale-95"
                  >
                    Create Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // MAIN SELLERS LIST VIEW WITH DETAILS MODAL POPUP
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header & Breadcrumb */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Sellers</h1>
        <div className="text-xs text-slate-500 font-medium">
          Dashboard / <span className="text-[#ff5500] font-semibold">Sellers</span>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Light Orange Header Banner with Integrated Search Input */}
        <div className="bg-[#fff4ed] border-b border-orange-200/70 text-[#002625] px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h2 className="text-base font-bold tracking-tight text-[#002625] flex items-center gap-2 m-0">
            <ChevronRight size={18} className="text-[#ff5500]" />
            Seller Management
          </h2>

          <div className="relative w-full sm:w-64">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search sellers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-[#ff5500] transition-all"
            />
          </div>
        </div>

        {/* Sellers Overview Table */}
        <div className="p-6">
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4 text-center w-16">LOGO</th>
                  <th className="py-3.5 px-4">SELLER INFO</th>
                  <th className="py-3.5 px-4">STORE NAME</th>
                  <th className="py-3.5 px-4">STATUS</th>
                  <th className="py-3.5 px-4">JOINED ON</th>
                  <th className="py-3.5 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((seller) => (
                  <tr key={seller.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* LOGO */}
                    <td className="py-3.5 px-4 text-center">
                      <span className={`w-8 h-8 rounded-full ${seller.logoBg} text-white font-extrabold flex items-center justify-center mx-auto text-xs shadow-2xs`}>
                        {seller.logoText}
                      </span>
                    </td>

                    {/* SELLER INFO */}
                    <td className="py-3.5 px-4 space-y-0.5">
                      <p className="font-bold text-slate-900 text-xs">{seller.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{seller.email}</p>
                    </td>

                    {/* STORE NAME */}
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{seller.storeName}</td>

                    {/* STATUS */}
                    <td className="py-3.5 px-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                        seller.status === 'Approved' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {seller.status}
                      </span>
                    </td>

                    {/* JOINED ON */}
                    <td className="py-3.5 px-4 font-mono text-slate-600 font-medium">{seller.joinedOn}</td>

                    {/* ACTIONS */}
                    <td className="py-3.5 px-4 text-right">
                      <button 
                        onClick={() => setSelectedSeller(seller)}
                        className="text-[#ff5500] hover:text-[#e04a00] font-bold text-xs cursor-pointer border-none bg-transparent hover:underline"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SELLER DETAILS MODAL POPUP */}
      {selectedSeller && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-50 rounded-2xl max-w-5xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-fadeIn my-6 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-[#fff4ed] border-b border-orange-200/70 text-[#002625] px-6 py-4 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-base font-bold text-[#002625] m-0">{selectedSeller.storeName}</h3>
                <p className="text-xs text-slate-500 mt-0.5 uppercase tracking-wider font-semibold">
                  SELLER MANAGEMENT / <span className="text-[#ff5500]">{selectedSeller.name}</span>
                </p>
              </div>
              <button 
                onClick={() => setSelectedSeller(null)}
                className="text-slate-400 hover:text-slate-900 border-none bg-transparent cursor-pointer text-2xl font-bold p-1 leading-none"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
              
              {/* Top Cards Grid (Profile + Shop Overview) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                
                {/* Card 1: Seller Profile */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between items-center text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-orange-50 text-[#ff5500] font-extrabold flex items-center justify-center text-2xl border-2 border-orange-100 shadow-2xs">
                    {selectedSeller.logoText}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 m-0">{selectedSeller.name}</h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedSeller.email}</p>
                  </div>

                  <div className="w-full pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">MOBILE</span>
                    <span className="font-mono font-bold text-slate-800">{selectedSeller.mobile}</span>
                  </div>

                  <div className="w-full flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">STATUS</span>
                    <span className="font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 text-[11px]">
                      {selectedSeller.status}
                    </span>
                  </div>
                </div>

                {/* Card 2: Shop Overview */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
                  <h3 className="text-sm font-bold text-slate-900 m-0 flex items-center gap-2">
                    <Store size={18} className="text-[#ff5500]" /> Shop Overview
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">BUSINESS TYPE</span>
                      <span className="font-bold text-slate-900 text-sm">{selectedSeller.businessType}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">AREA / RADIUS</span>
                      <span className="font-bold text-slate-900 text-sm">{selectedSeller.areaRadius}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">TAX INFO</span>
                      <span className="font-bold text-slate-900 text-sm">{selectedSeller.taxInfo}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">JOINED</span>
                      <span className="font-bold text-slate-900 text-sm">{selectedSeller.joinedOn}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 text-xs">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">ADDRESS</span>
                    <p className="text-slate-600 italic font-medium m-0">{selectedSeller.address}</p>
                  </div>
                </div>
              </div>

              {/* Section 2: Inventory Control */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                
                {/* Header Bar with + Add Product Button */}
                <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <h3 className="text-sm font-bold text-slate-900 m-0 flex items-center gap-2">
                    <Package size={18} className="text-teal-600" /> Inventory Control
                  </h3>

                  <button 
                    onClick={() => setIsAddProductModalOpen(true)}
                    className="px-4 py-2 bg-[#ff5500] hover:bg-[#e04a00] text-white text-xs font-bold rounded-xl border-none cursor-pointer flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 shrink-0"
                  >
                    <Plus size={15} /> Add Product
                  </button>
                </div>

                {/* Filter Pill Tabs */}
                <div className="p-6 space-y-6">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setActiveTab('All')}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold border-none cursor-pointer transition-all ${
                        activeTab === 'All' ? 'bg-[#ff5500] text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      All ({selectedSeller.products.length})
                    </button>
                    <button 
                      onClick={() => setActiveTab('1111111111')}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold border-none cursor-pointer transition-all ${
                        activeTab === '1111111111' ? 'bg-[#ff5500] text-white shadow-2xs' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      1111111111
                    </button>
                  </div>

                  {/* Products Card Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {selectedSeller.products.map((product) => (
                      <div key={product.id} className="group bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden relative hover:shadow-md transition-all">
                        {/* Action Icons Overlay */}
                        <div className="absolute top-2 right-2 flex flex-col gap-1 z-10 opacity-90">
                          <button 
                            onClick={() => alert(`Edit product: ${product.name}`)}
                            className="w-7 h-7 rounded-full bg-white text-teal-600 border border-slate-200 shadow-2xs flex items-center justify-center cursor-pointer hover:bg-teal-50"
                            title="Edit Product"
                          >
                            <Edit3 size={12} />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="w-7 h-7 rounded-full bg-white text-rose-600 border border-slate-200 shadow-2xs flex items-center justify-center cursor-pointer hover:bg-rose-50"
                            title="Delete Product"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>

                        {/* Product Image */}
                        <div className="h-32 bg-slate-50 overflow-hidden flex items-center justify-center">
                          <img 
                            src={product.img} 
                            alt={product.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="p-3.5 space-y-2">
                          <h4 className="text-xs font-bold text-slate-900 m-0 truncate">{product.name}</h4>
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-[#ff5500] text-xs">₹{product.price}</span>
                            <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200">
                              {product.stock}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-end shrink-0">
              <button 
                onClick={() => setSelectedSeller(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl border-none cursor-pointer transition-colors"
              >
                Close Details
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Add Product Modal matching user screenshot */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-fadeIn">
            {/* Header with theme color */}
            <div className="bg-[#fff4ed] border-b border-orange-200/70 text-[#002625] px-6 py-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-[#002625] m-0 flex items-center gap-2">
                <Plus size={18} className="text-[#ff5500]" />
                Add New Product
              </h3>
              <button 
                onClick={() => setIsAddProductModalOpen(false)}
                className="text-slate-400 hover:text-slate-900 border-none bg-transparent cursor-pointer text-xl font-bold p-1 leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left Column: Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Product Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Enter product name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-[#ff5500]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                      <select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 outline-none focus:border-[#ff5500] bg-slate-50 cursor-pointer">
                        <option value="">Select</option>
                        <option value="vagitable">Vagitable</option>
                        <option value="groceries">Groceries</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Subcategory</label>
                      <select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 outline-none focus:border-[#ff5500] bg-slate-50 cursor-pointer">
                        <option value="">Select</option>
                        <option value="fresh">Fresh Vegetables</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Price</label>
                      <input 
                        type="number" 
                        required
                        placeholder="0.00"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-[#ff5500]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Stock</label>
                      <input 
                        type="number" 
                        placeholder="0"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-[#ff5500]"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column: Image Upload & Description */}
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Product Image</label>
                    <input 
                      type="file" 
                      onChange={handleImageFileChange}
                      className="hidden"
                      id="modal-product-image-file-input"
                    />
                    <label 
                      htmlFor="modal-product-image-file-input"
                      className="border-2 border-dashed border-slate-200 hover:border-[#ff5500] rounded-2xl p-4 text-center bg-slate-50/50 hover:bg-orange-50/20 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[140px] relative overflow-hidden group block"
                    >
                      {productImagePreview ? (
                        <div className="relative w-full h-32">
                          <img src={productImagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl text-white font-bold text-xs">
                            Change Image
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-10 h-10 rounded-full bg-orange-50 text-[#ff5500] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform mx-auto">
                            <Plus size={20} />
                          </div>
                          <span className="text-xs font-bold text-slate-600 group-hover:text-[#ff5500] transition-colors">Upload Image</span>
                        </>
                      )}
                    </label>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
                    <textarea 
                      rows="3"
                      placeholder="Brief description..."
                      className="w-full border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none focus:border-[#ff5500] resize-none"
                    ></textarea>
                  </div>
                </div>

              </div>

              {/* Modal Action Buttons */}
              <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setIsAddProductModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border-none cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 bg-[#ff5500] hover:bg-[#e04a00] text-white text-xs font-bold rounded-xl border-none cursor-pointer shadow-2xs transition-all active:scale-95"
                >
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   NEW DEDICATED ADD PRODUCT PAGE
   ========================================================================= */
export const AddProductPage = () => {
  const { setActiveTab, editingProductData, setEditingProductData } = useAdmin();

  const initialData = editingProductData ? {
    id: editingProductData.id || editingProductData._id,
    name: editingProductData.name || '',
    category: editingProductData.category || 'Groceries & Grains',
    subCategory: editingProductData.subCategory || 'Grains & Pulses',
    brand: editingProductData.brand || 'ShippNex Select',
    unit: editingProductData.variation || editingProductData.unit || '1kg',
    unitValue: editingProductData.unitValue || '1',
    unitType: editingProductData.unitType || 'kg',
    description: editingProductData.description || '',
    mrp: editingProductData.mrp || editingProductData.originalPrice || editingProductData.price || '',
    salePrice: editingProductData.salePrice || editingProductData.price || '',
    taxRate: editingProductData.taxRate || '5%',
    hsnCode: editingProductData.hsnCode || '0713',
    stock: editingProductData.stock !== undefined ? editingProductData.stock : '',
    minStockLimit: editingProductData.minStockLimit || '10',
    sku: editingProductData.sku || editingProductData.id || '',
    seller: editingProductData.seller || 'ShippNex Official Store',
    status: editingProductData.status || 'Published',
    isFeatured: editingProductData.isFeatured || false,
    mainImage: editingProductData.image || editingProductData.mainImage || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
    mainImageFile: null,
    galleryImages: editingProductData.galleryImages || []
  } : {
    name: '',
    category: 'Groceries & Grains',
    subCategory: 'Grains & Pulses',
    brand: 'ShippNex Select',
    unit: '1kg',
    unitValue: '1',
    unitType: 'kg',
    description: '',
    mrp: '',
    salePrice: '',
    taxRate: '5%',
    hsnCode: '0713',
    stock: '',
    minStockLimit: '10',
    sku: '',
    seller: 'ShippNex Official Store',
    status: 'Published',
    isFeatured: false,
    mainImage: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
    mainImageFile: null,
    galleryImages: []
  };

  const [formData, setFormData] = React.useState(initialData);

  // Dynamic Categories State
  const [dynamicCategoryMap, setDynamicCategoryMap] = React.useState({});
  const [registeredCategories, setRegisteredCategories] = React.useState([]);

  React.useEffect(() => {
    const fetchRegisteredCategories = async () => {
      try {
        const res = await categoryService.getCategories();
        if (res && res.categories && res.categories.length > 0) {
          const flat = res.categories;
          const map = {};
          const idToName = {};
          
          flat.forEach(c => {
            idToName[c._id] = c.name;
            if (!c.parent) {
              map[c.name] = [];
            }
          });
          
          flat.forEach(c => {
            if (c.parent) {
              const parentName = idToName[c.parent];
              if (parentName && map[parentName]) {
                map[parentName].push(c.name);
              }
            }
          });
          
          setDynamicCategoryMap(map);
          setRegisteredCategories(Object.keys(map));
          
          if (Object.keys(map).length > 0) {
            const firstCat = Object.keys(map)[0];
            const firstSub = map[firstCat].length > 0 ? map[firstCat][0] : 'None';
            setFormData(prev => ({
              ...prev,
              category: prev.category && map[prev.category] ? prev.category : firstCat,
              subCategory: prev.category && map[prev.category] ? (map[prev.category].length > 0 ? map[prev.category][0] : 'None') : firstSub
            }));
          }
        }
      } catch (err) {
        console.warn('Using registered category catalog fallback:', err.message);
      }
    };
    fetchRegisteredCategories();
  }, []);

  const handleCategorySelectChange = (newCategory) => {
    const availableSubs = dynamicCategoryMap[newCategory] || [];
    setFormData(prev => ({
      ...prev,
      category: newCategory,
      subCategory: availableSubs.length > 0 ? availableSubs[0] : 'None'
    }));
  };

  const currentSubCategories = dynamicCategoryMap[formData.category] || [];
  const displaySubCategories = currentSubCategories.length > 0 ? currentSubCategories : ['None'];

  // Multiple Homepage Sections Selection State
  const [selectedHomeSections, setSelectedHomeSections] = React.useState(() => {
    if (editingProductData && Array.isArray(editingProductData.homeSections)) {
      return editingProductData.homeSections;
    }
    return ['flash_sale', 'bestseller'];
  });

  const [toastMsg, setToastMsg] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [createdSuccessModal, setCreatedSuccessModal] = React.useState(null);
  const fileInputRef = React.useRef(null);
  const multipleFileInputRef = React.useRef(null);

  const availableSections = [
    { id: 'flash_sale', name: 'Flash Sale', description: 'Limited-time deals with countdown timer', badge: 'Flash Sale' },
    { id: 'best_deals', name: 'Best Deals', description: 'Special discounted deal cards on Homepage', badge: 'Best Deals' },
    { id: 'featured', name: 'Featured Products', description: 'Top highlighted products on Homepage', badge: 'Featured' },
    { id: 'bestseller', name: 'Bestseller', description: 'Showcase in Top Bestseller carousel cards', badge: 'Bestseller' },
    { id: 'trending', name: 'Trending', description: 'Popular trending items section', badge: 'Trending' },
    { id: 'new_arrivals', name: 'New Arrivals', description: 'Newly launched product additions', badge: 'New Arrival' },
    { id: 'recommended', name: 'Recommended', description: 'Personalized recommendation widget', badge: 'Recommended' },
    { id: 'category_featured', name: 'Category Deals', description: 'Highlight under daily category grid', badge: 'Category' }
  ];

  const toggleHomeSection = (sectionId) => {
    setSelectedHomeSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const resetForm = () => {
    setFormData(initialData);
    setCreatedSuccessModal(null);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMultipleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    // We only take up to 3 images max
    const maxFiles = files.slice(0, 3);
    
    maxFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const resultUrl = event.target.result;
        setFormData(prev => {
          const newGallery = [...(prev.galleryImages || [])];
          if (newGallery.length < 3) {
            newGallery.push(resultUrl);
          }
          return { ...prev, galleryImages: newGallery };
        });
      };
      reader.readAsDataURL(file);
    });
    
    showToast(`${maxFiles.length} gallery images uploaded!`);
  };

  const removeGalleryImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleDeviceFileUpload = (e, field) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const resultUrl = event.target.result;
        setFormData(prev => ({
          ...prev,
          [field]: resultUrl,
          [`${field}File`]: file.name
        }));
        showToast(`Image "${file.name}" selected from device!`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (e, statusToSave = 'Published') => {
    e.preventDefault();
    setIsSubmitting(true);
    let res = null;
    try {
      const payload = {
        ...formData,
        homeSections: selectedHomeSections,
        status: statusToSave
      };

      if (editingProductData && (editingProductData._id || editingProductData.id)) {
        res = await productService.updateProduct(editingProductData._id || editingProductData.id, payload);
      } else {
        res = await productService.createProduct(payload);
      }
    } catch (err) {
      console.warn('Backend API submission fallback:', err.message);
    } finally {
      setIsSubmitting(false);

      const generatedSku = res?.product?.sku || formData.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`;
      const newProductObj = {
        _id: res?.product?._id || editingProductData?._id,
        id: res?.product?._id || editingProductData?.id || generatedSku,
        name: formData.name || 'New Product',
        seller: formData.seller || 'ShippNex Official Store',
        category: formData.category,
        subCategory: formData.subCategory,
        image: formData.mainImage || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
        galleryImages: formData.galleryImages || [],
        variation: `${formData.unitValue || 1} ${formData.unitType || 'kg'}`,
        stock: Number(formData.stock || 0),
        status: statusToSave,
        mrp: Number(formData.mrp || 0),
        salePrice: Number(formData.salePrice || 0),
        homeSections: selectedHomeSections
      };

      const existingLocal = JSON.parse(localStorage.getItem('shippnex_custom_products') || '[]');
      const updatedLocal = [newProductObj, ...existingLocal.filter(p => p.id !== newProductObj.id)];
      localStorage.setItem('shippnex_custom_products', JSON.stringify(updatedLocal));

      setCreatedSuccessModal(newProductObj);
      showToast(`Product "${formData.name}" ${editingProductData ? 'updated' : 'added'} successfully!`);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16 font-sans relative">
      {/* Product Creation Success Modal */}
      {createdSuccessModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-scaleUp border border-slate-100">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle size={36} />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-xl font-extrabold text-slate-900 m-0">Product {editingProductData ? 'Updated' : 'Added'} Successfully!</h3>
              <p className="text-xs text-slate-500">The product has been saved and is now listed in All Products.</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center gap-3.5">
              <img 
                src={createdSuccessModal.image} 
                alt={createdSuccessModal.name} 
                className="w-14 h-14 rounded-xl object-cover border border-slate-200 bg-white shrink-0" 
              />
              <div className="space-y-0.5 flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-900 m-0 truncate">{createdSuccessModal.name}</h4>
                <p className="text-[11px] font-mono text-slate-400 m-0">SKU: <span className="font-semibold text-slate-700">{createdSuccessModal.id}</span></p>
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="text-xs font-extrabold text-[#ff5500]">₹{createdSuccessModal.salePrice}</span>
                  <span className="text-[10px] text-slate-400 line-through">₹{createdSuccessModal.mrp}</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.2 rounded">
                    Stock: {createdSuccessModal.stock}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button 
                type="button"
                onClick={() => setActiveTab('products')}
                className="flex-1 px-4 py-3 bg-[#ff5500] hover:bg-[#e04a00] text-white text-xs font-bold rounded-xl border-none cursor-pointer shadow-md transition-all text-center flex items-center justify-center gap-1.5"
              >
                <Package size={16} /> View All Products List
              </button>
              <button 
                type="button"
                onClick={resetForm}
                className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 cursor-pointer transition-all text-center flex items-center justify-center gap-1.5"
              >
                <Plus size={16} /> Add Another Product
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-bounce">
          <CheckCircle size={18} className="text-emerald-400" />
          <span className="text-sm font-medium">{toastMsg}</span>
        </div>
      )}

      {/* Clean Page Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Add New Product</h2>
        <p className="text-xs text-slate-500">Create and list new items with pricing, stock limits, media, and homepage section mapping</p>
      </div>

      <form onSubmit={(e) => handleFormSubmit(e, 'Published')} className="max-w-4xl mx-auto space-y-6">
        {/* Card 1: Basic Information */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <FileText size={18} className="text-[#ff5500]" /> General Product Information
          </h3>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Product Name *</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Premium Organics Basmati Rice"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-[#ff5500]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Registered Category *</label>
              <select 
                value={formData.category}
                onChange={(e) => handleCategorySelectChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-[#ff5500]"
              >
                {registeredCategories.map(catName => (
                  <option key={catName} value={catName}>{catName}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Sub-Category *</label>
              <select 
                value={formData.subCategory}
                onChange={(e) => handleInputChange('subCategory', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#ff5500]"
              >
                {displaySubCategories.map(subName => (
                  <option key={subName} value={subName}>{subName}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Brand</label>
              <input 
                type="text" 
                placeholder="e.g. Fortune / Daawat"
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#ff5500]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Unit / Weight Variant *</label>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  required
                  placeholder="Quantity (e.g. 1, 500, 250)"
                  value={formData.unitValue}
                  onChange={(e) => handleInputChange('unitValue', e.target.value)}
                  className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#ff5500]"
                />
                <select 
                  value={formData.unitType}
                  onChange={(e) => handleInputChange('unitType', e.target.value)}
                  className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#ff5500]"
                >
                  <option value="kg">kg (Kilograms)</option>
                  <option value="g">g (Grams)</option>
                  <option value="L">L (Liters)</option>
                  <option value="ml">ml (Milliliters)</option>
                  <option value="Pcs">Pcs (Pieces)</option>
                  <option value="Pack">Pack</option>
                  <option value="Dozen">Dozen (12 Pcs)</option>
                  <option value="Bunch">Bunch</option>
                  <option value="Box">Box</option>
                  <option value="Bottle">Bottle</option>
                  <option value="Sachet">Sachet</option>
                  <option value="Combo">Combo Pack</option>
                </select>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Preview Variant: <span className="font-semibold text-[#ff5500]">{formData.unitValue || '1'} {formData.unitType || 'kg'}</span></p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Seller / Merchant</label>
              <select 
                value={formData.seller}
                onChange={(e) => handleInputChange('seller', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#ff5500]"
              >
                <option value="ShippNex Official Store">ShippNex Official Warehouse</option>
                <option value="Keshari Vagitl Shope">Keshari Vagitl Shope</option>
                <option value="Fresh Farm Supermarket">Fresh Farm Supermarket</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Product Description</label>
            <textarea 
              rows={4}
              placeholder="Write a brief overview of product freshness, origin, quality certification..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#ff5500]"
            />
          </div>
        </div>

        {/* Card 2: Device File Upload Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Upload size={18} className="text-[#ff5500]" /> Product Image Upload
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Upload Primary Image from Device *</label>
              
              {/* Hidden File Input */}
              <input 
                type="file" 
                ref={fileInputRef}
                accept="image/*"
                onClick={(e) => { e.target.value = null; }}
                onChange={(e) => handleDeviceFileUpload(e, 'mainImage')}
                className="hidden"
              />

              {/* Device Upload Drag & Drop Dropzone */}
              <div 
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                className="border-2 border-dashed border-slate-300 hover:border-[#ff5500] bg-slate-50 hover:bg-orange-50/40 rounded-2xl p-6 text-center cursor-pointer transition-all space-y-2 group"
              >
                <div className="w-12 h-12 rounded-full bg-orange-100 group-hover:bg-[#ff5500] text-[#ff5500] group-hover:text-white flex items-center justify-center mx-auto transition-colors">
                  <Upload size={22} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 group-hover:text-[#ff5500]">
                    Click to Browse or Upload Image
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">Supports PNG, JPG, WEBP from your computer device</p>
                </div>
              </div>
            </div>

            {/* Uploaded Image Live Preview Box */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Device Upload Preview</label>
              <div className="h-44 w-full rounded-2xl overflow-hidden border border-slate-200 relative group bg-slate-100 flex items-center justify-center">
                {formData.mainImage ? (
                  <>
                    <img src={formData.mainImage} alt="Uploaded Product" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button 
                        type="button"
                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                        className="px-3.5 py-1.5 bg-white text-slate-900 rounded-lg text-xs font-semibold border-none cursor-pointer shadow-md"
                      >
                        Change Image
                      </button>
                    </div>
                  </>
                ) : (
                  <span className="text-xs text-slate-400 font-medium">No Image Selected</span>
                )}
              </div>
              {formData.mainImageFile && (
                <p className="text-xs font-mono text-emerald-600 font-medium mt-1">Selected file: {formData.mainImageFile}</p>
              )}
            </div>
          </div>
        </div>

        {/* Card 2.5: Product Gallery Images (Max 3) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Upload size={18} className="text-[#ff5500]" /> Product Gallery Images
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Upload up to 3 Gallery Images</label>
              <input 
                type="file" 
                ref={multipleFileInputRef}
                accept="image/*"
                multiple
                onClick={(e) => { e.target.value = null; }}
                onChange={handleMultipleFileUpload}
                className="hidden"
              />
              <div 
                onClick={() => multipleFileInputRef.current && multipleFileInputRef.current.click()}
                className="border-2 border-dashed border-slate-300 hover:border-[#ff5500] bg-slate-50 hover:bg-orange-50/40 rounded-2xl p-6 text-center cursor-pointer transition-all space-y-2 group"
              >
                <div className="w-12 h-12 rounded-full bg-orange-100 group-hover:bg-[#ff5500] text-[#ff5500] group-hover:text-white flex items-center justify-center mx-auto transition-colors">
                  <Upload size={22} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 group-hover:text-[#ff5500]">
                    Select Multiple Images
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">Supports PNG, JPG, WEBP</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Gallery Preview ({formData.galleryImages?.length || 0}/3)</label>
              <div className="flex flex-wrap gap-3">
                {formData.galleryImages && formData.galleryImages.length > 0 ? (
                  formData.galleryImages.map((imgBase64, idx) => (
                    <div key={idx} className="h-24 w-24 rounded-xl overflow-hidden border border-slate-200 relative group">
                      <img src={imgBase64} alt={`Gallery ${idx+1}`} className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          type="button"
                          onClick={() => removeGalleryImage(idx)}
                          className="w-6 h-6 rounded-full bg-white text-red-600 flex items-center justify-center shadow hover:bg-red-50 hover:text-red-700 cursor-pointer border-none"
                        >
                          &times;
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-24 w-full rounded-xl bg-slate-50 border border-slate-200 border-dashed flex items-center justify-center text-slate-400 text-xs font-medium">
                    No gallery images uploaded
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Homepage Section Selection (Multi-Select Checkboxes) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Tag size={18} className="text-[#ff5500]" /> Display on Homepage Sections
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Select one or multiple sections on the Customer App Homepage where this product will be shown.</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-[#ff5500]">
              {selectedHomeSections.length} Selected
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
            {availableSections.map(sec => {
              const isSelected = selectedHomeSections.includes(sec.id);
              return (
                <div 
                  key={sec.id}
                  onClick={() => toggleHomeSection(sec.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    isSelected 
                      ? 'bg-orange-50/60 border-[#ff5500] shadow-2xs' 
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input 
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}} // Handled by parent div
                    className="mt-1 w-4 h-4 accent-[#ff5500] cursor-pointer"
                  />
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-900">{sec.name}</span>
                      <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                        {sec.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 m-0">{sec.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 4: Pricing & Tax */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <DollarSign size={18} className="text-[#ff5500]" /> Pricing, Discounts & Taxation
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">MRP Price (₹) *</label>
              <input 
                type="number" 
                required
                placeholder="95.00"
                value={formData.mrp}
                onChange={(e) => handleInputChange('mrp', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#ff5500]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Selling Price (₹) *</label>
              <input 
                type="number" 
                required
                placeholder="75.00"
                value={formData.salePrice}
                onChange={(e) => handleInputChange('salePrice', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-[#ff5500] focus:outline-none focus:border-[#ff5500]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">GST Tax Rate</label>
              <select 
                value={formData.taxRate}
                onChange={(e) => handleInputChange('taxRate', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#ff5500]"
              >
                <option value="0%">0% (Exempt)</option>
                <option value="5%">5% GST</option>
                <option value="12%">12% GST</option>
                <option value="18%">18% GST</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">HSN Code</label>
              <input 
                type="text" 
                placeholder="e.g. 0713"
                value={formData.hsnCode}
                onChange={(e) => handleInputChange('hsnCode', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#ff5500]"
              />
            </div>
          </div>
        </div>

        {/* Card 5: Inventory & SKU */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Boxes size={18} className="text-[#ff5500]" /> Inventory & Stock Control
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Initial Stock Quantity *</label>
              <input 
                type="number" 
                required
                placeholder="100"
                value={formData.stock}
                onChange={(e) => handleInputChange('stock', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#ff5500]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Min Stock Alert Limit</label>
              <input 
                type="number" 
                placeholder="10"
                value={formData.minStockLimit}
                onChange={(e) => handleInputChange('minStockLimit', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#ff5500]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">SKU / Barcode ID</label>
              <input 
                type="text" 
                placeholder="SKU-GR-9012"
                value={formData.sku}
                onChange={(e) => handleInputChange('sku', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-mono text-slate-900 focus:outline-none focus:border-[#ff5500]"
              />
            </div>
          </div>
        </div>

        {/* Add Product Submit Button at the Very End */}
        <div className="pt-4 flex justify-end">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#ff5500] hover:bg-[#e04a00] text-white text-base font-semibold rounded-xl border-none cursor-pointer shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {isSubmitting ? 'Saving Product...' : (editingProductData ? 'Update Product' : 'Add Product')}
          </button>
        </div>
      </form>
    </div>
  );
};

/* =========================================================================
   ADMIN SETTLEMENTS & COMMISSION REPORT PAGE
   ========================================================================= */
export const AdminSettlementsReport = () => {
  const [settlements, setSettlements] = React.useState([]);
  const [summary, setSummary] = React.useState({ totalCommissionEarned: 0, totalSettledAmount: 0, totalTransactions: 0 });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchSettlements();
  }, []);

  const fetchSettlements = async () => {
    setLoading(true);
    try {
      const res = await walletService.getAdminSettlements();
      if (res && res.success) {
        setSettlements(res.settlements || []);
        setSummary(res.summary || {});
      }
    } catch (err) {
      console.error('Error fetching admin settlements:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Admin Commission & Settlements</h2>
          <p className="text-xs text-slate-500">Live order settlement records and platform commission earned from sellers.</p>
        </div>
        <button 
          onClick={fetchSettlements} 
          className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer shadow-xs hover:bg-slate-50"
        >
          Refresh Report
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase">Total Admin Commission</span>
          <p className="text-2xl font-black text-[#ff7526]">₹{Number(summary.totalCommissionEarned || 0).toFixed(2)}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase">Total Seller Wallet Credits</span>
          <p className="text-2xl font-black text-emerald-600">₹{Number(summary.totalSettledAmount || 0).toFixed(2)}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase">Total Settlements</span>
          <p className="text-2xl font-black text-slate-900">{summary.totalTransactions || 0}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                <th className="py-3.5 px-4 font-bold">Order ID</th>
                <th className="py-3.5 px-4 font-bold">Seller</th>
                <th className="py-3.5 px-4 font-bold">Customer</th>
                <th className="py-3.5 px-4 font-bold">Gross Amount</th>
                <th className="py-3.5 px-4 font-bold">Commission %</th>
                <th className="py-3.5 px-4 font-bold">Commission Earned</th>
                <th className="py-3.5 px-4 font-bold">Net Seller Amount</th>
                <th className="py-3.5 px-4 font-bold">Payment</th>
                <th className="py-3.5 px-4 font-bold">Settlement Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-normal">
              {settlements.map((s) => (
                <tr key={s._id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#ff7526]">{s.orderId}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{s.sellerName}</td>
                  <td className="py-3.5 px-4 text-slate-700">{s.customerDetails?.name || 'Customer'}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">₹{Number(s.totalAmount || 0).toFixed(2)}</td>
                  <td className="py-3.5 px-4 font-extrabold text-blue-600">{s.commissionRate || 10}%</td>
                  <td className="py-3.5 px-4 font-extrabold text-[#ff7526]">₹{Number(s.commissionAmount || 0).toFixed(2)}</td>
                  <td className="py-3.5 px-4 font-extrabold text-emerald-600">₹{Number(s.netSellerAmount || 0).toFixed(2)}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-600">{s.paymentMethod} ({s.paymentStatus})</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                      s.settlementStatus === 'SETTLED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {s.settlementStatus}
                    </span>
                  </td>
                </tr>
              ))}

              {!loading && settlements.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-slate-400 text-xs">
                    No order settlement records found yet.
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


