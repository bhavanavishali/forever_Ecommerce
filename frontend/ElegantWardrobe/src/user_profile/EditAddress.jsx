import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '@/api';
import { toast } from 'react-toastify';

const EditAddress = () => {
    const location = useLocation();
  const { id } = location.state // assume /edit-address/:id route
  
  const navigate = useNavigate();

  const [addressData, setAddressData] = useState({
    name: "",
    phone_no: "",
    street_address: "",
    city: "",
    state: "",
    pin_code: "",
    country: "",
  });

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await api.get(`/edit_address/${id}/`);
        setAddressData(response.data);
      } catch (error) {
        console.error("Failed to fetch address", error);
        toast.error("Failed to load address details.");
      }
    };

    fetchAddress();
  }, [id]);

  const handleAddressChange = (e) => {
    setAddressData({ ...addressData, [e.target.name]: e.target.value });
  };

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/edit_address/${id}/`, addressData);
      toast.success("Address updated successfully!");
      navigate("/profile"); // or wherever you want to go
    } catch (error) {
      console.error("Failed to update address", error);
      toast.error("Failed to update address.");
    }
  };

  return (
    <form
      onSubmit={handleUpdateAddress}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">Edit Address</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      {[
        { name: "name", placeholder: "Name" },
        { name: "phone_no", placeholder: "Phone Number" },
        { name: "street_address", placeholder: "Street Address" },
        { name: "city", placeholder: "City" },
        { name: "state", placeholder: "State" },
        { name: "pin_code", placeholder: "Pin Code" },
        { name: "country", placeholder: "Country" },
      ].map(({ name, placeholder }) => (
        <input
          key={name}
          className="w-full px-3 py-2 border border-gray-800"
          type="text"
          name={name}
          placeholder={placeholder}
          value={addressData[name]}
          onChange={handleAddressChange}
          required
        />
      ))}

      <button className="bg-black text-white px-8 py-2 font-light mt-4">
        Update Address
      </button>
    </form>
  );
};

export default EditAddress;
