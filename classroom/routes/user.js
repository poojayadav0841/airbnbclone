const express=require("express");
const router=express.Router();

//Index-users
router.get("/",(req,res)=>{
    res.send("GET for users");
})

//SHOW-users
router.get("/:id",(req,res)=>{
    res.send("SHOW for users");
})

//POST-users
router.get("/",(req,res)=>{
    res.send("POST for users");
})

//DELETE-users
router.delete("/:id",(req,res)=>{
    res.send("DELETE for users");
})

module.exports=router;
