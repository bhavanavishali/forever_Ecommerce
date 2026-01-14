"use client";

import { useEffect, useState } from "react";
import { assets } from "../admin_assets/assets";
import axios from "axios";
import { API_BASE_URL, adminApi } from "../../api";
import { toast } from "react-toastify";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { ClipLoader } from "react-spinners";

const AdminAdd = () => {
  const [product, setProduct] = useState({
    category: "Men",
    name: "",
    description: "",
    variants: [
      {
        size: "S",
        color: "",
        price: "",
        stock_quantity: "",
        images: [false, false, false, false],
      },
    ],
  });

  // Validation errors state
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    variants: [
      {
        color: "",
        price: "",
        stock_quantity: "",
        images: "",
      },
    ],
  });

  // Loading state
  const [loading, setLoading] = useState(false);

  // State for image cropping
  const [showCropModal, setShowCropModal] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [crop, setCrop] = useState({
    unit: "%",
    width: 90,
    height: 90,
    x: 5,
    y: 5,
  });
  const [currentVariantIndex, setCurrentVariantIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imgSrc, setImgSrc] = useState("");
  const [imgElement, setImgElement] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // get categories
    const getCategories = async () => {
      try {
        const res = await adminApi.get("/get_all_listed_categories/");
        setCategories(res.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error.message);
      }
    };
    getCategories();
  }, []);

  // Validation functions
  const validateName = (name) => {
    if (!name.trim()) {
      return "Product name is required";
    }
    if (name.trim().length < 3) {
      return "Product name must be at least 3 characters long";
    }
    if (/^\d+$/.test(name.trim())) {
      return "Product name cannot be only numbers";
    }
    if (!/^[a-zA-Z0-9\s\-_&().]+$/.test(name.trim())) {
      return "Product name contains invalid characters";
    }
    return "";
  };

  const validateDescription = (description) => {
    if (!description.trim()) {
      return "Product description is required";
    }
    if (description.trim().length < 10) {
      return "Description must be at least 10 characters long";
    }
    if (description.trim().length > 1000) {
      return "Description must be less than 1000 characters";
    }
    return "";
  };

  const validateColor = (color) => {
    if (!color.trim()) {
      return "Color is required";
    }
    if (color.trim().length < 2) {
      return "Color must be at least 2 characters long";
    }
    if (!/^[a-zA-Z\s\-]+$/.test(color.trim())) {
      return "Color should contain only letters, spaces, and hyphens";
    }
    return "";
  };

  const validatePrice = (price) => {
    if (!price || price === "") {
      return "Price is required";
    }
    const numPrice = Number(price);
    if (isNaN(numPrice)) {
      return "Price must be a valid number";
    }
    if (numPrice <= 0) {
      return "Price must be greater than 0";
    }
    if (numPrice > 1000000) {
      return "Price cannot exceed 1,000,000";
    }
    return "";
  };

  const validateStockQuantity = (quantity) => {
    if (!quantity || quantity === "") {
      return "Stock quantity is required";
    }
    const numQuantity = Number(quantity);
    if (isNaN(numQuantity)) {
      return "Stock quantity must be a valid number";
    }
    if (numQuantity < 0) {
      return "Stock quantity cannot be negative";
    }
    if (!Number.isInteger(numQuantity)) {
      return "Stock quantity must be a whole number";
    }
    if (numQuantity > 10000) {
      return "Stock quantity cannot exceed 10,000";
    }
    return "";
  };

  const validateImages = (images) => {
    const hasImage = images.some((img) => img);
    if (!hasImage) {
      return "At least one image is required";
    }
    return "";
  };

  // Clear specific field error
  const clearError = (field, variantIndex = null) => {
    if (variantIndex !== null) {
      setErrors(prev => {
        const newErrors = { ...prev };
        if (newErrors.variants[variantIndex]) {
          newErrors.variants[variantIndex][field] = "";
        }
        return newErrors;
      });
    } else {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  // Handle product name change with validation
  const handleNameChange = (e) => {
    const value = e.target.value;
    setProduct(prev => ({ ...prev, name: value }));
    
    // Clear error when user starts typing
    if (errors.name) {
      clearError("name");
    }
    
    // Real-time validation
    const error = validateName(value);
    if (error) {
      setErrors(prev => ({ ...prev, name: error }));
    }
  };

  // Handle description change with validation
  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setProduct(prev => ({ ...prev, description: value }));
    
    if (errors.description) {
      clearError("description");
    }
    
    const error = validateDescription(value);
    if (error) {
      setErrors(prev => ({ ...prev, description: error }));
    }
  };

  // Handle variant field changes with validation
  const handleVariantChange = (variantIndex, field, value) => {
    const updatedVariants = [...product.variants];
    updatedVariants[variantIndex][field] = value;
    setProduct({ ...product, variants: updatedVariants });
    
    // Clear error when user starts typing
    if (errors.variants[variantIndex] && errors.variants[variantIndex][field]) {
      clearError(field, variantIndex);
    }
    
    // Real-time validation
    let error = "";
    if (field === "color") {
      error = validateColor(value);
    } else if (field === "price") {
      error = validatePrice(value);
    } else if (field === "stock_quantity") {
      error = validateStockQuantity(value);
    }
    
    if (error) {
      setErrors(prev => {
        const newErrors = { ...prev };
        if (!newErrors.variants[variantIndex]) {
          newErrors.variants[variantIndex] = {};
        }
        newErrors.variants[variantIndex][field] = error;
        return newErrors;
      });
    }
  };

  // Function to add a new variant
  const addVariant = () => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      variants: [
        ...prevProduct.variants,
        {
          size: "S",
          color: "",
          price: "",
          stock_quantity: "",
          images: [false, false, false, false],
        },
      ],
    }));
    
    // Add error state for new variant
    setErrors(prev => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          color: "",
          price: "",
          stock_quantity: "",
          images: "",
        },
      ],
    }));
  };

  // Function to remove a variant
  const removeVariant = (index) => {
    setProduct((prevProduct) => {
      const updatedVariants = [...prevProduct.variants];
      updatedVariants.splice(index, 1);
      return { ...prevProduct, variants: updatedVariants };
    });
    
    // Remove error state for removed variant
    setErrors(prev => {
      const newErrors = { ...prev };
      newErrors.variants.splice(index, 1);
      return newErrors;
    });
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors = {
      name: validateName(product.name),
      description: validateDescription(product.description),
      variants: [],
    };
    
    let isValid = true;
    
    if (newErrors.name || newErrors.description) {
      isValid = false;
    }
    
    // Validate each variant
    product.variants.forEach((variant, index) => {
      const variantErrors = {
        color: validateColor(variant.color),
        price: validatePrice(variant.price),
        stock_quantity: validateStockQuantity(variant.stock_quantity),
        images: validateImages(variant.images),
      };
      
      newErrors.variants[index] = variantErrors;
      
      if (variantErrors.color || variantErrors.price || variantErrors.stock_quantity || variantErrors.images) {
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  const addProduct = async () => {
    // Validate form before submission
    if (!validateForm()) {
      toast.error("Please fix all validation errors before submitting");
      return;
    }

    // Form is valid, now submit with loading state
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("category", product.category);
      formData.append("name", product.name);
      formData.append("description", product.description);

      product.variants.forEach((variant, i) => {
        formData.append(`variants[${i}][size]`, variant.size);
        formData.append(`variants[${i}][color]`, variant.color);
        formData.append(`variants[${i}][price]`, variant.price);
        formData.append(
          `variants[${i}][stock_quantity]`,
          variant.stock_quantity
        );

        variant.images.forEach((img, j) => {
          if (img) {
            formData.append(`variants[${i}][images][${j}]`, img);
          }
        });
      });

      const res = await adminApi.post(`/add_product/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 201) {
        toast.success("The product added successfully");

        // Reset the product state
        setProduct({
          category: "Men",
          name: "",
          description: "",
          variants: [
            {
              size: "S",
              color: "",
              price: "",
              stock_quantity: "",
              images: [false, false, false, false],
            },
          ],
        });

        // Reset error state
        setErrors({
          name: "",
          description: "",
          variants: [
            {
              color: "",
              price: "",
              stock_quantity: "",
              images: "",
            },
          ],
        });

        // Reset crop-related states
        setImgSrc("");
        setImgElement(null);
        setShowCropModal(false);
        setCurrentImage(null);
        setCurrentVariantIndex(0);
        setCurrentImageIndex(0);
        setCrop({
          unit: "%",
          width: 90,
          height: 90,
          x: 5,
          y: 5,
        });
      } else {
        toast.error("The product is not added properly");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle image selection
  const handleImageSelect = (e, variantIndex, imageIndex) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    // Set current indices for tracking which image is being cropped
    setCurrentVariantIndex(variantIndex);
    setCurrentImageIndex(imageIndex);

    // Create a URL for the selected image
    const reader = new FileReader();
    reader.onload = (e) => {
      setImgSrc(e.target.result);
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);
  };

  // Function to handle image load in the crop component
  const onImageLoad = (e) => {
    setImgElement(e.currentTarget);

    // Create a centered crop with aspect ratio 1:1
    const { width, height } = e.currentTarget;
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 90,
        },
        1, // 1:1 aspect ratio
        width,
        height
      ),
      width,
      height
    );

    setCrop(crop);
  };

  // Function to apply crop to image
  const applyCrop = () => {
    if (!imgElement || !crop.width || !crop.height) {
      toast.error("Please select a crop area");
      return;
    }

    // Create a canvas to draw the cropped image
    const canvas = document.createElement("canvas");
    const scaleX = imgElement.naturalWidth / imgElement.width;
    const scaleY = imgElement.naturalHeight / imgElement.height;

    // Set canvas dimensions to the cropped area
    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    // Draw the cropped image on the canvas
    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      imgElement,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );

    // Convert canvas to blob
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          toast.error("Failed to create image");
          return;
        }

        // Create a File object from the blob
        const croppedFile = new File(
          [blob],
          `cropped-image-${Date.now()}.jpg`,
          {
            type: "image/jpeg",
          }
        );

        // Update the product state with the cropped image
        setProduct((prev) => {
          const updatedVariants = [...prev.variants];
          updatedVariants[currentVariantIndex].images[currentImageIndex] =
            croppedFile;
          return { ...prev, variants: updatedVariants };
        });

        // Clear image validation error for this variant
        clearError("images", currentVariantIndex);

        // Close the crop modal
        setShowCropModal(false);
        setImgSrc("");
        setImgElement(null);

        toast.success("Image cropped successfully");
      },
      "image/jpeg",
      0.95
    );
  };

  // Function to cancel cropping
  const cancelCrop = () => {
    setShowCropModal(false);
    setImgSrc("");
    setImgElement(null);
    setCrop({
      unit: "%",
      width: 90,
      height: 90,
      x: 5,
      y: 5,
    });
  };

  // Show loader when loading
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <ClipLoader color="#000" size={40} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 relative">
      <h2>Add Product</h2>

      <div className="mb-3">
        <p>Enter the Category</p>
        <select
          onChange={(e) => {
            setProduct((prev) => {
              return { ...prev, category: e.target.value };
            });
          }}
          className="w-full max-w-[500px] px-3 py-2 border rounded border-[#c2c2c2] outline-[#c586a5]"
          name=""
          id=""
        >
          {categories.map((category, index) => {
            return (
              <option key={index} value={category}>
                {category}
              </option>
            );
          })}
        </select>
      </div>

      <div className="w-full">
        <p className="mb-2">Enter the product name</p>
        <input
          onChange={handleNameChange}
          type="text"
          className={`w-full max-w-[500px] px-3 py-2 border rounded outline-[#c586a5] ${
            errors.name ? 'border-red-500' : 'border-[#c2c2c2]'
          }`}
          placeholder="Enter the Product Name"
          value={product.name}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      <div className="w-full">
        <p className="mb-2">Enter the product Description</p>
        <textarea
          value={product.description}
          onChange={handleDescriptionChange}
          className={`w-full max-w-[500px] px-3 py-2 border rounded outline-[#c586a5] ${
            errors.description ? 'border-red-500' : 'border-[#c2c2c2]'
          }`}
          placeholder="Enter the Description"
          rows="4"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
        <p className="text-sm text-gray-500 mt-1">
          {product.description.length}/1000 characters
        </p>
      </div>

      {/* map product variants array */}
      {product.variants.map((variant, variantIndex) => (
        <div key={variantIndex} className="border border-gray-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="underline font-semibold">Variant {variantIndex + 1}</h4>
            {product.variants.length > 1 && (
              <button
                onClick={() => removeVariant(variantIndex)}
                className="text-red-600 underline hover:text-red-800 text-sm"
              >
                Remove Variant
              </button>
            )}
          </div>

          {/* variants images */}
          <div className="mb-4">
            <p className="mb-2">Upload Image</p>
            <div className="flex gap-2 mb-2">
              {variant.images.map((image, imageIndex) => {
                return (
                  <label
                    htmlFor={`image${variantIndex}${imageIndex}`}
                    key={imageIndex}
                    className="cursor-pointer"
                  >
                    <img
                      className="w-20 h-20 object-cover border rounded"
                      src={
                        !image
                          ? assets.upload_area
                          : URL.createObjectURL(image)
                      }
                      alt=""
                    />
                    <input
                      onChange={(e) =>
                        handleImageSelect(e, variantIndex, imageIndex)
                      }
                      type="file"
                      id={`image${variantIndex}${imageIndex}`}
                      hidden
                      accept="image/*"
                    />
                  </label>
                );
              })}
            </div>
            {errors.variants[variantIndex]?.images && (
              <p className="text-red-500 text-sm">{errors.variants[variantIndex].images}</p>
            )}
          </div>

          {/* variants */}
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8 mb-3">
            {/* Product Color */}
            <div className="flex-1">
              <p className="mb-2">Color</p>
              <input
                type="text"
                placeholder="Color"
                className={`w-full px-3 py-2 sm:w-[120px] border rounded outline-[#c586a5] ${
                  errors.variants[variantIndex]?.color ? 'border-red-500' : 'border-[#c2c2c2]'
                }`}
                value={variant.color}
                onChange={(e) =>
                  handleVariantChange(variantIndex, "color", e.target.value)
                }
              />
              {errors.variants[variantIndex]?.color && (
                <p className="text-red-500 text-sm mt-1">{errors.variants[variantIndex].color}</p>
              )}
            </div>

            {/* Product Price */}
            <div className="flex-1">
              <p className="mb-2">Price</p>
              <input
                type="number"
                placeholder="Price"
                className={`w-full px-3 py-2 sm:w-[120px] border rounded outline-[#c586a5] ${
                  errors.variants[variantIndex]?.price ? 'border-red-500' : 'border-[#c2c2c2]'
                }`}
                value={variant.price}
                onChange={(e) =>
                  handleVariantChange(variantIndex, "price", e.target.value)
                }
                min="0"
                step="0.01"
              />
              {errors.variants[variantIndex]?.price && (
                <p className="text-red-500 text-sm mt-1">{errors.variants[variantIndex].price}</p>
              )}
            </div>

            {/* Product Stock Quantity */}
            <div className="flex-1">
              <p className="mb-2">Quantity</p>
              <input
                type="number"
                placeholder="Stock Quantity"
                className={`w-full px-3 py-2 sm:w-[120px] border rounded outline-[#c586a5] ${
                  errors.variants[variantIndex]?.stock_quantity ? 'border-red-500' : 'border-[#c2c2c2]'
                }`}
                value={variant.stock_quantity}
                onChange={(e) =>
                  handleVariantChange(variantIndex, "stock_quantity", e.target.value)
                }
                min="0"
                step="1"
              />
              {errors.variants[variantIndex]?.stock_quantity && (
                <p className="text-red-500 text-sm mt-1">{errors.variants[variantIndex].stock_quantity}</p>
              )}
            </div>
          </div>

          {/* Product size with select box */}
          <div>
            <p className="mb-2">Product Size</p>
            <select
              onChange={(e) => {
                const productCopy = structuredClone(product);
                productCopy.variants[variantIndex].size = e.target.value;
                setProduct(productCopy);
              }}
              value={variant.size}
              className="w-20 px-3 py-2 border rounded border-[#c2c2c2] outline-[#c586a5]"
            >
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>
          </div>
        </div>
      ))}

      <div>
        <button
          className="bg-black text-white w-28 py-3 mt-4 rounded hover:bg-gray-800 transition-colors"
          onClick={addVariant}
        >
          Add Variant
        </button>
      </div>

      <div>
        <button
          className="bg-black text-white w-28 py-3 mt-4 rounded hover:bg-gray-800 transition-colors"
          onClick={addProduct}
        >
          Add Product
        </button>
      </div>

      {/* Image Crop Modal */}
      {showCropModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg max-w-4xl w-full">
            <h3 className="text-xl font-semibold mb-4">Crop Image</h3>
            <p className="text-sm text-gray-600 mb-4">
              Drag to adjust the crop area. The image will be cropped to a
              square.
            </p>

            <div className="mb-6 overflow-auto max-h-[60vh] flex justify-center">
              {imgSrc && (
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  aspect={1}
                  circularCrop={false}
                  className="max-w-full"
                >
                  <img
                    src={imgSrc || "/placeholder.svg"}
                    onLoad={onImageLoad}
                    alt="Crop preview"
                    className="max-w-full max-h-[50vh] object-contain"
                  />
                </ReactCrop>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                onClick={cancelCrop}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
                onClick={applyCrop}
              >
                Apply Crop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAdd;
