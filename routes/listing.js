// const express=require("express");
// const router=express.Router();

// const wrapAsync=require("../utils/wrapAsync.js");
// const Listing=require("../models/listing.js");
// const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");

// const listingController=require("../controllers/listing.js");

// const multer  = require('multer')
// const {storage}=require("../cloudConfig.js");
// const upload = multer({ storage });

// router
// .route("/")
// .get(wrapAsync(listingController.index))
// .post(
//     isLoggedIn,
    
//     upload.single('listing[image][url]'),
//     validateListing,
//     wrapAsync(listingController.createListing)
// );

// // .post(upload.single('listing[image][url]'),(req,res)=>{
// //     res.send(req.file);
// // });

// //New Route //written befor bcz new is treated as id after add id in the url in show route
// router.get("/new",isLoggedIn,listingController.renderNewForm);


// router.route("/:id")
// .get(wrapAsync(listingController.showListing))
// .put(
//     isLoggedIn,
//     isOwner,
//     upload.single('listing[image][url]'),
//     validateListing,
//     wrapAsync(listingController.updateListing))
// .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

// // //Index Route
// // router.get("/",wrapAsync(listingController.index));




// // //show Route
// // router.get("/:id",wrapAsync(listingController.showListing));

// // //Create Route
// // router.post("/",
// //     isLoggedIn,
// //     validateListing,
// //     wrapAsync(listingController.createListing)
// // );

// //Edit route
// router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

// // //update Route
// // router.put("/:id",
// //     isLoggedIn,
// //     isOwner,
// //     validateListing,
// //     wrapAsync(listingController.updateListing));

// // // delete route
// // router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

// module.exports=router;


const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Index Route
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single('listing[image][url]'),
        validateListing,
        wrapAsync(listingController.createListing)
    );

// New Listing Form Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Routes for individual listings
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
        isLoggedIn,
        isOwner,
        upload.single('listing[image][url]'),
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;