import React from 'react'
import { useSelector } from 'react-redux'
import Coustomerdashboar from './Components/Coustomerdashboar'
import DeliveryBoyDash from './Components/DeliveryBoyDash'
import SuperAdminDashboard from './Components/SuperAdminDashboard'

const Home = () => {
  const { userData } = useSelector(state => state.user)
  const currentUser = userData?.user || userData
  const role = currentUser?.role

  if (!role) {
    return (
      <div className='w-full min-h-screen flex items-center justify-center bg-[#fff9f6]'>
        <h1 className='text-2xl font-semibold text-gray-700'>Please sign in again.</h1>
      </div>
    )
  }

  return (
    <div className='w-full min-h-screen flex flex-col bg-[#fff9f6]'>
      {role === "Customer" && <Coustomerdashboar />}
      {role === "DeliveryBoy" && <DeliveryBoyDash />}
      {role=="SuperAdmin" && <SuperAdminDashboard/> }
      {!["Customer", "DeliveryBoy", "SuperAdmin"].includes(role) && (
        <div className='w-full min-h-screen flex items-center justify-center'>
          <h1 className='text-xl font-medium text-gray-700'>No dashboard available for this account.</h1>
        </div>
      )}

    </div>

  )
}

export default Home
