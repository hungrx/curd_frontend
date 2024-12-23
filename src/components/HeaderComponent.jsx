import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "/images/hungrx-logo.webp";

const Header = () => {
  const navigate = useNavigate();

  const goToRestaurants = () => {
    // This will navigate to /Restaurants and refresh the page
    window.location.href = "/Restaurants";
  };
  return (
    <div className="flex justify-between lg:py-4 lg:px-10 top-0 bg-white min-w-screen-sm">
      <div className="flex justify-evenly items-center text-2xl font-bold ">
        <div>
          <Link to="/">
            <img className="w-16" src={logo} alt="" />
          </Link>
        </div>
        <div className="ml-2 lg:ml-6 lg:text-3xl">
          <h1>
            <Link to="/">HungrX</Link>
          </h1>
        </div>

        <div className="lg:ml-8 ml-2 hover:underline">
          <button onClick={goToRestaurants}>Restaurants</button>
        </div>
      </div>
    </div>
  );
};

export default Header;
