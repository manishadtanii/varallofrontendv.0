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

const WhatWeOffer = ({ sectionData, onSave, onBrowseLibrary }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showReference, setShowReference] = useState(false);
  const fileInputsRef = useRef({});

  console.log("WhatWeOffer sectionData:", sectionData);

  // Map backend items[] array to local state fields
  const mapSectionToContent = (sd) => {
    const items = sd?.items || [];
    return {
      heading: sd?.title || "What We Offer",
      c1_title: items[0]?.heading || "End-to-End Scheduling & Communication Management",
      c1_desc: items[0]?.description || "We handle scheduling, resource calendar coordination, email monitoring, and phone answering, ensuring your agency runs smoothly and stays responsive.",
      c1_img: items[0]?.icon || "./wwo-icon/m1.png",

      c2_title: items[1]?.heading || "Meticulous Transcript & Exhibit Processing",
      c2_desc: items[1]?.description || "From accurate transcript formatting to exhibit marking, printing, binding, and final delivery, we manage it all with precision and speed.",
      c2_img: items[1]?.icon || "./wwo-icon/m2.png",

      c3_title: items[2]?.heading || "Streamlined Invoicing & Collections",
      c3_desc: items[2]?.description || "Get paid on time with professional invoice generation, client billing follow-ups, and efficient collections support.",
      c3_img: items[2]?.icon || "./wwo-icon/m3.png",

      c4_title: items[3]?.heading || "Accurate Payroll & Bookkeeping",
      c4_desc: items[3]?.description || "We process reporter payments and manage day-to-day bookkeeping, helping you maintain financial clarity and control.",
      c4_img: items[3]?.icon || "./wwo-icon/m4.png",
    };
  };

  const [content, setContent] = useState(mapSectionToContent(sectionData));

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
  };

  useEffect(() => {
    const handler = (e) => {
      const { fieldName, imageUrl } = e?.detail || {};
      if (!fieldName || !imageUrl) return;
      console.log(`🖼️ WhatWeOffer image selected for ${fieldName}:`, imageUrl);
      setContent((prev) => ({ ...prev, [fieldName]: imageUrl }));
    };

    window.addEventListener('imageSelected', handler);
    return () => window.removeEventListener('imageSelected', handler);
  }, []);

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
                    toast.loading('Uploading images...', { id: 'upload-wwo' });
                    const keys = ['c1_img', 'c2_img', 'c3_img', 'c4_img'];
                    for (const k of keys) {
                      const fileKey = `${k}File`;
                      const f = content[fileKey];
                      if (f && f instanceof File) {
                        const res = await uploadAPI.uploadImage(f, 'tvgEffect', 'tvg-management');
                        setContent((prev) => ({ ...prev, [k]: res.url, [fileKey]: null }));
                        content[k] = res.url;
                        content[fileKey] = null;
                      }
                    }
                    toast.success('Images uploaded', { id: 'upload-wwo' });

                    const payload = {
                      title: content.heading,
                      items: [
                        { heading: content.c1_title, description: content.c1_desc, icon: content.c1_img },
                        { heading: content.c2_title, description: content.c2_desc, icon: content.c2_img },
                        { heading: content.c3_title, description: content.c3_desc, icon: content.c3_img },
                        { heading: content.c4_title, description: content.c4_desc, icon: content.c4_img },
                      ]
                    };

                    console.log('💾 WhatWeOffer final payload:', payload);

                    await onSave(payload);
                    setIsEditing(false);
                  } catch (err) {
                    console.error('❌ Error uploading/saving WhatWeOffer:', err);
                    toast.error('Failed to upload or save');
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
      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">
          Main Heading
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
      {/* --- HARDCODED CARDS (2x2) --- */}
      <div className="">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* CARD 1 */}
          <div
            className={`bg-[#0b1318] border rounded-2xl p-5 flex flex-col gap-5 ${
              isEditing ? "border-cyan-400/30" : "border-gray-800"
            }`}
          >
          <div className="relative">
            <div className="flex items-center justify-between">
              <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Image</label>
              {isEditing && onBrowseLibrary && (
                <button
                  onClick={() => onBrowseLibrary("c1_img")}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg hover:bg-green-500/30 transition-all"
                >
                  <HiOutlineViewGridAdd className="text-sm" />
                </button>
              )}
            </div>
            <div className="relative w-100 h-28 flex-shrink-0 bg-black rounded-xl overflow-hidden group">
              <img
                src={showReference ? "./ab-1.png" : content.c1_img}
                className="w-full h-full object-cover"
                alt=""
              />
              {isEditing && (
                <label className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    ref={(el) => (fileInputsRef.current['c1_img'] = el)}
                    onChange={(e) => handleImageUpdate("c1_img", e)}
                  />
                  <HiOutlineUpload className="text-cyan-400 text-2xl" />
                </label>
              )}
            </div>
          </div>
            <div className="flex flex-col gap-2 flex-1">
              <input
                disabled={!isEditing}
                name="c1_title"
                value={content.c1_title}
                onChange={handleChange}
                placeholder="Title"
                className="bg-transparent border-b border-gray-800 text-sm font-bold outline-none text-white focus:border-cyan-400"
              />
              <textarea
                disabled={!isEditing}
                name="c1_desc"
                value={content.c1_desc}
                onChange={handleChange}
                placeholder="Desc"
                rows="2"
                className="bg-transparent border border-gray-800 rounded-lg p-2 text-[11px] outline-none text-gray-400"
              />
              {/* <input disabled={!isEditing} name="c1_cta_text" value={content.c1_cta_text} onChange={handleChange} placeholder="Link" className="bg-transparent border border-gray-800 rounded-lg px-2 py-1 text-[10px] outline-none text-gray-400" />
              <input disabled={!isEditing} name="c1_cta_link" value={content.c1_cta_link} onChange={handleChange} placeholder="Link" className="bg-transparent border border-gray-800 rounded-lg px-2 py-1 text-[10px] outline-none text-gray-400" /> */}
            </div>
          </div>

          {/* CARD 2 */}
          <div
            className={`bg-[#0b1318] border rounded-2xl p-5 flex flex-col gap-5 ${
              isEditing ? "border-cyan-400/30" : "border-gray-800"
            }`}
          >
          <div className="relative">
            <div className="flex items-center justify-between">
              <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Image</label>
              {isEditing && onBrowseLibrary && (
                <button
                  onClick={() => onBrowseLibrary("c2_img")}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg hover:bg-green-500/30 transition-all"
                >
                  <HiOutlineViewGridAdd className="text-sm" />
                </button>
              )}
            </div>
            <div className="relative w-100 h-28 flex-shrink-0 bg-black rounded-xl overflow-hidden group">
              <img
                src={showReference ? "./ab-2.png" : content.c2_img}
                className="w-full h-full object-cover"
                alt=""
              />
              {isEditing && (
                <label className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    ref={(el) => (fileInputsRef.current['c2_img'] = el)}
                    onChange={(e) => handleImageUpdate("c2_img", e)}
                  />
                  <HiOutlineUpload className="text-cyan-400 text-2xl" />
                </label>
              )}
            </div>
          </div>
            <div className="flex flex-col gap-2 flex-1">
              <input
                disabled={!isEditing}
                name="c2_title"
                value={content.c2_title}
                onChange={handleChange}
                placeholder="Title"
                className="bg-transparent border-b border-gray-800 text-sm font-bold outline-none text-white focus:border-cyan-400"
              />
              <textarea
                disabled={!isEditing}
                name="c2_desc"
                value={content.c2_desc}
                onChange={handleChange}
                placeholder="Desc"
                rows="2"
                className="bg-transparent border border-gray-800 rounded-lg p-2 text-[11px] outline-none text-gray-400"
              />
              {/* <input disabled={!isEditing} name="c1_cta_text" value={content.c1_cta_text} onChange={handleChange} placeholder="Link" className="bg-transparent border border-gray-800 rounded-lg px-2 py-1 text-[10px] outline-none text-gray-400" />
              <input disabled={!isEditing} name="c1_cta_link" value={content.c1_cta_link} onChange={handleChange} placeholder="Link" className="bg-transparent border border-gray-800 rounded-lg px-2 py-1 text-[10px] outline-none text-gray-400" /> */}
            </div>
          </div>

          {/* CARD 3 */}
          <div
            className={`bg-[#0b1318] border rounded-2xl p-5 flex flex-col gap-5 ${
              isEditing ? "border-cyan-400/30" : "border-gray-800"
            }`}
          >
            <div className="relative">
              <div className="flex items-center justify-between">
                <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Image</label>
                {isEditing && onBrowseLibrary && (
                  <button
                    onClick={() => onBrowseLibrary("c3_img")}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg hover:bg-green-500/30 transition-all"
                  >
                    <HiOutlineViewGridAdd className="text-sm" />
                  </button>
                )}
              </div>
              <div className="relative w-100 h-28 flex-shrink-0 bg-black rounded-xl overflow-hidden group">
                <img
                  src={showReference ? "./ab-3.png" : content.c3_img}
                  className="w-full h-full object-cover"
                  alt=""
                />
                {isEditing && (
                  <label className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      ref={(el) => (fileInputsRef.current['c3_img'] = el)}
                      onChange={(e) => handleImageUpdate("c3_img", e)}
                    />
                    <HiOutlineUpload className="text-cyan-400 text-2xl" />
                  </label>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <input
                disabled={!isEditing}
                name="c3_title"
                value={content.c3_title}
                onChange={handleChange}
                placeholder="Title"
                className="bg-transparent border-b border-gray-800 text-sm font-bold outline-none text-white focus:border-cyan-400"
              />
              <textarea
                disabled={!isEditing}
                name="c3_desc"
                value={content.c3_desc}
                onChange={handleChange}
                placeholder="Desc"
                rows="2"
                className="bg-transparent border border-gray-800 rounded-lg p-2 text-[11px] outline-none text-gray-400"
              />
            </div>
          </div>

          {/* CARD 4 */}
          <div
            className={`bg-[#0b1318] border rounded-2xl p-5 flex flex-col gap-5 ${
              isEditing ? "border-cyan-400/30" : "border-gray-800"
            }`}
          >
            <div className="relative">
              <div className="flex items-center justify-between">
                <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Image</label>
                {isEditing && onBrowseLibrary && (
                  <button
                    onClick={() => onBrowseLibrary("c4_img")}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg hover:bg-green-500/30 transition-all"
                  >
                    <HiOutlineViewGridAdd className="text-sm" />
                  </button>
                )}
              </div>
              <div className="relative w-100 h-28 flex-shrink-0 bg-black rounded-xl overflow-hidden group">
                <img
                  src={showReference ? "./ab-4.png" : content.c4_img}
                  className="w-full h-full object-cover"
                  alt=""
                />
                {isEditing && (
                  <label className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      ref={(el) => (fileInputsRef.current['c4_img'] = el)}
                      onChange={(e) => handleImageUpdate("c4_img", e)}
                    />
                    <HiOutlineUpload className="text-cyan-400 text-2xl" />
                  </label>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <input
                disabled={!isEditing}
                name="c4_title"
                value={content.c4_title}
                onChange={handleChange}
                placeholder="Title"
                className="bg-transparent border-b border-gray-800 text-sm font-bold outline-none text-white focus:border-cyan-400"
              />
              <textarea
                disabled={!isEditing}
                name="c4_desc"
                value={content.c4_desc}
                onChange={handleChange}
                placeholder="Desc"
                rows="2"
                className="bg-transparent border border-gray-800 rounded-lg p-2 text-[11px] outline-none text-gray-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- FULL PREVIEW SECTION (Only when NOT editing) --- */}
      {!isEditing && (
        <div className="border-t border-gray-800 pt-6">
          <h3 className="text-sm font-bold text-cyan-400 mb-4">Preview</h3>
          <div className="bg-gray-900/50 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">{content.heading}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* CARD 1 */}
              <div className="bg-[#0b1318] border border-gray-800 rounded-2xl p-5 flex flex-col gap-4">
                <img src={content.c1_img} alt={content.c1_title} className="w-full h-28 object-cover rounded-lg" />
                <div>
                  <h3 className="text-sm font-bold text-white mb-2">{content.c1_title}</h3>
                  <p className="text-xs text-gray-400">{content.c1_desc}</p>
                </div>
              </div>

              {/* CARD 2 */}
              <div className="bg-[#0b1318] border border-gray-800 rounded-2xl p-5 flex flex-col gap-4">
                <img src={content.c2_img} alt={content.c2_title} className="w-full h-28 object-cover rounded-lg" />
                <div>
                  <h3 className="text-sm font-bold text-white mb-2">{content.c2_title}</h3>
                  <p className="text-xs text-gray-400">{content.c2_desc}</p>
                </div>
              </div>

              {/* CARD 3 */}
              <div className="bg-[#0b1318] border border-gray-800 rounded-2xl p-5 flex flex-col gap-4">
                <img src={content.c3_img} alt={content.c3_title} className="w-full h-28 object-cover rounded-lg" />
                <div>
                  <h3 className="text-sm font-bold text-white mb-2">{content.c3_title}</h3>
                  <p className="text-xs text-gray-400">{content.c3_desc}</p>
                </div>
              </div>

              {/* CARD 4 */}
              <div className="bg-[#0b1318] border border-gray-800 rounded-2xl p-5 flex flex-col gap-4">
                <img src={content.c4_img} alt={content.c4_title} className="w-full h-28 object-cover rounded-lg" />
                <div>
                  <h3 className="text-sm font-bold text-white mb-2">{content.c4_title}</h3>
                  <p className="text-xs text-gray-400">{content.c4_desc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatWeOffer;
