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

      const [destination,setDestination]=useState<string>("");
      const [checkIn,setCheckIn]=useState<Date>(new Date());
      const [checkOut,setCheckOut]=useState<Date>(new Date());
      const [adultCount,setAdultCount]=useState<number>(1);
      const [childCount,setChildCount]=useState<number>(0);
      const[hotelId,setHotelId]=useState<string>("");

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