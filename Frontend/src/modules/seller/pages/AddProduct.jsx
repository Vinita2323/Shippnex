import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, Upload, Tag, DollarSign, Boxes, CheckCircle, Package, Plus, ArrowLeft 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { categoryService, productService, authService } from '../../../services/authService';

const AddProduct = () => {
  const navigate = useNavigate();

  // Get Logged-in Seller Info
  const [sellerInfo, setSellerInfo] = useState(() => {
    try {
      const cached = localStorage.getItem('shippnex_seller_data');
      return cached ? JSON.parse(cached) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const res = await authService.getSellerProfile();
        if (res?.seller) setSellerInfo(res.seller);
      } catch (err) {}
    };
    fetchSeller();
  }, []);

  const defaultSellerName = sellerInfo?.businessName || sellerInfo?.ownerName || 'Seller Merchant';

  const initialData = {
    name: '',
    category: 'Groceries & Grains',
    subCategory: 'Grains & Pulses',
    brand: '',
    unitValue: '1',
    unitType: 'kg',
    description: '',
    mrp: '',
    salePrice: '',
    taxRate: '5%',
    hsnCode: '0713',
    stock: '',
    minStockLimit: '10',
    sku: '',
    seller: defaultSellerName,
    status: 'Published',
    isFeatured: false,
    mainImage: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
    mainImageFile: null,
    galleryImages: []
  };

  const [formData, setFormData] = useState(initialData);

  // Dynamic Categories State
  const [dynamicCategoryMap, setDynamicCategoryMap] = useState({});
  const [registeredCategories, setRegisteredCategories] = useState([]);

  useEffect(() => {
    const fetchRegisteredCategories = async () => {
      try {
        const res = await categoryService.getCategories();
        if (res && res.categories && res.categories.length > 0) {
          const flat = res.categories;
          const map = {};
          const idToName = {};
          
          flat.forEach(c => {
            idToName[c._id] = c.name;
            if (!c.parent) {
              map[c.name] = [];
            }
          });
          
          flat.forEach(c => {
            if (c.parent) {
              const parentName = idToName[c.parent];
              if (parentName && map[parentName]) {
                map[parentName].push(c.name);
              }
            }
          });
          
          setDynamicCategoryMap(map);
          const keys = Object.keys(map);
          setRegisteredCategories(keys);
          
          if (keys.length > 0) {
            const firstCat = keys[0];
            const firstSub = map[firstCat].length > 0 ? map[firstCat][0] : 'None';
            setFormData(prev => ({
              ...prev,
              category: prev.category && map[prev.category] ? prev.category : firstCat,
              subCategory: prev.category && map[prev.category] ? (map[prev.category].length > 0 ? map[prev.category][0] : 'None') : firstSub
            }));
          }
        }
      } catch (err) {
        console.warn('Using registered category catalog fallback:', err.message);
      }
    };
    fetchRegisteredCategories();
  }, []);

  const handleCategorySelectChange = (newCategory) => {
    const availableSubs = dynamicCategoryMap[newCategory] || [];
    setFormData(prev => ({
      ...prev,
      category: newCategory,
      subCategory: availableSubs.length > 0 ? availableSubs[0] : 'None'
    }));
  };

  const currentSubCategories = dynamicCategoryMap[formData.category] || [];
  const displaySubCategories = currentSubCategories.length > 0 ? currentSubCategories : ['None'];

  // Homepage Sections Selection
  const [selectedHomeSections, setSelectedHomeSections] = useState(['flash_sale', 'bestseller']);
  const [toastMsg, setToastMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdSuccessModal, setCreatedSuccessModal] = useState(null);

  const fileInputRef = useRef(null);
  const multipleFileInputRef = useRef(null);

  const availableSections = [
    { id: 'flash_sale', name: 'Flash Sale', description: 'Limited-time deals with countdown timer', badge: 'Flash Sale' },
    { id: 'best_deals', name: 'Best Deals', description: 'Special discounted deal cards on Homepage', badge: 'Best Deals' },
    { id: 'featured', name: 'Featured Products', description: 'Top highlighted products on Homepage', badge: 'Featured' },
    { id: 'bestseller', name: 'Bestseller', description: 'Showcase in Top Bestseller carousel cards', badge: 'Bestseller' },
    { id: 'trending', name: 'Trending', description: 'Popular trending items section', badge: 'Trending' },
    { id: 'new_arrivals', name: 'New Arrivals', description: 'Newly launched product additions', badge: 'New Arrival' },
    { id: 'recommended', name: 'Recommended', description: 'Personalized recommendation widget', badge: 'Recommended' },
    { id: 'category_featured', name: 'Category Deals', description: 'Highlight under daily category grid', badge: 'Category' }
  ];

  const toggleHomeSection = (sectionId) => {
    setSelectedHomeSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const resetForm = () => {
    setFormData({
      ...initialData,
      seller: defaultSellerName
    });
    setCreatedSuccessModal(null);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMultipleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const maxFiles = files.slice(0, 3);
    
    maxFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const resultUrl = event.target.result;
        setFormData(prev => {
          const newGallery = [...(prev.galleryImages || [])];
          if (newGallery.length < 3) {
            newGallery.push(resultUrl);
          }
          return { ...prev, galleryImages: newGallery };
        });
      };
      reader.readAsDataURL(file);
    });
    showToast(`${maxFiles.length} gallery images uploaded!`);
  };

  const removeGalleryImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleDeviceFileUpload = (e, field) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const resultUrl = event.target.result;
        setFormData(prev => ({
          ...prev,
          [field]: resultUrl,
          [`${field}File`]: file.name
        }));
        showToast(`Image "${file.name}" selected from device!`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (e, statusToSave = 'Published') => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const cleanMainImage = (typeof formData.mainImage === 'string' && formData.mainImage.length > 1500000)
        ? 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80'
        : formData.mainImage;

      const payload = {
        ...formData,
        mainImage: cleanMainImage,
        seller: formData.seller || defaultSellerName,
        sellerId: sellerInfo?._id || sellerInfo?.id,
        homeSections: selectedHomeSections,
        status: statusToSave,
        mrp: Number(formData.mrp || 0),
        salePrice: Number(formData.salePrice || 0),
        stock: Number(formData.stock || 0)
      };

      const res = await productService.createProduct(payload);
      console.log('Product saved to DB:', res);

      const createdProd = res?.product || res;
      const generatedSku = createdProd?.sku || formData.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`;
      const newProductObj = {
        _id: createdProd?._id,
        id: createdProd?._id || generatedSku,
        name: formData.name || 'New Product',
        seller: formData.seller || defaultSellerName,
        category: formData.category,
        subCategory: formData.subCategory,
        image: createdProd?.mainImage || formData.mainImage || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
        galleryImages: formData.galleryImages || [],
        variation: `${formData.unitValue || 1} ${formData.unitType || 'kg'}`,
        stock: Number(formData.stock || 0),
        status: statusToSave,
        mrp: Number(formData.mrp || 0),
        salePrice: Number(formData.salePrice || 0),
        homeSections: selectedHomeSections
      };

      const existingLocal = JSON.parse(localStorage.getItem('shippnex_custom_products') || '[]');
      const updatedLocal = [newProductObj, ...existingLocal.filter(p => p.id !== newProductObj.id)];
      localStorage.setItem('shippnex_custom_products', JSON.stringify(updatedLocal));

      setCreatedSuccessModal(newProductObj);
      showToast(`Product "${formData.name}" added and saved to DB!`);
    } catch (err) {
      console.error('Error saving product to backend DB:', err);
      showToast(`Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16 font-sans relative max-w-7xl mx-auto">
      {/* Product Creation Success Modal */}
      {createdSuccessModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-scaleUp border border-slate-100">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle size={36} />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-xl font-extrabold text-slate-900 m-0">Product Added Successfully!</h3>
              <p className="text-xs text-slate-500">The product has been saved and is now listed in your product catalog.</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center gap-3.5">
              <img 
                src={createdSuccessModal.image} 
                alt={createdSuccessModal.name} 
                className="w-14 h-14 rounded-xl object-cover border border-slate-200 bg-white shrink-0" 
              />
              <div className="space-y-0.5 flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-900 m-0 truncate">{createdSuccessModal.name}</h4>
                <p className="text-[11px] font-mono text-slate-400 m-0">SKU: <span className="font-semibold text-slate-700">{createdSuccessModal.id}</span></p>
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="text-xs font-extrabold text-[#ff5500]">₹{createdSuccessModal.salePrice}</span>
                  <span className="text-[10px] text-slate-400 line-through">₹{createdSuccessModal.mrp}</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.2 rounded">
                    Stock: {createdSuccessModal.stock}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button 
                type="button"
                onClick={() => navigate('/seller/products')}
                className="flex-1 px-4 py-3 bg-[#ff5500] hover:bg-[#e04a00] text-white text-xs font-bold rounded-xl border-none cursor-pointer shadow-md transition-all text-center flex items-center justify-center gap-1.5"
              >
                <Package size={16} /> View Products List
              </button>
              <button 
                type="button"
                onClick={resetForm}
                className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 cursor-pointer transition-all text-center flex items-center justify-center gap-1.5"
              >
                <Plus size={16} /> Add Another Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-bounce">
          <CheckCircle size={18} className="text-emerald-400" />
          <span className="text-sm font-medium">{toastMsg}</span>
        </div>
      )}

      {/* Page Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Add New Product</h2>
          <p className="text-xs text-slate-500">Create and list new items with pricing, stock limits, media, and homepage section mapping</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/seller/products')}
          className="flex items-center gap-2 text-slate-700 font-bold text-xs hover:text-[#ff5500] cursor-pointer border border-slate-200 bg-slate-50 px-3.5 py-2 rounded-xl transition-all shrink-0 w-fit"
        >
          <ArrowLeft size={16} /> Back to Product List
        </button>
      </div>

      <form onSubmit={(e) => handleFormSubmit(e, 'Published')} className="max-w-4xl mx-auto space-y-6">
        {/* Card 1: Basic Information */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <FileText size={18} className="text-[#ff5500]" /> General Product Information
          </h3>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Product Name *</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Premium Organics Basmati Rice"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-[#ff5500]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Registered Category *</label>
              <select 
                value={formData.category}
                onChange={(e) => handleCategorySelectChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-[#ff5500]"
              >
                {registeredCategories.length > 0 ? (
                  registeredCategories.map(catName => (
                    <option key={catName} value={catName}>{catName}</option>
                  ))
                ) : (
                  <>
                    <option value="Groceries & Grains">Groceries & Grains</option>
                    <option value="Edible Oils & Ghee">Edible Oils & Ghee</option>
                    <option value="Spices & Masala">Spices & Masala</option>
                    <option value="Pulses & Rice">Pulses & Rice</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Sub-Category *</label>
              <select 
                value={formData.subCategory}
                onChange={(e) => handleInputChange('subCategory', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#ff5500]"
              >
                {displaySubCategories.map(subName => (
                  <option key={subName} value={subName}>{subName}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Brand</label>
              <input 
                type="text" 
                placeholder="e.g. Fortune / Daawat"
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#ff5500]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Unit / Weight Variant *</label>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  required
                  placeholder="Quantity (e.g. 1, 500, 250)"
                  value={formData.unitValue}
                  onChange={(e) => handleInputChange('unitValue', e.target.value)}
                  className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#ff5500]"
                />
                <select 
                  value={formData.unitType}
                  onChange={(e) => handleInputChange('unitType', e.target.value)}
                  className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#ff5500]"
                >
                  <option value="kg">kg (Kilograms)</option>
                  <option value="g">g (Grams)</option>
                  <option value="L">L (Liters)</option>
                  <option value="ml">ml (Milliliters)</option>
                  <option value="Pcs">Pcs (Pieces)</option>
                  <option value="Pack">Pack</option>
                  <option value="Dozen">Dozen (12 Pcs)</option>
                  <option value="Bunch">Bunch</option>
                  <option value="Box">Box</option>
                  <option value="Bottle">Bottle</option>
                  <option value="Sachet">Sachet</option>
                  <option value="Combo">Combo Pack</option>
                </select>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Preview Variant: <span className="font-semibold text-[#ff5500]">{formData.unitValue || '1'} {formData.unitType || 'kg'}</span></p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Seller Store Name</label>
              <input
                type="text" 
                readOnly
                value={formData.seller}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-700 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Product Description</label>
            <textarea 
              rows={4}
              placeholder="Write a brief overview of product freshness, origin, quality certification..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#ff5500]"
            />
          </div>
        </div>

        {/* Card 2: Primary Image Upload */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Upload size={18} className="text-[#ff5500]" /> Product Image Upload
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Upload Primary Image from Device *</label>
              <input 
                type="file" 
                ref={fileInputRef}
                accept="image/*"
                onClick={(e) => { e.target.value = null; }}
                onChange={(e) => handleDeviceFileUpload(e, 'mainImage')}
                className="hidden"
              />
              <div 
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                className="border-2 border-dashed border-slate-300 hover:border-[#ff5500] bg-slate-50 hover:bg-orange-50/40 rounded-2xl p-6 text-center cursor-pointer transition-all space-y-2 group"
              >
                <div className="w-12 h-12 rounded-full bg-orange-100 group-hover:bg-[#ff5500] text-[#ff5500] group-hover:text-white flex items-center justify-center mx-auto transition-colors">
                  <Upload size={22} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 group-hover:text-[#ff5500]">
                    Click to Browse or Upload Image
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">Supports PNG, JPG, WEBP from your computer device</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Device Upload Preview</label>
              <div className="h-44 w-full rounded-2xl overflow-hidden border border-slate-200 relative group bg-slate-100 flex items-center justify-center">
                {formData.mainImage ? (
                  <>
                    <img src={formData.mainImage} alt="Uploaded Product" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button 
                        type="button"
                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                        className="px-3.5 py-1.5 bg-white text-slate-900 rounded-lg text-xs font-semibold border-none cursor-pointer shadow-md"
                      >
                        Change Image
                      </button>
                    </div>
                  </>
                ) : (
                  <span className="text-xs text-slate-400 font-medium">No Image Selected</span>
                )}
              </div>
              {formData.mainImageFile && (
                <p className="text-xs font-mono text-emerald-600 font-medium mt-1">Selected file: {formData.mainImageFile}</p>
              )}
            </div>
          </div>
        </div>

        {/* Card 2.5: Product Gallery Images (Max 3) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Upload size={18} className="text-[#ff5500]" /> Product Gallery Images
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Upload up to 3 Gallery Images</label>
              <input 
                type="file" 
                ref={multipleFileInputRef}
                accept="image/*"
                multiple
                onClick={(e) => { e.target.value = null; }}
                onChange={handleMultipleFileUpload}
                className="hidden"
              />
              <div 
                onClick={() => multipleFileInputRef.current && multipleFileInputRef.current.click()}
                className="border-2 border-dashed border-slate-300 hover:border-[#ff5500] bg-slate-50 hover:bg-orange-50/40 rounded-2xl p-6 text-center cursor-pointer transition-all space-y-2 group"
              >
                <div className="w-12 h-12 rounded-full bg-orange-100 group-hover:bg-[#ff5500] text-[#ff5500] group-hover:text-white flex items-center justify-center mx-auto transition-colors">
                  <Upload size={22} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 group-hover:text-[#ff5500]">
                    Select Multiple Images
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">Supports PNG, JPG, WEBP</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Gallery Preview ({formData.galleryImages?.length || 0}/3)</label>
              <div className="flex flex-wrap gap-3">
                {formData.galleryImages && formData.galleryImages.length > 0 ? (
                  formData.galleryImages.map((imgBase64, idx) => (
                    <div key={idx} className="h-24 w-24 rounded-xl overflow-hidden border border-slate-200 relative group">
                      <img src={imgBase64} alt={`Gallery ${idx+1}`} className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          type="button"
                          onClick={() => removeGalleryImage(idx)}
                          className="w-6 h-6 rounded-full bg-white text-red-600 flex items-center justify-center shadow hover:bg-red-50 hover:text-red-700 cursor-pointer border-none"
                        >
                          &times;
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-24 w-full rounded-xl bg-slate-50 border border-slate-200 border-dashed flex items-center justify-center text-slate-400 text-xs font-medium">
                    No gallery images uploaded
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Homepage Section Selection */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Tag size={18} className="text-[#ff5500]" /> Display on Homepage Sections
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Select one or multiple sections on the Customer App Homepage where this product will be shown.</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-[#ff5500]">
              {selectedHomeSections.length} Selected
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
            {availableSections.map(sec => {
              const isSelected = selectedHomeSections.includes(sec.id);
              return (
                <div 
                  key={sec.id}
                  onClick={() => toggleHomeSection(sec.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    isSelected 
                      ? 'bg-orange-50/60 border-[#ff5500] shadow-2xs' 
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input 
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}} // Handled by parent div
                    className="mt-1 w-4 h-4 accent-[#ff5500] cursor-pointer"
                  />
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-900">{sec.name}</span>
                      <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                        {sec.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 m-0">{sec.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 4: Pricing & Tax */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <DollarSign size={18} className="text-[#ff5500]" /> Pricing, Discounts & Taxation
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">MRP Price (₹) *</label>
              <input 
                type="number" 
                required
                placeholder="95.00"
                value={formData.mrp}
                onChange={(e) => handleInputChange('mrp', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#ff5500]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Selling Price (₹) *</label>
              <input 
                type="number" 
                required
                placeholder="75.00"
                value={formData.salePrice}
                onChange={(e) => handleInputChange('salePrice', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-[#ff5500] focus:outline-none focus:border-[#ff5500]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">GST Tax Rate</label>
              <select 
                value={formData.taxRate}
                onChange={(e) => handleInputChange('taxRate', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#ff5500]"
              >
                <option value="0%">0% (Exempt)</option>
                <option value="5%">5% GST</option>
                <option value="12%">12% GST</option>
                <option value="18%">18% GST</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">HSN Code</label>
              <input 
                type="text" 
                placeholder="e.g. 0713"
                value={formData.hsnCode}
                onChange={(e) => handleInputChange('hsnCode', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#ff5500]"
              />
            </div>
          </div>
        </div>

        {/* Card 5: Inventory & SKU */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Boxes size={18} className="text-[#ff5500]" /> Inventory & Stock Control
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Initial Stock Quantity *</label>
              <input 
                type="number" 
                required
                placeholder="100"
                value={formData.stock}
                onChange={(e) => handleInputChange('stock', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#ff5500]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Min Stock Alert Limit</label>
              <input 
                type="number" 
                placeholder="10"
                value={formData.minStockLimit}
                onChange={(e) => handleInputChange('minStockLimit', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#ff5500]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">SKU / Barcode ID</label>
              <input 
                type="text" 
                placeholder="SKU-GR-9012"
                value={formData.sku}
                onChange={(e) => handleInputChange('sku', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-mono text-slate-900 focus:outline-none focus:border-[#ff5500]"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex justify-end">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#ff5500] hover:bg-[#e04a00] text-white text-base font-semibold rounded-xl border-none cursor-pointer shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {isSubmitting ? 'Saving Product...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
