import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function UpdateProduct() {
  const [product, setProducts] = useState({
    productName: "",
    category: "",
    quantity: "",
    reorderLevel: "",
    price: "",
    maximumDiscountedPrice: "",
  });
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const id = useParams().id;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5000/category');
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
    navigate('/productsTable');
  };

  const sendRequest = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/products/${id}`, product);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  return (
  <div className="bg-[#F8F9FA] min-h-screen flex items-center justify-center px-4">
    <div className="w-full max-w-xl bg-white p-6 rounded shadow-md">
      <h1 className="text-3xl font-bold text-[#212529] mb-6 text-center">Update Product</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label className="block text-[#212529] font-medium mb-1">Product Name:</label>
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
          <label className="block text-[#212529] font-medium mb-1">Category:</label>
          <select
            name="category"
            onChange={handleChange}
            value={product.category}
            required
            className="w-full border border-gray-300 rounded px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#0057B8] text-[#6C757D]"
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>
                {cat.categoryName}
              </option>
            ))}
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-[#212529] font-medium mb-1">Quantity:</label>
          <input
            type="number"
            name="quantity"
            onChange={handleChange}
            value={product.quantity}
            min={0}
            required
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0057B8] text-[#6C757D]"
          />
        </div>

        {/* Reorder Level */}
        <div>
          <label className="block text-[#212529] font-medium mb-1">Re-Order Level:</label>
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
          <label className="block text-[#212529] font-medium mb-1">Price:</label>
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
          <label className="block text-[#212529] font-medium mb-1">Maximum Discounted Price:</label>
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
    </div>
  </div>
);

}

export default UpdateProduct;
