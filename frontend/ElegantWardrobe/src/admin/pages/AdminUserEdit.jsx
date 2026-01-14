import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import api, { adminApi } from '../../api';
import { toast } from 'react-toastify';

const AdminUserEdit = () => {
    const location = useLocation();
    const userDetails = location.state;
    const [formData, setFormData] = useState({
        first_name: userDetails.first_name,
        last_name: userDetails.last_name,
        email: userDetails.email,
        phone_number: userDetails.phone_number,
      });


    
      const navigate = useNavigate();
    
      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
      const onHandleSubmit = async (e) => {
        e.preventDefault();
        
        
          try {

            const res = await adminApi.post(`/edit_user/${userDetails.id}/`,formData)
            toast.success(res.data)
            navigate('/admin/users')
            

          } catch (error) {
            alert("Error");
          }
    
        
      };
  return (
    <form
        onSubmit={onHandleSubmit}
        className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
      >
        <div className="inline-flex items-center gap-2 mb-2 mt-10">
          <p className="prata-regular text-3xl">Edit User</p>
          <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
        </div>
        
        {/* Firtname */}
        <input
          className="w-full px-3 py-2 border border-gray-800"
          type="text"
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleChange}
          required
        />

        {/* Lastname */}
        <input
          className="w-full px-3 py-2 border border-gray-800"
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={handleChange}
          required
        />
  
        {/* Email */}
        <input
          className="w-full px-3 py-2 border border-gray-800"
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
  
        {/* Phone Number */}
        <input
          className="w-full px-3 py-2 border border-gray-800"
          type="text"
          name="phone_number"
          placeholder="Phone Number"
          value={formData.phone_number}
          onChange={handleChange}
          required
        />
    
       

        {/* Submit Button */}
        <button className="bg-black text-white px-8 py-2 font-light mt-4 ">
          Update User
        </button>
      </form>
  )
}

export default AdminUserEdit