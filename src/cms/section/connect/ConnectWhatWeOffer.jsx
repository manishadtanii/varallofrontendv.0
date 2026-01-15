import React, { useState, useRef } from "react";
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

const ConnectWhatWeOffer = ({ sectionData, onSave, onBrowseLibrary }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showReference, setShowReference] = useState(false);
  const fileInputsRef = useRef({});

  console.log("ConnectWhatWeOffer sectionData:", sectionData);

  const mapSectionToContent = (sd) => {
    const items = sd?.items || [];
    const maxItems = 4;

    const c = {
      title: sd?.title || "What We Offer",
    };

    for (let i = 0; i < maxItems; i++) {
      c[`c${i + 1}Heading`] = items[i]?.heading || "";
      c[`c${i + 1}Desc`] = items[i]?.description || "";
      c[`c${i + 1}Icon`] = items[i]?.icon || "./service-icon.png";
    }

    return c;
  };

  const [content, setContent] = useState(mapSectionToContent(sectionData));

  React.useEffect(() => {
    console.log('📌 ConnectWhatWeOffer received sectionData:', sectionData);
    const mapped = mapSectionToContent(sectionData);
    console.log('📍 Mapped content:', mapped);
    setContent(mapped);
  }, [sectionData]);
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
    setIsEditing(false);
    toast.success("Changes discarded");
  };    

  console.log("ConnectWhatWeOffer content state:", content);

  return (
    <div className="flex flex-col gap-8 font-manrope">
      <Toaster />
      {/* --- HEADER --- */}
      <div className="flex justify-between items-center border-b border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-cyan-400 uppercase tracking-wider">
            What We Offer
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
                    toast.loading('Uploading icons...', { id: 'upload' });

                    const iconKeys = ['c1Icon', 'c2Icon', 'c3Icon', 'c4Icon'];
                    for (const key of iconKeys) {
                      const fileKey = `${key}File`;
                      const file = content[fileKey];
                      if (file && file instanceof File) {
                        console.log(`📤 Uploading ${file.name} for ${key}...`);
                        const res = await uploadAPI.uploadImage(file, 'tvgEffect', 'tvg-connect');
                        console.log(`✅ Uploaded for ${key}:`, res.url);
                        content[key] = res.url;
                        content[fileKey] = null;
                        setContent((prev) => ({ ...prev, [key]: res.url, [fileKey]: null }));
                      }
                    }

                    toast.success('Icons uploaded', { id: 'upload' });

                    const items = [1, 2, 3, 4]
                      .map((i) => ({
                        heading: content[`c${i}Heading`],
                        description: content[`c${i}Desc`],
                        icon: content[`c${i}Icon`],
                      }))
                      .filter((item) => item.heading && item.description);

                    const payload = {
                      title: content.title,
                      items,
                    };

                    console.log('💾 ConnectWhatWeOffer final payload:', payload);
                    await onSave(payload);
                    setIsEditing(false);
                  } catch (err) {
                    console.error('❌ Error uploading icons or saving:', err);
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

      {/* --- TITLE --- */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">
          Section Title
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

      {/* --- 4 CARD GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((num) => (
          <div
            key={num}
            className="flex flex-col gap-4 p-4 bg-gray-900/30 border border-gray-800 rounded-2xl"
          >
            <div className="flex items-center justify-between">
              <label className="text-[10px] text-gray-500 font-bold uppercase">
                Card {num} - Icon
              </label>
              {isEditing && onBrowseLibrary && (
                <button
                  onClick={() => onBrowseLibrary(`c${num}Icon`)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg hover:bg-green-500/30 transition-all"
                >
                  <HiOutlineViewGridAdd className="text-sm" />
                </button>
              )}
            </div>
            <div
              onClick={() => isEditing && fileInputsRef.current[`c${num}Icon`]?.click()}
              className={`relative border-2 border-dashed rounded-2xl h-32 flex items-center justify-center bg-black/20 overflow-hidden ${
                isEditing ? "border-cyan-500 cursor-pointer group" : "border-gray-800"
              }`}
            >
              <input
                type="file"
                ref={(el) => (fileInputsRef.current[`c${num}Icon`] = el)}
                onChange={(e) => handleImageUpdate(`c${num}Icon`, e)}
                className="hidden"
              />
              <img
                src={content[`c${num}Icon`]}
                className="max-h-full object-contain"
                alt={`Card ${num} Icon`}
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <HiOutlineUpload className="text-cyan-400 text-2xl" />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-500 font-bold uppercase">
                Card {num} - Heading
              </label>
              <input
                disabled={!isEditing}
                name={`c${num}Heading`}
                value={content[`c${num}Heading`]}
                placeholder=""
                onChange={handleChange}
                className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${
                  isEditing
                    ? "border-cyan-400"
                    : "border-gray-800 text-gray-400"
                }`}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-500 font-bold uppercase">
                Card {num} - Description
              </label>
              <textarea
                disabled={!isEditing}
                name={`c${num}Desc`}
                value={content[`c${num}Desc`]}
                placeholder=""
                onChange={handleChange}
                rows="2"
                className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${
                  isEditing
                    ? "border-cyan-400"
                    : "border-gray-800 text-gray-400"
                }`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* --- FULL PREVIEW SECTION (Only when NOT editing) --- */}
      {!isEditing && (
        <div className="border-t border-gray-800 pt-6">
          <h3 className="text-sm font-bold text-cyan-400 mb-4">Preview</h3>
          <div className="bg-gray-900/50 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-8">{content.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((num) => (
                content[`c${num}Heading`] && (
                  <div key={num} className="flex flex-col gap-4">
                    <img
                      src={content[`c${num}Icon`]}
                      alt={`Card ${num}`}
                      className="w-16 h-16 object-contain"
                    />
                    <div>
                      <h3 className="font-bold text-white mb-2">{content[`c${num}Heading`]}</h3>
                      <p className="text-sm text-gray-300">{content[`c${num}Desc`]}</p>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectWhatWeOffer;
