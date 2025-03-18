
import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { useAuth } from "@/contexts/AuthContext";

export default function Layout() {
  const location = useLocation();
  const { profile } = useAuth();
  const [pageTitle, setPageTitle] = useState("Dashboard");

  useEffect(() => {
    // Set page title based on current route
    const path = location.pathname;
    if (path.includes("/map")) {
      setPageTitle("Map Navigation");
    } else if (path.includes("/robots")) {
      setPageTitle("Robot Fleet");
    } else if (path.includes("/tasks")) {
      setPageTitle("Task Management");
    } else if (path.includes("/settings")) {
      setPageTitle("System Settings");
    } else if (path.includes("/documentation")) {
      setPageTitle("Documentation");
    } else {
      setPageTitle("Dashboard");
    }

    // Add page transition effect
    document.body.classList.add("page-transition");
    return () => {
      document.body.classList.remove("page-transition");
    };
  }, [location]);

  // Check if we're on the map page which should be fullscreen
  const isMapPage = location.pathname === "/map";

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header pageTitle={pageTitle} userProfile={profile} />
        <main className={`flex-1 overflow-auto ${isMapPage ? 'p-0' : 'p-6'}`}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
