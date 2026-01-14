import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import { useNavigate } from "react-router-dom";
import Pagination from "@/components/Pagination";
import ConfirmModal from "@/ConfirmModal";

const Cart = () => {
  const {
    currency,
    cartData,
    totalPrice,
    totalDiscount,
    quantity,
    setQuantity,
    setCartId,
    removeCartItem,
    activePage,
    setActivePage,
    hasNext,
    hasPrevious,
    totalPages,
    cartError,
  } = useContext(ShopContext);


  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productId, setProductId] = useState(null);
  const handleConfirmDeleteCartItem = () => {
    removeCartItem(productId);
    setIsModalOpen(false);
  };

  return (
    <>
      {cartData.length > 0 ? (
        <div className="border-t pt-14">
          <div className="text-2xl mb-3">
            <Title text1={"YOUR"} text2={"CART"} />
          </div>

          <div className="max-w-6xl mx-auto p-4">
            {cartData.map((productData) => (
              <div
                key={productData.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200"
              >
                {/* Mobile Layout */}
                <div className="block lg:hidden">
                  <div className="flex gap-4 mb-4">
                    <div className="flex-shrink-0">
                      <img
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md border border-gray-200"
                        src={productData.image}
                        alt={productData.name}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 line-clamp-2">
                        {productData.name}
                      </h3>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg font-bold text-gray-900">
                          {currency} {productData.actual_price}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md">
                          {productData.size}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => {
                          removeCartItem(productData.id);
                        }}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200"
                      >
                        <img
                          className="w-5 h-5"
                          src={assets.bin_icon}
                          alt="Remove"
                        />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Discount
                      </label>
                      <p className="text-sm font-semibold text-green-600">
                        -{currency} {productData.discount_offer}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Final Price
                      </label>
                      <p className="text-sm font-semibold text-gray-900">
                        {currency}{" "}
                        {productData.actual_price - productData.discount_offer}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity
                      </label>
                      <div className="flex items-center">
                        <input
                          onChange={(e) => {
                            setCartId(productData.id);
                            setQuantity(e.target.value);
                          }}
                          className="w-20 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
                          type="number"
                          min={1}
                          max={5}
                          value={
                            !cartError
                              ? productData.quantity
                              : productData.quantity
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Total
                      </label>
                      <p className="text-lg font-bold text-blue-600">
                        {currency}{" "}
                        {(productData.actual_price -
                          productData.discount_offer) *
                          productData.quantity}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden lg:grid lg:grid-cols-12 lg:gap-4 lg:items-center">
                  {/* Product Info - 4 columns */}
                  <div className="col-span-3">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <img
                          className="w-20 h-20 object-cover rounded-md border border-gray-200"
                          src={productData.image}
                          alt={productData.name}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
                          {productData.name}
                        </h3>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-gray-900">
                            {currency} {productData.actual_price}
                          </span>
                          <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-700 rounded-md">
                            {productData.size}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Discount - 2 columns */}

                  <div className="col-span-1 text-center">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Discount%
                    </label>
                    <p className="text-base font-semibol">
                      {currency} {productData.discount_percentage}%
                    </p>
                  </div>
                  <div className="col-span-2 text-center">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Discount
                    </label>
                    <p className="text-base font-semibold text-green-600">
                      -{currency} {productData.discount_offer}
                    </p>
                  </div>

                  {/* Discounted Price - 2 columns */}
                  <div className="col-span-2 text-center">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Discounted Amount
                    </label>
                    <p className="text-base font-semibold text-gray-900">
                      {currency}{" "}
                      {productData.actual_price - productData.discount_offer}
                    </p>
                  </div>

                  {/* Quantity - 2 columns */}
                  <div className="col-span-2 text-center">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Quantity
                    </label>
                    <div className="flex justify-center">
                      <input
                        onChange={(e) => {
                          setCartId(productData.id);
                          setQuantity(e.target.value);
                        }}
                        className="w-20 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
                        type="number"
                        min={1}
                        max={5}
                        value={
                          !cartError
                            ? productData.quantity
                            : productData.quantity
                        }
                      />
                    </div>
                  </div>

                  {/* Total - 1.5 columns */}
                  <div className="col-span-1 text-center">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Total
                    </label>
                    <p className="text-lg font-bold text-blue-600">
                      {currency}{" "}
                      {(productData.actual_price - productData.discount_offer) *
                        productData.quantity}
                    </p>
                  </div>

                  {/* Remove Button - 0.5 columns */}
                  <div className="col-span-1 flex justify-center">
                    <button
                      onClick={() => {
                        setIsModalOpen(true);
                        setProductId(productData.id);
                        // removeCartItem(productData.id);
                      }}
                      className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200 group"
                    >
                      <img
                        className="w-5 h-5 group-hover:scale-110 transition-transform duration-200"
                        src={assets.bin_icon}
                        alt="Remove item"
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end my-20">
            <div className="w-full sm:w-[450px]">
              <CartTotal
                totalPrice={totalPrice}
                totalDiscount={totalDiscount}
              />
              <div className="w-full text-end">
                <button
                  onClick={() => {
                    navigate("/place-order");
                  }}
                  className="bg-black text-white text-sm my-8 px-8 py-3"
                >
                  PROCEED TO CHECKOUT
                </button>
              </div>
            </div>
          </div>
          <Pagination
            activePage={activePage}
            setActivePage={setActivePage}
            hasNext={hasNext}
            hasPrevious={hasPrevious}
            totalPages={totalPages}
          />

          <ConfirmModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleConfirmDeleteCartItem}
            message="Are you sure you want to delete this item from cart?"
          />
        </div>
      ) : (
        <h1 className="text-gray-400 border border-gray-400 inline-block p-2 rounded">
          No items in the cart
        </h1>
      )}
    </>
  );
};

export default Cart;

