import api, { adminApi } from '@/api'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Edit, Trash } from "lucide-react";
import { toast } from 'react-toastify';
import ConfirmModal from '@/ConfirmModal';

const CategoryOfferPage = () => {

   const [offers,setOffers] = useState([])
   const [categories,setCategories] = useState([])
   const [isChangeOffer,setIsChangeOffer] = useState(false) 
   const navigate = useNavigate()

     const [isModalOpen, setIsModalOpen] = useState(false);
     const [modalMessage, setModalMessage] = useState("");
     const [offerId, setOfferId] = useState(null);

   useEffect(()=>{
    const getOffers = async()=>{
        try {
            const res = await adminApi.get('/category_offers/')
            setOffers(res?.data?.category_offers)
            setCategories(res?.data?.categories)
            
        } catch (error) {
            console.log(error.message)
        }
    }
    getOffers()
   },[isChangeOffer])

   const removeCategoryOffer = async(id)=>{
      try {
        const res = await adminApi.delete(`/category_offers/${id}/`)
        if(res.status === 204){
          toast.success('Product offer deleted successfully!')
          setIsChangeOffer(!isChangeOffer)
        }
        
        setIsChangeOffer(!isChangeOffer)
      } catch (error) {
        console.log(error.message);
        
      }

   }


   const confirmRemoveCategoryOffer = ()=>{
      removeCategoryOffer(offerId)
      setIsModalOpen(false)
   }


  return (
    <>
        <div className='flex justify-end'>
        <button onClick={()=>{navigate('/admin/offer/add-category-offer',{state:categories})}} className='bg-black text-white py-2 hover:bg-black/90 w-52 mb-5'>Add Category Offer</button>
    </div>

    {/* <button onClick={()=>{console.log(products)}}>show products</button> */}

    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-4 text-left border-b">Sl. No</th>
            <th className="p-4 text-left border-b">Category Name</th>
            <th className="p-4 text-left border-b">Discount (%)</th>
            <th className="p-4 text-left border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {offers.map((offer, index) => (
            <tr key={offer.id} className="border-b">
              <td className="p-4">{index + 1}</td>
              <td className="p-4 font-serif">{offer.category_name}</td>
              <td className="p-4">{offer.discount_percentage}%</td>
              <td className="p-4">
                <div className="flex space-x-2">
                  <button
                    className="p-2 bg-gray-100 rounded-md"
                    onClick={() =>
                      navigate("/admin/offer/edit-category-offer/", {
                        state: {offer,categories},
                      })
                    }
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    className="p-2 bg-red-100 text-red-700 rounded-md"
                    onClick={()=>{
                      setModalMessage('Are you sure to want to delete this category offer')
                      setIsModalOpen(true)
                      setOfferId(offer.id)
                      // removeCategoryOffer(offer.id)
                    }}
                  >
                    <Trash className="h-4 w-4"/>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ConfirmModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={confirmRemoveCategoryOffer}
          message={modalMessage}
        />
    </div>
    </>
  )
}

export default CategoryOfferPage