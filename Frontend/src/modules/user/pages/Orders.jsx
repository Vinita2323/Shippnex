import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Package, CreditCard, PackageOpen, ArrowLeft, SlidersHorizontal, X, Check, Box, Truck } from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { useTransport } from '../context/TransportContext';
import grainsImg from '../../../assets/user/categories/grains-removebg-preview.png';

const Orders = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // State
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

  const filterOptions = ['All', 'In Transit', 'Delivered', 'Cancelled'];

  const { orders } = useOrder();
  const { transportBookings } = useTransport();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing': return 'text-orange-500';
      case 'In Transit': return 'text-blue-600';
      case 'Delivered': return 'text-green-500';
      case 'Cancelled': return 'text-red-500';
      default: return 'text-slate-500';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'All' || order.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredTransport = transportBookings.filter(booking => {
    return booking.id.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="h-[100dvh] bg-[#f8fafc] font-sans text-slate-800 relative max-w-[480px] mx-auto shadow-[0_0_20px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">
      
      {/* Peach Header */}
      <header className="flex flex-col gap-0 py-4 px-5 bg-[#ffece1] z-10 pb-0">
        <div className="flex items-center gap-4 mb-4">
          <ArrowLeft size={24} className="text-[#1e1b4b] cursor-pointer" onClick={() => navigate(-1)} />
          <h2 className="text-[20px] font-medium m-0 text-[#1e1b4b]">My Bookings</h2>
        </div>
        
        {/* Tabs */}
        <div className="flex w-full gap-4">
          <div 
            className={`pb-3 text-[14px] font-bold cursor-pointer relative ${activeTab === 'shopping' ? 'text-[#ff5500]' : 'text-slate-500'}`}
            onClick={() => setActiveTab('shopping')}
          >
            Shopping
            {activeTab === 'shopping' && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#ff5500] rounded-t-md"></div>}
          </div>
          <div 
            className={`pb-3 text-[14px] font-bold cursor-pointer relative ${activeTab === 'transport' ? 'text-[#ff5500]' : 'text-slate-500'}`}
            onClick={() => setActiveTab('transport')}
          >
            Vehicles
            {activeTab === 'transport' && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#ff5500] rounded-t-md"></div>}
          </div>
        </div>
      </header>

      {/* Search & Filters */}
      <div className="px-5 py-4 bg-[#f8fafc] flex gap-3 z-10">
        <div className="flex-1 bg-white border border-slate-200 rounded-xl flex items-center px-3 gap-2">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input 
            type="text" 
            placeholder="Search orders" 
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
          filteredOrders.length > 0 ? (
          filteredOrders.map((order, index) => (
            <div key={index} className="bg-white rounded-[16px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col gap-3">
              
              {/* Top Row: Icon, ID/Date, Status */}
              <div className="flex items-start justify-between">
                <div className="flex gap-3 items-center">
                  <div className="w-[44px] h-[44px] rounded-[12px] bg-[#f0f3f6] flex items-center justify-center shrink-0 overflow-hidden">
                    {order.items[0]?.image ? (
                      <img src={order.items[0].image} alt="Order Item" className="w-[85%] h-[85%] object-contain mix-blend-multiply" />
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
                    onClick={() => navigate('/track-order')}
                    className="bg-transparent border-none text-blue-600 text-[11px] font-bold cursor-pointer p-0 hover:text-blue-700 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>

            </div>
          ))
        ) : (
          <div className="bg-white rounded-[20px] flex flex-col items-center justify-center py-16 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-slate-100 mt-2">
            <Package size={48} className="text-slate-300 mb-4" strokeWidth={1.5} />
            <span className="text-[15px] font-medium text-slate-600">No shopping orders found.</span>
          </div>
        )
        ) : (
          filteredTransport.length > 0 ? (
            filteredTransport.map((booking, index) => (
              <div key={index} className="bg-white rounded-[16px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col gap-3">
                
                {/* Top Row */}
                <div className="flex items-start justify-between">
                  <div className="flex gap-3 items-center">
                    <div className="w-[44px] h-[44px] rounded-[12px] bg-green-50 flex items-center justify-center shrink-0 border border-green-100 text-green-700">
                      <Truck size={24} strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[14px] font-extrabold text-slate-900 tracking-tight">{booking.id}</span>
                      <span className="text-[12px] font-medium text-slate-500">{booking.date}</span>
                    </div>
                  </div>
                  <span className={`text-[12px] font-bold ${booking.status === 'Pending' ? 'text-orange-500' : 'text-blue-600'}`}>
                    {booking.status}
                  </span>
                </div>
  
                <div className="w-full h-px bg-slate-100 my-0.5"></div>
  
                {/* Locations Row */}
                <div className="flex flex-col gap-1.5 px-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#047857]"></div>
                    <span className="text-[12px] font-medium text-slate-700 truncate">{booking.pickup}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-sm bg-[#ff5500]"></div>
                    <span className="text-[12px] font-medium text-slate-700 truncate">{booking.drop}</span>
                  </div>
                </div>

                <div className="w-full h-px bg-slate-100 my-0.5"></div>
  
                {/* Bottom Row */}
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-slate-500">{booking.vehicle.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[14px] font-extrabold text-slate-900">₹{booking.fare}</span>
                    <button 
                      onClick={() => navigate('/transport/booking-details', { state: { bookingId: booking.id } })}
                      className="bg-[#047857] text-white border-none rounded-lg px-3 py-1.5 text-[11px] font-bold cursor-pointer hover:bg-emerald-800 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
  
              </div>
            ))
          ) : (
            <div className="bg-white rounded-[20px] flex flex-col items-center justify-center py-16 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-slate-100 mt-2">
              <Truck size={48} className="text-slate-300 mb-4" strokeWidth={1.5} />
              <span className="text-[15px] font-medium text-slate-600">No vehicle bookings found.</span>
            </div>
          )
        )}
      </div>

    </div>
  );
};

export default Orders;
