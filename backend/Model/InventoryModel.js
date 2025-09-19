const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const inventorySchema = new Schema({
    productName:{
        type : String,
        required : true
    },

    category : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'CategoryModel',
        required : true
    },

    quantity:{
        type : Number,
        required : true
    },

    reorderLevel :{
        type : Number,
        required : true,
        default : 10
    },

    price:{
        type : Number,
        required : true
    },

    maximumDiscountedPrice : {
        type : Number,
        required : true
    }
});

module.exports = mongoose.model(
    "InventoryModel",
    inventorySchema
)