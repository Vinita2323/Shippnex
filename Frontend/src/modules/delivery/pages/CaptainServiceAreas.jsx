import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CaptainBottomNav from '../components/CaptainBottomNav';

const sellers = [
  {
    id: 1,
    name: 'Harshvardhan',
    address: '169, 507, Corporate House, R...',
    distance: '0.01 km',
    radius: '10 km',
    status: 'IN RANGE',
  },
  {
    id: 2,
    name: 'Fashion Hub',
    address: 'Corporate House, HO-406, RN...',
    distance: '0.01 km',
    radius: '9.1 km',
    status: 'IN RANGE',
  },
  {
    id: 3,
    name: 'TechPort Warehouse',
    address: 'TechPort Industrial Zone, Gate 2',
    distance: '2.4 km',
    radius: '15 km',
    status: 'IN RANGE',
  },
  {
    id: 4,
    name: 'BioLogix Hub',
    address: 'BioLogix Central Hub, Bay 14',
    distance: '4.8 km',
    radius: '8 km',
    status: 'IN RANGE',
  },
  {
    id: 5,
    name: 'Apex Fleet Motors',
    address: 'Apex Fleet Motors Workshop, Plot 7',
    distance: '6.3 km',
    radius: '12 km',
    status: 'IN RANGE',
  },
  {
    id: 6,
    name: 'Metro Distribution',
    address: 'Metro Distribution Hub B, Sector 5',
    distance: '8.1 km',
    radius: '20 km',
    status: 'IN RANGE',
  },
  {
    id: 7,
    name: 'Industrial Parts Co.',
    address: 'Industrial Parts Plant 4, Zone C',
    distance: '9.7 km',
    radius: '10 km',
    status: 'IN RANGE',
  },
  {
    id: 8,
    name: 'GreenMart Express',
    address: 'GreenMart Outlet, MG Road',
    distance: '11.2 km',
    radius: '15 km',
    status: 'OUT OF RANGE',
  },
  {
    id: 9,
    name: 'QuickPharma',
    address: 'QuickPharma Depot, Sector 9',
    distance: '14.5 km',
    radius: '10 km',
    status: 'OUT OF RANGE',
  },
  {
    id: 10,
    name: 'AutoSpares World',
    address: 'AutoSpares World, Ring Road',
    distance: '18.0 km',
    radius: '12 km',
    status: 'OUT OF RANGE',
  },
];

const CaptainServiceAreas = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('ALL');

  const filtered = sellers.filter((s) => {
    if (filter === 'IN RANGE') return s.status === 'IN RANGE';
    if (filter === 'OUT') return s.status === 'OUT OF RANGE';
    return true;
  });

  const inRangeCount = sellers.filter((s) => s.status === 'IN RANGE').length;

  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen pb-24">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-surface/90 backdrop-blur-md shadow-sm border-b border-outline-variant/10 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl text-on-surface-variant">arrow_back</span>
          </button>
          <div>
            <h1 className="font-bold text-sm text-primary leading-tight">Sellers in Range</h1>
            <p className="text-[10px] text-on-surface-variant">
              Showing stores that include your current location
            </p>
          </div>
        </div>
      </header>

      <main className="pt-20 px-3.5 max-w-2xl mx-auto space-y-3 mt-2">

        {/* Summary Banner */}
        <div className="glass-panel rounded-2xl p-3.5 flex items-center gap-3 border border-white/60">
          <div className="w-10 h-10 shrink-0 rounded-xl bg-secondary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-secondary text-xl">location_on</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-xs text-primary">Active Service Areas</p>
            <p className="text-[10px] text-on-surface-variant mt-0.5">
              You are currently in <span className="font-semibold text-primary">{inRangeCount}</span> seller radius
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse inline-block"></span>
            <span className="text-lg font-extrabold text-secondary leading-none">{inRangeCount}</span>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {['ALL', 'IN RANGE', 'OUT'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer border ${
                filter === tab
                  ? 'bg-secondary text-white border-secondary shadow-sm'
                  : 'bg-surface-container-low text-on-surface-variant border-outline-variant/30 hover:border-secondary/40'
              }`}
            >
              {tab === 'OUT' ? 'OUT OF RANGE' : tab}
            </button>
          ))}
        </div>

        {/* Seller Cards */}
        <div className="space-y-2.5">
          {filtered.map((seller) => (
            <div
              key={seller.id}
              className="glass-panel rounded-2xl p-4 border border-white/60 hover:shadow-md transition-all space-y-3"
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-primary">{seller.name}</span>
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                        seller.status === 'IN RANGE'
                          ? 'bg-secondary/15 text-secondary'
                          : 'bg-error/10 text-error'
                      }`}
                    >
                      {seller.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-on-surface-variant text-xs">location_on</span>
                    <span className="text-[11px] text-on-surface-variant truncate">{seller.address}</span>
                  </div>
                </div>

                {/* Store Icon */}
                <div className="w-10 h-10 shrink-0 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary text-xl">storefront</span>
                </div>
              </div>

              {/* Stats row */}
              <div className="flex gap-6 border-t border-outline-variant/20 pt-2.5">
                <div>
                  <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-wider">Distance</p>
                  <p className="font-extrabold text-sm text-primary mt-0.5">{seller.distance}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-wider">Service Radius</p>
                  <p className="font-extrabold text-sm text-primary mt-0.5">{seller.radius}</p>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-on-surface-variant">
              <span className="material-symbols-outlined text-5xl mb-2 block">location_off</span>
              <p className="text-sm font-semibold">No sellers found for this filter.</p>
            </div>
          )}
        </div>
      </main>

      <CaptainBottomNav />
    </div>
  );
};

export default CaptainServiceAreas;
