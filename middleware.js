const listing=require("./models/listing");
const review=require("./models/review");


module.exports.isLoggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
      req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in to create Listing");
      return  res.redirect("/login");
    }
    next();
};


module.exports.saveRedirecrUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();  
};

module.exports.isOwner= async(req,res,next)=>{
   let {id}=req.params;
   let Listing=await listing.findById(id);
   if(!Listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error","You are not the owner of the listing :) ");
    return res.redirect(`/listings/${id}`);
   }
   next();
};

module.exports.isAuthor=async (req,res,next)=>{
   let {id,reviewId}=req.params;
   let Review=await review.findById(reviewId);
   if(!Review.author._id.equals(res.locals.currUser._id)){
    req.flash("error","You are not the author of the review :) ");
    return res.redirect(`/listings/${id}`);
   }
   next();
}



























































































