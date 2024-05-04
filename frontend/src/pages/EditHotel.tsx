import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from '../api-client';
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import { useAppContext } from "../contexts/AppContext";

const EditHotel = () => {

      const {hotelId}=useParams();

      const {data:hotel}=useQuery("fetchMyHotelById",()=>
            apiClient.fetchMyHotelById(hotelId || ''),
            {
                  //means agr hotelid nahi hai tou disabled kar de kyuki wo nahi milega isliye hi callback function me liya gaya hai ye sab
                  enabled: !!hotelId,
            }
      );

      const {showToast}=useAppContext();

      const {mutate ,isLoading}=useMutation(apiClient.updateMyHotelById,{
            onSuccess:()=>{
              showToast({message:"Hotel updated successfully!",type:"SUCCESS"});
            },
            onError:()=>{
              showToast({message:"Error in update!!",type:"ERROR"});
            },
      })

      const handleSave=(hotelformdata:FormData)=>{
            mutate(hotelformdata);
      }

      return (<ManageHotelForm hotel={hotel} onSave={handleSave} isLoading={isLoading} />)
    
}

export default EditHotel;


// import { useParams } from "react-router-dom";
// import * as apiClient from "../api-client";
// import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
// import { useQuery } from "react-query";


// const EditHotel = () => {
//   const { hotelId } = useParams();
  

//   const { data: hotel } = useQuery(
//     "fetchMyHotelById",
//     () => apiClient.fetchMyHotelById(hotelId || ""),
//     {
//       enabled: !!hotelId,
//     }
//   );
  

//   return (
//     <ManageHotelForm hotel={hotel}  />
//   );
// };

// export default EditHotel;
