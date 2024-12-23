import React, { useState, useEffect } from "react";

const SearchRestaurant = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(searchQuery);
    }, 300); // 300ms debounce

    return () => {
      clearTimeout(handler); // Cleanup timeout on query change
    };
  }, [searchQuery, onSearch]);

  return (
    <input
      type="text"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full focus:outline-none p-4 rounded-full shadow-md text-lg bg-gray-50 placeholder-gray-400 focus:ring-2 focus:ring-green-500 transition-all duration-300 hover:shadow-xl"
      placeholder="Search Restaurants ..."
    />
  );
};

export default SearchRestaurant;
