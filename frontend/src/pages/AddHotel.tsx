import { useAppContext } from "../contexts/AppContext";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import { useMutation } from "react-query";
import * as apiClient from '../api-client';

const AddHotel=()=>{

      const {showToast}=useAppContext();

      const {data,mutate,isLoading}=useMutation(apiClient.addMyHotel,{
            onSuccess:()=>{
                  showToast({message:"Hotel Saved!",type:"SUCCESS"});
            },
            onError:(error:Error)=>{
                  showToast({message:error.message,type:"ERROR"});
            }
      })

      // hotelFormData FormData type ka hai
      const handleSave=(hotelFormData:FormData)=>{
            mutate(hotelFormData);
      }
      return (<ManageHotelForm onSave={handleSave} isLoading={isLoading} hotel={data} />);
}

export default AddHotel; 