import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DriverBottomNav from '../components/DriverBottomNav';

const DriverJobs = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('available');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [acceptedJob, setAcceptedJob] = useState(null);

  const jobsList = [
    {
      id: 'JOB-9021',
      payout: 1250.00,
      distance: '14.2 km',
      time: '42 mins',
      cargoType: 'Cold Chain Pharma',
      cargoIcon: 'ac_unit',
      badgeColor: 'bg-blue-100 text-blue-800',
      pickup: 'BioLogix Central Hub, Bay 14',
      dropoff: 'St. Jude Regional Medical Depot',
      weight: '450 kg',
      priority: 'HIGH PRIORITY',
    },
    {
      id: 'JOB-8842',
      payout: 850.50,
      distance: '8.7 km',
      time: '28 mins',
      cargoType: 'Electronics Freight',
      cargoIcon: 'memory',
      badgeColor: 'bg-purple-100 text-purple-800',
      pickup: 'TechPort Logistics Warehouses',
      dropoff: 'Metro Distribution Hub B',
      weight: '820 kg',
      priority: 'STANDARD',
    },
    {
      id: 'JOB-7731',
      payout: 640.00,
      distance: '5.1 km',
      time: '18 mins',
      cargoType: 'Automotive Parts',
      cargoIcon: 'settings',
      badgeColor: 'bg-amber-100 text-amber-800',
      pickup: 'Industrial Parts Plant 4',
      dropoff: 'Apex Fleet Motors Workshop',
      weight: '310 kg',
      priority: 'STANDARD',
    },
    {
      id: 'JOB-6520',
      payout: 1450.00,
      distance: '22.0 km',
      time: '55 mins',
      cargoType: 'Heavy Industrial Machinery',
      cargoIcon: 'precision_manufacturing',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      pickup: 'Midwest Freight Terminal C',
      dropoff: 'Vanguard Structural Yard',
      weight: '1,800 kg',
      priority: 'EXPRESS',
    },
  ];

  const handleAcceptJob = (job) => {
    setAcceptedJob(job);
  };

  const confirmJobAcceptance = () => {
    navigate('/driver/active-delivery');
  };

  const filteredJobs = jobsList.filter((job) => {
    const matchesSearch =
      job.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.pickup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.dropoff.toLowerCase().includes(searchQuery.toLowerCase());
    if (selectedFilter === 'High Payout') return matchesSearch && job.payout >= 90;
    if (selectedFilter === 'Short Distance') return matchesSearch && parseFloat(job.distance) <= 10;
    if (selectedFilter === 'Cold Chain') return matchesSearch && job.cargoType.includes('Cold');
    return matchesSearch;
  });

  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen pb-24">
      {/* Compact Top Header */}
      <header className="fixed top-0 left-0 w-full z-40 bg-surface/90 backdrop-blur-md shadow-sm border-b border-outline-variant/10 px-3 py-2">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="font-headline-md text-base font-bold text-primary leading-tight">Job Queue</h1>
            <p className="text-[10px] text-on-surface-variant font-medium">4 routes available near Chicago</p>
          </div>
          <button
            onClick={() => alert('Refreshing live freight board...')}
            className="p-1.5 text-primary hover:bg-surface-container-high rounded-lg transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">refresh</span>
          </button>
        </div>
      </header>

      {/* Main Container - Added comfortable top padding & margin */}
      <main className="pt-16 md:pt-20 px-3.5 max-w-7xl mx-auto space-y-3.5 mt-2.5">
        {/* Search Bar */}
        <div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-lg">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Job ID, Hub, or Destination..."
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl py-2 pl-9 pr-3 text-xs font-body-md focus:ring-1 focus:ring-secondary focus:outline-none placeholder:text-outline-variant"
            />
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex border-b border-outline-variant/20">
          <button
            onClick={() => setActiveTab('available')}
            className={`flex-1 py-2 text-xs font-bold text-center border-b-2 transition-all cursor-pointer ${
              activeTab === 'available'
                ? 'border-secondary text-secondary'
                : 'border-transparent text-on-surface-variant hover:text-primary'
            }`}
          >
            Available Jobs ({jobsList.length})
          </button>
          <button
            onClick={() => setActiveTab('assigned')}
            className={`flex-1 py-2 text-xs font-bold text-center border-b-2 transition-all cursor-pointer ${
              activeTab === 'assigned'
                ? 'border-secondary text-secondary'
                : 'border-transparent text-on-surface-variant hover:text-primary'
            }`}
          >
            Assigned (2)
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-2 text-xs font-bold text-center border-b-2 transition-all cursor-pointer ${
              activeTab === 'completed'
                ? 'border-secondary text-secondary'
                : 'border-transparent text-on-surface-variant hover:text-primary'
            }`}
          >
            Completed (14)
          </button>
        </div>

        {/* Jobs List */}
        {activeTab === 'available' && (
          <div className="space-y-3">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="glass-panel p-3.5 rounded-xl border-white/60 hover:shadow-md transition-all space-y-3 group"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary-container text-primary-fixed-dim flex items-center justify-center shadow-xs shrink-0">
                      <span className="material-symbols-outlined text-base">{job.cargoIcon}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold text-primary">{job.id}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${job.badgeColor}`}>
                          {job.priority}
                        </span>
                      </div>
                      <p className="text-[11px] font-medium text-on-surface-variant mt-0.5">{job.cargoType} • {job.weight}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-headline-md text-lg md:text-xl font-bold text-secondary">₹{job.payout.toFixed(2)}</p>
                    <p className="text-[10px] text-on-surface-variant font-medium">{job.distance} • {job.time}</p>
                  </div>
                </div>

                {/* Pickup & Dropoff details */}
                <div className="bg-surface-container-low/80 p-2.5 rounded-lg space-y-1.5 border border-outline-variant/20">
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="material-symbols-outlined text-secondary text-sm shrink-0">warehouse</span>
                    <span className="font-bold text-on-surface shrink-0">Pickup:</span>
                    <span className="text-on-surface-variant truncate">{job.pickup}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="material-symbols-outlined text-secondary text-sm shrink-0">location_on</span>
                    <span className="font-bold text-on-surface shrink-0">Dropoff:</span>
                    <span className="text-on-surface-variant truncate">{job.dropoff}</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex gap-2 pt-0.5">
                  <button
                    onClick={() => handleAcceptJob(job)}
                    className="flex-1 bg-secondary hover:bg-secondary/90 text-white font-bold py-2 rounded-xl text-xs transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    Accept Delivery
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </button>
                  <button
                    onClick={() => alert(`Showing route preview map for ${job.id}`)}
                    className="bg-surface-container-high hover:bg-surface-container-highest text-primary p-2 rounded-xl transition-colors cursor-pointer"
                    title="View Route Details"
                  >
                    <span className="material-symbols-outlined text-base">map</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'assigned' && (
          <div className="glass-panel p-6 rounded-xl text-center space-y-3">
            <span className="material-symbols-outlined text-4xl text-secondary">local_shipping</span>
            <h3 className="font-bold text-primary text-base">Active Assigned Deliveries</h3>
            <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
              You have 2 assigned deliveries in queue. Order #SNX-1024 is currently in transit.
            </p>
            <button
              onClick={() => navigate('/driver/active-delivery')}
              className="bg-primary text-white font-bold px-5 py-2 rounded-xl text-xs shadow-xs hover:bg-primary-container transition-all cursor-pointer"
            >
              Resume Active Delivery (#SNX-1024)
            </button>
          </div>
        )}

        {activeTab === 'completed' && (
          <div className="glass-panel p-4 rounded-xl space-y-3">
            <h3 className="font-bold text-primary text-sm">Shift Completed History (14 Deliveries)</h3>
            <div className="space-y-2">
              {[
                { id: 'JOB-5412', payout: '₹840.00', time: '10:42 AM', hub: 'Warehouse Zone B' },
                { id: 'JOB-5390', payout: '₹1,105.50', time: '09:15 AM', hub: 'Central Port Terminal' },
                { id: 'JOB-5210', payout: '₹760.00', time: '08:00 AM', hub: 'Industrial Park North' },
              ].map((item) => (
                <div key={item.id} className="flex justify-between items-center p-2.5 bg-surface-container-low rounded-lg">
                  <div>
                    <p className="font-bold text-xs text-primary">{item.id} • {item.hub}</p>
                    <p className="text-[10px] text-on-surface-variant">Delivered at {item.time}</p>
                  </div>
                  <span className="font-bold text-xs text-secondary">{item.payout}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Confirmation Modal */}
      {acceptedJob && (
        <div className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-5 rounded-2xl max-w-md w-full border-white shadow-2xl space-y-3 animate-float">
            <div className="w-10 h-10 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-xl">check_circle</span>
            </div>
            <div className="text-center space-y-0.5">
              <h3 className="font-bold text-lg text-primary">Accept {acceptedJob.id}?</h3>
              <p className="text-xs text-on-surface-variant">
                Payout: <span className="font-bold text-secondary">₹{acceptedJob.payout.toFixed(2)}</span> • {acceptedJob.distance}
              </p>
            </div>
            <div className="bg-surface-container p-2.5 rounded-lg text-xs space-y-1 border border-outline-variant/30">
              <p className="font-semibold text-primary">{acceptedJob.pickup}</p>
              <p className="text-on-surface-variant">➔ {acceptedJob.dropoff}</p>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setAcceptedJob(null)}
                className="flex-1 py-2.5 rounded-xl border border-outline-variant text-xs font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                Decline
              </button>
              <button
                onClick={confirmJobAcceptance}
                className="flex-1 py-2.5 rounded-xl bg-secondary hover:bg-secondary/90 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                Confirm & Navigate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Driver Bottom Navigation */}
      <DriverBottomNav />
    </div>
  );
};

export default DriverJobs;
