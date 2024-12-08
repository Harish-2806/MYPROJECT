const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const{listingSchema,reviewSchema}=require("../schema.js");
const Listing=require("../models/listing.js");
const{isLoggedIn,isOwner,validatelisting}=require("../middleware.js");
const listingController=require("../controllers/listing.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });


// router.get("/",wrapAsync(async (req,res)=>{
//     const allListings=await Listing.find({});
//     res.render("listings/index.ejs",{allListings});
// })
// );
router.get("/",wrapAsync(listingController.index));
router.get("/new",isLoggedIn,listingController.renderNewForm);
router.get("/:id",wrapAsync(listingController.showListing));
router.post("/",isLoggedIn,upload.single('listing[image]'),wrapAsync(listingController.createListing));
// router.post("/",upload.single('listing[image]'),(req,res)=>{
//    res.send(req.file);
//  });
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditform));
router.put("/:id",isLoggedIn,isOwner,upload.single('listing[image]'),wrapAsync(listingController.updateListing));
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));
module.exports=router;