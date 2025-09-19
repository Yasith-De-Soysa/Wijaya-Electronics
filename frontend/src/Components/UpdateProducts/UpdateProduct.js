import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function UpdateProduct() {
  const [product, setProducts] = useState({
    productName: "",
    category: "",
    quantity: "",
    reorderLevel: "",
    price: "",
    maximumDiscountedPrice: "",
  });

  const [showDialog, setShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState(""); // "add" or "remove"
  const [adjustQty, setAdjustQty] = useState("");
  const [categories, setCategories] = useState([]);
  const [adjustReason, setAdjustReason] = useState("");
  const navigate = useNavigate();
  const [pendingAdjustment, setPendingAdjustment] = useState(null);

  const id = useParams().id;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/category");
        setCategories(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/products/${id}`);
        setProducts(res.data.product);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProducts();
  }, [id]);

  const handleChange = (e) => {
    setProducts({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(product);
    await sendRequest();
    alert("Product updation successful...");
    navigate("/productsTable");
  };

  const sendRequest = async () => {
  try {
    const payload = {
      ...product,
      // Include adjustment only if present
      adjustment: pendingAdjustment || null,
    };

    const res = await axios.put(`http://localhost:5000/products/${id}`, payload);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};


  const openDialog = (type) => {
    setDialogType(type); // "add" or "remove"
    setAdjustQty("");
    setShowDialog(true);
  };

  const handleUpdateQuantityConfirm = () => {
  const qty = parseInt(adjustQty);
  const currentQty = parseInt(product.quantity || 0);

  if (isNaN(qty) || qty <= 0) {
    alert("Please enter a valid quantity.");
    return;
  }
  if (dialogType === "remove" && qty > currentQty) {
    alert("Cannot remove more than current stock.");
    return;
  }

  const newQty = dialogType === "add" ? currentQty + qty : currentQty - qty;

  setProducts(prev => ({ ...prev, quantity: String(newQty) }));

  // Save the adjustment to send to backend on submit
  setPendingAdjustment({
    type: dialogType,          // "add" or "remove"
    quantity: qty,
    reason: adjustReason?.trim() || "manual update",
  });

  setShowDialog(false);
};




  return (
    <div className="bg-[#F8F9FA] min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white p-6 rounded shadow-md">
        <h1 className="text-3xl font-bold text-[#212529] mb-6 text-center">
          Update Product
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div>
            <label className="block text-[#212529] font-medium mb-1">
              Product Name:
            </label>
            <input
              type="text"
              name="productName"
              onChange={handleChange}
              value={product.productName}
              required
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0057B8] text-[#6C757D]"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-[#212529] font-medium mb-1">
              Category:
            </label>
            <select
              name="category"
              onChange={handleChange}
              value={product.category}
              required
              className="w-full border border-gray-300 rounded px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#0057B8] text-[#6C757D]"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-[#212529] font-medium mb-1">
              Quantity:
            </label>
            <input
              type="number"
              name="quantity"
              onChange={handleChange}
              value={product.quantity}
              min={0}
              required
              readOnly
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0057B8] text-[#6C757D]"
            />
          </div>
          {/* Stock Adjustment Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={()=>openDialog("add")}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            >
              Add Stock
            </button>
            <button
              type="button"
              onClick={()=>openDialog("remove")}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Remove Defective Stock
            </button>
          </div>

          {/* Reorder Level */}
          <div>
            <label className="block text-[#212529] font-medium mb-1">
              Re-Order Level:
            </label>
            <input
              type="number"
              name="reorderLevel"
              onChange={handleChange}
              value={product.reorderLevel}
              min={0}
              required
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0057B8] text-[#6C757D]"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-[#212529] font-medium mb-1">
              Price:
            </label>
            <input
              type="number"
              name="price"
              onChange={handleChange}
              value={product.price}
              min={0}
              step={0.01}
              required
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0057B8] text-[#6C757D]"
            />
          </div>

          {/* Max Discount Price */}
          <div>
            <label className="block text-[#212529] font-medium mb-1">
              Maximum Discounted Price:
            </label>
            <input
              type="number"
              name="maximumDiscountedPrice"
              onChange={handleChange}
              value={product.maximumDiscountedPrice}
              min={0}
              step={0.01}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0057B8] text-[#6C757D]"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#FFA500] text-white font-semibold py-2 px-4 rounded hover:bg-orange-600 transition"
          >
            Submit
          </button>
        </form>
        {showDialog && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded shadow-md w-80">
      <h2 className="text-lg font-semibold mb-4 text-[#212529]">
        {dialogType === "add" ? "Add Stock" : "Remove Defective Stock"}
      </h2>
      <input
        type="number"
        value={adjustQty}
        onChange={(e) => setAdjustQty(e.target.value)}
        min={0}
        className="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#0057B8] text-[#6C757D]"
        placeholder="Enter quantity"
      />
      <input
        type="text"
        value={adjustReason}
        onChange={(e) => setAdjustReason(e.target.value)}
        className="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#0057B8] text-[#6C757D]"
        placeholder="Enter reason (e.g., Defective, Restock, Audit)"
      />

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setShowDialog(false)}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={() => handleUpdateQuantityConfirm()}
          className="px-4 py-2 bg-[#FFA500] text-white rounded hover:bg-orange-600"
        >
          OK
        </button>
      </div>
    </div>
  </div>
)}

      </div>
    </div>
  );
}

export default UpdateProduct;
