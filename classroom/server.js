const express=require("express");
const app=express();
const users=require("./routes/user.js");
const posts=require("./routes/post.js");
const cookieParser=require("cookie-parser");


app.use(cookieParser("secretcode"));

app.get("/getsignedcookies",(req,res)=>{
   res.cookie("made-in","India",{signed: true});
   res.send("signed cookie sent");
})

app.get("/verify",(req,res)=>{
  console.log(req.signedCookies);
  res.send("verified");
})

app.get("/setcookies",(req,res)=>{
  console.dir(req.cookies);
  res.cookie("greet","namaste");
  res.cookie("origin","India");
  res.send("we sent you a cookie");

})



app.get("/greet",(req,res)=>{
  let {name="anonymous "}=req.cookies;
  res.send(`Hi, ${name}`);
})

app.get("/",(req,res)=>{
    res.send("hi, i am root");
})



app.use("/users",users);
app.use("/posts",posts);



app.listen(3000,()=>{
    console.log("server is listening on port 3000");
  })


  //sample test for listing model of airbnb
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


