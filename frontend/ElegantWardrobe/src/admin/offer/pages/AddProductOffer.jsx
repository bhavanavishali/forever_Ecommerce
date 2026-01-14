import api, { adminApi } from '@/api'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'

const AddProductOffer = () => {
  const location = useLocation()
  const products = location.state

  const [productOffer, setProductOffer] = useState({
    product: 0,
    discount_percentage: '',
    valid_from: '',
    valid_to: '',
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  // Validation function
  const validateForm = () => {
    const newErrors = {}

    // Product validation
    if (!productOffer.product || productOffer.product === 0) {
      newErrors.product = "Please select a product"
    }

    // Discount percentage validation
    if (!productOffer.discount_percentage && productOffer.discount_percentage !== 0) {
      newErrors.discount_percentage = "Discount percentage is required"
    } else if (productOffer.discount_percentage < 0) {
      newErrors.discount_percentage = "Discount percentage cannot be negative"
    } else if (productOffer.discount_percentage > 100) {
      newErrors.discount_percentage = "Discount percentage cannot exceed 100%"
    }

    // Valid from validation
    if (!productOffer.valid_from) {
      newErrors.valid_from = "Valid from date is required"
    }

    // Valid to validation
    if (!productOffer.valid_to) {
      newErrors.valid_to = "Valid to date is required"
    }

    // Date comparison validation
    if (productOffer.valid_from && productOffer.valid_to) {
      const fromDate = new Date(productOffer.valid_from)
      const toDate = new Date(productOffer.valid_to)
      
      if (fromDate >= toDate) {
        newErrors.valid_to = "Valid to date must be after valid from date"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle field blur for touched state
  const handleBlur = (fieldName) => {
    setTouched({
      ...touched,
      [fieldName]: true,
    })
  }

  // Real-time validation on field change
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      validateForm()
    }
  }, [productOffer, touched])

  const addProductOffer = async (e) => {
    e.preventDefault()
    
    // Mark all fields as touched
    setTouched({
      product: true,
      discount_percentage: true,
      valid_from: true,
      valid_to: true,
    })

    // Validate form
    if (!validateForm()) {
      toast.error("Please fix all validation errors before submitting")
      return
    }

    try {
      const res = await adminApi.post('/product_offers/', productOffer)
      console.log(res.data.data)
      toast.success(res.data.message)
      if (res.status === 201) {
        toast.success('Product offer created successfully!')
        // Reset form after successful submission
        setProductOffer({
          product: products.length > 0 ? products[0].id : 0,
          discount_percentage: '',
          valid_from: '',
          valid_to: '',
        })
        setTouched({})
        setErrors({})
      }
    } catch (error) {
      console.log(error)
      if (error.response?.data?.valid_from) {
        toast.error(error.response.data.valid_from[0])
      } else if (error?.response?.data?.product) {
        toast.error(error?.response?.data?.product[0])
      } else if (error?.response?.data?.discount_percentage) {
        toast.error(error.response.data.discount_percentage[0])
      } else if (error?.response?.data?.valid_to) {
        toast.error(error.response.data.valid_to[0])
      } else {
        toast.error("An error occurred while creating the offer")
      }
    }
  }

  useEffect(() => {
    console.log(productOffer)
    
    if (products.length > 0 && productOffer.product === 0) {
      setProductOffer({
        ...productOffer,
        product: products[0].id
      })
    }
  }, [products])

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Add Product Offer</h1>
      <form onSubmit={addProductOffer} className="max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Product Selection */}
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="product">
              Product*
            </label>
            <select
              id="product"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.product && touched.product
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-gray-500"
              }`}
              value={productOffer.product}
              onChange={(e) => {
                setProductOffer({
                  ...productOffer,
                  product: Number(e.target.value)
                })
              }}
              onBlur={() => handleBlur("product")}
            >
              <option value={0}>-- Select a product --</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
            {errors.product && touched.product && (
              <p className="text-red-500 text-sm mt-1">{errors.product}</p>
            )}
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
              value={productOffer.discount_percentage}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.discount_percentage && touched.discount_percentage
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-gray-500"
              }`}
              onChange={(e) => {
                setProductOffer({
                  ...productOffer,
                  discount_percentage: e.target.value === '' ? '' : Number(e.target.value)
                })
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
            <label className="block text-gray-700 font-medium mb-2" htmlFor="valid_from">
              Valid From*
            </label>
            <input
              type="datetime-local"
              id="valid_from"
              name="valid_from"
              value={productOffer.valid_from}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.valid_from && touched.valid_from
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-gray-500"
              }`}
              onChange={(e) => {
                setProductOffer({
                  ...productOffer,
                  valid_from: e.target.value
                })
              }}
              onBlur={() => handleBlur("valid_from")}
            />
            {errors.valid_from && touched.valid_from && (
              <p className="text-red-500 text-sm mt-1">{errors.valid_from}</p>
            )}
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
              value={productOffer.valid_to}
              onChange={(e) => {
                setProductOffer({
                  ...productOffer,
                  valid_to: e.target.value
                })
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
            Add Product Offer
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
  )
}

export default AddProductOffer