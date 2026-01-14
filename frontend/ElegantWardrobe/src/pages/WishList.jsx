import api from "@/api";
import WishlistTable from "@/components/WishlistTable";
import Title from "@/components/Title";
import { ShopContext } from "@/context/ShopContext";
import { Rss } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const WishList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWishListId, setSelectedWishListId] = useState(null);
  const [isAddToCartModalOpen, setIsAddToCartModalOpen] = useState(false);
  const [selectedCartItem, setSelectedCartItem] = useState(null);
  const {
    currency,
    wishlistItems,
    isAddToCart,
    setIsAddToCart,
    isChangeWishList,
    setIsChangeWishList,
  } = useContext(ShopContext);

  // // The below 3 function is for wishlist delete confirmation modal

  console.log(wishlistItems);

  const handleDeleteClick = (wishListId) => {
    setSelectedWishListId(wishListId);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    // Call your API to delete user here
    try {
      const res = await api.delete(
        `/remove_from_wishlist/${selectedWishListId}/`
      );
      toast.success(res.data.message);
      setIsChangeWishList(!isChangeWishList);
      setIsModalOpen(false);
      setSelectedWishListId(null);
    } catch (error) {
      console.log(error);
    }
    // After delete
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedWishListId(null);
  };

  // Handle Add to Cart Click (open modal)
  const handleAddToCartClick = (itemId, size, color, quantity = 1) => {
    if (!size) {
      toast.error("Select the product size");
      return;
    } else if (!color) {
      toast.error("Select the product color");
      return;
    }
    setSelectedCartItem({ itemId, size, color, quantity });
    setIsAddToCartModalOpen(true);
  };

  // Confirm Add to Cart
  const handleConfirmAddToCart = async () => {
    const { itemId, size, color, quantity } = selectedCartItem;
    try {
      const res = await api.post(`/add_to_cart/`, {
        product_variant: itemId,
        size,
        color,
        quantity,
      });
      toast.success(res.data);
      setIsAddToCart(!isAddToCart);
    } catch (error) {
      if (error?.response?.data?.error) {
        const match = error?.response?.data?.error?.match(/'([^']+)'/);
        const cleanMessage = match ? match[1] : error?.response?.data?.error;
        toast.error(cleanMessage || "Add to cart failed");
        return;
      } else if (error?.response?.data) {
        toast.error(error?.response?.data);
        return;
      } else {
        console.log(error);
      }

      const match = error?.response?.data?.error?.match(/'([^']+)'/);
      const cleanMessage = match ? match[1] : error?.response?.data?.error;
      toast.error(cleanMessage || "Add to cart failed");
    } finally {
      setIsAddToCartModalOpen(false);
      setSelectedCartItem(null);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {wishlistItems.length > 0 ? (
        <>
          <div className="text-2xl mb-3">
            <Title text1={"YOUR"} text2={"WISHLIST"} />
          </div>
          <WishlistTable
            items={wishlistItems}
            currency={currency}
            handleDeleteClick={handleDeleteClick}
            handleConfirmDelete={handleConfirmDelete}
            handleCancel={handleCancel}
            isModalOpen={isModalOpen}
            isAddToCartModalOpen={isAddToCartModalOpen}
            handleAddToCartClick={handleAddToCartClick}
            handleConfirmAddToCart={handleConfirmAddToCart}
            setIsAddToCartModalOpen={setIsAddToCartModalOpen}
          />
        </>
      ) : (
        <h1 className="text-gray-400 border border-gray-400 inline-block p-2 rounded">
          No items in the WishList
        </h1>
      )}
    </div>
  );
};

export default WishList;
