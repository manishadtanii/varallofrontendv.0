import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { HiOutlineX, HiOutlineFolder, HiOutlineSearch, HiOutlineDownload } from "react-icons/hi";
import { API_BASE_URL } from "../../services/apiService";

const MediaLibrary = ({ isOpen, onClose, onSelectImage }) => {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [folders, setFolders] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // grid or folder
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch media library on mount
  useEffect(() => {
    if (isOpen) {
      fetchMediaLibrary();
    }
  }, [isOpen]);

  const fetchMediaLibrary = async () => {
    try {
      setLoading(true);
      const response = await fetch( `${API_BASE_URL}/upload/media/library`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch media library");
      }

      console.log("📚 Media Library fetched:", data);

      setImages(data.allResources || []);
      setFolders(Object.keys(data.folders || {}));
      setFilteredImages(data.allResources || []);
      toast.success(`Loaded ${data.totalImages} images`);
    } catch (error) {
      console.error("❌ Error fetching media library:", error);
      toast.error(error.message || "Failed to fetch media library");
    } finally {
      setLoading(false);
    }
  };

  // Filter images based on folder and search query
  useEffect(() => {
    let filtered = [...images];

    // Filter by folder
    if (selectedFolder !== "all") {
      filtered = filtered.filter((img) => img.folder === selectedFolder);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((img) =>
        img.publicId.toLowerCase().includes(query) ||
        img.folder?.toLowerCase().includes(query)
      );
    }

    setFilteredImages(filtered);
  }, [selectedFolder, searchQuery, images]);

  const handleSelectImage = (image) => {
    onSelectImage(image);
    toast.success("Image selected!");
    onClose();
  };

  const handleDownloadImage = (url, name) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = name || "image.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <>
      <Toaster />
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-[#0f1419] rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col border border-cyan-500/20">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 p-6 flex justify-between items-center border-b border-cyan-500/20">
            <h2 className="text-2xl font-bold text-white">Media Library</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition"
            >
              <HiOutlineX size={28} />
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-1 overflow-hidden gap-4 p-6">
            {/* Sidebar - Folders */}
            <div className="w-64 border border-cyan-500/20 rounded-lg p-4 overflow-y-auto bg-black/40">
              <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
                <HiOutlineFolder size={20} /> Folders
              </h3>
              <button
                onClick={() => setSelectedFolder("all")}
                className={`w-full text-left px-4 py-2 rounded-lg mb-2 transition ${
                  selectedFolder === "all"
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                All Images ({images.length})
              </button>

              {folders.map((folder) => {
                const count = images.filter((img) => img.folder === folder).length;
                return (
                  <button
                    key={folder}
                    onClick={() => setSelectedFolder(folder)}
                    className={`w-full text-left px-4 py-2 rounded-lg mb-2 transition text-sm truncate ${
                      selectedFolder === folder
                        ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                        : "text-gray-400 hover:text-white"
                    }`}
                    title={folder}
                  >
                    {folder.split("/").pop()} ({count})
                  </button>
                );
              })}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Search Bar */}
              <div className="mb-4 flex gap-2">
                <div className="flex-1 relative">
                  <HiOutlineSearch className="absolute left-3 top-3 text-gray-500" size={20} />
                  <input
                    type="text"
                    placeholder="Search by name or folder..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black/40 border border-cyan-500/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/40"
                  />
                </div>
                <button
                  onClick={fetchMediaLibrary}
                  className="bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 px-4 py-2 rounded-lg hover:bg-cyan-500/30 transition"
                >
                  Refresh
                </button>
              </div>

              {/* Loading State */}
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cyan-500 mb-4 mx-auto" />
                    <p className="text-gray-400">Loading media library...</p>
                  </div>
                </div>
              ) : filteredImages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 text-lg">No images found</p>
                </div>
              ) : (
                /* Image Grid */
                <div className="overflow-y-auto flex-1">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-4">
                    {filteredImages.map((image) => (
                      <div
                        key={image.publicId}
                        className="group relative bg-black/40 border border-cyan-500/20 rounded-lg overflow-hidden hover:border-cyan-500/60 transition cursor-pointer"
                        onClick={() => handleSelectImage(image)}
                      >
                        {/* Image */}
                        <div className="aspect-square overflow-hidden">
                          <img
                            src={image.url}
                            alt={image.publicId}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/200?text=Error";
                            }}
                          />
                        </div>

                        {/* Overlay Actions */}
                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectImage(image);
                            }}
                            className="bg-cyan-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-cyan-400 transition"
                          >
                            Select
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadImage(image.url, image.publicId);
                            }}
                            className="bg-blue-500/50 text-white p-2 rounded-lg hover:bg-blue-500 transition"
                            title="Download"
                          >
                            <HiOutlineDownload size={20} />
                          </button>
                        </div>

                        {/* Image Info */}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-2 text-xs text-gray-300 truncate">
                          {image.width} x {image.height}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="border-t border-cyan-500/20 pt-4 mt-4 text-sm text-gray-400">
                Showing {filteredImages.length} of {images.length} images
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MediaLibrary;
