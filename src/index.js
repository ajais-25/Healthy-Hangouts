const express=require("express")
const path=require("path")
const app=express()
const hbs=require("hbs")
const collection=require("./mongodb")

const templatePath =path.join(__dirname,'../templates')



app.use(express.static('public'));//to load css files and images

app.use(express.json())
app.set("view engine","hbs")
app.set("views",templatePath)

app.use(express.urlencoded({extended : false}))




app.get('/',(req,res)=>{
    res.render('landing-page')
}) 
app.get('/home',(req,res)=>{
    res.render('home')
})

 

app.get('/signup',(req,res)=>{
    res.render('sign-up')
})

app.get('/signin',async(req,res)=>{
    res.render('sign-in');
    })


app.post('/signup',async(req,res)=>{
    const data = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password : req.body.password,
        confirmpassword : req.body.confirmpassword

    }
    await collection.insertMany([data])
if(req.body.confirmpassword === req.body.password){
    res.render('home')//directed to home page after signup
}else{
    res.send('password and confirm password must be same!!!')
}
    
})


app.post('/signin',async(req,res)=>{
try{
    const check=await collection.findOne({email: req.body.email})
    
    if(check.password === req.body.password){
        res.render('home')
    }else{
       alert("Wrong Password")
    }
}
catch{
    res.send("Wrong Details")
}


    res.render('home')//directed to home page after login


})

app.listen(3000,()=>{
    console.log('port connected');
})