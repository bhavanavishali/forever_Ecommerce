import React, { useState, useEffect } from "react";
import axios from "axios";
import CouponForm from "../components/CouponForm";
import CouponList from "../components/CouponList";
import api, { adminApi } from "@/api";
import { toast } from "react-toastify";
import Pagination from "@/components/Pagination";

const CouponManager = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [activePage, setActivePage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
 
  
  // Fetch coupons from API
  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get("/coupons/",{ params: { page: activePage } });
      setCoupons(res.data.results);
      setHasNext(res.data.has_next);
      setHasPrevious(res.data.has_previous);
      setTotalPages(res.data.total_pages);
      setError(null);
    } catch (err) {
      setError("Failed to fetch coupons");
      console.error("Error fetching coupons:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load coupons when component mounts
  useEffect(() => {
    fetchCoupons();
  }, [activePage]);

  // Create new coupon
  const handleCreateCoupon = async (couponData) => {
    try {
      const response = await adminApi.post("/coupons/", couponData);
      setCoupons([...coupons, response.data]);
      setIsFormOpen(false);
      toast.success("Coupon Successfully Created");
    } catch (err) {
      setError("Failed to create coupon");
      console.error("Error creating coupon:", err);
    }
  };

  // Update existing coupon
  const handleUpdateCoupon = async (couponData) => {
    try {
      const response = await adminApi.put(
        `/coupons/${couponData.id}/`,
        couponData
      );
      setCoupons(
        coupons.map((coupon) =>
          coupon.id === couponData.id ? response.data : coupon
        )
      );
      setEditingCoupon(null);
      setIsFormOpen(false);
      toast.success("Coupon Successfully Updated");
    } catch (err) {
      setError("Failed to update coupon");
      console.error("Error updating coupon:", err);
    }
  };

  // Delete coupon
  const handleDeleteCoupon = async (id) => {
    try {
      await adminApi.delete(`/coupons/${id}/`);
      setCoupons(coupons.filter((coupon) => coupon.id !== id));
    } catch (err) {
      setError("Failed to delete coupon");
      console.error("Error deleting coupon:", err);
    }
  };

  // Edit coupon
  const handleEditCoupon = (coupon) => {
    setEditingCoupon(coupon);
    setIsFormOpen(true);
  };

  // Open form for creating new coupon
  const openCreateForm = () => {
    setEditingCoupon(null);
    setIsFormOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Coupon Management
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-6">
        {!isFormOpen ? (
          <button
            onClick={openCreateForm}
            className="bg-black hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded shadow"
          >
            Create New Coupon
          </button>
        ) : (
          <CouponForm
            onSubmit={editingCoupon ? handleUpdateCoupon : handleCreateCoupon}
            initialData={editingCoupon || {}}
            onCancel={() => setIsFormOpen(false)}
            isEditing={!!editingCoupon}
          />
        )}
      </div>

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
        <CouponList
          coupons={coupons}
          onEditCoupon={handleEditCoupon}
          onDeleteCoupon={handleDeleteCoupon}
        />
           <Pagination
          activePage={activePage}
          setActivePage={setActivePage}
          hasNext={hasNext}
          hasPrevious={hasPrevious}
          totalPages={totalPages}
        />
        </>
        
      )}
    </div>
  );
};

export default CouponManager;
