import api from "@/api";
import React, { useState } from "react";
import { toast } from "react-toastify";

const Coupon = ({ cartTotal, discount,setDiscount,couponCode,setCouponCode}) => {
  
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const applyCoupon = async () => {  
    
    try {
      const response = await api.post("apply_coupon/", {
        code: couponCode.trim(),
        order_total: cartTotal,
      });
      setDiscount(response.data.discount_percent);
      setAppliedCoupon(couponCode.trim()); // Store the applied code
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to apply coupon.");
    }
  };

  const removeCoupon = async () => {
    try {
      await api.post("remove_coupon/", { code: appliedCoupon });
      setDiscount(null);
      setAppliedCoupon(null);
      setCouponCode(""); // optional: reset input
    } catch (error) {
      alert(error?.response?.data?.error || "Failed to remove coupon.");
    }
  };

  return (
    <div className="my-4">
    <input
      type="text"
      placeholder="Enter coupon code"
      value={couponCode}
      onChange={(e) => setCouponCode(e.target.value)}
      className="border p-2 rounded-md"
      disabled={!!appliedCoupon}
    />
    {!appliedCoupon ? (
      <button
        onClick={applyCoupon}
        className="ml-2 bg-black text-white px-4 py-2 rounded-md"
      >
        Apply
      </button>
    ) : (
      <button
        onClick={removeCoupon}
        className="ml-2 bg-red-600 text-white px-4 py-2 rounded-md"
      >
        Remove
      </button>
    )}
  </div>
  );
};

export default Coupon;