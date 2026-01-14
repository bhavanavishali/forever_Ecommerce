import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api"; // Make sure this path is correct

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "₹";
  const delivery_fee = 100;

  // product
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // cart
  const [cartItems, setCartItems] = useState({});
  const [cartCount, setCartCount] = useState(0);
  const [isRomoveCartItem, setIsRomoveCartItem] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [cartData, setCartData] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [cartId, setCartId] = useState(0);
  const [isChangeQuantity, setIsChangeQuantity] = useState(false);
  const [isAddToCart, setIsAddToCart] = useState(false);

  // wishlist
  const [wishlistItems, setWishListItems] = useState([]);
  const [isChangeWishList, setIsChangeWishList] = useState(false);
  const [wishListCount, setWishListCount] = useState(0);

  const [activePage, setActivePage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [cartError, setCartError] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/check-auth/");
        if (res.status === 200) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        // User is not authenticated - this is normal for public pages
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);
  
  // Fetch products when ShopContextProvider mounts
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        // Remove withCredentials from individual requests since it's set globally
        const res = await api.get("/products/");
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error.message);
      }
    };
    fetchAllProducts();
  }, []);

  useEffect(() => {
    const updateCart = async () => {
      if (cartId !== 0) {
        try {
          // Remove withCredentials - it's already set in the instance
          const res = await api.put(`/update_cart/${cartId}/`, { 
            quantity: quantity 
          });

          setIsChangeQuantity(!isChangeQuantity);
          setCartError(false);
        } catch (error) {
          setCartError(true);
          const errorData = error?.response?.data;

          if (errorData?.error) {
            const cleanMessage = Array.isArray(errorData.error)
              ? errorData.error[0]
              : errorData.error;

            console.log(cleanMessage);
            toast.error(cleanMessage);
          } else {
            toast.error("Failed to update cart.");
          }
        }
      }
    };
    updateCart();
  }, [quantity]);

  // useEffect for get all cart product
  useEffect(() => {
    const getCartDatas = async () => {
      // Skip if user is not authenticated
      if (!isAuthenticated) {
        return;
      }
      
      try {
        // Remove withCredentials from individual requests
        const res = await api.get("/get_all_cart_products/", {
          params: { page: activePage }
        });

        // Check if response is HTML (indicates API misconfiguration)
        if (typeof res.data === 'string' && res.data.trim().startsWith('<!')) {
          console.error("API returned HTML instead of JSON. Backend may not be running or VITE_API_BASE_URL is incorrect.");
          return; // Exit early to prevent further errors
        }

        // Check if cart_data exists and has the expected structure
        if (res.data?.cart_data) {
        console.log(res.data.cart_data.results);

          setCartData(res.data.cart_data.results || []);
          setHasNext(res.data.cart_data.has_next || false);
          setHasPrevious(res.data.cart_data.has_previous || false);
          setTotalPages(res.data.cart_data.total_pages || 0);
          setTotalPrice(res.data.total_price || 0);
          setTotalDiscount(res.data.total_discount || 0);
          setCartCount(res.data.cart_count || 0);
        } else {
          // Handle case where cart_data is not in the response
          console.warn("Cart data structure unexpected:", res.data);
          setCartData([]);
          setHasNext(false);
          setHasPrevious(false);
          setTotalPages(0);
          setTotalPrice(0);
          setTotalDiscount(0);
          setCartCount(0);
        }
      } catch (error) {
        // Don't log errors for unauthenticated users (401/403)
        if (error?.response?.status !== 401 && error?.response?.status !== 403) {
        console.log("error fetching cart data:", error);
        }
        // Reset cart data on error
        setCartData([]);
        setHasNext(false);
        setHasPrevious(false);
        setTotalPages(0);
        setTotalPrice(0);
        setTotalDiscount(0);
        setCartCount(0);
      }
    };
    getCartDatas();
  }, [quantity, isRomoveCartItem, isChangeQuantity, isAddToCart, activePage, isAuthenticated]);

  // useEffect for get all wishlist product
  useEffect(() => {
    const getWishListItems = async () => {
      // Skip if user is not authenticated
      if (!isAuthenticated) {
        return;
      }
      
      try {
        // Remove withCredentials from individual requests
        const res = await api.get("/get_all_wishlist_products/");

        if (res.data) {
          setWishListItems(res.data.wishlist_data || []);
          setWishListCount(res.data.wishlist_count || 0);
        }
      } catch (error) {
        // Don't log errors for unauthenticated users (401/403)
        if (error?.response?.status !== 401 && error?.response?.status !== 403) {
        console.log("error fetching wishlist:", error);
        }
        // Reset wishlist on error
        setWishListItems([]);
        setWishListCount(0);
      }
    };
    getWishListItems();
  }, [isAddToCart, isChangeWishList, isAuthenticated]);

  const removeCartItem = async (id) => {
    try {
      // Remove withCredentials from individual requests
      const res = await api.delete(`/remove_cartitem/${id}/`);

      setIsRomoveCartItem(!isRomoveCartItem);
      toast.success(res.data);
    } catch (error) {
      console.log("error removing cart item:", error);
      toast.error("Failed to remove item from cart");
    }
  };

  const value = {
    products,
    setProducts,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartData,
    totalPrice,
    totalDiscount,
    quantity,
    setQuantity,
    setCartId,
    removeCartItem,
    isRomoveCartItem,
    setIsRomoveCartItem,
    cartCount,
    isChangeQuantity,
    setIsChangeQuantity,
    isAddToCart,
    setIsAddToCart,
    activePage,
    setActivePage,
    hasNext,
    hasPrevious,
    totalPages,
    wishlistItems,
    setWishListItems,
    isChangeWishList,
    setIsChangeWishList,
    wishListCount,
    cartError,
    isAuthenticated,
    setIsAuthenticated,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;