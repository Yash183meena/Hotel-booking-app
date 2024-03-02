import { NextFunction,Request,Response } from "express";
import jwt,{JwtPayload} from 'jsonwebtoken';

declare global{
      namespace Express{
            interface Request{
                  userId:string;
            }
      }
}

const verifyToken=(req:Request,res:Response,next:NextFunction)=>{
      
      //this is the request object(property) in the  express.js where we can access the property of the object. In req.cookie we will access the cookie sent by the client in the HYYP server
      const token=req.cookies["auth_token"];

      //checking token it is exist or not
      if(!token){
            return res.status(401).json({message:"Unauthorized"})
      }

      try{

            const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY as string);
            
            //for extrat user id from token
            
            req.userId=(decoded as JwtPayload).userId
            next();

      }catch(error){
            return res.status(401).json({message:"Unauthorized"})
      }
}

export default verifyToken;