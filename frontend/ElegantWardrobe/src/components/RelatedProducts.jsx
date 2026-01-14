import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";
import { Link } from "react-router-dom";
import api from "../api";

const RelatedProducts = ({productId}) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);
  


  useEffect(() => {
    const getRelatedProducts = async ()=>{
      try {
        const res = await api.get(`/related_products/${productId}/`)
        setRelated(res.data)
        
        
      } catch (error) {
        console.log(error.message)
      }
    }
    getRelatedProducts()
  }, [products]);

  

  return (
    <div className="my-24">
      <div className="text-center py-2 text-3xl">
        <Title text1={"RELATED"} text2={"PRODUCTS"} />
      </div>

      {/* Rendering Products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid:cols-5 gap-4 gap-y-6">
        {related.map((item, index) => {
          return (
            <ProductItem
              key={index}
              id={item.id}
              image={item.image}
              name={item.name}
              price={item.price}
              finalPrice={item.discounted_amount}
              realPrice={item.price}
              discountedPercentage={item.discounted_percentage}
            />
          );
        })}
      </div>
    </div>
  );
};

export default RelatedProducts;
