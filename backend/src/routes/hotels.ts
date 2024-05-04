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
import { HotelSearchResponse } from "../shared/types";



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


const constructSearchQuery = (queryParams: any) => {
  let constructedQuery: any = {};

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