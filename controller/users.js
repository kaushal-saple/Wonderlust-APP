const User = require('../models/user');

module.exports.renderSignupForm = (req,res)=>{
    res.render("user/signup.ejs");
}

module.exports.signUp = async(req,res)=>{
    try{
        let {username,email,password} = req.body;
        const newUser = new User({username,email});
        let registerUser = await User.register(newUser,password);
        req.login(registerUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Wonderlust")
        res.redirect("/allListing");
        })
        
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("user/login.ejs")
}

module.exports.login = (req,res)=>{
    req.flash("success","welcome back to Wonderlust");

    let redirectUrl = res.locals.redirectUrl || "/allListing";
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are Logout!!");
        res.redirect("/allListing");
    })
}