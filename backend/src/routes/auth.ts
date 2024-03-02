import express,{Request,Response} from 'express';
import { check, validationResult } from 'express-validator';
import User from '../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import verifyToken from '../middleware/auth';

const router=express.Router();

router.post('/login',
      
      [
      check("email","Email is required").isEmail(),
      check("password","Password with 6 or more character is required ").isLength({min:6})
      ]
 ,async (req:Request,res:Response)=>{
    
       const errors=validationResult(req);
       if(!errors.isEmpty()){
            return res.status(400).json({message:errors.array()});
       }

       const {email,password}=req.body;

       try{
            const user=await User.findOne({email});

            if(!user){
               return res.status(404).json({message:"Invalid Credentials"});
            }
   
            //it is code to compare the palin text password with the hashed password stored in the database

            const isMatch=await bcrypt.compare(password,user.password);

            if(!isMatch){
                  return res.status(400).json({message:"Invalid Credentials"});
            }

            const token=jwt.sign({userId:user.id},process.env.JWT_SECRET_KEY as string,{expiresIn:"7d"});

            res.cookie("auth_token",token,{
                  httpOnly:true,
                  secure:process.env.NODE_ENV==="production",
                  maxAge:604800000 
            })

            //userId passes for keep track of current user for accessing its token and better user experience
            //if token is not pased a
            //the user id helps to keep track of user
            return res.status(200).json({userId:user._id});
       }
       catch(error){
            console.log(error);

            //this is for server error
            return res.status(500).json({message:"Something went wrong"});
       }

})

//for getting some information
//verifyToken is the middleware
router.get("/validate_token",verifyToken,(req:Request,res:Response)=>{
      //we make an userId in the verify token beacuse they can be accessed in this userId  in  middleware directory

      //is user id bhejne ki wajay se network ke response me userid milege
      return res.status(200).send({userId:req.userId})
})

router.post('/logout',(req:Request,res:Response)=>{

      //The code res.cookie("auth_token", "", { expires: new Date(0) }) is used to delete the cookie named "auth_token" by setting its expiration date to a past date.token ki jagah empty string de do delete karte time par
      res.cookie("auth_token","",{
            expires:new Date(0)
      })

      //yaha par res.send karne ne network me 200 ok aaya warna fetching status pending tha
      res.send();
})

export default router;