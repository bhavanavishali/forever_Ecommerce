


import React, { useState, useEffect } from 'react';

const CouponForm = ({ onSubmit, initialData, onCancel, isEditing }) => {
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount_percent: 0,
    valid_from: '',
    valid_to: '',
    active: true,
    minimum_order_amount: 0.00,
    is_listed: true
  });

  const [errors, setErrors] = useState({});

  // Initialize form with initial data if provided
  useEffect(() => {
    if (initialData) {
      // Format dates properly for datetime-local input
      const formattedData = {
        ...initialData,
        valid_from: initialData.valid_from ? formatDateForInput(initialData.valid_from) : '',
        valid_to: initialData.valid_to ? formatDateForInput(initialData.valid_to) : ''
      };
      setFormData(formattedData);
    }
  }, [initialData]);

  // Format ISO date string for datetime-local input
  const formatDateForInput = (isoString) => {
    const date = new Date(isoString);
    return date.toISOString().slice(0, 16);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};

    if (!formData.code) {
      newErrors.code = 'Code is required';
    }

    if (!formData.valid_from) {
      newErrors.valid_from = 'Start date is required';
    }

    if (!formData.valid_to) {
      newErrors.valid_to = 'End date is required';
    } else if (formData.valid_from && new Date(formData.valid_from) >= new Date(formData.valid_to)) {
      newErrors.valid_to = 'End date must be after start date';
    }

    if (formData.discount_percent < 0 || formData.discount_percent > 100) {
      newErrors.discount_percent = 'Discount must be between 0 and 100';
    }

    if (formData.minimum_order_amount < 0) {
      newErrors.minimum_order_amount = 'Minimum order amount cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Format data for submission
      const submitData = {
        ...formData,
        discount_percent: parseInt(formData.discount_percent, 10),
        minimum_order_amount: parseFloat(formData.minimum_order_amount)
      };
      
      onSubmit(submitData);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">
        {isEditing ? 'Edit Coupon' : 'Create New Coupon'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Code */}
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="code">
              Coupon Code*
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                errors.code ? 'border-red-500' : 'border-gray-300'
              }`}
              maxLength={20}
            />
            {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
          </div>

          {/* Discount Percentage */}
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="discount_percent">
              Discount Percentage*
            </label>
            <input
              type="number"
              id="discount_percent"
              name="discount_percent"
              value={formData.discount_percent}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                errors.discount_percent ? 'border-red-500' : 'border-gray-300'
              }`}
              min="0"
              max="100"
            />
            {errors.discount_percent && <p className="text-red-500 text-sm mt-1">{errors.discount_percent}</p>}
          </div>

          {/* Valid From */}
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="valid_from">
              Valid From*
            </label>
            <input
              type="datetime-local"
              id="valid_from"
              name="valid_from"
              value={formData.valid_from}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                errors.valid_from ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.valid_from && <p className="text-red-500 text-sm mt-1">{errors.valid_from}</p>}
          </div>

          {/* Valid To */}
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="valid_to">
              Valid To*
            </label>
            <input
              type="datetime-local"
              id="valid_to"
              name="valid_to"
              value={formData.valid_to}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                errors.valid_to ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.valid_to && <p className="text-red-500 text-sm mt-1">{errors.valid_to}</p>}
          </div>

          {/* Minimum Order Amount */}
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="minimum_order_amount">
              Minimum Order Amount
            </label>
            <input
              type="number"
              id="minimum_order_amount"
              name="minimum_order_amount"
              value={formData.minimum_order_amount}
              onChange={handleChange}
              step="0.01"
              min="0"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                errors.minimum_order_amount ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.minimum_order_amount && (
              <p className="text-red-500 text-sm mt-1">{errors.minimum_order_amount}</p>
            )}
          </div>

          {/* Active Status */}
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="active"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-grag-500"
            />
            <label className="ml-2 text-gray-700 font-medium" htmlFor="active">
              Active
            </label>
          </div>

          {/* Is Listed */}
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="is_listed"
              name="is_listed"
              checked={formData.is_listed}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-gray-500"
            />
            <label className="ml-2 text-gray-700 font-medium" htmlFor="is_listed">
              Listed (Visible to customers)
            </label>
          </div>
        </div>

        {/* Description */}
        <div className="mt-6">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          ></textarea>
        </div>

        {/* Form Actions */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            {isEditing ? 'Update Coupon' : 'Create Coupon'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CouponForm;