const express = require("express");
const router = express.Router();
const product = require("../Model/InventoryModel");
const InventoryController = require("../Controllers/InventoryControllers");

router.get("/search",InventoryController.searchProduct);
router.get("/",InventoryController.getAllProducts);
router.get("/category",InventoryController.getProductsByCategory);
router.get("/quantity",InventoryController.getProductsByQuantity);
router.get("filter",InventoryController.getFilteredProducts);
router.post("/",InventoryController.addProducts);
router.get("/:id",InventoryController.getById);
router.put("/:id",InventoryController.updateProduct);
router.delete("/:id",InventoryController.deleteProduct);
module.exports=router;