import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { MdOutlineAddBusiness, MdDelete } from "react-icons/md";
import axios from "axios";
import SearchRestaurant from "../components/SearchRestaurant";
import AddorEditRestaurantPopup from "../components/AddorEditRestaurantPopup";
import DeleteRestaurantPopup from "../components/DeleteRestaurantPopup";
const baseUrl = import.meta.env.VITE_APP_BASE_URL;

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRestaurants, setTotalRestaurants] = useState(0);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [mode, setMode] = useState("add"); // 'add', 'edit', or 'delete'

  const fetchRestaurants = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/api/restaurants/allRestaurants?page=${page}&search=${debouncedQuery}`
      );
      const {
        restaurants: fetchedRestaurants,
        totalPages: fetchedTotalPages,
        totalRestaurants: fetchedTotalRestaurants,
      } = response.data;

      setRestaurants(fetchedRestaurants);
      setTotalPages(fetchedTotalPages);
      setTotalRestaurants(fetchedTotalRestaurants);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching restaurants:", err);
      setError(err.message);
      setRestaurants([]);
      setLoading(false);
    }
  };

  const fetchTotalRestaurants = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/restaurants/totalRestaurants`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.totalRestaurants !== undefined) {
        setTotalRestaurants(data.totalRestaurants);
      } else {
        setError('No restaurant count found');
      }
    } catch (error) {
      setError(error.message);
      setTotalRestaurants(0);
    }
  };


  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchRestaurants(currentPage);
    }, 300); // Debounce by 300ms

    return () => clearTimeout(delayDebounceFn);
  }, [debouncedQuery, currentPage]);


  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 on search query change
  }, [debouncedQuery]);

  useEffect(() => {
    fetchRestaurants(currentPage);
  }, [debouncedQuery, currentPage]);


  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleEditClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setMode("edit");
    setShowPopup(true);
  };

  const handleAddClick = () => {
    setMode("add");
    setSelectedRestaurant(null);
    setShowPopup(true);
  };

  const handleDeleteClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setMode("delete");
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedRestaurant(null);
  };

  const updateRestaurantList = (updatedRestaurant) => {
    // Reset to page 1 after adding or editing
    setCurrentPage(1);

    setRestaurants((prevRestaurants) => {
      let updatedList;

      if (mode === "edit") {
        updatedList = prevRestaurants.map((restaurant) =>
          restaurant._id === updatedRestaurant._id ? updatedRestaurant : restaurant
        );
      } else if (mode === "add") {
        updatedList = [updatedRestaurant, ...prevRestaurants];
      } else if (mode === "delete") {
        updatedList = prevRestaurants.filter(
          (restaurant) => restaurant._id !== selectedRestaurant._id
        );
      }

      // Sort by `updatedAt` or `createdAt` to ensure the most recent is first
      updatedList = updatedList.sort((a, b) => {
        const dateA = new Date(a.updatedAt || a.createdAt);
        const dateB = new Date(b.updatedAt || b.createdAt);
        return dateB - dateA; // Descending order
      });

      // Ensure we only show the first 20 restaurants for the current page
      const startIndex = (1 - 1) * 20;  // Since we're resetting to page 1, set the index to 0
      const endIndex = startIndex + 20;
      updatedList = updatedList.slice(startIndex, endIndex);

      return updatedList;
    });

    // Fetch the updated total restaurant count
    fetchTotalRestaurants();
  };


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center  space-y-4 md:space-y-0 mx-8 mt-6 bg-white p-6 rounded-2xl shadow-lg">
        <div className="w-full md:w-1/3">
          {/* SearchRestaurant Component */}
          <SearchRestaurant onSearch={setDebouncedQuery} />
        </div>

        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight text-center flex-grow">
          ALL RESTAURANTS
        </h1>

        <div className="w-full md:w-1/3 flex justify-end">
          <button
            onClick={handleAddClick}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full px-6 py-3 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center group"
          >
            <MdOutlineAddBusiness className="text-2xl  transition-transform duration-300" />
          </button>
        </div>
      </div>
      <div className="w-full flex justify-end px-12  items-center space-x-4">
        <span className="text-lg font-semibold pt-4 text-gray-800">Total Restaurants:</span>
        <span className="text-2xl pt-4 font-extrabold text-green-600">
          {totalRestaurants}
        </span>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6 mx-8">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {restaurants.length > 0
          ? restaurants.map((restaurant) => (
            <div
              key={restaurant._id}
              className="bg-slate-100 rounded-xl mb-4 shadow-xl hover:shadow-2xl transform transition-all duration-500 hover:scale-105 overflow-hidden"
            >
              <div className="relative">
                <Link to={`/restaurant/${restaurant._id}`}>
                  <img
                    className="rounded-t-xl w-full h-40 object-cover"
                    src={`${baseUrl}/public${restaurant.logo}`}
                    alt={restaurant.name}
                  />
                </Link>
                {/* Edit Button */}
                <button
                  className="absolute top-2 right-2 p-2 bg-green-700 text-white rounded-full hover:bg-green-800 transition duration-300 transform hover:scale-110"
                  onClick={() => handleEditClick(restaurant)}
                >
                  <CiEdit className="text-lg" />
                </button>
                {/* Delete Button */}
                <button
                  className="absolute top-2 left-2 p-2 bg-red-700 text-white rounded-full hover:bg-red-800 transition duration-300 transform hover:scale-110"
                  onClick={() => handleDeleteClick(restaurant)}
                >
                  <MdDelete className="text-lg" />
                </button>
              </div>
              <div className="p-4 space-y-2">
                <h1 className="mt-2 font-bold text-xl text-center hover:text-green-600 transition duration-300">
                  <Link to={`/restaurant/${restaurant._id}`}>
                    {restaurant.restaurantName}
                  </Link>
                </h1>
                <p className="mt-1 text-xs text-center text-gray-500">
                  Created At : {formatDate(restaurant.createdAt)}
                </p>
                <p className="mt-1 text-xs text-center text-gray-500">
                  Updated At : {formatDate(restaurant.updatedAt)}
                </p>
              </div>
            </div>
          ))
          : !loading && <p>No restaurants available</p>}
      </div>


      <div className="flex justify-center items-center space-x-4 mb-6 mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-6 py-3 font-bold rounded-lg shadow-lg transform transition-all duration-300 ${currentPage === 1
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-2xl hover:scale-105"
            }`}
        >
          Previous
        </button>
        <span className="px-4 py-2 font-semibold text-lg bg-white rounded-lg shadow-md border border-gray-200">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-6 py-3 font-bold rounded-lg shadow-lg transform transition-all duration-300 ${currentPage === totalPages
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-green-400 to-teal-500 text-white hover:shadow-2xl hover:scale-105"
            }`}
        >
          Next
        </button>
      </div>


      {showPopup &&
        (mode === "delete" ? (
          <DeleteRestaurantPopup
            restaurant={selectedRestaurant}
            closePopup={closePopup}
            updateRestaurantList={updateRestaurantList}
          />
        ) : (
          <AddorEditRestaurantPopup
            restaurant={selectedRestaurant}
            mode={mode}
            closePopup={closePopup}
            updateRestaurantList={updateRestaurantList}
          />
        ))}
    </div>
  );
};

export default Restaurants;
