// import express,{Request,Response} from 'express';
// import Hotel from '../models/hotel';
// import {HotelSearchResponse} from "../shared/types";

// const router=express.Router();

// router.get('/search',async (req:Request,res:Response)=>{
       
//       try{

//              const query=constructSearchQuery(req.query);

//              let sortOptions={};

//              switch(req.query.sortOption){
//                   case "starRating":
//                         //sort according to high to low
//                         sortOptions={starRating:-1};
//                         break;
//                   case "pricePerNightAsc":
//                         //low to high
//                         sortOptions={pricePerNight:1};
//                         break;   
//                   case "pricePerNightDesc":
//                         //high to low
//                         sortOptions={pricePerNight:-1};
//                         break;
//              }

//             //this is the number of pages in which hotels comes from the backend in each page 5 hotels is present.
//             // when we search page 2 the backend serves hotels in page 2
//          const pageSize=5;

//       //    In Express.js, req.query.page refers to the value of the page query parameter in a URL.
//       //The req.query object in Express.js is an object containing a property for each query parameter in the URL. Therefore, req.query.page specifically accesses the value of the page parameter.

//        const pageNumber=parseInt(
//            req.query.page ? req.query.page.toString() : "1"
//        )

//         const skip=(pageNumber-1)*pageSize;


//         const hotels=await Hotel.find().sort(sortOptions).skip(skip).limit(pageSize);

//       //   countDocuments(): This is a method provided by Mongoose's model object (Hotel in this case). The countDocuments() method is used to count the number of documents (records) in the MongoDB collection associated with the model.

//       //this will return an number (int type) -->total number of records in hotel model in database
//         const total=await Hotel.countDocuments();

//         const response={
//             data:hotels,
//             pagination:{
//                 total,
//                 page:pageNumber,
//                 pages:Math.ceil(total/pageSize),
//             }
//         }

//         res.json(response)
//       }
//       catch(error){
//             console.log("error",error);
//             res.status(500).json({message: "Something went wrong"});
//       }
// })

// //this function will interact with mongodb
// const constructSearchQuery = (queryParams: any) => {
//       let constructedQuery: any = {};
//       // constructedQuery.$or एक ऐरे असाइन करता है जिसमें दो ऑब्जेक्ट्स होते हैं। MongoDB में, $or ऑपरेटर का इस्तेमाल तब किया जाता है जब आप कई कंडीशन्स में से कोई भी सच होने पर डेटा ढूंढना चाहते हैं।

//       if (queryParams.destination) {
//             // { city: new RegExp(queryParams.destination, "i") } और { country: new RegExp(queryParams.destination, "i") } ये दोनों ऑब्जेक्ट्स हैं जो डेटाबेस में city और country फील्ड्स को queryParams.destination से मैच करने के लिए रेगुलर एक्सप्रेशन का उपयोग करते हैं। "i" ऑप्शन का मतलब है कि मैचिंग केस इनसेंसिटिव है, यानी बड़े और छोटे अक्षरों के बीच अंतर नहीं किया जाएगा।
//         constructedQuery.$or = [
//           { city: new RegExp(queryParams.destination, "i") },
//           { country: new RegExp(queryParams.destination, "i") },
//         ];
//       }
    
//       if (queryParams.adultCount) {
//         constructedQuery.adultCount = {
//           $gte: parseInt(queryParams.adultCount),
//         };
//       }
    
//       if (queryParams.childCount) {
//         constructedQuery.childCount = {
//           $gte: parseInt(queryParams.childCount),
//         };
//       }
    
//       if (queryParams.facilities) {
//         constructedQuery.facilities = {
//           $all: Array.isArray(queryParams.facilities)
//             ? queryParams.facilities
//             : [queryParams.facilities],
//         };
//       }
    
//       if (queryParams.types) {
//         constructedQuery.type = {
//           $in: Array.isArray(queryParams.types)
//             ? queryParams.types
//             : [queryParams.types],
//         };
//       }
    
//       if (queryParams.stars) {
//         const starRatings = Array.isArray(queryParams.stars)
//           ? queryParams.stars.map((star: string) => parseInt(star))
//           : parseInt(queryParams.stars);
    
//         constructedQuery.starRating = { $in: starRatings };
//       }
    
//       if (queryParams.maxPrice) {
//         constructedQuery.pricePerNight = {
//           $lte: parseInt(queryParams.maxPrice).toString(),
//         };
//       }
    
//       return constructedQuery;
//     };

// export default router;

import express, { Request, Response } from "express";
import Hotel from "../models/hotel";
import { BookingType, HotelSearchResponse } from "../shared/types";
import { param, validationResult } from "express-validator";
import Stripe from "stripe";
import verifyToken from "../middleware/auth";

const stripe=new Stripe(process.env.STRIPE_API_KEY as string);

const router = express.Router();

