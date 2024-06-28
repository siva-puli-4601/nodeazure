var express=require("express")
var app=express();
app.use(express.json())
const jwt = require('jsonwebtoken');
const users=[
    {
        "uname":"siva",
        "password":"siva@123"
    },
    {
        "uname":"puli",
        "password":"puli@123"
    }
]
var tokenini=undefined;

//login and creating token

app.post("/login",(req,res)=>
{
    const {uname,password}=req.body;
    const user=users.find(u=>u.uname===uname && u.password==password);
    if(!user)
        return res.json({login:"failed to login"});
    jwt.sign({uname:user.uname,password:user.password},"1234",(err, token)=> {
        if (err) {
            console.error('Error generating JWT:', err);
            return res.status(500).json({ message: 'Failed to generate token' });
        }
        tokenini=token;
        res.json({ message: 'Login successful', token });
    });
})

// middleware for every time to check the tokens

 app.use("/api",(req,res,next)=>
    { 
        if(!tokenini)
        return res.json({msg:"token not created"});
          jwt.verify(tokenini,"1234",(err,decode)=>
         {
        if(err)
            return res.json({masg:"token not validate"});
        next();
    })
})

// showing all users using post method
app.get("/api/users",(req,res)=>
{
   return res.json(users);
})

// add user into the array
app.post("/api/adduser",(req,res)=>
{
    const {uname,password}=req.body;
    users.push({"uname":uname,"password":password});
    res.status(200).json({msg:"inserted sucessfully"})
})
app.listen(8000);