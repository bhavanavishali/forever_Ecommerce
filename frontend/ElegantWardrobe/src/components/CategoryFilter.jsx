import React from "react";

const CategoryFilter = ({showFilter,allCategories,selectedCategories,toggleCategory,setShowFilter}) => {
  return (
    <div className="min-w-60">
      <div
        onClick={() => {
          setShowFilter(!showFilter);
        }}
        className="flex items-center gap-3 cursor-pointer group py-2 px-1 rounded-lg hover:bg-gray-50 transition-all duration-200"
      >
        <svg
          className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        <h2 className="text-xl font-semibold text-gray-800 group-hover:text-gray-900 transition-colors duration-200">
          FILTERS
        </h2>
        <div className="sm:hidden ml-auto">
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
              showFilter ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Category Filter */}
      <div
        className={`mt-4 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 ease-in-out ${
          showFilter
            ? "opacity-100 max-h-96 translate-y-0"
            : "opacity-0 max-h-0 -translate-y-2 sm:opacity-100 sm:max-h-96 sm:translate-y-0"
        } sm:block`}
      >
        <div className="p-5">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
              Categories
            </h3>
          </div>

          <div className="space-y-3">
            {allCategories.map((item, index) => (
              <label
                key={item}
                className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    value={item}
                    onChange={toggleCategory}
                    checked={selectedCategories.includes(item)}
                  />
                  <div
                    className={`w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center ${
                      selectedCategories.includes(item)
                        ? "bg-black border-gray-500 shadow-md shadow-gray-200"
                        : "border-gray-300 hover:border-black"
                    }`}
                  >
                    {selectedCategories.includes(item) && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <span
                  className={`text-sm transition-colors duration-200 ${
                    selectedCategories.includes(item)
                      ? "text-gray-900 font-medium"
                      : "text-gray-600 group-hover:text-gray-800"
                  }`}
                >
                  {item}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Selected Categories Count */}
        {selectedCategories.length > 0 && (
          <div className="px-5 py-3 bg-gray-100 border-t border-blue-100">
            <div className="flex items-center justify-between">
              <span className="text-xs text-black font-medium">
                {selectedCategories.length} categor
                {selectedCategories.length === 1 ? "y" : "ies"} selected
              </span>
              <button
                onClick={() => {
                  selectedCategories.forEach((category) => {
                    toggleCategory({ target: { value: category } });
                  });
                }}
                className="text-xs text-black hover:text-blue-800 font-medium hover:underline transition-colors duration-200"
              >
                Clear all
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryFilter;
