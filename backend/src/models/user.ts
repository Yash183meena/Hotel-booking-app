import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
//ye UserType TypeScript me banaye jaate hai jo ki jankarii(information/structure of model) ko batata hai take hame pata chal sake ki har user object me kon kon se properties hai

//ye sirf Typescript me hote hai javascript me nahi hote
export type UserType={
      _id:string,
      password:string,
      firstname:string,
      lastname:string,
      email:string,
}

const userSchema=new mongoose.Schema({
    email:{type:String,required:true,unique:true,},
    password:{type:String,required:true},
    firstName:{type:String,required:true},
    lastName:{type:String,required:true}
});


userSchema.pre("save", async function (next) {
      
      if (this.password && this.isModified("password")) {
        this.password=await bcrypt.hash(this.password, 8);
      }
      next();
});

const User=mongoose.model<UserType>("User",userSchema);

export default User;

