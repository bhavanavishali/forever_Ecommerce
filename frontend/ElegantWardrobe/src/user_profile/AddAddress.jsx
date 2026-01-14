import api from '@/api';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddAddress = () => {
    const [addressData, setAddressData] = useState({
        name: "",
        phone_no: "",
        street_address: "",
        city: "",
        state: "",
        pin_code: "",
        country: "",
    });
    
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    
    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        
        // For phone number, only allow digits
        if (name === 'phone_no') {
            const numericValue = value.replace(/\D/g, '');
            if (numericValue.length <= 10) {
                setAddressData({ ...addressData, [name]: numericValue });
            }
        } else {
            setAddressData({ ...addressData, [name]: value });
        }
        
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };
    
    const validateForm = () => {
        const newErrors = {};
        
        // Name validation - at least 2 characters
        if (!addressData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (addressData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters long';
        }
        
        // Phone number validation - must be exactly 10 digits
        if (!addressData.phone_no.trim()) {
            newErrors.phone_no = 'Phone number is required';
        } else if (!/^\d{10}$/.test(addressData.phone_no)) {
            newErrors.phone_no = 'Phone number must be exactly 10 digits';
        }
        
        // Street address validation
        if (!addressData.street_address.trim()) {
            newErrors.street_address = 'Street address is required';
        }
        
        // City validation
        if (!addressData.city.trim()) {
            newErrors.city = 'City is required';
        }
        
        // State validation
        if (!addressData.state.trim()) {
            newErrors.state = 'State is required';
        }
        
        // Pin code validation
        if (!addressData.pin_code.trim()) {
            newErrors.pin_code = 'Pin code is required';
        }
        
        // Country validation
        if (!addressData.country.trim()) {
            newErrors.country = 'Country is required';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleAddAddress = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error("Please fix the validation errors");
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            const response = await api.post("/add_address/", addressData);
            console.log(addressData);
            navigate("/profile/manage-address");
            toast.success("Address added successfully!");
        } catch (error) {
            console.log(error);
            toast.error("Failed to add address.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <>
            <form
                onSubmit={handleAddAddress}
                className="flex flex-col items-center w-full max-w-md mx-auto px-4 sm:px-6 mt-8 sm:mt-14 gap-4 text-gray-800"
            >
                {/* Header */}
                <div className="inline-flex items-center gap-2 mb-2 mt-6 sm:mt-10">
                    <p className="prata-regular text-2xl sm:text-3xl">Add Address</p>
                    <hr className="border-none h-[1.5px] w-6 sm:w-8 bg-gray-800" />
                </div>

                {/* Name */}
                <div className="w-full">
                    <input
                        className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-800'} focus:outline-none focus:border-gray-600`}
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={addressData.name}
                        onChange={handleAddressChange}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* Phone Number */}
                <div className="w-full">
                    <input
                        className={`w-full px-3 py-2 border ${errors.phone_no ? 'border-red-500' : 'border-gray-800'} focus:outline-none focus:border-gray-600`}
                        type="tel"
                        name="phone_no"
                        placeholder="Phone Number (10 digits)"
                        value={addressData.phone_no}
                        onChange={handleAddressChange}
                        maxLength="10"
                    />
                    {errors.phone_no && <p className="text-red-500 text-sm mt-1">{errors.phone_no}</p>}
                </div>

                {/* Street Address */}
                <div className="w-full">
                    <input
                        className={`w-full px-3 py-2 border ${errors.street_address ? 'border-red-500' : 'border-gray-800'} focus:outline-none focus:border-gray-600`}
                        type="text"
                        name="street_address"
                        placeholder="Street Address"
                        value={addressData.street_address}
                        onChange={handleAddressChange}
                    />
                    {errors.street_address && <p className="text-red-500 text-sm mt-1">{errors.street_address}</p>}
                </div>

                {/* City */}
                <div className="w-full">
                    <input
                        className={`w-full px-3 py-2 border ${errors.city ? 'border-red-500' : 'border-gray-800'} focus:outline-none focus:border-gray-600`}
                        type="text"
                        name="city"
                        placeholder="City"
                        value={addressData.city}
                        onChange={handleAddressChange}
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>

                {/* State */}
                <div className="w-full">
                    <input
                        className={`w-full px-3 py-2 border ${errors.state ? 'border-red-500' : 'border-gray-800'} focus:outline-none focus:border-gray-600`}
                        type="text"
                        name="state"
                        placeholder="State"
                        value={addressData.state}
                        onChange={handleAddressChange}
                    />
                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                </div>

                {/* Pin Code */}
                <div className="w-full">
                    <input
                        className={`w-full px-3 py-2 border ${errors.pin_code ? 'border-red-500' : 'border-gray-800'} focus:outline-none focus:border-gray-600`}
                        type="text"
                        name="pin_code"
                        placeholder="Pin Code"
                        value={addressData.pin_code}
                        onChange={handleAddressChange}
                    />
                    {errors.pin_code && <p className="text-red-500 text-sm mt-1">{errors.pin_code}</p>}
                </div>

                {/* Country */}
                <div className="w-full">
                    <input
                        className={`w-full px-3 py-2 border ${errors.country ? 'border-red-500' : 'border-gray-800'} focus:outline-none focus:border-gray-600`}
                        type="text"
                        name="country"
                        placeholder="Country"
                        value={addressData.country}
                        onChange={handleAddressChange}
                    />
                    {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                </div>

                {/* Submit Button */}
                <button 
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full sm:w-auto bg-black text-white px-8 py-2 font-light mt-4 transition-opacity ${
                        isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                    }`}
                >
                    {isSubmitting ? 'Adding Address...' : 'Add Address'}
                </button>
            </form>
        </>
    );
};

export default AddAddress;