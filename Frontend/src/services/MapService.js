export const MapService = {
  // Uses Google Maps Geocoder
  reverseGeocode: async (lat, lng) => {
    if (!window.google || !window.google.maps) {
      throw new Error('Google Maps API not loaded.');
    }

    const geocoder = new window.google.maps.Geocoder();
    const latlng = { lat: parseFloat(lat), lng: parseFloat(lng) };

    try {
      const response = await geocoder.geocode({ location: latlng });
      if (response.results && response.results[0]) {
        return MapService.parseAddressComponents(response.results[0]);
      }
      return null;
    } catch (err) {
      console.error('Geocoder failed due to: ', err);
      throw err;
    }
  },

  geocodeAddress: async (address) => {
     if (!window.google || !window.google.maps) {
      throw new Error('Google Maps API not loaded.');
    }
    const geocoder = new window.google.maps.Geocoder();
    try {
      const response = await geocoder.geocode({ address });
      if (response.results && response.results[0]) {
         return {
            coords: {
               lat: response.results[0].geometry.location.lat(),
               lng: response.results[0].geometry.location.lng()
            },
            addressDetails: MapService.parseAddressComponents(response.results[0])
         }
      }
      return null;
    } catch (err) {
      console.error('Geocoder failed due to: ', err);
      throw err;
    }
  },

  parseAddressComponents: (geocodeResult) => {
    const address = {
      addressString: geocodeResult.formatted_address,
      state: '',
      district: '',
      city: '',
      area: '',
      pincode: '',
      lat: geocodeResult.geometry.location.lat(),
      lng: geocodeResult.geometry.location.lng()
    };

    geocodeResult.address_components.forEach((component) => {
      const types = component.types;
      if (types.includes('administrative_area_level_1')) {
        address.state = component.long_name;
      }
      if (types.includes('administrative_area_level_3') || types.includes('administrative_area_level_2')) {
        // District/County mapping varies slightly in India, usually admin_area_level_3 is district
        if (!address.district) address.district = component.long_name;
      }
      if (types.includes('locality')) {
        address.city = component.long_name;
      }
      if (types.includes('sublocality') || types.includes('neighborhood')) {
        if (!address.area) address.area = component.long_name;
        else address.area += ', ' + component.long_name; // append multiple sublocalities
      }
      if (types.includes('postal_code')) {
        address.pincode = component.long_name;
      }
    });

    // Fallbacks if Google Maps categorization is weird
    if (!address.city) address.city = address.district || '';
    if (!address.area) address.area = geocodeResult.address_components[0].long_name || '';

    return address;
  }
};
