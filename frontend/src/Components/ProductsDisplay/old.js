import React, { useEffect, useState ,useRef} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {useReactToPrint} from 'react-to-print';

const URL = "http://localhost:5000/products";
const fetchHandler = async()=>{
  return await axios.get(URL).then((res)=>res.data);
}

function ProductsTable() {
  const [docName, setDocName] = useState("");
  const [shouldPrint, setShouldPrint] = useState(false);
  const [showDocName, setShowDocName] = useState(false);
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [searchTerm,setSearchTerm]=useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [quantityThreshold, setQuantityThreshold] = useState("");

  useEffect(()=>{
      const fetchCategories = async () => {
        try{
          const res = await axios.get('http://localhost:5000/category');
          setCategories(res.data);
        }
        catch(err){
          console.log(err);
        }
      };
      fetchCategories();
    },[]);


  useEffect(() => {
    try{
        fetchHandler().then((data)=> setProducts(data.products));
    }
    catch(err){
        console.log(err);
        setMessage("Failed to load products!..");
    }
  }, []);

  const handleSearch = async () => {
    try{
      const term= searchTerm.trim();
      if(!term){
        const data = await fetchHandler();
        setProducts(data.products);
        setMessage("");
        return;
      }

      const res = await axios.get(`http://localhost:5000/products/search?q=${searchTerm}`);
      if(res.data && res.data.results && res.data.results.length >0){
        setProducts(res.data.results);
        setMessage(`Found ${res.data.results.length} product${res.data.results.length>1 ? "s" : ""} matching "${searchTerm}"`);
      }
      else{
        setProducts([]);
        setMessage("No products found...");
      }
    }
    catch(err){
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
    onAfterPrint: () => alert("Inventory report downloded successfully..."),
  });

  useEffect(() => {
    if (shouldPrint && ComponentsRef.current) {
      handlePrint();
      setShouldPrint(false);
    }
  }, [shouldPrint, handlePrint]);

  const handleFilter = async () => {
  try {
    if (!selectedCategory) {
      const res = await axios.get("http://localhost:5000/products");
      setProducts(res.data.products);
      setMessage("");
    } else {
      const res = await axios.get(`http://localhost:5000/products/category?c=${selectedCategory}`);
      const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
      const sorted = res.data.results.sort((a, b) =>collator.compare(a.productName, b.productName)
      );

      setProducts(sorted);
      setMessage(`Filtered by category: ${selectedCategory}`);
    }
  } catch (err) {
    console.log(err);
    setMessage("Failed to filter products");
  }
  };

  const handleQuantityThreshold = async () => {
  try {
    if (!quantityThreshold) {
      const res = await axios.get("http://localhost:5000/products");
      setProducts(res.data.products);
      setMessage("");
    } else {
      const res = await axios.get(`http://localhost:5000/products/quantity?qt=${quantityThreshold}`);
      setProducts(res.data.results);
      setMessage(`Showing products with quantity less than ${quantityThreshold}`);
    }
  } catch (err) {
    console.log(err);
    setMessage("Failed to filter by quantity threshold");
  }
};



  return (
    <div ref={ComponentsRef}>
        {showDocName &&(
          <div className='modal'>
            <p>Enter Document name : </p>
            <input type='text' value={docName} onChange={(e)=>setDocName(e.target.value)}/>
            <button onClick={handlePrintClick}>Print</button>
            <button onClick={()=>setShowDocName(false)}>cancel</button>
            </div>
        )}
      <h2>Inventory Table</h2>
      <div>
          <input type='text' placeholder='Search for products...' value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value) } onKeyDown={(e)=> e.key==='Enter' && handleSearch()}/>
          <button onClick={handleSearch}>Search</button>
      </div>
      <button onClick={()=>setShowDocName(true)}>Print</button>
      {message && <p>{message}</p>}
      <div style={{ marginBottom: "20px" }}>
      <label>Filter by Category: </label>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} onKeyDown={(e)=> e.key==='Enter' && handleFilter()}>
          <option value="">All</option>
          {categories.map((cat) => (
          <option key={cat._id} value={cat.categoryName}>{cat.categoryName}</option>
          ))}
        </select>
        <button onClick={handleFilter}>Filter</button>
        </div>
        <div style={{ marginBottom: "20px" }}>
        <label>Show products with quantity less than: </label>
        <input
          type="number"
          value={quantityThreshold}
          onChange={(e) => setQuantityThreshold(e.target.value)}
          onKeyDown={(e)=> e.key==='Enter' && handleQuantityThreshold()}
          placeholder="Enter quantity"
        />
        <button onClick={handleQuantityThreshold}>Apply</button>
        </div>

      <table
        border="1"
        cellPadding="10"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Max Discount Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products && products.map((product) => (
              <tr key={product._id}>
                <td>{product.productName}</td>
                <td>{product.category?.categoryName}</td>
                <td>{product.quantity}</td>
                <td>{product.price}</td>
                <td>{product.maximumDiscountedPrice}</td>
                <td>
                  <button onClick={() => navigate(`/products/${product._id}`)}>
                    Update
                  </button>
                  <button onClick={() => navigate(`/delete/${product._id}`)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No products found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ProductsTable;
