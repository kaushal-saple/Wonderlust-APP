if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const MongoStore = require('connect-mongo');
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const allListingRoute = require("./routes/allListing.js");
const reviewsRoute = require("./routes/reviews.js");
const userRoute = require("./routes/userroute.js")




app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'/views'));
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);

app.use(express.static(path.join(__dirname, 'public')));


const dbUrl = process.env.ATLASDB_URL;

main().then((res)=>{
    console.log("connection successful");
})
.catch(err=>{
    console.log(err)
});


async function main(){
    await mongoose.connect(dbUrl);
};


//mongo Store
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24*60*60
})

store.on("error",(err)=>{
    console.log("error in mongo session storage",err);
})

//express-session
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now()+ 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}


app.get('/',(req,res)=>{
    res.send("Hii, this is root page");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curUser = req.user;
    next();
})



//allListing Express routess
app.use("/allListing", allListingRoute);
//review express routes
app.use("/allListing/:id/reviews",reviewsRoute);

//userRoute
app.use("/",userRoute);




//request does not match
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"))
})

//error handling middleware
app.use((err,req,res,next)=>{
    let{statusCode=500,message="something went wrong"} = err; 
    res.status(statusCode).render("Error.ejs",{err});
});

let port = 8080;
app.listen(port,()=>{
    console.log('working on server 8080');
})



