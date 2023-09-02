const mongoose=require("mongoose")

mongoose.connect("mongodb+srv://Rahul:Wbgho3fh9GZq6JmZ@cluster0.vtxzbid.mongodb.net/?retryWrites=true&w=majority")
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