import React from 'react'
import { Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from "framer-motion";
import Home from './pages/Home'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import ForgetPassword from './pages/ForgetPassword'
import { useSelector } from 'react-redux'
import UseGetCurrentUser from './pages/hooks/Usegetcurrentuser'
import useGetCurrentCity from './pages/hooks/Usegetmycity'
import AddandEditItem from './pages/Components/AddandEditItem'
import SuperAdminDashboard from './pages/Components/SuperAdminDashboard'
import Accountcreator from './pages/Components/Accountcreator'
import ITEMCARD from './pages/Components/ITEMCARD'
import Addshop from './pages/Components/Addshop'
import ShopList from './pages/Components/ShopList'
import EditItem from './pages/Components/EditItem'
import SUPERADMINITEMCARD from './pages/Components/Superitemcard'
import Editshop from './pages/Components/Editshopforsup'
import Cart from './pages/Components/Cart'
import Checkout from './pages/Components/Checkout'
import Placeorder from './pages/Components/Placeorder'
import Myorders from './pages/Components/Myorders'
import OwnerOrder from './pages/Components/OwnerOrder'
import ReviewPage from './pages/Components/ReviewPage'
import OwnerItemReview from './pages/Components/OwnerItemReview'
import SiteMetadata from './components/SiteMetadata';
import AutoTranslateApp from './components/AutoTranslateApp';
import BrandIdentity from './pages/BrandIdentity';

export const serverurl =
  import.meta.env.VITE_SERVER_URL || `https://elaundrywebsitebackend.onrender.com`

const App = () => {
  UseGetCurrentUser()
  useGetCurrentCity()
  const location = useLocation()
  const navigate = useNavigate()
  const { userData } = useSelector((state) => state.user)
  const currentUser = userData?.user || userData
  const isLoggedIn = Boolean(currentUser?.role)

  return (
    <>
      <SiteMetadata />
      <AutoTranslateApp />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
        >
          <Routes location={location}>

            {/* HOME (Protected) */}
            <Route path='/' element={isLoggedIn ? <Home/> : <Navigate to="/signin" />} />

            {/* PUBLIC ROUTES */}
            <Route path='/signup' element={!isLoggedIn ? <Signup/> : <Navigate to="/" />} />
            <Route path='/signin' element={!isLoggedIn ? <Signin/> : <Navigate to="/" />} />
            <Route path='/forgetpass' element={!isLoggedIn ? <ForgetPassword/> : <Navigate to="/" />} />
             <Route path='/shoplist' element={!isLoggedIn ? <ShopList/> : <Navigate to="/" />} />

          <Route path='/cart' element={isLoggedIn ? <Cart/> : <Navigate to="/" />} />
          <Route path='/checkout' element={isLoggedIn ? <Checkout/> : <Navigate to="/" />} />
          <Route path='/placeorder' element={isLoggedIn ? <Placeorder/> : <Navigate to="/" />} />
          <Route path='/myorders' element={isLoggedIn ? <Myorders/> : <Navigate to="/" />} />
          <Route path='/order' element={isLoggedIn ? <OwnerOrder/> : <Navigate to="/" />} />
          <Route path='/ownerreview/:id' element={isLoggedIn ? <OwnerItemReview/> : <Navigate to="/" />} />
          <Route path='/review/:itemid/:orderid' element={isLoggedIn ? <ReviewPage/> : <Navigate to="/" />} />
            {/* SUPERADMIN PROTECTED ROUTES */} <Route path='/itemcard' element={!isLoggedIn ? <ITEMCARD/> : <Navigate to="/" />} />
            <Route path='/additem' element={isLoggedIn ? <AddandEditItem/> : <Navigate to="/signin" />} />
            <Route path='/Superadmin' element={isLoggedIn ? <SuperAdminDashboard/> : <Navigate to="/signin" />} />
            <Route path='/accreator' element={isLoggedIn ? <Accountcreator/> : <Navigate to="/signin" />} />
              <Route path='/addshop' element={isLoggedIn ? <Addshop/> : <Navigate to="/signin" />} />
       <Route path='/edititem/:id' element={isLoggedIn ? <EditItem/> : <Navigate to="/signin" />} />
       <Route path="/superadminshop/:shopId" element={isLoggedIn ? <SUPERADMINITEMCARD/> : <Navigate to="/signin" />} />
        <Route path='/editshop/:id' element={isLoggedIn ? <Editshop/> : <Navigate to="/signin" />} />

          </Routes>
        </motion.div>
      </AnimatePresence>
      <motion.div
        className="fixed bottom-3 right-3 z-[9998] rounded-2xl bg-white/80 backdrop-blur-lg shadow-lg border border-emerald-100 px-3 py-2"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
       
      </motion.div>
    </>
  )
}

export default App
