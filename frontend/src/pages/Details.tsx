import {useParams} from "react-router-dom";
import * as apiClient from "../api-client";
import { useQuery } from "react-query";
import { AiFillStar } from "react-icons/ai";
import GuestInfoForm from "../forms/GuestInfoForm/GuestInfoForm";

const Details = () => {

      const {hotelId}=useParams();

      const {data:hotel}=useQuery("fetchHotelById",()=>
      apiClient.fetchHotelById(hotelId as string || ""),{
            //this(works when) will enabled hotel id is not undefined(null)
            enabled:!!hotelId,
            // When enabled is set to false, React Query will not make the query request, and no network call to fetch the hotel data will occur. This is useful for preventing useless queries or queries that would fail, such as trying to fetch data with an undefined or invalid ID.
      });

   if(!hotel){
      return (<div>
            no hotel information
      </div>);
   }

  return (
      
      <div className="space-y-6">
        <div>
        <span className="flex">
          {Array.from({ length: hotel.starRating }).map(() => (
            <AiFillStar className="fill-yellow-400" />
          ))}
        </span>
      
        <h1 className="text-3xl font-bold">{hotel.name}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {hotel.imageUrls.map((image)=>(
                 <div className="h-[300px]">
                     <img
                     src={image}
                     alt={hotel.name}
                     className="rounded-md w-full h-full object-cover object-center"/>
                 </div>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {hotel.facilities.map((facility)=>(
                  <div className="border border-slate-600 rounded-sm p-3">
                        {facility}
                  </div>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr]">
            <div className="whitespace-pre-line">
            {/* whitespace-pre-line Ye breaks ko respect karega, aur agar container ka width chhota hai toh normally wrap hoga. 
            matlab agar apna div container chota hai tou line ko wrap kar dega ek ke neeche */}
              {hotel.description}
            </div>
            <div className="h-fit">
                  <GuestInfoForm 
                  pricePerNight={hotel.pricePerNight}
                  hotelId={hotel._id}
                  
                  />
            </div>
        </div>
      </div>
  )
}

export default Details;
