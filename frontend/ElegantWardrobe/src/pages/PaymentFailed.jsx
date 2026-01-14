import api from "@/api";
import { ShopContext } from "@/context/ShopContext";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { showSuccessAlert } from "../utils/alert";
import { toast } from "react-toastify";

const PaymentFailed = () => {
  const {
    isRomoveCartItem,
    setIsRomoveCartItem,
    currency,
  } = useContext(ShopContext);
  const [orderDetails, setOrderDetails] = useState({});
  const [isRetrying, setIsRetrying] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, message } = location.state || {};

  console.log(orderId);

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
    if (orderId) {
      getOrderDetails();
    }
  }, [orderId]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRetryPayment = async () => {
    if (isRetrying) return;
    setIsRetrying(true);

    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load.");
      setIsRetrying(false);
      return;
    }

    try {
      // Create new Razorpay order for retry
      const response = await api.post("create_order/", {
        totalAmount: orderDetails.final_amount,
      });

      const data = response.data;

      const options = {
        key: data.razorpay_key,
        amount: data.amount,
        currency: "INR",
        name: "My Shop",
        description: "Retry Payment",
        order_id: data.order_id,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyRes = await api.post("/verify_payment/", {
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });

            // Update the existing order payment status
            const updateRes = await api.post(`/update_order_payment/`, {
              order_id: orderId,
              payment_status: "CONFIRMED",
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            setIsRomoveCartItem(!isRomoveCartItem)

            showSuccessAlert(
              "Payment Successful",
              "Your payment has been processed successfully!"
            );
            navigate("/order-success", { state: { orderId: orderId } });
          } catch (error) {
            console.log(error.response?.data);
            toast.error(
              error?.response?.data?.error || "Payment verification failed"
            );
            setIsRetrying(false);
          }
        },
        prefill: {
          name: orderDetails?.customer?.first_name || "Customer Name",
          email: orderDetails?.customer?.email || "customer@example.com",
          contact: orderDetails?.customer?.phone_number || "9999999999",
        },
        theme: {
          color: "#0d6efd",
        },
        modal: {
          ondismiss: function () {
            setIsRetrying(false);
            toast.info("Payment was cancelled.");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Retry payment failed:", err);
      toast.error("Unable to start payment retry");
      setIsRetrying(false);
    }
  };

  const handleBackToOrders = () => {
    navigate("/orders"); // Adjust this route as per your orders page route
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="flex flex-col items-center mb-6">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 text-center">
          Payment Failed
        </h1>
      </div>

      <div className="text-center text-gray-600 mb-6">
        {message ? (
          <p>{message}</p>
        ) : (
          <p>
            Sorry, there was an issue processing your payment for order #
            {orderDetails?.order_no}. You can retry the payment below.
          </p>
        )}
        <p className="font-semibold mt-2">
          Note:{" "}
          <span className="font-normal">
            Your order has been placed but payment is pending. Please complete
            the payment to confirm your order.
          </span>
        </p>
      </div>

      {/* Order Information */}
      <div className="border border-gray-200 rounded-lg p-6 mb-4">
        <h2 className="text-xl font-semibold text-center mb-4 text-gray-900">
          Order Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-gray-600 font-medium">Order Number</p>
            <p className="text-gray-900">{orderDetails?.order_no}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 font-medium">Order Date</p>
            <p className="text-gray-900">{orderDetails?.order_date}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 font-medium">Payment Method</p>
            <p className="text-gray-900">{orderDetails?.payment_method}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 font-medium">Payment Status</p>
            <p className="text-red-500">
              {orderDetails?.status === "PAYMENT_PENDING"
                ? "Payment Pending"
                : "Failed"}
            </p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="border border-gray-200 rounded-lg p-6 mb-4">
        <h2 className="text-xl font-semibold text-center mb-4 text-gray-900">
          Order Items
        </h2>
        {orderDetails?.items?.map((item) => (
          <div
            key={item?.item_id}
            className="flex flex-col md:flex-row items-center justify-center gap-6 mb-4"
          >
            <div className="w-24 h-24 flex-shrink-0">
              <img
                src={item?.image || "/placeholder.svg"}
                alt={item?.product_name}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-center md:text-left">
              <h3 className="font-medium text-gray-900">
                {item?.product_name}
              </h3>
              <p className="text-gray-600">
                Color: {item?.variant?.color} | Size: {item?.variant?.size} |
                Qty: {item?.quantity}
              </p>
              <p className="font-semibold text-gray-900 mt-1">
                ₹{item?.price?.toLocaleString("en-IN")}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Status: {item?.status}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Delivery Address */}
      <div className="border border-gray-200 rounded-lg p-6 mb-4">
        <h2 className="text-xl font-semibold text-center mb-4 text-gray-900">
          Delivery Address
        </h2>
        <p className="text-center text-gray-600">
          {orderDetails?.address?.name}, {orderDetails?.address?.city},{" "}
          {orderDetails?.address?.state}, {orderDetails?.address?.country}
        </p>
      </div>

      {/* Price Details */}
      <div className="mb-6 rounded-lg border border-gray-200 p-6">
        <h2 className="mb-4 text-center text-xl font-semibold text-gray-800">
          Price Details
        </h2>
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

          <div className="border-t border-gray-200 pt-2">
            <div className="flex justify-between font-semibold">
              <span>Final Amount:</span>
              <span>
                {currency}
                {orderDetails?.final_amount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button
          onClick={handleRetryPayment}
          disabled={isRetrying}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white py-2 px-6 rounded-md font-medium transition-colors"
        >
          {isRetrying ? "Processing..." : "Retry Payment"}
        </button>
        <button
          onClick={handleBackToOrders}
          className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded-md font-medium transition-colors"
        >
          Back to Orders
        </button>
      </div>
    </div>
  );
};

export default PaymentFailed;
