const express=require("express");
const router=express.Router();

const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema}=require("../Schema.js");
const Listing=require("../models/listing.js");

const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    // console.log(result);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

//Index Route
router.get("/",wrapAsync(async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

//New Route //written befor bcz new is treated as id after add id in the url in show route
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
})


//show Route
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","Listing you requested for does not exist !");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
    
}));

//Create Route
router.post("/",
    validateListing,
    wrapAsync(async(req,res,next)=>{

    

    //  if(!req.body.listing){
    //     throw new ExpressError(400,"Send valid data for listing");
    //  }

     // let{ title, description, image, price, location, country }=req.body;

     let listing=req.body.listing;
     const newListing=new Listing(listing);

    //  if(!newListing.title){
    //     throw new ExpressError(400,"title is missing");
    //  }

    //  if(!newListing.description){
    //     throw new ExpressError(400,"description is missing");
    //  }

    //  if(!newListing.location){
    //     throw new ExpressError(400,"location is missing");
    //  }

     await newListing.save();
     req.flash("success","New listing created");
     // console.log(listing);
     res.redirect("/listings");
   
}))

//Edit route
router.get("/:id/edit",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist !");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
}));

//update Route
router.put("/:id",
    validateListing,
    wrapAsync(async(req,res)=>{
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send valid data for listing");
    //  }
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:id",wrapAsync(async (req,res)=>{
   let {id}=req.params;
   let deletedListing=await Listing.findByIdAndDelete(id);
   console.log(deletedListing);
   req.flash("success"," Listing Deleted");
   res.redirect("/listings");

}));

module.exports=router;