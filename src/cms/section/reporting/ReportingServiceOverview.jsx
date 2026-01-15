import React, { useState, useRef, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  HiOutlineUpload,
  HiOutlineSave,
  HiOutlinePencilAlt,
  HiOutlineX,
  HiOutlineViewGridAdd,
} from "react-icons/hi";
import { uploadAPI } from "../../../services/apiService";

const ReportingServiceOverview = ({ sectionData, onSave, onBrowseLibrary }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showReference, setShowReference] = useState(false);
  const fileInputRef = useRef(null);

  console.log("ReportingServiceOverview sectionData:", sectionData);

  const mapSectionToContent = (sd) => {
    let para1 = "",
      para2 = "";
    if (sd?.para) {
      if (Array.isArray(sd.para)) {
        para1 = sd.para[0] || "";
        para2 = sd.para[1] || "";
      } else {
        para1 = sd.para || "";
      }
    }

    return {
      heading: sd?.heading || "Reporting Excellence",
      subHeading: sd?.subHeading || "Data-Driven Insights for Better Decisions",
      title: sd?.title || "Advanced Insights",
      para1,
      para2,
      image: sd?.img || "./hero.png",
    };
  };

  const [content, setContent] = useState(mapSectionToContent(sectionData));

  React.useEffect(() => {
    console.log('📌 ReportingServiceOverview received sectionData:', sectionData);
    setContent(mapSectionToContent(sectionData));
  }, [sectionData]);

  // Listen for image selection from Media Library
  useEffect(() => {
    const handler = (e) => {
      const { fieldName, imageUrl } = e?.detail || {};
      if (fieldName !== "image" || !imageUrl) return;
      console.log(`🖼️ Image selected from library for image:`, imageUrl);
      setContent((prev) => ({ ...prev, image: imageUrl }));
    };

    window.addEventListener('imageSelected', handler);
    return () => window.removeEventListener('imageSelected', handler);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContent((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpdate = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const maxSize = 1 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size must be less than 1MB");
      return;
    }
    const url = URL.createObjectURL(file);
    setContent((prev) => ({ ...prev, image: url, imageFile: file }));
  };

  const handleCancel = () => {
    setContent(mapSectionToContent(sectionData));
    setIsEditing(false);
    toast.success("Changes discarded");
  };

  return (
    <div className="flex flex-col gap-8 font-manrope">
      <Toaster />
      {/* --- HEADER --- */}
      <div className="flex justify-between items-center border-b border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-cyan-400 uppercase tracking-wider">
            Service Overview
          </h2>
          {isEditing && (
            <button
              onClick={() => setShowReference(!showReference)}
              className="text-xs px-3 py-1 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-cyan-400 transition-all"
            >
              {showReference ? "✓ Preview" : "Preview"}
            </button>
          )}
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
                onClick={async () => {
                  try {
                    toast.loading('Processing...', { id: 'upload' });

                    if (content.imageFile && content.imageFile instanceof File) {
                      console.log(`📤 Uploading ${content.imageFile.name}...`);
                      const res = await uploadAPI.uploadImage(content.imageFile, 'overview', 'tvg-reporting');
                      console.log(`✅ Uploaded:`, res.url);
                      content.image = res.url;
                      content.imageFile = null;
                      setContent((prev) => ({...prev, image: res.url, imageFile: null}));
                    }

                    toast.success('Saved', { id: 'upload' });

                    const payload = {
                      heading: content.heading,
                      subHeading: content.subHeading,
                      title: content.title,
                      para: [content.para1, content.para2].filter(Boolean),
                      img: content.image,
                    };

                    console.log('💾 ReportingServiceOverview final payload:', payload);
                    await onSave(payload);
                    setIsEditing(false);
                  } catch (err) {
                    console.error('❌ Error:', err);
                    toast.error('Failed to save');
                  }
                }}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black px-6 py-2 rounded-full font-bold transition-all shadow-lg"
              >
                <HiOutlineSave /> SAVE
              </button>
            </>
          )}
        </div>
      </div>

      {/* --- MAIN SECTION: Two-Column Layout --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* --- LEFT COLUMN: TEXT INPUTS --- */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">
              Heading
            </label>
            <input
              disabled={!isEditing}
              name="heading"
              value={content.heading}
              placeholder=""
              onChange={handleChange}
              className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${
                isEditing ? "border-cyan-400" : "border-gray-800 text-gray-400"
              }`}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">
              Title
            </label>
            <input
              disabled={!isEditing}
              name="title"
              value={content.title}
              placeholder=""
              onChange={handleChange}
              className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${
                isEditing ? "border-cyan-400" : "border-gray-800 text-gray-400"
              }`}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">
              Sub Heading
            </label>
            <input
              disabled={!isEditing}
              name="subHeading"
              value={content.subHeading}
              placeholder=""
              onChange={handleChange}
              className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${
                isEditing ? "border-cyan-400" : "border-gray-800 text-gray-400"
              }`}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">
              Paragraph 1
            </label>
            <textarea
              disabled={!isEditing}
              name="para1"
              value={content.para1}
              placeholder=""
              onChange={handleChange}
              rows="3"
              className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${
                isEditing ? "border-cyan-400" : "border-gray-800 text-gray-400"
              }`}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">
              Paragraph 2
            </label>
            <textarea
              disabled={!isEditing}
              name="para2"
              value={content.para2}
              placeholder=""
              onChange={handleChange}
              rows="3"
              className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${
                isEditing ? "border-cyan-400" : "border-gray-800 text-gray-400"
              }`}
            />
          </div>
        </div>

        {/* --- RIGHT COLUMN: IMAGE --- */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">
              Overview Image
            </label>
            {isEditing && onBrowseLibrary && (
              <button
                onClick={() => onBrowseLibrary("image")}
                className="flex items-center gap-2 px-3 py-1.5 text-xs bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg hover:bg-green-500/30 transition-all"
              >
                <HiOutlineViewGridAdd className="text-sm" />
              </button>
            )}
          </div>
          <div
            onClick={() => isEditing && fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl h-96 flex items-center justify-center bg-black/20 overflow-hidden ${
              isEditing
                ? "border-cyan-500 cursor-pointer group"
                : "border-gray-800"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpdate}
              className="hidden"
            />
            <img
              src={showReference ? "./hero.png" : content.image}
              className="max-h-full object-contain p-2"
              alt="Overview"
            />
            {isEditing && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <HiOutlineUpload className="text-cyan-400 text-2xl" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- FULL PREVIEW SECTION (Only when NOT editing) --- */}
      {!isEditing && (
        <div className="border-t border-gray-800 pt-6">
          <h3 className="text-sm font-bold text-cyan-400 mb-4">Preview</h3>
          <div className="bg-gray-900/50 rounded-xl p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">{content.heading}</p>
                <h2 className="text-2xl font-bold text-white mb-3">{content.title}</h2>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">{content.subHeading}</p>
                <p className="text-sm text-gray-300 leading-relaxed mb-3">{content.para1}</p>
                {content.para2 && <p className="text-sm text-gray-300 leading-relaxed">{content.para2}</p>}
              </div>
              <div>
                <img src={content.image} alt="Overview" className="w-full h-64 object-cover rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportingServiceOverview;
