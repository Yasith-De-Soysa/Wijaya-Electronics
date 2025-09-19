import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AddProduct() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  const [inputs, setInputs] = useState({
    productName: "",
    category: "",
    quantity: "",
    reorderLevel: "",
    price: "",
    maximumDiscountedPrice: "",
  });

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

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const price = parseFloat(inputs.price);
    const maximumDiscountedPrice = parseFloat(inputs.maximumDiscountedPrice);

    if (price < maximumDiscountedPrice) {
      setError(
        "Price should always be greater than the maximum discounted price!"
      );
      return;
    }

    try {
      await axios.post("http://localhost:5000/products", inputs);
      alert("Product added successfully!...");
      navigate("/products");
    } catch (err) {
      if (err.response?.status === 400) {
        setError(err.response.data.message); // e.g. "Product already exists"
      } else {
        setError("Something went wrong while adding the product.");
      }
    }
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white p-6 rounded shadow-md ">
        <h1 className="text-3xl font-bold text-[#212529] mb-6 text-center">
          Add Product
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
              value={inputs.productName}
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
              value={inputs.category}
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
              value={inputs.quantity}
              min={0}
              required
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0057B8] text-[#6C757D]"
            />
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
              value={inputs.reorderLevel}
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
              value={inputs.price}
              min={0}
              step={0.01}
              required
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0057B8] text-[#6C757D]"
            />
          </div>

          {/* Maximum Discounted Price */}
          <div>
            <label className="block text-[#212529] font-medium mb-1">
              Maximum Discounted Price:
            </label>
            <input
              type="number"
              name="maximumDiscountedPrice"
              onChange={handleChange}
              value={inputs.maximumDiscountedPrice}
              min={0}
              step={0.01}
              required
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0057B8] text-[#6C757D]"
            />
          </div>
          {error && <p className="text-red-600 font-medium">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#FFA500] text-white font-semibold py-2 px-4 rounded hover:bg-orange-600 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
