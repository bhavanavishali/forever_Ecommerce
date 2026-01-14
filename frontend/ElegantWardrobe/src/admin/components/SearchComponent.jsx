import React, { use, useContext, useEffect, useState } from "react";
import { assets } from "../../../src/assets/assets";
import { SearchContext } from "../../context/SearchContextProvider";

const SearchComponent = () => {
  const { search, setSearch } = useContext(SearchContext);

  return (
    <div className="border-t border-b bg-gray-50 text-center flex items-center justify-end">
      <div className="flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          className="flex-1 outline-none bg-inherit text-sm"
          type="text"
          placeholder="Seach"
        />
        {!search?<img className="w-4" src={assets.search_icon} alt="" />
        :<img className="w-4 cursor-pointer" onClick={()=>{setSearch('')}} src={assets.cross_icon} alt="" />}
      </div>
    </div>
  );
};

export default SearchComponent;
