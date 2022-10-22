const express= require("express")
const app =express();
const jwt= require("jsonwebtoken")
app.use(express.json())

const users=[
    {
        id:"1",
        username:"john",
        password:"john0908",
        isAdmin:true,
    },
    {
        id:"2",
        username:"jane",
        password:"jane0908",
        isAdmin:false,
    },
]

app.post("/api/login",(req,res)=>{
    const{username,password}=req.body;
    const user= users.find((u)=>{
        return u.username===username && u.password===password;
    })
    if(user){
        // res.json(user)
        //   Generate an access token
        const accessToken = jwt.sign({id:user.id, isAdmin:user.isAdmin},"mySecretKey");
        res.json({
            username: user.username,
            isAdmin: user.isAdmin,
            accessToken

        })
    }else{
        res.status(400).json("Username or pasword incorrect!!")
    }

})

const verify=(req,res,next)=>{
    const authHeader= req.headers.authorization;
    if(authHeader){
        const token= authHeader.split(" ")[1];
        jwt.verify(token,"mySecretKey",(err,user)=>{
            if(err){
                return res.status(401).json("Token is invalid")
            }
            req.user=user;
            next();
        })

    }else{
        res.status(401).json("you are not authenticated")
    }
}

app.delete("/api/users/:userId",verify,(req,res)=>{
    if(req.user.id === req.params.userId || req.user.isAdmin){
        res.status(200).json("User has been deleted")
    }
})


app.listen(5000,()=> console.log("Backend server connected"));