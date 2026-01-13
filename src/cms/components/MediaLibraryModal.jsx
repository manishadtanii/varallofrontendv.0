import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  HiOutlineX,
  HiOutlineSearch,
  HiOutlineUpload,
} from "react-icons/hi";

/**
 * MediaLibraryModal Component
 * A professional modal that displays all uploaded images from Cloudinary
 * 
 * MODES:
 * - "view": Browse and copy URLs (default - sidebar button)
 * - "select": Click image to select and populate field (section integration)
 * 
 * Users can:
 * - Browse images by folder
 * - Search images
 * - Copy image URL (view mode) OR Select image (select mode)
 */
const MediaLibraryModal = ({ isOpen, onClose, onSelectImage, mode = "view", onImageSelect }) => {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [folders, setFolders] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch media library on modal open
  useEffect(() => {
    if (isOpen) {
      fetchMediaLibrary();
    }
  }, [isOpen]);

  // Handle file upload
  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (file.size > maxSize) {
      toast.error("File size must be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      // Create FormData
      const formData = new FormData();
      formData.append("image", file);  // Backend expects 'image' field name
      formData.append("folder", "varallo-images/varallo");  // Consistent folder structure

      // Call backend upload API
      const response = await fetch("http://localhost:3000/api/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Upload failed");
      }

      toast.success("Image uploaded successfully!");
      setUploadProgress(100);
      
      // Refresh media library
      setTimeout(() => {
        fetchMediaLibrary();
        setUploadProgress(0);
      }, 500);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Filter images based on folder and search
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
        img.publicId?.toLowerCase().includes(query) ||
        img.folder?.toLowerCase().includes(query)
      );
    }

    setFilteredImages(filtered);
  }, [selectedFolder, searchQuery, images]);

  const fetchMediaLibrary = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/upload/media/library", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch media library");
      }

      console.log("📚 Media Library fetched:", data.totalImages, "images");
      setImages(data.allResources || []);
      
      // Filter out 'uncategorized' folder and only get valid folders
      const validFolders = Object.keys(data.folders || {})
        .filter(folder => folder && folder !== 'uncategorized')
        .sort();
      
      setFolders(validFolders);
      setFilteredImages(data.allResources || []);
      toast.success(`Loaded ${data.totalImages} images`);
    } catch (error) {
      console.error("❌ Error fetching media library:", error);
      toast.error(error.message || "Failed to fetch media library");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectImage = (image) => {
    if (mode === "select" && onImageSelect) {
      // SELECT MODE: Return image URL to parent component
      onImageSelect(image.url);
      console.log("📸 Image selected:", image.url);
      onClose(); // Auto-close modal
    } else if (mode === "view" && onSelectImage) {
      // VIEW MODE: Copy to clipboard (existing behavior)
      onSelectImage(image.url);
      console.log("📋 Image URL copied to clipboard");
    }
    setSelectedImage(image);
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    // toast.success("Image URL copied!");
  };

  if (!isOpen) return null;

  return (
    <>
      <Toaster />
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 z-40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-[#0f1419] via-[#0a0f14] to-black rounded-3xl w-full max-w-6xl max-h-[85vh] overflow-hidden flex flex-col border border-cyan-500/40 shadow-2xl shadow-cyan-900/50">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-900/50 via-blue-900/40 to-purple-900/30 px-4 py-3 flex justify-between items-center border-b border-cyan-500/30">
            <div>
              <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                Media Library
              </h2>
              <p className="text-gray-400 text-sm mt-2">
                {images.length} images • {folders.length} folders
              </p>
            </div>
            <div className="flex gap-3 items-center">
              {/* Upload Button */}
              <label className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-500 hover:to-emerald-500 transition-all cursor-pointer font-semibold text-sm shadow-lg shadow-green-500/20">
                <HiOutlineUpload size={18} />
                Upload
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-cyan-400 transition-all duration-300 p-2 rounded-lg hover:bg-cyan-500/10"
              >
                <HiOutlineX size={32} />
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex flex-1 overflow-hidden gap-6 p-8">
            {/* Sidebar - Folders */}
            <div className="w-64 bg-gradient-to-b from-black/60 to-black/40 border border-cyan-500/20 rounded-2xl p-6 overflow-y-auto flex flex-col">
              <h3 className="text-sm font-bold text-cyan-400 mb-6 uppercase tracking-wider">
                Categories
              </h3>

              {/* All Images button */}
              <button
                onClick={() => setSelectedFolder("all")}
                className={`w-full text-left px-4 py-3 rounded-xl mb-2 transition-all duration-300 font-semibold flex items-center justify-between text-sm ${
                  selectedFolder === "all"
                    ? "bg-gradient-to-r from-cyan-500/30 to-blue-500/20 text-cyan-300 border border-cyan-500/60 shadow-lg shadow-cyan-500/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <span>All Images</span>
                <span className="text-xs bg-black/70 px-2.5 py-1 rounded-lg font-mono text-gray-400">
                  {images.length}
                </span>
              </button>

              {/* Folder list */}
              <div className="space-y-2">
                {folders.map((folder) => {
                  const count = images.filter((img) => img.folder === folder).length;
                  const folderName = folder.split("/").pop() || folder;
                  
                  return (
                    <button
                      key={folder}
                      onClick={() => setSelectedFolder(folder)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 text-sm flex items-center justify-between group ${
                        selectedFolder === folder
                          ? "bg-gradient-to-r from-cyan-500/30 to-blue-500/20 text-cyan-300 border border-cyan-500/60 shadow-lg shadow-cyan-500/10"
                          : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                      }`}
                      title={folder}
                    >
                      <span className="truncate font-semibold">{folderName}</span>
                      <span className="text-xs bg-black/70 px-2.5 py-1 rounded-lg font-mono text-gray-400 whitespace-nowrap ml-2">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {folders.length === 0 && !loading && (
                <p className="text-gray-600 text-xs text-center mt-6">No folders</p>
              )}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Search Bar */}
              <div className="mb-6 flex gap-3">
                <div className="flex-1 relative">
                  <HiOutlineSearch className="absolute left-4 top-4 text-gray-600 text-lg" />
                  <input
                    type="text"
                    placeholder="Search images..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gradient-to-r from-black/80 to-black/60 border border-cyan-500/30 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/60 focus:shadow-lg focus:shadow-cyan-500/20 transition-all duration-300 text-sm font-medium"
                  />
                </div>
                <button
                  onClick={fetchMediaLibrary}
                  disabled={loading}
                  className="bg-gradient-to-r from-cyan-600/60 to-blue-600/50 border border-cyan-500/60 text-white px-6 py-3 rounded-xl hover:from-cyan-500/70 hover:to-blue-500/60 transition-all duration-300 disabled:opacity-50 font-semibold text-sm shadow-lg shadow-cyan-500/20"
                >
                  {loading ? "Loading..." : "Refresh"}
                </button>
              </div>

              {/* Upload Progress */}
              {uploading && (
                <div className="mb-4 p-4 bg-blue-900/30 border border-blue-500/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-blue-300">Uploading...</span>
                    <span className="text-sm text-blue-400">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-black/50 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Images Grid */}
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-600 border-t-cyan-300 mb-4 mx-auto" />
                    <p className="text-gray-400 text-base font-medium">Loading media library...</p>
                  </div>
                </div>
              ) : filteredImages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <p className="text-gray-500 text-xl font-semibold">
                      {images.length === 0 ? "No images uploaded yet" : "No matching images found"}
                    </p>
                    <p className="text-gray-600 text-sm mt-2">Try a different search term</p>
                  </div>
                </div>
              ) : (
                <div className="overflow-y-auto flex-1">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-4">
                    {filteredImages.map((image) => (
                      <div
                        key={image.publicId}
                        className="group relative bg-gradient-to-br from-black/80 to-black/40 border border-cyan-500/25 rounded-2xl overflow-hidden hover:border-cyan-500/70 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-cyan-500/20"
                      >
                        {/* Image */}
                        <div className="aspect-square overflow-hidden bg-black/80">
                          <img
                            src={image.url}
                            alt={image.publicId}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/200?text=Error";
                            }}
                          />
                        </div>

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 gap-3">
                          <button
                            onClick={() => {
                              handleSelectImage(image);
                            }}
                            className={`w-full text-white text-sm px-4 py-2.5 rounded-lg font-bold transition-all duration-300 shadow-lg ${
                              mode === "select"
                                ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 shadow-green-500/30"
                                : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 shadow-cyan-500/30"
                            }`}
                          >
                            {mode === "select" ? "✓ Select" : "Copy URL"}
                          </button>
                          
                          <div className="text-xs text-gray-300 font-mono bg-black/70 px-3 py-1.5 rounded-lg">
                            {image.width} × {image.height}
                          </div>
                        </div>

                        {/* Selected indicator */}
                        {selectedImage?.publicId === image.publicId && (
                          <div className="absolute top-3 right-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg shadow-cyan-500/30">
                            ✓
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer Stats */}
              {!loading && images.length > 0 && (
                <div className="border-t border-cyan-500/20 pt-4 mt-4 text-sm text-gray-400 flex justify-between items-center">
                  <span className="font-medium">
                    Showing <span className="text-cyan-400 font-bold">{filteredImages.length}</span> of <span className="text-cyan-400 font-bold">{images.length}</span> images
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MediaLibraryModal;
