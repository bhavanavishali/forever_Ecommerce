import React, { use, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import api, { adminApi } from '../../api';
import { toast } from 'react-toastify';

const CategoryEdit = () => {
    const location = useLocation();
    const { id, name, description } = location.state;
    console.log(id, name, description);
    
    const [categoryData, setCategoryData] = useState({
        name: name,
        description: description
    });
    
    const [originalData] = useState({
        name: name,
        description: description
    });
    
    const [allCategories, setAllCategories] = useState([]);
    
    // Form validation states
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    
    // Validation rules
    const validationRules = {
        name: {
            required: true,
            minLength: 2,
            maxLength: 50,
            pattern: /^[a-zA-Z0-9\s&-]+$/,
            custom: (value) => {
                // Check for duplicate category names (excluding current category)
                const isDuplicate = allCategories.some(category => 
                    category.name.toLowerCase() === value.toLowerCase() && 
                    category.id !== id
                );
                return isDuplicate ? "Category name already exists" : null;
            }
        },
        description: {
            required: true,
            minLength: 10,
            maxLength: 500,
            pattern: /^[a-zA-Z0-9\s.,!?&-]+$/
        }
    };

    // Fetch all categories to check for duplicates
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await adminApi.get('/categories/');
                setAllCategories(res.data.results || res.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    // Check if form has changes
    useEffect(() => {
        const hasDataChanged = categoryData.name !== originalData.name || 
                              categoryData.description !== originalData.description;
        setHasChanges(hasDataChanged);
    }, [categoryData, originalData]);

    // Validate individual field
    const validateField = (fieldName, value) => {
        const rules = validationRules[fieldName];
        if (!rules) return null;

        // Required validation
        if (rules.required && (!value || value.trim() === "")) {
            return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
        }

        // Skip other validations if field is empty and not required
        if (!value || value.trim() === "") return null;

        // Min length validation
        if (rules.minLength && value.trim().length < rules.minLength) {
            return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${rules.minLength} characters`;
        }

        // Max length validation
        if (rules.maxLength && value.trim().length > rules.maxLength) {
            return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must not exceed ${rules.maxLength} characters`;
        }

        // Pattern validation
        if (rules.pattern && !rules.pattern.test(value.trim())) {
            const fieldDisplay = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
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
        
        Object.keys(validationRules).forEach(fieldName => {
            const error = validateField(fieldName, categoryData[fieldName]);
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
        const error = validateField(fieldName, categoryData[fieldName]);
        setErrors({ ...errors, [fieldName]: error });
    };

    // Real-time validation as user types
    const handleFieldChange = (fieldName, value) => {
        // Update the form data
        setCategoryData({
            ...categoryData,
            [fieldName]: value,
        });

        // Clear error if field was previously touched and now has valid input
        if (touched[fieldName]) {
            const error = validateField(fieldName, value);
            setErrors({ ...errors, [fieldName]: error });
        }
    };

    // Reset form to original values
    const handleReset = () => {
        setCategoryData(originalData);
        setErrors({});
        setTouched({});
        setHasChanges(false);
    };

    const handleUpdate = async () => {
        // Mark all fields as touched
        const allTouched = Object.keys(validationRules).reduce((acc, field) => {
            acc[field] = true;
            return acc;
        }, {});
        setTouched(allTouched);

        // Validate form
        if (!validateForm()) {
            toast.error("Please fix the errors before updating");
            return;
        }

        // Check if there are any changes
        if (!hasChanges) {
            toast.info("No changes detected");
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await adminApi.put(`/edit-category/${id}`, categoryData);
            console.log(res.data);
            if (res.status === 200) {
                toast.success("Category updated successfully");
                setHasChanges(false);
                setTouched({});
            } else {
                toast.error("Error updating category");
            }
        } catch (error) {
            console.error("Error updating category:", error);
            toast.error(error?.response?.data?.error || "Error updating category");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-[#f0f7f5] rounded-lg p-6">
            <div className="flex justify-center items-center mb-6">
                <h2 className="text-2xl font-bold">Edit Category</h2>
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
                            value={categoryData.name}
                            onChange={(e) => handleFieldChange("name", e.target.value)}
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
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.name}
                            </p>
                        )}
                        <div className="mt-1 text-xs text-gray-500">
                            {categoryData.name.length}/50 characters
                        </div>
                    </div>
                </div>

                {/* Description Field */}
                <div className="flex gap-4">
                    <label htmlFor="description" className="text-lg font-medium w-32 mt-2">
                        Description: <span className="text-red-500">*</span>
                    </label>
                    <div className="flex-1">
                        <textarea
                            id="description"
                            value={categoryData.description}
                            onChange={(e) => handleFieldChange("description", e.target.value)}
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
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.description}
                            </p>
                        )}
                        <div className="mt-1 text-xs text-gray-500">
                            {categoryData.description.length}/500 characters
                        </div>
                    </div>
                </div>

                {/* Change Indicator */}
                {hasChanges && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                        <div className="flex items-center">
                            <svg className="w-4 h-4 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm text-yellow-800">You have unsaved changes</span>
                        </div>
                    </div>
                )}

                {/* Form Actions */}
                <div className="flex justify-center gap-4 mt-8">
                    <button
                        type="button"
                        onClick={handleReset}
                        className="bg-gray-500 text-white hover:bg-gray-600 px-8 py-2 rounded-md transition-colors disabled:opacity-50"
                        disabled={isSubmitting || !hasChanges}
                    >
                        RESET
                    </button>
                    <button
                        onClick={handleUpdate}
                        disabled={isSubmitting || Object.keys(errors).some(key => errors[key]) || !hasChanges}
                        className="bg-black text-white hover:bg-black/90 px-12 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                UPDATING...
                            </>
                        ) : (
                            "UPDATE CATEGORY"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CategoryEdit;
