import React, { useState, useEffect } from 'react';
import resImage from '/images/res4.jpg';
import dishImage from '/images/dish2.jpg';

const baseUrl = import.meta.env.VITE_APP_BASE_URL;

const Home = () => {
  const [data, setData] = useState({ totalRestaurants: 0, totalDishes: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [restaurantsResponse, dishesResponse] = await Promise.all([
          fetch(`${baseUrl}/api/restaurants/totalRestaurants`),
          fetch(`${baseUrl}/api/restaurants/totalDishes`),
        ]);

        if (!restaurantsResponse.ok || !dishesResponse.ok) {
          throw new Error(`Failed to fetch: ${restaurantsResponse.statusText || dishesResponse.statusText}`);
        }

        const restaurantsData = await restaurantsResponse.json();
        const dishesData = await dishesResponse.json();

        setData({
          totalRestaurants: restaurantsData.totalRestaurants ?? 0,
          totalDishes: dishesData.totalDishes ?? 0,
        });
        setError(null);
      } catch (err) {
        setError(err.message);
        setData({ totalRestaurants: 0, totalDishes: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-200">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      {error && (
        <div className="max-w-6xl mx-auto mb-8 bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {[
          {
            title: 'Restaurants',
            image: resImage,
            count: data.totalRestaurants,
            bgClass: 'bg-green-50',
            textColor: 'text-green-900',
            borderClass: 'border-green-100',
            gradientClass: 'from-green-100 via-white to-green-100',
          },
          {
            title: 'Dishes',
            image: dishImage,
            count: data.totalDishes,
            bgClass: 'bg-red-50',
            textColor: 'text-red-900',
            borderClass: 'border-red-100',
            gradientClass: 'from-red-100 via-white to-red-100',
          },
        ].map(({ title, image, count, bgClass, textColor, borderClass, gradientClass }, index) => (
          <div
            key={index}
            className={`transform transition duration-500 hover:scale-105 ${
              index % 2 === 0 ? 'hover:rotate-1' : 'hover:-rotate-1'
            } hover:shadow-2xl bg-white rounded-2xl shadow-xl border-2 ${borderClass} overflow-hidden relative`}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-r ${gradientClass} opacity-20`}
            ></div>
            <div className="relative z-10 p-6 flex flex-col items-center text-center">
              <h1 className={`text-4xl font-extrabold ${textColor} mb-4 tracking-tight`}>
                {title}
              </h1>

              <div className="w-full mb-4 overflow-hidden rounded-xl shadow-lg transform transition duration-300 hover:scale-110">
                <img
                  className="w-full h-48 lg:h-60 object-cover"
                  src={image}
                  alt={title}
                />
              </div>

              <div className={`${bgClass} rounded-xl p-4 mt-4 shadow-inner`}>
                <h2 className={`text-lg font-semibold ${textColor}`}>Total {title}</h2>
                <h3 className={`text-6xl font-black ${textColor} mt-2`}>
                  {count}
                </h3>
              </div>

              <p className="text-gray-500 mt-2 italic">(added till now)</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
