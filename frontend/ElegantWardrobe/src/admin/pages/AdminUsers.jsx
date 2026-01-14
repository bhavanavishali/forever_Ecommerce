import { useContext, useEffect, useState } from "react";
import { adminApi } from "../../api";
import { useLocation, useNavigate } from "react-router-dom";
import SearchComponent from "../components/SearchComponent";
import { SearchContext } from "../../context/SearchContextProvider";
import Pagination from "../../components/Pagination";
import ConfirmModal from "@/ConfirmModal";

export default function AdminUsers() {
  const [filterValue, setFilterValue] = useState("blocked");
  const [block, setblock] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { search } = useContext(SearchContext);

  const [activePage, setActivePage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [userId, setUserId] = useState(null);



  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await adminApi.get(
          `/users/${search && `?search=${search}`}`,
          { params: { page: activePage } }
        );
        setUsers(res.data.results);
        setHasNext(res.data.has_next);
        setHasPrevious(res.data.has_previous);
        setTotalPages(res.data.total_pages);
      } catch (error) {
        console.log(error.message);
      }
    };

    getUsers();
  }, [search, activePage]);

  const toggleBlockStatus = async (id) => {
    try {
      const res = await adminApi.get(`/block_unblock_user/${id}/`,{params:{page:activePage}});
      setUsers(res.data.results);
      setHasNext(res.data.has_next);
      setHasPrevious(res.data.has_previous);
      setTotalPages(res.data.total_pages);
    } catch (error) {}
  };

  const toggleConfirmBlockStatus = () => {
    toggleBlockStatus(userId);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-normal text-center mb-8">Users</h1>

      <SearchComponent />

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-black text-white">
              <th className="py-3 px-4 text-left">S.No</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Mobile</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td className="py-3 px-4 border-b border-gray-200">
                  {index + 1}
                </td>
                <td className="py-3 px-4 border-b border-gray-200">
                  {user.first_name}
                </td>
                <td className="py-3 px-4 border-b border-gray-200">
                  {user.email}
                </td>
                <td className="py-3 px-4 border-b border-gray-200">
                  {user.phone_number}
                </td>
                <td className="py-3 px-4 border-b border-gray-200">
                  {/* {user.is_active?'Active':'Blocked'} */}
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.is_active
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {user.is_active ? "Active" : "Block"}
                  </span>
                </td>
                <td className="py-3 px-4 border-b border-gray-200 flex gap-2">
                  <button
                    onClick={() => {
                      if (user.is_active) {
                        setModalMessage(
                          "Are you sure you want to block this user?"
                        );
                      } else {
                        setModalMessage(
                          "Are you sure you want to unblock this user?"
                        );
                      }
                      setUserId(user.id);
                      setIsModalOpen(true);
                    }}
                    className={`flex items-center px-3 py-1.5 text-white ${
                      user.is_active
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                    } rounded-lg text-sm`}
                  >
                    {user.is_active ? "🚫 Block" : " ✅ Unblock"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 ? (
        <Pagination
          activePage={activePage}
          setActivePage={setActivePage}
          hasNext={hasNext}
          hasPrevious={hasPrevious}
          totalPages={totalPages}
        />
      ) : null}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={toggleConfirmBlockStatus}
        message={modalMessage}
      />
    </div>
  );
}
