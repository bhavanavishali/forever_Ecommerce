
import React, { useState } from "react";

const Pagination = (props) => {
    const {activePage, setActivePage, hasNext, hasPrevious, totalPages} = props;
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);   
    
    
    
    return (
    
         <div className="flex justify-center items-center mt-10">
            <nav className="flex items-center space-x-1 bg-white rounded-lg shadow-sm border border-gray-200 p-1">
                {/* Previous Button */}
                <button 
                    onClick={() => {setActivePage((pre) => pre - 1)}} 
                    disabled={!hasPrevious}
                    className={`
                        flex items-center justify-center min-w-[40px] h-10 px-3 text-sm font-medium rounded-md transition-all duration-200
                        ${!hasPrevious 
                            ? 'text-gray-400 cursor-not-allowed bg-gray-50' 
                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200'
                        }
                    `}
                    aria-label="Previous page"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="ml-1 hidden sm:inline">Previous</span>
                </button>

                {/* Page Numbers */}
                <div className="flex space-x-1">
                    {pages.map((page, index) => {
                        return (
                            <button 
                                key={index} 
                                onClick={() => {setActivePage(page)}} 
                                className={`
                                    flex items-center justify-center min-w-[40px] h-10 px-3 text-sm font-medium rounded-md transition-all duration-200
                                    ${activePage === page
                                        ? 'bg-black text-white shadow-md shadow-blue-200 hover:bg-black' 
                                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200'
                                    }
                                `}
                                aria-label={`Page ${page}`}
                                aria-current={activePage === page ? 'page' : undefined}
                            >
                                {page}
                            </button>
                        );
                    })}
                </div>

                {/* Next Button */}
                <button 
                    onClick={() => {setActivePage((pre) => pre + 1)}} 
                    disabled={!hasNext}
                    className={`
                        flex items-center justify-center min-w-[40px] h-10 px-3 text-sm font-medium rounded-md transition-all duration-200
                        ${!hasNext 
                            ? 'text-gray-400 cursor-not-allowed bg-gray-50' 
                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200'
                        }
                    `}
                    aria-label="Next page"
                >
                    <span className="mr-1 hidden sm:inline">Next</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </nav>
        </div>
    );
};

export default Pagination;
