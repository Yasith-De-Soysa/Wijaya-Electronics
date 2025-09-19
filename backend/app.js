//pass = HJkvClyhhEK9YbXk

const express = require("express");
const mongoose = require("mongoose");
const router = require("./Routes/InventoryRoutes");
const crouter = require("./Routes/categoryRoutes");
const arouter = require("./Routes/productActivityLogsRoutes");

const app = express();
const cors = require("cors"); 

//Middleware

app.use(express.json());
app.use(cors());
app.use("/products",router);
app.use("/category",crouter);
app.use("/productActivityLog",arouter);

mongoose.connect("mongodb+srv://admin:HJkvClyhhEK9YbXk@cluster0.4ate570.mongodb.net/",)
.then(()=>console.log("Mongo DB Connected"))
.then(()=>{
    app.listen("5000");
})
.catch((err)=>console.log((err)));