import { useState } from "react";
import axios from "axios";
import api from "@/api";
import { toast } from "react-toastify";

const ReturnOrderModal = ({ orderItemId, showReturnModal, setShowReturnModal,isChangeOrderItem,setIsChangeOrderItem}) => {
  const [form, setForm] = useState({
    sizing_issues: false,
    damaged_item: false,
    incorrect_order: false,
    delivery_delays: false,
    other_reason: ""
  });

  
  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async () => {
    console.log('return item');
    
    try {
      const res = await api.post(`/return_order_item/${orderItemId}/`, form);
      toast.success(res?.data?.message)
      setShowReturnModal(!showReturnModal)
      setIsChangeOrderItem(!isChangeOrderItem)
    } catch (error) {
      toast.error(error?.response?.data?.error)
      setShowReturnModal(!showReturnModal)
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Return Order Item</h2>

        <div className="space-y-3">
          <label className="flex items-center space-x-3">
            <input type="checkbox" name="sizing_issues" checked={form.sizing_issues} onChange={handleChange} className="accent-black" />
            <span className="text-gray-800">Sizing Issues</span>
          </label>

          <label className="flex items-center space-x-3">
            <input type="checkbox" name="damaged_item" checked={form.damaged_item} onChange={handleChange} className="accent-black" />
            <span className="text-gray-800">Damaged Item</span>
          </label>

          <label className="flex items-center space-x-3">
            <input type="checkbox" name="incorrect_order" checked={form.incorrect_order} onChange={handleChange} className="accent-black" />
            <span className="text-gray-800">Incorrect Order</span>
          </label>

          <label className="flex items-center space-x-3">
            <input type="checkbox" name="delivery_delays" checked={form.delivery_delays} onChange={handleChange} className="accent-black" />
            <span className="text-gray-800">Delivery Delays</span>
          </label>
        </div>

        <textarea
          name="other_reason"
          placeholder="Other reason (optional)"
          value={form.other_reason}
          onChange={handleChange}
          className="w-full mt-4 p-3 border rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
        />

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={()=>{setShowReturnModal(!showReturnModal)}}
            className="px-4 py-2 text-sm bg-gray-200 text-black rounded-lg hover:bg-gray-300"

          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-900"
          >
            Submit Return
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnOrderModal;
