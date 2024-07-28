import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import BookingForm from "../forms/BookingForm/BookingForm";
import { useSearchContext } from "../contexts/SearchContext";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BookingDetailsSummary from "../components/BookingDetailsSummary";
import { Elements } from "@stripe/react-stripe-js";
import { useAppContext } from "../contexts/AppContext";

export default function Booking() {

      const {stripePromise}=useAppContext();

      const {data:currentUser}=useQuery("fetchCurrentUser",apiClient.fetchCurrentUser);
      console.log(currentUser?.firstName);

      const search=useSearchContext();
      const {hotelId}=useParams();

      const {data:hotel}=useQuery("fetchHotelById",()=> apiClient.fetchHotelById(hotelId as string),{
            enabled:!!hotelId,
            //enabled kar diya matlab jab hotelId hoge tab hi apiFetch hoge warna unnessary apifetch karne se bach jayege
      });

      const [numberOfNights,setNumberOfNights]=useState<number>(0);
      useEffect(()=>{
            if(search.checkIn && search.checkOut){
                  const nights=Math.abs(search.checkOut.getTime()-search.checkIn.getTime())/(1000*60*60*24);

                  setNumberOfNights(Math.ceil(nights));
            }
      },[search.checkIn,search.checkOut]);

      const {data:paymentIntentData}=useQuery(
            "createPaymentIntent",
            ()=>
            apiClient.createPaymentIntent(
                  hotelId as string,
                  numberOfNights.toString()
            ),
            {
                  enabled:!!hotelId && numberOfNights>0,
            }
      )

      if(!hotel){
            return <></>;
      }

  return (
    <div className="grid md:grid-cols-[1fr_2fr] gap-2">
         <BookingDetailsSummary
         checkIn={search.checkIn}
         checkOut={search.checkOut}
         adultCount={search.adultCount}
         childCount={search.childCount}
         numberOfNights={numberOfNights}
         hotel={hotel}
         />
         {currentUser && paymentIntentData && (
            // Element tag stripe se aata hai ye stipe UI ko use karne ke kaam aata hai aur isme apne ko stripe property(props) dene hote hai
            <Elements stripe={stripePromise} options={{
                  clientSecret:paymentIntentData.clientSecret,
            }}>
                  <BookingForm 
                  currentUser={currentUser}
                  paymentIntent={paymentIntentData}
                  />
            </Elements>
            )}
    </div>  
  )
}
