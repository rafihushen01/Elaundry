import React from 'react'
import Nav from './Nav'
import ITEMCARD from './ITEMCARD'
import ShopList from './ShopList'
import Footer from '../UsersComponents/Footer'

const Coustomerdashboar = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">

     <Nav/>
    Coustomerdashboard
     
<div className='mt-10'>


<ITEMCARD/>
    </div>
    <ShopList/>
<div>
  <Footer/>
</div>

    </div>

  )
}

export default Coustomerdashboar