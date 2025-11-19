const mongoose=require("mongoose");

const listing=require("../models/listing.js");
const initdata=require("./data.js");


main()
.then(()=>{
    console.log("Connected to DB");
})
.catch(()=>{
    console.log(err);
});


async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB=async ()=>{
   await listing.deleteMany({});
   initdata.data=initdata.data.map((obj)=>({...obj,owner:"691862af6c7a3e3ecd9a4d3a"}));
   await listing.insertMany(initdata.data);
   console.log("Data was initialized");
}

initDB();




























































































