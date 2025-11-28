import React, { useState, useRef, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import "./UploadProduct.css";
// SellerProductForm.jsx - Enhanced Amazon-style Image Preview
// Updates:
// - Redesigned image preview in Step 1 to mimic Amazon: Large main image centered above a horizontal scrollable row of thumbnails (up to 8).
// - Thumbnails are clickable to swap with main image for easy preview adjustment.
// - Added remove buttons (×) on main and thumbnails with hover opacity.
// - Horizontal scroll for thumbnails with hidden scrollbar for clean look.
// - "+" placeholder in thumbnails row to trigger additional image upload.
// - Maintained upload inputs above preview for clarity.
// - Enhanced animations: Smooth swaps, hover scales, and entrance for new thumbs.

import brandRaw from "../assets/Product/Seller/List/brand-list.txt?raw";
import materialRaw from "../assets/Product/Seller/List/material-list.txt?raw";
import sizeRaw from "../assets/Product/Seller/List/size-list.txt?raw";
import categoryRaw from "../assets/Product/Seller/List/category-list.txt?raw";

export default function SellerProductForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [mainImage, setMainImage] = useState(null);
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [isBranded, setIsBranded] = useState(false);
  const [brandList, setBrandList] = useState([]);
  const [brand, setBrand] = useState("");
  const [materialsList, setMaterialsList] = useState([]);
  const [material, setMaterial] = useState("");
  const [sizesList, setSizesList] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [genders, setGenders] = useState([]);
  const [price, setPrice] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [priceAfterDiscount, setPriceAfterDiscount] = useState(0);
  const [sku, setSku] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({ cat: "", sub: "", subsub: "" });
  const [returnPolicy, setReturnPolicy] = useState("");
  const [homeDelivery, setHomeDelivery] = useState(false);
  const [specialDeal, setSpecialDeal] = useState(false);
  const [sponsorship, setSponsorship] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [neckType, setNeckType] = useState("");
  const [sleevesType, setSleevesType] = useState("");
  const [trend, setTrend] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [note, setNote] = useState("");
  const [orderUnderDays, setOrderUnderDays] = useState(1);
  const [availabilityStates, setAvailabilityStates] = useState([]);
  const [stateInput, setStateInput] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [autoLoading, setAutoLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef(null);
  const additionalImageRef = useRef(null); // New ref for additional images upload

  // New fields
  const [manufacturer, setManufacturer] = useState("");
  const [fabric, setFabric] = useState("");
  const [shippingCharge, setShippingCharge] = useState(0);
  const [codAvailable, setCodAvailable] = useState(false);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [gstNo, setGstNo] = useState("");
  const [gstPercentage, setGstPercentage] = useState(0);
  const [variants, setVariants] = useState([]);

  // Steps config
  const steps = [
    { title: "Basic Info & Images", content: renderStep1 },
    { title: "Category & Targeting", content: renderStep2 },
    { title: "Pricing & Variants", content: renderStep3 },
    { title: "SEO & Additional", content: renderStep4 },
    { title: "Review & Submit", content: renderStep5 }
  ];

  // Theme toggle
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  function toggleTheme() {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }

  // Hardcoded fallbacks
  const fallbackBrands = ["Nike", "Adidas", "Zara", "H&M", "Gucci", "Levi's", "Puma", "Uniqlo"];
  const fallbackMaterials = ["Cotton", "Polyester", "Silk", "Wool", "Denim", "Linen", "Nylon", "Leather"];
  const fallbackSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
  const fallbackCategories = [
    { "name": "Clothing", "sub": [{ "name": "Men", "sub": [{ "name": "T-Shirts" }, { "name": "Jeans" }, { "name": "Shirts" }] }, { "name": "Women", "sub": [{ "name": "Dresses" }, { "name": "Tops" }, { "name": "Skirts" }] }] },
    { "name": "Accessories", "sub": [{ "name": "Bags" }, { "name": "Watches" }] }
  ];

  // Framer Motion variants - Enhanced for professional feel (smoother eases, reduced bounce)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: "easeOut" } },
    hover: { 
      scale: 1.01, 
      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
      transition: { duration: 0.25, ease: "easeOut" } 
    },
  };

  const buttonVariants = {
    hover: { 
      scale: 1.03, 
      boxShadow: "0 10px 30px rgba(0,0,0,0.15)" 
    },
    tap: { scale: 0.97 },
  };

  const inputVariants = {
    focus: { 
      scale: 1.01, 
      y: -1, 
      transition: { duration: 0.2, ease: "easeOut" } 
    },
    initial: { scale: 1, y: 0 },
  };

  const stepVariants = {
    hidden: { x: '-100%', opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } },
    exit: { x: '100%', opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } },
  };

  // Auto-load lists
  useEffect(() => {
    const loadList = (rawData, setter, fallback) => {
      try {
        const parsed = JSON.parse(rawData);
        setter(Array.isArray(parsed) ? parsed : fallback);
      } catch (err) {
        console.warn(`Failed to parse imported list:`, err.message);
        setter(fallback);
      }
    };

    const loadAll = () => {
      setAutoLoading(true);
      loadList(brandRaw, setBrandList, fallbackBrands);
      loadList(materialRaw, setMaterialsList, fallbackMaterials);
      loadList(sizeRaw, setSizesList, fallbackSizes);
      loadList(categoryRaw, setCategories, fallbackCategories);
      setAutoLoading(false);
      setSuccess("Lists loaded successfully (with fallbacks if needed)!");
    };

    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally empty - only run once on mount

  useEffect(() => {
    const final = Number(price) * (1 - Number(discountPercent) / 100);
    setPriceAfterDiscount(Number.isFinite(final) ? Math.round(final * 100) / 100 : 0);
  }, [price, discountPercent]);

  useEffect(() => {
    if (title) {
      const normalized = title.toUpperCase().replace(/[^A-Z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 20);
      const ts = Date.now().toString(36).toUpperCase().slice(-6);
      setSku(`${normalized}-${ts}`);
    }
  }, [title]);

  // Real-time validation
  useEffect(() => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!mainImage) newErrors.mainImage = "Main image is required";
    if (isBranded && !brand) newErrors.brand = "Brand is required for branded products";
    if (!termsChecked) newErrors.terms = "Terms & Policy must be accepted";
    if (Number(orderUnderDays) < 1 || Number(orderUnderDays) > 7) newErrors.orderUnderDays = "Order under time must be 1-7 days";
    if (variants.length === 0) newErrors.variants = "At least one variant is required";
    setErrors(newErrors);
  }, [title, mainImage, isBranded, brand, termsChecked, orderUnderDays, variants.length]);

  const validateForm = () => Object.keys(errors).length === 0;

  // Navigation
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const GENDER_OPTIONS = ["Male", "Female", "Unisex", "Kids"];

  function handleListFiles(e) {
    setLoading(true);
    const files = Array.from(e.target.files || []);
    let processedCount = 0;
    if (files.length === 0) {
      setLoading(false);
      return;
    }

    files.forEach((f) => {
      const name = f.name.toLowerCase();
      if (!name.endsWith('.txt')) {
        console.warn(`Skipping non-.txt file: ${f.name}. Use image inputs for photos.`);
        processedCount++;
        if (processedCount === files.length) setLoading(false);
        return;
      }

      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const parsed = JSON.parse(ev.target.result);
          if (name.includes("brand")) setBrandList(Array.isArray(parsed) ? parsed : []);
          else if (name.includes("material")) setMaterialsList(Array.isArray(parsed) ? parsed : []);
          else if (name.includes("size")) setSizesList(Array.isArray(parsed) ? parsed : []);
          else if (name.includes("category")) setCategories(Array.isArray(parsed) ? parsed : []);
          else {
            console.warn(`Unknown list type in file: ${f.name}`);
          }
        } catch (err) {
          console.warn("Failed to parse uploaded file: ", f.name, err.message);
          setErrors((prev) => ({ ...prev, list: `Failed to parse ${f.name} (must be valid JSON)` }));
        }
        processedCount++;
        if (processedCount === files.length) setLoading(false);
      };
      reader.readAsText(f);
    });
  }

  function handleMainImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setMainImage({ file, url });
  }

  function handleAddImages(e) {
    const files = Array.from(e.target.files || []);
    const max = 8;
    const allowed = files.slice(0, max - images.length);
    const newImgs = allowed.map((f) => ({ file: f, url: URL.createObjectURL(f) }));
    setImages((s) => [...s, ...newImgs].slice(0, max));
  }

  function removeImage(index) {
    setImages((s) => s.filter((_, i) => i !== index));
  }

  function removeMainImage() {
    if (mainImage) {
      URL.revokeObjectURL(mainImage.url);
      setMainImage(null);
    }
  }

  function swapToMain(imageObj, index) {
    if (mainImage) {
      // Swap: put current main into images at the index
      setImages((prev) => {
        const newImages = [...prev];
        newImages[index] = mainImage;
        return newImages;
      });
    }
    setMainImage(imageObj);
  }

  function addColor() {
    setColors((c) => [...c, { name: "", hex: "#000000", image: null }]);
  }
  function updateColor(i, field, value) {
    let processedValue = value;
    if (field === 'hex') {
      processedValue = value.startsWith('#') ? value : `#${value}`;
    }
    setColors((c) => c.map((col, idx) => (idx === i ? { ...col, [field]: processedValue } : col)));
  }
  function removeColor(i) {
    setColors((c) => c.filter((_, idx) => idx !== i));
  }

  function toggleGender(g) {
    setGenders((s) => (s.includes(g) ? s.filter((x) => x !== g) : [...s, g]));
  }

  function addVariant() {
    if (selectedSizes.length === 0 || colors.length === 0) {
      setErrors((prev) => ({ ...prev, variants: "Select at least one size and color first" }));
      return;
    }
    setVariants((v) => [...v, { size: "", color: "", stock: 0, sku: "" }]);
  }
  function updateVariant(i, field, value) {
    let processedValue = value;
    if (field === 'color' && value) {
      const sizeAbbr = variants[i].size || '';
      const colorAbbr = colors.find(c => c.name === value)?.name?.slice(0,4).toUpperCase() || '';
      if (!variants[i].sku && sku) processedValue = `${sku}-${sizeAbbr}-${colorAbbr}`;
    }
    if (field === 'size' && value) {
      const colorAbbr = variants[i].color?.slice(0,4).toUpperCase() || '';
      if (!variants[i].sku && sku) processedValue = `${sku}-${value}-${colorAbbr}`;
    }
    setVariants((v) => v.map((varnt, idx) => (idx === i ? { ...varnt, [field]: processedValue } : varnt)));
  }
  function removeVariant(i) {
    setVariants((v) => v.filter((_, idx) => idx !== i));
  }

  function getSubCats(cat) {
    const found = categories.find((c) => c.name === cat);
    return found?.sub || [];
  }
  function getSubSubCats(cat, sub) {
    const subcats = getSubCats(cat);
    const found = subcats.find((s) => s.name === sub);
    return found?.sub || [];
  }

  function addState() {
    if (!stateInput.trim()) return;
    setAvailabilityStates((s) => [...s, stateInput.trim()]);
    setStateInput("");
  }
  function removeState(i) {
    setAvailabilityStates((s) => s.filter((_, idx) => idx !== i));
  }

  function buildPayload() {
    return {
      title: title.trim(),
      description: description.trim(),
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      manufacturer: manufacturer.trim(),
      fabric: fabric.trim(),
      branded: isBranded,
      brand: isBranded ? brand : null,
      material,
      sizes: selectedSizes,
      colors,
      variants,
      genders,
      price: Number(price),
      discountPercent: Number(discountPercent),
      priceAfterDiscount: Number(priceAfterDiscount),
      shippingCharge: Number(shippingCharge),
      codAvailable,
      gstNo: gstNo.trim(),
      gstPercentage: Number(gstPercentage),
      sku,
      category: selectedCategory,
      returnPolicy,
      homeDelivery,
      specialDeal,
      sponsorship,
      additionalInfo: additionalInfo.trim(),
      neckType: neckType.trim(),
      sleevesType: sleevesType.trim(),
      trend: trend.trim(),
      ageGroup: ageGroup.trim(),
      note: note.trim(),
      orderUnderDays: Number(orderUnderDays),
      availabilityStates,
      seoTitle: seoTitle.trim(),
      seoDescription: seoDescription.trim(),
      images: {
        main: mainImage ? mainImage.file?.name || "main-image" : null,
        others: images.map((i) => i.file?.name || "img")
      },
      generatedAt: new Date().toISOString()
    };
  }

  function openPreview() {
    if (validateForm()) {
      setPreviewOpen(true);
      setSuccess("Form validated successfully!");
    }
  }

  async function handleSubmit(type = 'download') {
    if (!validateForm()) return;
    const payload = buildPayload();
    setLoading(true);
    setSuccess("");

    if (type === 'backend') {
      try {
        const formData = new FormData();
        formData.append('data', JSON.stringify(payload));

        if (mainImage?.file) formData.append('main', mainImage.file);
        images.forEach((img, idx) => {
          if (img.file) formData.append(`image${idx + 1}`, img.file);
        });

        const response = await fetch('/api/products', { method: 'POST', body: formData });
        if (response.ok) {
          setSuccess("Product and images sent to backend successfully!");
          alert("Submitted to backend!");
        } else {
          throw new Error('Backend error');
        }
      } catch (error) {
        console.error('Backend submission error:', error);
        setErrors({ ...errors, backend: "Failed to send to backend" });
      } finally {
        setLoading(false);
      }
    } else {
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const fileName = `${payload.sku || "product"}.json`;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(a.href);
      setSuccess("JSON downloaded successfully!");
      setLoading(false);
    }
  }

  function canSubmit() {
    return Object.keys(errors).length === 0 && termsChecked;
  }

  function getMissingItems() {
    const missing = [];
    if (!title.trim()) missing.push("Title");
    if (!mainImage) missing.push("Main Image");
    if (isBranded && !brand) missing.push("Brand");
    if (Number(orderUnderDays) < 1 || Number(orderUnderDays) > 7) missing.push("Valid Order Under Days (1-7)");
    if (variants.length === 0) missing.push("At least one Variant");
    if (!termsChecked) missing.push("Terms & Policy acceptance");
    return missing;
  }

  // Step render functions - Enhanced with Amazon-style image preview
  function renderStep1() {
    return (
      <motion.div className="grid grid-cols-1 xl:grid-cols-3 gap-8" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div className="xl:col-span-2 card-gradient" variants={cardVariants} whileHover="hover">
          <motion.h3 className="flex items-center gap-3 text-xl font-semibold mb-6" variants={itemVariants}>
            <span className="text-green-500 text-2xl">📷</span> Product Images
          </motion.h3>

          {/* Upload Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <motion.label className="block font-semibold mb-3 text-gray-700 dark:text-gray-300" variants={itemVariants}>
                Main Image <span className="text-red-500">*</span>
              </motion.label>
              <motion.input 
                type="file" 
                accept="image/*" 
                onChange={handleMainImage} 
                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all" 
                whileFocus={inputVariants.focus} 
                variants={inputVariants} 
                initial="initial" 
                aria-label="Upload main product image"
              />
            </div>
            <div>
              <motion.label className="block font-semibold mb-3 text-gray-700 dark:text-gray-300" variants={itemVariants}>
                Additional Images (up to 8)
              </motion.label>
              <motion.input 
                type="file" 
                accept="image/*" 
                multiple 
                ref={additionalImageRef}
                onChange={handleAddImages} 
                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all" 
                whileFocus={inputVariants.focus} 
                variants={inputVariants} 
                initial="initial" 
                aria-label="Upload additional product images"
              />
            </div>
          </div>

          {/* Amazon-Style Preview - Enhanced */}
          <motion.div className="space-y-6" variants={itemVariants}>
            <h4 className="font-semibold text-lg flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <span className="text-2xl">👁️</span> 
              <span className="gradient-text">Live Preview (Amazon Style)</span>
            </h4>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-inner">
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Main Image Area - Enhanced */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mainImage?.url || 'placeholder-main'}
                    className="relative w-full max-w-2xl mx-auto image-preview-container"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    {mainImage ? (
                      <>
                        <motion.img 
                          src={mainImage.url} 
                          alt="Main product preview" 
                          className="w-full h-96 object-contain rounded-xl shadow-2xl cursor-zoom-in bg-white dark:bg-gray-800 p-2" 
                          whileHover={{ scale: 1.05 }} 
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            // Open fullscreen view
                            const newWindow = window.open();
                            if (newWindow) {
                              newWindow.document.write(`<img src="${mainImage.url}" style="max-width:100%;height:auto;" />`);
                            }
                          }}
                        />
                        <motion.button 
                          onClick={removeMainImage}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg z-10 font-bold text-lg transition-all"
                          whileHover={{ scale: 1.15, rotate: 90 }}
                          whileTap={{ scale: 0.9 }}
                          aria-label="Remove main image"
                          title="Remove main image"
                        >
                          ×
                        </motion.button>
                        <motion.div
                          className="absolute bottom-2 left-2 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          Main Image
                        </motion.div>
                      </>
                    ) : (
                      <motion.div 
                        className="w-full h-96 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600"
                        whileHover={{ borderColor: "var(--accent-blue)", scale: 1.01 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="text-center text-gray-500 dark:text-gray-400">
                          <motion.span 
                            className="text-6xl mb-2 block"
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          >
                            📷
                          </motion.span>
                          <p className="text-sm font-medium">Upload your main image here</p>
                          <p className="text-xs mt-1 text-gray-400 dark:text-gray-500">Click the upload button above</p>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Thumbnails Row - Enhanced Horizontal Scrollable */}
                <div className="relative">
                  <div className="flex overflow-x-auto gap-4 pb-4 -mx-6 px-6 thumbnails-container scrollbar-hide">
                    <AnimatePresence>
                      {images.map((im, idx) => (
                        <motion.div 
                          key={`${im.url}-${idx}`} 
                          className="relative flex-shrink-0 w-24 h-24 group thumbnail-item"
                          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                          animate={{ opacity: 1, scale: 1, rotate: 0 }}
                          exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                          transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
                        >
                          <motion.img 
                            src={im.url} 
                            alt={`Thumbnail ${idx + 1}`} 
                            className="w-full h-full object-cover rounded-lg shadow-md cursor-pointer border-2 border-transparent group-hover:border-blue-500 transition-all duration-200" 
                            whileHover={{ scale: 1.15, zIndex: 10 }} 
                            whileTap={{ scale: 0.95 }}
                            onClick={() => swapToMain(im, idx)}
                          />
                          <motion.button 
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage(idx);
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-lg font-bold z-20"
                            whileHover={{ scale: 1.3, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label={`Remove thumbnail ${idx + 1}`}
                            title="Remove image"
                          >
                            ×
                          </motion.button>
                          <motion.div
                            className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] px-1 py-0.5 text-center opacity-0 group-hover:opacity-100 transition-opacity rounded-b-lg"
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                          >
                            Click to set as main
                          </motion.div>
                        </motion.div>
                      ))}
                      {images.length < 8 && (
                        <motion.div 
                          className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center text-gray-500 text-3xl cursor-pointer hover:from-blue-200 hover:to-blue-300 dark:hover:from-blue-800 dark:hover:to-blue-700 transition-all border-2 border-dashed border-gray-400 dark:border-gray-500 hover:border-blue-500 dark:hover:border-blue-400"
                          onClick={() => additionalImageRef.current?.click()}
                          whileHover={{ scale: 1.1, rotate: 90 }}
                          whileTap={{ scale: 0.95 }}
                          aria-label="Add more images"
                          title="Add more images"
                        >
                          <motion.span
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                          >
                            +
                          </motion.span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  {images.length === 0 && (
                    <motion.div 
                      className="text-center text-gray-500 dark:text-gray-400 text-sm mt-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <span className="inline-block mr-2">💡</span>
                      Add up to 8 additional images for thumbnails
                    </motion.div>
                  )}
                  {images.length > 0 && images.length === 8 && (
                    <motion.div 
                      className="text-center text-blue-600 dark:text-blue-400 text-sm mt-2 font-semibold flex items-center justify-center gap-2"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <span>✅</span>
                      Maximum 8 images reached
                    </motion.div>
                  )}
                  {images.length > 0 && images.length < 8 && (
                    <motion.div 
                      className="text-center text-gray-500 dark:text-gray-400 text-xs mt-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {8 - images.length} more image{8 - images.length !== 1 ? 's' : ''} can be added
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div className="card-gradient" variants={cardVariants} whileHover="hover">
          <motion.h3 className="flex items-center gap-3 text-xl font-semibold mb-6" variants={itemVariants}>
            <span className="text-purple-500 text-2xl">✏️</span> Basic Details
          </motion.h3>
          <motion.label className="block font-semibold mb-3 text-gray-700 dark:text-gray-300" variants={itemVariants}>Title <span className="text-red-500">*</span></motion.label>
          <motion.input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all" 
            autoFocus 
            whileFocus={inputVariants.focus} 
            variants={inputVariants} 
            initial="initial" 
            placeholder="Enter product title"
            aria-label="Product title"
          />
          {errors.title && <p className="text-red-500 text-sm mb-4 flex items-center gap-1"><span className="text-xs">⚠️</span>{errors.title}</p>}

          <motion.label className="block font-semibold mb-3 text-gray-700 dark:text-gray-300" variants={itemVariants}>Description</motion.label>
          <motion.textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all resize-vertical" 
            rows={6} 
            whileFocus={inputVariants.focus} 
            variants={inputVariants} 
            initial="initial" 
            placeholder="Enter product description"
            aria-label="Product description"
          />

          <motion.label className="block font-semibold mb-3 text-gray-700 dark:text-gray-300" variants={itemVariants}>Tags (comma separated)</motion.label>
          <motion.input 
            value={tags} 
            onChange={(e) => setTags(e.target.value)} 
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all" 
            whileFocus={inputVariants.focus} 
            variants={inputVariants} 
            initial="initial" 
            placeholder="e.g., cotton, summer, casual"
            aria-label="Product tags"
          />

          <motion.label className="block font-semibold mb-3 text-gray-700 dark:text-gray-300" variants={itemVariants}>Manufacturer</motion.label>
          <motion.input 
            value={manufacturer} 
            onChange={(e) => setManufacturer(e.target.value)} 
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all" 
            whileFocus={inputVariants.focus} 
            variants={inputVariants} 
            initial="initial" 
            placeholder="Enter manufacturer name"
            aria-label="Manufacturer"
          />

          <motion.label className="block font-semibold mb-3 text-gray-700 dark:text-gray-300" variants={itemVariants}>Fabric</motion.label>
          <motion.input 
            value={fabric} 
            onChange={(e) => setFabric(e.target.value)} 
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all" 
            whileFocus={inputVariants.focus} 
            variants={inputVariants} 
            initial="initial" 
            placeholder="Enter fabric type"
            aria-label="Fabric"
          />

          <motion.div className="flex items-center gap-4 mb-4" variants={itemVariants}>
            <label className="flex items-center gap-2 cursor-pointer">
              <motion.input 
                type="checkbox" 
                checked={isBranded} 
                onChange={(e) => setIsBranded(e.target.checked)} 
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" 
                whileHover={{ scale: 1.1 }} 
              /> 
              <span className="text-gray-700 dark:text-gray-300 font-medium">Branded</span>
            </label>
            <AnimatePresence>
              {isBranded && (
                <motion.select 
                  value={brand} 
                  onChange={(e) => setBrand(e.target.value)} 
                  className="p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent flex-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all" 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.95 }} 
                  whileFocus={inputVariants.focus}
                  aria-label="Select brand"
                >
                  <option value="">-- Select brand --</option>
                  {brandList.map((b, i) => <option key={i} value={typeof b === 'string' ? b : b.name}>{typeof b === 'string' ? b : b.name}</option>)}
                </motion.select>
              )}
            </AnimatePresence>
          </motion.div>
          {errors.brand && <p className="text-red-500 text-sm mb-4 flex items-center gap-1"><span className="text-xs">⚠️</span>{errors.brand}</p>}

          <motion.label className="block font-semibold mb-3 text-gray-700 dark:text-gray-300" variants={itemVariants}>Material</motion.label>
          <motion.select 
            value={material} 
            onChange={(e) => setMaterial(e.target.value)} 
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all" 
            whileFocus={inputVariants.focus} 
            variants={inputVariants} 
            initial="initial"
            aria-label="Select material"
          >
            <option value="">-- Select material --</option>
            {materialsList.map((m, i) => <option key={i} value={typeof m === 'string' ? m : m.name}>{typeof m === 'string' ? m : m.name}</option>)}
          </motion.select>
        </motion.div>
      </motion.div>
    );
  }

  function renderStep2() {
    return (
      <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-8" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div className="card-gradient" variants={cardVariants} whileHover="hover">
          <motion.h3 className="flex items-center gap-3 text-xl font-semibold mb-6" variants={itemVariants}>
            <span className="text-indigo-500 text-2xl">📂</span> Category & Details
          </motion.h3>
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6" variants={containerVariants}>
            <motion.select 
              value={selectedCategory.cat} 
              onChange={(e) => setSelectedCategory({ cat: e.target.value, sub: "", subsub: "" })} 
              className="p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all" 
              whileFocus={inputVariants.focus} 
              variants={inputVariants} 
              initial="initial"
              aria-label="Select category"
            >
              <option value="">-- Select Category --</option>
              {categories.map((c, i) => <option key={i} value={c.name}>{c.name}</option>)}
            </motion.select>
            <motion.select 
              value={selectedCategory.sub} 
              onChange={(e) => setSelectedCategory((s) => ({ ...s, sub: e.target.value, subsub: "" }))} 
              className="p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all disabled:opacity-50" 
              disabled={!selectedCategory.cat} 
              whileFocus={inputVariants.focus} 
              variants={inputVariants} 
              initial="initial"
              aria-label="Select sub category"
            >
              <option value="">-- Select Sub Category --</option>
              {getSubCats(selectedCategory.cat).map((s, i) => <option key={i} value={s.name}>{s.name}</option>)}
            </motion.select>
            <motion.select 
              value={selectedCategory.subsub} 
              onChange={(e) => setSelectedCategory((s) => ({ ...s, subsub: e.target.value }))} 
              className="p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all disabled:opacity-50" 
              disabled={!selectedCategory.sub} 
              whileFocus={inputVariants.focus} 
              variants={inputVariants} 
              initial="initial"
              aria-label="Select sub sub category"
            >
              <option value="">-- Select Sub Sub Category --</option>
              {getSubSubCats(selectedCategory.cat, selectedCategory.sub).map((s, i) => <option key={i} value={s.name}>{s.name}</option>)}
            </motion.select>
          </motion.div>

          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6" variants={containerVariants}>
            <motion.select 
              value={returnPolicy} 
              onChange={(e) => setReturnPolicy(e.target.value)} 
              className="p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all" 
              whileFocus={inputVariants.focus} 
              variants={inputVariants} 
              initial="initial"
              aria-label="Select return policy"
            >
              <option value="">-- Return policy --</option>
              <option value="no-return">No return</option>
              <option value="7-day">7 day return</option>
              <option value="15-day">15 day return</option>
            </motion.select>
            <motion.label 
              className="flex items-center gap-2 p-4 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors" 
              whileHover={{ scale: 1.01 }} 
            >
              <motion.input 
                type="checkbox" 
                checked={homeDelivery} 
                onChange={(e) => setHomeDelivery(e.target.checked)} 
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" 
                whileHover={{ scale: 1.1 }} 
              /> 
              <span className="text-gray-700 dark:text-gray-300 font-medium">Home delivery</span>
            </motion.label>
          </motion.div>

          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6" variants={containerVariants}>
            <motion.label 
              className="flex items-center gap-2 p-4 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors" 
              whileHover={{ scale: 1.01 }} 
            >
              <motion.input 
                type="checkbox" 
                checked={specialDeal} 
                onChange={(e) => setSpecialDeal(e.target.checked)} 
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" 
                whileHover={{ scale: 1.1 }} 
              /> 
              <span className="text-gray-700 dark:text-gray-300 font-medium">Special deal</span>
            </motion.label>
            <motion.label 
              className="flex items-center gap-2 p-4 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors" 
              whileHover={{ scale: 1.01 }} 
            >
              <motion.input 
                type="checkbox" 
                checked={sponsorship} 
                onChange={(e) => setSponsorship(e.target.checked)} 
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" 
                whileHover={{ scale: 1.1 }} 
              /> 
              <span className="text-gray-700 dark:text-gray-300 font-medium">Sponsorship</span>
            </motion.label>
          </motion.div>

          <motion.input 
            value={additionalInfo} 
            onChange={(e) => setAdditionalInfo(e.target.value)} 
            placeholder="Additional info" 
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all" 
            whileFocus={inputVariants.focus} 
            variants={inputVariants} 
            initial="initial" 
            aria-label="Additional info"
          />

          <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4" variants={containerVariants}>
            <motion.input 
              value={neckType} 
              onChange={(e) => setNeckType(e.target.value)} 
              placeholder="Neck type" 
              className="p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all" 
              whileFocus={inputVariants.focus} 
              variants={inputVariants} 
              initial="initial" 
              aria-label="Neck type"
            />
            <motion.input 
              value={sleevesType} 
              onChange={(e) => setSleevesType(e.target.value)} 
              placeholder="Sleeves type" 
              className="p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all" 
              whileFocus={inputVariants.focus} 
              variants={inputVariants} 
              initial="initial" 
              aria-label="Sleeves type"
            />
            <motion.input 
              value={trend} 
              onChange={(e) => setTrend(e.target.value)} 
              placeholder="Trend" 
              className="p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all" 
              whileFocus={inputVariants.focus} 
              variants={inputVariants} 
              initial="initial" 
              aria-label="Trend"
            />
            <motion.input 
              value={ageGroup} 
              onChange={(e) => setAgeGroup(e.target.value)} 
              placeholder="Age group" 
              className="p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all" 
              whileFocus={inputVariants.focus} 
              variants={inputVariants} 
              initial="initial" 
              aria-label="Age group"
            />
          </motion.div>
        </motion.div>

        <motion.div className="card-gradient" variants={cardVariants} whileHover="hover">
          <motion.h3 className="flex items-center gap-3 text-xl font-semibold mb-6" variants={itemVariants}>
            <span className="text-pink-500 text-2xl">👥</span> Targeting
          </motion.h3>
          <motion.label className="block font-semibold mb-4 text-gray-700 dark:text-gray-300" variants={itemVariants}>Sizes (select available)</motion.label>
          <motion.div className="flex flex-wrap gap-3 mb-6" variants={containerVariants}>
            {(sizesList.length ? sizesList : fallbackSizes).map((s, idx) => {
              const sizeStr = typeof s === 'string' ? s : s.name;
              return (
                <motion.button 
                  key={idx} 
                  onClick={() => setSelectedSizes((prev) => prev.includes(sizeStr) ? prev.filter((x) => x !== sizeStr) : [...prev, sizeStr])} 
                  className={`px-6 py-3 border-2 rounded-full font-semibold transition-all duration-200 ${selectedSizes.includes(sizeStr) ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white border-pink-500 shadow-lg' : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20'}`} 
                  variants={buttonVariants} 
                  whileHover="hover" 
                  whileTap="tap"
                  aria-pressed={selectedSizes.includes(sizeStr)}
                >
                  {sizeStr}
                </motion.button>
              );
            })}
          </motion.div>

          <motion.label className="block font-semibold mb-4 text-gray-700 dark:text-gray-300" variants={itemVariants}>Colors (add with picker)</motion.label>
          <motion.div className="space-y-4 mb-6" variants={containerVariants}>
            <AnimatePresence>
              {colors.map((c, i) => (
                <motion.div 
                  key={i} 
                  className="flex items-center gap-3 p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800" 
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: 20 }} 
                  transition={{ duration: 0.3 }}
                >
                  <motion.input 
                    value={c.name} 
                    onChange={(e) => updateColor(i, 'name', e.target.value)} 
                    placeholder="Color name" 
                    className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all" 
                    whileFocus={inputVariants.focus} 
                  />
                  <motion.input 
                    type="color" 
                    value={c.hex} 
                    onChange={(e) => updateColor(i, 'hex', e.target.value)} 
                    title="Click to pick color" 
                    className="w-12 h-12 p-0 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500 transition-all" 
                    whileFocus={{ scale: 1.1 }} 
                  />
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => updateColor(i, 'image', e.target.files?.[0] || null)} 
                    className="text-sm text-gray-500 dark:text-gray-400 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:bg-gray-100 file:text-xs file:font-medium file:text-gray-700 hover:file:bg-gray-200" 
                  />
                  <motion.button 
                    onClick={() => removeColor(i)} 
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md" 
                    variants={buttonVariants} 
                    whileHover="hover" 
                    whileTap="tap"
                    aria-label="Remove color"
                  >
                    Remove
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
            <motion.button 
              onClick={addColor} 
              className="w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all shadow-lg font-semibold" 
              variants={buttonVariants} 
              whileHover="hover" 
              whileTap="tap"
              aria-label="Add color"
            >
              + Add Color
            </motion.button>
          </motion.div>

          <motion.label className="block font-semibold mb-4 text-gray-700 dark:text-gray-300" variants={itemVariants}>Gender</motion.label>
          <motion.div className="grid grid-cols-2 gap-4" variants={containerVariants}>
            {GENDER_OPTIONS.map((g, idx) => (
              <motion.label 
                key={g} 
                className="flex items-center gap-3 p-4 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors" 
                whileHover={{ scale: 1.02 }} 
                variants={itemVariants} 
                custom={idx} 
                initial="hidden" 
                animate="visible" 
                transition={{ delay: idx * 0.05 }}
              >
                <motion.input 
                  type="checkbox" 
                  checked={genders.includes(g)} 
                  onChange={() => toggleGender(g)} 
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" 
                  whileHover={{ scale: 1.1 }} 
                /> 
                <span className="text-gray-700 dark:text-gray-300 font-medium">{g}</span>
              </motion.label>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  // ... (renderStep3, renderStep4, renderStep5 remain the same as previous version)

  function renderStep3() {
    return (
      <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-8" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div className="card-gradient" variants={cardVariants} whileHover="hover">
          <motion.h3 className="flex items-center gap-3 text-xl font-semibold mb-6" variants={itemVariants}>
            <span className="text-yellow-500 text-2xl">💰</span> Pricing
          </motion.h3>
          <motion.label className="block font-semibold mb-3 text-gray-700 dark:text-gray-300" variants={itemVariants}>Price (₹)</motion.label>
          <motion.input 
            type="number" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all" 
            whileFocus={inputVariants.focus} 
            variants={inputVariants} 
            initial="initial" 
            placeholder="0.00"
            aria-label="Product price"
          />

          <motion.label className="block font-semibold mb-3 text-gray-700 dark:text-gray-300" variants={itemVariants}>Discount (%)</motion.label>
          <motion.input 
            type="number" 
            value={discountPercent} 
            onChange={(e) => setDiscountPercent(e.target.value)} 
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all" 
            whileFocus={inputVariants.focus} 
            variants={inputVariants} 
            initial="initial" 
            placeholder="0"
            aria-label="Discount percentage"
          />

          <motion.div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-700 rounded-xl" variants={itemVariants}>
            <span className="font-semibold text-green-700 dark:text-green-300 flex items-center gap-2">
              <span className="text-lg">💚</span> Price after discount: ₹{priceAfterDiscount.toFixed(2)}
            </span>
          </motion.div>

          <motion.label className="block font-semibold mb-3 text-gray-700 dark:text-gray-300" variants={itemVariants}>Base SKU (auto-generated)</motion.label>
          <motion.input 
            value={sku} 
            readOnly 
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-100 dark:bg-gray-700 mb-4 cursor-not-allowed text-gray-600 dark:text-gray-400 font-mono" 
            whileFocus={inputVariants.focus} 
            variants={inputVariants} 
            initial="initial" 
            aria-label="Base SKU"
          />

          <motion.label className="block font-semibold mb-3 text-gray-700 dark:text-gray-300" variants={itemVariants}>Shipping Charge (₹)</motion.label>
          <motion.input 
            type="number" 
            value={shippingCharge} 
            onChange={(e) => setShippingCharge(e.target.value)} 
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all" 
            whileFocus={inputVariants.focus} 
            variants={inputVariants} 
            initial="initial" 
            placeholder="0.00"
            aria-label="Shipping charge"
          />

          <motion.label className="block font-semibold mb-3 text-gray-700 dark:text-gray-300" variants={itemVariants}>GST No</motion.label>
          <motion.input 
            value={gstNo} 
            onChange={(e) => setGstNo(e.target.value)} 
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all" 
            whileFocus={inputVariants.focus} 
            variants={inputVariants} 
            initial="initial" 
            placeholder="Enter GST number"
            aria-label="GST number"
          />

          <motion.label className="block font-semibold mb-3 text-gray-700 dark:text-gray-300" variants={itemVariants}>GST Percentage (%)</motion.label>
          <motion.input 
            type="number" 
            value={gstPercentage} 
            onChange={(e) => setGstPercentage(e.target.value)} 
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all" 
            whileFocus={inputVariants.focus} 
            variants={inputVariants} 
            initial="initial" 
            placeholder="0"
            aria-label="GST percentage"
          />

          <motion.label 
            className="flex items-center gap-3 p-4 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer mb-4 transition-colors" 
            whileHover={{ scale: 1.01 }} 
            variants={itemVariants}
          >
            <motion.input 
              type="checkbox" 
              checked={codAvailable} 
              onChange={(e) => setCodAvailable(e.target.checked)} 
              className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" 
              whileHover={{ scale: 1.1 }} 
            /> 
            <span className="text-gray-700 dark:text-gray-300 font-medium">Cash on Delivery Available</span>
          </motion.label>
        </motion.div>

        <motion.div className="card-gradient" variants={cardVariants} whileHover="hover">
          <motion.h3 className="flex items-center gap-3 text-xl font-semibold mb-4" variants={itemVariants}>
            <span className="text-orange-500 text-2xl">🎨</span> Variants Management
          </motion.h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 font-medium">Select sizes/colors above, then add specific stock per combo.</p>
          <motion.button 
            onClick={addVariant} 
            disabled={selectedSizes.length === 0 || colors.length === 0} 
            className="w-full mb-6 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg font-semibold disabled:shadow-none" 
            variants={buttonVariants} 
            whileHover="hover" 
            whileTap="tap"
            aria-label="Add variant"
          >
            + Add Variant
          </motion.button>
          {errors.variants && <p className="text-red-500 text-sm mb-6 flex items-center gap-1"><span className="text-xs">⚠️</span>{errors.variants}</p>}
          <motion.div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar" variants={containerVariants}>
            <AnimatePresence>
              {variants.map((v, i) => (
                <motion.div 
                  key={i} 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -20 }} 
                  transition={{ duration: 0.4 }}
                >
                  <motion.select 
                    value={v.size} 
                    onChange={(e) => updateVariant(i, 'size', e.target.value)} 
                    className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all" 
                    whileFocus={inputVariants.focus}
                    aria-label={`Variant size ${i + 1}`}
                  >
                    <option value="">Select Size</option>
                    {selectedSizes.map((sz, idx) => <option key={idx} value={sz}>{sz}</option>)}
                  </motion.select>
                  <motion.select 
                    value={v.color} 
                    onChange={(e) => updateVariant(i, 'color', e.target.value)} 
                    className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all" 
                    whileFocus={inputVariants.focus}
                    aria-label={`Variant color ${i + 1}`}
                  >
                    <option value="">Select Color</option>
                    {colors.map((c, idx) => <option key={idx} value={c.name}>{c.name}</option>)}
                  </motion.select>
                  <motion.input 
                    type="number" 
                    value={v.stock} 
                    onChange={(e) => updateVariant(i, 'stock', e.target.value)} 
                    placeholder="Stock" 
                    className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all w-full" 
                    whileFocus={inputVariants.focus} 
                    aria-label={`Variant stock ${i + 1}`}
                  />
                  <motion.input 
                    value={v.sku} 
                    onChange={(e) => updateVariant(i, 'sku', e.target.value)} 
                    placeholder="SKU (auto)" 
                    className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all col-span-2 sm:col-span-1" 
                    whileFocus={inputVariants.focus} 
                    aria-label={`Variant SKU ${i + 1}`}
                  />
                  <motion.button 
                    onClick={() => removeVariant(i)} 
                    className="col-span-full sm:col-span-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md font-semibold" 
                    variants={buttonVariants} 
                    whileHover="hover" 
                    whileTap="tap"
                    aria-label={`Remove variant ${i + 1}`}
                  >
                    Remove
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          {variants.length > 0 && (
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-4 font-semibold flex items-center gap-2">
              <span className="text-orange-500">📦</span> Total Variants: {variants.length}
            </div>
          )}
        </motion.div>
      </motion.div>
    );
  }

  function renderStep4() {
    return (
      <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-8" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div className="card-gradient" variants={cardVariants} whileHover="hover">
          <motion.h3 className="flex items-center gap-3 text-xl font-semibold mb-6" variants={itemVariants}>
            <span className="text-teal-500 text-2xl">🔍</span> SEO
          </motion.h3>
          <motion.label className="block font-semibold mb-3 text-gray-700 dark:text-gray-300" variants={itemVariants}>SEO Title</motion.label>
          <motion.input 
            value={seoTitle} 
            onChange={(e) => setSeoTitle(e.target.value)} 
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all" 
            whileFocus={inputVariants.focus} 
            variants={inputVariants} 
            initial="initial" 
            placeholder="Enter SEO-optimized title"
            aria-label="SEO title"
          />
          <motion.label className="block font-semibold mb-3 text-gray-700 dark:text-gray-300" variants={itemVariants}>SEO Description</motion.label>
          <motion.textarea 
            value={seoDescription} 
            onChange={(e) => setSeoDescription(e.target.value)} 
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all resize-vertical" 
            rows={8} 
            whileFocus={inputVariants.focus} 
            variants={inputVariants} 
            initial="initial" 
            placeholder="Enter SEO description (up to 160 chars)"
            aria-label="SEO description"
          />
        </motion.div>

        <motion.div className="card-gradient" variants={cardVariants} whileHover="hover">
          <motion.h3 className="flex items-center gap-3 text-xl font-semibold mb-6" variants={itemVariants}>
            <span className="text-gray-500 text-2xl">📝</span> Additional
          </motion.h3>
          <motion.label className="block font-semibold mb-3 text-gray-700 dark:text-gray-300" variants={itemVariants}>
            Order Under Time (1-7 days) <span className="text-red-500">*</span>
          </motion.label>
          <motion.input 
            type="number" 
            value={orderUnderDays} 
            onChange={(e) => setOrderUnderDays(Math.min(7, Math.max(1, Number(e.target.value || 1))))} 
            className="p-4 border border-gray-300 dark:border-gray-600 rounded-xl w-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all" 
            whileFocus={inputVariants.focus} 
            variants={inputVariants} 
            initial="initial" 
            aria-label="Order under days"
          />
          {errors.orderUnderDays && <p className="text-red-500 text-sm mb-4 flex items-center gap-1"><span className="text-xs">⚠️</span>{errors.orderUnderDays}</p>}

          <motion.label className="block font-semibold mb-3 text-gray-700 dark:text-gray-300" variants={itemVariants}>Availability in States</motion.label>
          <motion.div className="flex gap-3 mb-4" variants={itemVariants}>
            <motion.input 
              value={stateInput} 
              onChange={(e) => setStateInput(e.target.value)} 
              placeholder="State name" 
              className="flex-1 p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all" 
              whileFocus={inputVariants.focus} 
              variants={inputVariants} 
              initial="initial" 
              aria-label="Add state"
            />
            <motion.button 
              onClick={addState} 
              className="px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all shadow-lg font-semibold" 
              variants={buttonVariants} 
              whileHover="hover" 
              whileTap="tap"
              aria-label="Add state"
            >
              Add
            </motion.button>
          </motion.div>
          <motion.div className="flex gap-2 flex-wrap mb-8" variants={containerVariants}>
            <AnimatePresence>
              {availabilityStates.map((s, i) => (
                <motion.div 
                  key={i} 
                  className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-full flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm font-medium shadow-sm" 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.9 }} 
                  transition={{ duration: 0.3 }}
                >
                  {s} 
                  <motion.button 
                    onClick={() => removeState(i)} 
                    className="text-red-500 hover:text-red-700 text-xs font-bold" 
                    whileHover={{ scale: 1.2 }} 
                    whileTap={{ scale: 0.9 }} 
                    aria-label={`Remove state ${s}`}
                  >
                    ✕
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          <motion.label className="block font-semibold mb-3 text-gray-700 dark:text-gray-300" variants={itemVariants}>Note</motion.label>
          <motion.textarea 
            value={note} 
            onChange={(e) => setNote(e.target.value)} 
            placeholder="Additional notes" 
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all resize-vertical" 
            rows={8} 
            whileFocus={inputVariants.focus} 
            variants={inputVariants} 
            initial="initial" 
            aria-label="Additional notes"
          />
        </motion.div>
      </motion.div>
    );
  }

  function renderStep5() {
    return (
      <motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div className="card-gradient p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700" variants={cardVariants} whileHover="hover">
          <h3 className="font-bold text-3xl flex items-center gap-3 mb-8 text-gray-800 dark:text-white">
            <span className="text-blue-500 text-3xl">✅</span> Review Your Product
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-lg">
            <div className="space-y-4">
              <p><strong className="text-gray-900 dark:text-white">Title:</strong> <span className="text-gray-700 dark:text-gray-300">{title || 'Not set'}</span></p>
              <p><strong className="text-gray-900 dark:text-white">Price:</strong> <span className="text-green-600 dark:text-green-400">₹{price} (Discount: {discountPercent}%)</span></p>
              <p><strong className="text-gray-900 dark:text-white">Brand:</strong> <span className="text-gray-700 dark:text-gray-300">{isBranded ? brand : 'Unbranded'}</span></p>
              <p><strong className="text-gray-900 dark:text-white">Category:</strong> <span className="text-gray-700 dark:text-gray-300">{selectedCategory.cat} / {selectedCategory.sub} / {selectedCategory.subsub}</span></p>
            </div>
            <div className="space-y-4">
              <p><strong className="text-gray-900 dark:text-white">Variants:</strong> <span className="text-orange-600 dark:text-orange-400">{variants.length}</span></p>
              <p><strong className="text-gray-900 dark:text-white">Images:</strong> <span className="text-gray-700 dark:text-gray-300">{mainImage ? 1 : 0} main + {images.length} additional</span></p>
              <p><strong className="text-gray-900 dark:text-white">Genders:</strong> <span className="text-gray-700 dark:text-gray-300">{genders.join(', ') || 'Not set'}</span></p>
              <p><strong className="text-gray-900 dark:text-white">Sizes:</strong> <span className="text-gray-700 dark:text-gray-300">{selectedSizes.join(', ') || 'Not set'}</span></p>
            </div>
          </div>
          <motion.button 
            onClick={openPreview} 
            className="mt-8 px-10 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-xl font-semibold text-lg" 
            variants={buttonVariants} 
            whileHover="hover" 
            whileTap="tap"
            aria-label="View full preview"
          >
            👁️ View Full Preview
          </motion.button>
        </motion.div>

        <motion.div className="card-gradient p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700" variants={cardVariants} whileHover="hover">
          <h3 className="font-bold mb-4 flex items-center gap-3 text-xl text-gray-800 dark:text-white">
            <span className="text-gray-500 text-2xl">📋</span> Load/Override Lists (Optional)
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 font-medium">Auto-loaded from assets. Upload .txt (JSON) to override.</p>
          <motion.input 
            ref={fileInputRef} 
            onChange={handleListFiles} 
            type="file" 
            accept=".txt" 
            webkitdirectory="true" 
            directory="true" 
            multiple 
            disabled={loading} 
            className="mb-4 w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-blue-50 file:to-indigo-50 file:text-blue-700 hover:file:from-blue-100 hover:file:to-indigo-100 dark:file:from-gray-700 dark:file:to-gray-600 dark:file:text-gray-300" 
            whileFocus={inputVariants.focus} 
            variants={inputVariants} 
            initial="initial" 
            aria-label="Upload list files"
          />
          {(loading || autoLoading) && (
            <motion.div 
              className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-2 font-medium" 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="loading-spinner"></div>
              <span>Loading lists...</span>
            </motion.div>
          )}
          <div className="text-sm text-gray-600 dark:text-gray-400 grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 font-medium">
            <div className="flex items-center gap-2"><span className="text-purple-500">🏷️</span> Brands: {brandList.length}</div>
            <div className="flex items-center gap-2"><span className="text-green-500">🧵</span> Materials: {materialsList.length}</div>
            <div className="flex items-center gap-2"><span className="text-pink-500">📏</span> Sizes: {sizesList.length}</div>
            <div className="flex items-center gap-2"><span className="text-indigo-500">📂</span> Categories: {categories.length}</div>
          </div>
        </motion.div>

        <div className="flex items-center justify-center gap-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <label className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-semibold">
            <motion.input 
              type="checkbox" 
              checked={termsChecked} 
              onChange={(e) => setTermsChecked(e.target.checked)} 
              className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" 
              whileHover={{ scale: 1.1 }} 
            /> 
            I accept the Terms & Policy <span className="text-red-500">*</span>
          </label>
          {errors.terms && <p className="text-red-500 text-sm flex items-center gap-1"><span className="text-xs">⚠️</span>{errors.terms}</p>}
        </div>

        <AnimatePresence>
          {!canSubmit() && (
            <motion.div 
              className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border border-yellow-200 dark:border-yellow-700 rounded-xl text-yellow-700 dark:text-yellow-300 text-sm font-medium" 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }} 
              transition={{ duration: 0.4 }}
            >
              <strong className="flex items-center gap-2">⚠️ Missing to enable buttons:</strong> {getMissingItems().join(', ')}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button 
            disabled={!canSubmit() || loading} 
            onClick={() => handleSubmit('download')} 
            className={`px-10 py-4 rounded-xl border-2 font-semibold text-lg transition-all duration-200 shadow-lg ${canSubmit() && !loading ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-500 hover:from-green-600 hover:to-green-700 hover:shadow-xl' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 border-gray-300 cursor-not-allowed'}`} 
            variants={buttonVariants} 
            whileHover="hover" 
            whileTap="tap"
            aria-label="Download JSON"
          >
            {loading ? 'Processing...' : '📥 Download JSON'}
          </motion.button>
          <motion.button 
            disabled={!canSubmit() || loading} 
            onClick={() => handleSubmit('backend')} 
            className={`px-10 py-4 rounded-xl border-2 font-semibold text-lg transition-all duration-200 shadow-lg ${canSubmit() && !loading ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-purple-500 hover:from-purple-600 hover:to-purple-700 hover:shadow-xl' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 border-gray-300 cursor-not-allowed'}`} 
            variants={buttonVariants} 
            whileHover="hover" 
            whileTap="tap"
            aria-label="Send to backend"
          >
            🚀 Send to Backend
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className={`min-h-screen p-6 transition-all duration-300 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' : 'bg-gradient-to-br from-indigo-50 via-white to-blue-50'}`} 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header with Theme Toggle - Enhanced */}
        <div className="flex items-center justify-between mb-8 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
          <motion.h1 
            className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent" 
            whileHover={{ scale: 1.02, rotateX: 5 }} 
          >
            Seller Dashboard — Create Product
          </motion.h1>
          <motion.button 
            onClick={toggleTheme} 
            className="p-3 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 shadow-lg hover:shadow-xl transition-all duration-200" 
            whileHover={{ rotate: 180, scale: 1.1 }} 
            whileTap={{ scale: 0.95 }} 
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </motion.button>
        </div>

        {/* Progress Bar - Enhanced with better visuals */}
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            {steps.map((step, idx) => (
              <div key={idx} className="flex-1 text-center relative">
                <motion.div 
                  className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center text-sm font-bold shadow-lg transition-all duration-300 step-indicator ${
                    currentStep > idx 
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-200/50 completed' 
                      : currentStep === idx
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-200/50 active'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400 shadow-gray-300/50'
                  }`}
                  whileHover={{ scale: currentStep >= idx ? 1.15 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {currentStep > idx ? '✓' : idx + 1}
                </motion.div>
                <motion.div 
                  className={`text-xs mt-2 font-medium transition-colors ${
                    currentStep >= idx 
                      ? 'text-blue-600 dark:text-blue-400 font-semibold' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                  animate={{ 
                    color: currentStep >= idx ? 'var(--accent-blue)' : 'var(--text-secondary)'
                  }}
                >
                  {step.title}
                </motion.div>
                {idx < steps.length - 1 && (
                  <div className="absolute top-6 left-[60%] w-[80%] h-0.5 bg-gray-200 dark:bg-gray-600 -z-10">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                      initial={{ scaleX: 0 }}
                      animate={{ 
                        scaleX: currentStep > idx ? 1 : 0,
                        transformOrigin: 'left'
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden shadow-inner progress-bar-container">
            <motion.div 
              className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 rounded-full shadow-lg progress-bar-fill" 
              initial={false} 
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }} 
              transition={{ duration: 0.8, ease: "easeOut" }} 
            />
          </div>
          <motion.div 
            className="text-center mt-2 text-sm font-semibold text-gray-600 dark:text-gray-400"
            key={currentStep}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Step {currentStep + 1} of {steps.length}
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={currentStep} variants={stepVariants} initial="hidden" animate="visible" exit="exit">
            {steps[currentStep].content()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons - Enhanced */}
        <div className="flex justify-between mt-8 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <motion.button 
            onClick={prevStep} 
            disabled={currentStep === 0} 
            className="px-10 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg font-semibold disabled:shadow-none" 
            variants={buttonVariants} 
            whileHover="hover" 
            whileTap="tap"
            aria-label="Previous step"
          >
            ← Previous
          </motion.button>
          <motion.button 
            onClick={nextStep} 
            disabled={currentStep === steps.length - 1} 
            className="px-10 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg font-semibold disabled:shadow-none" 
            variants={buttonVariants} 
            whileHover="hover" 
            whileTap="tap"
            aria-label="Next step"
          >
            Next →
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          {success && (
            <motion.div 
              className="mb-6 p-4 bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 border-l-4 border-green-500 text-green-700 dark:text-green-200 rounded-xl shadow-lg flex items-center gap-3 alert-toast" 
              initial={{ opacity: 0, x: -100, scale: 0.8 }} 
              animate={{ opacity: 1, x: 0, scale: 1 }} 
              exit={{ opacity: 0, x: 100, scale: 0.8 }} 
              transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
            >
              <motion.span 
                className="text-xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                ✅
              </motion.span>
              <span className="font-semibold">{success}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {Object.values(errors).some(e => e) && (
            <motion.div 
              className="mb-6 p-4 bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 border-l-4 border-red-500 text-red-700 dark:text-red-200 rounded-xl shadow-lg space-y-1 alert-toast" 
              initial={{ opacity: 0, x: -100, scale: 0.8 }} 
              animate={{ opacity: 1, x: 0, scale: 1 }} 
              exit={{ opacity: 0, x: 100, scale: 0.8 }} 
              transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
            >
              {Object.entries(errors).map(([key, msg], idx) => (
                <motion.p 
                  key={key} 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <span className="text-lg">⚠️</span>
                  <span className="font-medium">{msg}</span>
                </motion.p>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Preview Modal - Enhanced with Professional Product Preview */}
        <AnimatePresence>
          {previewOpen && (
            <motion.div 
              className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 modal-overlay" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setPreviewOpen(false)}
            >
              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-2xl max-w-7xl w-full max-h-[95vh] overflow-y-auto p-8 shadow-2xl border border-gray-200 dark:border-gray-700 relative modal-content custom-scrollbar" 
                initial={{ scale: 0.9, y: 20, opacity: 0 }} 
                animate={{ scale: 1, y: 0, opacity: 1 }} 
                exit={{ scale: 0.9, y: 20, opacity: 0 }} 
                transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }} 
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <motion.div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200 dark:border-gray-700" variants={itemVariants}>
                  <h3 className="font-bold text-3xl text-gray-800 dark:text-white flex items-center gap-3">
                    <span className="text-blue-500 text-3xl">👁️</span> 
                    <span className="gradient-text">Product Preview</span>
                  </h3>
                  <div className="flex gap-4">
                    <motion.button 
                      onClick={() => setPreviewOpen(false)} 
                      className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all font-semibold hover:border-gray-400 dark:hover:border-gray-500" 
                      variants={buttonVariants} 
                      whileHover="hover" 
                      whileTap="tap"
                      aria-label="Close preview"
                    >
                      ✕ Close
                    </motion.button>
                    <motion.button 
                      onClick={() => { handleSubmit('download'); setPreviewOpen(false); }} 
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg font-semibold" 
                      variants={buttonVariants} 
                      whileHover="hover" 
                      whileTap="tap"
                      aria-label="Download and submit"
                    >
                      📥 Download & Submit
                    </motion.button>
                  </div>
                </motion.div>

                {/* Product Preview Card */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Image Section */}
                  <motion.div 
                    className="preview-card"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="preview-image-wrapper rounded-xl overflow-hidden mb-4">
                      {mainImage ? (
                        <motion.img 
                          src={mainImage.url} 
                          alt={title || "Product"} 
                          className="w-full h-96 object-cover"
                          initial={{ scale: 1.1 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.5 }}
                        />
                      ) : (
                        <div className="w-full h-96 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                          <span className="text-6xl text-gray-400">📷</span>
                        </div>
                      )}
                    </div>
                    {images.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto pb-2 thumbnails-container scrollbar-hide">
                        {images.map((img, idx) => (
                          <motion.img
                            key={idx}
                            src={img.url}
                            alt={`Thumbnail ${idx + 1}`}
                            className="w-20 h-20 object-cover rounded-lg cursor-pointer border-2 border-transparent hover:border-blue-500 transition-all"
                            whileHover={{ scale: 1.1 }}
                            onClick={() => swapToMain(img, idx)}
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>

                  {/* Product Details */}
                  <motion.div 
                    className="space-y-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{title || "Product Title"}</h2>
                      {isBranded && brand && (
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">Brand: <span className="font-semibold text-blue-600 dark:text-blue-400">{brand}</span></p>
                      )}
                    </div>

                    <div className="flex items-baseline gap-4 mb-4">
                      <span className="text-4xl font-bold text-green-600 dark:text-green-400">
                        ₹{priceAfterDiscount.toFixed(2)}
                      </span>
                      {discountPercent > 0 && (
                        <>
                          <span className="text-2xl text-gray-400 line-through">₹{price}</span>
                          <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-sm font-semibold">
                            {discountPercent}% OFF
                          </span>
                        </>
                      )}
                    </div>

                    {description && (
                      <div>
                        <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Description</h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{description}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      {selectedCategory.cat && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Category</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {selectedCategory.cat} {selectedCategory.sub && `/ ${selectedCategory.sub}`} {selectedCategory.subsub && `/ ${selectedCategory.subsub}`}
                          </p>
                        </div>
                      )}
                      {material && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Material</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{material}</p>
                        </div>
                      )}
                      {selectedSizes.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Available Sizes</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedSizes.map((size, idx) => (
                              <span key={idx} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium badge">
                                {size}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {colors.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Colors</p>
                          <div className="flex flex-wrap gap-2">
                            {colors.map((color, idx) => (
                              <div key={idx} className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full badge">
                                <div 
                                  className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600" 
                                  style={{ backgroundColor: color.hex }}
                                />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{color.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {genders.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Target Gender</p>
                          <div className="flex flex-wrap gap-2">
                            {genders.map((gender, idx) => (
                              <span key={idx} className="px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-full text-sm font-medium badge">
                                {gender}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {variants.length > 0 && (
                        <div className="col-span-2">
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Variants ({variants.length})</p>
                          <div className="max-h-40 overflow-y-auto custom-scrollbar space-y-2">
                            {variants.map((v, idx) => (
                              <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm">
                                <span className="text-gray-700 dark:text-gray-300">
                                  {v.size} / {v.color} - Stock: {v.stock}
                                </span>
                                {v.sku && <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">{v.sku}</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {shippingCharge > 0 && (
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Shipping Charge: <span className="font-semibold text-blue-600 dark:text-blue-400">₹{shippingCharge}</span></p>
                        {codAvailable && <p className="text-sm text-green-600 dark:text-green-400 mt-1">✓ Cash on Delivery Available</p>}
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* JSON Data Section (Collapsible) */}
                <motion.details 
                  className="mt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <summary className="cursor-pointer font-semibold text-lg text-gray-700 dark:text-gray-300 mb-4 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    📋 View Raw JSON Data
                  </summary>
                  <motion.pre 
                    className="text-xs bg-gray-50 dark:bg-gray-900 p-6 rounded-xl overflow-x-auto font-mono text-gray-800 dark:text-gray-200 leading-relaxed mt-4 border border-gray-200 dark:border-gray-700" 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.1 }}
                  >
                    {JSON.stringify(buildPayload(), null, 2)}
                  </motion.pre>
                </motion.details>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}