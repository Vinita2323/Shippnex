import React, { useState } from 'react';
import { Upload, ArrowLeft, Plus, CheckCircle2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const navigate = useNavigate();

  // Main Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Grains & Flours',
    subcategory: 'Atta & Whole Wheat',
    sku: '',
    smallDescription: '',
    fullDescription: '',
    manufacturer: '',
    madeIn: '',
    tax: 'Select Tax',
    isReturnable: 'No',
    maxReturnDays: '',
    fssaiNo: '',
    totalAllowedQuantity: '10',
  });

  // Variations State
  const [variationType, setVariationType] = useState('');
  const [variationInput, setVariationInput] = useState({ title: '100g', price: '100', discountedPrice: '0', stock: '0' });
  const [variationsList, setVariationsList] = useState([]);

  // Image Preview State
  const [mainImage, setMainImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);

  const handleAddVariation = () => {
    if (!variationInput.title || !variationInput.price) {
      alert('Please provide a title and price for the variation.');
      return;
    }
    setVariationsList([...variationsList, { ...variationInput, id: Date.now() }]);
    setVariationInput({ title: '', price: '', discountedPrice: '0', stock: '0' });
  };

  const handleRemoveVariation = (id) => {
    setVariationsList(variationsList.filter(v => v.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Product added successfully!');
    navigate('/seller/products');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans pb-12">
      
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Add New Product</h1>
        <p className="text-sm font-normal text-slate-500 mt-1">Create a new product listing in your seller inventory.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* 1. General Information Card */}
        <div className="rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-white">
          <div className="bg-[#ff7526] px-5 py-3.5">
            <h2 className="text-white font-semibold text-base tracking-wide">General Information</h2>
          </div>
          
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Product Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Premium Fortune Chakki Fresh Atta 10kg"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#ff7526] text-sm font-normal transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">SKU Code</label>
                <input
                  type="text"
                  placeholder="e.g. ATTA-10KG-001"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#ff7526] text-sm font-normal transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Category <span className="text-red-500">*</span></label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#ff7526] text-sm font-normal bg-white cursor-pointer"
                >
                  <option>Grains & Flours</option>
                  <option>Edible Oils & Ghee</option>
                  <option>Spices & Masala</option>
                  <option>Pulses & Rice</option>
                  <option>Dry Fruits & Nuts</option>
                  <option>Packaged Snacks</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">SubCategory <span className="text-red-500">*</span></label>
                <select
                  value={formData.subcategory}
                  onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#ff7526] text-sm font-normal bg-white cursor-pointer"
                >
                  <option>Atta & Whole Wheat</option>
                  <option>Mustard & Rice Bran Oil</option>
                  <option>Ground Spices</option>
                  <option>Basmati Rice</option>
                  <option>Almonds & Cashews</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Product Small Description</label>
              <textarea
                rows={3}
                placeholder="Enter Product Small Description"
                value={formData.smallDescription}
                onChange={(e) => setFormData({ ...formData, smallDescription: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#ff7526] text-sm font-normal transition-all"
              />
            </div>
          </div>
        </div>

        {/* 2. Add Variation Card */}
        <div className="rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-white">
          <div className="bg-[#ff7526] px-5 py-3.5">
            <h2 className="text-white font-semibold text-base tracking-wide">Add Variation</h2>
          </div>

          <div className="p-6 space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Select Product Variation Type</label>
              <select
                value={variationType}
                onChange={(e) => setVariationType(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#ff7526] text-sm font-normal bg-white cursor-pointer"
              >
                <option value="">Select Product Type</option>
                <option value="weight">Weight (g, kg)</option>
                <option value="volume">Volume (ml, L)</option>
                <option value="pack">Pack Size</option>
                <option value="piece">Piece</option>
              </select>
            </div>

            <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 items-end">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Title (e.g., 100g)</label>
                  <input
                    type="text"
                    placeholder="100g"
                    value={variationInput.title}
                    onChange={(e) => setVariationInput({ ...variationInput, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#ff7526] text-sm font-normal bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Price *</label>
                  <input
                    type="number"
                    placeholder="100"
                    value={variationInput.price}
                    onChange={(e) => setVariationInput({ ...variationInput, price: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#ff7526] text-sm font-normal bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Discounted Price</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={variationInput.discountedPrice}
                    onChange={(e) => setVariationInput({ ...variationInput, discountedPrice: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#ff7526] text-sm font-normal bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Stock (0 = Unlimited)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={variationInput.stock}
                    onChange={(e) => setVariationInput({ ...variationInput, stock: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#ff7526] text-sm font-normal bg-white"
                  />
                </div>

                <div>
                  <button
                    type="button"
                    onClick={handleAddVariation}
                    className="w-full bg-[#ff7526] hover:bg-[#e65507] text-white font-medium py-2 px-3 rounded-lg shadow-sm transition-colors cursor-pointer border-none flex items-center justify-center gap-1 text-sm"
                  >
                    <Plus size={16} />
                    Add Variation
                  </button>
                </div>
              </div>

              {/* Added Variations List */}
              {variationsList.length > 0 && (
                <div className="pt-3 border-t border-slate-200 space-y-2">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Added Variations ({variationsList.length})</h4>
                  <div className="divide-y divide-slate-200 bg-white rounded-lg border border-slate-200 overflow-hidden">
                    {variationsList.map((v) => (
                      <div key={v.id} className="p-3 flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <span className="font-semibold text-slate-900">{v.title}</span>
                          <span className="text-slate-600">Price: <strong className="text-slate-900">₹{v.price}</strong></span>
                          {v.discountedPrice !== '0' && <span className="text-slate-500">Disc: ₹{v.discountedPrice}</span>}
                          <span className="text-slate-500">Stock: {v.stock === '0' ? 'Unlimited' : v.stock}</span>
                        </div>
                        <button 
                          type="button"
                          onClick={() => handleRemoveVariation(v.id)} 
                          className="text-red-500 hover:text-red-700 cursor-pointer bg-transparent border-none"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. Add Other Details Card */}
        <div className="rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-white">
          <div className="bg-[#ff7526] px-5 py-3.5">
            <h2 className="text-white font-semibold text-base tracking-wide">Add Other Details</h2>
          </div>

          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Manufacturer</label>
                <input
                  type="text"
                  placeholder="Enter Manufacturer"
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#ff7526] text-sm font-normal transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Made In</label>
                <input
                  type="text"
                  placeholder="Enter Made In (e.g., India)"
                  value={formData.madeIn}
                  onChange={(e) => setFormData({ ...formData, madeIn: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#ff7526] text-sm font-normal transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Select Tax</label>
                <select
                  value={formData.tax}
                  onChange={(e) => setFormData({ ...formData, tax: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#ff7526] text-sm font-normal bg-white cursor-pointer"
                >
                  <option value="Select Tax">Select Tax</option>
                  <option value="5%">GST 5%</option>
                  <option value="12%">GST 12%</option>
                  <option value="18%">GST 18%</option>
                  <option value="28%">GST 28%</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">is Returnable?</label>
                <select
                  value={formData.isReturnable}
                  onChange={(e) => setFormData({ ...formData, isReturnable: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#ff7526] text-sm font-normal bg-white cursor-pointer"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Max Return Days</label>
                <input
                  type="text"
                  placeholder="Enter Max Return Days"
                  value={formData.maxReturnDays}
                  onChange={(e) => setFormData({ ...formData, maxReturnDays: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#ff7526] text-sm font-normal transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">FSSAI Lic. No.</label>
                <input
                  type="text"
                  placeholder="Enter 14-digit FSSAI Lic. No."
                  value={formData.fssaiNo}
                  onChange={(e) => setFormData({ ...formData, fssaiNo: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#ff7526] text-sm font-normal transition-all"
                />
                <p className="text-xs text-slate-400 font-normal">Must be a 14-digit number</p>
              </div>
            </div>

            <div className="space-y-1.5 max-w-md">
              <label className="text-sm font-medium text-slate-700">Total allowed quantity</label>
              <input
                type="text"
                placeholder="10"
                value={formData.totalAllowedQuantity}
                onChange={(e) => setFormData({ ...formData, totalAllowedQuantity: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#ff7526] text-sm font-normal transition-all"
              />
              <p className="text-xs text-slate-400 font-normal">Keep blank if no such limit</p>
            </div>
          </div>
        </div>

        {/* 4. Add Images Card */}
        <div className="rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-white">
          <div className="bg-[#ff7526] px-5 py-3.5">
            <h2 className="text-white font-semibold text-base tracking-wide">Add Images</h2>
          </div>

          <div className="p-6 space-y-6">
            {/* Product Main Image */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Product Main Image <span className="text-red-500">*</span></label>
              <div className="border-2 border-dashed border-teal-500/40 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors">
                <Upload className="text-slate-400 mb-3" size={36} />
                <p className="text-sm font-semibold text-slate-700">Upload Main Image</p>
                <p className="text-xs text-slate-400 mt-1">Max 5MB, JPG/PNG/WEBP</p>
              </div>
            </div>

            {/* Product Gallery Images (Optional) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Product Gallery Images (Optional)</label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors">
                <Upload className="text-slate-400 mb-3" size={36} />
                <p className="text-sm font-semibold text-slate-700">Upload Gallery Images</p>
                <p className="text-xs text-slate-400 mt-1">Max 5MB per file, JPG/PNG/WEBP</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 border border-slate-200 bg-white rounded-lg font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-7 py-2.5 bg-[#ff7526] hover:bg-[#e65507] text-white rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2 cursor-pointer text-sm border-none"
          >
            <CheckCircle2 size={18} />
            Save & Add Product
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddProduct;
