const express = require("express");
const router = express.Router();
const category = require("../Model/CategoryModel");
const CategoryController = require ("../Controllers/InventoryControllers");

router.get("/",CategoryController.displayAllCategory);
router.post("/",CategoryController.addCategory);
module.exports=router;