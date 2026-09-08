import React from "react";
import Navbar from "../components/Navbar";
import BookingPage from "../components/BookingPage";
import Footer from "../components/Footer";
import PageTransition from "../components/PageTransition";

const Booking = () => {
  return (
    <div>
      <PageTransition>
        <Navbar />
        <BookingPage />
        <Footer />
      </PageTransition>
    </div>
  );
};

export default Booking;
