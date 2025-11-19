const mongoose=require("mongoose");
const reviewSchema=new mongoose.Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5
    },
    created_at:{
        type:Date,
        default:Date.now(),
    },
    author:{
        // type:mongoose.schema.Types.ObjectId,
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }

});

const review=mongoose.model("review",reviewSchema);

module.exports=review;































































































