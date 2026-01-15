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

const BooksWhatWeOffer = ({ sectionData, onSave, onBrowseLibrary }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showReference, setShowReference] = useState(false);
  const fileInputsRef = useRef({});

  console.log("BooksWhatWeOffer sectionData:", sectionData);

  // Map backend items[] array to local state fields for 4 items (books has 4 items)
  const mapSectionToContent = (sd) => {
    const items = sd?.items || [];
    return {
      heading: sd?.title || "What We Offer",
      c1_title: items[0]?.heading || "Bookkeeping (QuickBooks Specialists)",
      c1_desc: items[0]?.description || "We handle the day-to-day financial entries so you don't have to.",
      c1_img: items[0]?.icon || "./wwo-icon/books/1.png",

      c2_title: items[1]?.heading || "Client Billing and Invoicing",
      c2_desc: items[1]?.description || "Never miss a payment. We streamline your client billing process.",
      c2_img: items[1]?.icon || "./wwo-icon/books/2.png",

      c3_title: items[2]?.heading || "Annual Filings and Basic Compliance Support",
      c3_desc: items[2]?.description || "Tax season doesn't have to be stressful. We prepare and manage annual financial documents.",
      c3_img: items[2]?.icon || "./wwo-icon/books/3.png",

      c4_title: items[3]?.heading || "Financial Reporting",
      c4_desc: items[3]?.description || "Make confident business decisions with reports that actually make sense.",
      c4_img: items[3]?.icon || "./wwo-icon/books/4.png",
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
    const maxSize = 1 * 1024 * 1024;
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
      console.log(`🖼️ BooksWhatWeOffer image selected for ${fieldName}:`, imageUrl);
      setContent((prev) => ({ ...prev, [fieldName]: imageUrl }));
    };

    window.addEventListener('imageSelected', handler);
    return () => window.removeEventListener('imageSelected', handler);
  }, []);

  return (
    <div className="flex flex-col gap-8 font-manrope">
      <Toaster />
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
                        const res = await uploadAPI.uploadImage(f, 'tvgEffect', 'tvg-books');
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

                    console.log('💾 BooksWhatWeOffer final payload:', payload);

                    await onSave(payload);
                    setIsEditing(false);
                  } catch (err) {
                    console.error('❌ Error uploading/saving BooksWhatWeOffer:', err);
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
      </div>

      {/* 4-Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((num) => (
          <div key={num} className="flex flex-col gap-3 bg-gray-900/30 p-4 rounded-xl border border-gray-800">
            <div className="flex items-center justify-between">
              <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">
                Card {num} Icon
              </label>
              {isEditing && onBrowseLibrary && (
                <button
                  onClick={() => onBrowseLibrary(`c${num}_img`)}
                  className="flex items-center gap-2 px-2 py-1 text-xs bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg hover:bg-green-500/30 transition-all"
                >
                  <HiOutlineViewGridAdd className="text-xs" />
                </button>
              )}
            </div>
            <div
              onClick={() => isEditing && fileInputsRef.current[`c${num}_img`]?.click()}
              className={`relative border-2 border-dashed rounded-lg h-24 flex items-center justify-center bg-black/20 overflow-hidden ${
                isEditing ? "border-cyan-500 cursor-pointer group" : "border-gray-800"
              }`}
            >
              <input
                type="file"
                ref={(el) => (fileInputsRef.current[`c${num}_img`] = el)}
                onChange={(e) => handleImageUpdate(`c${num}_img`, e)}
                className="hidden"
              />
              <img
                src={content[`c${num}_img`]}
                className="h-full object-contain p-1"
                alt={`Card ${num}`}
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <HiOutlineUpload className="text-cyan-400 text-lg" />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] text-gray-500 font-bold uppercase ml-1">Title</label>
              <input
                disabled={!isEditing}
                name={`c${num}_title`}
                value={content[`c${num}_title`]}
                onChange={handleChange}
                className={`w-full bg-transparent border rounded-lg px-3 py-1.5 text-xs outline-none transition-all ${
                  isEditing ? "border-cyan-400" : "border-gray-800 text-gray-400"
                }`}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] text-gray-500 font-bold uppercase ml-1">Description</label>
              <textarea
                disabled={!isEditing}
                name={`c${num}_desc`}
                value={content[`c${num}_desc`]}
                onChange={handleChange}
                rows="3"
                className={`w-full bg-transparent border rounded-lg px-3 py-1.5 text-xs outline-none transition-all ${
                  isEditing ? "border-cyan-400" : "border-gray-800 text-gray-400"
                }`}
              />
            </div>
          </div>
        ))}
      </div>

      {!isEditing && (
        <div className="border-t border-gray-800 pt-6">
          <h3 className="text-sm font-bold text-cyan-400 mb-4">Preview</h3>
          <div className="bg-gray-900/50 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">{content.heading}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <img src={content[`c${num}_img`]} alt={`Card ${num}`} className="w-full h-32 object-contain mb-3" />
                  <h3 className="text-sm font-bold text-cyan-400 mb-2">{content[`c${num}_title`]}</h3>
                  <p className="text-xs text-gray-300">{content[`c${num}_desc`]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BooksWhatWeOffer;
