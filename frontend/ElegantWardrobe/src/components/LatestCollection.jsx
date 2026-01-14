import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);

  // latest collections - ensure products is an array before slicing
  const latestProduct = Array.isArray(products) ? products.slice(0, 5) : [];

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1={"LATEST"} text2={"COLLECTIONS"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laboriosam,
          officia!
        </p>
      </div>

      {/* Rendering Products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid:cols-5 gap-4 gap-y-6">
        {latestProduct.map((item, index) => {
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

export default LatestCollection;

