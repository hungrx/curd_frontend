import { Route, Routes } from "react-router-dom";

import "./App.css";
import Header from "./components/HeaderComponent";
import Home from "./pages/Home";
import Restaurants from "./pages/Restaurants";
import RestaurantDishes from "./pages/RestaurantDishes";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Restaurants" element={<Restaurants />} />
        <Route
          path="/restaurant/:restaurantId"
          element={<RestaurantDishes />}
        />
      </Routes>
    </>
  );
}

export default App;
