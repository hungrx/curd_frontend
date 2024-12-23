import React, { useState } from "react";

const baseUrl = import.meta.env.VITE_APP_BASE_URL;

const DeleteRestaurantPopup = ({
  restaurant,
  closePopup,
  updateRestaurantList,
}) => {
  const [deleteInput, setDeleteInput] = useState("");
  const [error, setError] = useState(""); // State for validation errors

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate delete input
    if (!deleteInput) {
      setError("Delete ID is required.");
      return;
    }

    // Clear previous errors
    setError("");

    try {
      const response = await fetch(
        `${baseUrl}/api/restaurants/deleteRestaurant/${restaurant._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json", // Correct content type for sending JSON
          },
          body: JSON.stringify({ deleteId: deleteInput }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // Handle error responses from the server
        throw new Error(data.message || "Failed to delete restaurant");
      }

      // Update restaurant list and close popup
      updateRestaurantList(data.restaurantId);
      closePopup();
    } catch (err) {
      console.error("Error deleting the restaurant:", err);
      setError(err.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-4">Delete Restaurant</h2>
        <h3 className="text-xl mb-4">{restaurant.restaurantName}</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="deleteId" className="block text-gray-700">
              Only Admin can delete
            </label>
            <input
              type="text"
              id="deleteId"
              className="w-full p-2 mt-2 border rounded-lg"
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              placeholder="Enter delete ID"
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
              className="bg-red-600 text-white py-2 px-4 rounded-lg"
            >
              Delete Restaurant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteRestaurantPopup;
