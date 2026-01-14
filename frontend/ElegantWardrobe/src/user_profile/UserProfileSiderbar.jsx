import React from 'react'
import { NavLink } from 'react-router-dom'
// import { assets as admin_assets } from '../admin_assets/assets'
// import { assets as user_assets } from '../../assets/assets'

const UserProfileSiderbar = () => {
  return ( 
    <div className='min-h-screen border-r-2 '>
        <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>
            <NavLink to="" className='flex border items-center gap-3 border-gray-300 border-r-0 px-3 py-2 rounded-1'>
                {/* <img className='w-5 h-5 ' src={admin_assets.order_icon} alt="" /> */}
                <p className='hidden md:block'>Account Overview</p>
            </NavLink>
            <NavLink to={'my-orders'} className='flex border items-center gap-3 border-gray-300 border-r-0 px-3 py-2 rounded-1'>
                {/* <img className='w-5 h-5 ' src={user_assets.profile_icon} alt="" /> */}
                <p className='hidden md:block'>My Orders</p>
            </NavLink>
            <NavLink to={'manage-address'} className='flex border items-center gap-3 border-gray-300 border-r-0 px-3 py-2 rounded-1'>
                {/* <img className='w-5 h-5 ' src={user_assets.profile_icon} alt="" /> */}
                <p className='hidden md:block'>Manage Address</p>
            </NavLink>
            <NavLink to={'wallet'} className='flex border items-center gap-3 border-gray-300 border-r-0 px-3 py-2 rounded-1'>
                {/* <img className='w-5 h-5 ' src={admin_assets.order_icon} alt="" /> */}
                <p className='hidden md:block'>Wallet</p>
            </NavLink>
            <NavLink to={'manage-password'} className='flex border items-center gap-3 border-gray-300 border-r-0 px-3 py-2 rounded-1'>
                {/* <img className='w-5 h-5 ' src={admin_assets.order_icon} alt="" /> */}
                <p className='hidden md:block'>Manage Password</p>
            </NavLink>
            <NavLink to={'wishlist'} className='flex border items-center gap-3 border-gray-300 border-r-0 px-3 py-2 rounded-1'>
                {/* <img className='w-5 h-5 ' src={admin_assets.order_icon} alt="" /> */}
                <p className='hidden md:block'>Wishlist</p>
            </NavLink>
        </div>
    </div>
  )
}

export default UserProfileSiderbar