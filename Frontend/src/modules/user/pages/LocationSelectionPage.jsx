import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Search, Navigation } from 'lucide-react';
import { useLocation } from '../../../hooks/useLocation';
import { useLocationContext } from '../../../context/LocationContext';
import { MapService } from '../../../services/MapService';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

const LocationSelectionPage = () => {
  const navigate = useNavigate();
  const { setLocation, currentLocation } = useLocationContext();
  const { requestLocation, isLocating, error } = useLocation();
  const [manualAddress, setManualAddress] = useState('');

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: "in" },
    },
    debounce: 300,
  });

  const handleUseCurrentLocation = async () => {
    try {
      const coords = await requestLocation();
      const addressDetails = await MapService.reverseGeocode(coords.lat, coords.lng);
      if (addressDetails) {
        setLocation({ ...coords, ...addressDetails });
        navigate(-1);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectPlace = async (val) => {
    setValue(val, false);
    clearSuggestions();
    try {
      const results = await getGeocode({ address: val });
      const { lat, lng } = await getLatLng(results[0]);
      const addressDetails = MapService.parseAddressComponents(results[0]);
      setLocation({ lat, lng, ...addressDetails });
      navigate(-1);
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  return (
    <div className="h-[100dvh] bg-[#f4f6f9] font-sans max-w-[480px] mx-auto relative flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center shadow-sm z-10 shrink-0">
        <button onClick={() => navigate(-1)} className="mr-3 p-1 rounded-full hover:bg-slate-100 transition-colors">
          <ArrowLeft size={22} className="text-slate-700" />
        </button>
        <h1 className="text-[17px] font-bold text-slate-800">Select Location</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Current Location Button */}
        <button 
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          className="w-full bg-white rounded-xl p-4 flex items-center gap-3 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-100 hover:border-[#ea580c] transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
            {isLocating ? (
               <div className="w-5 h-5 border-2 border-[#ea580c] border-t-transparent rounded-full animate-spin"></div>
            ) : (
               <Navigation size={20} className="text-[#ea580c]" />
            )}
          </div>
          <div className="text-left">
            <h3 className="text-[14px] font-bold text-slate-800">Use current location</h3>
            <p className="text-[12px] text-slate-500 mt-0.5">Using GPS</p>
          </div>
        </button>

        {error && <p className="text-red-500 text-xs text-center">{error}</p>}

        <div className="relative flex items-center justify-center py-2">
          <div className="absolute w-full h-px bg-slate-200"></div>
          <span className="relative bg-[#f4f6f9] px-4 text-xs font-semibold text-slate-400">OR</span>
        </div>

        {/* Manual Search */}
        <div className="bg-white rounded-xl p-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-100">
          <h3 className="text-[14px] font-bold text-slate-800 mb-3">Search Location</h3>
          
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Search for area, street name..." 
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={!ready}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 pl-10 pr-4 text-[13px] text-slate-800 placeholder-slate-400 outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c]/20 transition-all"
            />
          </div>

          {status === "OK" && (
            <ul className="mt-2 border border-slate-100 rounded-lg overflow-hidden divide-y divide-slate-100">
              {data.map((suggestion) => {
                const {
                  place_id,
                  structured_formatting: { main_text, secondary_text },
                } = suggestion;
                return (
                  <li 
                    key={place_id} 
                    onClick={() => handleSelectPlace(suggestion.description)}
                    className="p-3 bg-white hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-3"
                  >
                    <MapPin size={16} className="text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[13px] font-semibold text-slate-800">{main_text}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{secondary_text}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationSelectionPage;
