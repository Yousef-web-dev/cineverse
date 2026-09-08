import React from "react";
import Navbar from "../components/Navbar";
import ContactPage from "../components/ContactPage";
import Footer from "../components/Footer";
import PageTransition from "../components/PageTransition";

const Contact = () => {
  return (
    <div>
      <PageTransition>
        <Navbar />
        <ContactPage />
        <Footer />
      </PageTransition>
    </div>
  );
};

export default Contact;
