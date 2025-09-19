import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddCategories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState({
    categoryName: "",
    description: "",
  });

  const handleChange = (e) => {
    setCategories({ ...categories, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(categories);
    await sendRequest();
    alert("Category added successfully...");
    navigate('/products');
  };

  const sendRequest = async () => {
    try {
      const res = await axios.post("http://localhost:5000/category", categories);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

 return (
  <div className="bg-[#F8F9FA] min-h-screen flex items-center justify-center px-4">
    <div className="w-full max-w-xl bg-white p-6 rounded shadow-md">
      <h1 className="text-3xl font-bold text-[#212529] mb-6 text-center">Add Category</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category Name */}
        <div>
          <label className="block text-[#212529] font-medium mb-1">Category Name:</label>
          <input
            type="text"
            name="categoryName"
            value={categories.categoryName}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0057B8] text-[#6C757D]"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-[#212529] font-medium mb-1">Description:</label>
          <input
            type="text"
            name="description"
            value={categories.description}
            onChange={handleChange}
            required
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

export default AddCategories;
