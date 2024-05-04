//contains set of endpoints that the user create,view and update their own hotels
import express,{Request,Response} from 'express'
import multer from 'multer';
import cloudinary from "cloudinary";
import Hotel from '../models/hotel';
import { HotelType } from '../shared/types';
import verifyToken from '../middleware/auth';
import { body } from 'express-validator';

const router=express.Router();

const storage=multer.memoryStorage();

const upload=multer({
      storage:storage,
      limits:{
            fileSize:5*1024*1024, //5MB
      }
})

//api/my-Hotels
//we add verifyToken middleware because we check that only loggeg in user can access the service of my-hotels
router.post('/',verifyToken,[
      //adding express validator middlewares
      body("name").notEmpty().withMessage("Name is required"),
      body("city").notEmpty().withMessage("City is required"),
      body("country").notEmpty().withMessage("Country is required"),
      body("description").notEmpty().withMessage("Description is required"),
      body("type").notEmpty().withMessage("Hotel type is required"),
      body("pricePerNight").notEmpty().isNumeric().withMessage("Price per is required"),
      body("facilities").notEmpty().isArray().withMessage("Facilities is required")
],
upload.array("imageFiles",6),async (req:Request,res:Response)=>{
      
      //upload is the middleware function
      //upload ke andar hum usko dalege jisme apne files/images hoge jisko  apn upload karna chahate hai.
      //imageFiles me apne images hai jo upload karege aur six images hoge imageFiles array me
      
      try{
            //requested uploaded files in the form of array
            //all images that we upload is in the form of array 
            console.log("success");
            const imageFiles=req.files as Express.Multer.File[];

            //and all other field like hotelname,city etc is store in new Hotel
            const newHotel:HotelType=req.body;
 
            // 1. Upload the images to the cloudinary
                  
            const uploadPromises=imageFiles.map(async(image)=>{
            //is a piece of code in JavaScript that converts binary data (typically from an image) into a Base64-encoded string.
               
              const b64=Buffer.from(image.buffer).toString("base64");

              //converting an image into the jpg,jpeg and png format
              //MIME is such as image/png ,image/jpeg 
              let dataURI="data:"+image.mimetype+";base64,"+b64;
              console.log("success");
              //After this line of code executes, res should contain information about the image that was uploaded to Cloudinary, allowing you to access and use the uploaded image in your application.
              const res=await cloudinary.v2.uploader.upload(dataURI);

              return res.url;
            })
            console.log("success");
            // 2. if upload was successful, add the URL,s to the new hotel
            const imageURLs = await Promise.all(uploadPromises);
            console.log("success");
            newHotel.imageUrls=imageURLs;
            newHotel.lastUpdated=new Date();
            newHotel.userId=req.userId; //ye userId apne ko middleware folder ke auth.ts se hi mil rahe hai
            
            // 3. save the new hotel in our database
             const hotel=new Hotel(newHotel);
             await hotel.save();

            // 4. return a 201 status

            res.status(201).send(hotel);
            console.log("success");
      }catch(e){
           console.log("Error in Creating Hotel",e);

           return res.status(500).json({message:"Something Went Wrong!"});
      }

});


//user ke kitne hotels hai uss information ko reetrive karne k liye
router.get("/",verifyToken,async(req:Request,res:Response)=>{
      try{
            //this userId is the id of user log in from mongoDb
            //this id is comes from the Hotel models that we are created

            //from this userid we reterive information about the user who is logedIn and created hotels
            //and this user id can send by http cookie

            //isse apne saare hotels aa jayege jo ki user ne bana rkhe hai
            const hotels=await Hotel.find({userId:req.userId});
            res.json(hotels);
      }
      catch(error){
            res.status(500).json({message:"Error fetching hotels"});
      }
});

//particular ek hotel ke information retrive karne ke liye, /:id-->means id of hotel
router.get("/:id",verifyToken,async (req:Request,res:Response)=>{

      //request object ke url parameter me se id ko nkal liaya or id frontend se bhjege
      const id=req.params.id.toString();

      try{
            //find se array me object milte hai or findOne se sirf ek hi object milta hai
            const hotel=await Hotel.findOne({
                  _id:id,
                  userId:req.userId,
            });

            //if there is no hotel this should be empty
            res.json(hotel);
         
      }
      catch(error){
            res.status(500).json({message:"Error fetching hotels"});
      }
})

// HTTP PUT method ka upyog kisi resource ko update karne ke liye kiya jata hai. Jab aap ek PUT request bhejte hain, to aap server ko resource ke naye data ko bhejte hain, jo server phir us resource ko update karne ke liye istemal karta hai aur database me existing data ko modify karta hai.

//ye jo put request aayege iske andar hi hotel id hoge jisse apiClinet me updateHotel function me updateHotel.get("hotelId") yahi se hi extract karega
router.put(
      "/:hotelId",
      verifyToken,
      upload.array("imageFiles"),
      async (req: Request, res: Response) => {
        try {
            //is updatedHotel me hi ilege wo purane imageUrls bhi (jo pahale se hi uploaded hai )
          const updatedHotel: HotelType = req.body;
          updatedHotel.lastUpdated = new Date();
    
          const hotel = await Hotel.findOneAndUpdate(
            {
              _id: req.params.hotelId,
              userId: req.userId,
            },
            updatedHotel,
            { new: true }
          );
    
          if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
          }
    
          const files = req.files as Express.Multer.File[];
          const updatedImageUrls = await uploadImages(files);
    
          //yaha par spread operator ka use isliye kiya gaya hai kyuki yaha par humko apne new imagesjo ki -->updatedImageUrls se aa rahi hai aur apne purane images jo --> updateHotel.imageUrls se aa rahi hai dono ko saath me merge karke rakhna hai
          
          hotel.imageUrls = [
            ...updatedImageUrls,
            ...(updatedHotel.imageUrls || []),
          ];
    
          await hotel.save();
          res.status(201).json(hotel);
        } catch (error) {
          res.status(500).json({ message: "Something went throw" });
        }
      }
    );
    
    async function uploadImages(imageFiles: Express.Multer.File[]) {
      const uploadPromises = imageFiles.map(async (image) => {
        const b64 = Buffer.from(image.buffer).toString("base64");
        let dataURI = "data:" + image.mimetype + ";base64," + b64;
        const res = await cloudinary.v2.uploader.upload(dataURI);
        return res.url;
      });
    
      const imageUrls = await Promise.all(uploadPromises);
      return imageUrls;
    }


export default router;

