import React, { useState, useRef, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { HiOutlineUpload, HiOutlineSave, HiOutlinePencilAlt, HiOutlineX, HiOutlineViewGridAdd } from "react-icons/hi";
import { uploadAPI } from "../../../services/apiService";

const Experience = ({ sectionData, onSave, onBrowseLibrary }) => {
  const [isEditing, setIsEditing] = useState(false);
  const mainFileRef = useRef(null);

  console.log("📍 Experience sectionData:", sectionData);

  // Listen for image selection from MediaLibrary
  useEffect(() => {
    const handleImageSelected = (event) => {
      const { fieldName, imageUrl } = event.detail;
      if (fieldName === "mainImage") {
        console.log("✅ Image selected for Experience main image:", imageUrl);
        setContent((prev) => ({
          ...prev,
          image: {
            ...prev.image,
            url: imageUrl,
          },
        }));
        toast.success("Image loaded from library!");
      } else if (fieldName.startsWith("highlightIcon_")) {
        const index = parseInt(fieldName.split("_")[1]);
        console.log("✅ Image selected for highlight icon:", index, imageUrl);
        setContent((prev) => {
          const newHighlights = [...prev.highlights];
          newHighlights[index] = {
            ...newHighlights[index],
            icon: imageUrl,
          };
          return { ...prev, highlights: newHighlights };
        });
        toast.success("Icon loaded from library!");
      }
    };

    window.addEventListener("imageSelected", handleImageSelected);
    return () => window.removeEventListener("imageSelected", handleImageSelected);
  }, []);

  // State initialized with actual backend data structure
  const [content, setContent] = useState({
    title: sectionData?.title || "Decades of Experience. One Trusted Team.",
    subHeading: sectionData?.subHeading || "Delivering Solutions to Court Reporting Firms Across the U.S.",
    description: sectionData?.description || "Delivering Solutions to Court Reporting Firms Across the U.S. Backed by over 50 years of leadership and expertise in the court reporting industry, The Varallo Group combines a rich legacy, unwavering commitment, and forward-thinking innovation to empower and support your firm every step of the way.",
    image: sectionData?.image || {
      url: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766654117/about-home_hgci6g_ggurfw.png",
      alt: "Professional team",
    },
    whatSetsUsApart: sectionData?.whatSetsUsApart || {
      heading: "What Sets Us Apart",
      description: "Our handpicked team draws from decades of experience, delivering service with precision and professionalism.",
    },
    highlights: sectionData?.highlights || [
      {
        title: "Technology-Driven",
        description: "We leverage advanced tools to streamline scheduling, delivery, and communication so you can scale with confidence.",
        icon: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766654114/ab-1_m4fofk_puuuto.png",
      },
      {
        title: "Confidential & Reliable",
        description: "We recognize the trust you've placed in us, and we're dedicated to protecting the confidentiality of your private company information.",
        icon: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766654114/ab-2_yht0sc_jdw5bv.png",
      },
      {
        title: "People First",
        description: "It's not just what we do, it's about the people we serve. Our dedicated team brings genuine passion to help your business thrive.",
        icon: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766654114/ab-3_rpcdr4_xbdlik.png",
      },
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

    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      toast.error("File size must be less than 2MB");
      return;
    }

    try {
      setUploading(true);
      const uploadResult = await uploadAPI.uploadImage(file, 'experience', 'home');
      
      if (uploadResult.success) {
        setContent((prev) => ({
          ...prev,
          image: {
            url: uploadResult.url,
            publicId: uploadResult.publicId,
            alt: prev.image?.alt || "Experience image",
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

  const handleHighlightImageUpdate = async (index, file) => {
    if (!file) return;

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size must be less than 2MB");
      return;
    }

    try {
      setUploading(true);
      const uploadResult = await uploadAPI.uploadImage(file, 'experience-highlight', 'home');
      
      if (uploadResult.success) {
        setContent((prev) => {
          const newHighlights = [...prev.highlights];
          newHighlights[index] = {
            ...newHighlights[index],
            icon: uploadResult.url,
            publicId: uploadResult.publicId,
          };
          return { ...prev, highlights: newHighlights };
        });
        toast.success("Highlight image uploaded!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const updateHighlight = (index, field, value) => {
    setContent((prev) => {
      const newHighlights = [...prev.highlights];
      newHighlights[index] = { ...newHighlights[index], [field]: value };
      return { ...prev, highlights: newHighlights };
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
      title: sectionData?.title || "Decades of Experience. One Trusted Team.",
      subHeading: sectionData?.subHeading || "Delivering Solutions to Court Reporting Firms Across the U.S.",
      description: sectionData?.description || "Delivering Solutions to Court Reporting Firms Across the U.S. Backed by over 50 years of leadership and expertise in the court reporting industry, The Varallo Group combines a rich legacy, unwavering commitment, and forward-thinking innovation to empower and support your firm every step of the way.",
      image: sectionData?.image || {
        url: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766654117/about-home_hgci6g_ggurfw.png",
        alt: "Professional team",
      },
      whatSetsUsApart: sectionData?.whatSetsUsApart || {
        heading: "What Sets Us Apart",
        description: "Our handpicked team draws from decades of experience, delivering service with precision and professionalism.",
      },
      highlights: sectionData?.highlights || [
        {
          title: "Technology-Driven",
          description: "We leverage advanced tools to streamline scheduling, delivery, and communication so you can scale with confidence.",
          icon: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766654114/ab-1_m4fofk_puuuto.png",
        },
        {
          title: "Confidential & Reliable",
          description: "We recognize the trust you've placed in us, and we're dedicated to protecting the confidentiality of your private company information.",
          icon: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766654114/ab-2_yht0sc_jdw5bv.png",
        },
        {
          title: "People First",
          description: "It's not just what we do, it's about the people we serve. Our dedicated team brings genuine passion to help your business thrive.",
          icon: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766654114/ab-3_rpcdr4_xbdlik.png",
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
        <h2 className="text-xl font-bold text-cyan-400 uppercase tracking-wider">Experience Section</h2>

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
        {/* LEFT: TEXT INPUTS */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Title</label>
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
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">What Sets Us Apart - Heading</label>
            <input
              disabled={!isEditing}
              value={content.whatSetsUsApart?.heading || ""}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  whatSetsUsApart: { ...prev.whatSetsUsApart, heading: e.target.value },
                }))
              }
              className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${
                isEditing ? "border-cyan-400" : "border-gray-800 text-gray-400"
              }`}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">What Sets Us Apart - Description</label>
            <textarea
              disabled={!isEditing}
              value={content.whatSetsUsApart?.description || ""}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  whatSetsUsApart: { ...prev.whatSetsUsApart, description: e.target.value },
                }))
              }
              rows="3"
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

        {/* RIGHT: MAIN IMAGE */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Main Image</label>
          <div
            onClick={() => isEditing && mainFileRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl h-full min-h-[300px] max-h-[400px] flex items-center justify-center bg-black/20 overflow-hidden transition-all ${
              isEditing ? "border-cyan-500 cursor-pointer group hover:border-cyan-400" : "border-gray-800"
            }`}
          >
            <input
              type="file"
              ref={mainFileRef}
              onChange={(e) => handleImageUpdate(e)}
              accept="image/*"
              className="hidden"
            />

            {content.image?.url ? (
              <>
                <img
                  src={content.image.url}
                  alt={content.image?.alt || "Experience"}
                  className="max-h-full object-contain p-4"
                />
                {isEditing && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex flex-col items-center gap-2">
                      <HiOutlineUpload className="text-cyan-400 text-3xl" />
                      <p className="text-white text-sm font-semibold">Click to upload</p>
                    </div>
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
                <p>No image selected</p>
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

      {/* --- HIGHLIGHTS SECTION --- */}
      <div className="border-t border-gray-800 pt-8">
        <h3 className="text-sm font-bold text-cyan-400 mb-4">Highlights (3 Cards)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {content.highlights?.map((highlight, index) => (
            <div
              key={index}
              className={`bg-[#0b1318] border rounded-2xl p-4 flex flex-col gap-3 ${
                isEditing ? "border-cyan-400/30" : "border-gray-800"
              }`}
            >
              {/* Icon/Image */}
              <div className="relative w-full h-32 bg-black rounded-lg overflow-hidden group">
                <input
                  type="file"
                  id={`highlight-${index}`}
                  className="hidden"
                  onChange={(e) => handleHighlightImageUpdate(index, e.target.files[0])}
                  accept="image/*"
                />
                <img
                  src={highlight.icon}
                  alt={highlight.title}
                  className="w-full h-full object-cover"
                />
                {isEditing && (
                  <>
                    <label
                      htmlFor={`highlight-${index}`}
                      className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <HiOutlineUpload className="text-cyan-400 text-xl" />
                    </label>
                    <button
                      type="button"
                      onClick={() => onBrowseLibrary(`highlightIcon_${index}`)}
                      className="absolute top-2 right-2 bg-green-600 hover:bg-green-700 text-white p-2 rounded transition-colors opacity-0 group-hover:opacity-100"
                      title="Browse Library"
                    >
                      <HiOutlineViewGridAdd className="text-lg" />
                    </button>
                  </>
                )}
              </div>

              {/* Title */}
              <input
                disabled={!isEditing}
                value={highlight.title}
                onChange={(e) => updateHighlight(index, "title", e.target.value)}
                placeholder="Title"
                className={`bg-transparent border-b border-gray-800 text-sm font-bold outline-none text-white focus:border-cyan-400 ${
                  !isEditing ? "border-transparent" : ""
                }`}
              />

              {/* Description */}
              <textarea
                disabled={!isEditing}
                value={highlight.description}
                onChange={(e) => updateHighlight(index, "description", e.target.value)}
                placeholder="Description"
                rows="3"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-2xl font-bold text-white">{content.title}</h2>
                <p className="text-sm text-cyan-400 mt-2">{content.subHeading}</p>
                <p className="text-xs text-gray-400 mt-3 line-clamp-3">{content.description}</p>
              </div>
              <img src={content.image?.url} alt={content.image?.alt} className="max-h-48 object-contain rounded-lg" />
            </div>

            <div className="border-t border-gray-700 pt-4">
              <h4 className="font-bold text-white mb-3">{content.whatSetsUsApart?.heading}</h4>
              <p className="text-sm text-gray-400 mb-4">{content.whatSetsUsApart?.description}</p>
              <div className="grid grid-cols-3 gap-3">
                {content.highlights?.map((h, i) => (
                  <div key={i} className="text-center">
                    <img src={h.icon} alt={h.title} className="w-16 h-16 object-cover mx-auto rounded-lg mb-2" />
                    <p className="text-xs font-semibold text-white">{h.title}</p>
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

export default Experience;
