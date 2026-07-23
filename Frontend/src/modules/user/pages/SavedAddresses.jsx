import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Plus, Edit2, Trash2, X } from 'lucide-react';

const SavedAddresses = () => {
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: 'Home',
      name: 'John Doe',
      address: '123, Palm Grove Apartment, Sector 45',
      city: 'Noida',
      state: 'Uttar Pradesh',
      zip: '201301',
      phone: '+91 98765 43210',
      isDefault: true
    },
    {
      id: 2,
      type: 'Work',
      name: 'John Doe',
      address: 'Tech Park, Building 5, 8th Floor',
      city: 'Gurugram',
      state: 'Haryana',
      zip: '122001',
      phone: '+91 98765 43210',
      isDefault: false
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const handleDelete = (id, e) => {
    e.stopPropagation();
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  const handleSetDefault = (id) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  const handleEdit = (addr, e) => {
    e.stopPropagation();
    setEditingAddress(addr);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingAddress({
      id: Date.now(),
      type: 'Other',
      name: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      phone: '',
      isDefault: false
    });
    setIsModalOpen(true);
  };

  const handleSaveModal = (e) => {
    e.preventDefault();
    if (addresses.some(a => a.id === editingAddress.id)) {
      setAddresses(addresses.map(a => a.id === editingAddress.id ? editingAddress : a));
    } else {
      setAddresses([...addresses, editingAddress]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="h-[100dvh] bg-[#f8fafc] font-sans text-slate-800 relative max-w-[480px] mx-auto shadow-[0_0_20px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center py-5 px-5 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)] z-10 sticky top-0">
        <button className="bg-transparent border-none cursor-pointer p-0 flex items-center" onClick={() => navigate(-1)}>
          <ArrowLeft size={22} className="text-slate-900" />
        </button>
        <h2 className="text-[17px] font-extrabold m-0 text-slate-900 tracking-tight">Saved Addresses</h2>
        <div className="w-6"></div> {/* Spacer for centering */}
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-6 pb-24 [&::-webkit-scrollbar]:hidden flex flex-col gap-4">
        
        {addresses.map((addr) => (
          <div 
            key={addr.id} 
            onClick={() => handleSetDefault(addr.id)}
            className={`bg-white rounded-[24px] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border flex gap-4 cursor-pointer transition-colors ${addr.isDefault ? 'border-orange-200' : 'border-slate-100 hover:border-orange-100'}`}
          >
            <div className="pt-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${addr.type === 'Home' ? 'bg-[#ffedd5] text-[#ea580c]' : addr.type === 'Work' ? 'bg-[#e0e7ff] text-[#4338ca]' : 'bg-[#d1fae5] text-[#059669]'}`}>
                <MapPin size={20} />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-[15px] font-bold text-slate-900 m-0">{addr.type}</h3>
                  {addr.isDefault && (
                    <span className="bg-[#ea580c] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">Default</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={(e) => handleEdit(addr, e)}
                    className="p-1 border-none bg-transparent cursor-pointer text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={(e) => handleDelete(addr.id, e)}
                    className="p-1 border-none bg-transparent cursor-pointer text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <p className="text-[13px] font-semibold text-slate-800 m-0 mb-1">{addr.name}</p>
              <p className="text-[13px] font-medium text-slate-500 leading-relaxed m-0 mb-2">
                {addr.address},<br/>{addr.city}, {addr.state} - {addr.zip}
              </p>
              <p className="text-[12px] font-bold text-slate-600 m-0">📞 {addr.phone}</p>
            </div>
          </div>
        ))}
        
      </div>

      {/* Add New Button (Floating) */}
      <div className="absolute bottom-6 w-full px-5 pointer-events-none">
        <button 
          onClick={handleAddNew}
          className="w-full bg-[#ea580c] text-white rounded-2xl py-4 font-bold text-[15px] cursor-pointer active:scale-[0.98] transition-transform border-none shadow-[0_8px_30px_rgba(234,88,12,0.3)] flex items-center justify-center gap-2 pointer-events-auto"
        >
          <Plus size={20} />
          Add New Address
        </button>
      </div>

      {/* Edit/Add Modal */}
      {isModalOpen && editingAddress && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          
          {/* Bottom Sheet */}
          <div className="relative bg-white w-full rounded-t-[32px] p-6 shadow-2xl animate-in slide-in-from-bottom-full duration-300">
            <div className="flex justify-between items-center mb-6">
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

            <form onSubmit={handleSaveModal} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <input 
                  required
                  type="text" 
                  placeholder="Type (e.g. Home)" 
                  value={editingAddress.type}
                  onChange={e => setEditingAddress({...editingAddress, type: e.target.value})}
                  className="w-full bg-[#f8fafc] border border-slate-200 rounded-[12px] p-3.5 text-[14px] font-semibold text-slate-800 outline-none focus:border-[#ea580c] focus:bg-white transition-colors"
                />
                <input 
                  required
                  type="text" 
                  placeholder="Full Name" 
                  value={editingAddress.name}
                  onChange={e => setEditingAddress({...editingAddress, name: e.target.value})}
                  className="w-full bg-[#f8fafc] border border-slate-200 rounded-[12px] p-3.5 text-[14px] font-semibold text-slate-800 outline-none focus:border-[#ea580c] focus:bg-white transition-colors"
                />
              </div>

              <input 
                required
                type="text" 
                placeholder="Street Address" 
                value={editingAddress.address}
                onChange={e => setEditingAddress({...editingAddress, address: e.target.value})}
                className="w-full bg-[#f8fafc] border border-slate-200 rounded-[12px] p-3.5 text-[14px] font-semibold text-slate-800 outline-none focus:border-[#ea580c] focus:bg-white transition-colors"
              />

              <div className="grid grid-cols-2 gap-4">
                <input 
                  required
                  type="text" 
                  placeholder="City" 
                  value={editingAddress.city}
                  onChange={e => setEditingAddress({...editingAddress, city: e.target.value})}
                  className="w-full bg-[#f8fafc] border border-slate-200 rounded-[12px] p-3.5 text-[14px] font-semibold text-slate-800 outline-none focus:border-[#ea580c] focus:bg-white transition-colors"
                />
                <input 
                  required
                  type="text" 
                  placeholder="State" 
                  value={editingAddress.state}
                  onChange={e => setEditingAddress({...editingAddress, state: e.target.value})}
                  className="w-full bg-[#f8fafc] border border-slate-200 rounded-[12px] p-3.5 text-[14px] font-semibold text-slate-800 outline-none focus:border-[#ea580c] focus:bg-white transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input 
                  required
                  type="text" 
                  placeholder="Zip Code" 
                  value={editingAddress.zip}
                  onChange={e => setEditingAddress({...editingAddress, zip: e.target.value})}
                  className="w-full bg-[#f8fafc] border border-slate-200 rounded-[12px] p-3.5 text-[14px] font-semibold text-slate-800 outline-none focus:border-[#ea580c] focus:bg-white transition-colors"
                />
                <input 
                  required
                  type="tel" 
                  placeholder="Phone" 
                  value={editingAddress.phone}
                  onChange={e => setEditingAddress({...editingAddress, phone: e.target.value})}
                  className="w-full bg-[#f8fafc] border border-slate-200 rounded-[12px] p-3.5 text-[14px] font-semibold text-slate-800 outline-none focus:border-[#ea580c] focus:bg-white transition-colors"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-slate-900 text-white rounded-[16px] py-4 mt-2 font-bold text-[15px] cursor-pointer active:scale-[0.98] transition-transform border-none shadow-[0_4px_16px_rgba(15,23,42,0.2)]"
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
