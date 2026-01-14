import ConfirmModal from "@/ConfirmModal";
import { ShopContext } from "@/context/ShopContext";
import React, { useContext, useState } from "react";

const CouponList = ({ coupons, onEditCoupon, onDeleteCoupon }) => {
  const { currency } = useContext(ShopContext);
  // Format date for display
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [couponId, setCouponId] = useState(null);

  // Check if coupon is currently valid
  const isCouponValid = (coupon) => {
    const now = new Date();
    const validFrom = new Date(coupon.valid_from);
    const validTo = new Date(coupon.valid_to);
    return coupon.active && validFrom <= now && now <= validTo;
  };

  const handleConfirmDelete = () => {
    onDeleteCoupon(couponId);
    setIsModalOpen(false);
  };

  return (
    <div className="overflow-x-auto">
      {coupons.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No coupons found. Create your first coupon!
        </div>
      ) : (
        <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Discount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Min. Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                Valid Period
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {coupons?.map((coupon) => (
              <tr key={coupon?.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">
                    {coupon?.code}
                  </div>
                  <div className="text-sm text-gray-500 md:hidden">
                    {coupon?.discount_percent}% off
                  </div>
                  <div className="text-xs text-gray-500 md:hidden mt-1">
                    Min: {currency}
                    {parseFloat(coupon.minimum_order_amount).toFixed(2)}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {coupon?.discount_percent}%
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                  {currency}{parseFloat(coupon?.minimum_order_amount).toFixed(2)}
                </td>

                <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                  <div className="text-sm text-gray-500">
                    From: {formatDate(coupon?.valid_from)}
                  </div>
                  <div className="text-sm text-gray-500">
                    To: {formatDate(coupon?.valid_to)}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isCouponValid(coupon)
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {isCouponValid(coupon) ? "Valid" : "Invalid"}
                  </span>

                  {!coupon.active && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Inactive
                    </span>
                  )}

                  {!coupon.is_listed && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Hidden
                    </span>
                  )}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onEditCoupon(coupon)}
                      className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => {
                        // onDeleteCoupon(coupon.id)
                        setCouponId(coupon.id);
                        setIsModalOpen(true);
                        setModalMessage(
                          "Are you sure to want to delete this coupon"
                        );
                      }}
                      className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        message={modalMessage}
      />
    </div>
  );
};

export default CouponList;
