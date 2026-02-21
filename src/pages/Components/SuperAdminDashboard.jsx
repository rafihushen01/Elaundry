import React from 'react'
import Nav from './Nav'
import SuperAdminNav from './Superadminnav'
import SUPERADMINITEMCARD from './Superitemcard'
import ShopListforsuperadmin from './SuperAdminShop'

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
       
       
       
       
       </div>



  )
}

export default SuperAdminDashboard