import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { USER_ACCESS_TOKEN, USER_REFRESH_TOKEN } from "../constants";
import api from "@/api";
import ConfirmModal from "@/ConfirmModal";

const Navbar = () => {
  const [visisble, setVisible] = useState(false);
  const {
    setShowSearch,
    cartCount,
    wishListCount,
    isAuthenticated,
    setIsAuthenticated,
  } = useContext(ShopContext);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleLogout = async () => {
    try {
      const res = await api.post("/logout/");
      setIsAuthenticated(false);
      setIsModalOpen(false);
      navigate("/login");
    } catch (error) {
      console.log("error in logout");
    }
  };

  useEffect(() => {
    const getResponse = async () => {
      try {
        const res = await api.get("/check-auth/");
        if (res.status === 200) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getResponse();
  }, []);

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <Link to="/">
        <img src={assets.logo} className="w-36" alt="" />
      </Link>
      <ul className="hidden sm:flex gap-5 text-sm text-grey-700">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>HOME</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>COLLECTION</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>ABOUT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>CONTACT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>
      <div className="flex items-center gap-6">
        {!isAuthenticated ? (
          <span>
            <button onClick={()=>{navigate('/login')}}>Login</button>
          </span>
        ) : null}
        <img
          onClick={() => {
            setShowSearch(true);
          }}
          src={assets.search_icon}
          className="w-5 cursor-pointer "
          alt=""
        />

        {/* Logout */}

        {isAuthenticated ? (
          <>
            <div className="group relative">
              <Link to={""}>
                <img
                  className="w-5 cursor-pointer"
                  src={assets.profile_icon}
                  alt=""
                />
              </Link>
              <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
                <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                  <Link
                    to="/profile"
                    className="cursor-pointer hover:text-black"
                  >
                    <p>My Profile</p>
                  </Link>
                  <p
                    onClick={() => {
                      navigate("/orders");
                    }}
                    className="cursor-pointer hover:text-black"
                  >
                    Orders
                  </p>
                  <p
                    onClick={() => {
                      setIsModalOpen(true);
                      setModalMessage("Are you sure to want to Logout");
                    }}
                    className="cursor-pointer hover:text-black"
                  >
                    Logout
                  </p>
                </div>
              </div>
            </div>

            <Link to="/wishlist" className="relative">
              <svg
                // onClick={onClick}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ cursor: "pointer" }}
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <p className="absolute bottom-[-5px] right-[-5px] w-4 text-center leading-4 bg-block text-white aspect-square rounded-full text-[8px] bg-black">
                {wishListCount}
              </p>
            </Link>
            <Link to="/cart" className="relative">
              <img src={assets.cart_icon} className="w-5 min-w-5" alt="" />
              <p className="absolute bottom-[-5px] right-[-5px] w-4 text-center leading-4 bg-block text-white aspect-square rounded-full text-[8px] bg-black">
                {cartCount}
              </p>
            </Link>
          </>
        ) : null}

        <img
          onClick={() => {
            setVisible(true);
          }}
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden"
          alt=""
        />
      </div>

      {/* Sidebar Menu For Small Screen */}
      <div
        className={`absolute top-0 right-0 bottom-0 bg-white overflow-hidden transition-all ${
          visisble ? "w-full" : "w-0"
        }`}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => {
              setVisible(false);
            }}
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <img src={assets.dropdown_icon} className="h-4 rotate-180" alt="" />
            <p>Back</p>
          </div>
          <NavLink
            onClick={() => {
              setVisible(false);
            }}
            className="py-2 pl-6 border"
            to="/"
          >
            HOME
          </NavLink>
          <NavLink
            onClick={() => {
              setVisible(false);
            }}
            className="py-2 pl-6 border"
            to="/collection"
          >
            COLLECTION
          </NavLink>
          <NavLink
            onClick={() => {
              setVisible(false);
            }}
            className="py-2 pl-6 border"
            to="/about"
          >
            ABOUT
          </NavLink>
          <NavLink
            onClick={() => {
              setVisible(false);
            }}
            className="py-2 pl-6 border"
            to="/contact"
          >
            CONTACT
          </NavLink>
        </div>
      </div>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleLogout}
        message={modalMessage}
      />
    </div>
  );
};

export default Navbar;
