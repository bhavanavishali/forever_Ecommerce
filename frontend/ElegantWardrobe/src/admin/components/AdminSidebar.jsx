
import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets as admin_assets } from '../admin_assets/assets'
import { assets as user_assets } from '../../assets/assets'
import AdminLogout from './AdminLogout'

const AdminSidebar = () => {
  const navLinkClass = ({ isActive }) => 
    `flex items-center gap-4 px-4 py-3 mx-2 rounded-lg transition-all duration-300 ease-in-out group ${
      isActive 
        ? 'bg-black text-white shadow-lg transform scale-105' 
        : 'text-gray-700 hover:bg-blue-50 hover:text-black hover:shadow-md hover:transform hover:scale-105'
    }`

  return ( 
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white shadow-xl border-r border-gray-200'>
      <div className='p-6'>
        {/* Header/Logo Area */}
        <div className='mb-8 pb-6 border-b border-gray-200'>
          <h2 className='text-2xl font-bold text-gray-800 text-center'>Admin Panel</h2>
        </div>

        {/* Navigation Links */}
        <nav className='space-y-2'>
          <NavLink to={''} className={navLinkClass}>
            <div className='flex items-center justify-center w-8 h-8 rounded-md bg-blue-100 group-hover:bg-blue-200 transition-colors duration-300'>
              <img className='w-5 h-5' src={admin_assets.order_icon} alt="Dashboard" />
            </div>
            <span className='font-medium text-sm md:text-base hidden md:block'>Dashboard</span>
          </NavLink>

          <NavLink to={'products'} className={navLinkClass}>
            <div className='flex items-center justify-center w-8 h-8 rounded-md bg-green-100 group-hover:bg-green-200 transition-colors duration-300'>
              <img className='w-5 h-5' src={admin_assets.order_icon} alt="Products" />
            </div>
            <span className='font-medium text-sm md:text-base hidden md:block'>Products</span>
          </NavLink>

          <NavLink to={'users'} className={navLinkClass}>
            <div className='flex items-center justify-center w-8 h-8 rounded-md bg-purple-100 group-hover:bg-purple-200 transition-colors duration-300'>
              <img className='w-5 h-5' src={user_assets.profile_icon} alt="Users" />
            </div>
            <span className='font-medium text-sm md:text-base hidden md:block'>Users</span>
          </NavLink>

          <NavLink to={'categories'} className={navLinkClass}>
            <div className='flex items-center justify-center w-8 h-8 rounded-md bg-orange-100 group-hover:bg-orange-200 transition-colors duration-300'>
              <img className='w-5 h-5' src={user_assets.profile_icon} alt="Categories" />
            </div>
            <span className='font-medium text-sm md:text-base hidden md:block'>Categories</span>
          </NavLink>

          <NavLink to={'coupon-management'} className={navLinkClass}>
            <div className='flex items-center justify-center w-8 h-8 rounded-md bg-pink-100 group-hover:bg-pink-200 transition-colors duration-300'>
              <img className='w-5 h-5' src={user_assets.profile_icon} alt="Coupon" />
            </div>
            <span className='font-medium text-sm md:text-base hidden md:block'>Coupons</span>
          </NavLink>

          <NavLink to={'orders'} className={navLinkClass}>
            <div className='flex items-center justify-center w-8 h-8 rounded-md bg-yellow-100 group-hover:bg-yellow-200 transition-colors duration-300'>
              <img className='w-5 h-5' src={admin_assets.order_icon} alt="Orders" />
            </div>
            <span className='font-medium text-sm md:text-base hidden md:block'>Orders</span>
          </NavLink>

          <NavLink to={'offer/product-offer'} className={navLinkClass}>
            <div className='flex items-center justify-center w-8 h-8 rounded-md bg-red-100 group-hover:bg-red-200 transition-colors duration-300'>
              <img className='w-5 h-5' src={admin_assets.order_icon} alt="Offers" />
            </div>
            <span className='font-medium text-sm md:text-base hidden md:block'>Offers</span>
          </NavLink>

          {/* Logout Section */}
          <div className='pt-6 mt-6 border-t border-gray-200'>
            <div className='flex items-center gap-4 px-4 py-3 mx-2 rounded-lg bg-gray-100 hover:bg-red-50 hover:shadow-md transition-all duration-300 group'>
              <div className='flex items-center justify-center w-8 h-8 rounded-md bg-red-100 group-hover:bg-red-200 transition-colors duration-300'>
                <svg className='w-5 h-5 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
                </svg>
              </div>
              <AdminLogout/>
            </div>
          </div>
        </nav>
      </div>
    </div>
  )
}

export default AdminSidebar