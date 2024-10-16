const express=require("express");
const router=express.Router();

//POST ROUTE
//Index-users
router.get("/",(req,res)=>{
    res.send("GET for posts");
})

//SHOW-posts
router.get("/:id",(req,res)=>{
    res.send("SHOW for post");
})

//POST-posts
router.get("/",(req,res)=>{
    res.send("POST for post");
})

//DELETE-posts
router.delete("/:id",(req,res)=>{
    res.send("DELETE for post");
})



module.exports=router;