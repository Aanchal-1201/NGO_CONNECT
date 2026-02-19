import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
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

function App() {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isNGORoute = location.pathname.startsWith("/ngo");

  const hideLayout = isAdminRoute || isNGORoute;

  return (
    <>
      {!hideLayout && <Navbar />}

      <Routes>
        <Route path="/auth" element={<AuthPage />} />

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
    </>
  );
}

export default App;
