import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LayoutWrapper from "./components/LayoutWrapper";
import Service from "./pages/Service";
import ServiceDetails from "./pages/ServiceDetails";
import ScrollToTop from "./components/ScrollToTop";
import Blog from "./pages/Blog";
import BlogDetails from "./pages/BlogDetails";
import ThankYouPage from "./components/ThankYouPage";
import AdminLogin from "./cms/admin/AdminLogin";
import ForgotPassword from "./cms/admin/ForgotPassword";
import ResetSuccess from "./cms/admin/ResetSuccess";
import Dashboard from "./cms/admin/Dashboard";
import ProtectedRoute from "./cms/components/ProtectedRoute";
import { API_BASE_URL } from "./services/apiService";

function App() {
  const [visiblePages, setVisiblePages] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 1000, // Duration of each animation (ms)
      delay: 1000, // 👈 Global delay before each animation starts
      once: true,
      mirror: false,
    });
  }, []);

  // Re-initialize whenever `data` changes
  useEffect(() => {
    AOS.refresh();
  });

  // 🟢 NEW: Fetch pages visibility status - can be called multiple times
  const fetchVisiblePages = async () => {
    try {
      console.log("📄 Fetching pages visibility status...");
      const response = await fetch(`${API_BASE_URL}/pages`);
      const data = await response.json();

      if (data.data && Array.isArray(data.data)) {
        // Build a map of visible pages
        const pageMap = {};
        data.data.forEach((page) => {
          pageMap[page.slug] = page.isPublished !== false; // Default to true if not set
        });
        console.log("✅ Pages visibility map:", pageMap);
        setVisiblePages(pageMap);
      }
    } catch (error) {
      console.error("❌ Error fetching pages visibility:", error);
      // Default: show all pages if API fails
      setVisiblePages({
        home: true,
        about: true,
        contact: true,
        services: true,
        blog: true,
        "privacy-policy": true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Load pages on mount
  useEffect(() => {
    fetchVisiblePages();
  }, []);

  // Helper to check if page is visible
  const isPageVisible = (slug) => {
    return visiblePages[slug] !== false; // Default to visible
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <LayoutWrapper>
        <Routes>
          <Route path="/" element={<Home />} />
          {isPageVisible("about") && <Route path="/about" element={<About />} />}
          {isPageVisible("privacy-policy") && (
            <Route path="/privacy-policy" element={<Privacy />} />
          )}
          {isPageVisible("contact") && <Route path="/contact" element={<Contact />} />}
          {isPageVisible("services") && (
            <>
              <Route path="/services" element={<Service />} />
              <Route path="/services/:serviceId" element={<ServiceDetails />} />
            </>
          )}
          {isPageVisible("blog") && (
            <>
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogDetails />} />
            </>
          )}
          <Route
            path="/thank-you"
            element={
              <ThankYouPage
                title={"Thank you for filling the form!"}
                message="We’ll send a confirmation email within 24 hours once you submit your request. If you haven’t received it by then, please contact our office to confirm we’ve received your scheduling request."
                btnText={"Go back to Home Page"}
                btnLink={"/"}
              />
            }
          />
          <Route
            path="/*"
            element={
              <ThankYouPage
                title={"Error 404: Page not found"}
                message="The page you are looking for might have been removed, had its name changed or is temporarily unavailable"
                btnText={"Go back to Home Page"}
                btnLink={"/"}
              />
            }
          />
          {/* Admin Login Route */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Forgot Password Route - No authentication required */}
          <Route path="/admin/forgot-password" element={<ForgotPassword />} />
          
          {/* Change Password Route - Authentication required */}
          <Route
            path="/admin/change-password"
            element={
              <ProtectedRoute>
                <ForgotPassword />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/reset-success" element={<ResetSuccess />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;