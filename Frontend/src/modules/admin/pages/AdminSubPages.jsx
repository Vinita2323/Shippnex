import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { StatusBadge, Drawer } from '../components/AdminUIComponents';
import { mockUsers, mockSellers, mockDrivers, mockWarehouses, mockCategories, mockProducts, mockOrders, mockDeliveries, mockPayments, mockCoupons, mockNotifications, mockRoles, mockFaqs } from '../mock/adminMockData';
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
  Trash2,
  Upload
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
  const [sellers, setSellers] = React.useState([
    {
      id: '14301495',
      name: 'ankit keshri',
      storeName: 'Keshari Vagitl Shope',
      contactPhone: '9065036488',
      contactEmail: 'mahadeokeshri9065036488@gmail.com',
      logoText: 'AK',
      logoBg: 'bg-lime-500',
      balance: '0.00',
      commission: '0.00%',
      categoriesCount: 2,
      assignedCategories: ['Groceries', 'Fresh Vegetables'],
      status: 'Pending',
      needApproval: 'Yes'
    },
    {
      id: '11305875',
      name: 'Deepanshu Kumar',
      storeName: 'Rahi hot food',
      contactPhone: '9798996821',
      contactEmail: 'live11media@gmail.com',
      logoText: 'DK',
      logoBg: 'bg-[#a3e635]',
      balance: '0.00',
      commission: '0.00%',
      categoriesCount: 2,
      assignedCategories: ['Fast Food', 'Snacks & Beverages'],
      status: 'Approved',
      needApproval: 'No'
    },
    {
      id: '385511',
      name: 'Diler khan',
      storeName: 'Salim Khan',
      contactPhone: '7033272184',
      contactEmail: 'dilerk36@gmail.com',
      logoText: 'DK',
      logoBg: 'bg-amber-500',
      balance: '0.00',
      commission: '0.00%',
      categoriesCount: 1,
      assignedCategories: ['Grocery Staples'],
      status: 'Approved',
      needApproval: 'No'
    },
    {
      id: '372318',
      name: 'Mohammad javed',
      storeName: 'Daimond mobile shop',
      contactPhone: '7461954107',
      contactEmail: 'jdkhan249@gmail.com',
      logoText: 'MJ',
      logoBg: 'bg-pink-500',
      balance: '0.00',
      commission: '20.00%',
      categoriesCount: 1,
      assignedCategories: ['Mobile Accessories'],
      status: 'Approved',
      needApproval: 'No'
    },
    {
      id: '368524',
      name: 'Manish Kumar',
      storeName: 'Kesari Fruts',
      contactPhone: '6200280923',
      contactEmail: 'manishkeshari90901@gmail.com',
      logoText: 'MK',
      logoBg: 'bg-emerald-500',
      balance: '0.00',
      commission: '20.00%',
      categoriesCount: 1,
      assignedCategories: ['Fresh Fruits'],
      status: 'Approved',
      needApproval: 'No'
    }
  ]);

  const [searchQuery, setSearchQuery] = React.useState('');
  const [entriesPerPage, setEntriesPerPage] = React.useState('10');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [sortField, setSortField] = React.useState('id');
  const [sortDirection, setSortDirection] = React.useState('asc');

  // Modal / Drawer States
  const [selectedSellerCategoryDrawer, setSelectedSellerCategoryDrawer] = React.useState(null);
  const [editingSellerModal, setEditingSellerModal] = React.useState(null);
  const [editFormData, setEditFormData] = React.useState({ name: '', storeName: '', commission: '', balance: '' });

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
  const handleToggleStatus = (id) => {
    setSellers(prev => prev.map(s => {
      if (s.id === id) {
        const nextStatus = s.status === 'Approved' ? 'Pending' : 'Approved';
        return { ...s, status: nextStatus, needApproval: nextStatus === 'Approved' ? 'No' : 'Yes' };
      }
      return s;
    }));
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
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-500">{seller.id}</td>
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
                            onClick={() => openEditModal(seller)}
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
                    onClick={() => {
                      setSellers(prev => prev.map(s => s.id === editingSellerModal.id ? { ...s, status: 'Approved', needApproval: 'No' } : s));
                      setEditingSellerModal(prev => ({ ...prev, status: 'Approved', needApproval: 'No' }));
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl border-none cursor-pointer flex items-center gap-1.5 shadow-2xs transition-all"
                  >
                    ✓ Approve
                  </button>
                  <button 
                    onClick={() => {
                      setSellers(prev => prev.map(s => s.id === editingSellerModal.id ? { ...s, status: 'Pending', needApproval: 'Yes' } : s));
                      setEditingSellerModal(prev => ({ ...prev, status: 'Pending', needApproval: 'Yes' }));
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
                    <label className="text-slate-500 font-medium block mb-1">Category</label>
                    <input 
                      type="text"
                      defaultValue={(editingSellerModal.assignedCategories || ['Vagitable'])[0]}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-[#ff5500]"
                    />
                  </div>

                  <div>
                    <label className="text-slate-500 font-medium block mb-1">Commission (%) (Static Update)</label>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        value={editFormData.commission}
                        onChange={(e) => setEditFormData({ ...editFormData, commission: e.target.value })}
                        className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-[#ff5500]"
                      />
                      <button 
                        type="button"
                        onClick={() => alert(`Commission set to ${editFormData.commission}`)}
                        className="px-4 py-2.5 bg-slate-700 hover:bg-slate-800 text-white font-bold rounded-xl border-none cursor-pointer"
                      >
                        Set
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
                      defaultValue="Dakra, Churi, Jharkhand 829210, India"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-[#ff5500]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-500 font-medium block mb-1">City</label>
                      <input 
                        type="text"
                        defaultValue="Dakra"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-[#ff5500]"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 font-medium block mb-1">Serviceable Area</label>
                      <input 
                        type="text"
                        defaultValue="Dakra Region"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-[#ff5500]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-500 font-medium block mb-1">Latitude</label>
                      <input 
                        type="text"
                        defaultValue="23.669614"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-[#ff5500]"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 font-medium block mb-1">Longitude</label>
                      <input 
                        type="text"
                        defaultValue="85.021944"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-[#ff5500]"
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
                      defaultValue="5.1"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-[#ff5500]"
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
    </div>
  );
};

/* =========================================================================
   3. DRIVER MANAGEMENT PAGE
   ========================================================================= */
export const DriverManagement = () => {
  const [drivers, setDrivers] = React.useState([
    { id: '03c6a1', name: 'Vishal Patel', mobile: '9302841836', address: 'Main Road Sector 2', city: 'Ranchi', commission: 'Fixed', balance: '₹824.10', cashCollected: '₹2976.00', status: 'Active', available: 'Available', email: 'vishal@patel.com', vehicle: 'Express Bike' },
    { id: '41f1b9', name: 'Deepak kumar', mobile: '9031275861', address: 'Lohardaga - Chandwa Rd', city: 'Kundgara', commission: 'Fixed', balance: '₹0.00', cashCollected: '₹0.00', status: 'Active', available: 'Available', email: 'deepak@gmail.com', vehicle: 'Hero Splendor' },
    { id: '43945c', name: 'Test', mobile: '6264715409', address: 'Indore Central', city: 'Indore', commission: 'Fixed', balance: '₹0.00', cashCollected: '₹0.00', status: 'Active', available: 'Available', email: 'test@driver.com', vehicle: 'Cargo Van' },
    { id: '3e6bcf', name: 'Ram', mobile: '9109599487', address: 'Zjjs Main Street', city: 'Indore', commission: 'Fixed', balance: '₹0.00', cashCollected: '₹0.00', status: 'Active', available: 'Available', email: 'ram@indore.com', vehicle: 'Auto Rickshaw' },
    { id: '3e6be9', name: 'Rahul', mobile: '7348419775', address: 'Gs Sector 5', city: 'Indore', commission: 'Fixed', balance: '₹0.00', cashCollected: '₹0.00', status: 'Active', available: 'Available', email: 'rahul@gmail.com', vehicle: 'Honda Activa' },
    { id: '3cf776', name: 'Rahul sahu', mobile: '9241673736', address: 'Carcutta khelan dhoura', city: 'Khalari', commission: 'Fixed', balance: '₹0.00', cashCollected: '₹0.00', status: 'Inactive', available: 'Not Available', email: 'rahulsahu@gmail.com', vehicle: 'TVS XL 100' },
    { id: '5a81e2', name: 'Anand Sharma', mobile: '9827104928', address: 'Karkatta Road', city: 'Dakra', commission: 'Fixed', balance: '₹450.00', cashCollected: '₹1200.00', status: 'Active', available: 'Available', email: 'anand@sharma.com', vehicle: 'Bajaj Pulsar' },
    { id: '7d92a1', name: 'Vikram Singh', mobile: '9431092817', address: 'Piparwar Colony', city: 'Bachra', commission: 'Fixed', balance: '₹150.00', cashCollected: '₹850.00', status: 'Active', available: 'Available', email: 'vikram@singh.com', vehicle: 'Mahindra Bolero Pickup' },
  ]);

  // Filters & State
  const [statusFilter, setStatusFilter] = React.useState('All');
  const [availabilityFilter, setAvailabilityFilter] = React.useState('All');
  const [search, setSearch] = React.useState('');
  const [entriesPerPage, setEntriesPerPage] = React.useState(10);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [sortField, setSortField] = React.useState(null);
  const [sortOrder, setSortOrder] = React.useState('asc');

  // Modals & Drawer State
  const [selectedDriver, setSelectedDriver] = React.useState(null);
  const [editingDriver, setEditingDriver] = React.useState(null);

  // Sorting Handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Filtered & Sorted Drivers
  const filteredDrivers = drivers.filter(d => {
    const matchesStatus = statusFilter === 'All' || d.status === statusFilter;
    const matchesAvailability = availabilityFilter === 'All' || d.available === availabilityFilter;
    const matchesSearch = 
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.mobile.includes(search) ||
      d.address.toLowerCase().includes(search.toLowerCase()) ||
      d.city.toLowerCase().includes(search.toLowerCase()) ||
      d.id.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesAvailability && matchesSearch;
  });

  const sortedDrivers = [...filteredDrivers].sort((a, b) => {
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
  const totalPages = Math.ceil(sortedDrivers.length / entriesPerPage) || 1;
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedDrivers = sortedDrivers.slice(startIndex, startIndex + entriesPerPage);

  // Actions
  const toggleStatus = (id) => {
    setDrivers(prev => prev.map(d => d.id === id ? { ...d, status: d.status === 'Active' ? 'Inactive' : 'Active' } : d));
  };

  const toggleAvailability = (id) => {
    setDrivers(prev => prev.map(d => d.id === id ? { ...d, available: d.available === 'Available' ? 'Not Available' : 'Available' } : d));
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this delivery boy?')) {
      setDrivers(prev => prev.filter(d => d.id !== id));
    }
  };

  const handleExportCSV = () => {
    const headers = ['Id', 'Name', 'Mobile', 'Address', 'City', 'Commission', 'Balance', 'Cash Collected', 'Status', 'Available'];
    const rows = sortedDrivers.map(d => [d.id, `"${d.name}"`, d.mobile, `"${d.address}"`, `"${d.city}"`, d.commission, d.balance, d.cashCollected, d.status, d.available]);
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
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Delivery Boys</h1>
        <div className="text-xs text-slate-500 font-medium">
          Dashboard / <span className="text-[#ff5500] font-semibold">View Delivery Boy List</span>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Light Orange Header Banner */}
        <div className="bg-[#fff4ed] border-b border-orange-200/70 text-[#002625] px-6 py-4 flex items-center justify-between">
          <h2 className="text-base font-bold tracking-tight text-[#002625] flex items-center gap-2 m-0">
            <ChevronRight size={18} className="text-[#ff5500]" />
            View Delivery Boy List
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

            {/* Right Export Button */}
            <button 
              onClick={handleExportCSV}
              className="px-4 py-2 bg-[#ff5500] hover:bg-[#e04a00] text-white text-xs font-bold rounded-xl border-none cursor-pointer flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 shrink-0"
            >
              <Download size={14} /> Export v
            </button>
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
                {paginatedDrivers.length > 0 ? (
                  paginatedDrivers.map((driver) => (
                    <tr key={driver.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-mono text-slate-500">{driver.id}</td>
                      <td className="py-3 px-3 font-bold text-slate-900">{driver.name}</td>
                      <td className="py-3 px-3 font-mono">{driver.mobile}</td>
                      <td className="py-3 px-3 text-slate-600 max-w-[140px] truncate" title={driver.address}>{driver.address}</td>
                      <td className="py-3 px-3 font-medium">{driver.city}</td>
                      <td className="py-3 px-3 font-semibold text-slate-600">{driver.commission}</td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-800">{driver.balance}</td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-800">{driver.cashCollected}</td>
                      
                      {/* Status Badge */}
                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          driver.status === 'Active' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {driver.status}
                        </span>
                      </td>

                      {/* Availability Badge */}
                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          driver.available === 'Available' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {driver.available}
                        </span>
                      </td>

                      {/* Interactive Action Buttons */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* View Icon */}
                          <button 
                            onClick={() => setSelectedDriver(driver)}
                            className="p-1 rounded-md text-sky-600 hover:bg-sky-50 border-none bg-transparent cursor-pointer transition-colors"
                            title="View Details"
                          >
                            <Eye size={15} />
                          </button>

                          {/* Edit Icon */}
                          <button 
                            onClick={() => setEditingDriver({ ...driver })}
                            className="p-1 rounded-md text-teal-600 hover:bg-teal-50 border-none bg-transparent cursor-pointer transition-colors"
                            title="Edit Delivery Boy"
                          >
                            <Edit3 size={15} />
                          </button>

                          {/* Toggle Active/Inactive Status */}
                          <button 
                            onClick={() => toggleStatus(driver.id)}
                            className={`p-1 rounded-md border-none bg-transparent cursor-pointer transition-colors ${
                              driver.status === 'Active' ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'
                            }`}
                            title={driver.status === 'Active' ? 'Deactivate' : 'Activate'}
                          >
                            {driver.status === 'Active' ? (
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                            ) : (
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            )}
                          </button>

                          {/* Toggle Availability */}
                          <button 
                            onClick={() => toggleAvailability(driver.id)}
                            className="p-1 rounded-md text-amber-500 hover:bg-amber-50 border-none bg-transparent cursor-pointer transition-colors"
                            title="Toggle Availability"
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                          </button>

                          {/* Delete Icon */}
                          <button 
                            onClick={() => handleDelete(driver.id)}
                            className="p-1 rounded-md text-rose-600 hover:bg-rose-50 border-none bg-transparent cursor-pointer transition-colors"
                            title="Delete Delivery Boy"
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
                      No delivery boys found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 pt-2">
            <div>
              Showing {startIndex + 1} to {Math.min(startIndex + entriesPerPage, sortedDrivers.length)} of {sortedDrivers.length} entries
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

      {/* VIEW DETAILS DRAWER */}
      {selectedDriver && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl overflow-y-auto animate-slideInRight flex flex-col">
            <div className="bg-[#fff4ed] border-b border-orange-200/70 p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#002625] m-0">{selectedDriver.name}</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5 m-0">ID: {selectedDriver.id}</p>
              </div>
              <button 
                onClick={() => setSelectedDriver(null)}
                className="text-slate-400 hover:text-slate-900 border-none bg-transparent cursor-pointer text-xl font-bold"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-4 text-xs flex-1">
              <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-100">
                <div className="flex justify-between"><span className="text-slate-500 font-semibold">Mobile:</span> <span className="font-bold text-slate-900">{selectedDriver.mobile}</span></div>
                <div className="flex justify-between"><span className="text-slate-500 font-semibold">Email:</span> <span className="font-bold text-slate-900">{selectedDriver.email}</span></div>
                <div className="flex justify-between"><span className="text-slate-500 font-semibold">Vehicle:</span> <span className="font-bold text-[#ff5500]">{selectedDriver.vehicle}</span></div>
                <div className="flex justify-between"><span className="text-slate-500 font-semibold">City:</span> <span className="font-bold text-slate-900">{selectedDriver.city}</span></div>
                <div className="flex justify-between"><span className="text-slate-500 font-semibold">Address:</span> <span className="font-medium text-slate-700">{selectedDriver.address}</span></div>
              </div>

              <div className="bg-orange-50/40 p-4 rounded-xl space-y-2 border border-orange-100">
                <div className="flex justify-between"><span className="text-slate-600 font-semibold">Commission:</span> <span className="font-bold text-slate-900">{selectedDriver.commission}</span></div>
                <div className="flex justify-between"><span className="text-slate-600 font-semibold">Wallet Balance:</span> <span className="font-bold text-emerald-600">{selectedDriver.balance}</span></div>
                <div className="flex justify-between"><span className="text-slate-600 font-semibold">Cash Collected:</span> <span className="font-bold text-[#ff5500]">{selectedDriver.cashCollected}</span></div>
                <div className="flex justify-between"><span className="text-slate-600 font-semibold">Account Status:</span> <span className="font-bold text-emerald-700">{selectedDriver.status}</span></div>
                <div className="flex justify-between"><span className="text-slate-600 font-semibold">Duty Availability:</span> <span className="font-bold text-emerald-700">{selectedDriver.available}</span></div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setSelectedDriver(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl border-none cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT DELIVERY BOY MODAL */}
      {editingDriver && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-fadeIn">
            <div className="bg-[#fff4ed] border-b border-orange-200/70 p-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#002625] m-0">Edit Delivery Boy - {editingDriver.name}</h3>
              <button 
                onClick={() => setEditingDriver(null)}
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
                  value={editingDriver.name}
                  onChange={(e) => setEditingDriver({ ...editingDriver, name: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#ff5500]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Mobile</label>
                  <input 
                    type="text" 
                    value={editingDriver.mobile}
                    onChange={(e) => setEditingDriver({ ...editingDriver, mobile: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#ff5500]"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">City</label>
                  <input 
                    type="text" 
                    value={editingDriver.city}
                    onChange={(e) => setEditingDriver({ ...editingDriver, city: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#ff5500]"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Address</label>
                <input 
                  type="text" 
                  value={editingDriver.address}
                  onChange={(e) => setEditingDriver({ ...editingDriver, address: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#ff5500]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Balance (₹)</label>
                  <input 
                    type="text" 
                    value={editingDriver.balance}
                    onChange={(e) => setEditingDriver({ ...editingDriver, balance: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#ff5500]"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Cash Collected (₹)</label>
                  <input 
                    type="text" 
                    value={editingDriver.cashCollected}
                    onChange={(e) => setEditingDriver({ ...editingDriver, cashCollected: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#ff5500]"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
              <button 
                onClick={() => setEditingDriver(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border-none cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setDrivers(prev => prev.map(d => d.id === editingDriver.id ? editingDriver : d));
                  setEditingDriver(null);
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

  // Live State Data for Categories Tree
  const [treeData, setTreeData] = React.useState([
    {
      id: 'cat-1',
      name: 'Mobile & Accessories',
      status: 'Active',
      header: 'Electronics',
      subcategoriesCount: 2,
      order: 0,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&auto=format&fit=crop&q=80',
      subcategories: [
        {
          id: 'sub-1',
          name: 'Smartphones',
          status: 'Active',
          header: 'Electronics',
          subcategoriesCount: 1,
          order: 0,
          image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100&auto=format&fit=crop&q=80',
          children: [
            {
              id: 'child-1',
              name: 'phone charger',
              status: 'Active',
              header: 'Electronics',
              order: 1,
              image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=100&auto=format&fit=crop&q=80'
            }
          ]
        },
        {
          id: 'sub-2',
          name: 'Mobile Cases & Covers',
          status: 'Active',
          header: 'Electronics',
          order: 1,
          image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=100&auto=format&fit=crop&q=80',
          children: []
        }
      ]
    },
    {
      id: 'cat-2',
      name: 'Fresh Produce & Fruits',
      status: 'Active',
      header: 'Groceries',
      subcategoriesCount: 1,
      order: 1,
      image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=100&auto=format&fit=crop&q=80',
      subcategories: [
        {
          id: 'sub-3',
          name: 'Organic Vegetables',
          status: 'Active',
          header: 'Groceries',
          subcategoriesCount: 0,
          order: 0,
          image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=100&auto=format&fit=crop&q=80',
          children: []
        }
      ]
    }
  ]);

  // Modal Control States
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [addModalType, setAddModalType] = React.useState('category'); // 'category' or 'subcategory'
  const [selectedParentId, setSelectedParentId] = React.useState(null);
  const [selectedParentName, setSelectedParentName] = React.useState('');

  // Form Input States
  const [formData, setFormData] = React.useState({
    name: '',
    header: 'Electronics',
    status: 'Active',
    order: '0',
    imageUrl: ''
  });

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
      header: 'Electronics',
      status: 'Active',
      order: '0',
      imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=100&auto=format&fit=crop&q=80'
    });
    setIsAddModalOpen(true);
  };

  const openAddSubcategoryModal = (cat) => {
    setAddModalType('subcategory');
    setSelectedParentId(cat.id);
    setSelectedParentName(cat.name);
    setFormData({
      name: '',
      header: 'Electronics',
      status: 'Active',
      order: '0',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop&q=80'
    });
    setIsAddModalOpen(true);
  };

  const openAddNestedSubcategoryModal = (sub) => {
    setAddModalType('nested_subcategory');
    setSelectedParentId(sub.id);
    setSelectedParentName(sub.name);
    setFormData({
      name: '',
      header: 'Electronics',
      status: 'Active',
      order: '0',
      imageUrl: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=100&auto=format&fit=crop&q=80'
    });
    setIsAddModalOpen(true);
  };

  // Create Category / Subcategory / Nested Subcategory Action
  const handleSaveItem = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter a name');
      return;
    }

    if (addModalType === 'category') {
      const newCat = {
        id: `cat-${Date.now()}`,
        name: formData.name,
        status: formData.status,
        header: formData.header,
        subcategoriesCount: 0,
        order: Number(formData.order) || 0,
        image: formData.imageUrl || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=100&auto=format&fit=crop&q=80',
        subcategories: []
      };
      setTreeData(prev => [newCat, ...prev]);
      setExpanded(prev => ({ ...prev, [newCat.id]: true }));
    } else if (addModalType === 'subcategory') {
      const newSub = {
        id: `sub-${Date.now()}`,
        name: formData.name,
        status: formData.status,
        header: formData.header,
        subcategoriesCount: 0,
        order: Number(formData.order) || 0,
        image: formData.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop&q=80',
        children: []
      };

      setTreeData(prev => prev.map(cat => {
        if (cat.id === selectedParentId) {
          return {
            ...cat,
            subcategoriesCount: (cat.subcategories ? cat.subcategories.length : 0) + 1,
            subcategories: [...(cat.subcategories || []), newSub]
          };
        }
        return cat;
      }));
      setExpanded(prev => ({ ...prev, [selectedParentId]: true }));
    } else if (addModalType === 'nested_subcategory') {
      const newNestedChild = {
        id: `child-${Date.now()}`,
        name: formData.name,
        status: formData.status,
        header: formData.header,
        order: Number(formData.order) || 0,
        image: formData.imageUrl || 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=100&auto=format&fit=crop&q=80'
      };

      setTreeData(prev => prev.map(cat => {
        if (cat.subcategories) {
          const updatedSubs = cat.subcategories.map(sub => {
            if (sub.id === selectedParentId) {
              return {
                ...sub,
                subcategoriesCount: (sub.children ? sub.children.length : 0) + 1,
                children: [...(sub.children || []), newNestedChild]
              };
            }
            return sub;
          });
          return { ...cat, subcategories: updatedSubs };
        }
        return cat;
      }));
      setExpanded(prev => ({ ...prev, [selectedParentId]: true }));
    }

    setIsAddModalOpen(false);
  };

  // Toggle Active / Deactivate Status
  const handleToggleStatus = (id) => {
    setTreeData(prev => prev.map(cat => {
      if (cat.id === id) {
        return { ...cat, status: cat.status === 'Active' ? 'Inactive' : 'Active' };
      }
      if (cat.subcategories) {
        const updatedSubs = cat.subcategories.map(sub => {
          if (sub.id === id) {
            return { ...sub, status: sub.status === 'Active' ? 'Inactive' : 'Active' };
          }
          if (sub.children) {
            const updatedChildren = sub.children.map(child => {
              if (child.id === id) {
                return { ...child, status: child.status === 'Active' ? 'Inactive' : 'Active' };
              }
              return child;
            });
            return { ...sub, children: updatedChildren };
          }
          return sub;
        });
        return { ...cat, subcategories: updatedSubs };
      }
      return cat;
    }));
  };

  // Delete Item Action
  const handleDeleteItem = (id) => {
    if (!window.confirm('Are you sure you want to delete this category item?')) return;

    setTreeData(prev => prev.filter(cat => cat.id !== id).map(cat => {
      if (cat.subcategories) {
        const filteredSubs = cat.subcategories.filter(sub => sub.id !== id).map(sub => {
          if (sub.children) {
            return { ...sub, children: sub.children.filter(child => child.id !== id) };
          }
          return sub;
        });
        return {
          ...cat,
          subcategoriesCount: filteredSubs.length,
          subcategories: filteredSubs
        };
      }
      return cat;
    }));
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
                        <button onClick={() => handleToggleStatus(cat.id)} className={`px-3 py-1.5 text-xs font-bold rounded-lg border-none cursor-pointer transition-colors ${cat.status === 'Active' ? 'bg-amber-100 hover:bg-amber-200 text-amber-800' : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'}`}>
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
                                {sub.children && sub.children.length > 0 ? (
                                  <button onClick={() => toggleExpand(sub.id)} className="text-[#ff5500] hover:text-[#e04a00] cursor-pointer bg-transparent border-none p-1">
                                    {expanded[sub.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                  </button>
                                ) : <span className="w-5" />}
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
                                <button onClick={() => openAddNestedSubcategoryModal(sub)} className="p-1.5 bg-[#ff5500] hover:bg-[#e04a00] text-white rounded-md border-none cursor-pointer"><Plus size={13} /></button>
                                <button onClick={() => handleToggleStatus(sub.id)} className="p-1.5 bg-amber-500/20 text-amber-700 hover:bg-amber-500/30 rounded-md border-none cursor-pointer text-xs font-bold px-2">×</button>
                                <button onClick={() => handleDeleteItem(sub.id)} className="p-1.5 bg-rose-100 hover:bg-rose-200 text-rose-600 rounded-md border-none cursor-pointer"><Trash2 size={13} /></button>
                              </div>
                            </div>
                            {expanded[sub.id] && sub.children && sub.children.length > 0 && (
                              <div className="ml-6 border-l-2 border-[#ff5500]/40 pl-4 space-y-2">
                                {sub.children.map((child) => (
                                  <div key={child.id} className="bg-slate-50/40 border border-slate-200/80 rounded-xl p-3 flex items-center justify-between">
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
                        <button onClick={() => handleDeleteItem(c.id)} className="text-xs text-rose-600 font-semibold hover:underline border-none bg-transparent cursor-pointer">
                          Delete
                        </button>
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
                <Plus size={16} className="text-[#ff5500]" />
                {addModalType === 'category' 
                  ? 'Create New Root Category' 
                  : addModalType === 'subcategory' 
                  ? 'Create New Subcategory' 
                  : 'Create New Sub-subcategory'}
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
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

              {/* Category Image Upload Field */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Category Image *</label>
                <div className="flex items-center gap-3">
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

                  <div className="flex-1 space-y-1">
                    <label className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 cursor-pointer inline-flex items-center gap-1.5 transition-colors">
                      <Upload size={13} className="text-[#ff5500]" />
                      <span>Choose Image File</span>
                      <input 
                        type="file" 
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setFormData(prev => ({ ...prev, imageUrl: reader.result }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    <p className="text-[10px] text-slate-400">Supported: JPG, PNG, WEBP (Max 2MB)</p>
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
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border-none cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-[#ff5500] hover:bg-[#e04a00] text-white text-xs font-bold rounded-xl border-none cursor-pointer shadow-sm transition-all"
                >
                  Save Category
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
  const [products, setProducts] = React.useState([
    {
      id: '5e17-0',
      name: 'Pyaaj',
      seller: 'Keshari Vagitl Shope',
      category: 'Groceries',
      image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=100&auto=format&fit=crop&q=80',
      variation: 'Variation: 1kg',
      stock: 40,
      status: 'Published'
    },
    {
      id: '5d01-0',
      name: 'Aalu',
      seller: 'Keshari Vagitl Shope',
      category: 'Groceries',
      image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=100&auto=format&fit=crop&q=80',
      variation: 'Variation: 1 kg',
      stock: 1000,
      status: 'Published'
    },
    {
      id: '3c8e-0',
      name: 'Khira',
      seller: 'Keshari Vagitl Shope',
      category: 'Groceries',
      image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=100&auto=format&fit=crop&q=80',
      variation: 'Variation: 1 kg',
      stock: 100,
      status: 'Published'
    },
    {
      id: '2f5f-0',
      name: 'Tamatar',
      seller: 'Keshari Vagitl Shope',
      category: 'Groceries',
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=100&auto=format&fit=crop&q=80',
      variation: 'Variation: 1 kg',
      stock: 500,
      status: 'Published'
    }
  ]);

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
    }
  };

  const handleEditProduct = (prod) => {
    const newStock = prompt(`Update stock count for ${prod.name}:`, prod.stock);
    if (newStock !== null && !isNaN(newStock)) {
      setProducts(prev => prev.map(p => p.id === prod.id ? { ...p, stock: Number(newStock) } : p));
    }
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
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Products & Stock</h1>
        <div className="text-xs text-slate-500 font-medium">
          Dashboard / <span className="text-[#ff5500] font-semibold">Stock Management</span>
        </div>
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
                <option>All Category</option>
                <option>Groceries</option>
                <option>Electronics</option>
                <option>Fashion</option>
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
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-500">{prod.id}</td>
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
        <p className="text-xs text-slate-500">Driver transit timeline, OTP security status, and vehicle progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockDeliveries.map((d) => (
          <div key={d.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono text-[#ff5500] font-bold">{d.id}</span>
                <h3 className="text-base font-bold text-slate-900">Order: {d.orderId}</h3>
                <p className="text-xs text-slate-600">Driver: {d.driver}</p>
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
  const [deliveryBoyFilter, setDeliveryBoyFilter] = React.useState('All Delivery Boy');
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
    setDeliveryBoyFilter('All Delivery Boy');
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
    const matchesBoy = deliveryBoyFilter === 'All Delivery Boy' || t.name === deliveryBoyFilter;
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
            
            {/* Left Filters: From - To Date, Clear, Delivery Boy Filter, Method Filter */}
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
                <span className="text-slate-600 font-medium">Filter by Delivery Boy:</span>
                <select 
                  value={deliveryBoyFilter}
                  onChange={(e) => setDeliveryBoyFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-[#ff5500] cursor-pointer"
                >
                  <option value="All Delivery Boy">All Delivery Boy</option>
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
                <label className="text-xs font-bold text-slate-700 block mb-1">Select Delivery Boy *</label>
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

  // Transactions State
  const [transactions, setTransactions] = React.useState([
    { id: 'TXN-901', dateTime: '22/7/2026, 8:28:44 pm', user: 'Cakes n bakes', userRole: 'Seller', type: 'Credit', description: 'Sale proceeds from Order #ORD1784732281209325', amount: '+₹108.00' },
    { id: 'TXN-902', dateTime: '11/7/2026, 12:40:38 pm', user: 'Deepak kumar', userRole: 'Delivery Boy', type: 'Credit', description: 'Delivery earning for COD order ORD1783753725052987', amount: '+₹7.50' },
    { id: 'TXN-903', dateTime: '6/7/2026, 4:12:19 pm', user: 'Harshvardhan', userRole: 'Seller', type: 'Credit', description: 'Sale proceeds from Order #ORD1783334491042306', amount: '+₹90.00' },
    { id: 'TXN-904', dateTime: '6/7/2026, 4:10:10 pm', user: 'Harshvardhan', userRole: 'Seller', type: 'Credit', description: 'Sale proceeds from Order #ORD1783334383313326', amount: '+₹90.00' },
    { id: 'TXN-905', dateTime: '5/7/2026, 2:15:20 pm', user: 'Vishal Patel', userRole: 'Delivery Boy', type: 'Debit', description: 'Cash collected payout settlement', amount: '-₹450.00' },
  ]);

  // Withdrawal Requests State
  const [withdrawals, setWithdrawals] = React.useState([
    { id: 'WD-501', user: 'Apex Wholesale Grocery', userRole: 'Seller', amount: '₹12,450.00', bankDetails: 'HDFC Bank • A/C 9876543210 • IFSC HDFC0001234', requestedDate: '28/7/2026', status: 'Pending' }
  ]);

  // Action Handlers
  const handleApproveWithdrawal = (id) => {
    if (window.confirm('Approve and process this withdrawal payout?')) {
      setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: 'Approved' } : w));
    }
  };

  const handleRejectWithdrawal = (id) => {
    if (window.confirm('Reject this withdrawal request?')) {
      setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: 'Rejected' } : w));
    }
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesUser = userFilter === 'All Users' || t.userRole === userFilter;
    const matchesType = typeFilter === 'All Types' || t.type === typeFilter;
    const matchesSearch = 
      t.user.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase());
    return matchesUser && matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Page Title & Subtitle */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight m-0">Admin Wallet & Finance</h1>
        <p className="text-xs text-slate-500 font-medium mt-1 m-0">
          Manage transactions, track earnings, and process withdrawals.
        </p>
      </div>

      {/* Compact Top Metrics Grid (6 Sleek Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        
        {/* Card 1: Total Platform Earning */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition-all space-y-1.5 relative">
          <div className="flex justify-between items-center">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            </div>
            <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              LIVE STATUS <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500 block leading-none">Total Platform Earning</span>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight m-0 mt-1">₹65,973.7</h2>
          </div>
          <p className="text-[10px] text-slate-400 font-medium pt-1 border-t border-slate-100 m-0 leading-none">Total money collected</p>
        </div>

        {/* Card 2: Total Admin Earning */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition-all space-y-1.5 relative">
          <div className="flex justify-between items-center">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
              $
            </div>
            <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              LIVE STATUS <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500 block leading-none">Total Admin Earning</span>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight m-0 mt-1">₹3,991.4</h2>
          </div>
          <p className="text-[10px] text-slate-400 font-medium pt-1 border-t border-slate-100 m-0 leading-none">Net profit for platform</p>
        </div>

        {/* Card 3: Current Platform Balance */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition-all space-y-1.5 relative">
          <div className="flex justify-between items-center">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            </div>
            <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              LIVE STATUS <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500 block leading-none">Current Platform Balance</span>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight m-0 mt-1">₹65,873.7</h2>
          </div>
          <p className="text-[10px] text-slate-400 font-medium pt-1 border-t border-slate-100 m-0 leading-none">Available for business</p>
        </div>

        {/* Card 4: Pending from Delivery Boys */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition-all space-y-1.5 relative">
          <div className="flex justify-between items-center">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock size={16} />
            </div>
            <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              LIVE STATUS <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500 block leading-none">Pending from Delivery Boys</span>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight m-0 mt-1">₹3,190</h2>
          </div>
          <p className="text-[10px] text-slate-400 font-medium pt-1 border-t border-slate-100 m-0 leading-none">COD cash to be collected</p>
        </div>

        {/* Card 5: Seller Pending Payouts */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition-all space-y-1.5 relative">
          <div className="flex justify-between items-center">
            <div className="w-8 h-8 rounded-lg bg-[#fff4ed] text-[#ff5500] flex items-center justify-center">
              <Store size={16} />
            </div>
            <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              LIVE STATUS <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500 block leading-none">Seller Pending Payouts</span>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight m-0 mt-1">₹67,724.9</h2>
          </div>
          <p className="text-[10px] text-slate-400 font-medium pt-1 border-t border-slate-100 m-0 leading-none">Owed to sellers</p>
        </div>

        {/* Card 6: Delivery Boy Pending Payouts */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition-all space-y-1.5 relative">
          <div className="flex justify-between items-center">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Truck size={16} />
            </div>
            <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              LIVE STATUS <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500 block leading-none">Delivery Boy Pending Payouts</span>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight m-0 mt-1">₹1,793.2</h2>
          </div>
          <p className="text-[10px] text-slate-400 font-medium pt-1 border-t border-slate-100 m-0 leading-none">Owed to delivery partners</p>
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
            All Transactions
          </button>

          <button 
            onClick={() => setActiveTab('admin_earnings')}
            className={`pb-3 text-xs font-bold border-b-2 cursor-pointer transition-all flex items-center gap-2 ${
              activeTab === 'admin_earnings'
                ? 'border-[#ff5500] text-[#ff5500]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
            Admin Earnings
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
            <span className="w-5 h-5 rounded-full bg-rose-500 text-white font-extrabold text-[10px] flex items-center justify-center">
              {withdrawals.filter(w => w.status === 'Pending').length}
            </span>
          </button>
        </div>

        {/* Tab Content Section */}
        <div className="p-6 space-y-5">
          
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <select 
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-[#ff5500] cursor-pointer font-medium"
              >
                <option value="All Users">All Users</option>
                <option value="Seller">Sellers Only</option>
                <option value="Delivery Boy">Delivery Boys Only</option>
              </select>

              <select 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-[#ff5500] cursor-pointer font-medium"
              >
                <option value="All Types">All Types</option>
                <option value="Credit">Credit</option>
                <option value="Debit">Debit</option>
              </select>
            </div>

            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search transactions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-52 bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-[#ff5500]"
              />
            </div>
          </div>

          {/* Tab 1: All Transactions Table */}
          {activeTab === 'all_transactions' && (
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                    <th className="py-3.5 px-4">Date & Time</th>
                    <th className="py-3.5 px-4">User</th>
                    <th className="py-3.5 px-4">Type</th>
                    <th className="py-3.5 px-4">Description</th>
                    <th className="py-3.5 px-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {filteredTransactions.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">{t.dateTime}</td>
                      <td className="py-3.5 px-4 space-y-0.5">
                        <p className="font-bold text-slate-900 text-xs m-0">{t.user}</p>
                        <p className="text-[10px] text-slate-400 font-semibold m-0 uppercase tracking-wider">{t.userRole}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          t.type === 'Credit' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-md truncate" title={t.description}>{t.description}</td>
                      <td className={`py-3.5 px-4 text-right font-mono font-bold ${
                        t.amount.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {t.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 2: Admin Earnings View */}
          {activeTab === 'admin_earnings' && (
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 m-0">Net Platform Profit Overview</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-semibold block mb-1">Commission Profit Rate</span>
                  <span className="text-lg font-black text-[#ff5500]">5.0% Fixed Platform Fee</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-semibold block mb-1">Total Admin Earnings</span>
                  <span className="text-lg font-black text-emerald-600">₹3,991.40</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Withdrawal Requests View matching user reference design */}
          {activeTab === 'withdrawals' && (
            <div className="space-y-4">
              {/* Status Filter Pill Buttons (All, Pending, Approved, Completed, Rejected) */}
              <div className="flex flex-wrap items-center gap-2 pb-2">
                {['All', 'Pending', 'Approved', 'Completed', 'Rejected'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setTypeFilter(status === 'All' ? 'All Types' : status)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                      (typeFilter === 'All Types' && status === 'All') || typeFilter === status
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
                {[
                  { id: 'WD-501', title: 'Seller Withdrawal', role: 'SELLER', user: 'appzeto', date: 'Requested: 27/1/2026, 10:38:58 pm', amount: '₹510.00', status: 'Completed', method: 'Bank Transfer', bankDetails: 'IDFC - 54684651684651 (undefined)', reference: 'hjhbjh' },
                  { id: 'WD-502', title: 'Delivery Boy Withdrawal', role: 'DELIVERY BOY', user: 'N/A', date: 'Requested: 7/1/2026, 3:22:40 pm', amount: '₹40.00', status: 'Pending', method: 'UPI', bankDetails: 'UPI ID: slovevanshi666@gmail.com', reference: null },
                  { id: 'WD-503', title: 'Seller Withdrawal', role: 'SELLER', user: 'Deepak Kumar', date: 'Requested: 28/5/2026, 2:52:17 pm', amount: '₹500.00', status: 'Completed', method: 'UPI', bankDetails: 'Airtel payment bank - 9031275861 (AIRP0000001)', reference: '9031275861' },
                  { id: 'WD-504', title: 'Seller Withdrawal', role: 'SELLER', user: 'Harsh shop', date: 'Requested: 30/4/2026, 12:19:51 pm', amount: '₹100.00', status: 'Completed', method: 'Bank Transfer', bankDetails: 'HDFC - 9877898789898998888898 (undefined)', reference: 'cydf' },
                ]
                .filter(item => typeFilter === 'All Types' || typeFilter === 'All' || item.status === typeFilter)
                .map((w) => (
                  <div key={w.id} className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all p-5 space-y-4">
                    {/* Top Row: Title, Role Badge, User, Date, Amount & Status */}
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900 m-0">{w.title}</h3>
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
                        <h2 className="text-lg font-black text-slate-900 tracking-tight m-0">{w.amount}</h2>
                        <span className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-bold ${
                          w.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                          w.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                          w.status === 'Approved' ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                          {w.status}
                        </span>
                      </div>
                    </div>

                    {/* Middle Grey Details Container */}
                    <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100 space-y-3 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">PAYMENT METHOD</span>
                          <span className="font-bold text-slate-900">{w.method}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">BANK DETAILS</span>
                          <span className="font-bold text-slate-900 font-mono">{w.bankDetails}</span>
                        </div>
                      </div>

                      {w.reference && (
                        <div className="pt-2 border-t border-slate-200/50">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">TRANSACTION REFERENCE</span>
                          <span className="font-mono text-slate-800 font-semibold">{w.reference}</span>
                        </div>
                      )}
                    </div>

                    {/* Approve / Reject Buttons if Pending */}
                    {w.status === 'Pending' && (
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <button 
                          onClick={() => alert(`Approved withdrawal ${w.id}`)}
                          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl border-none cursor-pointer shadow-2xs transition-all active:scale-95 text-center"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => alert(`Rejected withdrawal ${w.id}`)}
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
      title: 'Delivery Boy Withdrawal',
      role: 'DELIVERY BOY',
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
   9.8. DELIVERY BOY CASH COLLECTION LIST PAGE
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
  const [deliveryBoyFilter, setDeliveryBoyFilter] = React.useState('All Delivery Boys');
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
    setDeliveryBoyFilter('All Delivery Boys');
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
    const matchesBoy = deliveryBoyFilter === 'All Delivery Boys' || c.name === deliveryBoyFilter;
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
          Dashboard / <span className="text-[#ff5500] font-semibold">Delivery Boy Cash Collection List</span>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Light Orange Header Banner matching reference screenshot with + Add Cash Collection */}
        <div className="bg-[#fff4ed] border-b border-orange-200/70 text-[#002625] px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h2 className="text-base font-bold tracking-tight text-[#002625] flex items-center gap-2 m-0">
            <ChevronRight size={18} className="text-[#ff5500]" />
            Delivery Boy Cash Collection List
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
            
            {/* Left Filters: From - To Date, Clear, Filter by Delivery Boy, Filter by Method */}
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
                <span className="text-slate-600 font-medium">Filter by Delivery Boy:</span>
                <select 
                  value={deliveryBoyFilter}
                  onChange={(e) => setDeliveryBoyFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-[#ff5500] cursor-pointer"
                >
                  <option value="All Delivery Boys">All Delivery Boys</option>
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
                <label className="text-xs font-bold text-slate-700 block mb-1">Select Delivery Boy *</label>
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
                <option value="Delivery Driver">Delivery Driver</option>
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
                    <option value="Delivery Driver">Delivery Driver</option>
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
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Global Platform Settings</h2>
        <p className="text-xs text-slate-500">Branding, tax rules, payment gateways, and security configurations</p>
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

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button onClick={() => alert('Settings Saved (UI Only)')} className="px-5 py-2.5 bg-[#ff5500] hover:bg-[#e04a00] text-white text-xs font-bold rounded-xl cursor-pointer border-none">
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

