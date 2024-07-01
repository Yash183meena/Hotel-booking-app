import React, { useContext, useState } from "react";

type SearchContext={
      destination:string;
      checkIn:Date;
      checkOut:Date;
      adultCount:number;
      childCount:number;
      hotelId:string;
      saveSearchValues:(
            destination:string,
            checkIn:Date,
            checkOut:Date,
            childCount:number,
            adultCount:number
      )=>void
}



//now create an context

const SearchContext=React.createContext<SearchContext | undefined>(undefined);

type SearchContextProviderProps={
      children:React.ReactNode;
}

export const SearchContextProvider=({children}:SearchContextProviderProps)=>{

       //sessionStorage se data lekar states  ko set karne ka ye fayada hai ki page refresh karne k baad jo aapne latest form me entry kare thi wo sab wese ki wese rhete hai kyuki sab sessionStorage me se aa rahi hote hai

      const [destination,setDestination]=useState<string>(()=> sessionStorage.getItem("destination") || "");

      const [checkIn,setCheckIn]=useState<Date>(()=>new Date(sessionStorage.getItem("checkIn") || new Date().toISOString()));

      const [checkOut,setCheckOut]=useState<Date>(()=>new Date(sessionStorage.getItem("checkOut") || new Date().toISOString()));

      const [adultCount,setAdultCount]=useState<number>(()=>parseInt(sessionStorage.getItem("adultCount") || "1"));

      const [childCount,setChildCount]=useState<number>(()=>parseInt(sessionStorage.getItem("childCount") || ""));

      const[hotelId,setHotelId]=useState<string>(()=>sessionStorage.getItem("hotelId") || "");

      //jabke inme aapn page refresh karne k baad pura data jo apn ne daala tha wo gayab ho jayega
      
      // const [destination,setDestination]=useState<string>("");
      // const [checkIn,setCheckIn]=useState<Date>(new Date());
      // const [checkOut,setCheckOut]=useState<Date>(new Date());
      // const [adultCount,setAdultCount]=useState<number>(1);
      // const [childCount,setChildCount]=useState<number>(0);
      // const[hotelId,setHotelId]=useState<string>("");

      //is function ke andar me mere properties destination,adultCount,checkIn etc inko set krunga
      const saveSearchValues=(
            destination:string,
            checkIn:Date,
            checkOut:Date,
            childCount:number,
            adultCount:number,
            hotelId?:string
            //? because hotel is an optional parameter
      )=>{
            setDestination(destination);
            setCheckIn(checkIn);
            setCheckOut(checkOut);
            setAdultCount(adultCount);
            setChildCount(childCount);
            if(hotelId){
                  setHotelId(hotelId);
            }

            //sessionStorage se data lekar states  ko set karne ka ye fayada hai ki page refresh karne k baad jo aapne latest form me entry kare thi wo sab wese ki wese rhete hai kyuki sab sessionStorage me se aa rahi hote hai

            sessionStorage.setItem("destination",destination);
            sessionStorage.setItem("checkIn",checkIn.toISOString());
            sessionStorage.setItem("checkOut",checkOut.toISOString());
            sessionStorage.setItem("adultCount",adultCount.toString());
            sessionStorage.setItem("childCount",childCount.toString());

            if(hotelId){
                  sessionStorage.setItem("hotelId",hotelId);
            }
      };

      return (
            <SearchContext.Provider value={{
                  destination,
                  checkIn,
                  checkOut,
                  adultCount,
                  childCount,
                  saveSearchValues,
                  hotelId
            }}>
                  {children}
            </SearchContext.Provider>
      )
}

export const useSearchContext=()=>{
      const context=useContext(SearchContext);
      return context as SearchContext;
}