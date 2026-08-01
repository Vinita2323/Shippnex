import React from 'react';
import { useNavigate } from 'react-router-dom';

const NewJobRequest = () => {
  const navigate = useNavigate();

  const handleAccept = () => {
    navigate('/captain/navigation-active');
  };

  const handleReject = () => {
    navigate('/captain/dashboard');
  };

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen overflow-hidden relative select-none">
      {/* Map Background Context */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-primary/30 backdrop-grayscale-[0.5] z-10"></div>
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url('${localStorage.getItem('shippnex_captain_avatar') || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBMY_u_VgnDQcYP9Ujq5FQV8jWvhDDWs5l8S3hLa1aS4-6-0CgPnl6C2VqY7hbSlqJY5sq2QnqmNe1UQXbP5T082lmhyI66mAizahgkEY1XtS78XQADAXCPQmWBRIypSG6cJmrQk0w2vTy4VUaC8PdqkJw4qxRqDR3tAK6UEP6KUEK2Dcab2X9H83PZAVp4i1-kwL_pcimy4rA0zFxZedA8Zar4751l0-niA08rGw4brevuod93iZVp22_MElsUjWy7BsAgj9BFUY'}')`,
          }}
        ></div>
      </div>

      {/* Top App Bar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 py-3 bg-surface/80 backdrop-blur-md shadow-sm border-b border-outline-variant/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-primary-fixed overflow-hidden">
            <img
              className="w-full h-full object-cover"
              alt="Captain Profile"
              src={localStorage.getItem('shippnex_captain_avatar') || "https://lh3.googleusercontent.com/aida-public/AB6AXuARG_eSgZxZRXTZozeU8IDAvgnKwHGCtRM-_7g-xuGfNVxBuwIGpRgljmCao3X3UgfNEc1sn9CAiMpEGYLndhaVk0E_3JK6DFfEedDoP2UgCA5XWM_n8YjIC2yaY8m7-qsiEspkIuKKWUlzPA6abDsebmzkH0znqPhlpY0aQhdM3mcosRN__CcZCDVcKMT89UXDWkam12leLjHXiduzru1i1CZIzK2JraSc3fC5YHxLN0bVZaYmPUHJpNEkt-dCoWnMg8urJ5GXBuY"}
            />
          </div>
          <span className="font-headline-lg text-lg font-bold text-primary">ShippNex</span>
        </div>
        <button
          onClick={() => navigate('/captain/notifications')}
          className="material-symbols-outlined text-primary hover:opacity-80 transition-opacity p-2 rounded-full hover:bg-surface-container cursor-pointer"
        >
          notifications
        </button>
      </header>

      {/* Main Content: Floating Job Request Card */}
      <main className="relative z-20 min-h-screen flex items-center justify-center p-4 pt-16">
        <div className="glass-panel w-full max-w-xl rounded-3xl overflow-hidden flex flex-col transition-all duration-500 border-white/80 shadow-2xl">
          {/* Job Banner */}
          <div className="bg-primary px-6 py-5 flex justify-between items-center text-white">
            <div className="flex flex-col">
              <span className="font-label-sm text-xs text-primary-fixed uppercase tracking-widest">New Shipment Request</span>
              <h2 className="font-headline-md text-xl font-bold text-white mt-0.5">Order #NX-88241</h2>
            </div>
            <div className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-sm text-xs font-bold flex items-center gap-2">
              <span className="w-2 h-2 bg-secondary rounded-full animate-ping"></span>
              ACTIVE NOW
            </div>
          </div>

          {/* Job Content */}
          <div className="p-6 space-y-5">
            {/* Earnings Highlight */}
            <div className="flex flex-col items-center justify-center py-4 bg-surface-container-low rounded-2xl border border-outline-variant/30">
              <span className="font-label-sm text-xs text-on-surface-variant mb-0.5 uppercase tracking-wider font-semibold">Estimated Earnings</span>
              <div className="text-4xl font-extrabold text-secondary font-mono flex items-baseline">
                <span className="text-xl font-bold mr-1">₹</span>1,425.00
              </div>
            </div>

            {/* Route Details */}
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-primary-fixed-dim shrink-0">
                  <span className="material-symbols-outlined text-base">warehouse</span>
                </div>
                <div>
                  <p className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">Pickup Location</p>
                  <p className="font-headline-md font-bold text-primary text-base">Westside Distribution Center</p>
                  <p className="text-xs text-on-surface-variant">Gate 4, 1200 Industrial Way, Unit B</p>
                </div>
              </div>

              <div className="flex gap-3 items-start border-t border-outline-variant/20 pt-3">
                <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-secondary shrink-0">
                  <span className="material-symbols-outlined text-base">location_on</span>
                </div>
                <div>
                  <p className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">Drop Location</p>
                  <p className="font-headline-md font-bold text-primary text-base">TechnoCity Hub</p>
                  <p className="text-xs text-on-surface-variant">45 Innovation Blvd, Tech Park</p>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              <div className="p-3 bg-white/70 rounded-xl border border-outline-variant/20 flex flex-col">
                <span className="material-symbols-outlined text-on-surface-variant text-lg mb-1">straighten</span>
                <span className="font-label-sm text-[10px] text-on-surface-variant uppercase">Distance</span>
                <span className="font-bold text-sm text-primary">12.4 km</span>
              </div>
              <div className="p-3 bg-white/70 rounded-xl border border-outline-variant/20 flex flex-col">
                <span className="material-symbols-outlined text-on-surface-variant text-lg mb-1">schedule</span>
                <span className="font-label-sm text-[10px] text-on-surface-variant uppercase">Est. Time</span>
                <span className="font-bold text-sm text-primary">32 mins</span>
              </div>
              <div className="p-3 bg-white/70 rounded-xl border border-outline-variant/20 flex flex-col">
                <span className="material-symbols-outlined text-on-surface-variant text-lg mb-1">package_2</span>
                <span className="font-label-sm text-[10px] text-on-surface-variant uppercase">Packages</span>
                <span className="font-bold text-sm text-primary">24 Boxes</span>
              </div>
              <div className="p-3 bg-white/70 rounded-xl border border-outline-variant/20 flex flex-col">
                <span className="material-symbols-outlined text-on-surface-variant text-lg mb-1">payments</span>
                <span className="font-label-sm text-[10px] text-on-surface-variant uppercase">Payment</span>
                <span className="font-bold text-sm text-primary">Prepaid</span>
              </div>
            </div>

            {/* Vehicle Info */}
            <div className="flex items-center gap-3 p-3.5 bg-secondary-fixed/10 rounded-2xl border border-secondary-fixed/30">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-secondary shadow-sm shrink-0">
                <span className="material-symbols-outlined text-xl">local_shipping</span>
              </div>
              <div>
                <p className="font-label-sm text-[10px] text-on-secondary-fixed-variant uppercase font-bold">Vehicle Required</p>
                <p className="text-xs text-primary font-bold">Mini Truck (Max 1.5 Tonne)</p>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleReject}
                className="py-3.5 px-6 rounded-xl border border-outline-variant text-xs font-bold text-on-surface-variant hover:bg-error/10 hover:text-error hover:border-error transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">close</span>
                Reject Job
              </button>
              <button
                onClick={handleAccept}
                className="py-3.5 px-6 rounded-xl bg-secondary-container hover:bg-secondary-fixed text-on-secondary-container text-xs font-bold shadow-lg transition-all transform active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Accept Shipment
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewJobRequest;
