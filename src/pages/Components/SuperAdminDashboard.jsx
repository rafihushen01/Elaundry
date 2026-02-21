import React from 'react'
import Nav from './Nav'
import SuperAdminNav from './Superadminnav'
import SUPERADMINITEMCARD from './Superitemcard'
import ShopListforsuperadmin from './SuperAdminShop'
import Footer from '../UsersComponents/Footer'

const SuperAdminDashboard = () => {
  return (
    <div>
      
        <SuperAdminNav/>
      
       SuperAdminDashboard
       
       <div className='p-8 mt-4'>


        <SUPERADMINITEMCARD/>
       </div>
       
       
       
        <div className='p-8 mt-4'>
    

    <ShopListforsuperadmin/>


        </div>
       <Footer/>
       
       
       
       </div>



  )
}

export default SuperAdminDashboard