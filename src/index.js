const express=require("express")
const path=require("path")
const app=express()
const hbs=require("hbs")
const collection=require("./mongodb")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const {google} = require("googleapis")
require('dotenv').config();

const templatePath =path.join(__dirname,'../templates')

//complete forgot password email api and process
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI ='https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN})

async function sendMail(email, link) {
    try {
        const accessToken = await oAuth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth:{
                type: 'OAuth2',
                user: 'deepjyoti2301@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        })

        const mailOptions = {
            from: 'Healthy Hangouts <deepjyoti2301@gmail.com>',
            to: email,
            subject: "Healthy hangouts Password reset",
            text: link
        };
        const result = await transport.sendMail(mailOptions);


        
    } catch (error) {
        return error;
        
    }

}

   


app.use(express.static('public'));//to load css files and images

app.use(express.json())
app.set("view engine","hbs")
app.set("views",templatePath)

app.use(express.urlencoded({extended : false}))


const JWT_SECRET = process.env.JWT_SECRET;

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

app.get('/reset-password/:id/:token', async(req, res, next)=>{
    const { id, token} = req.params;
    //checking the id exists in database
    try{
    const check=await collection.findOne({_id: id})
    
  
    // valid id valid user
    const secret = JWT_SECRET + check.password;
    
        const payload = jwt.verify(token, secret)
        res.render('reset-password', {email: check.email});
    
}   catch (error) {
        console.log(error.message);
        res.send(error.message);
    
    }
})

app.post('/reset-password/:id/:token', async(req, res, next)=>{
    const { id, token} = req.params;
    const { password1, password2 } = req.body;

    console.log(password1);
    console.log(token);

     //checking the id exists in database
    const check=await collection.findOne({_id: id})

    
     // valid id valid user
    const secret = JWT_SECRET + check.password; console.log(secret);
    const payload = jwt.verify(token, secret); console.log(payload);

        if(req.body.password1 === req.body.password2){
            console.log("Succes");
            
            const adata = await collection.findByIdAndUpdate({_id: id},{
                $set : {
                    password: req.body.password1,
                    confirmpassword: req.body.password2
                }
            });
            console.log("Successful"); 
            res.render('sign-in');
        }else {
            res.send("Retry");
        }
        }

        

    
    )

app.get('/forgot-password', (req, res, next)=>{
    res.render('forgot-password');
})

app.post('/forgot-password', async(req, res, next)=>{
    try{
        const check=await collection.findOne({email: req.body.email})
        
        if(check.email === req.body.email){
            const secret = JWT_SECRET + check.password;
            const email = check.email;
        const payload = {
        email: check.email,
        id: check.id,
        };
    const token = jwt.sign(payload, secret, {expiresIn: '15m' });
    const link = `http://localhost:3000/reset-password/${check.id}/${token}`;
    console.log(link);
    
    sendMail(email, link).then(result => console.log('Email sent', result));
   
    
    res.send('<h1>Password reset link has been sent in your mail</h1>');
        }else{
           alert("Wrong email")
        }
    }
    catch{
        res.send("Wrong details");
    }  
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

app.listen(process.env.PORT || 3000,()=>{
    console.log('port connected at http://localhost:3000/');
})