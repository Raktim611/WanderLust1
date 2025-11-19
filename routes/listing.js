const express=require("express");
const router=express.Router();
const wrapasync=require("../Utils/wrapasync.js");
const {listingSchema}=require("../schema.js");
const review=require("../models/review.js");
const ExpressError=require("../Utils/ExpressError.js");
const {reviewSchema}=require("../schema.js"); 
const listing=require("../models/listing.js");
const {isLoggedin, isOwner, isAuthor}=require("../middleware.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");

const upload = multer({ storage})


// router.get("/",(req,res)=>{
//     res.send("Project will be completed soon :) ");
// });

router.get("/",wrapasync(async(req,res)=>{
  let listingData= await listing.find({});
  
  res.render("./listings/index.ejs",{listingData});
}));



//New Route
router.get("/new",isLoggedin,(req,res)=>{
    
    res.render("./listings/new.ejs"); 
});

//Search By Country
router.get("/search",isLoggedin,wrapasync(async(req,res)=>{
    let{countryy}=req.query;
    let sortedData=await listing.find({country:countryy});
    if(sortedData.length>0){
          return res.render("./listings/sorted.ejs",{sortedData});
    }
    else{
        req.flash("error","We dont have any options there :) ");
       return res.redirect("/listings");
    }
   
}));




//Show route
router.get("/:id", wrapasync(async (req,res)=>{
    let {id}=req.params;
    let listingData=await listing.findById(id).populate({path:"review",populate:{path:"author"}}).populate("owner");
    if(!listingData){
    req.flash("error","The listing you are trying to access was deleted :) ");
     return res.redirect("/listings");
    }
    else{
        res.render("./listings/show.ejs",{listingData});
    }

}));

//Create Route
router.post("/",isLoggedin, upload.single("listing[image]"),wrapasync(async(req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    console.log(url,".....",filename);
let result=listingSchema.validate(req.body);
console.log(result);
if(result.err){
    throw new ExpressError(400,result.err);
}

let list=req.body.listing;
const newListing=new listing(list);
newListing.owner=req.user._id;
newListing.image={url,filename};
await newListing.save();
req.flash("success","New listing Added :) ");
res.redirect("/listings");


}));


//Edit route
router.get("/:id/edit", isLoggedin,isOwner, wrapasync(async (req,res)=>{
    let {id}=req.params;
    let listingData=await listing.findById(id);
    res.render("./listings/edit.ejs",{listingData});
})); 

//Update Route
router.put("/:id",isLoggedin,isOwner,upload.single("listing[image]"),wrapasync(async(req,res)=>{
    let {id}=req.params;
   
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid listing");
    }
   let updatedlisting= await listing.findByIdAndUpdate(id,{...req.body.listing});
   if(typeof req.file!=="undefined"){
    let filename=req.file.filename;
    let url=req.file.path;
   updatedlisting.image={url,filename};
   await updatedlisting.save();
   }
    req.flash("success","Your listing is updated :) ");
    res.redirect(`/listings/${id}`);
}));
 
//Delete Route 
router.delete("/:id", isLoggedin,isOwner,wrapasync(async(req,res)=>{
let {id}=req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success","Successfully deleted listing :) ");
    res.redirect("/listings"); 
}));
   
const validateReview=(req,res,next)=>{
    let {err}=reviewSchema.validate(req.body);
    if(err){
        throw new ExpressError(400,"Something went wrong :(");
    }
    else{
        next();
    }
};



//reviews
router.post("/:id/review",isLoggedin,validateReview,wrapasync(async(req,res)=>{

    let listings=await listing.findById(req.params.id);

    let newReview=new review(req.body.review);
    newReview.author=req.user._id;
    listings.review.push(newReview);
    await newReview.save();
    await listings.save();

    console.log("Successfully......");
    req.flash("success","New review added :) ");
    res.redirect(`/listings/${listings._id}`);

}));

//Delete Reviews
router.delete("/:id/review/:reviewId",isLoggedin,isAuthor,wrapasync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await listing.findByIdAndUpdate(id,{$pull:{review:reviewId}});
    await review.findByIdAndDelete(reviewId);
    req.flash("success","New review deleted :) ");
    res.redirect(`/listings/${id}`);


}));

router.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});



module.exports=router;



























































































