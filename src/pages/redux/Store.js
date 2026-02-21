import { configureStore } from "@reduxjs/toolkit"
import userslice from "../redux/Userslice.js"
import mapSlice from "../redux/Mapslice.js"
export const store = configureStore({

       reducer:{

        user: userslice,
        map: mapSlice



       },
            devTools: true  



})
