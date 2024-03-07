const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const crypto = require('crypto');

app.use(express.json());
app.use(cors());

//Database Connection
mongoose.connect("connect your mango db");

app.get("/",(req, res)=>{
    res.send("Expres App is Running");
})

//Image store engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb)=>{
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage})

//Creating upload Endpoint 
app.use('/images',express.static('upload/images'));

app.post("/upload", upload.single('product'),(req, res)=>{
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
})

//Schema for creating products
const Product = mongoose.model("Product", {
    id:{
        type: Number,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    new_price:{
        type: Number,
        required: true
    },
    old_price:{
        type: Number,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },
    available:{
        type: Boolean,
        default: true
    }
})

app.post('/addproduct', async(req, res)=>{
    let products = await Product.find({});
    let id;
    if(products.length>0){
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id+1
    } else {
        id = 1;
    }
    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    });
    await product.save();
    res.json({
        success:true,
        name:req.body.name
    })
})

//Creating API for deleting products
app.post('/removeproduct', async(req, res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    res.json({
        success:true,
        name:req.body.name
    })
})

//Creating API for getting all products
app.get('/allproducts', async(req, res)=>{
    let products = await Product.find({});
    res.send(products);
})

//Creating endpoint for newcollection data
app.get('/newcollections', async(req, res)=>{
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    res.send(newcollection);
})

//Creating endpoint for popular in women section data
app.get('/popularinwomen', async(req, res)=>{
    let products = await Product.find({category:"women"});
    let popular_in_women = products.slice(0,4);
    res.send(popular_in_women);
})


//Schema for creating User Model
const Users = mongoose.model("Users", {
    name:{
        type: String,
    },
    email:{
        type: String,
        unique: true
    },
    password:{
        type: String,
    },
    cartData:{
        type: Object,
    },
    date:{
        type: Date,
        default: Date.now
    }
})

//Creating Endpoint for registering the user
app.post('/signup', async(req, res)=>{
    let check = await Users.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false, errors:"existing user found with same email address"})
    }
    let cart = {};
    for(let i=0; i<300; i++){
        cart[i]=0;
    }
    const user = new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })
    await user.save();
    const data ={
        user:{
            id:user.id
        }
    }
    const token = jwt.sign(data,'secret_ecom');
    res.json({success:true, token})
})

//Creating endpoint for user login
app.post('/login', async (req, res)=>{
    let user = await Users.findOne({email:req.body.email});
    if(user){
        const passCompare = req.body.password === user.password;
        if(passCompare){
            const data ={
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data, 'secret_ecom');
            res.json({ success: true, token });
        }
        else{
            res.json({success:false, errors:"Wrong Password"});
        }
    }
    else{
        res.json({success:false, errors:"Wrong Email Id"});
    }
})

//Creating middleware to fetch user
const fetchUser = async(req, res,next)=>{
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({errors: "Please authenticate using valid token"});
    } else {
        try{
            const data = jwt.verify(token, 'secret_ecom');
            req.user = data.user;
            next();
        } catch(error){
            res.status(401).send({errors:"Please authenticate using a valid token"});
        }
    }
}


//Creating endpoint for adding products in cart data
app.post('/addtocart',fetchUser, async(req, res)=>{
    let userData = await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Product Added")
})

//Creating endpoint to remove product from cart data
app.post('/removefromcart', fetchUser, async (req, res) => {
    let userData = await Users.findOne({ _id: req.user.id });
    if (userData.cartData[req.body.itemId] > 0)
        userData.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.json({ message: "Product Removed" }); // Sending JSON response
});

//Creating endpoint to get cartdata
app.post('/getcart',fetchUser,async(req,res)=>{
    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
})


//Schema for creating User Model
const UserDetails = mongoose.model("UserDetails", {
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users' 
    },
    address: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    pincode: {
        type: String,
    },
    mode:{
        type: String,
    }
})

//Creating endpoint for adding products in cart data
app.post('/adduserDetail',fetchUser, async(req, res)=>{
    let userData = await Users.findOne({_id:req.user.id});
    if (userData) {
        let userDetails = await UserDetails.findOne({ user_id: req.user.id });
        if (userDetails) {
            const updateDetails = {
                address: req.body.address,
                city: req.body.city,
                state: req.body.state,
                country: req.body.country,
                pincode: req.body.pincode,
                mode: req.body.mode
            };
            await UserDetails.updateOne({ user_id: req.user.id }, { $set: updateDetails });
            res.json({ success: true, message: 'UserDetails updated successfully' });
        }else {
            const newUserDetails = new UserDetails({
                user_id: req.user.id,
                address:req.body.address,
                city:req.body.city,
                state:req.body.state,
                country:req.body.country,
                pincode:req.body.pincode,
                mode:req.body.mode,
            });
            await newUserDetails.save();
            res.json({ success: true, message: 'UserDetails Added successfully' });
        }
    }
})


//API Creation
app.listen(port, (error)=>{
    if(!error){
        console.log("Server Running on Port" +port);
    } else{
        console.log("Error : " + error)
    }
})