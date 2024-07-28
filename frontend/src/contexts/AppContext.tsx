import React, { useState } from "react";
import { useContext } from "react";
import Toast from "../components/Toast";
import { useQuery } from "react-query";
import * as apiClient from '../api-client';
import { loadStripe,Stripe } from "@stripe/stripe-js";

const STRIPE_PUB_KEY=import.meta.env.VITE_STRIPE_PUB_KEY || "";

type ToastMessage={
      message:string,
      type:"SUCCESS" | "ERROR"
}

type AppContext={
      // After successful restration or not it show the toast on right and side coner at which the toast message it shown
      showToast:(toastMessage:ToastMessage)=>void;
      isLoggedIn:boolean;
      stripePromise:Promise<Stripe | null>;
}

const AppContext=React.createContext<AppContext | undefined>(undefined);

const stripePromise=loadStripe(STRIPE_PUB_KEY);

export const AppContextProvider=({children}:{children:React.ReactNode})=>{

      const [toast,setToast]=useState<ToastMessage | undefined>(undefined);

      //This is to checking that our user is logeed in or not .
      //This is runs when action caused App to redendered

      //signin , register or logout sab me useAppContent() hook access kia gaya hai jiske karan validateToken function run ho raha hai kyuki App rereder ho rahi haiy
      const {isError}=useQuery("validationToken",apiClient.validateToken,{
            retry:false,
      });
       
      return(
            <AppContext.Provider value={{showToast:(toastmessage)=>{
                  setToast(toastmessage);
            },
             isLoggedIn:!isError,
             stripePromise
            }}>
                  {toast && (<Toast message={toast.message} type={toast.type} onClose={()=>setToast(undefined)}/>)}
                  {children}
            </AppContext.Provider>
      )
}

export const useAppContext=()=>{

      const context=useContext(AppContext);
      return context as AppContext;
}