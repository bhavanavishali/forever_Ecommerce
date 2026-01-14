import { assets } from '@/assets/assets'
import React from 'react'


const  UserProfileNavbar = () => {
  return (
    <div className='flex justify-between items-center py-2 px-[4%]'>
        <img className='w-[max(10%,80px)]' src={assets.logo} alt="" />
        <button className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm '>Logout</button>
    </div>
  )
}

export default UserProfileNavbar