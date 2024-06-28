import { useMutation, useQueryClient } from "react-query";
import * as apiClient from '../api-client';
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";


const SignOutButton = () => {
      
      const queryclient=useQueryClient();
      const {showToast}=useAppContext();
      const navigate=useNavigate();
      
      const mutation=useMutation(apiClient.signout,{
            onSuccess:async ()=>{
                //1)show toast
                //2)navigate
                //querclient.invalidateQueries is to refetching the data and without refresh our page to rerendered our validationToken
                
                //The queryClient.invalidateQueries function is a method provided by the React Query library. It allows you to manually invalidate one or more queries in the cache, triggering their refetching.
                await queryclient.invalidateQueries("validationToken");
                showToast({message:"Signed Out!",type:"SUCCESS"})
                navigate('/');
                
            },
            onError:(error:Error)=>{
                 //1)showToast
                 showToast({message:error.message,type:"ERROR"});
            }
      });

      const handleClick=()=>{
          mutation.mutate();
      }

  return (
    <button className="text-blue-600 px-3 py-2 font-bold bg-white hover:bg-gray-100" onClick={handleClick}>
        Sign Out
    </button>
  )
}

export default SignOutButton;
