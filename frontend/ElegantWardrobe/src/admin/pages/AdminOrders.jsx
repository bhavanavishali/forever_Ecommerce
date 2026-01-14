import Pagination from "@/components/Pagination";
import React, { useContext, useEffect, useState } from "react";
import SearchComponent from "../components/SearchComponent";
import api, { adminApi } from "@/api";
import { ShopContext } from "@/context/ShopContext";
import { SearchContext } from "@/context/SearchContextProvider";
import { useNavigate } from "react-router-dom";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const { currency } = useContext(ShopContext);
  const { search, setSearch } = useContext(SearchContext);

  const [activePage, setActivePage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await adminApi.get("/get_all_orders/", {
          params: { page: activePage, search: search },
        });
        console.log(res.data.results);

        setOrders(res.data.results);
        setHasNext(res.data.has_next);
        setHasPrevious(res.data.has_previous);
        setTotalPages(res.data.total_pages);
      } catch (error) {
        console.log(error.message);
      }
    };
    getOrders();
  }, [activePage, search]);

  // Function to render status with appropriate color
  const renderStatus = (status) => {
    const statusColors = {
      CONFIRMED: "bg-green-100 text-green-800",
      // "PENDING": "bg-blue-100 text-blue-800",
      SHIPPED: "bg-purple-100 text-purple-800",
      CANCELED: "bg-red-100 text-red-800",
      Pending: "bg-yellow-100 text-yellow-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          statusColors[status] || "bg-gray-100"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="w-full bg-white p-4 md:p-6">
      {/* Search Bar */}
      <div className="mb-6">
        <SearchComponent />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          {/* Table Header */}
          <thead>
            <tr className="bg-gray-50">
              <th className="py-3 px-4 text-left font-medium text-gray-800">
                Order ID
              </th>
              <th className="py-3 px-4 text-left font-medium text-gray-800">
                Customer
              </th>
              <th className="py-3 px-4 text-left font-medium text-gray-800">
                Date
              </th>
              <th className="py-3 px-4 text-left font-medium text-gray-800">
                Total Amount
              </th>
              <th className="py-3 px-4 text-left font-medium text-gray-800">
                Status
              </th>
              <th className="py-3 px-4 text-left font-medium text-gray-800">
                Action
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {orders?.map((order, index) => (
              <tr
                key={order?.id}
                className={`border-t border-gray-200 hover:bg-gray-50 transition-colors`}
              >
                <td className="py-4 px-4">{order?.order_no}</td>
                <td className="py-4 px-4">{order?.customer.first_name}</td>
                <td className="py-4 px-4">{order?.order_date}</td>
                <td className="py-4 px-4">
                  {currency}
                  {order?.final_amount?.toFixed(2)}
                </td>
                <td className="py-4 px-4">{renderStatus(order?.status)}</td>
                <td className="py-4 px-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        navigate("/admin/order-details", {
                          state: { orderId: order.id },
                        });
                      }}
                      className="border px-4 py-2 text-sm font-medium rounded-sm"
                    >
                      Details
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {totalPages > 1 ? (
          <Pagination
            activePage={activePage}
            setActivePage={setActivePage}
            hasNext={hasNext}
            hasPrevious={hasPrevious}
            totalPages={totalPages}
          />
        ) : null}  
      </div>
    </div>
  );
}

export default AdminOrders;