router.get("/search", async (req: Request, res: Response) => {
  try {
    const query = constructSearchQuery(req.query);

    let sortOptions = {};
    switch (req.query.sortOption) {
      // note1(trick):--> jayada se kam ke taraf -1 aayega
      //note2:-> sort wale functonality yaha se control ho rahi hai
      case "starRating":
        sortOptions = { starRating: -1 };
        break;
      case "pricePerNightAsc":
        sortOptions = { pricePerNight: 1 };
        break;
      case "pricePerNightDesc":
        sortOptions = { pricePerNight: -1 };
        break;
    }

    const pageSize = 5;
    const pageNumber = parseInt(
      req.query.page ? req.query.page.toString() : "1"
    );
    const skip = (pageNumber - 1) * pageSize;

    const hotels = await Hotel.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    const total = await Hotel.countDocuments(query);

    const response: HotelSearchResponse = {
      data: hotels,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    };

    res.json(response);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});


//note:--> ye wale get request search wale ke baad hi aayege warna express confuse ho jayega or error aa jayege
//thats why phele tou search ke get request se information reterive hone ke baad hi particular hotel ke information retrive hoge
router.get("/:id",[
      param("id").notEmpty().withMessage("Hotel id is required")
],async(req:Request,res:Response)=>{
       
      const errors=validationResult(req);
      if(!errors.isEmpty()){
           return res.status(400).json({errors:errors.array() });
      }

      const id=req.params.id.toString();

      try{
            const hotel=await Hotel.findById(id);
            res.json(hotel);
      }
      catch(error){
            console.log(error);
            res.status(500).json({message:"Error fetching hotel"});
      }
});

router.post("/:hotelId/booking/payment-intent",verifyToken,async(req:Request,res:Response)=>{
  //1) totalCost
  //2. hotelId
  //3. userID

    const {numberOfNights}=req.body;
    const hotelId=req.params.hotelId;

    const hotel=await Hotel.findById(hotelId);
    if(!hotel){
      return res.status(400).json({message:"Hotel not found!"});
    }

    const totalCost=hotel.pricePerNight*numberOfNights;

    const paymentIntent=await stripe.paymentIntents.create({
       amount:totalCost,
       currency:'inr',
       metadata:{
         hotelId,
         userId:req.userId 
       },
    });
    
    if(!paymentIntent.client_secret){
        return res.status(500).json({message:"Error creating Payment itent"});
    }

    const response={
      paymentIntentId:paymentIntent.id,
      clientSecret:paymentIntent.client_secret.toString(),
      totalCost,
    };

    res.send(response);
})

router.post('/:hotelId/bookings',verifyToken,async(req:Request,res:Response)=>{
    try{
      const paymentIntentId=req.body.paymentIntentId;

      //paymentIntent.retrieve is a method used to fetch details of a specific PaymentIntent
      // paymentIntent.retrieve is used to retrieve detailed information about a PaymentIntent object that has been previously created in Stripe's system.
      const paymentIntent=await stripe.paymentIntents.retrieve(
        paymentIntentId as string
      );

      if(!paymentIntent){
         return res.status(400).json({message:"Payment intent not found"});
      }
      
      // if booked hotelid not matches with the params hotelid and userid is not match with the authorized user

      if(
        paymentIntent.metadata.hotelId!=req.params.hotelId ||
        paymentIntent.metadata.userId!=req.userId){
        res.status(400).json({message:"payment intent mismatch"});
      }

      if(paymentIntent.status!="succeeded"){
        return res.status(400).json({message:`payment intent not succeed. Status: ${paymentIntent.status}`})
      }

      const newBooking:BookingType={
        ...req.body,
        userId:req.userId,
      };

      const hotel=await Hotel.findOneAndUpdate(
        {_id:req.params.hotelId},
        {
          $push:{bookings:newBooking},
        }
      );

      if(!hotel){
        return res.status(400).json({message:"hotel not found"});
      }

      await hotel.save();
      res.status(200).send();
    }
    catch(error){
       console.log(error);
       res.status(500).json({message:"something went wrong"});
    }
})

const constructSearchQuery = (queryParams: any) => {
  let constructedQuery: any = {};
  // { city: new RegExp(queryParams.destination, "i") } और { country: new RegExp(queryParams.destination, "i") } ये दोनों ऑब्जेक्ट्स हैं जो डेटाबेस में city और country फील्ड्स को queryParams.destination से मैच करने के लिए रेगुलर एक्सप्रेशन का उपयोग करते हैं। "i" ऑप्शन का मतलब है कि मैचिंग केस इनसेंसिटिव है, यानी बड़े और छोटे अक्षरों के बीच अंतर नहीं किया जाएगा।
  if (queryParams.destination) {
    constructedQuery.$or = [
      { city: new RegExp(queryParams.destination, "i") },
      { country: new RegExp(queryParams.destination, "i") },
    ];
  }

  if (queryParams.adultCount) {
    constructedQuery.adultCount = {
      $gte: parseInt(queryParams.adultCount),
    };
  }

  if (queryParams.childCount) {
    constructedQuery.childCount = {
      $gte: parseInt(queryParams.childCount),
    };
  }

  if (queryParams.facilities) {
    constructedQuery.facilities = {
      $all: Array.isArray(queryParams.facilities)
        ? queryParams.facilities
        : [queryParams.facilities],
    };
  }
   //$in operator mongodb ka operator hai ye check karta hai ki allowing MongoDB to find documents where the type field matches any of the specified values.(check karta hai ki jo values chaiya queryParams.types me wo)
  if (queryParams.types) {
    constructedQuery.type = {
      $in: Array.isArray(queryParams.types)
        ? queryParams.types
        : [queryParams.types],
    };
  }

  if (queryParams.stars) {
    const starRatings = Array.isArray(queryParams.stars)
      ? queryParams.stars.map((star: string) => parseInt(star))
      : parseInt(queryParams.stars);

    constructedQuery.starRating = { $in: starRatings };
  }

  if (queryParams.maxPrice) {
    constructedQuery.pricePerNight = {
      $lte: parseInt(queryParams.maxPrice).toString(),
    };
  }

  return constructedQuery;
};

export default router;