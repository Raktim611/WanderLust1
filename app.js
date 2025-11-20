if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const port=8080;
const listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsmate=require("ejs-mate");
const wrapasync=require("./Utils/wrapasync.js");
const ExpressError=require("./Utils/ExpressError.js");
const listingSchema=require("./schema.js");
const review=require("./models/review.js");
const reviewSchema=require("./schema.js");
const listingrouter=require("./routes/listing.js");
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const Localstrategy=require("passport-local");
const User=require("./models/user.js");

const userrouter=require("./routes/user.js");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsmate);
app.use(express.static(path.join(__dirname,"public")));

const dburl=process.env.ATLASDB_URL;
app.get("/",(req,res)=>{
res.redirect("/listings")
});
main() 
.then(()=>{
    console.log("Connected to DB");
})
.catch((err)=>{
    console.log(err);
});



async function main(){
    await mongoose.connect(dburl);
}

const store= MongoStore.create({
    mongoUrl:dburl,
    // crypto:{
    //     secret:"mysupersecretstring",
    // },
    touchAfter:24*60*60,
});

store.on("error",(err)=>{
    console.log("ERROR in MONGO SESSION STORE",err);
});
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:
    {
        // secure: process.env.NODE_ENV === "production",SS
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}


   
app.use(session(sessionOptions));
app.use(flash());



app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    
     res.locals.error=req.flash("error");
     res.locals.currUser=req.user;
    next();
});

// app.get("/demo",async(req,res)=>{
//     let fakeUser=new User({
//         email:"abc@gmail.com",
//         username:"Nonchalant"
//     });
//   let registeredUser= await User.register(fakeUser,"royalB");
//   res.send(registeredUser);

// });



app.use("/listings",listingrouter);
app.use("/",userrouter);



app.listen(port,()=>{
    console.log(`App is listening to the port ${port}`);
});



// app.get("/testlisting",async(req,res)=>{
// let samplelisting=new listing({
//     title:"My Home",
//     description:"By the beach",
//     price:1200,
//     location:"Digha,West Bengal",
//     country:"India"

// });
// await samplelisting.save();
// console.log("Sample was saved");
// res.send("Success Testing");
// });

//Index Route 




app.use((err,req,res,next)=>{
    let {status=500,message="Something went wrong"}=err;
    res.status(status).render("Error.ejs",{err});
    // res.status(status).send(message);
});























































































