import React from "react";
import {} from "react-router-dom";

function ProductsDisplay(props) {
  const { productName, category, quantity, price, maximumDiscountedPrice } =
    props.product;

  return (
  <div className="bg-[#F8F9FA] p-6 rounded shadow-md space-y-2">
    <p className="text-base text-[#212529]">
      <span className="font-semibold ">Product Name:</span> {productName}
    </p>
    <p className="text-base text-[#212529]">
      <span className="font-semibold">Category:</span> {category.categoryName}
    </p>
    <p className="text-base text-[#212529]">
      <span className="font-semibold">Quantity:</span> {quantity}
    </p>
    <p className="text-base text-[#212529]">
      <span className="font-semibold">Price:</span> {price}
    </p>
    <p className="text-base text-[#212529]">
      <span className="font-semibold">Max Discount Price:</span> {maximumDiscountedPrice}
    </p>
  </div>
);

}

export default ProductsDisplay;
