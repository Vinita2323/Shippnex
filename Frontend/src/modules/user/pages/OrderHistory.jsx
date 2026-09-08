import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Search, Package, Clock, CheckCircle2, Truck, 
  RotateCcw, ChevronRight, ChevronDown, ChevronUp, XCircle, ShoppingBag, Loader2, 
  RefreshCw, Eye, Copy, Check, Star, ShieldCheck, CreditCard, Banknote
} from 'lucide-react';
import { orderService, getCachedUserOrders } from '../../../services/authService';
import productReviewService from '../../../services/productReviewService';
import ProductRatingModal from '../../../components/ProductRatingModal';
import { useCart } from '../context/CartContext';
import { getImageUrl, grainsImg } from '../../../utils/imageUtils';

const formatRawOrdersList = (rawList = []) => {
  return rawList.map(o => {
    const rawStatus = (o.orderStatus || o.status || 'Placed').trim();
    return {
      id: o.orderId || o._id,
      _id: o._id,
      orderId: o.orderId || o._id,
      rawDate: o.createdAt,
      date: o.createdAt 
        ? new Date(o.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
        : 'Recent',
      fullDate: o.createdAt
        ? new Date(o.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        : 'Recent',
      time: o.createdAt 
        ? new Date(o.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
        : '',
      status: rawStatus,
      rejectionReason: o.rejectionReason || o.cancellationReason || '',
      paymentMethod: o.paymentMethod || 'COD',
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
  const [expandedOrderIds, setExpandedOrderIds] = useState({});

  // Product Rating Modal & Reviews State
  const [userReviews, setUserReviews] = useState({});
  const [selectedProductToRate, setSelectedProductToRate] = useState(null);
  const [selectedOrderToRate, setSelectedOrderToRate] = useState(null);
  const [selectedReviewToEdit, setSelectedReviewToEdit] = useState(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  const toggleExpandItems = (orderId, e) => {
    e.stopPropagation();
    setExpandedOrderIds(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

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
      setReorderSuccess(`Items added to cart!`);
      setTimeout(() => setReorderSuccess(''), 2500);
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
      if (statusFilter === 'COMPLETED' && !['Delivered', 'Completed'].includes(o.status)) return false;
      if (statusFilter === 'ACTIVE' && !['Placed', 'Accepted', 'Processing', 'Out for Delivery'].includes(o.status)) return false;
      if (statusFilter === 'CANCELLED' && !['Cancelled', 'Rejected'].includes(o.status)) return false;

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const matchesId = String(o.id || '').toLowerCase().includes(q);
        const matchesDate = String(o.fullDate || o.date || '').toLowerCase().includes(q);
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
          icon: <CheckCircle2 size={10} className="text-emerald-600" />,
          label: 'Delivered',
        };
      case 'Placed':
      case 'Accepted':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-700',
          icon: <Clock size={10} className="text-amber-600" />,
          label: status,
        };
      case 'Processing':
      case 'Out for Delivery':
        return {
          bg: 'bg-blue-50 border-blue-200 text-blue-700',
          icon: <Truck size={10} className="text-blue-600" />,
          label: status,
        };
      case 'Cancelled':
      case 'Rejected':
        return {
          bg: 'bg-rose-50 border-rose-200 text-rose-700',
          icon: <XCircle size={10} className="text-rose-600" />,
          label: status,
        };
      default:
        return {
          bg: 'bg-slate-50 border-slate-200 text-slate-700',
          icon: <Clock size={10} className="text-slate-500" />,
          label: status,
        };
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#f8fafc] font-sans text-slate-800 relative max-w-[480px] mx-auto shadow-[0_0_20px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">
      
      {/* Compact Top Header */}
      <header className="bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] text-white px-3 pt-2.5 pb-2 shadow-sm z-20 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate('/profile')}
              className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center border-none cursor-pointer text-white transition-colors"
              aria-label="Back to Profile"
            >
              <ArrowLeft size={15} />
            </button>
            <div className="flex items-center gap-1.5">
              <h1 className="text-[14.5px] font-black m-0 leading-tight">Order History</h1>
              <span className="text-[9.5px] bg-white/20 text-orange-50 font-bold px-1.5 py-0.2 rounded-full">
                {orders.length}
              </span>
            </div>
          </div>

          <button 
            onClick={() => fetchOrderHistory(true)} 
            disabled={loading}
            className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center border-none cursor-pointer text-white transition-colors"
            title="Refresh Orders"
            aria-label="Refresh Orders"
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Slim Search Input */}
        <div className="relative w-full">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-orange-200" />
          <input 
            type="text"
            placeholder="Search by order ID, item name, or date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/15 border border-white/25 rounded-lg pl-7 pr-6 py-1 text-[11px] text-white placeholder:text-orange-200/90 outline-none focus:bg-white/25 focus:border-white transition-all h-7"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/80 hover:text-white border-none bg-transparent cursor-pointer p-0 text-[11px] leading-none"
            >
              ✕
            </button>
          )}
        </div>
      </header>

      {/* Slim Active Orders Banner */}
      <div className="bg-[#fff7ed] border-b border-orange-200/60 px-3 py-1 flex items-center justify-between text-[10.5px] text-slate-700 shrink-0">
        <span className="font-medium text-slate-600">Track ongoing live deliveries?</span>
        <button 
          onClick={() => navigate('/orders')}
          className="text-[#ea580c] hover:text-[#c2410c] font-bold text-[10.5px] bg-transparent border-none cursor-pointer flex items-center gap-0.5 p-0"
        >
          Active Orders <ChevronRight size={11} />
        </button>
      </div>

      {/* Compact Filter Tabs */}
      <div className="px-2.5 py-1.5 bg-white border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto [&::-webkit-scrollbar]:hidden shrink-0 z-10">
        <button 
          onClick={() => setStatusFilter('ALL')}
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-all whitespace-nowrap cursor-pointer ${
            statusFilter === 'ALL'
              ? 'bg-[#ea580c] text-white border-[#ea580c] shadow-2xs'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          All ({counts.total})
        </button>

        <button 
          onClick={() => setStatusFilter('COMPLETED')}
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
            statusFilter === 'COMPLETED'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <CheckCircle2 size={9.5} /> Delivered ({counts.completed})
        </button>

        <button 
          onClick={() => setStatusFilter('ACTIVE')}
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
            statusFilter === 'ACTIVE'
              ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <Clock size={9.5} /> Active ({counts.active})
        </button>

        <button 
          onClick={() => setStatusFilter('CANCELLED')}
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
            statusFilter === 'CANCELLED'
              ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <XCircle size={9.5} /> Cancelled ({counts.cancelled})
        </button>
      </div>

      {/* Toast Feedback */}
      {reorderSuccess && (
        <div className="mx-2.5 mt-1.5 p-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-[10.5px] font-bold flex items-center justify-between shrink-0 animate-fadeIn">
          <span>✓ {reorderSuccess}</span>
          <button onClick={() => navigate('/cart')} className="underline bg-transparent border-none cursor-pointer text-emerald-900 font-extrabold text-[10.5px]">View Cart</button>
        </div>
      )}

      {/* Main Order History Compact List */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2 [&::-webkit-scrollbar]:hidden">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-2 text-slate-400">
            <Loader2 size={24} className="animate-spin text-[#ea580c]" />
            <span className="text-[11px] font-bold text-slate-600">Loading orders...</span>
          </div>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map((order) => {
            const statusInfo = getStatusBadge(order.status);
            const totalItems = order.items?.length || 0;
            const isExpanded = !!expandedOrderIds[order.id];
            const displayedItems = isExpanded ? (order.items || []) : (order.items || []).slice(0, 2);
            const isOrderDelivered = ['Delivered', 'Completed'].includes(order.status);
            const isCancelled = ['Cancelled', 'Rejected'].includes(order.status);

            return (
              <div 
                key={order.id}
                onClick={() => navigate('/track-order', { state: { order: order.rawOrder } })}
                className="bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-orange-300 transition-all p-2.5 space-y-1.5 cursor-pointer"
              >
                {/* Compact Card Header */}
                <div className="flex items-center justify-between gap-1.5 border-b border-slate-100/90 pb-1.5">
                  <div className="flex items-center gap-1 min-w-0">
                    <span className="text-[11px] font-extrabold text-slate-900 font-mono tracking-tight">{order.id}</span>
                    <button 
                      onClick={(e) => handleCopyOrderId(order.id, e)}
                      className="p-0.5 text-slate-400 hover:text-slate-700 border-none bg-transparent cursor-pointer rounded leading-none"
                      title="Copy ID"
                    >
                      {copiedId === order.id ? <Check size={10} className="text-emerald-600" /> : <Copy size={10} />}
                    </button>
                    <span className="text-[9.5px] text-slate-400 font-medium truncate">
                      • {order.date} {order.time && `(${order.time})`}
                    </span>
                  </div>

                  <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold border flex items-center gap-1 shrink-0 ${statusInfo.bg}`}>
                    {statusInfo.icon}
                    {statusInfo.label}
                  </span>
                </div>

                {/* Compact Items List */}
                <div className="space-y-1">
                  {displayedItems.map((item, iIdx) => {
                    const itemImg = item.image || item.product?.mainImage || item.product?.image;
                    const itemName = item.name || item.product?.name || 'Item';
                    const itemPrice = item.price || item.product?.price || 0;
                    const itemQty = item.quantity || 1;
                    const prodId = item.product?._id || item.product || item.productId || item.id;
                    const itemReview = isOrderDelivered && prodId ? (userReviews[`${order.orderId}_${prodId}`] || userReviews[`${order.id}_${prodId}`] || userReviews[`${order._id}_${prodId}`]) : null;

                    return (
                      <div key={iIdx} className="p-1 rounded-lg bg-slate-50/70 border border-slate-100 flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                          <div className="w-7 h-7 rounded-md bg-white border border-slate-200/70 flex items-center justify-center shrink-0 overflow-hidden">
                            <img 
                              src={getImageUrl(itemImg, grainsImg)} 
                              alt={itemName} 
                              className="w-full h-full object-cover" 
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = grainsImg;
                              }}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-slate-800 text-[10.5px] truncate m-0 leading-tight">{itemName}</p>
                            <p className="text-[9px] text-slate-400 m-0">Qty: {itemQty} × ₹{itemPrice}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <span className="font-black text-slate-900 text-[10.5px]">₹{itemPrice * itemQty}</span>
                          
                          {/* Inline Rate Button for Delivered orders */}
                          {isOrderDelivered && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenRateModal(item, order, itemReview);
                              }}
                              className={`px-1.5 py-0.5 text-[9px] font-bold rounded border cursor-pointer flex items-center gap-0.5 transition-all ${
                                itemReview
                                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                                  : 'bg-orange-50 text-[#ea580c] border-orange-200 hover:bg-orange-100'
                              }`}
                              title={itemReview ? `You rated ${itemReview.rating}/5` : 'Rate item'}
                            >
                              <Star size={8.5} className={itemReview ? 'fill-amber-500 text-amber-500' : 'fill-[#ea580c] text-[#ea580c]'} />
                              {itemReview ? `${itemReview.rating}★` : 'Rate'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Expand/Collapse more items toggle */}
                  {totalItems > 2 && (
                    <button
                      type="button"
                      onClick={(e) => toggleExpandItems(order.id, e)}
                      className="w-full py-0.5 text-[9.5px] font-bold text-[#ea580c] bg-orange-50/50 hover:bg-orange-50 border border-orange-100 rounded flex items-center justify-center gap-0.5 cursor-pointer transition-colors"
                    >
                      {isExpanded ? (
                        <>Show less <ChevronUp size={10} /></>
                      ) : (
                        <>+ {totalItems - 2} more item{totalItems - 2 > 1 ? 's' : ''} <ChevronDown size={10} /></>
                      )}
                    </button>
                  )}
                </div>

                {/* Reason Banner if Cancelled / Rejected */}
                {isCancelled && order.rejectionReason && (
                  <div className="px-2 py-0.5 bg-rose-50 border border-rose-100 rounded text-[9.5px] text-rose-700 font-medium truncate">
                    <span className="font-bold">Reason:</span> {order.rejectionReason}
                  </div>
                )}

                {/* Compact Card Footer */}
                <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-[8.5px] font-extrabold uppercase px-1 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-200/60">
                      {order.paymentMethod === 'ONLINE' ? 'Online' : 'COD'}
                    </span>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-[9.5px] text-slate-400 font-bold">Total:</span>
                      <span className="text-[12px] font-black text-slate-900">₹{order.total}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button 
                      onClick={(e) => handleReorder(order, e)}
                      disabled={reorderingId === order.id}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[9.5px] font-bold rounded-md border-none cursor-pointer flex items-center gap-1 transition-colors"
                    >
                      <RotateCcw size={9} className={reorderingId === order.id ? 'animate-spin' : ''} />
                      Re-order
                    </button>

                    <button 
                      onClick={() => navigate('/track-order', { state: { order: order.rawOrder } })}
                      className="px-2.5 py-1 bg-[#ea580c] hover:bg-[#c2410c] text-white text-[9.5px] font-bold rounded-md border-none cursor-pointer flex items-center gap-1 shadow-2xs transition-colors"
                    >
                      <Eye size={9} />
                      Details
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        ) : (
          <div className="py-12 px-4 flex flex-col items-center justify-center text-center bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-full bg-orange-50 text-[#ea580c] flex items-center justify-center">
              <ShoppingBag size={20} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 m-0">No Orders Found</h3>
              <p className="text-[10.5px] text-slate-500 mt-0.5 max-w-xs m-0">
                {searchTerm || statusFilter !== 'ALL'
                  ? 'No past orders match your search or filter.'
                  : "You don't have any purchase order history yet."}
              </p>
            </div>

            {searchTerm || statusFilter !== 'ALL' ? (
              <button 
                onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded-lg border-none cursor-pointer transition-colors"
              >
                Clear Filters
              </button>
            ) : (
              <button 
                onClick={() => navigate('/')}
                className="px-3 py-1.5 bg-[#ea580c] hover:bg-[#c2410c] text-white text-[11px] font-bold rounded-lg border-none cursor-pointer transition-colors shadow-2xs"
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
