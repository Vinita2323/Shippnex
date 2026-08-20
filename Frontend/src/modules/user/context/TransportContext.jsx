import React, { createContext, useContext, useState } from 'react';

const TransportContext = createContext();

export const useTransport = () => {
  const context = useContext(TransportContext);
  if (!context) {
    throw new Error('useTransport must be used within a TransportProvider');
  }
  return context;
};

export const TransportProvider = ({ children }) => {
  // Active booking draft (cleared after checkout)
  const [activeBooking, setActiveBooking] = useState({
    pickup: null, // string address (or object for Phase 2)
    stops: [], // array of string addresses for intermediate stops
    drop: null, // string address (or object)
    goods: {
      category: '',
      weight: '',
      packages: '',
      instructions: ''
    },
    vehicle: null, // vehicle ID or object
    fareEstimate: null, // To store the returned fare breakdown
  });

  const updateActiveBooking = (key, value) => {
    setActiveBooking(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearActiveBooking = () => {
    setActiveBooking({
      pickup: null,
      stops: [],
      drop: null,
      goods: { category: '', weight: '', packages: '', instructions: '' },
      vehicle: null,
      fareEstimate: null,
    });
  };

  const value = {
    activeBooking,
    updateActiveBooking,
    clearActiveBooking,
  };

  return <TransportContext.Provider value={value}>{children}</TransportContext.Provider>;
};
