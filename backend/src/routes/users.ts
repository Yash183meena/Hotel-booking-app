// //using name pural user because indicates rest convention

import express,{Request,Response} from 'express';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import {check, validationResult} from 'express-validator';
import verifyToken from '../middleware/auth';

const router=express.Router();
// express.Router() ka upyog karke aap Express mein sub-routes ko organize aur manage kar sakte hain

router.get("/me", verifyToken, async (req: Request, res: Response) => {
      const userId = req.userId;
    
      try {
        const user = await User.findById(userId).select("-password");
        if (!user) {
          return res.status(400).json({ message: "User not found" });
        }
        res.json(user);
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
      }
    });


// app.post() middleware is an essential part of building web applications with Express.js as it allows you to handle POST requests and process data submitted by users.
router.post("/register",[
      //adding some middleware

      //by using check middleware apn check kar skate hai ki
      //ye properties exixts (in the body of request) karne hi chaiye api/users/register me
      check("firstName","First name is required").isString(),
      check("email","Email is required").isEmail(),
      check("password","Password with 6 or more character is required").isLength({min:6}),
      check("lastName","Last Name is required").isString(),
],async (req:Request,res:Response)=>{

     // if any errors occurs
      const errors=validationResult(req);

      if(!errors.isEmpty()){
            console.log("backen start karo");
           return res.status(400).json({message:errors.array()});
      } 

      try{
            let user=await User.findOne({
                  email:req.body.email,
            });
             
            if(user){
                  return res.status(400).json({message:"User already exists"});
            }
            
             //create new user form
             //we access the form data from req.body
             //req.body me user ke dwara bheja gaya data hota hai jo website ke form se bheja jata hai
            user=new User(req.body);
            
            //save to database
            await user.save();
            
            //create jsaonweb token
            const token=jwt.sign({userId:user.id},process.env.JWT_SECRET_KEY as string,{expiresIn:"7d"}
            
          );

          //cookie bana rahi hai jo pass karege browser me jisme data pada hoda matlab token pada hoga

          res.cookie("auth_token",token,{

             //means only access from the server
             httpOnly:true,

             //means jab apan development stage par hai tou https ka fayada nahai hai jab app complete aur production level par hai tab bj do https 
             secure:process.env.NODE_ENV==="production",
             maxAge:604800000 ,
          });

          //agr ap res.sendStatus karenge tou preview me bas ok aayega

          //but ab apn ne res.status kiya hai tou message ka object aa jayega
          return res.status(200).json({message:"User registered OK"});

      }
      catch(error){
            console.log("Error is that:-->",error);
            res.status(500).send({message:"something went wrong!"});
      }
})

export default router;


