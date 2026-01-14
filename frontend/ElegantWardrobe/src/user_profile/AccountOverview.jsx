import React, { useEffect } from "react";
import { Facebook, Twitter, Linkedin, Instagram, Edit } from "lucide-react";
import { assets } from "@/assets/assets";
import api from "@/api";
import { Link } from "react-router-dom";

const AccountOverview = () => {
  const [userData, setUserData] = React.useState({});

  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await api.get("/user_profile/");
        setUserData(res.data);
        console.log(res.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    getUserData();
  }, []);
  const showData = () => {
    console.log(userData);
  };
  return (
    <div className="min-h-screen bg-white">
  

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 md:px-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile</h2>

        {/* Profile Card */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <img
                // profile picture
                src={
                  userData.profile_picture
                    ? userData.profile_picture
                    : assets.dummy_image
                }
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
              <div className="ml-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {userData.first_name} {userData.last_name}
                </h3>
                <div className="flex flex-col md:flex-row md:items-center text-gray-600 mt-1">
                  
                  {userData.address ? (
                    <span>
                      {userData?.address?.city},{userData?.address?.state},
                      {userData?.address?.country}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="flex items-center mt-4 md:mt-0 md:ml-auto space-x-3">
              <Link
                to="/profile/edit-profile-picture"
                state={{ user: userData }}
              >
                <button className="ml-2 flex items-center justify-center px-4 py-2 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50">
                  <Edit className="w-4 h-4 mr-2" />
                  Update Profile Picture
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Personal Information
            </h3>
            <Link to="/profile/edit-profile">
              <button className="flex items-center justify-center px-4 py-2 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">First Name</p>
              <p className="text-gray-900">{userData.first_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Last Name</p>
              <p className="text-gray-900">{userData.last_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Email address</p>
              <p className="text-gray-900">{userData.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Phone</p>
              <p className="text-gray-900">{userData.phone_number}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AccountOverview;
