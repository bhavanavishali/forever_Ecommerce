import React from 'react'
import { Outlet, useNavigate } from "react-router-dom";

const AdminOffer = () => {
    const navigate = useNavigate()
  return (
    <>
    <h1>Admin Offer page</h1>

    <div>
        <button onClick={()=>{navigate('product-offer')}} className='bg-black text-white py-2 hover:bg-black/90 w-52 mr-4'>Product Offer</button>
        <button onClick={()=>{navigate('category-offer')}} className='bg-black text-white py-2 hover:bg-black/90 w-52'>Category Offer</button>
    </div>

    {/* offer page */}

    <div className='offer mt-5'>
        <Outlet/>
    </div>
    </>
  )
}

export default AdminOffer