import React, { useEffect, useState } from "react";
import { Edit, PlusCircle, Trash } from "lucide-react";
import api from "@/api";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmModal from "@/ConfirmModal";

const ManageAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const [isDeleteAddress, setIsDeleteAddress] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addressId,setAddressId] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    const getAddresses = async () => {
      try {
        const res = await api.get("/get_all_addresses/");
        setAddresses(res.data.addresses_data);
      } catch (error) {}
    };

    getAddresses();
  }, [isDeleteAddress]);

  const handleDelete = async (id) => {
    try {
      const res = await api.delete(`/delete_address/${id}/`);
      if (res.status === 200) {
        setIsDeleteAddress(!isDeleteAddress);
        toast.success("Address deleted successfully");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleConfirmDelete = ()=>{
      handleDelete(addressId)
      setIsModalOpen(false)
  }

  return (
    <div>
      {/* Add Product Button aligned to right */}
      <div className="flex justify-end mb-4">
        <Button
          variant="default"
          onClick={() => navigate("/profile/add-address")}
          className="bg-black text-white rounded-md hover:bg-black/90 w-52" // Set width here
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          ADD NEW ADDRESS
        </Button>
      </div>

      {/* Address List */}
      <div className="flex flex-col gap-4">
        {addresses?.map((address) => (
          <div
            key={address.id}
            className="flex justify-between items-center border p-4 rounded-md"
          >
            <div>
              <h2 className="text-lg font-semibold">{address.name}</h2>
              <p>{address.address}</p>
              <p>
                {address.city}, {address.state} - {address.zipcode}
              </p>
            </div>
            <div className="flex gap-4">
              <Edit
                className="cursor-pointer"
                onClick={() => {
                  navigate("/profile/edit-address", {
                    state: { id: address.id },
                  });
                }}
              />
              <Trash
                className="cursor-pointer"
                onClick={() => {
                  setIsModalOpen(true);
                  setAddressId(address.id)
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this Address?"
      />
    </div>
  );
};

export default ManageAddress;
