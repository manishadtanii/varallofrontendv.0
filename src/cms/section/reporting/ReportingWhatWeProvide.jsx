import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  HiOutlineSave,
  HiOutlinePencilAlt,
  HiOutlineX,
  HiOutlineTrash,
  HiOutlinePlus,
} from "react-icons/hi";

const ReportingWhatWeProvide = ({ sectionData, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);

  console.log("ReportingWhatWeProvide sectionData:", sectionData);

  const normalizeTags = (tagsArray) => {
    if (!Array.isArray(tagsArray)) return [];
    return tagsArray.map((tag) =>
      typeof tag === "string" ? { text: tag } : tag
    );
  };

  const mapSectionToContent = (sd) => ({
    heading: sd?.title || "What We Provide",
    para: sd?.para || "Comprehensive reporting solutions for your organization.",
    tagsLeft: normalizeTags(sd?.tagsLeft || []),
    tagsRight: normalizeTags(sd?.tagsRight || []),
  });

  const [content, setContent] = useState(mapSectionToContent(sectionData));

  React.useEffect(() => {
    console.log('📌 ReportingWhatWeProvide received sectionData:', sectionData);
    const mapped = mapSectionToContent(sectionData);
    console.log('✅ Mapped content with normalized tags:', {
      heading: mapped.heading,
      para: mapped.para?.substring(0, 50) + '...',
      tagsLeft: mapped.tagsLeft,
      tagsRight: mapped.tagsRight
    });
    setContent(mapped);
  }, [sectionData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContent((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagChange = (side, index, value) => {
    setContent((prev) => {
      const tags = [...prev[side]];
      tags[index] = { text: value };
      return { ...prev, [side]: tags };
    });
  };

  const addTag = (side) => {
    setContent((prev) => ({
      ...prev,
      [side]: [...prev[side], { text: "" }],
    }));
  };

  const deleteTag = (side, index) => {
    setContent((prev) => ({
      ...prev,
      [side]: prev[side].filter((_, i) => i !== index),
    }));
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
        <h2 className="text-xl font-bold text-cyan-400 uppercase tracking-wider">
          What We Provide
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
                onClick={async () => {
                  try {
                    const payload = {
                      title: content.heading,
                      para: content.para,
                      tagsLeft: content.tagsLeft.map((tag) => tag.text).filter(Boolean),
                      tagsRight: content.tagsRight.map((tag) => tag.text).filter(Boolean),
                    };

                    console.log('💾 ReportingWhatWeProvide final payload:', payload);
                    await onSave(payload);
                    setIsEditing(false);
                    toast.success("Saved successfully");
                  } catch (err) {
                    console.error('❌ Error saving:', err);
                    toast.error("Failed to save");
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

      {/* --- TEXT FIELDS --- */}
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
            Paragraph
          </label>
          <textarea
            disabled={!isEditing}
            name="para"
            value={content.para}
            placeholder=""
            onChange={handleChange}
            rows="3"
            className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${
              isEditing ? "border-cyan-400" : "border-gray-800 text-gray-400"
            }`}
          />
        </div>
      </div>

      {/* --- TWO-COLUMN TAG LAYOUT --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* LEFT TAGS */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <label className="text-[10px] text-gray-500 font-bold uppercase">
              Left Tags
            </label>
            {isEditing && (
              <button
                onClick={() => addTag("tagsLeft")}
                className="flex items-center gap-2 px-3 py-1.5 text-xs bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all"
              >
                <HiOutlinePlus className="text-sm" /> Add
              </button>
            )}
          </div>
          <div className="flex flex-col gap-2">
            {content.tagsLeft.map((tag, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  disabled={!isEditing}
                  type="text"
                  value={tag.text}
                  onChange={(e) =>
                    handleTagChange("tagsLeft", index, e.target.value)
                  }
                  placeholder="Enter tag"
                  className={`flex-1 bg-transparent border rounded-xl px-4 py-2 outline-none transition-all text-sm ${
                    isEditing
                      ? "border-cyan-400"
                      : "border-gray-800 text-gray-400"
                  }`}
                />
                {isEditing && (
                  <button
                    onClick={() => deleteTag("tagsLeft", index)}
                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
                  >
                    <HiOutlineTrash className="text-sm" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT TAGS */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <label className="text-[10px] text-gray-500 font-bold uppercase">
              Right Tags
            </label>
            {isEditing && (
              <button
                onClick={() => addTag("tagsRight")}
                className="flex items-center gap-2 px-3 py-1.5 text-xs bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all"
              >
                <HiOutlinePlus className="text-sm" /> Add
              </button>
            )}
          </div>
          <div className="flex flex-col gap-2">
            {content.tagsRight.map((tag, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  disabled={!isEditing}
                  type="text"
                  value={tag.text}
                  onChange={(e) =>
                    handleTagChange("tagsRight", index, e.target.value)
                  }
                  placeholder="Enter tag"
                  className={`flex-1 bg-transparent border rounded-xl px-4 py-2 outline-none transition-all text-sm ${
                    isEditing
                      ? "border-cyan-400"
                      : "border-gray-800 text-gray-400"
                  }`}
                />
                {isEditing && (
                  <button
                    onClick={() => deleteTag("tagsRight", index)}
                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
                  >
                    <HiOutlineTrash className="text-sm" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- FULL PREVIEW SECTION (Only when NOT editing) --- */}
      {!isEditing && (
        <div className="border-t border-gray-800 pt-6">
          <h3 className="text-sm font-bold text-cyan-400 mb-4">Preview</h3>
          <div className="bg-gray-900/50 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-3">{content.heading}</h2>
            <p className="text-sm text-gray-300 leading-relaxed mb-6">{content.para}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-wrap gap-2">
                {content.tagsLeft.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 rounded-full text-sm"
                  >
                    {tag.text}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {content.tagsRight.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 rounded-full text-sm"
                  >
                    {tag.text}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportingWhatWeProvide;
