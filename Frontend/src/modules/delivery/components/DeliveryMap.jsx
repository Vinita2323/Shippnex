import React, { useEffect, useState, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '1.5rem',
};

const defaultCenter = {
  lat: 28.6139,
  lng: 77.2090,
};

const DeliveryMap = ({ pickupLocation, dropLocation, captainLocation, onMapLoad }) => {
  const [directions, setDirections] = useState(null);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const mapsRef = useRef(null);

  const handleMapLoad = (map) => {
    mapsRef.current = map;
    setIsLoaded(true);
    onMapLoad?.(map);
  };

  useEffect(() => {
    if (!isLoaded || !window.google) return;

    const directionsService = new window.google.maps.DirectionsService();

    const getCoordinates = (location) => {
      if (typeof location === 'object' && location.lat && location.lng) {
        return location;
      }
      return null;
    };

    const startLocation = captainLocation || pickupLocation;
    const endLocation = dropLocation;

    if (!startLocation || !endLocation) return;

    const startCoords = getCoordinates(startLocation);
    const endCoords = getCoordinates(endLocation);

    if (!startCoords || !endCoords) return;

    directionsService.route(
      {
        origin: startCoords,
        destination: endCoords,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
          setError(null);
        } else if (status !== window.google.maps.DirectionsStatus.ZERO_RESULTS) {
          setError('Could not calculate directions');
        }
      }
    );
  }, [pickupLocation, dropLocation, captainLocation, isLoaded]);

  const center = captainLocation || pickupLocation || defaultCenter;

  return (
    <div className="glass-panel p-0 rounded-2xl border border-white/60 shadow-xs overflow-hidden">
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={15}
          onLoad={handleMapLoad}
        >
          {captainLocation && (
            <Marker
              position={captainLocation}
              title="Your Location"
              icon="http://maps.google.com/mapfiles/ms/icons/green-dot.png"
            />
          )}

          {pickupLocation && !captainLocation && (
            <Marker
              position={pickupLocation}
              title="Pickup Location"
              icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            />
          )}

          {dropLocation && (
            <Marker
              position={dropLocation}
              title="Drop Location"
              icon="http://maps.google.com/mapfiles/ms/icons/orange-dot.png"
            />
          )}

          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </LoadScript>
      {error && (
        <div className="p-3 bg-red-50 border-t border-red-200 text-red-700 text-xs">
          {error}
        </div>
      )}
    </div>
  );
};

export default DeliveryMap;
