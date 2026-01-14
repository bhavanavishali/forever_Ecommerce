"use client";

import { use, useContext, useEffect, useState } from "react";
import api, { adminApi } from "../../api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SearchComponent from "../components/SearchComponent";
import { SearchContext } from "../../context/SearchContextProvider";
import Pagination from "../../components/Pagination";
import ConfirmModal from "@/ConfirmModal";

export default function CategoryManagement() {
  const [render, setRender] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    isListed: true,
  });

  // Form validation states
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { search } = useContext(SearchContext);

  const [activePage, setActivePage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [categoryId, setCategoryId] = useState(null);

  // Validation rules
  const validationRules = {
    name: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z0-9\s&-]+$/,
      custom: (value) => {
        // Check for duplicate category names
        const isDuplicate = categories.some(
          (category) => category.name.toLowerCase() === value.toLowerCase()
        );
        return isDuplicate ? "Category name already exists" : null;
      },
    },
    description: {
      required: true,
      minLength: 10,
      maxLength: 500,
      pattern: /^[a-zA-Z0-9\s.,!?&-]+$/,
    },
  };

  // Validate individual field
  const validateField = (fieldName, value) => {
    const rules = validationRules[fieldName];
    if (!rules) return null;

    // Required validation
    if (rules.required && (!value || value.trim() === "")) {
      return `${
        fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
      } is required`;
    }

    // Skip other validations if field is empty and not required
    if (!value || value.trim() === "") return null;

    // Min length validation
    if (rules.minLength && value.trim().length < rules.minLength) {
      return `${
        fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
      } must be at least ${rules.minLength} characters`;
    }

    // Max length validation
    if (rules.maxLength && value.trim().length > rules.maxLength) {
      return `${
        fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
      } must not exceed ${rules.maxLength} characters`;
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value.trim())) {
      const fieldDisplay =
        fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
      return `${fieldDisplay} contains invalid characters. Only letters, numbers, spaces, and basic punctuation are allowed`;
    }

    // Custom validation
    if (rules.custom) {
      const customError = rules.custom(value.trim());
      if (customError) return customError;
    }

    return null;
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors = {};

    Object.keys(validationRules).forEach((fieldName) => {
      const error = validateField(fieldName, newCategory[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle field blur (when user leaves field)
  const handleFieldBlur = (fieldName) => {
    setTouched({ ...touched, [fieldName]: true });
    const error = validateField(fieldName, newCategory[fieldName]);
    setErrors({ ...errors, [fieldName]: error });
  };

  // Real-time validation as user types
  const handleFieldChange = (fieldName, value) => {
    // Update the form data
    setNewCategory({
      ...newCategory,
      [fieldName]: value,
    });

    // Clear error if field was previously touched and now has valid input
    if (touched[fieldName]) {
      const error = validateField(fieldName, value);
      setErrors({ ...errors, [fieldName]: error });
    }
  };

  // Reset form
  const resetForm = () => {
    setNewCategory({ name: "", description: "", isListed: true });
    setErrors({});
    setTouched({});
  };

  // Function to handle the toggle switch for listing/unlisting categories
  const handleToggle = async (id) => {
    const res = await adminApi.put(`/list_unlist_category/${id}`);
    if (res.status === 200) {
      const updatedCategories = categories.map((category) =>
        category.id === id
          ? { ...category, isListed: res.data.isListed }
          : category
      );
      setCategories(updatedCategories);
    } else {
      console.error("Error updating category status:", res.statusText);
    }
  };

  const handleConfirmToggle = () => {
    handleToggle(categoryId);
    setIsModalOpen(false)
  };

  // Function to handle changes in the new category form
  const handleNewCategoryChange = (field, value) => {
    handleFieldChange(field, value);
  };

  // Function to handle saving the new category
  const handleSave = async () => {
    // Mark all fields as touched
    const allTouched = Object.keys(validationRules).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Validate form
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await adminApi.post("/add_category/", newCategory);
      console.log(res.data);
      if (res.status === 200) {
        resetForm();
        toast.success("Category added successfully");
        setRender(true);
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to add category");
      setRender(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to fetch categories from the API
  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await adminApi.get(
          `/categories/${search && `?search=${search}`}`,
          { params: { page: activePage } }
        );
        setCategories(res.data.results);
        setHasNext(res.data.has_next);
        setHasPrevious(res.data.has_previous);
        setTotalPages(res.data.total_pages);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    getCategories();
  }, [render, search, activePage]);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      {/* Category List */}
      <div className="rounded-lg p-4">
        <SearchComponent />
        <div className="bg-black text-white p-4 rounded-md grid grid-cols-4 font-medium">
          <div>S.No</div>
          <div>Category Name</div>
          <div className="text-center">List / Unlist</div>
          <div className="text-center">Edit</div>
        </div>

        <div className="divide-y">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className="grid grid-cols-4 items-center py-4 pl-6"
            >
              <div>{index + 1}</div>
              <div className="font-medium">{category.name}</div>
              <div className="flex justify-center items-center">
                {/* Custom toggle switch */}
                <div
                  className="relative inline-block w-12 h-6 cursor-pointer"
                  onClick={() => {
                    if(category.isListed){
                      setModalMessage('Are you sure you want to unlist this category?')
                    }
                    else{
                      setModalMessage('Are you sure you want to list this category?')
                    }
                    setIsModalOpen(true)
                    setCategoryId(category.id)
                  }}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={category.isListed}
                    readOnly
                  />
               
                  <div
                    className={`block w-12 h-6 rounded-full transition ${
                      category.isListed ? "bg-black" : "bg-gray-300"
                    }`}
                  ></div>
                    
                  <div
                    className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${
                      category.isListed ? "translate-x-6" : "translate-x-0"
                    }`}
                  ></div>
                </div>
              </div>
              <div className="flex justify-center items-center">
                {/* Edit button */}
                <button
                  onClick={() => {
                    navigate("/admin/category-edit", {
                      state: {
                        id: category.id,
                        name: category.name,
                        description: category.description,
                      },
                    });
                  }}
                  className="h-8 w-8 flex items-center justify-center text-gray-600 hover:text-gray-900"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    <path d="m15 5 4 4" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {totalPages > 1 ? (
          <Pagination
            activePage={activePage}
            setActivePage={setActivePage}
            hasNext={hasNext}
            hasPrevious={hasPrevious}
            totalPages={totalPages}
          />
        ) : null}
      {/* Add New Category */}
      <div className="rounded-lg p-6">
        <div className="flex justify-center items-center mb-6">
          <h2 className="text-2xl font-bold">Add New Category</h2>
        </div>

        <div className="space-y-6">
          {/* Category Name Field */}
          <div className="flex items-start gap-4">
            <label htmlFor="name" className="text-lg font-medium w-32 mt-2">
              Name: <span className="text-red-500">*</span>
            </label>
            <div className="flex-1">
              <input
                id="name"
                value={newCategory.name}
                onChange={(e) =>
                  handleNewCategoryChange("name", e.target.value)
                }
                onBlur={() => handleFieldBlur("name")}
                className={`w-full bg-white border rounded-md p-2 focus:outline-none focus:ring-2 transition-colors ${
                  errors.name && touched.name
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-gray-400"
                }`}
                placeholder="Enter category name"
                maxLength={50}
              />
              {errors.name && touched.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.name}
                </p>
              )}
              <div className="mt-1 text-xs text-gray-500">
                {newCategory.name.length}/50 characters
              </div>
            </div>
          </div>

          {/* Description Field */}
          <div className="flex gap-4">
            <label
              htmlFor="description"
              className="text-lg font-medium w-32 mt-2"
            >
              Description: <span className="text-red-500">*</span>
            </label>
            <div className="flex-1">
              <textarea
                id="description"
                value={newCategory.description}
                onChange={(e) =>
                  handleNewCategoryChange("description", e.target.value)
                }
                onBlur={() => handleFieldBlur("description")}
                className={`w-full min-h-[120px] bg-white border rounded-md p-2 focus:outline-none focus:ring-2 transition-colors resize-vertical ${
                  errors.description && touched.description
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-gray-400"
                }`}
                placeholder="Enter category description (minimum 10 characters)"
                maxLength={500}
              />
              {errors.description && touched.description && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.description}
                </p>
              )}
              <div className="mt-1 text-xs text-gray-500">
                {newCategory.description.length}/500 characters
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white hover:bg-gray-600 px-8 py-2 rounded-md transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              RESET
            </button>
            <button
              onClick={handleSave}
              disabled={
                isSubmitting || Object.keys(errors).some((key) => errors[key])
              }
              className="bg-black text-white hover:bg-black/90 px-12 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  SAVING...
                </>
              ) : (
                "SAVE"
              )}
            </button>
          </div>
          <ConfirmModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleConfirmToggle}
            message={modalMessage}
          />
        </div>
      </div>
    </div>
  );
}
