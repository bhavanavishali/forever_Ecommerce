import api from "@/api";
import { ShopContext } from "@/context/ShopContext";
import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "@/components/InvoicePDF";
import ReturnOrderModal from "@/components/ReturnOrder";
import ConfirmModal from "@/ConfirmModal";

const OrderDetails = () => {
  const [orderDetails, setOrderDetails] = useState({});
  const { currency } = useContext(ShopContext);
  const location = useLocation();
  const { orderId } = location.state;
  const navigate = useNavigate();
  const [isChangeOrderItem, setIsChangeOrderItem] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [orderItemId, setOrderItemId] = useState(0);
  const [isRetryingPayment, setIsRetryingPayment] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedOrderId, setselectedOrderId] = useState(null);

  useEffect(() => {
    const getOrderDetails = async () => {
      try {
        const res = await api.get(`/order_details/${orderId}/`);
        console.log(res.data.items);
        setOrderDetails(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getOrderDetails();
  }, [isChangeOrderItem, orderId]);

  // Load Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Check if retry payment button should be shown
  const shouldShowRetryPayment = () => {
    return (
      orderDetails.payment_method?.toLowerCase() === "razorpay" &&
      orderDetails.payment_status?.toLowerCase() === "payment_pending"
    );
  };

  // Retry payment function
  const retryPayment = async () => {
    setIsRetryingPayment(true);

    try {
      // Load Razorpay script if not already loaded
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Failed to load payment gateway. Please try again.");
        setIsRetryingPayment(false);
        return;
      }

      // Create new Razorpay order for retry payment
      const response = await api.post(`/retry_payment/${orderId}/`);

      if (response.data.success) {
        const {
          razorpay_order_id,
          amount,
          currency: paymentCurrency,
          razorpay_key,
        } = response.data;
        console.log(amount);

        // Initialize Razorpay payment
        const options = {
          key: razorpay_key, // Your Razorpay key ID from backend
          amount: (amount + amount * 0.12 + 40).toFixed(2), // Amount in paise
          currency: paymentCurrency || "INR",
          name: "Your Store Name",
          description: `Retry Payment for Order #${
            orderDetails.order_no || orderId
          }`,
          order_id: razorpay_order_id,
          handler: async (paymentResponse) => {
            try {
              // Verify payment on backend
              const verifyResponse = await api.post("/verify_retry_payment/", {
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                order_id: orderId,
              });

              if (verifyResponse.data.success) {
                toast.success(
                  "Payment successful! Your order is being processed."
                );
                // Refresh order details to show updated payment status
                setIsChangeOrderItem(!isChangeOrderItem);
              } else {
                toast.error(
                  "Payment verification failed. Please contact support."
                );
              }
            } catch (error) {
              console.error("Payment verification error:", error);
              toast.error(
                "Payment verification failed. Please contact support."
              );
            }
          },
          prefill: {
            name: orderDetails.address?.name || "",
            email: orderDetails.customer_email || "",
            contact: orderDetails.customer_phone || "",
          },
          notes: {
            order_id: orderId,
            retry_payment: true,
          },
          theme: {
            color: "#3399cc",
          },
          modal: {
            ondismiss: () => {
              setIsRetryingPayment(false);
              toast.info("Payment cancelled. You can retry anytime.");
            },
          },
        };

        const rzp = new window.Razorpay(options);

        rzp.on("payment.failed", (response) => {
          console.error("Payment failed:", response.error);
          toast.error(
            `Payment failed: ${
              response.error.description || "Please try again"
            }`
          );
          setIsRetryingPayment(false);
        });

        rzp.open();
      } else {
        toast.error(
          response.data.message || "Failed to initiate payment retry"
        );
        setIsRetryingPayment(false);
      }
    } catch (error) {
      console.error("Retry payment error:", error);
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Failed to retry payment. Please try again."
      );
      setIsRetryingPayment(false);
    }
  };

  const cancelOrderItem = async () => {
    try {
      const res = await api.put(`/cancel_order_item/${selectedOrderId}/`);
      toast.success(res.data.message);
      setIsChangeOrderItem(!isChangeOrderItem);
      setIsCancelModalOpen(false);
    } catch (error) {
      toast.error(error?.response?.data?.error);
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
        <div className="mb-4">
          <p className="text-gray-500">Ordered on {orderDetails.order_date}</p>
          <span className="inline-block px-3 py-1 mt-2 bg-yellow-400 text-yellow-800 rounded-md text-sm font-medium">
            {orderDetails.status}
          </span>

          {/* Payment Pending Warning */}
          {shouldShowRetryPayment() && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Payment Pending
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>
                      Your payment for this order is still pending. Please
                      complete the payment to process your order.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="font-medium text-gray-700 mb-2">Order Status</h2>
            <p className="text-gray-600">{orderDetails.status}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="font-medium text-gray-700 mb-2">Payment Method</h2>
            <p className="text-gray-600">
              {orderDetails.payment_method === "COD"
                ? "Cash On Delivery"
                : orderDetails.payment_method}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="font-medium text-gray-700 mb-2">Payment Status</h2>
            <p
              className={`text-gray-600 ${
                orderDetails.payment_status?.toLowerCase() === "payment_pending"
                  ? "text-red-600 font-semibold"
                  : orderDetails.payment_status?.toLowerCase() === "paid"
                  ? "text-green-600 font-semibold"
                  : ""
              }`}
            >
              {orderDetails.payment_status}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className="font-medium text-gray-700 mb-4">Products Ordered</h2>

          {orderDetails.items?.map((item, index) => (
            <div
              key={item.item_id}
              className="border-b border-gray-200 pb-4 mb-4"
            >
              {showReturnModal && (
                <ReturnOrderModal
                  orderItemId={orderItemId}
                  showReturnModal={showReturnModal}
                  setShowReturnModal={setShowReturnModal}
                  isChangeOrderItem={isChangeOrderItem}
                  setIsChangeOrderItem={setIsChangeOrderItem}
                />
              )}
              <div className="flex flex-col md:flex-row items-start">
                <div className="w-20 h-20 mr-4 mb-2 md:mb-0">
                  <img
                    src={item.image || "fallback.jpg"}
                    alt="Product Image"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">
                    {item.product_name} {item.item_id}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Color: {item.variant?.color || "N/A"} | Qty: {item.quantity}
                  </p>
                  <p className="font-medium mt-1">
                    {currency} {item.price}
                  </p>
                  {item.status === "DELIVERED" ? (
                    <button
                      onClick={() => {
                        setOrderItemId(item.item_id);
                        setShowReturnModal(!showReturnModal);
                      }}
                      className="mt-2 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                    >
                      Return item
                    </button>
                  ) : item.status === "PENDING" ? (
                    <button
                      onClick={() => {
                        setIsCancelModalOpen(true);
                        setselectedOrderId(item.item_id);
                      }}
                      className="mt-2 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                    >
                      Cancel Order
                    </button>
                  ) : null}
                </div>
                <div className="flex flex-col items-center">
                  <div>
                    <h2 className="font-medium text-gray-700 mb-2">Status</h2>
                    <p className="text-gray-600">{item.status}</p>
                  </div>
                  <div>
                    {item.status.toLowerCase() === 'delivered' ? (
                      <button
                        className="text-blue-600"
                        onClick={() => {
                          navigate("/add-review-ratings", {
                            state: { productId: item.product_variant_id },
                          });
                        }}
                      >
                        Rate & Review Product
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className="font-medium text-gray-700 mb-2">
            Shipping Information
          </h2>
          <p className="text-gray-600">
            {orderDetails.address?.name}, {orderDetails.address?.city},{" "}
            {orderDetails.address?.state} - {orderDetails.address?.pin_code}
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className="font-medium text-gray-700 mb-4">Price Details</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Price:</span>
              <span className="text-gray-800">
                {currency}
                {orderDetails.total_price}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Total Discount:</span>
              <span className="text-gray-800">
                {currency}
                {orderDetails.total_discount}
              </span>
            </div>

            {orderDetails.coupon_discount ? (
              <div className="flex justify-between">
                <span className="text-gray-600">Coupon Discount:</span>
                <span className="text-gray-800">
                  {orderDetails.coupon_discount}%
                </span>
              </div>
            ) : null}

            <div className="flex justify-between pt-2 border-t border-gray-200 font-medium">
              <span>Total:</span>
              <span>
                {currency}
                {orderDetails?.final_amount}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-3">
          <button
            onClick={() => {
              navigate("/orders");
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Back to Orders
          </button>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Retry Payment Button */}
            {shouldShowRetryPayment() && (
              <button
                onClick={retryPayment}
                disabled={isRetryingPayment}
                className={`px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center ${
                  isRetryingPayment ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {isRetryingPayment ? (
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
                    Processing...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Retry Payment
                  </>
                )}
              </button>
            )}

            {/* Download Invoice Button */}
            <PDFDownloadLink
              document={<InvoicePDF order={orderDetails} />}
              fileName={`invoice_order_${orderDetails.id}.pdf`}
              className="border flex justify-center items-center px-4 py-2 rounded hover:bg-gray-50 transition-colors text-gray-700"
            >
              {({ loading }) =>
                loading ? "Preparing Invoice..." : "Download Invoice"
              }
            </PDFDownloadLink>
          </div>
        </div>
      </div>
      <ConfirmModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={cancelOrderItem}
        message="Are you sure to want to cancel this item?"
      />
    </>
  );
};

export default OrderDetails;

