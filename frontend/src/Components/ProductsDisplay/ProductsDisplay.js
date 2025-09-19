import React, {  } from 'react';
import { } from 'react-router-dom';

function ProductsDisplay(props) {
    const {productName,category,quantity,price,maximumDiscountedPrice}= props.product;

    return (
        <div>
            <h1>Pname:{productName}</h1>
            <h1>Category :{category.categoryName}</h1>
            <h1>Quantity:{quantity}</h1>
            <h1>Price:{price}</h1>
            <h1>MaxDisPrice:{maximumDiscountedPrice}</h1>
            <br></br>

        </div>
    )
}

export default ProductsDisplay
