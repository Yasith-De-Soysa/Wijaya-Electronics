const Inventory = require("../Model/InventoryModel");
const Category = require("../Model/CategoryModel");
const ProductActivityLog = require("../Model/ProductActivityLog");

//Display products

const getAllProducts = async (req, res, next) => {
  let products;

  try {
    products = await Inventory.find().populate("category", "categoryName -_id");
  } catch (err) {
    console.log(err);
  }

  if (!products) {
    return res.status(404).json({ message: "Products not found..." });
  }

  return res.status(200).json({ products });
};

//Insert products
const addProducts = async (req, res, next) => {
  const {
    productName,
    category,
    quantity,
    reorderLevel,
    price,
    maximumDiscountedPrice,
  } = req.body;

  try {
    const existingProduct = await Inventory.findOne({
      productName: { $regex: new RegExp("^" + productName + "$", "i") }, 
    });

    if (existingProduct) {
      return res.status(400).json({
        message: "Product already exists in inventory.",
        product: existingProduct,
      });
    }

    const product = new Inventory({
      productName,
      category,
      quantity,
      reorderLevel,
      price,
      maximumDiscountedPrice,
    });
    await product.save();

    await ProductActivityLog.create({
      productId: product._id,
      productName: product.productName,
      action: "create",
      reason: "New product added to inventory",
      snapshot: product.toObject(),
      by: req.user?.name || "system",
    });

    return res.status(201).json({ product });
  } catch (err) {
    console.error("Error adding product:", err);
    return res.status(500).json({ message: "Error adding product" });
  }
};

//find products by id

const getById = async (req, res, next) => {
  const id = req.params.id;

  let product;

  try {
    product = await Inventory.findById(id);
  } catch (err) {
    console.log(err);
  }

  if (!product) {
    return res.status(404).json({ message: "Product not found!" });
  }
  return res.status(200).json({ product });
};

const getProductsByCategory = async (req, res, next) => {
  const { c } = req.query;

  try {
    const allProducts = await Inventory.find().populate(
      "category",
      "categoryName"
    );

    const filtered = allProducts.filter((p) =>
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
    const allProducts = await Inventory.find().populate(
      "category",
      "categoryName"
    );

    const filtered = allProducts.filter((p) => p.quantity < parseInt(qt));

    return res.status(200).json({ results: filtered });
  } catch (err) {
    console.log("Error filtering by quantity:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const getFilteredProducts = async (req, res) => {
  const { c, qt } = req.query;

  try {
    const allProducts = await Inventory.find().populate(
      "category",
      "categoryName"
    );
    let filtered = allProducts;

    // If both category and quantity are provided
    if (c && qt) {
      filtered = filtered.filter(
        (p) =>
          p.category?.categoryName?.toLowerCase().includes(c.toLowerCase()) &&
          p.quantity < parseInt(qt)
      );
    }
    // If only category is provided
    else if (c) {
      filtered = filtered.filter((p) =>
        p.category?.categoryName?.toLowerCase().includes(c.toLowerCase())
      );
    }
    // If only quantity is provided
    else if (qt) {
      filtered = filtered.filter((p) => p.quantity < parseInt(qt));
    }

    return res.status(200).json({ results: filtered });
  } catch (err) {
    console.log("Filter error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

//search products
const searchProduct = async (req, res, next) => {
  const { q } = req.query;
  let results;

  try {
    results = await Inventory.find({
      productName: { $regex: q, $options: "i" },
    }).populate("category", "categoryName -_id");

    if (results.length === 0) {
      return res.status(200).json({ results: [] });
    }
    return res.status(200).json({ results });
  } catch (err) {
    console.log(err);
  }
};

//update products

const updateProduct = async (req, res, next) => {
  const id = req.params.id;
  const {
    productName,
    category,
    quantity,
    reorderLevel,
    price,
    maximumDiscountedPrice,
    adjustment,
  } = req.body;

  try {
    const original = await Inventory.findById(id);
    if (!original)
      return res.status(404).json({ message: "Product not found!" });

    // Update product
    const product = await Inventory.findByIdAndUpdate(
      id,
      {
        productName,
        category,
        quantity,
        reorderLevel,
        price,
        maximumDiscountedPrice,
      },
      { new: true }
    );

    // Detect changes
    const fieldsToCheck = [
      "productName",
      "category",
      "quantity",
      "reorderLevel",
      "price",
      "maximumDiscountedPrice",
    ];
    const changes = [];

    for (const field of fieldsToCheck) {
      const oldVal = original[field]?.toString?.() ?? original[field];
      const newVal = product[field]?.toString?.() ?? product[field];
      if (oldVal !== newVal) {
        changes.push({ field, oldValue: oldVal, newValue: newVal });
      }
    }

    // Log the update in one table
    if (changes.length > 0) {
      await ProductActivityLog.create({
        productId: id,
        productName: product.productName,
        action: adjustment ? "stock-adjustment" : "update",
        reason: adjustment?.reason || "manual update",
        changes,
        by: req.user?.name || "system",
      });
    }

    return res.status(200).json({ product });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error updating product" });
  }
};

//Delete products

const deleteProduct = async (req, res, next) => {
  const id = req.params.id;

  try {
    // Find the product first (so we can log its details before deletion)
    const product = await Inventory.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found!" });
    }

    // Delete the product
    await Inventory.findByIdAndDelete(id);

    // Log the deletion in ProductActivityLog
    await ProductActivityLog.create({
      productId: id,
      productName: product.productName,
      action: "delete", // or "Product deleted"
      reason: req.body?.reason || "Product removed from inventory",
      snapshot: product.toObject(), // keep a snapshot of the deleted product
      by: req.user?.name || "system", 
    });

    return res.status(200).json({ message: "Product deleted successfully", product });
  } catch (err) {
    console.log("Error deleting product:", err);
    return res.status(500).json({ message: "Error deleting product" });
  }
};

//diplay category

const displayAllCategory = async (req, res, next) => {
  let categories;

  try {
    categories = await Category.find();
  } catch (err) {
    console.log(err);
  }

  if (!categories) {
    return res.status(404).json({ message: "Categories Not Found!" });
  }
  return res.status(200).json(categories);
};

//Add categories
const addCategory = async (req, res, next) => {
  const { categoryName, description } = req.body;

  try {
    const existingCategory = await Category.findOne({
      categoryName: { $regex: new RegExp("^" + categoryName.trim() + "$", "i") },
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists.",
        category: existingCategory,
      });
    }

    const category = new Category({ categoryName: categoryName.trim(), description });
    await category.save();

    return res.status(201).json({
      success: true,
      message: "Category added successfully.",
      category,
    });
  } catch (err) {
    console.error("Error adding category:", err);
    return res.status(500).json({
      success: false,
      message: "Error adding category",
    });
  }
};


const getAllLogs = async (req, res, next) => {
  let logs;

  try {
    logs = await ProductActivityLog.find()// show product name
      .sort({ at: -1 });;
  } catch (err) {
    console.log(err);
  }

  if (!logs) {
    return res.status(404).json({ message: "Products not found..." });
  }

  return res.status(200).json({ logs });
};

exports.getAllProducts = getAllProducts;
exports.addProducts = addProducts;
exports.getById = getById;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
exports.displayAllCategory = displayAllCategory;
exports.addCategory = addCategory;
exports.searchProduct = searchProduct;
exports.getProductsByCategory = getProductsByCategory;
exports.getProductsByQuantity = getProductsByQuantity;
exports.getFilteredProducts = getFilteredProducts;
exports.getAllLogs= getAllLogs;
