import { RegisterFromData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";
import {HotelSearchResponse, HotelType} from '../../backend/src/shared/types';

const API_BASE_URL=import.meta.env.VITE_API_BASE_URL || "";

export const register = async (formData: RegisterFromData) => {
      const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: "POST",
        credentials:"include",
      //   In JavaScript, specifically in the context of making fetch requests, the credentials option is used to specify whether to include cookies, HTTP authentication,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
    
      const responseBody = await response.json();
    
      if (!response.ok) {
        throw new Error(responseBody.message);
      }
    };

export const validateToken=async ()=>{

       const response=await fetch(`${API_BASE_URL}/api/auth/validate_token`,{
            credentials:"include"
       })

       if(!response.ok){
             throw new Error("token is not Valid");
       }

       return response.json();
}    

export const signin=async (formData:SignInFormData)=>{
       
      const response=await fetch(`${API_BASE_URL}/api/auth/login`,{
            method:"POST",
            credentials:"include",
            headers:{
              "Content-Type":"application/json"
            },
            body:JSON.stringify(formData)
      });

      const BodyResponse=await response.json();

       if(!response.ok){
            throw new Error(BodyResponse.message);
       }

       return BodyResponse;
}

export const signout=async ()=>{
   
  const response=await fetch(`${API_BASE_URL}/api/auth/logout`,{
    method:"POST",
    credentials:"include"
  });

  if(!response.ok){
    throw new Error("Error during Sign out");
  }
}

export const addMyHotel=async (hotelFormData:FormData)=>{
     
  const response=await fetch(`${API_BASE_URL}/api/my-hotels`,{
      method:"POST",
      credentials:"include",
      body:hotelFormData,
  });

  if(!response.ok){
    throw new Error("Failed to add hotel");
  }

   return response.json();
}


//The benefit of adding Promise<HotelType[]> because our frontend and backend working on the same type i.e HotelType
//if we add any new property in the Hotel feature our frontend directly access to it and add automatic new property in it beacse both have same type
export const fetchMyHotel=async():Promise<HotelType[]>=>{
       
    const response=await fetch(`${API_BASE_URL}/api/my-hotels`,{
        credentials:"include",
    });

    if(!response.ok){
      throw new Error("Error fetching hotels");
    }

    return response.json();

}

//ye jo apn Promise<HotelType> de rahe hai na ye commit kar diya gya ahai ki function non-void hai ek promise kar de gyi hai ki ek HotelType ka object return karke dega ye function
export const fetchMyHotelById=async(hotelId:string):Promise<HotelType>=>{
       
     const response=await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}`,{
        credentials:"include",
     });

     if(!response.ok){
        throw new Error("Error fetching Hotels");
     }

     return response.json();
}

export const updateMyHotelById=async(hotelformdata:FormData)=>{
   
    const response=await fetch(`${API_BASE_URL}/api/my-hotels/${hotelformdata.get("hotelId")}`,
    {
      method:"PUT",
      body:hotelformdata,
      credentials:"include",
    }
    );

    if(!response.ok){
      throw new Error("Failed to update Hotel");
    }

    return response.json();
}

export type SearchParams={
  destination?:string;
  checkIn?:string;
  checkOut?:string;
  adultCount?:string;
  childCount?:string;
  page?:string;
  facilities?:string[];
  types?:string[];
  stars?:string[];
  maxPrice?:string;
  sortOption?:string;
}

//matlab ye ek promise krta hai HotelSearchReponse type ka object return karke dega
export const searchHotels=async(searchParams:SearchParams):Promise<HotelSearchResponse>=>{
  
  //url crate karne ke liye aur useke query parameters ko append karne ke liye
   const queryParams=new URLSearchParams();
   queryParams.append("destination",searchParams.destination || "")
   queryParams.append("checkIn",searchParams.checkIn || "")
   queryParams.append("checkOut",searchParams.checkOut || "")
   queryParams.append("adultCount",searchParams.adultCount || " ")
   queryParams.append("childCount",searchParams.childCount || " ")
   queryParams.append("page",searchParams.page || " ");

   //add ? (question marks ) before adding the query parameter to indicate the query parameters

   queryParams.append("sortOption",searchParams.sortOption || "");
   queryParams.append("maxPrice",searchParams.maxPrice || "");

   searchParams.facilities?.forEach((facility)=>{
    queryParams.append("facilities",facility);
   });

   searchParams.types?.forEach((type)=>queryParams.append("types",type));
   searchParams.stars?.forEach((star)=>queryParams.append("stars",star));

   const response=await fetch(`${API_BASE_URL}/api/hotels/search?${queryParams}`);

   if(!response.ok){
    throw new Error("Error fetching hotels");
   }

   return response.json();

}

export const fetchHotelById=async(hotelId:string):Promise<HotelType>=>{
     
  const response=await fetch(`${API_BASE_URL}/api/hotels/${hotelId}`);

  if(!response.ok){
     throw new Error("Error fetching Hotels");
  }

   return response.json();
}