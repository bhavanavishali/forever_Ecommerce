import api, { adminApi } from "@/api";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const AddCategoryOffer = () => {
  const [categoryOffer, setCategoryOffer] = useState({
    category: 0,
    discount_percentage: "",
    valid_from: "",
    valid_to: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const location = useLocation();
  const categories = location.state;

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    // Category validation
    if (!categoryOffer.category || categoryOffer.category === 0) {
      newErrors.category = "Please select a category";
    }

    // Discount percentage validation
    if (!categoryOffer.discount_percentage && categoryOffer.discount_percentage !== 0) {
      newErrors.discount_percentage = "Discount percentage is required";
    } else if (categoryOffer.discount_percentage < 0) {
      newErrors.discount_percentage = "Discount percentage cannot be negative";
    } else if (categoryOffer.discount_percentage > 100) {
      newErrors.discount_percentage = "Discount percentage cannot exceed 100%";
    }

    // Valid from validation
    if (!categoryOffer.valid_from) {
      newErrors.valid_from = "Valid from date is required";
    }

    // Valid to validation
    if (!categoryOffer.valid_to) {
      newErrors.valid_to = "Valid to date is required";
    }

    // Date comparison validation
    if (categoryOffer.valid_from && categoryOffer.valid_to) {
      const fromDate = new Date(categoryOffer.valid_from);
      const toDate = new Date(categoryOffer.valid_to);
      
      if (fromDate >= toDate) {
        newErrors.valid_to = "Valid to date must be after valid from date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle field blur for touched state
  const handleBlur = (fieldName) => {
    setTouched({
      ...touched,
      [fieldName]: true,
    });
  };

  // Real-time validation on field change
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      validateForm();
    }
  }, [categoryOffer, touched]);

  const addCategoryOffer = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      category: true,
      discount_percentage: true,
      valid_from: true,
      valid_to: true,
    });

    // Validate form
    if (!validateForm()) {
      toast.error("Please fix all validation errors before submitting");
      return;
    }

    console.log(categoryOffer);

    try {
      const res = await adminApi.post("/category_offers/", categoryOffer);
      if (res.status === 201) {
        toast.success("Category offer created successfully!");
        // Reset form after successful submission
        setCategoryOffer({
          category: categories.length > 0 ? categories[0].id : 0,
          discount_percentage: "",
          valid_from: "",
          valid_to: "",
        });
        setTouched({});
        setErrors({});
      }
    } catch (error) {
      console.log(error);
      if (error.response?.data?.valid_from) {
        toast.error(error.response.data.valid_from[0]);
      } else if (error?.response?.data?.category) {
        toast.error(error?.response?.data?.category[0]);
      } else if (error?.response?.data?.discount_percentage) {
        toast.error(error.response.data.discount_percentage[0]);
      } else if (error?.response?.data?.valid_to) {
        toast.error(error.response.data.valid_to[0]);
      } else {
        toast.error("An error occurred while creating the offer");
      }
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Add Category Offer</h1>
      <form onSubmit={addCategoryOffer} className="max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Category Selection */}
          <div>
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="category"
            >
              Category*
            </label>
            <select
              id="category"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.category && touched.category
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-gray-500"
              }`}
              value={categoryOffer.category}
              onChange={(e) => {
                setCategoryOffer({
                  ...categoryOffer,
                  category: Number(e.target.value),
                });
              }}
              onBlur={() => handleBlur("category")}
            >
              <option value={0}>-- Select a category --</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && touched.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
            )}
          </div>

          {/* Discount Percentage */}
          <div>
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="discount_percent"
            >
              Discount Percentage*
            </label>
            <input
              type="number"
              id="discount_percent"
              name="discount_percent"
              value={categoryOffer.discount_percentage}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.discount_percentage && touched.discount_percentage
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-gray-500"
              }`}
              onChange={(e) => {
                setCategoryOffer({
                  ...categoryOffer,
                  discount_percentage: e.target.value === '' ? '' : Number(e.target.value),
                });
              }}
              onBlur={() => handleBlur("discount_percentage")}
              min="0"
              max="100"
              step="0.01"
              placeholder="Enter discount percentage (0-100)"
            />
            {errors.discount_percentage && touched.discount_percentage && (
              <p className="text-red-500 text-sm mt-1">{errors.discount_percentage}</p>
            )}
          </div>

          {/* Valid From */}
          <div>
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="valid_from"
            >
              Valid From*
            </label>
            <input
              type="datetime-local"
              id="valid_from"
              name="valid_from"
              value={categoryOffer.valid_from}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.valid_from && touched.valid_from
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-gray-500"
              }`}
              onChange={(e) => {
                setCategoryOffer({
                  ...categoryOffer,
                  valid_from: e.target.value,
                });
              }}
              onBlur={() => handleBlur("valid_from")}
            />
            {errors.valid_from && touched.valid_from && (
              <p className="text-red-500 text-sm mt-1">{errors.valid_from}</p>
            )}
          </div>

          {/* Valid To */}
          <div>
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="valid_to"
            >
              Valid To*
            </label>
            <input
              type="datetime-local"
              id="valid_to"
              name="valid_to"
              value={categoryOffer.valid_to}
              onChange={(e) => {
                setCategoryOffer({
                  ...categoryOffer,
                  valid_to: e.target.value,
                });
              }}
              onBlur={() => handleBlur("valid_to")}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.valid_to && touched.valid_to
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-gray-500"
              }`}
            />
            {errors.valid_to && touched.valid_to && (
              <p className="text-red-500 text-sm mt-1">{errors.valid_to}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
          >
            Add Category Offer
          </button>
        </div>

        {/* Form Summary Errors */}
        {Object.keys(errors).length > 0 && Object.keys(touched).length > 0 && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <h3 className="text-red-800 font-medium mb-2">Please fix the following errors:</h3>
            <ul className="text-red-700 text-sm list-disc list-inside">
              {Object.values(errors).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </>
  );
};

export default AddCategoryOffer;