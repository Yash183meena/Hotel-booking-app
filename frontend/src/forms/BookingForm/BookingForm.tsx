import { useForm } from "react-hook-form";
import { PaymentIntentResponse, UserType } from "../../../../backend/src/shared/types";
import { CardElement } from "@stripe/react-stripe-js";

type Props={
      currentUser:UserType;
      paymentIntent:PaymentIntentResponse;
}

type BookingFormData={
      firstName:string;
      lastName:string;
      email:string;
}

//currntUser:Props means currentUser props typee  ka hai
export default function BookingForm({currentUser,paymentIntent}:Props) {

      const {handleSubmit,register}=useForm<BookingFormData>({
            defaultValues:{
                  firstName:currentUser.firstName,
                  lastName:currentUser.lastName,
                  email:currentUser.email,

            }
      });
      console.log(currentUser.firstName);
  return (
    <form className="grid grid-cols-1 gap-5 rounded-lg border border-gray-400 p-5">
        <span className="text-3xl font-bold">Confirm Your Details</span>
        <div className="grid grid-cols-2 gap-6">
            <label className="text-gray-700 text-sm font-bold flex-1">
              First Name
            <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            type="text"
            readOnly
            disabled
            {...register("firstName")}
            />
            </label>
            <label className="text-gray-700 text-sm font-bold flex-1">
              Last Name
              
            <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            type="text"
            readOnly
            disabled
            {...register("lastName")}
            />
            </label>
            <label className="text-gray-700 text-sm font-bold flex-1">
              Email
            <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            type="text"
            readOnly
            disabled
            {...register("email")}
            />
            </label>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Your Price Summary</h2>
          <div className="bg-blue-200 p-4 rounded-md">
           <div className="font-semibold text-lg">
              Total Cost: ₹{paymentIntent.totalCost.toFixed(2)}
           </div>
           <div className="text-xs">Includes taxes and charges</div>
        </div>
        </div>

        {/* the space-y-2 utility class is used to apply vertical spacing between child elements. Specifically, it adds a margin to the top of each child element except the first one */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">
            Payment Details
            <CardElement id="payment-element" className="border rounded-md p-2 text-sm"/>
          </h3>
        </div>
        
    </form>
  )
}
