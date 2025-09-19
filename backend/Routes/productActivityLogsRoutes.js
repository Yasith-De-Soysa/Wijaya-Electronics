const express = require ("express");
const router = express.Router();
const productActivityLog = require ("../Model/ProductActivityLog");
const productActivityLogController =  require("../Controllers/InventoryControllers");

router.get("/",productActivityLogController.getAllLogs);

module.exports = router;