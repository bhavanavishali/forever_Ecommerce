import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Collection from "./pages/Collection";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import PlaceOrder from "./pages/PlaceOrder";
import Product from "./pages/Product";
import { ToastContainer } from "react-toastify";
import UserLayout from "./pages/UserLayout";
import AdminLayout from "./admin/components/AdminLayout";
import AdminAdd from "./admin/pages/AdminAdd";
import AdminList from "./admin/pages/AdminList";
import AdminOrders from "./admin/pages/AdminOrders";
import Registration from "./pages/Registration";
import AdminUsers from "./admin/pages/AdminUsers";
import AdminUserEdit from "./admin/pages/AdminUserEdit";
import AdminProducts from "./admin/pages/AdminProducts";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import AdminCategory from "./admin/pages/AdminCategory";
import CategoryEdit from "./admin/pages/CategoryEdit";
import AdminEditProduct from "./admin/pages/AdminEditProduct";
import UserProfileLayout from "./user_profile/UserProfileLayout";
import AccountOverview from "./user_profile/AccountOverview";
import ManageAddress from "./user_profile/ManageAddress";
import Wallet from "./user_profile/Wallet";
import ManagePassword from "./user_profile/ManagePassword";
import EditProfile from "./user_profile/EditProfile";
import AddAddress from "./user_profile/AddAddress";
import EditAddress from "./user_profile/EditAddress";
import OrderConfirmation from "./pages/OrderConfirmation";
import AdminLogin from "./admin/pages/AdminLogin";
import { ADMIN_ACCESS_TOKEN } from "./constants";
import AdminPrivateRoute from "./admin/components/AdminPrivateRoute";
import OrderDetails from "./pages/OrderDetails";
import AdminOrderDetailsPage from "./admin/pages/AdminOrderDetailsPage";
import WishList from "./pages/WishList";
import EditProfilePicture from "./user_profile/EditProfilePicture";
import PaymentFailed from "./pages/PaymentFailed";
import CouponManager from "./admin/pages/CouponManager";
import AdminDashboard from "./admin/pages/AdminDashBoard";
import ForgotPasswordOtpVerificationForm from "./components/ForgotPasswordOtpVerificationForm";
import ForgotPasswordSentOtpForm from "./components/ForgotPasswordSentOtpForm";
import ForgotPasswordForm from "./components/ForgotPasswordForm";
import AdminOfferPage from "./admin/offer/pages/AdminOffer";
import ProductOfferPage from "./admin/offer/pages/ProductOfferPage";
import CategoryOfferPage from "./admin/offer/pages/CategoryOfferPage";
import AddProductOffer from "./admin/offer/pages/AddProductOffer";
import EditProductOffer from "./admin/offer/pages/EditProductOffer";
import AddCategoryOffer from "./admin/offer/pages/AddCategoryOffer";
import EditCategoryOffer from "./admin/offer/pages/EditCategoryOffer";
import AddReviewRating from "./pages/AddReviewRating";
import Logout from "./pages/Logout";
import Error404Page from "./Error404page";

const App = () => {
  const [token, setToken] = useState("");

  useEffect(() => {
    setToken(localStorage.getItem(ADMIN_ACCESS_TOKEN));
  }, []);
  return (
    <div>
      <ToastContainer />
      <Routes>
        {/* User Layout Structure */}
        <Route path="/" element={<UserLayout />}>
          <Route
            path="login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route path="" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route
            path="cart"
            element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            }
          />
          <Route
            path="collection"
            element={
              <PrivateRoute>
                <Collection />
               </PrivateRoute>
            }
          />
          <Route path="contact" element={<Contact />} />
          <Route path="register" element={<Registration />} />
          <Route
            path="orders"
            element={
              <PrivateRoute>
                <Orders />
              </PrivateRoute>
            }
          />
          <Route
            path="place-order"
            element={
              <PrivateRoute>
                <PlaceOrder />
              </PrivateRoute>
            }
          />
          <Route
            path="product/:productId"
            element={
              <PrivateRoute>
                <Product />
               </PrivateRoute>
            }
          />
          <Route
            path="order-details"
            element={
              <PrivateRoute>
                <OrderDetails />
              </PrivateRoute>
            }
          />
          <Route path="order-success" element={<OrderConfirmation />} />
          {/* <Route path="invoice" element={<InvoiceComponent/>}/> */}
          <Route
            path="wishlist"
            element={
              <PrivateRoute>
                <WishList />
              </PrivateRoute>
            }
          />
          <Route
            path="add-review-ratings"
            element={
              <PrivateRoute>
                <AddReviewRating />
              </PrivateRoute>
            }
          />
          <Route path="payment-failed" element={<PaymentFailed />} />
          <Route path="forgot-password-sent-otp-form" element={<ForgotPasswordSentOtpForm/>}/>
          <Route path="forgot-password-otp-verification" element={<ForgotPasswordOtpVerificationForm/>}/>
          <Route path="forgot-password" element={<ForgotPasswordForm/>}/>
          <Route path = "logout" element = {<Logout/>}/>
        </Route>

        <Route path="profile" element={<PrivateRoute><UserProfileLayout /></PrivateRoute>}>
          <Route path="" element={<AccountOverview />} />
          <Route path="my-orders" element={<Orders />} />
          <Route path="manage-address" element={<ManageAddress />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="manage-password" element={<ManagePassword />} />
          <Route path="wishlist" element={<WishList />} />
          <Route path="edit-profile" element={<EditProfile />} />
          <Route path="add-address" element={<AddAddress />} />
          <Route path="edit-address" element={<EditAddress />} />
          <Route path="edit-profile-picture" element={<EditProfilePicture />} />
        </Route>
        {/* Admin Routes */}
        <Route path="/admin">
          <Route
            path=""
            element={
              <AdminPrivateRoute>
                <AdminLayout />
              </AdminPrivateRoute>
            }
          >
            <Route path="add-product" element={<AdminAdd />} />
            <Route path="edit-product" element={<AdminEditProduct />} />
            <Route path="list" element={<AdminList />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="edit-user" element={<AdminUserEdit />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategory />} />
            <Route path="category-edit" element={<CategoryEdit />} />
            <Route path="order-details" element={<AdminOrderDetailsPage />} />
            <Route path="" element={<AdminDashboard/>} />
            <Route path="coupon-management" element={<CouponManager />} />

            {/* offer */}
            <Route path="offer" element={<AdminOfferPage/>}>
              <Route path="product-offer" element={<ProductOfferPage/>}/>
              <Route path="category-offer" element={<CategoryOfferPage/>}/>
              <Route path="add-product-offer" element={<AddProductOffer/>}/>
              <Route path="add-category-offer" element={<AddCategoryOffer/>}/>
              <Route path="edit-product-offer" element={<EditProductOffer/>}/>
              <Route path="edit-category-offer" element={<EditCategoryOffer/>}/>
            </Route>

          </Route>
          {/* )}  */}
        </Route>

        {/* Admin Login Route */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="*" element={<Error404Page />} />
      </Routes>
    </div>
  );
};

export default App;
