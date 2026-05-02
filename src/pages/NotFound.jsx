import React from "react";
import { Link } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";
import "../styles/not-found.css";

function NotFound() {
  return (
    <MainLayout>
      <div className="not-found-page">
        <div className="not-found-content">
          <h1 className="not-found-icon">404</h1>
          <h2>Page Not Found</h2>
          <p>The page you're looking for doesn't exist.</p>
          <Link to="/" className="btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}

export default NotFound;

