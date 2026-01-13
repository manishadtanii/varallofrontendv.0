import React, { useState, useRef, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { HiOutlineUpload, HiOutlineSave, HiOutlinePencilAlt, HiOutlineX, HiOutlineViewGridAdd } from "react-icons/hi";
import { uploadAPI } from "../../../services/apiService";

const Services = ({ sectionData, onSave, onBrowseLibrary }) => {
  const [isEditing, setIsEditing] = useState(false);
  const fileRefs = useRef({});

  console.log("📍 Services sectionData:", sectionData);

  // Listen for image selection from MediaLibrary
  useEffect(() => {
    const handleImageSelected = (event) => {
      const { fieldName, imageUrl } = event.detail;
      if (fieldName.startsWith("serviceImage_")) {
        const index = parseInt(fieldName.split("_")[1]);
        console.log("✅ Image selected for service card:", index, imageUrl);
        setContent((prev) => {
          const newCards = [...prev.cards];
          newCards[index] = {
            ...newCards[index],
            image: imageUrl,
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
    title: sectionData?.title || "Smart Support. Smart Solutions.",
    paragraph1: sectionData?.paragraph1 || [
      "Our team is the heart of The Varallo Group. They bring dedication, professionalism, and integrity to everything they do. I'm constantly inspired by their commitment to our clients and to each other. It's a privilege to work alongside such talented people who take real pride in delivering excellence every single day.",
    ],
    paragraph2: sectionData?.paragraph2 || [
      "At The Varallo Group, our services are built to simplify, strengthen, and scale your operations. Whether you're a court reporting firm, a professional organization, or an individual, our expertise meets your needs right where you are and right when you need it.",
    ],
    button: sectionData?.button || {
      label: "Let's Get Started",
      link: "/contact",
    },
    cards: sectionData?.cards || [
      {
        title: "TVG Verify",
        description: "Let us ensure your hiring is secure with reliable background screening and compliance checks.",
        image: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766654126/smart-8_qse95f_zdwowb.jpg",
      },
      {
        title: "TVG Management",
        description: "Comprehensive agency management support focused on optimizing day-to-day operations.",
        image: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766654121/smart-1_bnoofh_wyvooj.jpg",
      },
      {
        title: "TVG Reporting",
        description: "High-quality legal video services to support your cases.",
        image: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766654122/smart-2_fwdmzx_dwjzro.jpg",
      },
      {
        title: "TVG Stream",
        description: "Smart scheduling solutions built for efficiency.",
        image: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766654122/smart-3_dalt5r_qkf0u3.jpg",
      },
      {
        title: "TVG Books",
        description: "Dedicated support teams that scale with your firm.",
        image: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766654125/smart-4_dzjgbd_t20g6t.jpg",
      },
      {
        title: "TVG Connect",
        description: "Compliance services you can trust.",
        image: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766654126/smart-6_owwgbd_u42ppp.jpg",
      },
    ],
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContent((prev) => ({ ...prev, [name]: value }));
  };

  const handleParagraphChange = (index, value) => {
    setContent((prev) => {
      const newParagraphs = [...prev[`paragraph${index}`]];
      newParagraphs[0] = value;
      return { ...prev, [`paragraph${index}`]: newParagraphs };
    });
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
      const uploadResult = await uploadAPI.uploadImage(file, `services-card-${index}`, 'home');
      
      if (uploadResult.success) {
        setContent((prev) => {
          const newCards = [...prev.cards];
          newCards[index] = {
            ...newCards[index],
            image: uploadResult.url,
            publicId: uploadResult.publicId,
          };
          return { ...prev, cards: newCards };
        });
        toast.success("Card image uploaded!");
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
      newCards[index] = { ...newCards[index], [field]: value };
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
      title: sectionData?.title || "Smart Support. Smart Solutions.",
      paragraph1: sectionData?.paragraph1 || [
        "Our team is the heart of The Varallo Group. They bring dedication, professionalism, and integrity to everything they do. I'm constantly inspired by their commitment to our clients and to each other. It's a privilege to work alongside such talented people who take real pride in delivering excellence every single day.",
      ],
      paragraph2: sectionData?.paragraph2 || [
        "At The Varallo Group, our services are built to simplify, strengthen, and scale your operations. Whether you're a court reporting firm, a professional organization, or an individual, our expertise meets your needs right where you are and right when you need it.",
      ],
      button: sectionData?.button || {
        label: "Let's Get Started",
        link: "/contact",
      },
      cards: sectionData?.cards || [
        {
          title: "TVG Verify",
          description: "Let us ensure your hiring is secure with reliable background screening and compliance checks.",
          image: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766654126/smart-8_qse95f_zdwowb.jpg",
        },
        {
          title: "TVG Management",
          description: "Comprehensive agency management support focused on optimizing day-to-day operations.",
          image: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766654121/smart-1_bnoofh_wyvooj.jpg",
        },
        {
          title: "TVG Reporting",
          description: "High-quality legal video services to support your cases.",
          image: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766654122/smart-2_fwdmzx_dwjzro.jpg",
        },
        {
          title: "TVG Stream",
          description: "Smart scheduling solutions built for efficiency.",
          image: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766654122/smart-3_dalt5r_qkf0u3.jpg",
        },
        {
          title: "TVG Books",
          description: "Dedicated support teams that scale with your firm.",
          image: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766654125/smart-4_dzjgbd_t20g6t.jpg",
        },
        {
          title: "TVG Connect",
          description: "Compliance services you can trust.",
          image: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766654126/smart-6_owwgbd_u42ppp.jpg",
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
        <h2 className="text-xl font-bold text-cyan-400 uppercase tracking-wider">Services Section</h2>

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

      {/* --- TEXT CONTENT --- */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Main Title</label>
          <input
            disabled={!isEditing}
            name="title"
            value={content.title}
            onChange={handleChange}
            className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${
              isEditing ? "border-cyan-400" : "border-gray-800 text-gray-400"
            }`}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Paragraph 1</label>
          <textarea
            disabled={!isEditing}
            value={content.paragraph1[0] || ""}
            onChange={(e) => handleParagraphChange(1, e.target.value)}
            rows="4"
            className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${
              isEditing ? "border-cyan-400" : "border-gray-800 text-gray-400"
            }`}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Paragraph 2</label>
          <textarea
            disabled={!isEditing}
            value={content.paragraph2[0] || ""}
            onChange={(e) => handleParagraphChange(2, e.target.value)}
            rows="4"
            className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${
              isEditing ? "border-cyan-400" : "border-gray-800 text-gray-400"
            }`}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Button Label</label>
            <input
              disabled={!isEditing}
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

          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Button Link</label>
            <input
              disabled={!isEditing}
              value={content.button?.link || ""}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  button: { ...prev.button, link: e.target.value },
                }))
              }
              className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${
                isEditing ? "border-cyan-400" : "border-gray-800 text-gray-400"
              }`}
            />
          </div>
        </div>
      </div>

      {/* --- CARDS SECTION --- */}
      <div className="border-t border-gray-800 pt-8">
        <h3 className="text-sm font-bold text-cyan-400 mb-4">Service Cards ({content.cards?.length})</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {content.cards?.map((card, index) => (
            <div
              key={index}
              className={`bg-[#0b1318] border rounded-2xl p-4 flex flex-col gap-3 ${
                isEditing ? "border-cyan-400/30" : "border-gray-800"
              }`}
            >
              {/* Card Image */}
              <div className="relative w-full h-40 bg-black rounded-lg overflow-hidden group">
                <input
                  type="file"
                  id={`card-image-${index}`}
                  className="hidden"
                  onChange={(e) => handleCardImageUpdate(index, e.target.files[0])}
                  accept="image/*"
                />
                <img
                  src={card.image}
                  alt={card.title}
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
                      onClick={() => onBrowseLibrary(`serviceImage_${index}`)}
                      className="absolute top-2 right-2 bg-green-600 hover:bg-green-700 text-white p-2 rounded transition-colors opacity-0 group-hover:opacity-100"
                      title="Browse Library"
                    >
                      <HiOutlineViewGridAdd className="text-lg" />
                    </button>
                  </>
                )}
              </div>

              {/* Card Title */}
              <input
                disabled={!isEditing}
                value={card.title}
                onChange={(e) => updateCard(index, "title", e.target.value)}
                placeholder="Card Title"
                className={`bg-transparent border-b border-gray-800 text-sm font-bold outline-none text-white focus:border-cyan-400 ${
                  !isEditing ? "border-transparent" : ""
                }`}
              />

              {/* Card Description */}
              <textarea
                disabled={!isEditing}
                value={card.description}
                onChange={(e) => updateCard(index, "description", e.target.value)}
                placeholder="Description"
                rows="2"
                className={`bg-transparent border rounded-lg p-2 text-[11px] outline-none text-gray-400 ${
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
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">{content.title}</h2>
              <p className="text-sm text-gray-400 mb-3">{content.paragraph1[0]}</p>
              <p className="text-sm text-gray-400 mb-4">{content.paragraph2[0]}</p>
              <button className="px-6 py-2 bg-cyan-500 text-black font-bold rounded-lg text-sm">
                {content.button?.label}
              </button>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <p className="text-xs font-semibold text-cyan-400 mb-3">Service Cards Grid</p>
              <div className="grid grid-cols-2 gap-3">
                {content.cards?.map((card, i) => (
                  <div key={i} className="rounded-lg overflow-hidden bg-black">
                    <img src={card.image} alt={card.title} className="w-full h-20 object-cover" />
                    <div className="p-2">
                      <p className="text-xs font-semibold text-white">{card.title}</p>
                      <p className="text-[10px] text-gray-400 line-clamp-1">{card.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
