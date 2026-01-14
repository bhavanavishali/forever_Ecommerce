import React from 'react'
import { assets } from '../admin_assets/assets'

const AdminNavbar = () => {
  return (
    <div className='flex justify-between items-center py-2 px-[4%]'>
        <img className='w-[max(10%,80px)]' src={assets.logo} alt="" />
    </div>
  )
}

export default AdminNavbar