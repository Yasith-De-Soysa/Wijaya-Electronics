import React, { useEffect, useState } from 'react';
import axios from "axios";
import ProductsDisplay from '../ProductsDisplay/ProductsDisplay';
import { useNavigate } from 'react-router-dom';

const URL = "http://localhost:5000/products";
const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function Products() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchHandler().then((data) => setProducts(data.products));
  }, []);

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

  const handleSearch = async () => {
    try {
      const term = searchTerm.trim();
      if (!term) {
        const data = await fetchHandler();
        setProducts(data.products);
        setMessage("");
        return;
      }

      const res = await axios.get(`http://localhost:5000/products/search?q=${searchTerm}`);
      if (res.data?.results?.length > 0) {
        setProducts(res.data.results);
        setMessage(`Found ${res.data.results.length} product${res.data.results.length > 1 ? "s" : ""} matching "${searchTerm}"`);
      } else {
        setProducts([]);
        setMessage("No products found...");
      }
    } catch (err) {
      console.log(err);
      alert("Error searching products...");
    }
  };

  const handleFilter = async () => {
    try {
      if (!selectedCategory) {
        const res = await axios.get(URL);
        setProducts(res.data.products);
        setMessage("");
      } else {
        const res = await axios.get(`http://localhost:5000/products/category?c=${selectedCategory}`);
        setProducts(res.data.results);
        setMessage(`Filtered by category: ${selectedCategory}`);
      }
    } catch (err) {
      console.log(err);
      setMessage("Failed to filter products");
    }
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen p-6">
      <h1 className="text-3xl font-bold text-[#212529] mb-6">Products</h1>

      {/* Filter Section */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
        <label className="text-lg font-medium text-[#212529]">Filter by Category:</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0057B8] bg-white text-[#6C757D]"
        >
          <option value="">All</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.categoryName}>{cat.categoryName}</option>
          ))}
        </select>
        <button
          onClick={handleFilter}
          className="bg-[#FFA500] text-white px-4 py-2 rounded hover:bg-orange-600 transition"
        >
          Filter
        </button>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => navigate('/AddProduct')}
          className="bg-[#FFA500] text-white px-4 py-2 rounded hover:bg-orange-600 transition"
        >
          Add Product
        </button>
        <button
          onClick={() => navigate('/AddCategories')}
          className="bg-[#FFA500] text-white px-4 py-2 rounded hover:bg-orange-600 transition"
        >
          Add Categories
        </button>
        <button
          onClick={() => navigate('/productsTable')}
          className="bg-[#0057B8] text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Manage Inventory
        </button>
      </div>

      {/* Search Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-[#0057B8] bg-white text-[#6C757D]"
        />
        <button
          onClick={handleSearch}
          className="bg-[#FFA500] text-white px-4 py-2 rounded hover:bg-orange-600 transition"
        >
          Search
        </button>
      </div>

      {/* Message */}
      {message && (
        <p className="text-sm text-[#6C757D] mb-4">{message}</p>
      )}

      {/* Product List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, i) => (
          <div key={i} className="border rounded p-4 shadow-sm hover:shadow-md transition bg-white">
            <ProductsDisplay product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
