const passport = require('passport');
const User=require("../models/user");

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
};


module.exports.signup=async(req,res)=>{
    try{

        let {username, email, password }=req.body;
        const newUser=new User({ email, username});
    
        const registeredUser=await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
           if(err){
            return next(err);
           }
           req.flash("success","Welcome to WanderLust");
           res.redirect("/listings");        
        });
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    } 
 };

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
};

// module.exports.login=async(req,res)=>{
//     // res.send("Welcome to WanderLust ! You're logged in");
//     req.flash("success","Welcome back to WanderLust !");
//     // res.redirect("/listings");
//     //to check if redirectUrl is empty?
//     let redirectUrl=res.locals.redirectUrl || "/listings";
//     res.redirect(redirectUrl);
// };

module.exports.login = async (req, res, next) => {
    req.flash("success", "Welcome back to WanderLust!");

    // The login method provided by passport will take care of checking credentials
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err); // Passes the error to the error handler
        }
        if (!user) {
            req.flash("error", "Invalid username or password.");
            return res.redirect("/login"); // Redirect back to login if user not found
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err); // Passes the error to the error handler
            }
            // Successfully logged in, redirect to the specified URL or listings
            let redirectUrl = res.locals.redirectUrl || "/listings";
            res.redirect(redirectUrl);
        });
    })(req, res, next); // Make sure to call the function with req, res, next
};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","you are logged out now!");
        res.redirect("/listings");
    });
};