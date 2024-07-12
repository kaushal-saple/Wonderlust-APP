const Listing = require('../models/listing');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req,res)=>{
    const listing = await Listing.find({});
    // console.log(allList);
    res.render("listing/index.ejs",{listing});
}

module.exports.renderNewForm = (req,res)=>{
    // console.log(req.user);
    res.render('listing/new.ejs');
}

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
            path:"author"
        }

    })
    .populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        res.redirect('/allListing')
    }
    res.render('listing/show.ejs',{listing});
}

module.exports.createListing = async (req,res,next)=>{

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send();

    // console.log(response.body.features[0].geometry);
    // res.send("Work done!!")


    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url);
    // console.log(filename);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    newListing.geometry = response.body.features[0].geometry;
    let savedListing = await newListing.save();
    // console.log(savedListing);

    req.flash("success","New Listing Created");
    res.redirect("/allListing");
}

module.exports.editListingForm = async (req,res)=>{
    let {id} = req.params;
   const listing = await Listing.findById(id);

   if(!listing){
    req.flash("error","Listing you requested for does not exist");
    res.redirect('/allListing')
}
   let originalImageUrl= listing.image.url;
   originalImageUrl= originalImageUrl.replace("/upload","/upload/w_300,h_300/");
   res.render("listing/edit.ejs",{listing,originalImageUrl});  
}

module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
    let updateListing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file!=="undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        updateListing.image = {url,filename};
        await updateListing.save();
    }
    
    req.flash("success","Listing Updated Successfully");
    res.redirect(`/allListing/${id}`);
}

module.exports.destroyListing = async (req,res)=>{
    let {id} = req.params;
    let deletedList = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted Successfully");
    res.redirect("/allListing");
}