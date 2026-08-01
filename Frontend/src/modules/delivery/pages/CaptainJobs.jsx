import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CaptainBottomNav from '../components/CaptainBottomNav';

const CaptainJobs = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('deliveries');
  const [searchQuery, setSearchQuery] = useState('');
  const [acceptedJob, setAcceptedJob] = useState(null);
  const [selectedDetailJob, setSelectedDetailJob] = useState(null);

  // Deliveries List matching reference design
  const deliveryItems = [
    {
      id: 'DEL-8102',
      payout: 480.00,
      distance: '4.2 km',
      time: '18 mins',
      title: 'Grocery & Dairy Staples',
      pickupHub: 'SuperMart Hub',
      pickupAddress: 'Sector 45, Noida, UP 201301',
      dropHub: 'Greenwood Heights',
      dropAddress: 'Greenwood, Sector 50, Noida, UP 201301',
      weight: '35 kg',
      tag1: 'EXPRESS',
      tag1Style: 'bg-[#0a3d16] text-[#86efac]',
      tag2: 'HIGH PAYING',
      tag2Style: 'bg-[#dcfce7] text-[#15803d]',
      icon: 'local_grocery_store',
      customerName: 'Aarav Sharma',
      customerPhone: '+91 98765 43210',
      itemsList: ['Basmati Rice (10kg)', 'Refined Cooking Oil (5L)', 'Sugar (5kg)', 'Dairy & Fresh Spices'],
    },
    {
      id: 'DEL-8109',
      payout: 350.00,
      distance: '3.1 km',
      time: '14 mins',
      title: 'Bakery & Organic Produce',
      pickupHub: 'FreshFarm Depot',
      pickupAddress: 'Sector 63, Noida, UP 201301',
      dropHub: 'Sunrise Apartments',
      dropAddress: 'Sector 62, Noida, UP 201301',
      weight: '18 kg',
      tag1: 'STANDARD',
      tag1Style: 'bg-[#2563eb] text-white',
      tag2: 'NEARBY',
      tag2Style: 'bg-[#e0f2fe] text-[#0284c7]',
      icon: 'shopping_basket',
      customerName: 'Priya Verma',
      customerPhone: '+91 98123 45678',
      itemsList: ['Whole Wheat Bread (4 pkts)', 'Organic Apples (3kg)', 'Fresh Farm Milk (5L)', 'Artisanal Cheese'],
    },
    {
      id: 'DEL-8115',
      payout: 620.00,
      distance: '7.8 km',
      time: '26 mins',
      title: 'Personal Care & Homecare Box',
      pickupHub: 'Reliance Depot A',
      pickupAddress: 'Phase 2, Noida Industrial Area, UP',
      dropHub: 'Urban Superstore',
      dropAddress: 'Sector 18 Market, Noida, UP 201301',
      weight: '42 kg',
      tag1: 'PRIORITY',
      tag1Style: 'bg-[#7e22ce] text-white',
      tag2: 'HIGH PAYING',
      tag2Style: 'bg-[#dcfce7] text-[#15803d]',
      icon: 'sanitizer',
      customerName: 'Vikram Singh',
      customerPhone: '+91 99555 12345',
      itemsList: ['Detergent Liquids (10L)', 'Soaps & Shampoos Box', 'Surface Cleaners & Disinfectants'],
    },
    {
      id: 'DEL-8122',
      payout: 890.00,
      distance: '11.5 km',
      time: '35 mins',
      title: 'Bulk FMCG & Beverage Pack',
      pickupHub: 'Wholesale Central Yard',
      pickupAddress: 'Greater Noida Logistics Park, UP',
      dropHub: 'City Retail Mart',
      dropAddress: 'Sector 14, Greater Noida, UP 201308',
      weight: '95 kg',
      tag1: 'BULK CARGO',
      tag1Style: 'bg-[#b45309] text-white',
      tag2: 'EXPRESS',
      tag2Style: 'bg-[#dcfce7] text-[#15803d]',
      icon: 'inventory_2',
      customerName: 'Rajesh Gupta',
      customerPhone: '+91 97111 88990',
      itemsList: ['Atta Bags (20kg x2)', 'Pure Ghee Cans (15L)', 'Mineral Water Cases (5 Cases)', 'Snack Bundles'],
    },
  ];

  // Bookings List matching reference design
  const bookingItems = [
    {
      id: 'BKG-9940',
      payout: 4500.00,
      distance: '28.5 km',
      time: '1 hr 10 mins',
      title: 'Heavy Freight Transport',
      vehicleRequired: 'Eicher Pro 3019 (10 Tonne)',
      pickupHub: 'SteelCraft Industrial Plant 2',
      pickupAddress: 'EcoTech 3, Greater Noida, UP',
      dropHub: 'Metro Infra Site B',
      dropAddress: 'Expressway Extension, Sector 142, Noida',
      weight: '8.5 Tonne',
      tag1: 'LOADING READY',
      tag1Style: 'bg-[#c2410c] text-white',
      tag2: 'HEAVY TRUCK',
      tag2Style: 'bg-[#fef3c7] text-[#b45309]',
      icon: 'local_shipping',
      loadingDock: 'Gate 4, West Terminal',
      laborInfo: '4 Loaders Included at Dock',
      customerName: 'Vanguard Engineering Ltd',
      customerPhone: '+91 98100 99887',
    },
    {
      id: 'BKG-9945',
      payout: 6800.00,
      distance: '45.0 km',
      time: '1 hr 45 mins',
      title: 'Full Truckload Equipment',
      vehicleRequired: 'Tata Prima 2830 (16 Tonne FTL)',
      pickupHub: 'Vanguard PreCast Concrete Works',
      pickupAddress: 'Surajpur Industrial Area, Noida, UP',
      dropHub: 'Highway Flyover Site Yard 4',
      dropAddress: 'NH-24 Expansion Site, Ghaziabad, UP',
      weight: '14.2 Tonne',
      tag1: 'SCHEDULED DOCK',
      tag1Style: 'bg-[#4338ca] text-white',
      tag2: 'HIGH PAYING',
      tag2Style: 'bg-[#dcfce7] text-[#15803d]',
      icon: 'precision_manufacturing',
      loadingDock: 'Bay 12, Heavy Yard',
      laborInfo: 'Overhead Crane Loading Required',
      customerName: 'National Highway Infra Co',
      customerPhone: '+91 99000 11223',
    },
  ];

  const completedItems = [
    { id: 'DEL-7412', payout: '₹840.00', time: '10:42 AM', type: 'Grocery & Dairy Box', hub: 'Warehouse Zone B' },
    { id: 'BKG-7390', payout: '₹4,105.50', time: '09:15 AM', type: 'Heavy Truck Loading', hub: 'Central Port Terminal' },
    { id: 'DEL-7210', payout: '₹760.00', time: '08:00 AM', type: 'Personal Care Hamper', hub: 'SuperMart Hub North' },
  ];

  const handleAcceptJob = (item) => {
    setAcceptedJob(item);
  };

  const confirmJobAcceptance = () => {
    navigate('/captain/active-delivery');
  };

  const filteredDeliveries = deliveryItems.filter((item) =>
    item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.pickupHub.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.dropHub.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBookings = bookingItems.filter((item) =>
    item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.vehicleRequired.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCompleted = completedItems.filter((item) =>
    item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.hub.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#f8fafc] font-body-md text-slate-800 min-h-screen pb-24">
      {/* Compact Top App Bar */}
      <header className="fixed top-0 left-0 w-full z-40 bg-gradient-to-r from-[#002625] to-[#0a3d16] shadow-lg rounded-b-3xl px-4 py-4 border-b border-white/10">
        <div className="max-w-xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="font-headline-md text-xl md:text-2xl font-black text-white tracking-tight leading-tight">Job Queue</h1>
            <p className="text-[10px] md:text-xs text-[#97fc43] font-medium tracking-wide uppercase mt-0.5">Deliveries & Booking Board</p>
          </div>
          <button
            onClick={() => alert('Refreshing live delivery board...')}
            className="w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-xl transition-colors cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="pt-24 px-3.5 max-w-xl mx-auto space-y-3.5 mt-1">
        {/* Search Bar Row */}
        <div className="flex gap-2.5 items-center">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Delivery ID, Customer or Route..."
              className="w-full bg-white border border-slate-200/90 rounded-2xl py-2.5 pl-10 pr-3 text-xs font-medium shadow-2xs focus:ring-2 focus:ring-secondary/40 focus:outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Tab Pills Bar */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar py-0.5">
          <button
            onClick={() => setActiveTab('deliveries')}
            className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'deliveries'
                ? 'bg-[#366b00] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80 shadow-2xs'
            }`}
          >
            <span className="material-symbols-outlined text-base">package_2</span>
            Deliveries ({deliveryItems.length})
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'bookings'
                ? 'bg-[#366b00] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80 shadow-2xs'
            }`}
          >
            <span className="material-symbols-outlined text-base">local_shipping</span>
            Bookings ({bookingItems.length})
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'completed'
                ? 'bg-[#366b00] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80 shadow-2xs'
            }`}
          >
            <span className="material-symbols-outlined text-base">check_circle</span>
            Completed (14)
          </button>
        </div>

        {/* Deliveries Tab: Responsive Compact Cards */}
        {activeTab === 'deliveries' && (
          <div className="space-y-3">
            {filteredDeliveries.map((item) => (
              <div
                key={item.id}
                className="bg-white p-3.5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-2.5 overflow-hidden"
              >
                {/* Title, Icon & Price Row */}
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#d9f99d] text-[#365314] flex items-center justify-center shadow-xs shrink-0">
                      <span className="material-symbols-outlined text-xl">{item.icon}</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-mono text-xs font-black text-slate-900 leading-none">{item.id}</h3>
                      <p className="font-bold text-xs text-slate-700 mt-0.5 truncate">{item.title}</p>
                    </div>
                  </div>
                  <p className="font-headline-md text-xl font-black text-[#15803d] shrink-0">₹{item.payout.toFixed(2)}</p>
                </div>

                {/* Vertical Dotted Route Box */}
                <div className="bg-slate-50/80 p-2.5 rounded-2xl border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex gap-2.5 items-start min-w-0 w-full sm:w-auto">
                    {/* Dotted Line Graphic */}
                    <div className="flex flex-col items-center pt-0.5 shrink-0">
                      <div className="w-2 h-2 rounded-full bg-[#15803d] ring-2 ring-emerald-100"></div>
                      <div className="w-0.5 h-5 border-l border-dashed border-slate-300 my-0.5"></div>
                      <span className="material-symbols-outlined text-xs text-[#002625]">location_on</span>
                    </div>

                    <div className="space-y-1.5 text-xs min-w-0 flex-1">
                      <div>
                        <span className="font-black text-[8px] text-[#15803d] uppercase tracking-widest block">PICKUP</span>
                        <p className="font-bold text-slate-900 text-xs leading-tight truncate">{item.pickupHub}</p>
                        <p className="text-[10px] text-slate-500 truncate">{item.pickupAddress}</p>
                      </div>
                      <div>
                        <span className="font-black text-[8px] text-slate-500 uppercase tracking-widest block">DROP</span>
                        <p className="font-bold text-slate-900 text-xs leading-tight truncate">{item.dropHub}</p>
                        <p className="text-[10px] text-slate-500 truncate">{item.dropAddress}</p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Bottom Action Buttons */}
                <div className="flex gap-2 pt-0.5">
                  <button
                    onClick={() => setSelectedDetailJob(item)}
                    className="w-1/2 bg-white border border-slate-200/90 py-2.5 rounded-2xl text-xs font-bold text-slate-800 flex items-center justify-center gap-1 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">description</span>
                    View Details
                  </button>

                  <button
                    onClick={() => handleAcceptJob(item)}
                    className="w-1/2 bg-[#366b00] hover:bg-[#2d5800] py-2.5 rounded-2xl text-xs font-bold text-white flex items-center justify-center gap-1 shadow-md transition-all cursor-pointer"
                  >
                    Accept Job
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bookings Tab: Heavy Freight Cards */}
        {activeTab === 'bookings' && (
          <div className="space-y-3">
            {filteredBookings.map((item) => (
              <div
                key={item.id}
                className="bg-white p-3.5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-2.5 overflow-hidden"
              >
                {/* Title, Icon & Price Row */}
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#366b00] text-white flex items-center justify-center shadow-xs shrink-0">
                      <span className="material-symbols-outlined text-xl">{item.icon}</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-mono text-xs font-black text-slate-900 leading-none">{item.id}</h3>
                      <p className="font-bold text-xs text-slate-700 mt-0.5 truncate">{item.title}</p>
                    </div>
                  </div>
                  <p className="font-headline-md text-xl font-black text-[#15803d] shrink-0">₹{item.payout.toFixed(2)}</p>
                </div>

                {/* Vehicle & Loading Dock Info */}
                <div className="bg-slate-50/80 p-2.5 rounded-2xl border border-slate-100 space-y-1 text-xs">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-500 font-medium">Vehicle:</span>
                    <span className="font-bold text-slate-900 truncate max-w-[200px]">{item.vehicleRequired}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-500 font-medium">Dock:</span>
                    <span className="font-bold text-[#15803d] truncate max-w-[200px]">{item.loadingDock}</span>
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="flex gap-2 pt-0.5">
                  <button
                    onClick={() => setSelectedDetailJob(item)}
                    className="w-1/2 bg-white border border-slate-200/90 py-2.5 rounded-2xl text-xs font-bold text-slate-800 flex items-center justify-center gap-1 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">description</span>
                    View Details
                  </button>

                  <button
                    onClick={() => handleAcceptJob(item)}
                    className="w-1/2 bg-[#366b00] hover:bg-[#2d5800] py-2.5 rounded-2xl text-xs font-bold text-white flex items-center justify-center gap-1 shadow-md transition-all cursor-pointer"
                  >
                    Accept Booking
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Completed Tab */}
        {activeTab === 'completed' && (
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Shift Completed History (14 Orders)</h3>
            <div className="space-y-2">
              {filteredCompleted.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                  <div>
                    <p className="font-bold text-xs text-slate-900">{item.id} • {item.type}</p>
                    <p className="text-[10px] text-slate-500">Delivered at {item.time} ({item.hub})</p>
                  </div>
                  <span className="font-bold text-xs text-[#15803d]">{item.payout}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Details Modal */}
      {selectedDetailJob && (
        <div className="fixed inset-0 z-[60] bg-white overflow-y-auto">
          <div className="p-4 md:p-6 w-full max-w-xl mx-auto space-y-4 pb-24">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono text-xs font-black text-slate-400">{selectedDetailJob.id}</span>
                <h3 className="font-bold text-base text-slate-900">{selectedDetailJob.title}</h3>
              </div>
              <button
                onClick={() => setSelectedDetailJob(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Payout & Route Overview */}
            <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest block">Estimated Payout</span>
                <p className="text-2xl font-black text-[#15803d]">₹{selectedDetailJob.payout.toFixed(2)}</p>
              </div>
              <div className="text-right text-xs font-bold text-emerald-900">
                <p>{selectedDetailJob.distance} • {selectedDetailJob.time}</p>
                <p className="text-[10px] text-emerald-700">Weight: {selectedDetailJob.weight}</p>
              </div>
            </div>

            {/* Address Breakdown */}
            <div className="space-y-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <div>
                <span className="font-black text-[9px] text-[#15803d] uppercase tracking-widest block">Pickup Address</span>
                <p className="font-bold text-slate-900">{selectedDetailJob.pickupHub}</p>
                <p className="text-slate-500 text-[11px]">{selectedDetailJob.pickupAddress}</p>
              </div>
              <div className="border-t border-slate-200/60 pt-2">
                <span className="font-black text-[9px] text-slate-500 uppercase tracking-widest block">Dropoff Address</span>
                <p className="font-bold text-slate-900">{selectedDetailJob.dropHub}</p>
                <p className="text-slate-500 text-[11px]">{selectedDetailJob.dropAddress}</p>
              </div>
            </div>

            {/* Items Included if Delivery */}
            {selectedDetailJob.itemsList && (
              <div className="space-y-1.5">
                <span className="font-bold text-xs text-slate-900 block">Items Included:</span>
                <ul className="space-y-1">
                  {selectedDetailJob.itemsList.map((itemStr, idx) => (
                    <li key={idx} className="text-xs text-slate-600 flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <span className="material-symbols-outlined text-sm text-[#15803d]">check_circle</span>
                      {itemStr}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Customer Contact */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
              <div>
                <p className="font-bold text-slate-900">{selectedDetailJob.customerName}</p>
                <p className="text-slate-500 text-[11px]">{selectedDetailJob.customerPhone}</p>
              </div>
              <button
                onClick={() => window.open(`tel:${selectedDetailJob.customerPhone}`, '_self')}
                className="px-3 py-1.5 bg-white border border-slate-200 text-slate-800 rounded-xl font-bold flex items-center gap-1 cursor-pointer hover:bg-slate-100"
              >
                <span className="material-symbols-outlined text-sm">call</span>
                Call
              </button>
            </div>

            {/* Accept Button */}
            <button
              onClick={() => {
                setSelectedDetailJob(null);
                handleAcceptJob(selectedDetailJob);
              }}
              className="w-full py-3 bg-[#366b00] hover:bg-[#2d5800] text-white font-bold text-xs rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              Accept Delivery Order
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {acceptedJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white p-5 rounded-3xl max-w-md w-full border border-slate-100 shadow-2xl space-y-3 animate-float">
            <div className="w-10 h-10 bg-emerald-100 text-[#15803d] rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-xl font-bold">check_circle</span>
            </div>
            <div className="text-center space-y-0.5">
              <h3 className="font-bold text-lg text-slate-900">Accept {acceptedJob.id}?</h3>
              <p className="text-xs text-slate-500">
                Payout: <span className="font-bold text-[#15803d]">₹{acceptedJob.payout.toFixed(2)}</span> • {acceptedJob.distance}
              </p>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl text-xs space-y-1 border border-slate-100">
              <p className="font-bold text-slate-900">{acceptedJob.title}</p>
              <p className="text-slate-500">Pickup: {acceptedJob.pickupHub}</p>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setAcceptedJob(null)}
                className="flex-1 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Decline
              </button>
              <button
                onClick={confirmJobAcceptance}
                className="flex-1 py-2.5 rounded-2xl bg-[#366b00] hover:bg-[#2d5800] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                Confirm & Navigate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Captain Bottom Navigation */}
      {!selectedDetailJob && !acceptedJob && <CaptainBottomNav />}
    </div>
  );
};

export default CaptainJobs;
