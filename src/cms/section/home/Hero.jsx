import React, { useState, useRef, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { HiOutlineUpload, HiOutlineSave, HiOutlinePencilAlt, HiOutlineX, HiOutlineViewGridAdd } from "react-icons/hi";
import { uploadAPI } from "../../../services/apiService";

const Hero = ({ sectionData, onSave, onBrowseLibrary }) => {
  const [isEditing, setIsEditing] = useState(false);
  const mainFileRef = useRef(null);

  console.log("📍 Hero sectionData:", sectionData);

  // State initialized with actual backend data structure
  const [content, setContent] = useState({
    heading: sectionData?.heading || "Court Reporting",
    subHeading: sectionData?.subHeading || "Focused Expertise to Support You Every Step of the Way",
    description: sectionData?.description || "Your trusted partner for court reporting, legal video, association management, and administrative support services.",
    image: sectionData?.image || {
      url: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766654121/hero_kxs1h1_mjadza.png",
      alt: "Court reporting professional",
    },
    button: sectionData?.button || {
      label: "Learn More",
    },
  });

  const [uploading, setUploading] = useState(false);

  // Listen for image selection from MediaLibrary
  useEffect(() => {
    const handleImageSelected = (event) => {
      const { fieldName, imageUrl } = event.detail;
      if (fieldName === "mainImage") {
        console.log("✅ Image selected for Hero main image:", imageUrl);
        setContent((prev) => ({
          ...prev,
          image: {
            ...prev.image,
            url: imageUrl,
          },
        }));
        toast.success("Image loaded from library!");
      }
    };

    window.addEventListener("imageSelected", handleImageSelected);
    return () => window.removeEventListener("imageSelected", handleImageSelected);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContent((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpdate = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      toast.error("File size must be less than 2MB");
      return;
    }

    try {
      setUploading(true);
      
      // Upload to Cloudinary
      const uploadResult = await uploadAPI.uploadImage(file, 'hero', 'home');
      
      if (uploadResult.success) {
        // Update state with new image URL and publicId
        setContent((prev) => ({
          ...prev,
          image: {
            url: uploadResult.url,
            publicId: uploadResult.publicId,
            alt: prev.image?.alt || "Hero image",
          },
        }));
        toast.success("Image uploaded successfully!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      await onSave(content);
      setIsEditing(false);
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const handleCancel = () => {
    setContent({
      heading: sectionData?.heading || "Court Reporting",
      subHeading: sectionData?.subHeading || "Focused Expertise to Support You Every Step of the Way",
      description: sectionData?.description || "Your trusted partner for court reporting, legal video, association management, and administrative support services.",
      image: sectionData?.image || {
        url: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766654121/hero_kxs1h1_mjadza.png",
        alt: "Court reporting professional",
      },
      button: sectionData?.button || {
        label: "Learn More",
      },
    });
    setIsEditing(false);
    toast.success("Changes discarded");
  };

  return (
    <div className="flex flex-col gap-8 font-manrope">
      <Toaster />
      
      {/* --- HEADER --- */}
      <div className="flex justify-between items-center border-b border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-cyan-400 uppercase tracking-wider">Hero Section Editor</h2>
        </div>

        <div className="flex gap-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all border bg-cyan-500 text-black border-cyan-400`}
            >
              <HiOutlinePencilAlt />
              EDIT
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all border bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
              >
                <HiOutlineX /> CANCEL
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black px-6 py-2 rounded-full font-bold transition-all shadow-lg"
              >
                <HiOutlineSave /> SAVE
              </button>
            </>
          )}
        </div>
      </div>

      {/* --- MAIN SECTION --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* --- LEFT COLUMN: TEXT INPUTS --- */}
        <div className="flex flex-col gap-4">
          {/* Heading */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Main Heading</label>
            <input
              disabled={!isEditing}
              name="heading"
              value={content.heading}
              onChange={handleChange}
              className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${
                isEditing ? "border-cyan-400" : "border-gray-800 text-gray-400"
              }`}
            />
          </div>

          {/* Sub Heading */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Sub Heading</label>
            <input
              disabled={!isEditing}
              name="subHeading"
              value={content.subHeading}
              onChange={handleChange}
              className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${
                isEditing ? "border-cyan-400" : "border-gray-800 text-gray-400"
              }`}
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Description</label>
            <textarea
              disabled={!isEditing}
              name="description"
              value={content.description}
              onChange={handleChange}
              rows="3"
              className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${
                isEditing ? "border-cyan-400" : "border-gray-800 text-gray-400"
              }`}
            />
          </div>

          {/* Button Label */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Button Label</label>
            <input
              disabled={!isEditing}
              name="buttonLabel"
              value={content.button?.label || ""}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  button: { ...prev.button, label: e.target.value },
                }))
              }
              className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${
                isEditing ? "border-cyan-400" : "border-gray-800 text-gray-400"
              }`}
            />
          </div>

          {/* Image Alt Text */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Image Alt Text</label>
            <input
              disabled={!isEditing}
              name="imageAlt"
              value={content.image?.alt || ""}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  image: { ...prev.image, alt: e.target.value },
                }))
              }
              className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${
                isEditing ? "border-cyan-400" : "border-gray-800 text-gray-400"
              }`}
            />
          </div>
        </div>

        {/* --- RIGHT COLUMN: IMAGE --- */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Hero Image</label>
            {isEditing && onBrowseLibrary && (
              <button
                onClick={() => onBrowseLibrary("mainImage")}
                className="flex items-center gap-2 px-3 py-1.5 text-xs bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg hover:bg-green-500/30 transition-all"
              >
                <HiOutlineViewGridAdd className="text-sm" />
              
              </button>
            )}
          </div>
          <div
            onClick={() => isEditing && mainFileRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl h-full min-h-[300px] max-h-[400px] flex items-center justify-center bg-black/20 overflow-hidden transition-all ${
              isEditing ? "border-cyan-500 cursor-pointer group hover:border-cyan-400" : "border-gray-800"
            }`}
          >
            <input
              type="file"
              ref={mainFileRef}
              onChange={handleImageUpdate}
              accept="image/*"
              className="hidden"
            />

            {/* Image Display */}
            {content.image?.url ? (
              <>
                <img
                  src={content.image.url}
                  alt={content.image?.alt || "Hero"}
                  className="max-h-full object-contain p-4"
                />
                {isEditing && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex flex-col items-center gap-2">
                      <HiOutlineUpload className="text-cyan-400 text-3xl" />
                      <p className="text-white text-sm font-semibold">Click to upload</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-400">
                <HiOutlineUpload className="text-3xl" />
                <p>No image selected</p>
              </div>
            )}

            {uploading && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          {content.image?.publicId && (
            <p className="text-[10px] text-gray-500">ID: {content.image.publicId}</p>
          )}
        </div>
      </div>

      {/* --- PREVIEW --- */}
      {!isEditing && (
        <div className="border-t border-gray-800 pt-6">
          <h3 className="text-sm font-bold text-cyan-400 mb-4">Preview</h3>
          <div className="bg-gray-900/50 rounded-xl p-6 grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-bold text-white">{content.heading}</h4>
              <p className="text-sm text-cyan-400 mt-2">{content.subHeading}</p>
              <p className="text-xs text-gray-400 mt-3">{content.description}</p>
              <button className="mt-4 px-4 py-2 bg-cyan-500 text-black font-bold rounded-lg text-sm">
                {content.button?.label}
              </button>
            </div>
            <div className="flex items-center justify-center">
              <img src={content.image?.url} alt={content.image?.alt} className="max-h-40 object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;