import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Attempt to load from localStorage first
  useEffect(() => {
    const saved = localStorage.getItem('userLocation');
    if (saved) {
      setCurrentLocation(JSON.parse(saved));
    }
    setIsLoading(false);
  }, []);

  const setLocation = (locationObj) => {
    setCurrentLocation(locationObj);
    localStorage.setItem('userLocation', JSON.stringify(locationObj));
  };

  const clearLocation = () => {
    setCurrentLocation(null);
    localStorage.removeItem('userLocation');
  };

  return (
    <LocationContext.Provider 
      value={{ 
        currentLocation, 
        setLocation, 
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
