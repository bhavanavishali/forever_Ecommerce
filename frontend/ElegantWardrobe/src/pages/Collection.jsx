"use client";
import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import api from "../api";
import Pagination from "../components/Pagination";
import CategoryFilter from "@/components/CategoryFilter";
import PriceRangeFilter from "@/components/PriceRangeFilter";

const Collection = () => {
  const { products, setProducts, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortType, setSortType] = useState("relavent");
  const [activePage, setActivePage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(minPrice, maxPrice);
  };
  // toggle category
  const toggleCategory = (e) => {
    if (selectedCategories.includes(e.target.value)) {
      setSelectedCategories((prev) =>
        prev.filter((item) => item !== e.target.value)
      );
    } else {
      setSelectedCategories((prev) => [...prev, e.target.value]);
    }
  };

  // apply filter
  const applyFilter = async () => {
    const productCopy = products.slice();

    const res = await api.get("/filter_product/", {
      params: {
        search: search ? search : "",
        category: selectedCategories.join(",")
          ? selectedCategories.join(",")
          : "",
        page: activePage ? activePage : "",
        minPrice: minPrice ? minPrice : "",
        maxPrice: maxPrice ? maxPrice : "",
      },
    });

    setProducts(res.data.results);
    setHasNext(res.data.has_next);
    setHasPrevious(res.data.has_previous);
    setTotalPages(res.data.total_pages);

    setFilterProducts(productCopy);
  };

  // Sort Products
  const sortProduct = async () => {
    const fpCopy = filterProducts.slice();

    switch (sortType) {
      case "low-high":
        var res1 = await api.get("/filter_product/", {
          params: {
            category: selectedCategories.join(","),
            search: search,
            sort: "asc",
            page: activePage,
          },
        });
        setProducts(res1.data.results);
        setHasNext(res1.data.has_next);
        setHasPrevious(res1.data.has_previous);
        setTotalPages(res1.data.total_pages);
        break;

      case "high-low":
        var res2 = await api.get("/filter_product/", {
          params: {
            category: selectedCategories.join(","),
            search: search,
            sort: "desc",
            page: activePage,
          },
        });
        setProducts(res2.data.results);
        setHasNext(res2.data.has_next);
        setHasPrevious(res2.data.has_previous);
        setTotalPages(res2.data.total_pages);
        break;

      case "a_to_z":
        var res3 = await api.get("/filter_product/", {
          params: {
            category: selectedCategories.join(","),
            search: search,
            sort: "a_to_z",
            page: activePage,
          },
        });
        setProducts(res3.data.results);
        setHasNext(res3.data.has_next);
        setHasPrevious(res3.data.has_previous);
        setTotalPages(res3.data.total_pages);
        break;

      case "z_to_a":
        var res4 = await api.get("/filter_product/", {
          params: {
            category: selectedCategories.join(","),
            search: search,
            sort: "z_to_a",
            page: activePage,
          },
        });
        setProducts(res4.data.results);
        setHasNext(res4.data.has_next);
        setHasPrevious(res4.data.has_previous);
        setTotalPages(res4.data.total_pages);
        break;

      default:
        applyFilter();
        break;
    }
  };

  useEffect(() => {
    applyFilter();
  }, [selectedCategories, search, showSearch, activePage, minPrice, maxPrice]);

  useEffect(() => {
    sortProduct();
  }, [sortType, activePage]);

  useEffect(() => {
    const getAllListedCategories = async () => {
      const res = await api.get("/get_all_listed_categories/");
      setAllCategories(res.data.categories);
    };

    getAllListedCategories();
  }, []);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* filter option */}
      <div>
        <CategoryFilter
          showFilter={showFilter}
          allCategories={allCategories}
          selectedCategories={selectedCategories}
          toggleCategory={toggleCategory}
          setShowFilter={setShowFilter}
        />
        <PriceRangeFilter
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          submitHandler={submitHandler}
        />
      </div>

      {/* Right Side */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1="ALL" text2="COLLECTIONS" />
          {/* Product Sort */}
          <select
            onChange={(e) => {
              setSortType(e.target.value);
            }}
            className="border-2 border-gray-300 bg-white text-sm px-2"
          >
            <option value="relevant">Sort By : Relevant</option>
            <option value="low-high">Sort By Price : Low-High</option>
            <option value="high-low">Sort By Price : High-Low</option>
            <option value="a_to_z">Sort By Name : A to Z</option>
            <option value="z_to_a">Sort By Name : Z to A</option>
          </select>
        </div>
        {/* Map products */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {products.map((item, index) => {
            return (
              <ProductItem
                key={index}
                id={item.id}
                image={item.image}
                name={item.name}
                finalPrice={item.discounted_amount}
                realPrice={item.price}
                discountedPercentage={item.discounted_percentage}
              />
            );
          })}
        </div>

        {/* pagination */}
        {totalPages > 1 ? (
          <Pagination
            activePage={activePage}
            setActivePage={setActivePage}
            hasNext={hasNext}
            hasPrevious={hasPrevious}
            totalPages={totalPages}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Collection;