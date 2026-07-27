import React, { useState } from 'react';
import { StatusBadge, Drawer } from '../components/AdminUIComponents';
import { mockUsers, mockSellers, mockDrivers, mockWarehouses, mockCategories, mockProducts, mockOrders, mockDeliveries, mockPayments, mockCoupons, mockNotifications, mockRoles } from '../mock/adminMockData';
import { 
  Search, 
  Download, 
  Plus, 
  Eye, 
  Truck, 
  Send
} from 'lucide-react';

/* =========================================================================
   1. USER MANAGEMENT PAGE
   ========================================================================= */
export const UserManagement = () => {
  const [users] = useState(mockUsers);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

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
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search user by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#ff5500]"
            />
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
              {filteredUsers.map((u) => (
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
              ))}
            </tbody>
          </table>
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
   2. SELLER MANAGEMENT PAGE
   ========================================================================= */
export const SellerManagement = () => {
  const [sellers] = useState(mockSellers);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Seller & Merchant Control</h2>
          <p className="text-xs text-slate-500">KYC verification, store status, and revenue oversight</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sellers.map((s) => (
          <div key={s.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 relative">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono text-slate-400">{s.id}</span>
                <h3 className="text-base font-bold text-slate-900 leading-snug">{s.storeName}</h3>
                <p className="text-xs text-slate-600">Owner: {s.ownerName}</p>
              </div>
              <StatusBadge status={s.status} />
            </div>

            <div className="text-xs space-y-1 pt-2 border-t border-slate-100">
              <p className="text-slate-500">Warehouse: <span className="text-slate-900 font-medium">{s.warehouse}</span></p>
              <p className="text-slate-500">Products: <span className="text-slate-900 font-mono font-bold">{s.productsCount}</span></p>
              <p className="text-slate-500">GMV Revenue: <span className="text-[#ff5500] font-mono font-bold">{s.totalRevenue}</span></p>
              <p className="text-slate-500">KYC Status: <span className="text-amber-600 font-bold">{s.kycStatus}</span></p>
            </div>

            <div className="pt-2">
              <button 
                onClick={() => alert(`Reviewing KYC Documents for ${s.storeName}`)}
                className="w-full py-2 bg-slate-100 hover:bg-[#ff5500] hover:text-white text-slate-800 text-xs font-bold rounded-xl transition-colors border-none cursor-pointer"
              >
                Inspect KYC
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================================================
   3. DRIVER MANAGEMENT PAGE
   ========================================================================= */
export const DriverManagement = () => {
  const [drivers] = useState(mockDrivers);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Driver Fleet & Verification</h2>
        <p className="text-xs text-slate-500">Live driver assignments, vehicle compliance, and ratings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {drivers.map((d) => (
          <div key={d.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{d.name}</h3>
                <span className="text-xs font-mono text-amber-500 font-bold">★ {d.rating}</span>
              </div>
              <p className="text-xs text-slate-600 flex items-center gap-1"><Truck size={14} className="text-[#ff5500]" /> {d.vehicle}</p>
              <p className="text-xs text-slate-500 font-mono">License: {d.license} | {d.phone}</p>
              <p className="text-xs text-slate-500">Current Task: <strong className="text-slate-900">{d.currentOrder}</strong></p>
            </div>
            <div className="text-right space-y-2">
              <StatusBadge status={d.status} />
              <p className="text-[10px] text-slate-400 font-mono">{d.location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================================================
   4. WAREHOUSE MANAGEMENT PAGE
   ========================================================================= */
export const WarehouseManagement = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Fulfillment Warehouses</h2>
          <p className="text-xs text-slate-500">Centralized storage capacity and inventory throughput</p>
        </div>
        <button 
          onClick={() => alert('Add New Warehouse Drawer (UI)')}
          className="px-3.5 py-2 bg-[#ff5500] hover:bg-[#e04a00] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 border-none cursor-pointer"
        >
          <Plus size={15} /> Add Hub
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockWarehouses.map((w) => (
          <div key={w.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono text-[#ff5500] font-bold">{w.id}</span>
                <h3 className="text-lg font-bold text-slate-900">{w.name}</h3>
                <p className="text-xs text-slate-500">{w.city} • Manager: {w.manager}</p>
              </div>
              <StatusBadge status={w.status} />
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-900">
                <span>Storage Utilization</span>
                <span>{w.utilization}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#ff5500]" style={{ width: `${w.utilization}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================================================
   5. CATEGORIES PAGE
   ========================================================================= */
export const CategoryManagement = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Category Taxonomy</h2>
          <p className="text-xs text-slate-500">Organize wholesale product categories & sub-categories</p>
        </div>
        <button onClick={() => alert('New Category (UI)')} className="px-3.5 py-2 bg-[#ff5500] hover:bg-[#e04a00] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 border-none cursor-pointer">
          <Plus size={15} /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 font-mono text-[10px] uppercase">
              <th className="py-3 px-4">Category Name</th>
              <th className="py-3 px-4">Sub Categories</th>
              <th className="py-3 px-4">Total Products</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {mockCategories.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="py-3 px-4 font-bold text-slate-900">{c.name}</td>
                <td className="py-3 px-4 font-mono">{c.subCategoriesCount}</td>
                <td className="py-3 px-4 font-mono text-[#ff5500] font-bold">{c.totalProducts}</td>
                <td className="py-3 px-4"><StatusBadge status={c.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* =========================================================================
   6. PRODUCTS PAGE
   ========================================================================= */
export const ProductManagement = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Products & Stock Control</h2>
          <p className="text-xs text-slate-500">Global catalog items, stock indicators, and SKU auditing</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockProducts.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-4 space-y-3 flex flex-col justify-between">
            <div>
              <img src={p.image} alt={p.name} className="w-full h-36 object-cover rounded-xl border border-slate-100 mb-3" />
              <span className="text-[10px] font-mono text-[#ff5500] font-bold">{p.sku}</span>
              <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">{p.name}</h3>
              <p className="text-xs text-slate-500 mt-1">Seller: {p.seller}</p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
              <span className="text-base font-bold text-slate-900 font-mono">{p.price}</span>
              <StatusBadge status={p.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================================================
   7. ORDERS PAGE
   ========================================================================= */
export const OrderManagement = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Order Management</h2>
        <p className="text-xs text-slate-500">Monitor order lifecycle, seller fulfillment, and dispatch states</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 font-mono text-[10px] uppercase">
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Seller Store</th>
              <th className="py-3 px-4">Warehouse</th>
              <th className="py-3 px-4">Total</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {mockOrders.map((o) => (
              <tr key={o.id} className="hover:bg-slate-50">
                <td className="py-3 px-4 font-mono font-bold text-[#ff5500]">{o.id}</td>
                <td className="py-3 px-4 text-slate-900 font-bold">{o.customer}</td>
                <td className="py-3 px-4 text-slate-600">{o.seller}</td>
                <td className="py-3 px-4 text-slate-500">{o.warehouse}</td>
                <td className="py-3 px-4 font-mono font-bold text-slate-900">{o.total}</td>
                <td className="py-3 px-4"><StatusBadge status={o.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
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
   9. PAYMENTS PAGE
   ========================================================================= */
export const PaymentManagement = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Payments & Wallet Disbursements</h2>
        <p className="text-xs text-slate-500">Platform processing fees, seller disbursements, and transactions</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 font-mono text-[10px] uppercase">
              <th className="py-3 px-4">TXN ID</th>
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Gross Amount</th>
              <th className="py-3 px-4">Platform Fee</th>
              <th className="py-3 px-4">Method</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {mockPayments.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="py-3 px-4 font-mono text-slate-500">{p.id}</td>
                <td className="py-3 px-4 font-mono font-bold text-[#ff5500]">{p.orderId}</td>
                <td className="py-3 px-4 font-mono font-bold text-slate-900">{p.amount}</td>
                <td className="py-3 px-4 font-mono text-[#ff5500] font-bold">{p.fee}</td>
                <td className="py-3 px-4 text-slate-600">{p.method}</td>
                <td className="py-3 px-4"><StatusBadge status={p.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
   12. NOTIFICATIONS PAGE
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
              <label className="text-xs text-slate-500 block mb-1">Base Delivery Surcharge ($)</label>
              <input type="text" defaultValue="$4.50" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900" />
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
