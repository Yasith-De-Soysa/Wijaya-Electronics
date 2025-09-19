import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

const URL = "http://localhost:5000/products";
const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function ProductsTable() {
  const [docName, setDocName] = useState("");
  const [shouldPrint, setShouldPrint] = useState(false);
  const [showDocName, setShowDocName] = useState(false);
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [quantityThreshold, setQuantityThreshold] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");
  const [productToDelete, setProductToDelete] = useState(null);

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
    try {
      fetchHandler().then((data) => setProducts(data.products));
    } catch (err) {
      console.log(err);
      setMessage("Failed to load products!..");
    }
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

      const res = await axios.get(
        `http://localhost:5000/products/search?q=${searchTerm}`
      );
      if (res.data && res.data.results && res.data.results.length > 0) {
        setProducts(res.data.results);
        setMessage(
          `Found ${res.data.results.length} product${
            res.data.results.length > 1 ? "s" : ""
          } matching "${searchTerm}"`
        );
      } else {
        setProducts([]);
        setMessage("No products found...");
      }
    } catch (err) {
      console.log(err);
      alert("Error searching products....");
    }
  };

  const ComponentsRef = useRef();
  const handlePrintClick = () => {
    if (!docName.trim()) {
      alert("Please enter a document name!");
      return;
    }

    if (!ComponentsRef.current) {
      alert("Nothing to print");
      return;
    }
    setShowDocName(false);
    setShouldPrint(true);
  };

  const handlePrint = useReactToPrint({
    contentRef: ComponentsRef,
    documentTitle: docName,
    onAfterPrint: () => alert("Inventory report downloaded successfully..."),
  });

  useEffect(() => {
    if (shouldPrint && ComponentsRef.current) {
      handlePrint();
      setShouldPrint(false);
    }
  }, [shouldPrint, handlePrint]);

  const handleCombinedFilter = async () => {
    try {
      const allRes = await axios.get("http://localhost:5000/products");
      let filtered = allRes.data.products;

      if (selectedCategory) {
        filtered = filtered.filter(
          (p) =>
            p.category?.categoryName?.toLowerCase() ===
            selectedCategory.toLowerCase()
        );
      }

      if (quantityThreshold) {
        filtered = filtered.filter(
          (p) => p.quantity < parseInt(quantityThreshold)
        );
      }

      const collator = new Intl.Collator(undefined, {
        numeric: true,
        sensitivity: "base",
      });
      const sorted = filtered.sort((a, b) =>
        collator.compare(a.productName, b.productName)
      );

      setProducts(sorted);

      if (selectedCategory && quantityThreshold) {
        setMessage(
          `Filtered by category "${selectedCategory}" and quantity less than ${quantityThreshold}`
        );
      } else if (selectedCategory) {
        setMessage(`Filtered by category "${selectedCategory}"`);
      } else if (quantityThreshold) {
        setMessage(`Filtered by quantity less than ${quantityThreshold}`);
      } else {
        setMessage("");
      }
    } catch (err) {
      console.log(err);
      setMessage("Failed to apply filters");
    }
  };

  const handleConfirmDelete = async (product) => {
    const productName = product.productName;
    const id = product._id;

    if (confirmInput.trim() !== productName) {
      alert("Product name mismatch, Deletion cancelled!..");
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/products/${id}`);
      alert("Product delete successful....");
      navigate(0);
    } catch (err) {
      console.log(err);
      alert("Failed to delete!....");
    } finally {
      setShowConfirm(false);
      setConfirmInput("");
      setProductToDelete(null);
    }
  };

  return (
    <div ref={ComponentsRef} className="bg-[#F8F9FA] min-h-screen p-6">
      {/* Print Modal */}
      {showDocName && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md space-y-4 max-w-md w-full">
            <p className="text-[#212529] font-medium">Enter Document name:</p>
            <input
              type="text"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePrintClick()}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0057B8]"
            />
            <div className="flex gap-4 justify-end">
              <button
                onClick={handlePrintClick}
                className="bg-[#FFA500] text-white px-4 py-2 rounded hover:bg-orange-600"
              >
                Print
              </button>
              <button
                onClick={() => setShowDocName(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-3xl font-bold text-[#212529] mb-6">
        Inventory Table
      </h2>

      {/* Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 print:hidden">
        <input
          type="text"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-[#0057B8] text-[#6C757D]"
        />
        <button
          onClick={handleSearch}
          className="bg-[#FFA500] text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          Search
        </button>
        <button
          onClick={() => setShowDocName(true)}
          className="bg-[#0057B8] text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Print
        </button>
      </div>

      {/* Message */}
      {message && <p className="text-sm text-[#6C757D] mb-4 print:font-bold">{message}</p>}

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-end gap-4 mb-6 print:hidden">
        {/* Filter by Category */}
        <div className="flex flex-col w-full md:w-auto">
          <label className="text-[#212529] font-medium mb-1">
            Filter by Category:
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCombinedFilter()}
            className="border border-gray-300 rounded px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#0057B8] text-[#6C757D]"
          >
            <option value="">All</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.categoryName}>
                {cat.categoryName}
              </option>
            ))}
          </select>
        </div>

        {/* Quantity Filter */}
        <div className="flex flex-col w-full md:w-auto">
          <label className="text-[#212529] font-medium mb-1">
            Quantity less than:
          </label>
          <input
            type="number"
            value={quantityThreshold}
            onChange={(e) => setQuantityThreshold(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCombinedFilter()}
            placeholder="Enter quantity"
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0057B8] text-[#6C757D]"
          />
        </div>

        {/* Apply Filters Button */}
        <div className="flex items-end">
          <button
            onClick={handleCombinedFilter}
            className="bg-[#FFA500] text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded shadow-sm">
          <thead className="bg-[#0057B8] text-white">
            <tr>
              <th className="px-4 py-2 text-left">Product Name</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Quantity</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Max Discount Price</th>
              <th className="px-4 py-2 text-left print:hidden">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white text-[#212529]">
            {products.length > 0 ? (
              products.map((product) => (
                <tr
                  key={product._id}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-4 py-2">{product.productName}</td>
                  <td className="px-4 py-2">
                    {product.category?.categoryName}
                  </td>
                  <td className="px-4 py-2">{product.quantity}</td>
                  <td className="px-4 py-2">{product.price}</td>
                  <td className="px-4 py-2">
                    {product.maximumDiscountedPrice}
                  </td>
                  <td className="px-4 py-2 space-x-2 print:hidden">
                    <button
                      onClick={() => navigate(`/products/${product._id}`)}
                      className="bg-[#0057B8] text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => {
                        setProductToDelete(product);
                        setShowConfirm(true);
                      }}
                      className="bg-[#DC3545] text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-4 py-4 text-center text-[#6C757D]"
                >
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirm && productToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md space-y-4 max-w-md w-full">
            <p className="text-[#212529] font-medium">
              Type the product name{" "}
              <span className="font-bold">"{productToDelete.productName}"</span>{" "}
              to confirm deletion:
            </p>
            <input
              type="text"
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && handleConfirmDelete(productToDelete)
              }
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#DC3545]"
            />
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => handleConfirmDelete(productToDelete)}
                className="bg-[#DC3545] text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Confirm
              </button>
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setConfirmInput("");
                  setProductToDelete(null);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductsTable;
