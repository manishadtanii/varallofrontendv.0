import React, { useState, useRef, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { HiOutlineUpload, HiOutlineSave, HiOutlinePencilAlt, HiOutlineX, HiOutlineViewGridAdd } from "react-icons/hi";
import { uploadAPI } from "../../../services/apiService";

const Trust = ({ sectionData, onSave, onBrowseLibrary }) => {
  const [isEditing, setIsEditing] = useState(false);
  const imageRef = useRef(null);

  console.log("📍 Trust sectionData:", sectionData);

  // Listen for image selection from MediaLibrary
  useEffect(() => {
    const handleImageSelected = (event) => {
      const { fieldName, imageUrl } = event.detail;
      if (fieldName === "mainImage") {
        console.log("✅ Image selected for Trust main image:", imageUrl);
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

  // State initialized with actual backend data structure
  const [content, setContent] = useState({
    heading: sectionData?.heading || "Experience That Performs. Support You Deserve.",
    description: sectionData?.description || "For court reporting firms that value reliability, accuracy, and confidentiality, our team delivers more than just services; we deliver peace of mind.",
    image: sectionData?.image || {
      url: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766654130/why-choose_cq2tvu_x3vfdz.png",
      alt: "Hands typing on stenography machine",
    },
    cards: sectionData?.cards || [
      {
        text: "Decades of expertise, led by Nancy Varallo. Teacher. Mentor. Industry Leader.",
        learnMore: { label: "Learn More", url: "/services" },
      },
      {
        text: "Precision in every word. Because in law, details matter.",
        learnMore: { label: "Learn More", url: "/services" },
      },
    ],
    stats: sectionData?.stats || [
      { value: "500+", label: "Court reporting firms served" },
      { value: "40K+", label: "Attorneys assisted by our team" },
      { value: "24+", label: "Years in business" },
      { value: "2.5M+", label: "Depositions Handled" },
    ],
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
      const uploadResult = await uploadAPI.uploadImage(file, 'trust', 'home');
      
      if (uploadResult.success) {
        setContent((prev) => ({
          ...prev,
          image: {
            url: uploadResult.url,
            publicId: uploadResult.publicId,
            alt: prev.image?.alt || "Trust section image",
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

  const updateCard = (index, field, value) => {
    setContent((prev) => {
      const newCards = [...prev.cards];
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        newCards[index] = {
          ...newCards[index],
          [parent]: { ...newCards[index][parent], [child]: value },
        };
      } else {
        newCards[index] = { ...newCards[index], [field]: value };
      }
      return { ...prev, cards: newCards };
    });
  };

  const updateStat = (index, field, value) => {
    setContent((prev) => {
      const newStats = [...prev.stats];
      newStats[index] = { ...newStats[index], [field]: value };
      return { ...prev, stats: newStats };
    });
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
      heading: sectionData?.heading || "Experience That Performs. Support You Deserve.",
      description: sectionData?.description || "For court reporting firms that value reliability, accuracy, and confidentiality, our team delivers more than just services; we deliver peace of mind.",
      image: sectionData?.image || {
        url: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766654130/why-choose_cq2tvu_x3vfdz.png",
        alt: "Hands typing on stenography machine",
      },
      cards: sectionData?.cards || [
        {
          text: "Decades of expertise, led by Nancy Varallo. Teacher. Mentor. Industry Leader.",
          learnMore: { label: "Learn More", url: "/services" },
        },
        {
          text: "Precision in every word. Because in law, details matter.",
          learnMore: { label: "Learn More", url: "/services" },
        },
      ],
      stats: sectionData?.stats || [
        { value: "500+", label: "Court reporting firms served" },
        { value: "40K+", label: "Attorneys assisted by our team" },
        { value: "24+", label: "Years in business" },
        { value: "2.5M+", label: "Depositions Handled" },
      ],
    });
    setIsEditing(false);
    toast.success("Changes discarded");
  };

  return (
    <div className="flex flex-col gap-8 font-manrope">
      <Toaster />

      {/* --- HEADER --- */}
      <div className="flex justify-between items-center border-b border-gray-800 pb-4">
        <h2 className="text-xl font-bold text-cyan-400 uppercase tracking-wider">Trust Section</h2>

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
              onChange={(e) => handleImageUpdate(e)}
              accept="image/*"
              className="hidden"
            />

            {content.image?.url ? (
              <>
                <img
                  src={content.image.url}
                  alt={content.image?.alt || "Trust"}
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

      {/* --- CARDS SECTION --- */}
      <div className="border-t border-gray-800 pt-8">
        <h3 className="text-sm font-bold text-cyan-400 mb-4">Expert Cards (2)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {content.cards?.map((card, index) => (
            <div
              key={index}
              className={`bg-[#0b1318] border rounded-2xl p-4 flex flex-col gap-3 ${
                isEditing ? "border-cyan-400/30" : "border-gray-800"
              }`}
            >
              <textarea
                disabled={!isEditing}
                value={card.text}
                onChange={(e) => updateCard(index, "text", e.target.value)}
                placeholder="Card text"
                rows="3"
                className={`bg-transparent border rounded-lg p-2 text-sm outline-none text-gray-400 ${
                  isEditing ? "border-cyan-400/30" : "border-gray-800"
                }`}
              />

              <input
                disabled={!isEditing}
                value={card.learnMore?.label || ""}
                onChange={(e) => updateCard(index, "learnMore.label", e.target.value)}
                placeholder="Button Label"
                className={`bg-transparent border rounded-lg px-3 py-2 text-xs outline-none text-white focus:border-cyan-400 ${
                  isEditing ? "border-cyan-400/30" : "border-gray-800"
                }`}
              />

              <input
                disabled={!isEditing}
                value={card.learnMore?.url || ""}
                onChange={(e) => updateCard(index, "learnMore.url", e.target.value)}
                placeholder="Button URL"
                className={`bg-transparent border rounded-lg px-3 py-2 text-xs outline-none text-white focus:border-cyan-400 ${
                  isEditing ? "border-cyan-400/30" : "border-gray-800"
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* --- STATS SECTION --- */}
      <div className="border-t border-gray-800 pt-8">
        <h3 className="text-sm font-bold text-cyan-400 mb-4">Stats (4)</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {content.stats?.map((stat, index) => (
            <div
              key={index}
              className={`bg-[#0b1318] border rounded-2xl p-4 flex flex-col gap-2 ${
                isEditing ? "border-cyan-400/30" : "border-gray-800"
              }`}
            >
              <input
                disabled={!isEditing}
                value={stat.value}
                onChange={(e) => updateStat(index, "value", e.target.value)}
                placeholder="Value"
                className={`bg-transparent border-b border-gray-800 text-lg font-bold outline-none text-cyan-400 focus:border-cyan-400 ${
                  !isEditing ? "border-transparent" : ""
                }`}
              />
              <textarea
                disabled={!isEditing}
                value={stat.label}
                onChange={(e) => updateStat(index, "label", e.target.value)}
                placeholder="Label"
                rows="2"
                className={`bg-transparent border rounded-lg p-2 text-xs outline-none text-gray-400 ${
                  isEditing ? "border-cyan-400/30" : "border-gray-800"
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* --- PREVIEW --- */}
      {!isEditing && (
        <div className="border-t border-gray-800 pt-6">
          <h3 className="text-sm font-bold text-cyan-400 mb-4">Preview</h3>
          <div className="bg-gray-900/50 rounded-xl p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-2xl font-bold text-white">{content.heading}</h2>
                <p className="text-sm text-gray-400 mt-3">{content.description}</p>
              </div>
              <img src={content.image?.url} alt={content.image?.alt} className="max-h-48 object-contain rounded-lg" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {content.cards?.map((card, i) => (
                <div key={i} className="bg-black/30 rounded-lg p-3 border border-gray-800">
                  <p className="text-xs text-gray-300 line-clamp-2">{card.text}</p>
                  <button className="mt-2 text-xs text-cyan-400 font-semibold">{card.learnMore?.label}</button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-2">
              {content.stats?.map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-xl font-bold text-cyan-400">{s.value}</p>
                  <p className="text-[10px] text-gray-400 line-clamp-2">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trust;
