import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import movies from "../assets/moviesData";
import { moviesPageStyles } from "../assets/dummyStyles";
import { Link } from "react-router-dom";

const MoviesPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [showAll, setShowAll] = useState(false);

  const filteredMovies =
    activeCategory === "all"
      ? movies
      : movies.filter((movie) => movie.category === activeCategory);

  const COLLAPSE_COUNT = 12;

  useEffect(() => {
    setShowAll(false);
  }, [activeCategory]);

  const visibleMovies = showAll
    ? filteredMovies
    : filteredMovies.slice(0, COLLAPSE_COUNT);

  const categories = [
    { id: "all", name: "All Movies" },
    { id: "action", name: "Action" },
    { id: "horror", name: "Horror" },
    { id: "comedy", name: "Comedy" },
    { id: "adventure", name: "Adventure" },
  ];

  return (
    <div className={moviesPageStyles.container}>
      {/* قسم التصنيفات */}
      <section className={moviesPageStyles.categoriesSection}>
        <div className={moviesPageStyles.categoriesContainer}>
          <div className={moviesPageStyles.categoriesFlex}>
            {categories.map((category) => (
              <button
                key={category.id}
                className={`${moviesPageStyles.categoryButton.base} ${
                  activeCategory === category.id
                    ? moviesPageStyles.categoryButton.active
                    : moviesPageStyles.categoryButton.inactive
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className={moviesPageStyles.moviesSection}>
        <div className={moviesPageStyles.moviesContainer}>
          {/* AnimatePresence لمعالجة انتقالات الحركة عند تغيير التصنيف */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={moviesPageStyles.moviesGrid}
            >
              {visibleMovies.map((movie) => (
                <Link
                  key={movie.id}
                  to={`/movies/${movie.id}`}
                  state={{ movie }}
                  className={moviesPageStyles.movieCard}
                >
                  <div className={moviesPageStyles.movieImageContainer}>
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className={moviesPageStyles.movieImage}
                    />
                  </div>

                  <div className={moviesPageStyles.movieInfo}>
                    <h3 className={moviesPageStyles.movieTitle}>
                      {movie.title}
                    </h3>
                    <div className={moviesPageStyles.movieCategory}>
                      <span className={moviesPageStyles.movieCategoryText}>
                        {movie.category}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}

              {filteredMovies.length === 0 && (
                <div className={moviesPageStyles.emptyState}>
                  No movies found in this category
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* زرار Show More */}
          {filteredMovies.length > COLLAPSE_COUNT && (
            <div className={moviesPageStyles.showMoreContainer}>
              <button
                onClick={() => setShowAll((prev) => !prev)}
                className={moviesPageStyles.showMoreButton}
              >
                {showAll
                  ? "Show Less"
                  : `Show More (${
                      filteredMovies.length - COLLAPSE_COUNT
                    } more)`}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MoviesPage;