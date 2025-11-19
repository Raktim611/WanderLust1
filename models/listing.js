const mongoose=require("mongoose");
const revSchema=require("./review.js");
const listingSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image: {
  url:String,
  filename:String,
    
  
},

    price:Number,
    location:String,
    country:String,
    review:[
      {
        type:mongoose.Schema.Types.ObjectId,
        ref:"review",
      }
    ],
    owner:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await revSchema.deleteMany({_id:{$in:listing.review}});
  }
  
});

const listing=mongoose.model("listing",listingSchema);
 module.exports=listing;
 































































































