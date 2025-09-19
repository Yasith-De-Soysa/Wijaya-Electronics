import './App.css';
import React from 'react';
import Products from "./Components/Store/Products";
import AddProduct from './Components/Addproducts/AddProduct';
import { Route, Routes } from 'react-router-dom';
import AddCategories from './Components/AddCategories/AddCategories';
import UpdateProduct from './Components/UpdateProducts/UpdateProduct';
import ProductsTable from './Components/ProductsDisplay/ProductsTable';
import ProductActivityLogDisplay from './Components/ProductActivityLog/ProductActivityLogDisplay';

function App() {
  return (
    <div>
      <React.Fragment>
        <Routes>
          <Route path='/AddCategories' element={<AddCategories/>}/>
          <Route path="/AddProduct" element={<AddProduct/>}/>
          <Route path="/" element={<Products/>}/>
          <Route path="/products" element={<Products/>}/>
          <Route path = "/products/:id" element={<UpdateProduct/>}/>
          <Route path ="/productsTable" element={<ProductsTable/>}/>
          <Route path ="/productActivityLog" element = {<ProductActivityLogDisplay/>}/>
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
