// AdminLogout.jsx
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ADMIN_ACCESS_TOKEN, ADMIN_REFRESH_TOKEN } from '@/constants';
import api from '@/api';
import ConfirmModal from '@/ConfirmModal';
import { useState } from 'react';

const AdminLogout = () => {
  const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");


  const handleLogout = async() => {
    try {
      const res = await api.post('/logout/')
        toast.success('Logged out successfully');
        setIsModalOpen(false)
        navigate('/admin-login');
    } catch (error) {
      console.log(error);
      
    }
   
  };

  return (
    <>
    <button onClick={()=>{
      setIsModalOpen(true);
      setModalMessage('Are you sure to want to Logout')
    }}>
      Logout
    </button>
     <ConfirmModal
        isOpen={isModalOpen}
        onClose={()=>setIsModalOpen(false)}
        onConfirm={handleLogout}
        message={modalMessage}
      />
    
    </>
  );
}

export default AdminLogout;
