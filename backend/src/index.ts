import express,{Request,Response} from 'express';
import cors from 'cors';
import "dotenv/config";
import mongoose from 'mongoose';
import userRoutes from './routes/users';
import authRoutes from './routes/auth';
import cookieParser from 'cookie-parser'
import path from 'path';

const app=express();

//connect node server to mongoDb database
mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);
console.log("DATABASE CONNECTED SUCCESSFULLY")

app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({extended:true}));
app.use(cors(
      {
            origin:process.env.FRONTEND_URL,
            credentials:true
      }
));


//frontend static assets that will serves on the url where the backend runs on
//this practise is only for deployment
app.use(express.static(path.join(__dirname,"../../frontend/dist")));

//using the use middleware for the checking routing and proceed to  userRouter
app.use('/api/auth',authRoutes)
app.use('/api/users',userRoutes);

app.listen(7000,()=>{
      console.log("Server is running on the localhost 7000");
});