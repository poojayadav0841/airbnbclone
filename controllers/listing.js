const Listing=require("../models/listing");
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeoCoding({ accessToken: mapToken });

module.exports.index=async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

 module.exports.renderNewForm=(req,res)=>{      
    res.render("listings/new.ejs");
};

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
    .populate({
        path: "reviews", 
        populate : {
        path: "author",
    }, 
    })
    .populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist !");
        res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs",{listing});
    
};

// module.exports.createListing=async(req,res,next)=>{
//      let response=await geocodingClient.forwardGeocode({
//         query: req.body.listing.location,
//         limit: 1,
//       })
//         .send();
     
//      let url=req.file.path;
//      let filename=req.file.filename;
//      let listing=req.body.listing;
//      const newListing=new Listing(listing);
//      newListing.owner=req.user._id;
//     //  console.log(req.user);
//      newListing.image={url,filename};
//      newListing.geometry=response.body.features[0].geometry;
//      let savedListing=await newListing.save();
//      console.log(savedListing);
//      req.flash("success","New listing created");
//      // console.log(listing);
//      res.redirect("/listings");
   
// };

module.exports.createListing = async (req, res, next) => {
    // If there's no user authenticated, this middleware will prevent execution here.
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged in to create a listing.");
        return res.redirect("/login");
    }

    try {
        let response = await geocodingClient.forwardGeocode({
            query: req.body.listing.location,
            limit: 1,
        }).send();

        let url = req.file.path;
        let filename = req.file.filename;

        let listing = req.body.listing;
        const newListing = new Listing(listing);

        newListing.owner = req.user._id;
        newListing.image = { url, filename };
        newListing.geometry = response.body.features[0].geometry;
        
        await newListing.save();
        req.flash("success", "New listing created");
      
        res.redirect("/listings");
    } catch (error) {
        req.flash("error", "Failed to create listing: " + error.message);
        res.redirect("/listings/new");
    }
};


module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist !");
        res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
};

module.exports.updateListing=async(req,res)=>{
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send valid data for listing");
    //  }

    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file !== "undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url, filename};
        await listing.save();
    }
    console.log(listing);
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    req.flash("success"," Listing Deleted");
    console.log(deletedListing);
    
    res.redirect("/listings");
 
 };