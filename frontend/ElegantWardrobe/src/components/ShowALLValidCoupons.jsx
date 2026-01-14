import api from "@/api";
import React, { useEffect, useState } from "react";

const ShowALLValidCoupons = () => {
  const [availableCoupons, setAvailableCoupons] = useState([]);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await api.get("/get_all_valid_coupons/"); // Adjust API as needed
        setAvailableCoupons(res.data);
      } catch (error) {
        console.log("Failed to fetch coupons", error);
      }
    };
    fetchCoupons();
  }, []);
  return (
    <div className="mt-4 border p-4 rounded bg-gray-50">
      <h3 className="font-semibold mb-2">Available Coupons:</h3>
      {availableCoupons.length > 0 ? (
        <ul className="list-disc pl-5 space-y-1">
          {availableCoupons.map((coupon) => (
            <li key={coupon.id}>
              <span className="font-medium text-yellow-600">{coupon.code}</span> -{" "}
              {coupon.description || "No description"}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No coupons available.</p>
      )}
    </div>
  );
};

export default ShowALLValidCoupons;
