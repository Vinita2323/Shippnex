import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Package, ArrowLeft, SlidersHorizontal, Check, Box, Truck, Loader2, Star } from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { orderService, getCachedUserOrders } from '../../../services/authService';
import { transportService } from '../../../services/transportService';
import RatingModal from '../../../components/RatingModal';

const formatRawOrdersData = (rawList = []) => {
  return rawList.map(o => ({
    id: o.orderId || o._id,
    _id: o._id,
    date: o.createdAt 
      ? new Date(o.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      : 'Recent',
    status: o.orderStatus || o.status || 'Placed',
    rejectionReason: o.rejectionReason || '',
    items: o.items || [],
    total: o.grandTotal || o.total || 0,
    itemCount: (o.items || []).reduce((acc, i) => acc + (i.quantity || 1), 0),
    rawOrder: o,
  }));
};

const Orders = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTabState] = useState(() => {
    return location.state?.tab || sessionStorage.getItem('shippnex_orders_tab') || 'shopping';
  });

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    sessionStorage.setItem('shippnex_orders_tab', tab);
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  
  // Instant Initial State from Cache (0ms latency)
  const [serverOrders, setServerOrders] = useState(() => {
    const cached = getCachedUserOrders();
    if (cached && Array.isArray(cached.orders) && cached.orders.length > 0) {
      return formatRawOrdersData(cached.orders);
    }
    return [];
  });
  const [loading, setLoading] = useState(() => {
    const cached = getCachedUserOrders();
    return !(cached && Array.isArray(cached.orders) && cached.orders.length > 0);
  });
  const [transportBookings, setTransportBookings] = useState([]);
  const [transportLoading, setTransportLoading] = useState(false);
  const [ratingRide, setRatingRide] = useState(null);

  const filterOptions = ['All', 'Placed', 'Processing', 'Out for Delivery', 'Delivered', 'Cancelled'];

  const { orders: contextOrders } = useOrder();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderService.getOrders();
        if (res && res.success && res.orders) {
          setServerOrders(formatRawOrdersData(res.orders));
        }
      } catch (err) {
        console.error('Failed to fetch backend orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Fetch real transport bookings when tab is active
  useEffect(() => {
    if (activeTab !== 'transport') return;
    const fetchTransport = async () => {
      try {
        setTransportLoading(true);
        const res = await transportService.getUserBookings({ limit: 50 });
        setTransportBookings(res.bookings || []);
      } catch (err) {
        console.error('Failed to fetch transport bookings:', err);
      } finally {
        setTransportLoading(false);
      }
    };
    fetchTransport();
  }, [activeTab]);

  const allOrders = serverOrders.length > 0 ? serverOrders : contextOrders;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Placed': return 'text-orange-500';
      case 'Accepted': return 'text-emerald-600 font-extrabold';
      case 'Rejected': return 'text-red-600 font-extrabold';
      case 'Processing': return 'text-[#ff5500]';
      case 'Out for Delivery': return 'text-blue-600';
      case 'Delivered': return 'text-green-500';
      case 'Cancelled': return 'text-red-500';
      default: return 'text-slate-500';
    }
  };

  const filteredOrders = allOrders.filter(order => {
    const matchesSearch = String(order.id).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'All' || order.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredTransport = transportBookings.filter(booking => {
    return (booking.bookingId || '').toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="h-[100dvh] bg-[#f8fafc] font-sans text-slate-800 relative max-w-[480px] mx-auto shadow-[0_0_20px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">
      
      {/* Peach Header */}
      <header className="flex flex-col gap-0 py-4 px-5 bg-[#ffece1] z-10 pb-0">
        <div className="flex items-center gap-4 mb-4">
          <ArrowLeft size={24} className="text-[#1e1b4b] cursor-pointer" onClick={() => navigate(-1)} />
          <h2 className="text-[20px] font-medium m-0 text-[#1e1b4b]">My Bookings & Orders</h2>
        </div>
        
        {/* Tabs */}
        <div className="flex w-full gap-4">
          <div 
            className={`pb-3 text-[14px] font-bold cursor-pointer relative ${activeTab === 'shopping' ? 'text-[#ff5500]' : 'text-slate-500'}`}
            onClick={() => setActiveTab('shopping')}
          >
            Shopping Orders
            {activeTab === 'shopping' && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#ff5500] rounded-t-md"></div>}
          </div>
          <div 
            className={`pb-3 text-[14px] font-bold cursor-pointer relative ${activeTab === 'transport' ? 'text-[#ff5500]' : 'text-slate-500'}`}
            onClick={() => setActiveTab('transport')}
          >
            Vehicle Logistics
            {activeTab === 'transport' && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#ff5500] rounded-t-md"></div>}
          </div>
        </div>
      </header>

      {/* Quick Link to Order History */}
      <div className="bg-[#fff4ed] border-b border-orange-200/70 px-5 py-2.5 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
          <Package size={14} className="text-[#ff5500]" />
          <span>Looking for complete order history?</span>
        </div>
        <button 
          onClick={() => navigate('/order-history')}
          className="text-[#ff5500] hover:text-[#d97706] font-extrabold border-none bg-transparent cursor-pointer p-0 underline"
        >
          View Order History →
        </button>
      </div>

      {/* Search & Filters */}
      <div className="px-5 py-4 bg-[#f8fafc] flex gap-3 z-10">
        <div className="flex-1 bg-white border border-slate-200 rounded-xl flex items-center px-3 gap-2">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input 
            type="text" 
            placeholder="Search orders by ID..." 
            className="w-full bg-transparent border-none py-2.5 text-[14px] outline-none text-slate-700 placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* Filter Dropdown Container */}
        <div className="relative">
          <button 
            onClick={() => setIsFilterModalOpen(!isFilterModalOpen)}
            className={`h-full bg-white border ${selectedFilter !== 'All' ? 'border-[#ff5500] text-[#ff5500]' : 'border-slate-200 text-slate-700'} rounded-xl px-4 flex items-center gap-2 cursor-pointer active:scale-95 transition-transform`}
          >
            <SlidersHorizontal size={16} className={selectedFilter !== 'All' ? 'text-[#ff5500]' : 'text-slate-600'} />
            <span className="text-[14px] font-medium">Filters {selectedFilter !== 'All' && '(1)'}</span>
          </button>

          {/* Dropdown Menu */}
          {isFilterModalOpen && (
            <>
              {/* Invisible overlay to close dropdown when clicking outside */}
              <div 
                className="fixed inset-0 z-[90]"
                onClick={() => setIsFilterModalOpen(false)}
              ></div>
              <div className="absolute top-full mt-2 right-0 w-[180px] bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden z-[100] animate-fade-in-up origin-top-right">
                {filterOptions.map((option) => (
                  <div 
                    key={option}
                    className={`flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors ${selectedFilter === option ? 'bg-orange-50/50' : ''}`}
                    onClick={() => {
                      setSelectedFilter(option);
                      setIsFilterModalOpen(false);
                    }}
                  >
                    <span className={`text-[14px] ${selectedFilter === option ? 'font-bold text-[#ff5500]' : 'font-medium text-slate-600'}`}>
                      {option}
                    </span>
                    {selectedFilter === option && <Check size={16} className="text-[#ff5500]" />}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Order List */}
      <div className="flex-1 overflow-y-auto px-5 pb-[100px] pt-2 [&::-webkit-scrollbar]:hidden flex flex-col gap-3.5">
        
        {activeTab === 'shopping' ? (
          loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 size={32} className="animate-spin text-[#ff5500]" />
              <span className="text-sm font-bold text-slate-700">Loading your orders...</span>
            </div>
          ) : filteredOrders.length > 0 ? (
          filteredOrders.map((order, index) => {
            const firstItemImg = order.items?.[0]?.image || order.items?.[0]?.product?.mainImage || order.items?.[0]?.product?.image;
            return (
            <div key={index} className="bg-white rounded-[16px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col gap-3">
              
              {/* Top Row: Icon, ID/Date, Status */}
              <div className="flex items-start justify-between">
                <div className="flex gap-3 items-center">
                  <div className="w-[44px] h-[44px] rounded-[12px] bg-[#f0f3f6] flex items-center justify-center shrink-0 overflow-hidden">
                    {firstItemImg ? (
                      <img src={firstItemImg} alt="Order Item" className="w-full h-full object-cover" />
                    ) : (
                      <Box size={20} className="text-slate-400" />
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[14px] font-extrabold text-slate-900 tracking-tight">{order.id}</span>
                    <span className="text-[12px] font-medium text-slate-500">{order.date}</span>
                  </div>
                </div>
                <span className={`text-[12px] font-bold ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-slate-100 my-0.5"></div>

              {/* Bottom Row: Items, Price, Link */}
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-slate-500">{order.itemCount} Items</span>
                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-[15px] font-extrabold text-slate-900">₹{order.total}.00</span>
                  <button 
                    onClick={() => navigate('/track-order', { state: { order: order.rawOrder || order } })}
                    className="bg-transparent border-none text-[#ff5500] hover:text-[#d97706] text-[12px] font-extrabold cursor-pointer p-0 transition-colors"
                  >
                    View Details →
                  </button>
                </div>
              </div>

            </div>
          );
        })
        ) : (
          <div className="bg-white rounded-[20px] flex flex-col items-center justify-center py-16 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-slate-100 mt-2">
            <Package size={48} className="text-slate-300 mb-4" strokeWidth={1.5} />
            <span className="text-[15px] font-medium text-slate-600">No active shopping orders found.</span>
            <button 
              onClick={() => navigate('/order-history')}
              className="mt-3 px-4 py-2 bg-orange-50 text-[#ff5500] font-bold text-xs rounded-xl border border-orange-200 cursor-pointer"
            >
              View Full Order History
            </button>
          </div>
        )
        ) : (
          transportLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
              <Loader2 size={32} className="animate-spin text-[#047857]" />
              <span className="text-[14px]">Loading transport bookings...</span>
            </div>
          ) : filteredTransport.length > 0 ? (
            filteredTransport.map((booking, index) => {
              const bId = booking.bookingId || booking._id;
              const bDate = booking.createdAt
                ? new Date(booking.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                : '—';
              const bPickup = booking.pickupLocation?.address || '—';
              const bDrop = booking.dropLocation?.address || '—';
              const bVehicle = booking.vehicleSnapshot?.name || '—';
              const bFare = booking.fareBreakdown?.totalFare ?? 0;
              const bStatus = booking.status || 'SEARCHING_CAPTAIN';
              const statusLabel = {
                SEARCHING_CAPTAIN: 'Searching', CAPTAIN_ASSIGNED: 'Assigned',
                RIDE_STARTED: 'In Progress', RIDE_COMPLETED: 'Delivered', CANCELLED: 'Cancelled'
              }[bStatus] || bStatus;
              const statusColor = bStatus === 'CANCELLED' ? 'text-red-500' : bStatus === 'RIDE_COMPLETED' ? 'text-green-600' : bStatus === 'SEARCHING_CAPTAIN' ? 'text-orange-500' : 'text-blue-600';

              return (
                <div key={index} className="bg-white rounded-[16px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3 items-center">
                      <div className="w-[44px] h-[44px] rounded-[12px] bg-green-50 flex items-center justify-center shrink-0 border border-green-100 text-green-700">
                        <Truck size={24} strokeWidth={1.5} />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[14px] font-extrabold text-slate-900 tracking-tight">{bId}</span>
                        <span className="text-[12px] font-medium text-slate-500">{bDate}</span>
                      </div>
                    </div>
                    <span className={`text-[12px] font-bold ${statusColor}`}>{statusLabel}</span>
                  </div>

                  <div className="w-full h-px bg-slate-100 my-0.5"></div>

                  <div className="flex flex-col gap-1.5 px-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#047857]"></div>
                      <span className="text-[12px] font-medium text-slate-700 truncate">{bPickup}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-sm bg-[#ff5500]"></div>
                      <span className="text-[12px] font-medium text-slate-700 truncate">{bDrop}</span>
                    </div>
                  </div>

                  <div className="w-full h-px bg-slate-100 my-0.5"></div>

                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold text-slate-500">{bVehicle}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-extrabold text-slate-900">₹{bFare}</span>
                      {bStatus === 'RIDE_COMPLETED' && (
                        booking.hasUserRated ? (
                          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200/80 px-2.5 py-1 rounded-lg text-[11px] font-extrabold">
                            <Star size={11} className="fill-amber-400 text-amber-400" />
                            <span>{booking.userRating}/5</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => setRatingRide(booking)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white border-none rounded-lg px-2.5 py-1 text-[11px] font-extrabold cursor-pointer transition-colors shadow-2xs flex items-center gap-1"
                          >
                            <Star size={11} className="fill-white" />
                            <span>Rate</span>
                          </button>
                        )
                      )}
                      <button
                        onClick={() => navigate('/transport/booking-details', { state: { bookingId: bId } })}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 border-none rounded-lg px-2.5 py-1.5 text-[11px] font-bold cursor-pointer transition-colors"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-[20px] flex flex-col items-center justify-center py-16 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-slate-100 mt-2">
              <Truck size={48} className="text-slate-300 mb-4" strokeWidth={1.5} />
              <span className="text-[15px] font-medium text-slate-600">No vehicle bookings found.</span>
            </div>
          )
        )}
      </div>

      {/* Rating Modal for Vehicle Logistics */}
      <RatingModal
        isOpen={Boolean(ratingRide)}
        onClose={() => setRatingRide(null)}
        ride={ratingRide}
        role="user"
        onSuccess={(res) => {
          setTransportBookings((prev) =>
            prev.map((b) =>
              (b.bookingId === ratingRide?.bookingId || b._id === ratingRide?._id)
                ? { ...b, hasUserRated: true, userRating: res.rating?.rating || 5 }
                : b
            )
          );
          setRatingRide(null);
        }}
      />

    </div>
  );
};

export default Orders;
