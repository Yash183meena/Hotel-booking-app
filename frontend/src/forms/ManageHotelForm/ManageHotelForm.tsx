import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import TypeSection from "./TypeSection";
import FacilitiesSection from "./FacilitiesSection";
import GuestsSection from "./GuestsSection";
import ImagesSection from "./ImagesSection";
import { HotelType } from "../../../../backend/src/shared/types";
import { useEffect } from "react";

export type HotelFormData={
      name:string;
      city:string;
      country:string;
      description:string;
      type:string;
      pricePerNight:number;
      starRating:number;
      facilities:string[],
      imageFiles:FileList;
      imageUrls:string[];
      adultCount:number;
      childCount:number;
}

//hotel? --> make the hotel prop to be optional means not need to necessary in all Placesin which we access ManageHotel componenet
type Props={
    hotel?:HotelType;
    onSave:(hotelFormData:FormData)=>void;
    isLoading:boolean;
}

const ManageHotelForm = ({onSave,isLoading,hotel}:Props) => {

      const formMethods=useForm<HotelFormData>();

      const {handleSubmit,reset}=formMethods;

      useEffect(()=>{
         reset(hotel);
      },[hotel , reset]);

      const onsubmit=handleSubmit((formData:HotelFormData)=>{

         const formdata=new FormData();
         
         //ye hotelId isiye append kare kyuki ye tou hotel update endPoints me kaam aayege kyuki waha par {hotelformdata.get("hotelId")} wo hotelId yaha se hi aayege backend me aur fir backend se apiClient se fetch hoge
         if(hotel){
            formdata.append("hotelId",hotel._id);
         }
          //1st parmeter is field name and 2nd is value of field
         formdata.append("name",formData.name);
         formdata.append("city",formData.city);
         formdata.append("country",formData.country);
         formdata.append("description",formData.description);
         formdata.append("type",formData.type);
         formdata.append("adultCount",formData.adultCount.toString());
         formdata.append("childCount",formData.childCount.toString());
         formdata.append("pricePerNight",formData.pricePerNight.toString());
         formdata.append("starRating",formData.starRating.toString());

         //we added all the simple fiels now we move on to added complicated filed in our form

         formData.facilities.forEach((facility,index)=>{
            formdata.append(`facilities[${index}]`,facility);
         })


         if(formData.imageUrls){
            formData.imageUrls.forEach((url,index)=>{
               formdata.append(`imageUrls[${index}]`,url);
            })
         }

         //this will convert the formdata.imagefile in the array
         Array.from(formData.imageFiles).forEach((imageFile)=>{
            formdata.append(`imageFiles`,imageFile);
         })
         
         onSave(formdata);

      })
      

  return (
      <FormProvider {...formMethods}>
         <form className="flex flex-col gap-10" onSubmit={onsubmit}>
            <DetailsSection/>
            <TypeSection/>
            <FacilitiesSection/>
            <GuestsSection/>
            <ImagesSection/>
            <span className="flex justify-end">
               <button disabled={isLoading} type="submit" className="text-white bg-blue-600 p-2 font-bold hover:bg-blue-500 text-xl disabled:bg-gray-500">
                  {isLoading? "Saving...":"Save"}
               </button>
               {/* button ko diabled kar do jab tak ke liye jab tak ki previous information save save ho raha ho*/}
            </span>
         </form>
      </FormProvider>
  )
}

export default ManageHotelForm;
