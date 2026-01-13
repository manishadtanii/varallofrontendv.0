import React, { useState, useRef, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { HiOutlineUpload, HiOutlineSave, HiOutlinePencilAlt, HiOutlineX, HiOutlineTrash, HiOutlineViewGridAdd } from "react-icons/hi";
import { uploadAPI } from "../../../services/apiService";

const Founder = ({ sectionData, onSave, onBrowseLibrary }) => {
  const [isEditing, setIsEditing] = useState(false);
  const profileImageRef = useRef(null);

  console.log("📍 Founder sectionData:", sectionData);

  // Listen for image selection from MediaLibrary
  useEffect(() => {
    const handleImageSelected = (event) => {
      const { fieldName, imageUrl } = event.detail;
      if (fieldName === "profileImage") {
        console.log("✅ Image selected for Founder profile image:", imageUrl);
        setContent((prev) => ({
          ...prev,
          profile: {
            image: {
              ...prev.profile?.image,
              url: imageUrl,
            },
          },
        }));
        toast.success("Image loaded from library!");
      }
    };

    window.addEventListener("imageSelected", handleImageSelected);
    return () => window.removeEventListener("imageSelected", handleImageSelected);
  }, []);

  const [content, setContent] = useState({
    name: sectionData?.name || "Nancy Varallo",
    para1: sectionData?.para1 || "Nancy Varallo launched her court reporting career in 1979 and founded The Varallo Group in 2001, combining decades of expertise with a bold vision for better, smarter legal support.",
    para2: sectionData?.para2 || "From serving as President of the National Court Reporters Association to co-founding the Project to Advance Stenographic Reporting (Project Steno), Nancy has been a powerful advocate for the profession.",
    quote: sectionData?.quote || {
      text: "Our team is the heart of The Varallo Group. They bring dedication, professionalism, and integrity to everything they do.",
    },
    profile: sectionData?.profile || {
      image: {
        url: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766736715/founder_ncvend.png",
        alt: "Nancy Varallo, Founder of The Varallo Group",
      },
    },
    socialLinks: sectionData?.socialLinks || [
      { platform: "linkedin", url: "https://www.linkedin.com/in/nancy-varallo" },
      { platform: "facebook", url: "https://www.facebook.com/nancy-varallo" },
    ],
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContent((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileImageUpdate = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size must be less than 2MB");
      return;
    }

    try {
      setUploading(true);
      const uploadResult = await uploadAPI.uploadImage(file, 'founder-profile', 'about');

      if (uploadResult.success) {
        setContent((prev) => ({
          ...prev,
          profile: {
            image: {
              url: uploadResult.url,
              publicId: uploadResult.publicId,
              alt: prev.profile?.image?.alt || "Founder profile image",
            },
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

  const updateSocialLink = (index, field, value) => {
    setContent((prev) => {
      const newLinks = [...prev.socialLinks];
      newLinks[index] = { ...newLinks[index], [field]: value };
      return { ...prev, socialLinks: newLinks };
    });
  };

  const addSocialLink = () => {
    setContent((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: "linkedin", url: "" }],
    }));
  };

  const removeSocialLink = (index) => {
    setContent((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index),
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
      name: sectionData?.name || "Nancy Varallo",
      para1: sectionData?.para1 || "Nancy Varallo launched her court reporting career in 1979 and founded The Varallo Group in 2001, combining decades of expertise with a bold vision for better, smarter legal support.",
      para2: sectionData?.para2 || "From serving as President of the National Court Reporters Association to co-founding the Project to Advance Stenographic Reporting (Project Steno), Nancy has been a powerful advocate for the profession.",
      quote: sectionData?.quote || {
        text: "Our team is the heart of The Varallo Group. They bring dedication, professionalism, and integrity to everything they do.",
      },
      profile: sectionData?.profile || {
        image: {
          url: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766736715/founder_ncvend.png",
          alt: "Nancy Varallo, Founder of The Varallo Group",
        },
      },
      socialLinks: sectionData?.socialLinks || [
        { platform: "linkedin", url: "https://www.linkedin.com/in/nancy-varallo" },
        { platform: "facebook", url: "https://www.facebook.com/nancy-varallo" },
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
        <h2 className="text-xl font-bold text-cyan-400 uppercase tracking-wider">Founder Section</h2>

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

      {/* --- FOUNDER INFO --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT: TEXT */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Founder Name</label>
            <input
              disabled={!isEditing}
              name="name"
              value={content.name}
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
              name="para1"
              value={content.para1}
              onChange={handleChange}
              rows="3"
              className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${
                isEditing ? "border-cyan-400" : "border-gray-800 text-gray-400"
              }`}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Paragraph 2</label>
            <textarea
              disabled={!isEditing}
              name="para2"
              value={content.para2}
              onChange={handleChange}
              rows="3"
              className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${
                isEditing ? "border-cyan-400" : "border-gray-800 text-gray-400"
              }`}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Quote Text</label>
            <textarea
              disabled={!isEditing}
              value={content.quote?.text || ""}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  quote: { ...prev.quote, text: e.target.value },
                }))
              }
              rows="3"
              className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${
                isEditing ? "border-cyan-400" : "border-gray-800 text-gray-400"
              }`}
            />
          </div>
        </div>

        {/* RIGHT: IMAGE */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Profile Image</label>
          <div
            onClick={() => isEditing && profileImageRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl h-full min-h-[300px] max-h-[400px] flex items-center justify-center bg-black/20 overflow-hidden transition-all ${
              isEditing ? "border-cyan-500 cursor-pointer group hover:border-cyan-400" : "border-gray-800"
            }`}
          >
            <input
              type="file"
              ref={profileImageRef}
              onChange={handleProfileImageUpdate}
              accept="image/*"
              className="hidden"
            />

            {content.profile?.image?.url ? (
              <>
                <img
                  src={content.profile.image.url}
                  alt={content.profile.image?.alt || "Founder"}
                  className="max-h-full object-contain p-4"
                />
                {isEditing && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <HiOutlineUpload className="text-cyan-400 text-3xl" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onBrowseLibrary("profileImage");
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
                      onBrowseLibrary("profileImage");
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

          <input
            disabled={!isEditing}
            value={content.profile?.image?.alt || ""}
            onChange={(e) =>
              setContent((prev) => ({
                ...prev,
                profile: {
                  image: { ...prev.profile.image, alt: e.target.value },
                },
              }))
            }
            placeholder="Image Alt Text"
            className={`w-full bg-transparent border rounded-xl px-4 py-2 text-xs outline-none transition-all ${
              isEditing ? "border-cyan-400" : "border-gray-800 text-gray-400"
            }`}
          />
        </div>
      </div>

      {/* --- SOCIAL LINKS --- */}
      <div className="border-t border-gray-800 pt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-cyan-400">Social Links ({content.socialLinks?.length})</h3>
          {isEditing && (
            <button
              onClick={addSocialLink}
              className="text-xs bg-cyan-500/20 border border-cyan-400 text-cyan-400 px-3 py-1.5 rounded-lg hover:bg-cyan-500/30 transition-all"
            >
              + Add Link
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3">
          {content.socialLinks?.map((link, index) => (
            <div key={index} className={`bg-[#0b1318] border rounded-lg p-3 grid grid-cols-3 gap-2 ${isEditing ? "border-cyan-400/30" : "border-gray-800"}`}>
              <input
                disabled={!isEditing}
                value={link.platform}
                onChange={(e) => updateSocialLink(index, "platform", e.target.value)}
                placeholder="Platform (e.g., linkedin, facebook)"
                className={`bg-transparent border rounded-lg px-3 py-2 text-xs outline-none text-white ${
                  isEditing ? "border-cyan-400/30" : "border-gray-800"
                }`}
              />

              <input
                disabled={!isEditing}
                value={link.url}
                onChange={(e) => updateSocialLink(index, "url", e.target.value)}
                placeholder="URL"
                className={`col-span-2 bg-transparent border rounded-lg px-3 py-2 text-xs outline-none text-white ${
                  isEditing ? "border-cyan-400/30" : "border-gray-800"
                }`}
              />

              {isEditing && (
                <button
                  onClick={() => removeSocialLink(index)}
                  className="text-red-400 hover:text-red-300 transition-all ml-auto"
                >
                  <HiOutlineTrash size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* --- PREVIEW --- */}
      {!isEditing && (
        <div className="border-t border-gray-800 pt-6">
          <h3 className="text-sm font-bold text-cyan-400 mb-4">Preview</h3>
          <div className="bg-gray-900/50 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col items-center text-center">
                <img
                  src={content.profile?.image?.url}
                  alt={content.profile?.image?.alt}
                  className="w-48 h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-lg font-bold text-white mb-2">{content.name}</h3>
                <div className="flex gap-3 justify-center">
                  {content.socialLinks?.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 text-sm font-semibold"
                    >
                      {link.platform}
                    </a>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-gray-300">{content.para1}</p>
                <p className="text-sm text-gray-300">{content.para2}</p>
                <div className="bg-black/30 rounded-lg p-4 border-l-2 border-cyan-400 mt-4">
                  <p className="text-sm text-gray-300 italic">"{content.quote?.text}"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Founder;
