
import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
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
    } else if (path.includes("/dashboard")) {
      setPageTitle("Dashboard");
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

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header pageTitle={pageTitle} userProfile={profile} />
        <main className="flex-1 overflow-auto p-4">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
