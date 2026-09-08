import React from "react";
import LoginPage from "../components/LoginPage";
import PageTransition from "../components/PageTransition";

const Login = () => {
  return (
    <div>
      <PageTransition>
        <LoginPage />
      </PageTransition>
    </div>
  );
};

export default Login;
