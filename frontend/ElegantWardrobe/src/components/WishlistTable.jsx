"use client";

import api from "@/api";
import ConfirmModal from "@/ConfirmModal";
import { useState } from "react";
import { toast } from "react-toastify";

const WishlistTable = ({
  items,
  onRemove,
  onAddToCart,
  currency,
  handleDeleteClick,
  handleConfirmDelete,
  handleCancel,
  isModalOpen,
  isAddToCartModalOpen,
  handleConfirmAddToCart,
  handleAddToCartClick,
  setIsAddToCartModalOpen
}) => {
  return (
    <div className="w-full overflow-x-auto">
      {/* Header - Desktop */}
      <div className="hidden md:grid md:grid-cols-6 border-b py-4 px-4 text-gray-600">
        <div className="col-span-1">Product Image</div>
        <div className="col-span-1">Product Name</div>
        <div className="col-span-1 text-center">Unit Price</div>
        <div className="col-span-1 text-center">Size</div>
        <div className="col-span-1 text-center">Color</div>
        <div className="col-span-1 text-center">Actions</div>
      </div>

      {/* Items */}
      <div className="divide-y">
        {items.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-2 md:grid-cols-6 py-4 items-center"
          >
            {/* Product Image and Name */}

            <div className="relative">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                className="w-20 h-24 object-cover bg-gray-100"
              />
              <span className="text-red-700">{item.stock_quantity<=0?'out of stock':null}</span>
            </div>
            <div className="ml-2">
              <h3 className="text-gray-700">{item.name}</h3>
            </div>

            {/* Price */}
            <div className="text-right md:text-center px-4 md:px-0">
              {item.originalPrice && item.originalPrice > item.price ? (
                <div>
                  <span className="text-gray-400 line-through mr-2">
                    €{item.originalPrice.toFixed(2)}
                  </span>
                  <span className="text-gray-700">
                    €{item.price.toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="text-gray-700">
                  {currency}
                  {item.price.toFixed(2)}
                </span>
              )}
            </div>
            {/* size */}
            <div className="text-right md:text-center px-4 md:px-0 text-gray-600 mt-2 md:mt-0">
              {item.size}
            </div>

            {/* color */}
            <div className="text-right md:text-center px-4 md:px-0 text-gray-600 mt-2 md:mt-0">
              {item.color}
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={() =>
                  handleAddToCartClick(
                    item.variant_id,
                    item.size,
                    item.color,
                    item.quantity || 1
                  )
                }
                disabled={!item.stock_quantity>0?true:false}
                className={`w-full md:w-auto bg-black text-white py-2 px-4 uppercase text-sm tracking-wider hover:bg-gray-700${!item.stock_quantity > 0?'disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:opacity-60 transition-colors duration-200':null}`}
              >
                ADD TO CART
              </button>
              <button
                onClick={() => handleDeleteClick(item.variant_id)}
                className="w-full md:w-auto bg-red-600 text-white py-2 px-4 uppercase text-sm tracking-wider hover:bg-red-800"
              >
                x
              </button>

              <ConfirmModal
                isOpen={isModalOpen}
                onClose={handleCancel}
                onConfirm={handleConfirmDelete}
                message="Are you sure you want to delete this user?"
              />

              <ConfirmModal
                isOpen={isAddToCartModalOpen}
                onClose={() => setIsAddToCartModalOpen(false)}
                onConfirm={handleConfirmAddToCart}
                message="Are you sure you want to add this item to cart?"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistTable;
