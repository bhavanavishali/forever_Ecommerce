import React from 'react'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer'
import SearchBar from '../components/SearchBar'
import './User.css'

const UserLayout = () => {
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
    <Navbar/>
    <SearchBar/>
    <div className='min-h-56'>
      <Outlet/>
    </div>
    <Footer/>
    </div>
  )
}

export default UserLayout