import { RegisterFromData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";

const API_BASE_URL=import.meta.env.VITE_API_BASE_URL;

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