import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";

type Props={
      hotelId:string;
      pricePerNight:number;
}

type GuestInfoFormData={
      checkIn:Date;
      checkOut:Date;
      adultCount:number;
      childCount:number;
}

const GuestInfoForm = ({hotelId,pricePerNight}:Props) => {

      const {watch,register,handleSubmit,setValue,formState:{errors}}=useForm<GuestInfoFormData>();

      const checkIn=watch("checkIn");
      const checkOut=watch("checkOut");

      const minDate=new Date();
      const maxDate=new Date();

      // Set the subscription end date to one year after the start date thats why we add +1 (taake 1 saal aage ka caleder khul paye aaj ke date se)
      maxDate.setFullYear(maxDate.getFullYear()+1);

  return (
    <div className="flex flex-col p-4 bg-blue-200 gap-4">
       <h3 className="text-md-font-bold">₹{pricePerNight}</h3>
       <form>
            <div className="grid grid-cols-1 gap-4 items-center">
                  <div>
                  <DatePicker 
            selected={checkIn}
            onChange={(date)=>setValue("checkIn",date as Date)}
            selectsStart
            startDate={checkIn}
            endDate={checkOut}
            minDate={minDate}
            maxDate={maxDate}
            placeholderText="Check-in Date"
            className="min-w-full bg-white p-2 focus:outline-none"
            wrapperClassName="min-w-full"/>
                  </div>
            </div>

       </form>
    </div>
  )
}

export default GuestInfoForm
