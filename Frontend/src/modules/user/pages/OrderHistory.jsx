import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Search, Package, Clock, CheckCircle2, Truck, 
  RotateCcw, ChevronRight, XCircle, ShoppingBag, Loader2, 
  Calendar, CreditCard, RefreshCw, Eye, Copy, Check, Filter,
  Star, ShieldCheck
} from 'lucide-react';
import { orderService, getCachedUserOrders } from '../../../services/authService';
import productReviewService from '../../../services/productReviewService';
import ProductRatingModal from '../../../components/ProductRatingModal';
import { useCart } from '../context/CartContext';

const formatRawOrdersList = (rawList = []) => {
  return rawList.map(o => {
    const rawStatus = (o.orderStatus || o.status || 'Placed').trim();
    return {
      id: o.orderId || o._id,
      _id: o._id,
      orderId: o.orderId || o._id,
      rawDate: o.createdAt,
      date: o.createdAt 
        ? new Date(o.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        : 'Recent',
      time: o.createdAt 
        ? new Date(o.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        : '',
      status: rawStatus,
      paymentMethod: o.paymentMethod || 'Cash on Delivery',
      paymentStatus: o.paymentStatus || 'Pending',
      items: o.items || [],
      total: Number(o.grandTotal || o.total || 0),
      itemCount: (o.items || []).reduce((acc, i) => acc + (i.quantity || 1), 0),
      shippingAddress: o.shippingAddress || null,
      rawOrder: o,
    };
  });
};

const OrderHistory = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Instant state initialization from cache (0ms delay)
  const [orders, setOrders] = useState(() => {
    const cached = getCachedUserOrders();
    if (cached && Array.isArray(cached.orders) && cached.orders.length > 0) {
      return formatRawOrdersList(cached.orders);
    }
    return [];
  });
  const [loading, setLoading] = useState(() => {
    const cached = getCachedUserOrders();
    return !(cached && Array.isArray(cached.orders) && cached.orders.length > 0);
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [copiedId, setCopiedId] = useState(null);
  const [reorderingId, setReorderingId] = useState(null);
  const [reorderSuccess, setReorderSuccess] = useState('');

  // Product Rating Modal & Reviews State
  const [userReviews, setUserReviews] = useState({});
  const [selectedProductToRate, setSelectedProductToRate] = useState(null);
  const [selectedOrderToRate, setSelectedOrderToRate] = useState(null);
  const [selectedReviewToEdit, setSelectedReviewToEdit] = useState(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  const fetchUserReviews = async () => {
    try {
      const res = await productReviewService.getUserReviews();
      if (res && res.success && Array.isArray(res.reviews)) {
        const map = {};
        res.reviews.forEach((r) => {
          const prodId = r.product?._id || r.product;
          const ordId = r.orderId || r.order;
          if (prodId && ordId) {
            map[`${ordId}_${prodId}`] = r;
          }
        });
        setUserReviews(map);
      }
    } catch (err) {
      console.warn('Failed to fetch user reviews:', err);
    }
  };

  const fetchOrderHistory = async (force = false) => {
    try {
      if (orders.length === 0) setLoading(true);
      const res = await orderService.getOrders(force);
      if (res && res.success && Array.isArray(res.orders)) {
        setOrders(formatRawOrdersList(res.orders));
      }
    } catch (err) {
      console.error('Failed to fetch order history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderHistory();
    fetchUserReviews();
  }, []);

  const handleOpenRateModal = (item, order, existingRev = null) => {
    const prodObj = {
      _id: item.product?._id || item.product || item.productId || item.id,
      id: item.product?._id || item.product || item.productId || item.id,
      name: item.name || item.product?.name || 'Product Item',
      image: item.image || item.product?.mainImage || item.product?.image || '',
      price: item.price || item.product?.price || 0,
    };
    setSelectedProductToRate(prodObj);
    setSelectedOrderToRate(order.orderId || order.id || order._id);
    setSelectedReviewToEdit(existingRev || null);
    setIsRatingModalOpen(true);
  };

  const handleReviewSuccess = (reviewData) => {
    if (reviewData && reviewData.orderId && reviewData.productId) {
      setUserReviews((prev) => ({
        ...prev,
        [`${reviewData.orderId}_${reviewData.productId}`]: reviewData,
      }));
    }
    // Refresh user reviews in background
    fetchUserReviews();
  };

  const handleCopyOrderId = (id, e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReorder = async (order, e) => {
    e.stopPropagation();
    if (!order.items || order.items.length === 0) return;
    
    setReorderingId(order.id);
    try {
      for (const item of order.items) {
        const prod = item.product || item;
        await addToCart(prod, item.quantity || 1);
      }
      setReorderSuccess(`Items from #${order.id.slice(-6)} added to cart!`);
      setTimeout(() => setReorderSuccess(''), 3000);
      navigate('/cart');
    } catch (err) {
      console.error('Error reordering items:', err);
    } finally {
      setReorderingId(null);
    }
  };

  // Filter Counts
  const counts = useMemo(() => {
    const total = orders.length;
    const completed = orders.filter(o => ['Delivered', 'Completed'].includes(o.status)).length;
    const active = orders.filter(o => ['Placed', 'Accepted', 'Processing', 'Out for Delivery'].includes(o.status)).length;
    const cancelled = orders.filter(o => ['Cancelled', 'Rejected'].includes(o.status)).length;
    return { total, completed, active, cancelled };
  }, [orders]);

  // Filtered orders based on status & search
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      // Status Filter
      if (statusFilter === 'COMPLETED' && !['Delivered', 'Completed'].includes(o.status)) return false;
      if (statusFilter === 'ACTIVE' && !['Placed', 'Accepted', 'Processing', 'Out for Delivery'].includes(o.status)) return false;
      if (statusFilter === 'CANCELLED' && !['Cancelled', 'Rejected'].includes(o.status)) return false;

      // Search Query
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const matchesId = String(o.id || '').toLowerCase().includes(q);
        const matchesDate = String(o.date || '').toLowerCase().includes(q);
        const matchesItem = (o.items || []).some(i => {
          const name = i.name || i.product?.name || '';
          return name.toLowerCase().includes(q);
        });
        if (!matchesId && !matchesDate && !matchesItem) return false;
      }

      return true;
    });
  }, [orders, statusFilter, searchTerm]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
      case 'Completed':
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
          icon: <CheckCircle2 size={12} className="text-emerald-600" />,
          label: 'Delivered',
        };
      case 'Placed':
      case 'Accepted':
        return {
          bg: 'bg-orange-50 border-orange-200 text-orange-700',
          icon: <Clock size={12} className="text-orange-600" />,
          label: status,
        };
      case 'Processing':
      case 'Out for Delivery':
        return {
          bg: 'bg-blue-50 border-blue-200 text-blue-700',
          icon: <Truck size={12} className="text-blue-600" />,
          label: status,
        };
      case 'Cancelled':
      case 'Rejected':
        return {
          bg: 'bg-rose-50 border-rose-200 text-rose-700',
          icon: <XCircle size={12} className="text-rose-600" />,
          label: status,
        };
      default:
        return {
          bg: 'bg-slate-50 border-slate-200 text-slate-700',
          icon: <Clock size={12} className="text-slate-500" />,
          label: status,
        };
    }
  };

  return (
    <div className="h-[100dvh] bg-[#f8fafc] font-sans text-slate-800 relative max-w-[480px] mx-auto shadow-[0_0_20px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">
      
      {/* Top Header Banner */}
      <header className="bg-[#ea580c] text-white px-5 pt-4 pb-4 shadow-sm z-20 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/profile')}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center border-none cursor-pointer text-white transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-[18px] font-extrabold m-0 leading-tight">Order History</h1>
              <p className="text-[11px] text-orange-100 m-0 font-medium">All completed & past purchases</p>
            </div>
          </div>

          <button 
            onClick={fetchOrderHistory} 
            disabled={loading}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center border-none cursor-pointer text-white transition-colors"
            title="Refresh Order History"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-300" />
          <input 
            type="text"
            placeholder="Search by Order ID, item name, date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/15 border border-white/20 rounded-xl pl-9 pr-8 py-2 text-[13px] text-white placeholder:text-orange-200 outline-none focus:bg-white/25 focus:border-white transition-all"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white border-none bg-transparent cursor-pointer p-0 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </header>

      {/* Switch to Active Orders Banner / Link */}
      <div className="bg-[#fff4ed] border-b border-orange-200/70 px-4 py-2 flex items-center justify-between text-xs text-slate-700 shrink-0">
        <span className="font-semibold text-slate-800">Looking for active live orders?</span>
        <button 
          onClick={() => navigate('/orders')}
          className="text-[#ea580c] hover:text-[#c2410c] font-bold text-xs bg-transparent border-none cursor-pointer flex items-center gap-1 p-0"
        >
          Active Orders <ChevronRight size={13} />
        </button>
      </div>

      {/* Filter Tabs / Chips */}
      <div className="px-4 py-2.5 bg-white border-b border-slate-100 flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden shrink-0 z-10">
        <button 
          onClick={() => setStatusFilter('ALL')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all whitespace-nowrap cursor-pointer ${
            statusFilter === 'ALL'
              ? 'bg-[#ea580c] text-white border-[#ea580c] shadow-2xs'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          All ({counts.total})
        </button>

        <button 
          onClick={() => setStatusFilter('COMPLETED')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            statusFilter === 'COMPLETED'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <CheckCircle2 size={12} /> Delivered ({counts.completed})
        </button>

        <button 
          onClick={() => setStatusFilter('ACTIVE')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            statusFilter === 'ACTIVE'
              ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <Clock size={12} /> Active ({counts.active})
        </button>

        <button 
          onClick={() => setStatusFilter('CANCELLED')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            statusFilter === 'CANCELLED'
              ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <XCircle size={12} /> Cancelled ({counts.cancelled})
        </button>
      </div>

      {/* Toast feedback */}
      {reorderSuccess && (
        <div className="mx-4 mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center justify-between animate-fadeIn shrink-0">
          <span>✓ {reorderSuccess}</span>
          <button onClick={() => navigate('/cart')} className="underline bg-transparent border-none cursor-pointer text-emerald-900 font-extrabold">Open Cart</button>
        </div>
      )}

      {/* Main Order History List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 [&::-webkit-scrollbar]:hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 size={32} className="animate-spin text-[#ea580c]" />
            <span className="text-sm font-bold text-slate-700">Loading your order history...</span>
            <span className="text-xs text-slate-400">Fetching past purchases from server</span>
          </div>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map((order) => {
            const statusInfo = getStatusBadge(order.status);
            const firstItem = order.items?.[0];

            return (
              <div 
                key={order.id}
                onClick={() => navigate('/track-order', { state: { order: order.rawOrder } })}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-orange-200 transition-all p-4 space-y-3 cursor-pointer group"
              >
                {/* Header: Order ID, Copy, Date, Status */}
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-extrabold text-slate-900 font-mono">{order.id}</span>
                      <button 
                        onClick={(e) => handleCopyOrderId(order.id, e)}
                        className="p-1 text-slate-400 hover:text-slate-700 border-none bg-transparent cursor-pointer rounded"
                        title="Copy Order ID"
                      >
                        {copiedId === order.id ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium mt-0.5">
                      <Calendar size={11} />
                      <span>{order.date} {order.time && `• ${order.time}`}</span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border flex items-center gap-1 shrink-0 ${statusInfo.bg}`}>
                    {statusInfo.icon}
                    {statusInfo.label}
                  </span>
                </div>

                {/* Items Preview Area */}
                <div className="space-y-2.5">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, iIdx) => {
                      const itemImg = item.image || item.product?.mainImage || item.product?.image;
                      const itemName = item.name || item.product?.name || 'Product Item';
                      const itemPrice = item.price || item.product?.price || 0;
                      const itemQty = item.quantity || 1;
                      const prodId = item.product?._id || item.product || item.productId || item.id;
                      const isOrderDelivered = ['Delivered', 'Completed'].includes(order.status);
                      const itemReview = isOrderDelivered && prodId ? (userReviews[`${order.orderId}_${prodId}`] || userReviews[`${order.id}_${prodId}`] || userReviews[`${order._id}_${prodId}`]) : null;

                      return (
                        <div key={iIdx} className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 flex flex-col gap-2">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-10 h-10 rounded-lg bg-white border border-slate-200/80 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                                {itemImg ? (
                                  <img src={itemImg} alt={itemName} className="w-full h-full object-cover" />
                                ) : (
                                  <Package size={16} className="text-slate-400" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-slate-800 truncate m-0 text-xs">{itemName}</p>
                                <p className="text-[11px] text-slate-400 m-0">Qty: {itemQty} × ₹{itemPrice}</p>
                              </div>
                            </div>
                            <span className="font-bold text-slate-900 text-xs shrink-0 pl-2">₹{itemPrice * itemQty}</span>
                          </div>

                          {/* Product Rating CTA for Delivered Orders Only */}
                          {isOrderDelivered && (
                            <div className="pt-2 border-t border-dashed border-slate-200/80 flex items-center justify-between">
                              {itemReview ? (
                                <div className="flex items-center gap-1.5">
                                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                    <Star size={10} className="fill-amber-500 text-amber-500" /> You rated {itemReview.rating}/5
                                  </span>
                                  <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-0.5">
                                    <ShieldCheck size={11} /> Verified
                                  </span>
                                </div>
                              ) : (
                                <span className="text-[11px] text-slate-400 font-medium">How was this product?</span>
                              )}

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenRateModal(item, order, itemReview);
                                }}
                                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border cursor-pointer flex items-center gap-1 transition-all active:scale-95 shadow-2xs ${
                                  itemReview
                                    ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                                    : 'bg-orange-50 hover:bg-orange-100 text-[#ea580c] border-orange-200/80'
                                }`}
                              >
                                <Star size={11} className={itemReview ? 'text-slate-500' : 'fill-[#ea580c] text-[#ea580c]'} />
                                {itemReview ? 'View Review' : 'Rate Product'}
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-slate-500 italic">No specific item details</p>
                  )}
                </div>

                {/* Footer: Grand Total & Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Grand Total</span>
                    <span className="text-sm font-extrabold text-slate-900">₹{order.total}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => handleReorder(order, e)}
                      disabled={reorderingId === order.id}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border-none cursor-pointer flex items-center gap-1 transition-colors"
                      title="Add items to cart"
                    >
                      <RotateCcw size={12} className={reorderingId === order.id ? 'animate-spin' : ''} />
                      Re-Order
                    </button>

                    <button 
                      onClick={() => navigate('/track-order', { state: { order: order.rawOrder } })}
                      className="px-3.5 py-1.5 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold rounded-xl border-none cursor-pointer flex items-center gap-1 shadow-2xs transition-colors"
                    >
                      <Eye size={12} />
                      View Details
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        ) : (
          <div className="py-16 px-4 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-16 h-16 rounded-full bg-orange-50 text-[#ea580c] flex items-center justify-center">
              <ShoppingBag size={28} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 m-0">No Orders Found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                {searchTerm || statusFilter !== 'ALL'
                  ? 'No past orders matched your search or status filter. Try clearing the filter.'
                  : "You don't have any purchase order history yet. Discover great products and place your first order!"}
              </p>
            </div>

            {searchTerm || statusFilter !== 'ALL' ? (
              <button 
                onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border-none cursor-pointer transition-colors"
              >
                Clear Filters
              </button>
            ) : (
              <button 
                onClick={() => navigate('/')}
                className="px-5 py-2.5 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold rounded-xl border-none cursor-pointer transition-colors shadow-2xs"
              >
                Start Shopping
              </button>
            )}
          </div>
        )}
      </div>

      {/* Product Rating Modal */}
      <ProductRatingModal
        isOpen={isRatingModalOpen}
        onClose={() => {
          setIsRatingModalOpen(false);
          setSelectedProductToRate(null);
          setSelectedReviewToEdit(null);
        }}
        product={selectedProductToRate}
        orderId={selectedOrderToRate}
        existingReview={selectedReviewToEdit}
        onSuccess={handleReviewSuccess}
      />

    </div>
  );
};

export default OrderHistory;
