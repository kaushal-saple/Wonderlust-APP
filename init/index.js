const mongoose = require('mongoose');
const initdata = require('../init/data');
const Listing = require('../models/listing');

const MONGO_URL = 'mongodb://127.0.0.1:27017/Wonderlust';
main().then((res)=>{
    console.log("connection successful");
})
.catch(err=>{
    console.log(err)
});


async function main(){
    await mongoose.connect(MONGO_URL);
};

const initDB = async ()=>{
    await Listing.deleteMany({});
    initdata.data= initdata.data.map((obj)=>({...obj, owner:"667a60842cb2be2d3dc9e759"}))
    await Listing.insertMany(initdata.data);
    console.log("data successfully added");
}

initDB();