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
  // Store all confirmed transport bookings
  const [transportBookings, setTransportBookings] = useState([]);

  // Active booking draft (cleared after checkout)
  const [activeBooking, setActiveBooking] = useState({
    pickup: null, // string address
    stops: [], // array of string addresses for intermediate stops
    drop: null, // string address
    goods: {
      category: '',
      weight: '',
      packages: '',
      instructions: ''
    },
    vehicle: null, // object with name, capacity, price, etc.
  });

  const updateActiveBooking = (key, value) => {
    setActiveBooking(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const createBooking = (bookingData) => {
    const newBooking = {
      ...bookingData,
      id: `TRX${Math.floor(Math.random() * 1000000000)}`,
      date: new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'Pending',
      timeline: [
        { status: 'Pending', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), completed: true },
        { status: 'Captain Assigned', time: null, completed: false },
        { status: 'In Transit', time: null, completed: false },
        { status: 'Delivered', time: null, completed: false }
      ]
    };
    
    setTransportBookings(prev => [newBooking, ...prev]);
    return newBooking;
  };

  const clearActiveBooking = () => {
    setActiveBooking({
      pickup: null,
      stops: [],
      drop: null,
      goods: { category: '', weight: '', packages: '', instructions: '' },
      vehicle: null,
    });
  };

  const value = {
    transportBookings,
    activeBooking,
    updateActiveBooking,
    createBooking,
    clearActiveBooking,
  };

  return <TransportContext.Provider value={value}>{children}</TransportContext.Provider>;
};
