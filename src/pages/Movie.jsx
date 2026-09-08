import React from "react";
import Navbar from "../components/Navbar";
import MoviePage from "../components/MoviePage";
import Footer from "../components/Footer";
import PageTransition from "../components/PageTransition";

const Movie = () => {
  return (
    <div>
      <PageTransition>
        <Navbar />
        <MoviePage />
        <Footer />
      </PageTransition>
    </div>
  );
};

export default Movie;
