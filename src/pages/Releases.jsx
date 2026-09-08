import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ReleasesPage from "../components/ReleasesPage";
import PageTransition from "../components/PageTransition";

const Releases = () => {
  return (
    <div>
      <PageTransition>
        <Navbar />
        <ReleasesPage />
        <Footer />
      </PageTransition>
    </div>
  );
};

export default Releases;
