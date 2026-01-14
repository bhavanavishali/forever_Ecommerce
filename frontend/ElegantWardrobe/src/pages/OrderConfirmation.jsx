import api from "@/api";
import { ShopContext } from "@/context/ShopContext";
import { Check } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import Image from "next/image"

export default function OrderConfirmation() {
  const {currency} = useContext(ShopContext)
  const [orderDetails, setOrderDetails] = useState({});
  const location = useLocation();
  const { orderId,discount } = location.state;
  const navigate = useNavigate()

  // Prevent back navigation
  useEffect(() => {
    const handleBackButton = (event) => {
      event.preventDefault();
      // Redirect to a safe page, e.g., /orders or /collection
      navigate("/collection", { replace: true });
    };

    window.history.pushState(null, null, window.location.href);
    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [navigate]);


  useEffect(() => {
    const getOrderDetails = async () => {
      try {
        const res = await api.get(`/order_details/${orderId}/`);
        console.log(res.data);
        
        setOrderDetails(res.data);
      } catch (error) {}
    };
    getOrderDetails();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-8">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500">
              <Check className="h-8 w-8 text-white" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-gray-800 md:text-3xl">
              Thank you for your order!
            </h1>
            <p className="text-gray-600">
              Your order has been successfully placed and confirmed. We'll send
              you a shipping confirmation email once your order ships.
            </p>
          </div>

          {/* Order Information */}
          <div className="mb-6 rounded-lg border border-gray-200 p-6">
            <h2 className="mb-4 text-center text-xl font-semibold text-gray-800">
              Order Information
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="text-center">
                <p className="mb-1 text-sm font-medium text-gray-600">
                  Order Number
                </p>
                <p className="text-gray-800">{orderDetails.order_no}</p>
              </div>
              <div className="text-center">
                <p className="mb-1 text-sm font-medium text-gray-600">
                  Order Date
                </p>
                <p className="text-gray-800">
                  {orderDetails.order_date}, 3:27 pm
                </p>
              </div>
              <div className="text-center">
                <p className="mb-1 text-sm font-medium text-gray-600">
                  Payment Method
                </p>
                <p className="text-gray-800">{orderDetails.payment_method}</p>
              </div>
              <div className="text-center">
                <p className="mb-1 text-sm font-medium text-gray-600">
                  Payment Status
                </p>
                <p className="text-gray-800">{orderDetails.payment_status}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6 rounded-lg border border-gray-200 p-6">
            <h2 className="mb-4 text-center text-xl font-semibold text-gray-800">
              Order Items
            </h2>

                {orderDetails.items?.map((item, index) => (
                <div key={index} className="flex flex-col items-center justify-center">
                    <div className="mb-2 flex items-center justify-center">
                    <img
                        src={item.image || "fallback.jpg"}
                        alt="Product"
                        className="w-40 h-auto"
                    />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800">
                    {item.product_name}
                    </h3>
                    <p className="text-sm text-gray-600">
                    Color: {item.variant?.color || "N/A"} | Qty: {item.quantity}
                    </p>
                    <p className="mt-1 text-lg font-semibold">{item.price}</p>
                </div>
                ))}

          </div>

          {/* Delivery Address */}
          <div className="mb-6 rounded-lg border border-gray-200 p-6">
            <h2 className="mb-4 text-center text-xl font-semibold text-gray-800">
              Delivery Address
            </h2>
            <p className="text-center text-gray-800">
              {orderDetails.address?.name}, {orderDetails.address?.city}, {orderDetails.address?.state} - {orderDetails.address?.pin_code}
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
                <span className="text-gray-800">{currency}{orderDetails.total_price}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Total Discount:</span>
                <span className="text-gray-800">{currency}{orderDetails.total_discount}</span>
              </div>
             {
              orderDetails.coupon_discount?
               <div className="flex justify-between">
                <span className="text-gray-600">Coupon Discount:</span>
                <span className="text-gray-800">{orderDetails.coupon_discount}%</span>
              </div>
              :null
             }

              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between font-semibold">
                  <span>Final Amount:</span>
                  <span>{currency}{orderDetails?.final_amount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0">
            <button onClick={()=>{navigate('/orders')}} className="rounded-md bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              View Order Details
            </button>
            <button onClick={()=>{navigate('/collection')}} className="rounded-md bg-gray-600 px-6 py-2 text-white transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
