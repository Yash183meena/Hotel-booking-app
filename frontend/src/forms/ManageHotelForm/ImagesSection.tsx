import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./ManageHotelForm";

const ImagesSection = () => {
  const {
    register,
    formState: { errors },
    watch,
    setValue
  } = useFormContext<HotelFormData>();
  // useFormContext() is part of the React Hook Form library and is used to access the form context from nested components warna apan simply useForm() bhi use kar sakte the .

  //(1) The function watch("imageUrls") is typically associated with form management libraries like Formik or React Hook Form in React applications. It is used to watch for changes to a specific form field or form field array.

  //(2) When you call watch("imageUrls"), the form management library will track changes to the "imageUrls" field in your form. If the value of this field changes due to user input or programmatic changes, the function will return the updated value of the "imageUrls" field.

  const existingImageUrls=watch("imageUrls");

  const handleDelete=(
    event:React.MouseEvent<HTMLButtonElement,MouseEvent>,
    imageUrl:string
  )=>{
    event.preventDefault();
     setValue("imageUrls",existingImageUrls.filter((url)=>url!=imageUrl));
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Images</h2>
      <div className="border rounded p-4 flex flex-col gap-4">

       {existingImageUrls && (
          <div className="grid grid-cols-6 gap-4">
            {existingImageUrls.map((url)=>(
               <div className="relative group">
                  <img src={url} className="min-h-full object-cover"/>
                  {/* inset-0 class is applied to a div element with the absolute class, effectively positioning the element at the edges of its nearest positioned ancestor. The inset-0 class ensures that the element spans the entire width and height of its container or the viewport. */}
                  <button className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 text-white" onClick={(event)=> handleDelete(event,url)}>Delete</button>
               </div>
            ))}
          </div>
       )}

        <input
          type="file"
          multiple
          accept="image/*"
          {...register("imageFiles", {
            validate: (imageFiles) => {
              const totalLength = imageFiles.length + (existingImageUrls?.length || 0);

              if (totalLength === 0) {
                return "At least one image should be added";
              }

              if (totalLength > 6) {
                return "Total number of images cannot be more than 6";
              }

              return true;
            },
          })}
        />
      </div>
      {errors.imageFiles && (
        <span className="text-red-500 font-semibold text-bold">
          {errors.imageFiles.message}
        </span>
      )}
    </div>
  );
};

export default ImagesSection;
