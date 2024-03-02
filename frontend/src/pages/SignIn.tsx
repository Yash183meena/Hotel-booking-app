import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import * as apiClient from '../api-client';
import { useAppContext } from '../contexts/AppContext';
import { Link, useNavigate } from 'react-router-dom';

export type SignInFormData={
      email:string;
      password:string;
}

const SignIn = () => {

      const queryclient=useQueryClient();
      const {showToast}=useAppContext();
      const navigate=useNavigate();

      const {register,formState:{errors},handleSubmit}=useForm<SignInFormData>();


      const mutation=useMutation(apiClient.signin,{
            onSuccess:async ()=>{
                  //1.show the toast and 
                  //2.navigate
                  //onSuccess or on onError dono ek ek callback lete hai
              console.log("user has been signed in");
              showToast({message:"Sign in successful!",type:"SUCCESS"});
              await queryclient.invalidateQueries("validationToken");
              navigate('/');
            },
            onError:(error:Error)=>{
                  //show the toast
                  //This error is comes frm the apiClient.signIn where it throe the error from ResponseBody.message
                  showToast({message:error.message,type:"ERROR"});
            }
            
      });

      //this data in the form of SignInFormData
      const onsubmit=handleSubmit((data)=>{
            mutation.mutate(data);
      });

  return (
    <div>
        <form className="flex flex-col gap-5" onSubmit={onsubmit}>
            <h2 className="text-3xl font-bold">Sign In</h2>

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
      {/* justify between ka matlab jitne bhi element hai is span tag ke andar wo edges par rhege ek start pa tou dusara end par */}
       <span className='flex items-center justify-between'>
            <span>
                  Not Registered?<Link to="/register" className='underline'>Create an account here</Link>
            </span>
            <button type="submit" className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl"> 
               Login
            </button>
       </span>
        </form>
    </div>
  )
}

export default SignIn;
