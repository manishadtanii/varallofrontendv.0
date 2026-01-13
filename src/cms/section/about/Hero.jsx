import React, { useState, useRef, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { HiOutlineUpload, HiOutlineSave, HiOutlinePencilAlt, HiOutlineX, HiOutlineViewGridAdd } from "react-icons/hi";
import { uploadAPI } from "../../../services/apiService";

const AboutHero = ({ sectionData, onSave, onBrowseLibrary }) => {
  const [isEditing, setIsEditing] = useState(false);
  const imageRef = useRef(null);

  console.log("📍 About Hero sectionData:", sectionData);

  // Listen for image selection from MediaLibrary
  useEffect(() => {
    const handleImageSelected = (event) => {
      const { fieldName, imageUrl } = event.detail;
      if (fieldName === "mainImage") {
        console.log("✅ Image selected for About Hero image:", imageUrl);
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

  const [content, setContent] = useState({
    heading: sectionData?.heading || "Your Business is Safe in Our Hands",
    description: sectionData?.description || "Rooted in a legacy of court reporting since 1937, The Varallo Group blends time-honored values with modern innovation to protect, preserve, and elevate the legal record.",
    image: sectionData?.image || {
      url: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766736715/about-hero_vqc0hk.png",
      alt: "The Varallo Group leadership team",
    },
    cta: sectionData?.cta || { label: "Learn More" },
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContent((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpdate = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size must be less than 2MB");
      return;
    }

    try {
      setUploading(true);
      const uploadResult = await uploadAPI.uploadImage(file, 'about-hero', 'about');

      if (uploadResult.success) {
        setContent((prev) => ({
          ...prev,
          image: {
            url: uploadResult.url,
            publicId: uploadResult.publicId,
            alt: prev.image?.alt || "About hero image",
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
      heading: sectionData?.heading || "Your Business is Safe in Our Hands",
      description: sectionData?.description || "Rooted in a legacy of court reporting since 1937, The Varallo Group blends time-honored values with modern innovation to protect, preserve, and elevate the legal record.",
      image: sectionData?.image || {
        url: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766736715/about-hero_vqc0hk.png",
        alt: "The Varallo Group leadership team",
      },
      cta: sectionData?.cta || { label: "Learn More" },
    });
    setIsEditing(false);
    toast.success("Changes discarded");
  };

  return (
    <div className="flex flex-col gap-8 font-manrope">
      <Toaster />

      {/* --- HEADER --- */}
      <div className="flex justify-between items-center border-b border-gray-800 pb-4">
        <h2 className="text-xl font-bold text-cyan-400 uppercase tracking-wider">About Hero Section</h2>

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

      {/* --- MAIN CONTENT --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT: TEXT */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Heading</label>
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

          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Description</label>
            <textarea
              disabled={!isEditing}
              name="description"
              value={content.description}
              onChange={handleChange}
              rows="4"
              className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${
                isEditing ? "border-cyan-400" : "border-gray-800 text-gray-400"
              }`}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">CTA Label</label>
            <input
              disabled={!isEditing}
              value={content.cta?.label || ""}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  cta: { ...prev.cta, label: e.target.value },
                }))
              }
              className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${
                isEditing ? "border-cyan-400" : "border-gray-800 text-gray-400"
              }`}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Image Alt Text</label>
            <input
              disabled={!isEditing}
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

        {/* RIGHT: IMAGE */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Main Image</label>
          <div
            onClick={() => isEditing && imageRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl h-full min-h-[300px] max-h-[400px] flex items-center justify-center bg-black/20 overflow-hidden transition-all ${
              isEditing ? "border-cyan-500 cursor-pointer group hover:border-cyan-400" : "border-gray-800"
            }`}
          >
            <input
              type="file"
              ref={imageRef}
              onChange={handleImageUpdate}
              accept="image/*"
              className="hidden"
            />

            {content.image?.url ? (
              <>
                <img
                  src={content.image.url}
                  alt={content.image?.alt || "About Hero"}
                  className="max-h-full object-contain p-4"
                />
                {isEditing && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <HiOutlineUpload className="text-cyan-400 text-3xl" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onBrowseLibrary("mainImage");
                      }}
                      className="absolute top-2 right-2 bg-green-600 hover:bg-green-700 text-white p-2 rounded transition-colors"
                      title="Browse Library"
                    >
                      <HiOutlineViewGridAdd className="text-lg" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-400">
                <HiOutlineUpload className="text-3xl" />
                <p>No image</p>
                {isEditing && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onBrowseLibrary("mainImage");
                    }}
                    className="mt-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors flex items-center gap-1"
                    title="Browse Library"
                  >
                    <HiOutlineViewGridAdd />
                    Browse Library
                  </button>
                )}
              </div>
            )}

            {uploading && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- PREVIEW --- */}
      {!isEditing && (
        <div className="border-t border-gray-800 pt-6">
          <h3 className="text-sm font-bold text-cyan-400 mb-4">Preview</h3>
          <div className="bg-gray-900/50 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-2xl font-bold text-white">{content.heading}</h2>
                <p className="text-sm text-gray-400 mt-3">{content.description}</p>
                <button className="mt-4 bg-cyan-500 text-black px-6 py-2 rounded-lg font-bold">
                  {content.cta?.label}
                </button>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src={content.image?.url}
                  alt={content.image?.alt}
                  className="max-h-64 object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutHero;
