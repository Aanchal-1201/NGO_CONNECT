import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import AuthPage from "./pages/Auth/AuthPage";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminNGOs from "./pages/Admin/AdminNGOs";
import AdminHelpRequests from "./pages/Admin/AdminHelpRequests";
import NGODashboard from "./pages/NGOs/NGODashboard";
import NGONearbyRequests from "./pages/NGOs/NGONearbyRequests";
import NGOAcceptedRequests from "./pages/NGOs/NGOAcceptedRequests";
import NGONotifications from "./pages/NGOs/NGONotifications";
import HomeLayout from "./pages/HomeScreen/HomeLayout";
import RaiseHelpRequest from "./pages/RaiseHelpRequest/RaiseHelpRequest";
import ExploreNGOs from "./pages/ExploreNGOs/ExploreNGOs";
import AIChat from "./components/AIChat/AIChat";
import "mapbox-gl/dist/mapbox-gl.css";

function App() {
  const location = useLocation();

  // Handle Hash Links for SPA
  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const id = location.hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }, [location]);

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isNGORoute = location.pathname.startsWith("/ngo");
  const isAuthRoute = location.pathname.startsWith("/auth"); // 👈 add this

  const hideLayout = isAdminRoute || isNGORoute || isAuthRoute; // 👈 update here

  return (
    <>
      {!hideLayout && <Navbar />}

      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<HomeLayout />} />
        <Route path="/raise-request" element={<RaiseHelpRequest/>}/>
        <Route path="/explore-ngos" element={<ExploreNGOs/>}/>

        {/* ADMIN ROUTES */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/ngos" element={<AdminNGOs />} />
        <Route path="/admin/help-requests" element={<AdminHelpRequests />} />

        {/* NGO ROUTES */}
        <Route path="/ngo/dashboard" element={<NGODashboard />} />
        <Route path="/ngo/nearby" element={<NGONearbyRequests />} />
        <Route path="/ngo/accepted" element={<NGOAcceptedRequests />} />
        <Route path="/ngo/notifications" element={<NGONotifications />} />
      </Routes>

      {!hideLayout && <Footer />}

      {/* AI Chatbot — available on all pages */}
      <AIChat />
    </>
  );
}
export default App;
