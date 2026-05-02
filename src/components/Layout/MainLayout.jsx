import React from "react";
import Header from "../Common/Header";
import BottomNavigation from "./BottomNavigation";
import "../../styles/layout.css";

function MainLayout({ children }) {
  return (
    <div className="main-layout">
      <Header />
      <main className="main-content">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
}

export default MainLayout;

