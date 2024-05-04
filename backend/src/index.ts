import express,{Request,Response} from 'express';
import cors from 'cors';
import "dotenv/config";
import mongoose from 'mongoose';
import userRoutes from './routes/users';
import authRoutes from './routes/auth';
import cookieParser from 'cookie-parser'
import path from 'path';
import {v2 as cloudinary} from "cloudinary";
import myhotelRoutes from "./routes/my-hotels"
import hotelRoutes from "./routes/hotels";

cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
})


//connect node server to mongoDb database
mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);
console.log("DATABASE CONNECTED SUCCESSFULLY")

const app=express();
app.use(express.json());
// Toh, jab aap app.use(cookieParser()) ka istemal karte hain, aap apne Express.js application ko keh rahe hain ki wo har incoming request ke liye cookieParser middleware ka istemal kare. Ye middleware cookies ko parse karega jo request mein shamil hain aur unhe req.cookies mein available karayega 
app.use(cookieParser())
app.use(express.urlencoded({extended:true}));
app.use(cors(
      {
            origin:process.env.FRONTEND_URL,
            credentials:true
      }
));


//frontend static assets that will serves on the url where the backend runs on
//express.static is an middleware function serve static files such as css,images,js
//this practise is only for deployment

app.use(express.static(path.join(__dirname,"../../frontend/dist")));

//using the use middleware for the checking routing and proceed to  userRouter
app.use('/api/auth',authRoutes)
app.use('/api/users',userRoutes);
app.use('/api/my-hotels',myhotelRoutes)
app.use('/api/hotels',hotelRoutes);

app.get('*',(req:Request,res:Response)=>{
      //by __dirname represents the directory name of current module
      res.sendFile(path.join(__dirname,"../../frontend/dist/index.html"));
})

app.listen(7000,()=>{
      console.log("Server is running on the localhost 7000");
});