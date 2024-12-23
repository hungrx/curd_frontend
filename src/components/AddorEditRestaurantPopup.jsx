import React, { useState } from "react";
import axios from "axios";

const baseUrl = import.meta.env.VITE_APP_BASE_URL;
console.log(baseUrl);

const AddorEditRestaurantPopup = ({
  restaurant,
  mode,
  closePopup,
  updateRestaurantList,
}) => {
  const [restaurantName, setRestaurantName] = useState(
    restaurant ? restaurant.restaurantName : ""
  );
  const [logo, setLogo] = useState(null); // Changed to store the file
  const [error, setError] = useState(""); // State for validation errors

  // Handle form submit for adding or editing------>
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate restaurant name only (image is optional)----->
    if (!restaurantName) {
      setError("Restaurant name is required.");
      return;
    }

    const normalizedRestaurantName = restaurantName.trim().toLowerCase();

    setError(""); // Clear any previous errors

    const formData = new FormData();
    formData.append("restaurantName", restaurantName);

    if (logo) {
      formData.append("logo", logo); // Only append logo if it's provided
    }

    try {
      let response;

      if (mode === "edit") {
        // Edit logic: PUT request
        if (!restaurant._id) {
          setError("Restaurant ID is required for editing.");
          return;
        }

        formData.append("id", restaurant._id); // Pass restaurant ID for update

        response = await axios.put(
          `${baseUrl}/api/restaurants/editRestaurant/${restaurant._id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        updateRestaurantList(response.data.restaurant); // Update restaurant list
        console.log("Restaurant updated:", response.data.restaurant);
      } else if (mode === "add") {
        // Add logic: POST request
        response = await axios.post(
          `${baseUrl}/api/restaurants/createRestaurant`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        updateRestaurantList(response.data.restaurant); // Add to restaurant list
        console.log("New restaurant added:", response.data.restaurant);
      } else {
        setError("Invalid mode specified.");
        return;
      }

      closePopup(); // Close the popup after submission
    } catch (err) {
      if (err.response) {
        // Check for backend response error
        if (err.response.data && err.response.data.message) {
          setError(err.response.data.message); // Display backend error message
        } else if (err.response.status === 404) {
          setError("Resource not found.");
        } else {
          setError(`Server error: ${err.response.statusText}`);
        }
      } else if (err.request) {
        // Network error (request was made, but no response received)
        setError("Network error. Please check your internet connection.");
      } else {
        // Unexpected error
        setError("An unexpected error occurred.");
      }

      console.error("Error submitting the restaurant:", err);
    }
  };

  // Handle file input change and validate----->
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setLogo(null);
      return;
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Only .png, .jpg, .jpeg, and .webp files are allowed.");
      setLogo(null);
    } else {
      setError("");
      setLogo(file);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-4">
          {mode === "edit" ? "Edit" : "Add"} Restaurant
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="restaurantName" className="block text-gray-700">
              Restaurant Name
            </label>
            <input
              type="text"
              id="restaurantName"
              className="w-full p-2 mt-2 border rounded-lg"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="logo" className="block text-gray-700">
              Logo (optional)
            </label>
            <input
              type="file"
              id="logo"
              className="w-full p-2 mt-2 border rounded-lg"
              accept=".png,.jpg,.jpeg,.webp"
              onChange={handleFileChange}
            />
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="flex justify-between">
            <button
              type="button"
              className="bg-gray-500 text-white py-2 px-4 rounded-lg"
              onClick={closePopup}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-4 rounded-lg"
            >
              {mode === "edit" ? "Save Changes" : "Add Restaurant"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddorEditRestaurantPopup;
