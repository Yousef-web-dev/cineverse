import React, { useEffect } from "react";
import { initSmoothScroll } from "./library/SmoothScroll";
import { initDragScroll } from "./library/useSmoothDragScroll";
import { Routes, Route } from "react-router-dom"; 
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Movie from "./pages/Movie";
import { AnimatePresence } from "framer-motion";
import Releases from "./pages/Releases";
import Booking from "./pages/Booking";
import Contact from "./pages/Contact";
import MovieDetailPage from "./pages/MovieDetailPage";
import MovieDetailPageHome from "./pages/MovieDetailPageHome";

import SeatSelector from "./pages/SeatSelector";
import ScrollToTop from "./components/ScrollToTop";


const App = () => {
  useEffect(() => {
    const lenis = initSmoothScroll();
    const removeDragEvents = initDragScroll(lenis);

    return () => {
      lenis.destroy();
      removeDragEvents();
    };
  }, []);
  return (
    <>
    <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/movies" element={<Movie />} />
          <Route path="/releases" element={<Releases />} />
          <Route path="/bookings" element={<Booking />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/movies/:id" element={<MovieDetailPage />} />
          <Route path="/movie/:id" element={<MovieDetailPageHome />} />

          <Route path="/movies/:id/seat/:slot" element={<SeatSelector />} />
          <Route path="/movies/:id/seat-selector/:slot" element={<SeatSelector />} />


          
        </Routes>
      </AnimatePresence>
    </>
  );
};

export default App;
