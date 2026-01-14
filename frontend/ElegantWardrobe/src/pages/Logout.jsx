import api from '@/api'
import { ShopContext } from '@/context/ShopContext'
import React, { useContext, useEffect } from 'react'

const Logout = () => {
    useEffect(()=>{
        const logout = async()=>{
            try {
            const res = await api.post('/logout/');
            console.log(res.data);
            
        } catch (error) {
            
        }
        }
        logout()
    },[])
  return (
    <div>Logout</div>
  )
}

export default Logout