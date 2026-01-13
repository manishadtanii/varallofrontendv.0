import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { HiOutlineUpload, HiOutlineSave, HiOutlinePencilAlt, HiOutlineX, HiOutlineViewGridAdd } from "react-icons/hi";
import { uploadAPI } from "../../../services/apiService";

const ASupportCompany = ({ sectionData, onSave, onBrowseLibrary }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  console.log("📍 A Support Company (services-hero) sectionData received:", sectionData);
  console.log("📊 sectionData structure:", {
    isEmpty: Object.keys(sectionData || {}).length === 0,
    keys: Object.keys(sectionData || {}),
    hasImagetop: !!sectionData?.Imagetop,
    hasCenterContent: !!sectionData?.centerContent,
    hasImagebottom: !!sectionData?.Imagebottom,
    fullData: sectionData
  });

  const [content, setContent] = useState({
    Imagetop: sectionData?.Imagetop || {
      url: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766740266/s-hero-left_zojvzd.gif",
      alt: "TVG Services overview",
    },
    centerContent: sectionData?.centerContent || {
      heading: "A Support Company That Understands Your Business",
      Image: {
        url: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766740263/s-hero_wwdqx5.gif",
        alt: "Integrated services ecosystem",
      },
      description:
        "At The Varallo Group, we bring together six specialized sub-brands under one clear vision. We are your single source for smarter, effective, and scalable success.",
      cta: {
        label: "Schedule a call now",
      },
    },
    Imagebottom: sectionData?.Imagebottom || {
      url: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766740266/s-hero-right_c1wbfa.gif",
      alt: "Professional legal support",
    },
  });

  // Update content when sectionData changes
  useEffect(() => {
    if (sectionData && Object.keys(sectionData).length > 0) {
      setContent({
        Imagetop: sectionData?.Imagetop || {
          url: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766740266/s-hero-left_zojvzd.gif",
          alt: "TVG Services overview",
        },
        centerContent: sectionData?.centerContent || {
          heading: "A Support Company That Understands Your Business",
          Image: {
            url: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766740263/s-hero_wwdqx5.gif",
            alt: "Integrated services ecosystem",
          },
          description:
            "At The Varallo Group, we bring together six specialized sub-brands under one clear vision. We are your single source for smarter, effective, and scalable success.",
          cta: {
            label: "Schedule a call now",
          },
        },
        Imagebottom: sectionData?.Imagebottom || {
          url: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766740266/s-hero-right_c1wbfa.gif",
          alt: "Professional legal support",
        },
      });
      console.log("✅ Content updated from sectionData");
    }
  }, [sectionData]);

  const handleChange = (field, value) => {
    setContent((prev) => {
      if (field === "heading") {
        return { ...prev, centerContent: { ...prev.centerContent, heading: value } };
      } else if (field === "description") {
        return { ...prev, centerContent: { ...prev.centerContent, description: value } };
      } else if (field === "ctaLabel") {
        return {
          ...prev,
          centerContent: {
            ...prev.centerContent,
            cta: { ...prev.centerContent.cta, label: value },
          },
        };
      }
      return prev;
    });
  };

  const handleImageUpload = async (imageType, file) => {
    if (!file) return;

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size must be less than 2MB");
      return;
    }

    try {
      setUploading(true);
      const uploadResult = await uploadAPI.uploadImage(file, `service-hero-${imageType}`, 'service');

      if (uploadResult.success) {
        if (imageType === "centerImage") {
          setContent((prev) => ({
            ...prev,
            centerContent: {
              ...prev.centerContent,
              Image: {
                url: uploadResult.url,
                publicId: uploadResult.publicId,
                alt: prev.centerContent.Image?.alt || "Service hero image",
              },
            },
          }));
        } else {
          setContent((prev) => ({
            ...prev,
            [imageType]: {
              url: uploadResult.url,
              publicId: uploadResult.publicId,
              alt: prev[imageType]?.alt || "Hero image",
            },
          }));
        }
        toast.success("Image uploaded!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleImageAltChange = (imageType, altText) => {
    if (imageType === "centerImage") {
      setContent((prev) => ({
        ...prev,
        centerContent: {
          ...prev.centerContent,
          Image: {
            ...prev.centerContent.Image,
            alt: altText,
          },
        },
      }));
    } else {
      setContent((prev) => ({
        ...prev,
        [imageType]: {
          ...prev[imageType],
          alt: altText,
        },
      }));
    }
  };

  // Listen for image selection from media library
  useEffect(() => {
    const handleImageSelected = (event) => {
      const { fieldName, imageUrl } = event.detail;
      if (fieldName === 'Imagetop' || fieldName === 'Imagebottom') {
        setContent((prev) => ({
          ...prev,
          [fieldName]: {
            url: imageUrl,
            alt: prev[fieldName]?.alt || "Hero image",
          },
        }));
        toast.success(`${fieldName} updated from library!`);
      } else if (fieldName === 'centerImage') {
        setContent((prev) => ({
          ...prev,
          centerContent: {
            ...prev.centerContent,
            Image: {
              url: imageUrl,
              alt: prev.centerContent.Image?.alt || "Center image",
            },
          },
        }));
        toast.success("Center image updated from library!");
      }
    };

    window.addEventListener('imageSelected', handleImageSelected);
    return () => window.removeEventListener('imageSelected', handleImageSelected);
  }, []);

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
      Imagetop: sectionData?.Imagetop || {
        url: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766740266/s-hero-left_zojvzd.gif",
        alt: "TVG Services overview",
      },
      centerContent: sectionData?.centerContent || {
        heading: "A Support Company That Understands Your Business",
        Image: {
          url: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766740263/s-hero_wwdqx5.gif",
          alt: "Integrated services ecosystem",
        },
        description:
          "At The Varallo Group, we bring together six specialized sub-brands under one clear vision. We are your single source for smarter, effective, and scalable success.",
        cta: {
          label: "Schedule a call now",
        },
      },
      Imagebottom: sectionData?.Imagebottom || {
        url: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766740266/s-hero-right_c1wbfa.gif",
        alt: "Professional legal support",
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
        <h2 className="text-xl font-bold text-cyan-400 uppercase tracking-wider">
          A Support Company Section
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

      {/* --- CENTER CONTENT SECTION --- */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-cyan-400">Hero Content</h3>

        <div className="flex flex-col gap-3">
          <div>
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Heading</label>
            <input
              disabled={!isEditing}
              value={content.centerContent.heading}
              onChange={(e) => handleChange("heading", e.target.value)}
              className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${
                isEditing ? "border-cyan-400" : "border-gray-800 text-gray-400"
              }`}
            />
          </div>

          <div>
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Description</label>
            <textarea
              disabled={!isEditing}
              value={content.centerContent.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows="3"
              className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${
                isEditing ? "border-cyan-400" : "border-gray-800 text-gray-400"
              }`}
            />
          </div>

          <div>
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">CTA Button Label</label>
            <input
              disabled={!isEditing}
              value={content.centerContent.cta.label}
              onChange={(e) => handleChange("ctaLabel", e.target.value)}
              className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${
                isEditing ? "border-cyan-400" : "border-gray-800 text-gray-400"
              }`}
            />
          </div>
        </div>
      </div>

      {/* --- IMAGES SECTION --- */}
      <div className="border-t border-gray-800 pt-6 space-y-6">
        <h3 className="text-sm font-bold text-cyan-400">Hero Images</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Top Image */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] text-gray-500 font-bold uppercase">Left Image</label>
              {isEditing && onBrowseLibrary && (
                <button onClick={() => onBrowseLibrary("Imagetop")} 
                  className="flex items-center gap-2 px-3 py-1.5 text-xs bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg hover:bg-green-500/30 transition-all">
                  <HiOutlineViewGridAdd className="text-sm" />
                </button>
              )}
            </div>
            <div className="relative w-full h-48 bg-black rounded-lg overflow-hidden group border border-gray-800">
              <input
                type="file"
                id="top-image"
                className="hidden"
                onChange={(e) => handleImageUpload("Imagetop", e.target.files[0])}
                accept="image/*"
              />
              <img
                src={content.Imagetop?.url}
                alt={content.Imagetop?.alt}
                className="w-full h-full object-cover"
              />
              {isEditing && (
                <label
                  htmlFor="top-image"
                  className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <HiOutlineUpload className="text-cyan-400 text-2xl" />
                </label>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <div className="w-6 h-6 border-3 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            {isEditing && (
              <input
                type="text"
                value={content.Imagetop?.alt || ""}
                onChange={(e) => handleImageAltChange("Imagetop", e.target.value)}
                placeholder="Alt text"
                className="w-full bg-transparent border border-cyan-400/30 rounded-lg px-3 py-2 text-xs"
              />
            )}
          </div>

          {/* Center Image */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] text-gray-500 font-bold uppercase">Center Image</label>
              {isEditing && onBrowseLibrary && (
                <button onClick={() => onBrowseLibrary("centerImage")} 
                  className="flex items-center gap-2 px-3 py-1.5 text-xs bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg hover:bg-green-500/30 transition-all">
                  <HiOutlineViewGridAdd className="text-sm" />
                </button>
              )}
            </div>
            <div className="relative w-full h-48 bg-black rounded-lg overflow-hidden group border border-gray-800">
              <input
                type="file"
                id="center-image"
                className="hidden"
                onChange={(e) => handleImageUpload("centerImage", e.target.files[0])}
                accept="image/*"
              />
              <img
                src={content.centerContent.Image?.url}
                alt={content.centerContent.Image?.alt}
                className="w-full h-full object-cover"
              />
              {isEditing && (
                <label
                  htmlFor="center-image"
                  className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <HiOutlineUpload className="text-cyan-400 text-2xl" />
                </label>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <div className="w-6 h-6 border-3 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            {isEditing && (
              <input
                type="text"
                value={content.centerContent.Image?.alt || ""}
                onChange={(e) => handleImageAltChange("centerImage", e.target.value)}
                placeholder="Alt text"
                className="w-full bg-transparent border border-cyan-400/30 rounded-lg px-3 py-2 text-xs"
              />
            )}
          </div>

          {/* Bottom Image */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] text-gray-500 font-bold uppercase">Right Image</label>
              {isEditing && onBrowseLibrary && (
                <button onClick={() => onBrowseLibrary("Imagebottom")} 
                  className="flex items-center gap-2 px-3 py-1.5 text-xs bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg hover:bg-green-500/30 transition-all">
                  <HiOutlineViewGridAdd className="text-sm" />
                </button>
              )}
            </div>
            <div className="relative w-full h-48 bg-black rounded-lg overflow-hidden group border border-gray-800">
              <input
                type="file"
                id="bottom-image"
                className="hidden"
                onChange={(e) => handleImageUpload("Imagebottom", e.target.files[0])}
                accept="image/*"
              />
              <img
                src={content.Imagebottom?.url}
                alt={content.Imagebottom?.alt}
                className="w-full h-full object-cover"
              />
              {isEditing && (
                <label
                  htmlFor="bottom-image"
                  className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <HiOutlineUpload className="text-cyan-400 text-2xl" />
                </label>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <div className="w-6 h-6 border-3 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            {isEditing && (
              <input
                type="text"
                value={content.Imagebottom?.alt || ""}
                onChange={(e) => handleImageAltChange("Imagebottom", e.target.value)}
                placeholder="Alt text"
                className="w-full bg-transparent border border-cyan-400/30 rounded-lg px-3 py-2 text-xs"
              />
            )}
          </div>
        </div>
      </div>

      {/* --- PREVIEW --- */}
      {!isEditing && (
        <div className="border-t border-gray-800 pt-6">
          <h3 className="text-sm font-bold text-cyan-400 mb-4">Preview</h3>
          <div className="bg-gray-900/50 rounded-xl p-6 space-y-6">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <img src={content.Imagetop?.url} alt={content.Imagetop?.alt} className="w-full h-32 object-cover rounded-lg" />
              <img
                src={content.centerContent.Image?.url}
                alt={content.centerContent.Image?.alt}
                className="w-full h-32 object-cover rounded-lg"
              />
              <img src={content.Imagebottom?.url} alt={content.Imagebottom?.alt} className="w-full h-32 object-cover rounded-lg" />
            </div>

            <div className="text-center space-y-3">
              <h2 className="text-3xl font-bold text-white">{content.centerContent.heading}</h2>
              <p className="text-sm text-gray-300 max-w-2xl mx-auto">{content.centerContent.description}</p>
              <button className="bg-cyan-500 text-black px-6 py-2 rounded-lg font-bold hover:bg-cyan-400 transition-all">
                {content.centerContent.cta.label}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ASupportCompany;
