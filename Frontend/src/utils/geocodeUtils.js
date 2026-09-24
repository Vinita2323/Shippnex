let geocoder = null;

const initGeocoder = () => {
  if (typeof window !== 'undefined' && window.google && !geocoder) {
    geocoder = new window.google.maps.Geocoder();
  }
  return geocoder;
};

export const geocodeAddress = (address) => {
  return new Promise((resolve, reject) => {
    const geocoderInstance = initGeocoder();
    if (!geocoderInstance) {
      reject(new Error('Geocoder not initialized'));
      return;
    }

    geocoderInstance.geocode({ address }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const location = results[0].geometry.location;
        resolve({
          lat: location.lat(),
          lng: location.lng(),
        });
      } else {
        reject(new Error(`Geocoding failed: ${status}`));
      }
    });
  });
};

export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
};
