import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  HiOutlineUpload,
  HiOutlineSave,
  HiOutlinePencilAlt,
  HiOutlineX,
  HiOutlineTrash,
  HiOutlineViewGridAdd,
} from "react-icons/hi";
import { uploadAPI } from "../../../services/apiService";

const AllServices = ({ sectionData, onSave, onBrowseLibrary }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  console.log("📍 All Services (services-grid) sectionData received:", sectionData);
  console.log("📊 sectionData structure:", {
    isEmpty: Object.keys(sectionData || {}).length === 0,
    keys: Object.keys(sectionData || {}),
    sectionHeading: sectionData?.sectionHeading,
    cardsCount: sectionData?.cards?.length || 0,
    fullData: sectionData
  });

  // Listen for image selection from MediaLibrary
  useEffect(() => {
    const handleImageSelected = (event) => {
      const { fieldName, imageUrl } = event.detail;
      if (fieldName.startsWith("serviceCardImage_")) {
        const index = parseInt(fieldName.split("_")[1]);
        console.log("✅ Image selected for service card:", index, imageUrl);
        setContent((prev) => {
          const newCards = [...prev.cards];
          newCards[index] = {
            ...newCards[index],
            image: {
              ...newCards[index].image,
              url: imageUrl,
            },
          };
          return { ...prev, cards: newCards };
        });
        toast.success("Image loaded from library!");
      }
    };

    window.addEventListener("imageSelected", handleImageSelected);
    return () => window.removeEventListener("imageSelected", handleImageSelected);
  }, []);

  const [content, setContent] = useState({
    sectionHeading: sectionData?.sectionHeading || "Services",
    cards: sectionData?.cards || [
      {
        id: "tvg-management",
        heading: "TVG Management",
        description: "Comprehensive agency management support focused on optimizing your day-to-day operations.",
        image: {
          url: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766740318/management_qo7kgt.jpg",
          alt: "TVG Management team meeting",
        },
        link: "/services/tvg-management",
      },
    ],
  });

  // Update content when sectionData changes
  useEffect(() => {
    if (sectionData && Object.keys(sectionData).length > 0) {
      setContent({
        sectionHeading: sectionData?.sectionHeading || "Services",
        cards: sectionData?.cards || [
          {
            id: "tvg-management",
            heading: "TVG Management",
            description: "Comprehensive agency management support focused on optimizing your day-to-day operations.",
            image: {
              url: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766740318/management_qo7kgt.jpg",
              alt: "TVG Management team meeting",
            },
            link: "/services/tvg-management",
          },
        ],
      });
      console.log("✅ Content updated from sectionData");
    }
  }, [sectionData]);

  const handleHeadingChange = (e) => {
    setContent((prev) => ({ ...prev, sectionHeading: e.target.value }));
  };

  const updateCard = (index, field, value) => {
    setContent((prev) => {
      const newCards = [...prev.cards];
      if (field.includes(".")) {
        const [parent, child] = field.split(".");
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

  const handleCardImageUpload = async (index, file) => {
    if (!file) return;

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size must be less than 2MB");
      return;
    }

    try {
      setUploading(true);
      const uploadResult = await uploadAPI.uploadImage(file, `service-card-${index}`, 'service');

      if (uploadResult.success) {
        setContent((prev) => {
          const newCards = [...prev.cards];
          newCards[index] = {
            ...newCards[index],
            image: {
              url: uploadResult.url,
              publicId: uploadResult.publicId,
              alt: newCards[index].image?.alt || "Service card image",
            },
          };
          return { ...prev, cards: newCards };
        });
        toast.success("Image uploaded!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const addCard = () => {
    setContent((prev) => ({
      ...prev,
      cards: [
        ...prev.cards,
        {
          id: `service-${Date.now()}`,
          heading: "New Service",
          description: "Service description",
          image: {
            url: "https://via.placeholder.com/400x300",
            alt: "Service image",
          },
          link: "/services/new-service",
        },
      ],
    }));
  };

  const removeCard = (index) => {
    setContent((prev) => ({
      ...prev,
      cards: prev.cards.filter((_, i) => i !== index),
    }));
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
      sectionHeading: sectionData?.sectionHeading || "Services",
      cards: sectionData?.cards || [
        {
          id: "tvg-management",
          heading: "TVG Management",
          description: "Comprehensive agency management support focused on optimizing your day-to-day operations.",
          image: {
            url: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766740318/management_qo7kgt.jpg",
            alt: "TVG Management team meeting",
          },
          link: "/services/tvg-management",
        },
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
        <h2 className="text-xl font-bold text-cyan-400 uppercase tracking-wider">
          Services Grid Section
        </h2>

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

      {/* --- SECTION HEADING --- */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Section Heading</label>
        <input
          disabled={!isEditing}
          value={content.sectionHeading}
          onChange={handleHeadingChange}
          className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${
            isEditing ? "border-cyan-400" : "border-gray-800 text-gray-400"
          }`}
        />
      </div>

      {/* --- SERVICE CARDS --- */}
      <div className="border-t border-gray-800 pt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-cyan-400">Service Cards ({content.cards?.length})</h3>
          {isEditing && (
            <button
              onClick={addCard}
              className="text-xs bg-cyan-500/20 border border-cyan-400 text-cyan-400 px-3 py-1.5 rounded-lg hover:bg-cyan-500/30 transition-all"
            >
              + Add Card
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6">
          {content.cards?.map((card, index) => (
            <div
              key={index}
              className={`bg-[#0b1318] border rounded-2xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4 ${
                isEditing ? "border-cyan-400/30" : "border-gray-800"
              }`}
            >
              {/* Service Card Image */}
              <div className="relative w-full h-56 bg-black rounded-lg overflow-hidden group">
                <input
                  type="file"
                  id={`card-image-${index}`}
                  className="hidden"
                  onChange={(e) => handleCardImageUpload(index, e.target.files[0])}
                  accept="image/*"
                />
                <img src={card.image?.url} alt={card.image?.alt} className="w-full h-full object-cover" />
                {isEditing && (
                  <>
                    <label
                      htmlFor={`card-image-${index}`}
                      className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <HiOutlineUpload className="text-cyan-400 text-xl" />
                    </label>
                    {onBrowseLibrary && (
                      <button
                        type="button"
                        onClick={() => onBrowseLibrary(`serviceCardImage_${index}`)}
                        className="absolute top-2 right-2 bg-green-600 hover:bg-green-700 text-white p-2 rounded transition-colors opacity-0 group-hover:opacity-100"
                        title="Browse Library"
                      >
                        <HiOutlineViewGridAdd className="text-lg" />
                      </button>
                    )}
                  </>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <div className="w-6 h-6 border-3 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              {/* Card Content */}
              <div className="col-span-2 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-gray-500 font-bold uppercase">Service Title</label>
                      <input
                        disabled={!isEditing}
                        value={card.heading}
                        onChange={(e) => updateCard(index, "heading", e.target.value)}
                        className={`bg-transparent border rounded-lg px-3 py-2 text-sm outline-none text-white ${
                          isEditing ? "border-cyan-400/30" : "border-gray-800"
                        }`}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-gray-500 font-bold uppercase">Description</label>
                      <textarea
                        disabled={!isEditing}
                        value={card.description}
                        onChange={(e) => updateCard(index, "description", e.target.value)}
                        rows="2"
                        className={`bg-transparent border rounded-lg px-3 py-2 text-xs outline-none text-white ${
                          isEditing ? "border-cyan-400/30" : "border-gray-800"
                        }`}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-gray-500 font-bold uppercase">Service Link</label>
                      <input
                        disabled={!isEditing}
                        value={card.link}
                        onChange={(e) => updateCard(index, "link", e.target.value)}
                        placeholder="/services/service-name"
                        className={`bg-transparent border rounded-lg px-3 py-2 text-xs outline-none text-white ${
                          isEditing ? "border-cyan-400/30" : "border-gray-800"
                        }`}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-gray-500 font-bold uppercase">Image Alt Text</label>
                      <input
                        disabled={!isEditing}
                        value={card.image?.alt || ""}
                        onChange={(e) => updateCard(index, "image.alt", e.target.value)}
                        className={`bg-transparent border rounded-lg px-3 py-2 text-xs outline-none text-white ${
                          isEditing ? "border-cyan-400/30" : "border-gray-800"
                        }`}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-gray-500 font-bold uppercase">Service ID</label>
                      <input
                        disabled={!isEditing}
                        value={card.id}
                        onChange={(e) => updateCard(index, "id", e.target.value)}
                        className={`bg-transparent border rounded-lg px-3 py-2 text-xs outline-none text-white ${
                          isEditing ? "border-cyan-400/30" : "border-gray-800"
                        }`}
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <button
                      onClick={() => removeCard(index)}
                      className="text-red-400 hover:text-red-300 transition-all mt-2"
                    >
                      <HiOutlineTrash size={20} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- PREVIEW --- */}
      {!isEditing && (
        <div className="border-t border-gray-800 pt-6">
          <h3 className="text-sm font-bold text-cyan-400 mb-4">Preview</h3>
          <div className="bg-gray-900/50 rounded-xl p-6 space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white">{content.sectionHeading}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.cards?.map((card, i) => (
                <div key={i} className="bg-black/50 rounded-lg overflow-hidden border border-gray-800 hover:border-cyan-400/50 transition-all cursor-pointer group">
                  <div className="relative h-40 overflow-hidden">
                    <img src={card.image?.url} alt={card.image?.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="p-4 space-y-2">
                    <h4 className="font-bold text-white">{card.heading}</h4>
                    <p className="text-xs text-gray-400">{card.description}</p>
                    <a href={card.link} className="inline-block text-xs text-cyan-400 font-semibold hover:text-cyan-300">
                      Learn More →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllServices;
