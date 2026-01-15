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

const AgencyBooks = ({ sectionData, onSave, onBrowseLibrary }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showReference, setShowReference] = useState(false);
  const fileInputsRef = useRef({});

  console.log("AgencyBooks sectionData:", sectionData);

  // Map backend sectionData -> local content shape
  const mapSectionToContent = (sd) => ({
    tag: sd?.name || sd?.title || "TVG Books",
    heading: sd?.title || sd?.name || "Bookkeeping Services for Court Reporting Firms",
    desc: sd?.para || sd?.description || "Your business depends on more than exceptional service. It depends on strong financial health. Without transparent financial insights, even thriving agencies can face cash flow issues, compliance concerns, or inefficient planning.",
    ctaText: sd?.cta?.label || sd?.ctaText || "Schedule a call now",
    mainImage1: sd?.images?.[0] || "./hero.png",
    mainImage2: sd?.images?.[1] || "./hero.png",
    mainImage3: sd?.images?.[2] || "./hero.png",
    mainImage4: sd?.images?.[3] || "./hero.png",
  });

  const [content, setContent] = useState(mapSectionToContent(sectionData));

  React.useEffect(() => {
    console.log('📌 AgencyBooks received sectionData:', sectionData);
    setContent(mapSectionToContent(sectionData));
  }, [sectionData]);

  // Listen for image selection from Media Library
  useEffect(() => {
    const handler = (e) => {
      const { fieldName, imageUrl } = e?.detail || {};
      if (!fieldName || !imageUrl) return;
      console.log(`🖼️ Image selected from library for ${fieldName}:`, imageUrl);
      setContent((prev) => ({ ...prev, [fieldName]: imageUrl }));
    };

    window.addEventListener('imageSelected', handler);
    return () => window.removeEventListener('imageSelected', handler);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContent((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpdate = (key, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const maxSize = 1 * 1024 * 1024; // 1MB
    if (file.size > maxSize) {
      toast.error("File size must be less than 1MB");
      return;
    }
    const url = URL.createObjectURL(file);
    setContent((prev) => ({ ...prev, [key]: url, [`${key}File`]: file }));
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
            Section Editor
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
                    toast.loading('Uploading images...', { id: 'upload' });

                    const filesToCheck = ['mainImage1', 'mainImage2', 'mainImage3', 'mainImage4'];

                    for (const key of filesToCheck) {
                      const fileKey = `${key}File`;
                      const file = content[fileKey];
                      if (file && file instanceof File) {
                        console.log(`📤 Uploading ${file.name} for ${key}...`);
                        const res = await uploadAPI.uploadImage(file, 'hero', 'tvg-books');
                        console.log(`✅ Uploaded for ${key}:`, res.url);

                        setContent((prev) => ({ ...prev, [key]: res.url, [fileKey]: null }));
                        content[key] = res.url;
                        content[fileKey] = null;
                      }
                    }

                    toast.success('Images uploaded', { id: 'upload' });

                    const payload = {
                      name: content.tag,
                      title: content.heading,
                      para: content.desc,
                      cta: { label: content.ctaText },
                      images: [content.mainImage1, content.mainImage2, content.mainImage3, content.mainImage4].filter(Boolean),
                    };

                    console.log('💾 AgencyBooks final payload (after uploads):', payload);
                    await onSave(payload);
                    setIsEditing(false);
                  } catch (err) {
                    console.error('❌ Error uploading images or saving:', err);
                    toast.error('Failed to upload images or save');
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
              Tag
            </label>
            <input
              disabled={!isEditing}
              name="tag"
              value={content.tag}
              placeholder=""
              onChange={handleChange}
              className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${
                isEditing ? "border-cyan-400" : "border-gray-800 text-gray-400"
              }`}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Main Heading</label>
            <input disabled={!isEditing} name="heading" value={content.heading} placeholder="" onChange={handleChange} className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${isEditing ? 'border-cyan-400' : 'border-gray-800 text-gray-400'}`} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">
              Paragraph Text
            </label>
            <textarea
              disabled={!isEditing}
              name="desc"
              value={content.desc}
              placeholder=""
              onChange={handleChange}
              rows="4"
              className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${
                isEditing ? "border-cyan-400" : "border-gray-800 text-gray-400"
              }`}
            />
          </div>
          <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">
                CTA Text
              </label>
              <input
                disabled={!isEditing}
                placeholder=""
                name="ctaText"
                value={content.ctaText}
                onChange={handleChange}
                className={`bg-transparent border rounded-xl px-4 py-2 outline-none ${
                  isEditing
                    ? "border-cyan-400"
                    : "border-gray-800 text-gray-400"
                }`}
              />
            </div>
        </div>

        {/* --- RIGHT COLUMN: 4-IMAGE GRID --- */}
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <div className="flex items-center justify-between">
              <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">
                Image 1
              </label>
              {isEditing && onBrowseLibrary && (
                <button
                  onClick={() => onBrowseLibrary("mainImage1")}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg hover:bg-green-500/30 transition-all"
                >
                  <HiOutlineViewGridAdd className="text-sm" />
                </button>
              )}
            </div>
            <div
              onClick={() => isEditing && fileInputsRef.current['mainImage1']?.click()}
              className={`relative border-2 border-dashed rounded-2xl h-full min-h-[200px] max-h-[320px] flex items-center justify-center bg-black/20 overflow-hidden ${
                isEditing
                  ? "border-cyan-500 cursor-pointer group"
                  : "border-gray-800"
              }`}
            >
              <input
                type="file"
                ref={(el) => (fileInputsRef.current['mainImage1'] = el)}
                onChange={(e) => handleImageUpdate("mainImage1", e)}
                className="hidden"
              />
              <img
                src={showReference ? "./hero.png" : content.mainImage1}
                className="max-h-full object-contain p-2"
                alt="Hero"
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <HiOutlineUpload className="text-cyan-400 text-2xl" />
                </div>
              )}
            </div>
          </div>
          <div className="relative">
            <div className="flex items-center justify-between">
              <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">
                Image 2
              </label>
              {isEditing && onBrowseLibrary && (
                <button
                  onClick={() => onBrowseLibrary("mainImage2")}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg hover:bg-green-500/30 transition-all"
                >
                  <HiOutlineViewGridAdd className="text-sm" />
                </button>
              )}
            </div>
            <div
              onClick={() => isEditing && fileInputsRef.current['mainImage2']?.click()}
              className={`relative border-2 border-dashed rounded-2xl h-full min-h-[200px] max-h-[320px] flex items-center justify-center bg-black/20 overflow-hidden ${
                isEditing
                  ? "border-cyan-500 cursor-pointer group"
                  : "border-gray-800"
              }`}
            >
              <input
                type="file"
                ref={(el) => (fileInputsRef.current['mainImage2'] = el)}
                onChange={(e) => handleImageUpdate("mainImage2", e)}
                className="hidden"
              />
              <img
                src={showReference ? "./hero.png" : content.mainImage2}
                className="max-h-full object-contain p-2"
                alt="Hero"
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <HiOutlineUpload className="text-cyan-400 text-2xl" />
                </div>
              )}
            </div>
          </div>
          <div className="relative">
            <div className="flex items-center justify-between">
              <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">
                Image 4
              </label>
              {isEditing && onBrowseLibrary && (
                <button
                  onClick={() => onBrowseLibrary("mainImage4")}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg hover:bg-green-500/30 transition-all"
                >
                  <HiOutlineViewGridAdd className="text-sm" />
                </button>
              )}
            </div>
            <div
              onClick={() => isEditing && fileInputsRef.current['mainImage4']?.click()}
              className={`relative border-2 border-dashed rounded-2xl h-full min-h-[200px] max-h-[320px] flex items-center justify-center bg-black/20 overflow-hidden ${
                isEditing
                  ? "border-cyan-500 cursor-pointer group"
                  : "border-gray-800"
              }`}
            >
              <input
                type="file"
                ref={(el) => (fileInputsRef.current['mainImage4'] = el)}
                onChange={(e) => handleImageUpdate("mainImage4", e)}
                className="hidden"
              />
              <img
                src={showReference ? "./hero.png" : content.mainImage4}
                className="max-h-full object-contain p-2"
                alt="Hero"
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <HiOutlineUpload className="text-cyan-400 text-2xl" />
                </div>
              )}
            </div>
          </div>
          <div className="relative">
            <div className="flex items-center justify-between">
              <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">
                Image 3
              </label>
              {isEditing && onBrowseLibrary && (
                <button
                  onClick={() => onBrowseLibrary("mainImage3")}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg hover:bg-green-500/30 transition-all"
                >
                  <HiOutlineViewGridAdd className="text-sm" />
                </button>
              )}
            </div>
            <div
              onClick={() => isEditing && fileInputsRef.current['mainImage3']?.click()}
              className={`relative border-2 border-dashed rounded-2xl h-full min-h-[200px] max-h-[320px] flex items-center justify-center bg-black/20 overflow-hidden ${
                isEditing
                  ? "border-cyan-500 cursor-pointer group"
                  : "border-gray-800"
              }`}
            >
              <input
                type="file"
                ref={(el) => (fileInputsRef.current['mainImage3'] = el)}
                onChange={(e) => handleImageUpdate("mainImage3", e)}
                className="hidden"
              />
              <img
                src={showReference ? "./hero.png" : content.mainImage3}
                className="max-h-full object-contain p-2"
                alt="Hero"
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <HiOutlineUpload className="text-cyan-400 text-2xl" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- FULL PREVIEW SECTION (Only when NOT editing) --- */}
      {!isEditing && (
        <div className="border-t border-gray-800 pt-6">
          <h3 className="text-sm font-bold text-cyan-400 mb-4">Preview</h3>
          <div className="bg-gray-900/50 rounded-xl p-6 space-y-4">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">{content.tag}</p>
              <h2 className="text-2xl font-bold text-white mb-3">{content.heading}</h2>
              <p className="text-sm text-gray-300 leading-relaxed mb-4">{content.desc}</p>
              <button className="px-6 py-2 bg-cyan-500 text-black font-bold rounded-lg text-sm hover:bg-cyan-400 transition-all">
                {content.ctaText}
              </button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <img src={content.mainImage1} alt="Image 1" className="w-full h-40 object-cover rounded-lg" />
              <img src={content.mainImage2} alt="Image 2" className="w-full h-40 object-cover rounded-lg" />
              <img src={content.mainImage3} alt="Image 3" className="w-full h-40 object-cover rounded-lg" />
              <img src={content.mainImage4} alt="Image 4" className="w-full h-40 object-cover rounded-lg" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgencyBooks;
