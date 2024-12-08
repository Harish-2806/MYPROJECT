if(process.env.NODE_ENV !="production"){
require('dotenv').config();
}
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const methodOverride=require("method-override");
const path=require("path");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const MongoStore = require("connect-mongo");
const  flash=require("connect-flash");
const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

const ejsmate=require("ejs-mate");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.urlencoded({entended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));
app.engine("ejs",ejsmate);

const dbUrl=process.env.ATLASDB_URL;
main().then(()=>{console.log("connected to databaase");})
.catch((err)=>{console.log(err);})
async function main()
{
    await mongoose.connect(dbUrl);
}

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600,
});
store.on("error",()=>{
   console.log("ERROR IN MONGO SESSION STORE",err);
});
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:Date.now()+7*24*60*60*1000,
        httpOnly:true
    }

};



app.use(session(sessionOptions));
 app.use(flash());
 app.use(passport.initialize());
 app.use(passport.session());
 passport.use(new LocalStrategy(User.authenticate()));
 passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    res.locals.s=req.flash("s");
    res.locals.error=req.flash("error");
    res.locals.curUser=req.user;
    next();
}
);
// app.get("/demouser",async (req,res)=>{
//     let fakeUser=new User({
//         email:"mme@gmail.com",
//         username:"mallddystudent",
//     });
//     let newuser=await User.register(fakeUser,"hello");
//     res.send(newuser);
// });
app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

// app.get("/testListing",async (req,res)=>{
//     let sampleListing=new Listing({
//         title:"MY VILLA",
//         description:"In the heart of the city ",
//         price:3000,
//         location:"kukatpally,Hyderabad",
//         country:"India"
//     });
// await sampleListing.save();
// console.log("sample was saved");
// res.send("succesful testing");
// });
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found!"));
})
app.use((err,req,res,next)=>{
   let {statusCode=500,message="something went wrong!"}=err;
   res.render("error.ejs",{message});
//    res.status(statusCode).send(message);
})
app.listen(8080,()=>{console.log("server is listening at port 8080")});