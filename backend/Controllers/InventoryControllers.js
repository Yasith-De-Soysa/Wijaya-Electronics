const Inventory = require("../Model/InventoryModel");
const Category = require("../Model/CategoryModel");

//Display products

const getAllProducts = async(req, res, next)=>{
    let products;

    try{
        products = await Inventory.find().populate('category','categoryName -_id');
    }
    catch (err){
        console.log(err);
    }

    if(!products) {
        return res.status(404).json({message : "Products not found..."});
    }

    return res.status(200).json({products});
};


//Insert products
const addProducts = async(req, res, next) =>{

    const {productName,category,quantity,reorderLevel,price,maximumDiscountedPrice} = req.body;

    let products;

    try{
        products = new Inventory({productName,category,quantity,reorderLevel,price,maximumDiscountedPrice});
        await products.save();
    }
    catch (err){
        console.log(err);
    }

    if(!products){
        return res.status(404).json({message: "Unable to add products to inventory."});
    }
    return res.status(200).json({products});

};

//find products by id

const getById = async (req, res, next)=>{
    const  id= req.params.id;

    let product;

    try{
        product= await Inventory.findById(id);
    }
    catch (err){
        console.log(err);
    }

    if(!product){
        return res.status(404).json({message: "Product not found!"});
    }
    return res.status(200).json({product});
};


const getProductsByCategory = async (req, res, next) => {
  const { c } = req.query;

  try {
    const allProducts = await Inventory.find()
      .populate('category', 'categoryName');

    const filtered = allProducts.filter(p =>
      p.category?.categoryName.toLowerCase().includes(c.toLowerCase())
    );

    return res.status(200).json({ results: filtered });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};


const getProductsByQuantity = async (req, res, next) => {
  const { qt } = req.query;

  if (!qt || isNaN(qt)) {
    return res.status(400).json({ message: "Invalid quantity query" });
  }

  try {
    const allProducts = await Inventory.find().populate('category', 'categoryName');

    const filtered = allProducts.filter(p => p.quantity < parseInt(qt));

    return res.status(200).json({ results: filtered });
  } catch (err) {
    console.log("Error filtering by quantity:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


const getFilteredProducts = async (req, res) => {
  const { c, qt } = req.query;

  try {
    const allProducts = await Inventory.find().populate('category', 'categoryName');
    let filtered = allProducts;

    // If both category and quantity are provided
    if (c && qt) {
      filtered = filtered.filter(p =>
        p.category?.categoryName?.toLowerCase().includes(c.toLowerCase()) &&
        p.quantity < parseInt(qt)
      );
    }
    // If only category is provided
    else if (c) {
      filtered = filtered.filter(p =>
        p.category?.categoryName?.toLowerCase().includes(c.toLowerCase())
      );
    }
    // If only quantity is provided
    else if (qt) {
      filtered = filtered.filter(p => p.quantity < parseInt(qt));
    }

    return res.status(200).json({ results: filtered });
  } catch (err) {
    console.log("Filter error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};




//search products
const searchProduct = async (req, res, next)=>{
    const {q} = req.query;
    let results;

    try{
        results = await Inventory.find({
            productName : {$regex:q ,$options: "i"},
        }).populate('category','categoryName -_id');

        if(results.length===0){
        return res.status(200).json({results:[]});
        }
        return res.status(200).json({results});
    }
    catch(err){
        console.log(err);
    }
};

//update products

const updateProduct =async (req, res, next)=>{
    const id= req.params.id;
    const {productName,category,quantity,reorderLevel,price,maximumDiscountedPrice} = req.body;

    let product;

    try{
        product = await Inventory.findByIdAndUpdate(id,{productName:productName,category:category, quantity:quantity,reorderLevel:reorderLevel,price:price,maximumDiscountedPrice:maximumDiscountedPrice});
        product= await product.save();
    }
    catch(err){
        console.log(err);
    }

    if(!product){
        return res.status(404).json({message: "Product not updated!"});
    }
    return res.status(200).json({product});
};

//Delete products

const deleteProduct = async (req, res, next) => {

    const id = req.params.id;

    let product;

    try{
        product = await Inventory.findByIdAndDelete(id);
    }
    catch(err){
        console.log(err);
    }

    if(!product){
        return res.status(404).json({message: "Product not deleted!"});
    }
    return res.status(200).json({product});
};

//diplay category

const displayAllCategory = async (req, res, next) => {
    let categories;

    try{
        categories = await Category.find();
    }
    catch(err){
        console.log(err);
    }

    if(!categories){
        return res.status(404).json({message : "Categories Not Found!"})
    }
    return res.status(200).json(categories);
    
};

//Add categories
const addCategory = async (req, res, next) => {
    const {categoryName,description} = req.body;

    let category;

    try{
        category = new Category({categoryName,description});
        await category.save();
    }
    catch(err){
        console.log(err);
    }  
    if(!category){
        return res.status(400).json({message : "Category insertion unsuccessful!"});
    }
    return res.status(200).json({category});
};

exports.getAllProducts = getAllProducts;
exports.addProducts = addProducts;
exports.getById= getById;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
exports.displayAllCategory = displayAllCategory;
exports.addCategory = addCategory;
exports.searchProduct= searchProduct;
exports.getProductsByCategory= getProductsByCategory;
exports.getProductsByQuantity=getProductsByQuantity;
exports.getFilteredProducts=getFilteredProducts;