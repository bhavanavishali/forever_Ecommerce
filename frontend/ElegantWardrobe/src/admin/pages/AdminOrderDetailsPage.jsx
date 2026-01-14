import api, { adminApi } from "@/api";
import { ShopContext } from "@/context/ShopContext";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function AdminOrderDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState({});
  const { orderId } = location.state;
  const { currency } = useContext(ShopContext);
  const [orderStatus, setOrderStatus] = useState("");
  const [updateStatus, setUpdateStatus] = useState(false);

  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedReturnItem, setSelectedReturnItem] = useState(null);
  const [reasons, setReasons] = useState(null);

  useEffect(() => {
    const getOrderDetails = async () => {
      try {
        const res = await adminApi.get(`/order_details/${orderId}/`);
        console.log(res.data.items);

        setOrderDetails(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getOrderDetails();
  }, [updateStatus]);

  const updateOrderStatus = async (id) => {
    try {
      const res = await adminApi.put(`/update_order_status/${id}/`, {
        status: orderStatus,
      });
      toast.success(res.data.message);
      setUpdateStatus(!updateStatus);
    } catch (error) {
      toast.error(error?.response?.data?.error);
    }
  };

  // for Open Modals on Button Click
  const handleViewReturnInfo = async (item) => {
    console.log(item);
    try {
      const res = await adminApi.get(`return_reasons/${item.item_id}/`);
      setReasons(res.data);
      setSelectedReturnItem(item);
      setShowReturnModal(true);
    } catch (error) {
      console.log(error);

      toast.error(error?.response?.data?.error);
    }
  };

  const handleActionClick = async (item) => {
    setSelectedReturnItem(item);
    setShowActionModal(true);
  };

  // handle function for approve or reject
  const handleApproveReject = async (status) => {
    try {
      const res = await adminApi.put(
        `/handle_return_approval/${selectedReturnItem.item_id}/`,
        {
          action: status,
        }
      );
      toast.success(`Return ${status.toLowerCase()} successfully`);
      setShowActionModal(false);
      setUpdateStatus(!updateStatus); // refresh data
    } catch (err) {
      console.log(err);

      toast.error("Something went wrong");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* return info modal */}
      {/* ================= */}

      {showReturnModal && selectedReturnItem && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md">
            <h2 className="text-lg font-semibold mb-4">Return Information</h2>
            <div>
              <span className="font-medium">Reason:</span>{" "}
              {reasons ? (
                <ul className="space-y-2 text-gray-800 mt-3">
                  {reasons.sizing_issues && <li>• Sizing Issues</li>}
                  {reasons.damaged_item && <li>• Damaged Item</li>}
                  {reasons.incorrect_order && <li>• Incorrect Order</li>}
                  {reasons.delivery_delays && <li>• Delivery Delays</li>}
                  {reasons.other_reason && (
                    <li>
                      • Other:{" "}
                      <span className="italic text-gray-700">
                        {reasons.other_reason}
                      </span>
                    </li>
                  )}
                </ul>
              ) : (
                "No reason provided"
              )}
            </div>
            <p className="mt-3">
              <span className="font-medium">Requested On:</span>{" "}
              {reasons.return_date || "N/A"}
            </p>
            <div className="mt-4 text-right">
              <button
                onClick={() => setShowReturnModal(false)}
                className="px-4 py-2 bg-black text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve or reject modal */}
      {/* ======================= */}

      {showActionModal && selectedReturnItem && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md">
            <h2 className="text-lg font-semibold mb-4">Return Action</h2>
            <p>
              Do you want to approve or reject the return request for{" "}
              <strong>{selectedReturnItem.product_name}</strong>?
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => handleApproveReject("APPROVED")}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Approve
              </button>
              <button
                onClick={() => handleApproveReject("REJECTED")}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Reject
              </button>
              <button
                onClick={() => setShowActionModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="border-l-4 border-black pl-3 mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Order Details 
        </h1>
      </div>

      {/* Back Button */}
      <button
        onClick={() => {
          navigate(-1);
        }}
        className="flex items-center px-4 py-2 border border-black text-black rounded mb-6 hover:bg-red-50 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back
      </button>

      {/* Main Information Card */}
      <div className="border border-black rounded-lg p-4 md:p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Order Information */}
          <div>
            <div className="flex items-center mb-4 text-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <h2 className="text-lg font-semibold">Order Information</h2>
            </div>

            <div className="grid grid-cols-2 gap-y-3">
              <div className="text-gray-500">Order ID:</div>
              <div className="font-medium">{orderDetails.order_no}</div>

              <div className="text-gray-500">Created Date:</div>
              <div className="font-medium">{orderDetails.order_date}</div>

              <div className="text-gray-500">Estimated Delivery:</div>
              <div className="font-medium">2025-05-07</div>

              <div className="text-gray-500">Status:</div>
              <div>
                <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm">
                  {orderDetails.status}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div>
            <div className="flex items-center mb-4 text-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-red-800"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <h2 className="text-lg font-semibold">Customer Information</h2>
            </div>

            <div className="grid grid-cols-2 gap-y-3">
              <div className="text-gray-500">Name:</div>
              <div className="font-medium">
                {orderDetails?.customer?.first_name}{" "}
                {orderDetails?.customer?.last_name}
              </div>

              <div className="text-gray-500">Email:</div>
              <div className="font-medium">{orderDetails?.customer?.email}</div>

              <div className="text-gray-500">Phone:</div>
              <div className="font-medium">
                {orderDetails?.customer?.phone_number}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Three Cards Row */}
      <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-6">
        {/* Shipping Information */}
        <div className="border border-black rounded-lg p-4">
          <div className="flex items-center mb-3 text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-red-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <h2 className="text-lg font-semibold">Shipping Information</h2>
          </div>

          <div className="text-gray-700">
            <p className="font-medium">
              {orderDetails?.customer?.first_name}{" "}
              {orderDetails?.customer?.last_name}
            </p>
            <p>{orderDetails?.address?.street_address}</p>
            <p>
              {orderDetails?.address?.city},{orderDetails?.address?.state}
            </p>
            <p>{orderDetails?.address?.pin_code}</p>
            <p className="mt-2">Phone: {orderDetails?.address?.phone_no}</p>
          </div>
        </div>

        {/* Order Status */}
        <div className="border border-black rounded-lg p-4">
          <div className="flex items-center mb-3 text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-red-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h2 className="text-lg font-semibold">Order Status</h2>
          </div>

          <div className="mb-3">
            <select
              onChange={(e) => {
                setOrderStatus(e.target.value);
              }}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-800"
            >
              <option value="CANCELED">Cancelled</option>
              <option value="PENDING">Pending</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
            </select>
          </div>

          <button
            onClick={() => {
              updateOrderStatus(orderDetails.id);
            }}
            className="w-full py-2 bg-black text-white rounded hover:bg-red-900 transition-colors"
          >
            Update Status
          </button>
        </div>

        {/* Payment Details */}
        <div className="border border-black rounded-lg p-4">
          <div className="flex items-center mb-3 text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-red-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            <h2 className="text-lg font-semibold">Payment Details</h2>
          </div>

          <div className="grid grid-cols-2 gap-y-3">
            <div className="text-gray-500">Payment Method:</div>
            <div className="font-medium">{orderDetails?.payment_method}</div>

            <div className="text-gray-500">Payment Status:</div>
            <div>
              <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm">
                {orderDetails?.payment_status}
              </span>
            </div>

            <div className="text-gray-500 font-medium">Grand Total:</div>
            <div className="font-medium text-green-600">
              {currency}
              {orderDetails?.final_amount}
            </div>
          </div>
        </div>
      </div>

 
      {/* Order Items */}
      <div className="border border-black rounded-lg p-4 md:p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Order Items</h2>

        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2">Product</th>
                <th className="text-left py-3 px-2">Color</th>
                <th className="text-left py-3 px-2">Size</th>
                <th className="text-center py-3 px-2">Qty</th>
                <th className="text-right py-3 px-2">Price</th>
                {/* <th className="text-right py-3 px-2">Discount</th> */}
                {/* <th className="text-right py-3 px-2">Total</th> */}
                <th className="text-center py-3 px-2">Status</th>
                <th className="text-center py-3 px-2">Return Info</th>
                <th className="text-center py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails?.items?.map((item) => (
                <tr key={item.item_id} className="border-b border-gray-200">
                  <td className="py-3 px-2">{item?.product_name}</td>
                  <td className="py-3 px-2">{item?.variant?.color}</td>
                  <td className="py-3 px-2">{item?.variant?.size}</td>
                  <td className="py-3 px-2 text-center">{item?.quantity}</td>
                  <td className="py-3 px-2 text-right">
                    <div>
                      {currency} {item.price}
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                      {item?.status}
                    </span>
                  </td>
                  {item?.status === "RETURN_PENDING" ? (
                    <>
                      <td className="py-3 px-2 text-center">
                        <button
                          onClick={() => handleViewReturnInfo(item)}
                          className="border px-4 py-2 text-sm font-medium rounded-sm"
                        >
                          View Return Info
                        </button>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <button
                          onClick={() => handleActionClick(item)}
                          className="border px-4 py-2 text-sm font-medium rounded-sm"
                        >
                          Take Action
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-3 px-2 text-center text-gray-500">
                        N/A
                      </td>
                      <td className="py-3 px-2 text-center">-</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminOrderDetailsPage;
