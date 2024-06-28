import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

export type RegisterFromData = {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  confirmPassword: string;
};
//backend me jo type hai check ke andar firstName aur yaha par ...register me jo name hai firstName bilkul same hona chaiye warna preview me object ke roop me error show karega firstName is required
 

const Register = () => {
       
      const queryclient=useQueryClient();
      const navigate=useNavigate();

      //useAppContext me jo value as a prop bheje hai usko destructure karke le liya
      const {showToast}=useAppContext();

      //  destructure formState from useForm hook and destructure errors from formState
  const {register , watch ,handleSubmit , formState:{errors}} = useForm<RegisterFromData>();


 //mutation is the hook of react-querry libraray which can be used to create,update,delete data in the the server
  //one of the reason to use mutaion is we caanot manage any state itself because the state is build in the useMutation hook
  const mutation=useMutation(apiClient.register,{
      onSuccess:async ()=>{
          showToast({message:"Registration Success",type:"SUCCESS"});
          //D drive ke react 10 project me iska explanation hai

          await queryclient.invalidateQueries("validationToken");
          navigate('/'); 
      },
      onError:(error:Error)=>{
            //This error comess from api-client where it throw Error and give message which is (ResponseBody.message) or apiclient ke pass se backend se aa rahi hai
            showToast({message:error.message,type:"ERROR"});
      }
  });

  const onSubmit=handleSubmit((data)=>{
      mutation.mutate(data);
      //data is in the type of RgisterFromData

      //as the mutatae function call it calls the apiClient.register function which fetches the data(fetches api)
  });

  return (
    <form className="flex flex-col gap-2" onSubmit={onSubmit}>
      <h2 className="text-3xl font-bold">Create an Account</h2>
      <div className="flex flex-col md:flex-row gap-5">
        <label className="text-gray-700 text-sm font-bold flex-1">
            First Name
          <input className="border rounded w-full py-1 px-2 font-normal" 
          {...register("firstName",{required:"This field  is required"})}/>

           {/* in the register first parameter is the fieldname and the second is the options This we register our firstName input element to the rect-hook-form */}
           {/* using spead operator because it is used to spread properties of an object means--spread properties return by register function */}

          {errors.firstName && (
            <span className="text-red-500">
                  {errors.firstName.message}
            </span>
          )}
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
            Last Name
          <input className="border rounded w-full py-1 px-2 font-normal" 
          {...register("lastName",{required:"This field  is required"})}/>
          {errors.lastName && (
            <span className="text-red-500">
                  {errors.lastName.message}
            </span>
          )}
        </label>
      </div>
      <label className="text-gray-700 text-sm font-bold flex-1" >
            Email
          <input type="email" className="border rounded w-full py-1 px-2 font-normal" 
          {...register("email",{required:"This field  is required"})}/>
          {errors.email && (
            <span className="text-red-500">
                  {errors.email.message}
            </span>
          )}
      </label>
      <label className="text-gray-700 text-sm font-bold flex-1" >
            Password
          <input type="password" className="border rounded w-full py-1 px-2 font-normal" 
          {...register("password",{required:"This field  is required",
          minLength:{
             value:6,
             message:"Password must be atleast 6 characters"
          },
          })}/>
          {errors.password && (
            <span className="text-red-500">
                  {errors.password.message}
            </span>
          )}
      </label>
      <label className="text-gray-700 text-sm font-bold flex-1" >
           Confirm Password
          <input type="password" className="border rounded w-full py-1 px-2 font-normal" 
          {...register("confirmPassword",{
          
            //react hook form provides validate function which allows to custum validation logic for your form fiels
            validate:(val)=>{
                  if(!val){
                        return "This field is required"
                  } else if(watch("password")!==val){
                        return "Your password do not match"
                  }
            },

          })}/>
          {errors.confirmPassword && (
            <span className="text-red-500">
                  {errors.confirmPassword.message}
            </span>
          )}
      </label>
       <span>
            <button type="submit" className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl"> 
               Create Account
            </button>
       </span>
    </form>
  );
};

export default Register;
