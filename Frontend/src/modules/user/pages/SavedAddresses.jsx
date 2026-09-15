import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { addressService } from '../../../services/authService';

const initialDefaultAddresses = (userName, userPhone) => [
  {
    id: 'addr_1',
    _id: 'addr_1',
    type: 'Home',
    addressType: 'Home',
    name: userName || 'Sarah Jenkins',
    fullName: userName || 'Sarah Jenkins',
    address: '123, Palm Grove Apartment, Sector 45',
    addressLine1: '123, Palm Grove Apartment, Sector 45',
    city: 'Noida',
    state: 'Uttar Pradesh',
    zip: '201301',
    pincode: '201301',
    phone: userPhone || '+91 98765 43210',
    isDefault: true
  }
];

const SavedAddresses = () => {
  const navigate = useNavigate();

  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const formatAddresses = (rawList) => {
    return rawList.map(a => ({
      ...a,
      id: a._id || a.id,
      name: a.fullName || a.name || userName,
      fullName: a.fullName || a.name || userName,
      address: a.addressLine1 || a.address,
      addressLine1: a.addressLine1 || a.address,
      zip: a.pincode || a.zip,
      pincode: a.pincode || a.zip,
      type: a.addressType || a.type || 'Home',
      addressType: a.addressType || a.type || 'Home',
    }));
  };

  const fetchUserAddresses = async () => {
    try {
      setLoading(true);
      const res = await addressService.getAddresses();
      if (res && res.success && res.addresses) {
        if (res.addresses.length > 0) {
          const formatted = formatAddresses(res.addresses);
          setAddresses(formatted);
          localStorage.setItem('shippnex_saved_addresses', JSON.stringify(formatted));
          return;
        }
      }
    } catch (err) {
      console.error('Failed to fetch backend addresses:', err);
    } finally {
      setLoading(false);
    }

    // Fallback to local storage
    const saved = localStorage.getItem('shippnex_saved_addresses');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAddresses(formatAddresses(parsed));
          return;
        }
      } catch (err) {
        console.error('Failed to parse saved addresses:', err);
      }
    }
    const defaults = initialDefaultAddresses(userName, userPhone);
    setAddresses(defaults);
    localStorage.setItem('shippnex_saved_addresses', JSON.stringify(defaults));
  };

  useEffect(() => {
    const name = localStorage.getItem('shippnex_user_name') || 'Sarah Jenkins';
    const phone = localStorage.getItem('shippnex_user_phone') || '+91 98765 43210';
    setUserName(name);
    setUserPhone(phone);
    fetchUserAddresses();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      if (id && !String(id).startsWith('addr_')) {
        await addressService.deleteAddress(id);
      }
    } catch (err) {
      console.error('Failed to delete backend address:', err);
    }
    const updated = addresses.filter(addr => (addr.id || addr._id) !== id);
    if (updated.length > 0 && !updated.some(a => a.isDefault)) {
      updated[0].isDefault = true;
    }
    setAddresses(updated);
    localStorage.setItem('shippnex_saved_addresses', JSON.stringify(updated));
  };

  const handleSetDefault = async (id) => {
    try {
      if (id && !String(id).startsWith('addr_')) {
        await addressService.setDefaultAddress(id);
      }
    } catch (err) {
      console.error('Failed to set default address on server:', err);
    }
    const updated = addresses.map(addr => ({
      ...addr,
      isDefault: (addr.id || addr._id) === id
    }));
    setAddresses(updated);
    localStorage.setItem('shippnex_saved_addresses', JSON.stringify(updated));
    const def = updated.find(a => a.isDefault);
    if (def) {
      localStorage.setItem('shippnex_selected_checkout_address', JSON.stringify(def));
    }
  };

  const handleEdit = (addr, e) => {
    e.stopPropagation();
    setEditingAddress({
      ...addr,
      type: addr.addressType || addr.type || 'Home',
      name: addr.fullName || addr.name || userName,
      address: addr.addressLine1 || addr.address || '',
      city: addr.city || 'Noida',
      state: addr.state || 'Uttar Pradesh',
      zip: addr.pincode || addr.zip || '201301',
      phone: addr.phone || userPhone || '+91 98765 43210',
    });
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingAddress({
      id: '',
      type: 'Home',
      name: userName || 'Sarah Jenkins',
      address: '',
      city: 'Noida',
      state: 'Uttar Pradesh',
      zip: '201301',
      phone: userPhone || '+91 98765 43210',
      isDefault: addresses.length === 0
    });
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e) => {
    e.preventDefault();
    const payload = {
      fullName: editingAddress.name,
      phone: editingAddress.phone,
      addressLine1: editingAddress.address,
      city: editingAddress.city,
      state: editingAddress.state,
      pincode: editingAddress.zip,
      country: editingAddress.country || 'India',
      addressType: editingAddress.type || 'Home',
      isDefault: editingAddress.isDefault,
    };

    try {
      if (editingAddress.id && !String(editingAddress.id).startsWith('addr_')) {
        await addressService.updateAddress(editingAddress.id, payload);
      } else {
        await addressService.addAddress(payload);
      }
      await fetchUserAddresses();
    } catch (err) {
      console.error('Failed to save address on backend:', err);
      // Local fallback
      let updated;
      if (editingAddress.id && addresses.some(a => a.id === editingAddress.id)) {
        updated = addresses.map(a => a.id === editingAddress.id ? { ...editingAddress, fullName: editingAddress.name, addressLine1: editingAddress.address, pincode: editingAddress.zip } : a);
      } else {
        const newAddr = { ...editingAddress, id: `addr_${Date.now()}`, fullName: editingAddress.name, addressLine1: editingAddress.address, pincode: editingAddress.zip };
        updated = [...addresses, newAddr];
      }
      setAddresses(updated);
      localStorage.setItem('shippnex_saved_addresses', JSON.stringify(updated));
    }
    setIsModalOpen(false);
  };

  return (
    <div className="w-full max-w-[480px] md:max-w-5xl mx-auto h-[100dvh] md:h-auto md:min-h-screen bg-[#f8fafc] font-sans text-slate-800 relative shadow-[0_0_20px_rgba(0,0,0,0.05)] md:shadow-none flex flex-col overflow-hidden md:overflow-visible md:px-6 md:py-8">
      {/* Mobile Header */}
      <header className="md:hidden flex justify-between items-center py-5 px-5 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)] z-10 sticky top-0">
        <button className="bg-transparent border-none cursor-pointer p-0 flex items-center" onClick={() => navigate(-1)}>
          <ArrowLeft size={22} className="text-slate-900" />
        </button>
        <h2 className="text-[17px] font-extrabold m-0 text-slate-900 tracking-tight">Saved Addresses</h2>
        <div className="w-6"></div>
      </header>

      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between mb-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <button onClick={() => navigate('/profile')} className="hover:text-orange-600 font-medium cursor-pointer border-none bg-transparent flex items-center gap-1">
              <ArrowLeft size={16} /> Profile
            </button>
            <span>/</span>
            <span className="text-slate-800 font-bold">Saved Addresses</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 m-0">Delivery Addresses</h1>
        </div>
        <button 
          onClick={handleAddNew}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-sm rounded-xl border-none cursor-pointer transition-colors shadow-sm"
        >
          <Plus size={18} /> Add New Address
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 md:px-0 py-6 md:py-0 pb-28 md:pb-12 [&::-webkit-scrollbar]:hidden md:overflow-visible">
        {addresses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-full bg-orange-50 text-[#ff5500] flex items-center justify-center">
              <MapPin size={28} />
            </div>
            <h3 className="text-[16px] font-bold text-slate-800 m-0">No saved addresses yet</h3>
            <p className="text-[13px] text-slate-500 max-w-[240px] m-0">Add a new address for seamless checkout and delivery.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div 
                key={addr.id} 
                onClick={() => handleSetDefault(addr.id)}
                className={`bg-white rounded-[24px] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border flex gap-4 cursor-pointer transition-all ${
                  addr.isDefault ? 'border-[#ea580c] ring-2 ring-orange-500/10' : 'border-slate-100 hover:border-orange-100'
                }`}
              >
                <div className="pt-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    addr.type === 'Home' ? 'bg-[#ffedd5] text-[#ea580c]' : addr.type === 'Work' ? 'bg-[#e0e7ff] text-[#4338ca]' : 'bg-[#d1fae5] text-[#059669]'
                  }`}>
                    <MapPin size={20} />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[15px] font-extrabold text-[#1e1b4b] m-0">{addr.type}</h3>
                      {addr.isDefault && (
                        <span className="bg-orange-100 text-[#ea580c] text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                          <Check size={10} strokeWidth={3} /> Default
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                      <button 
                        className="text-slate-400 hover:text-[#ea580c] transition-colors p-1 border-none bg-transparent cursor-pointer"
                        onClick={(e) => handleEdit(addr, e)}
                        title="Edit"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button 
                        className="text-slate-400 hover:text-red-500 transition-colors p-1 border-none bg-transparent cursor-pointer"
                        onClick={(e) => handleDelete(addr.id, e)}
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <p className="text-[13px] font-bold text-slate-700 m-0 mb-1">{addr.name || userName}</p>
                  <p className="text-[12px] text-slate-500 leading-relaxed m-0 mb-2">
                    {addr.address}, {addr.city}, {addr.state} - {addr.zip}
                  </p>
                  <p className="text-[12px] font-medium text-slate-600 m-0">
                    Phone: {addr.phone || userPhone}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Sticky Action (Mobile only) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-5 bg-white/95 backdrop-blur-md border-t border-slate-100 max-w-[480px] mx-auto z-20">
        <button 
          onClick={handleAddNew}
          className="w-full bg-[#ea580c] text-white rounded-2xl py-4 font-bold text-[15px] flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(234,88,12,0.25)] border-none cursor-pointer active:scale-[0.98] transition-transform"
        >
          <Plus size={20} />
          Add New Address
        </button>
      </div>

      {/* Edit / Add Address Modal */}
      {isModalOpen && editingAddress && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center sm:items-center p-0 sm:p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setIsModalOpen(false)}></div>
          
          {/* Modal Container */}
          <div className="relative bg-white w-full rounded-t-[32px] sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-full duration-300 max-w-[480px] sm:max-w-lg mx-auto z-10">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-[18px] font-extrabold text-slate-900 m-0">
                {addresses.some(a => a.id === editingAddress.id) ? 'Edit Address' : 'Add Address'}
              </h3>
              <button 
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border-none cursor-pointer text-slate-500 hover:bg-slate-200 transition-colors"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="flex flex-col gap-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Address Tag</label>
                  <select 
                    value={editingAddress.type}
                    onChange={e => setEditingAddress({...editingAddress, type: e.target.value})}
                    className="w-full bg-[#f8fafc] border border-slate-200 rounded-[12px] p-3 text-[13px] font-bold text-slate-800 outline-none focus:border-[#ea580c] focus:bg-white transition-colors cursor-pointer"
                  >
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Full Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Full Name" 
                    value={editingAddress.name}
                    onChange={e => setEditingAddress({...editingAddress, name: e.target.value})}
                    className="w-full bg-[#f8fafc] border border-slate-200 rounded-[12px] p-3 text-[13px] font-semibold text-slate-800 outline-none focus:border-[#ea580c] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Street Address</label>
                <input 
                  required
                  type="text" 
                  placeholder="House / Flat No., Building, Street" 
                  value={editingAddress.address}
                  onChange={e => setEditingAddress({...editingAddress, address: e.target.value})}
                  className="w-full bg-[#f8fafc] border border-slate-200 rounded-[12px] p-3 text-[13px] font-semibold text-slate-800 outline-none focus:border-[#ea580c] focus:bg-white transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">City</label>
                  <input 
                    required
                    type="text" 
                    placeholder="City" 
                    value={editingAddress.city}
                    onChange={e => setEditingAddress({...editingAddress, city: e.target.value})}
                    className="w-full bg-[#f8fafc] border border-slate-200 rounded-[12px] p-3 text-[13px] font-semibold text-slate-800 outline-none focus:border-[#ea580c] focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">State</label>
                  <input 
                    required
                    type="text" 
                    placeholder="State" 
                    value={editingAddress.state}
                    onChange={e => setEditingAddress({...editingAddress, state: e.target.value})}
                    className="w-full bg-[#f8fafc] border border-slate-200 rounded-[12px] p-3 text-[13px] font-semibold text-slate-800 outline-none focus:border-[#ea580c] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Zip Code</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Pincode / Zip" 
                    value={editingAddress.zip}
                    onChange={e => setEditingAddress({...editingAddress, zip: e.target.value})}
                    className="w-full bg-[#f8fafc] border border-slate-200 rounded-[12px] p-3 text-[13px] font-semibold text-slate-800 outline-none focus:border-[#ea580c] focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Phone Number</label>
                  <input 
                    required
                    type="tel" 
                    placeholder="Phone" 
                    value={editingAddress.phone}
                    onChange={e => setEditingAddress({...editingAddress, phone: e.target.value})}
                    className="w-full bg-[#f8fafc] border border-slate-200 rounded-[12px] p-3 text-[13px] font-semibold text-slate-800 outline-none focus:border-[#ea580c] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-[#ea580c] text-white rounded-[16px] py-4 mt-2 font-bold text-[15px] cursor-pointer active:scale-[0.98] transition-transform border-none shadow-[0_4px_16px_rgba(234,88,12,0.25)]"
              >
                Save Address
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default SavedAddresses;
