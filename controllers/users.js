const Listing=require("../models/listing");
const User=require("../models/user.js");
module.exports.rendersignupForm=(req,res)=>{
    res.render("users/signup.ejs");
};
module.exports.signup=async (req,res)=>{
    try{
    let {username,email,password}=req.body;
    const newUser=new User({email,username});
    const registereduser=await User.register(newUser,password);
    console.log(registereduser);
    req.login(registereduser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("s","Welcome to Wanderlust");
    res.redirect("/listings");
    });
}
    
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};
module.exports.renderloginForm=(req,res)=>{
    res.render("users/login.ejs");
};
module.exports.login=async(req,res)=>{
    req.flash("s","Welcome back to Wanderlust");
    let redirectUrl=res.locals.redirectUrl||"/listings"
    res.redirect(redirectUrl);
};
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
       if(err){
         return next(err);
       }
       req.flash("s","You successfully Logged out");
       res.redirect("/listings");
   
    });
};