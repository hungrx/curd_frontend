import React, { useState, useEffect } from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import DeleteDishPopup from "./DeleteDishPopup";
import AddDishPopup from "./AddorEditDishPopup";
import axios from "axios";

const baseUrl = import.meta.env.VITE_APP_BASE_URL;

const DishCard = ({
  dish = {},
  categoryName = "N/A",
  subCategoryName = "N/A",
  restaurantId,
  setDishes,
  setCategories,
  onDishUpdate,
}) => {
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedServingInfo, setSelectedServingInfo] = useState(
    dish.servingInfos?.[0]?.servingInfo || null
  );

  useEffect(() => {
    setSelectedServingInfo(dish.servingInfos?.[0]?.servingInfo || null);
  }, [dish]);

  const {
    dishName = "Dish Name",
    description = "No description provided",
    servingInfos = [],
    createdAt,
    updatedAt,
  } = dish;

  const handleServingSizeChange = (servingInfo) => {
    setSelectedServingInfo(servingInfo.servingInfo);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const options = {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleString("en-US", options);
  };

  const handleDeleteClick = () => setShowDeletePopup(true);
  const handleEditClick = (e) => {
    e.stopPropagation();
    setShowEditPopup(true);
  };

  const closePopup = () => {
    setShowDeletePopup(false);
    setShowEditPopup(false);
  };

  const handleDeleteSuccess = async () => {
    if (onDishUpdate) {
      await onDishUpdate();
    } else {
      await updateDishList();
    }
    closePopup();
  };

  const handleEditSuccess = async () => {
    if (onDishUpdate) {
      await onDishUpdate();
      // Reset selected serving info after update
      setSelectedServingInfo(dish.servingInfos?.[0]?.servingInfo || null);
    }
    closePopup();
  };

  const updateDishList = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/restaurants/allDishes/${restaurantId}`
      );
      setDishes(response.data.dishes || []);
      setCategories(response.data.categories || []);
    } catch (err) {
      console.error("Error refreshing dishes:", err);
    }
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const truncateDescription = (text, wordLimit = 150) => {
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return text;
  };

  const limitedDescription = truncateDescription(description);

  if (!servingInfos.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md text-center">
        <p>No serving information available for this dish.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="relative bg-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer max-w-xs">
        {/* Dish Name and Actions */}
        <div className="flex justify-between items-center mb-3">
          <h3
            className="font-semibold text-xl text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap"
            title={dishName}
            onClick={openModal}
          >
            <strong>{dishName}</strong>
          </h3>
          <div className="flex space-x-2">
            <button
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-transform duration-300 transform hover:scale-110"
              onClick={handleEditClick}
            >
              <MdEdit />
            </button>
            <button
              className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-transform duration-300 transform hover:scale-110"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick();
              }}
            >
              <MdDelete />
            </button>
          </div>
        </div>

        {/* Category and Subcategory */}
        <div className="text-sm flex justify-between text-gray-600">
          <p>
            <strong>Category:</strong>
          </p>
          <p>
            <strong>{categoryName}</strong>
          </p>
        </div>
        <div className="text-sm flex justify-between text-gray-600 mb-2">
          <p>
            <strong>Subcategory:</strong>
          </p>
          <p>
            <strong>{subCategoryName}</strong>
          </p>
        </div>

        {/* Serving Sizes Selection */}
        <div className="grid grid-cols-3 gap-2 justify-between space-x-2 mb-4">
          {servingInfos.map((info, index) => (
            <button
              key={index}
              onClick={() => handleServingSizeChange(info)}
              className={`px-3 py-1 rounded-full text-sm transition-colors duration-300 ${
                selectedServingInfo?.size === info.servingInfo.size
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-blue-200"
              }`}
              title={info.servingInfo.size}
            >
              {info.servingInfo.size.slice(0, 5)}
            </button>
          ))}
        </div>

        {/* Nutritional Facts */}
        <div className="grid grid-cols-2 gap-2 mt-4" onClick={openModal}>
          <div className="bg-blue-100 text-blue-800 p-3 rounded-lg shadow-md text-center">
            <p className="text-sm font-semibold">Calories</p>
            <p className="text-lg">
              {selectedServingInfo?.nutritionFacts?.calories?.value || "N/A"}{" "}
              {selectedServingInfo?.nutritionFacts?.calories?.unit || ""}
            </p>
          </div>
          <div className="bg-green-100 text-green-800 p-3 rounded-lg shadow-md text-center">
            <p className="text-sm font-semibold">Protein</p>
            <p className="text-lg">
              {selectedServingInfo?.nutritionFacts?.protein?.value || "N/A"}{" "}
              {selectedServingInfo?.nutritionFacts?.protein?.unit || ""}
            </p>
          </div>
          <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg shadow-md text-center">
            <p className="text-sm font-semibold">Carbs</p>
            <p className="text-lg">
              {selectedServingInfo?.nutritionFacts?.carbs?.value || "N/A"}{" "}
              {selectedServingInfo?.nutritionFacts?.carbs?.unit || ""}
            </p>
          </div>
          <div className="bg-red-100 text-red-800 p-3 rounded-lg shadow-md text-center">
            <p className="text-sm font-semibold">Fat</p>
            <p className="text-lg">
              {selectedServingInfo?.nutritionFacts?.totalFat?.value || "N/A"}{" "}
              {selectedServingInfo?.nutritionFacts?.totalFat?.unit || ""}
            </p>
          </div>
        </div>

        {/* Price */}
        <div
          className="text-sm bg-indigo-600 mx-10 shadow-lg text-center rounded-sm py-1 text-white mt-2"
          onClick={openModal}
        >
          <strong>Price: ${selectedServingInfo?.price || "N/A"}</strong>
        </div>

        {/* Dates */}
        <div
          className="text-xs flex text-gray-400 mt-1 justify-between"
          onClick={openModal}
        >
          <p>
            <strong>Created At:</strong> {formatDate(createdAt)}
          </p>
          <p>
            <strong>Updated At:</strong> {formatDate(updatedAt)}
          </p>
        </div>
      </div>

      {/* Popups and Modals */}
      {showDeletePopup && (
        <DeleteDishPopup
          restaurantId={restaurantId}
          dish={dish}
          closePopup={closePopup}
          onDeleteSuccess={handleDeleteSuccess}
        />
      )}

      {showEditPopup && (
        <AddDishPopup
          mode="edit"
          dish={dish}
          closePopup={closePopup}
          updateDishList={handleEditSuccess}
          restaurantId={restaurantId}
        />
      )}

      {/* Detailed Modal View */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-lg w-full">
            <h3 className="text-2xl font-bold mb-4">{dishName}</h3>

            <div className="mb-4 text-gray-700 overflow-y-auto max-h-60">
              {limitedDescription.split("\n").map((line, index) => (
                <p key={index} className="mb-1">
                  {line}
                </p>
              ))}
            </div>

            <div className="text-sm flex justify-between text-gray-600 mb-2">
              <p>
                <strong>Category:</strong>
              </p>
              <p>
                <strong>{categoryName}</strong>
              </p>
            </div>
            <div className="text-sm flex justify-between text-gray-600 mb-2">
              <p>
                <strong>Subcategory:</strong>
              </p>
              <p>
                <strong>{subCategoryName}</strong>
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 justify-start space-x-2 mb-4">
              {servingInfos.map((info, index) => (
                <button
                  key={index}
                  onClick={() => handleServingSizeChange(info)}
                  className={`px-3 py-2 rounded-full text-sm transition-colors duration-300 ${
                    selectedServingInfo?.size === info.servingInfo.size
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-blue-200"
                  }`}
                  title={info.servingInfo.size}
                >
                  {info.servingInfo.size}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-6 mb-4 mx-8">
              <div className="bg-blue-100 text-blue-800 p-3 rounded-lg shadow-md text-center">
                <p className="text-sm font-semibold">Calories</p>
                <p className="text-lg">
                  {selectedServingInfo?.nutritionFacts?.calories?.value ||
                    "N/A"}{" "}
                  {selectedServingInfo?.nutritionFacts?.calories?.unit || ""}
                </p>
              </div>
              <div className="bg-green-100 text-green-800 p-3 rounded-lg shadow-md text-center">
                <p className="text-sm font-semibold">Protein</p>
                <p className="text-lg">
                  {selectedServingInfo?.nutritionFacts?.protein?.value || "N/A"}{" "}
                  {selectedServingInfo?.nutritionFacts?.protein?.unit || ""}
                </p>
              </div>
              <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg shadow-md text-center">
                <p className="text-sm font-semibold">Carbs</p>
                <p className="text-lg">
                  {selectedServingInfo?.nutritionFacts?.carbs?.value || "N/A"}{" "}
                  {selectedServingInfo?.nutritionFacts?.carbs?.unit || ""}
                </p>
              </div>
              <div className="bg-red-100 text-red-800 p-3 rounded-lg shadow-md text-center">
                <p className="text-sm font-semibold">Fat</p>
                <p className="text-lg">
                  {selectedServingInfo?.nutritionFacts?.totalFat?.value ||
                    "N/A"}{" "}
                  {selectedServingInfo?.nutritionFacts?.totalFat?.unit || ""}
                </p>
              </div>
            </div>

            <div className="text-sm bg-indigo-600 mx-32 mb-2 shadow-lg text-center rounded-sm py-3 text-white mt-2">
              <strong>Price: ${selectedServingInfo?.price || "N/A"}</strong>
            </div>

            <div className="text-xs flex text-gray-400 mt-1 justify-between">
              <p>
                <strong>Created At:</strong> {formatDate(createdAt)}
              </p>
              <p>
                <strong>Updated At:</strong> {formatDate(updatedAt)}
              </p>
            </div>

            <button
              onClick={closeModal}
              className="mt-4 p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DishCard;
