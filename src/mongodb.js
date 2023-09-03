const mongoose=require("mongoose")
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
.then(()=>{
    console.log("mongodb connected huehue");
})
.catch(()=>{
    console.log('failed to connect huehue');
})

const logInSchema=new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    confirmpassword:{
        type:String,
        required:true
    }


})

const collection=new mongoose.model('LogInCollection',logInSchema)

module.exports=collection;