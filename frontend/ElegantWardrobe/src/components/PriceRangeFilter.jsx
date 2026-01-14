import React from "react";
import { X } from "lucide-react"; // Optional: use any icon or Unicode

const PriceRangeFilter = ({
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  submitHandler,
}) => {
  return (
    <div className="min-w-60">
      <div className="mt-4 bg-white rounded-2xl border border-gray-200 shadow-md transition-all duration-300 ease-in-out">
        <div className="p-5">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
              Price
            </h3>
          </div>

          <form className="flex flex-col gap-3" onSubmit={submitHandler}>
            {/* Min Price Input */}
            <div className="relative">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min"
                className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
              />
              {minPrice && (
                <button
                  type="button"
                  onClick={() => setMinPrice("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Max Price Input */}
            <div className="relative">
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max"
                className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
              />
              {maxPrice && (
                <button
                  type="button"
                  onClick={() => setMaxPrice("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PriceRangeFilter;



