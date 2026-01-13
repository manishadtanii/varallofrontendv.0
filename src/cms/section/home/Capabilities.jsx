import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { HiOutlineUpload, HiOutlineSave, HiOutlinePencilAlt, HiOutlineX, HiOutlineViewGridAdd } from "react-icons/hi";
import { uploadAPI } from "../../../services/apiService";

const Capabilities = ({ sectionData, onSave, onBrowseLibrary }) => {
  const [isEditing, setIsEditing] = useState(false);

  console.log("📍 Capabilities sectionData:", sectionData);

  // Listen for image selection from MediaLibrary
  useEffect(() => {
    const handleImageSelected = (event) => {
      const { fieldName, imageUrl } = event.detail;
      if (fieldName.startsWith("capabilityImage_")) {
        const index = parseInt(fieldName.split("_")[1]);
        console.log("✅ Image selected for capability card:", index, imageUrl);
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

  // State initialized with actual backend data structure
  const [content, setContent] = useState({
    heading: sectionData?.heading || "Our Capabilities",
    description: sectionData?.description || "Delivering expert solutions across the nation with technology and human insight.",
    cards: sectionData?.cards || [
      {
        title: "Nationwide Reach. Local Expertise.",
        body: "Trusted with skilled professionals across all 50 states, we offer personalized court reporting and legal services backed by decades of regional expertise.",
        image: {
          url: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766654116/featured-1_esxxo4_yjib6p.jpg",
          alt: "Group of professionals smiling",
        },
        learnMore: { label: "Learn More", url: "/services" },
      },
      {
        title: "One Team. Multiple Solutions.",
        body: "From court reporting coverage to administrative and business support, our team offers a comprehensive range of services customized to meet your firm's unique needs.",
        image: {
          url: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766654117/featured-2_tqyqny_ebm0hd.jpg",
          alt: "Two professionals working on a tablet with scales",
        },
        learnMore: { label: "Learn More", url: "/services" },
      },
      {
        title: "Tech Driven. People Focused.",
        body: "We combine advanced technology with genuine human connection. Behind every service is a team that truly cares.",
        image: {
          url: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766654116/featured-3_p4w9bw_g0i8j3.jpg",
          alt: "Professional using technology",
        },
        learnMore: { label: "Learn More", url: "/services" },
      },
    ],
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContent((prev) => ({ ...prev, [name]: value }));
  };

  const handleCardImageUpdate = async (index, file) => {
    if (!file) return;

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size must be less than 2MB");
      return;
    }

    try {
      setUploading(true);
      const uploadResult = await uploadAPI.uploadImage(file, `capabilities-card-${index}`, 'home');
      
      if (uploadResult.success) {
        setContent((prev) => {
          const newCards = [...prev.cards];
          newCards[index] = {
            ...newCards[index],
            image: {
              url: uploadResult.url,
              publicId: uploadResult.publicId,
              alt: newCards[index].image?.alt || "Capability image",
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
      heading: sectionData?.heading || "Our Capabilities",
      description: sectionData?.description || "Delivering expert solutions across the nation with technology and human insight.",
      cards: sectionData?.cards || [
        {
          title: "Nationwide Reach. Local Expertise.",
          body: "Trusted with skilled professionals across all 50 states, we offer personalized court reporting and legal services backed by decades of regional expertise.",
          image: {
            url: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766654116/featured-1_esxxo4_yjib6p.jpg",
            alt: "Group of professionals smiling",
          },
          learnMore: { label: "Learn More", url: "/services" },
        },
        {
          title: "One Team. Multiple Solutions.",
          body: "From court reporting coverage to administrative and business support, our team offers a comprehensive range of services customized to meet your firm's unique needs.",
          image: {
            url: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766654117/featured-2_tqyqny_ebm0hd.jpg",
            alt: "Two professionals working on a tablet with scales",
          },
          learnMore: { label: "Learn More", url: "/services" },
        },
        {
          title: "Tech Driven. People Focused.",
          body: "We combine advanced technology with genuine human connection. Behind every service is a team that truly cares.",
          image: {
            url: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766654116/featured-3_p4w9bw_g0i8j3.jpg",
            alt: "Professional using technology",
          },
          learnMore: { label: "Learn More", url: "/services" },
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
        <h2 className="text-xl font-bold text-cyan-400 uppercase tracking-wider">Capabilities Section</h2>

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

      {/* --- HEADER CONTENT --- */}
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
            rows="2"
            className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${
              isEditing ? "border-cyan-400" : "border-gray-800 text-gray-400"
            }`}
          />
        </div>
      </div>

      {/* --- CARDS SECTION --- */}
      <div className="border-t border-gray-800 pt-8">
        <h3 className="text-sm font-bold text-cyan-400 mb-4">Capability Cards (3)</h3>
        <div className="grid grid-cols-1 gap-6">
          {content.cards?.map((card, index) => (
            <div
              key={index}
              className={`bg-[#0b1318] border rounded-2xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4 ${
                isEditing ? "border-cyan-400/30" : "border-gray-800"
              }`}
            >
              {/* Image */}
              <div className="relative w-full h-48 bg-black rounded-lg overflow-hidden group">
                <input
                  type="file"
                  id={`card-image-${index}`}
                  className="hidden"
                  onChange={(e) => handleCardImageUpdate(index, e.target.files[0])}
                  accept="image/*"
                />
                <img
                  src={card.image?.url}
                  alt={card.image?.alt}
                  className="w-full h-full object-cover"
                />
                {isEditing && (
                  <>
                    <label
                      htmlFor={`card-image-${index}`}
                      className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <HiOutlineUpload className="text-cyan-400 text-xl" />
                    </label>
                    <button
                      type="button"
                      onClick={() => onBrowseLibrary(`capabilityImage_${index}`)}
                      className="absolute top-2 right-2 bg-green-600 hover:bg-green-700 text-white p-2 rounded transition-colors opacity-0 group-hover:opacity-100"
                      title="Browse Library"
                    >
                      <HiOutlineViewGridAdd className="text-lg" />
                    </button>
                  </>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col gap-3">
                <input
                  disabled={!isEditing}
                  value={card.title}
                  onChange={(e) => updateCard(index, "title", e.target.value)}
                  placeholder="Card Title"
                  className={`bg-transparent border-b border-gray-800 text-lg font-bold outline-none text-white focus:border-cyan-400 ${
                    !isEditing ? "border-transparent" : ""
                  }`}
                />

                <textarea
                  disabled={!isEditing}
                  value={card.body}
                  onChange={(e) => updateCard(index, "body", e.target.value)}
                  placeholder="Card Body"
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

                <input
                  disabled={!isEditing}
                  value={card.image?.alt || ""}
                  onChange={(e) => updateCard(index, "image.alt", e.target.value)}
                  placeholder="Image Alt Text"
                  className={`bg-transparent border rounded-lg px-3 py-2 text-xs outline-none text-white focus:border-cyan-400 ${
                    isEditing ? "border-cyan-400/30" : "border-gray-800"
                  }`}
                />
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
            <div>
              <h2 className="text-2xl font-bold text-white">{content.heading}</h2>
              <p className="text-sm text-gray-400 mt-2">{content.description}</p>
            </div>

            <div className="space-y-4">
              {content.cards?.map((card, i) => (
                <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-black/30 rounded-lg p-4 border border-gray-800">
                  <img src={card.image?.url} alt={card.image?.alt} className="h-32 object-cover rounded-lg" />
                  <div>
                    <h4 className="font-bold text-white mb-2">{card.title}</h4>
                    <p className="text-xs text-gray-400 line-clamp-2">{card.body}</p>
                    <button className="mt-2 text-xs text-cyan-400 font-semibold">{card.learnMore?.label}</button>
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

export default Capabilities;
