import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState(() => {
    try {
      const saved = localStorage.getItem('userLocation');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Keep sync with localStorage if updated outside React
    const saved = localStorage.getItem('userLocation');
    if (saved && !currentLocation) {
      try {
        setCurrentLocation(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const setLocation = (locationObj) => {
    setCurrentLocation(locationObj);
    if (locationObj) {
      localStorage.setItem('userLocation', JSON.stringify(locationObj));
    } else {
      localStorage.removeItem('userLocation');
    }
    try {
      window.dispatchEvent(new CustomEvent('shippnex_location_changed', { detail: locationObj }));
    } catch (e) {}
  };

  const clearLocation = () => {
    setCurrentLocation(null);
    localStorage.removeItem('userLocation');
    try {
      window.dispatchEvent(new CustomEvent('shippnex_location_changed', { detail: null }));
    } catch (e) {}
  };

  return (
    <LocationContext.Provider 
      value={{ 
        currentLocation, 
        setLocation, 
        setCurrentLocation: setLocation,
        clearLocation, 
        permissionGranted, 
        setPermissionGranted,
        isLoading
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => useContext(LocationContext);
