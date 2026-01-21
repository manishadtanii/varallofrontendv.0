import React, { useState, useEffect } from "react";
import { HiOutlineX, HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import toast from "react-hot-toast";
import { pageAPI } from "../../services/apiService";

const PagesManagement = ({ isOpen, onClose, onPageToggled }) => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [togglingSlug, setTogglingSlug] = useState(null);

  // Fetch all pages on mount
  useEffect(() => {
    if (isOpen) {
      fetchPages();
    }
  }, [isOpen]);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const response = await pageAPI.getAllPagesStatus();
      console.log("📋 Pages fetched:", response.data);
      setPages(response.data || []);
    } catch (error) {
      console.error("❌ Failed to fetch pages:", error);
      toast.error("Failed to load pages");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (slug) => {
    try {
      setTogglingSlug(slug);
      console.log(`🔄 Toggling page: ${slug}`);

      const response = await pageAPI.togglePageVisibility(slug);
      console.log("✅ Toggle response:", response);

      // Update local state
      setPages((prevPages) =>
        prevPages.map((page) =>
          page.slug === slug
            ? { ...page, isPublished: !page.isPublished }
            : page
        )
      );

      const newStatus = response.data?.isPublished ? "Published" : "Unpublished";
      toast.success(`✅ ${response.data?.title} ${newStatus}`);
      toast.loading("💾 Changes will appear on the website after refresh", { duration: 3000 });

      // 🟢 NEW: Trigger refresh in both App.jsx and Header.jsx
      localStorage.setItem('pages_refreshed', Date.now().toString());
      window.dispatchEvent(new Event('pagesVisibilityChanged'));

      // Trigger parent component refresh
      if (onPageToggled) {
        console.log("🔄 Triggering parent refresh...");
        setTimeout(() => {
          onPageToggled();
        }, 500);
      }
    } catch (error) {
      console.error("❌ Failed to toggle page:", error);
      toast.error("Failed to toggle page visibility");
    } finally {
      setTogglingSlug(null);
    }
  };

  const handleClose = () => {
    // Trigger refresh when closing
    if (onPageToggled) {
      console.log("🔄 Modal closed - triggering refresh...");
      localStorage.setItem('pages_refreshed', Date.now().toString());
      window.dispatchEvent(new Event('pagesVisibilityChanged'));
      onPageToggled();
    }
    onClose();
  };

  // Group pages by parent (main pages vs service pages)
  // 🟢 NEW: Exclude home page from main pages
  const mainPages = pages.filter((page) => !page.parentSlug && page.slug !== 'home');
  const servicePages = pages.filter((page) => page.parentSlug);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0f14] border border-gray-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white">📄 Pages Management</h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-800 rounded-lg transition"
              >
                <HiOutlineX className="text-xl text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="text-gray-400">Loading pages...</div>
                </div>
              ) : pages.length === 0 ? (
                <div className="flex items-center justify-center h-40">
                  <div className="text-gray-400">No pages found</div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Main Pages Section */}
                  {mainPages.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">
                        📌 Main Pages
                      </h3>
                      <div className="space-y-2">
                        {mainPages.map((page) => (
                          <div
                            key={page.slug}
                            className="flex items-center justify-between p-4 bg-gray-900/50 border border-gray-800 rounded-xl hover:border-gray-700 transition"
                          >
                            <div className="flex-1">
                              <h4 className="text-sm font-bold text-white">
                                {page.title}
                              </h4>
                              <p className="text-xs text-gray-500 mt-1">
                                {page.route || page.slug}
                              </p>
                            </div>

                            {/* Toggle Switch */}
                            <button
                              onClick={() => handleToggle(page.slug)}
                              disabled={togglingSlug === page.slug}
                              className={`ml-4 p-3 rounded-lg border transition ${
                                page.isPublished
                                  ? "bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20"
                                  : "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
                              } ${
                                togglingSlug === page.slug
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              {page.isPublished ? (
                                <HiOutlineEye className="text-lg" />
                              ) : (
                                <HiOutlineEyeOff className="text-lg" />
                              )}
                            </button>

                            {/* Status Badge */}
                            <div className="ml-2">
                              <span
                                className={`text-xs font-bold px-3 py-1 rounded-full ${
                                  page.isPublished
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-red-500/20 text-red-400"
                                }`}
                              >
                                {page.isPublished ? "Published" : "Hidden"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Service Pages Section */}
                  {servicePages.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 mt-6">
                        🎯 Service Details
                      </h3>
                      <div className="space-y-2">
                        {servicePages.map((page) => (
                          <div
                            key={page.slug}
                            className="flex items-center justify-between p-4 bg-gray-900/50 border border-gray-800 rounded-xl hover:border-gray-700 transition"
                          >
                            <div className="flex-1">
                              <h4 className="text-sm font-bold text-white">
                                {page.title}
                              </h4>
                              <p className="text-xs text-gray-500 mt-1">
                                /{page.parentSlug}/{page.slug}
                              </p>
                            </div>

                            {/* Toggle Switch */}
                            <button
                              onClick={() => handleToggle(page.slug)}
                              disabled={togglingSlug === page.slug}
                              className={`ml-4 p-3 rounded-lg border transition ${
                                page.isPublished
                                  ? "bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20"
                                  : "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
                              } ${
                                togglingSlug === page.slug
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              {page.isPublished ? (
                                <HiOutlineEye className="text-lg" />
                              ) : (
                                <HiOutlineEyeOff className="text-lg" />
                              )}
                            </button>

                            {/* Status Badge */}
                            <div className="ml-2">
                              <span
                                className={`text-xs font-bold px-3 py-1 rounded-full ${
                                  page.isPublished
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-red-500/20 text-red-400"
                                }`}
                              >
                                {page.isPublished ? "Published" : "Hidden"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-800 p-4 flex justify-end gap-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PagesManagement;
