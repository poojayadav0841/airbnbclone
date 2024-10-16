const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const flash=require("connect-flash");


const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");


const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const sessionOptions={
    secret:"mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 *60 *1000, // 7 days 24 hrs 60 min 60 sec 1000msec
        maxAge:7 * 24 * 60 *60 *1000,
        httpOnly: true,
    }
};

app.get("/",(req,res)=>{
    res.send("Hi, I'm root");
})

app.use(session(sessionOptions));
app.use(flash()); // always use before the routes such as listings , reviews

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    // console.log(res.locals.success);
    next();
});

// app.get("/testListing",async (req,res)=>{
//     let sampleListing=new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price:1200,
//         location:"Calungute, Goa",
//         country: "India",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");

// })





app.use("/listings",listings);

app.use("/listings/:id/reviews",reviews);

app.all("*",(req,res,next)=>{
    next (new ExpressError(404,"Page not found"));
})

//defining the middleware to handle the error
app.use((err,req,res,next)=>{
    let {status=500 , message="Something went wrong"}=err;
    // res.send("something went wrong");
    // res.status(status).send(message);
    res.status(status).render("error.ejs",{message});
})
app.listen(8080,()=>{
    console.log("server is listening on port 8080");
})