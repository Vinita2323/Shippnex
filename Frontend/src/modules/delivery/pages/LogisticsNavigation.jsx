import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LogisticsNavigation = () => {
  const navigate = useNavigate();
  const [speed, setSpeed] = useState(55);
  const [isMuted, setIsMuted] = useState(false);

  // Live speed simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const variance = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
      setSpeed((prev) => Math.min(Math.max(prev + variance, 52), 58));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-surface font-body-md text-on-surface overflow-hidden h-screen w-full select-none relative">
      {/* Map Canvas Background */}
      <div className="absolute inset-0 z-0 bg-[#E5E9EC]">
        <div
          className="w-full h-full grayscale-[0.2] contrast-[0.9] bg-cover bg-center"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDBMY_u_VgnDQcYP9Ujq5FQV8jWvhDDWs5l8S3hLa1aS4-6-0CgPnl6C2VqY7hbSlqJY5sq2QnqmNe1UQXbP5T082lmhyI66mAizahgkEY1XtS78XQADAXCPQmWBRIypSG6cJmrQk0w2vTy4VUaC8PdqkJw4qxRqDR3tAK6UEP6KUEK2Dcab2X9H83PZAVp4i1-kwL_pcimy4rA0zFxZedA8Zar4751l0-niA08rGw4brevuod93iZVp22_MElsUjWy7BsAgj9BFUY')`,
          }}
        ></div>
        {/* Animated Route SVG Overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-90" preserveAspectRatio="none" viewBox="0 0 1000 1000">
          <path
            className="route-glow"
            d="M 200,800 L 400,600 L 450,400 L 700,250 L 850,100"
            fill="none"
            stroke="#3b82f6"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="8"
          ></path>
          <circle cx="200" cy="800" fill="#002625" r="10"></circle>
          <circle cx="850" cy="100" fill="#ba1a1a" r="12"></circle>
        </svg>
      </div>

      {/* Top AppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 py-3 bg-surface/80 backdrop-blur-md shadow-sm border-b border-outline-variant/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-container overflow-hidden border border-secondary-fixed">
            <img
              className="w-full h-full object-cover"
              alt="Driver Profile"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAEyDGAdscDL39_nY8qtEE-EKlU5Yzk_5V2Bvr4oyNFSQ0-NKqS_mB8Ctb3CailKWrz62e_BqwhwUC5a7n6ME8bwodDsrgNk4u1PptFSTpqJw_gjaHtJVHg8aIo1ja01ccSyQdNnd9fPpR8Fu0wVk5cCXsQfHSD3wBx7p9NYmyy1g7EIElxHr5imZB2Cs0EQFmKMUxvRpnAteLivauhVxVdaROob09JTJvuPNNgJemX0X8bWDfK95iSBeRwaAskoAdLyA6jSco9m0"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-headline-md text-primary font-bold leading-tight">ShippNex</span>
            <span className="font-label-sm text-xs text-outline tracking-wider uppercase font-bold">NAVIGATING</span>
          </div>
        </div>
        <button
          onClick={() => alert('Notifications: Route recalculated (Saved 4 mins)')}
          className="w-10 h-10 flex items-center justify-center rounded-full text-primary hover:opacity-80 transition-opacity active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </header>

      {/* Floating Search/Address Bar */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[90%] md:w-[600px] z-40">
        <div className="glass-panel rounded-2xl shadow-lg border border-outline-variant/40 p-3 flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center text-secondary bg-secondary-container/20 rounded-xl">
            <span className="material-symbols-outlined">explore</span>
          </div>
          <div className="flex-1">
            <h2 className="font-headline-md font-bold text-on-surface text-base md:text-lg">1422 North Wacker Drive</h2>
            <p className="font-label-sm text-xs text-outline-variant">Destination • Chicago, IL</p>
          </div>
          <div className="h-8 w-[1px] bg-outline-variant/30 mx-1"></div>
          <button
            onClick={() => alert('Route options: Avoid tolls, Prefer highways')}
            className="w-10 h-10 flex items-center justify-center text-primary hover:bg-surface-variant/50 rounded-xl transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <main className="relative z-10 h-full flex flex-col justify-end pb-32 px-4 md:px-8">
        {/* Navigation Intelligence Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-4xl mx-auto">
          {/* Primary ETA Card */}
          <div className="col-span-2 glass-panel p-5 rounded-2xl shadow-xl border border-white/50 flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <span className="font-label-sm text-xs font-bold text-secondary uppercase tracking-widest">ETA</span>
              <span className="material-symbols-outlined text-secondary animate-pulse">schedule</span>
            </div>
            <div>
              <h3 className="font-display-lg text-4xl md:text-5xl font-extrabold text-primary leading-none">14:45</h3>
              <p className="font-body-md text-xs text-on-surface-variant mt-1 font-medium">Arrival in 24 mins</p>
            </div>
          </div>

          {/* Distance & Traffic Status */}
          <div className="glass-panel p-4 rounded-2xl shadow-md border border-white/50 flex flex-col justify-center gap-2">
            <span className="font-label-sm text-xs font-bold text-outline tracking-wider uppercase">REMAINING</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-primary">12.4</span>
              <span className="text-xs font-bold text-outline">mi</span>
            </div>
            <div className="mt-2 flex items-center gap-2 px-2.5 py-1 rounded-full bg-secondary-container/30 w-fit">
              <div className="w-2 h-2 rounded-full bg-secondary"></div>
              <span className="text-[10px] font-bold text-secondary uppercase">Light Traffic</span>
            </div>
          </div>

          {/* Current Speed */}
          <div className="glass-panel p-4 rounded-2xl shadow-md border border-white/50 flex flex-col justify-center gap-2">
            <span className="font-label-sm text-xs font-bold text-outline tracking-wider uppercase">SPEED</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-primary transition-all duration-300">{speed}</span>
              <span className="text-xs font-bold text-outline">mph</span>
            </div>
            <div className="mt-2 h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
              <div className="h-full bg-secondary w-[85%] rounded-full transition-all duration-500"></div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Controls Shell */}
      <footer className="fixed bottom-0 left-0 w-full z-50">
        {/* Floating Action Controls */}
        <div className="absolute bottom-24 right-4 flex flex-col gap-3">
          <button
            onClick={() => alert('Recalculating best route avoiding congestion...')}
            className="w-14 h-14 rounded-full bg-primary shadow-2xl flex items-center justify-center text-secondary-fixed hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="Recalculate Route"
          >
            <span className="material-symbols-outlined text-3xl">navigation</span>
          </button>
          <button
            onClick={() => alert('Map View Toggled')}
            className="w-12 h-12 rounded-full glass-panel shadow-lg flex items-center justify-center text-primary border border-white/50 hover:bg-surface transition-all cursor-pointer"
            title="Layers"
          >
            <span className="material-symbols-outlined">layers</span>
          </button>
        </div>

        {/* Action Bar */}
        <div className="glass-panel flex justify-between items-center px-6 py-4 rounded-t-3xl shadow-2xl border-t border-white/50">
          <div className="flex gap-4">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="flex flex-col items-center gap-1 group cursor-pointer"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-surface-container-high group-hover:bg-surface-container-highest transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant">
                  {isMuted ? 'volume_off' : 'volume_up'}
                </span>
              </div>
              <span className="font-label-sm text-xs text-on-surface-variant">{isMuted ? 'Muted' : 'Voice'}</span>
            </button>

            <button
              onClick={() => alert('Sharing live route tracking link with dispatcher...')}
              className="flex flex-col items-center gap-1 group cursor-pointer"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-surface-container-high group-hover:bg-surface-container-highest transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant">share</span>
              </div>
              <span className="font-label-sm text-xs text-on-surface-variant">Share</span>
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate('/driver/delivery-verification')}
              className="bg-secondary text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg hover:opacity-90 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">assignment_turned_in</span>
              Verify Arrival
            </button>

            <button
              onClick={() => navigate('/driver/dashboard')}
              className="bg-error text-on-error px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-error/20 flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">close</span>
              Exit Trip
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LogisticsNavigation;
