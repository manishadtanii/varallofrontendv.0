import React, { useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { HiOutlineUpload, HiOutlineSave, HiOutlinePencilAlt, HiOutlineX } from "react-icons/hi";

const WhatWeProvide = ({ sectionData, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showReference, setShowReference] = useState(false);
  const mainFileRef = useRef(null);

  // Map backend data to local state
  const mapSectionToContent = (sd) => ({
    heading: sd?.title || sd?.heading || "What We Provide",
    para: sd?.para || sd?.subtext || "We are your remote deposition and trial presentation experts. We manage the tech so your proceedings run smoothly, securely, and professionally.",
    tagsLeft: sd?.tagsLeft || [
      { text: "Session-Sharing & Audio Testing" },
      { text: "Session Recording & Storage" },
      { text: "Trial Technician" },
      { text: "Hot-Seat Operation" },
      { text: "Full Remote Deposition Setup" },
      { text: "Live Trial Assistance & Broadcasting" },
    ],
    tagsRight: sd?.tagsRight || [
      { text: "Full Remote Deposition Setup" },
      { text: "Hot-Start Operation" },
      { text: "Trial Technician" },
      { text: "Session Recording & Storage" },
      { text: "Session-Sharing & Audio Testing" },
      { text: "Live Trial Assistance & Broadcasting" },
    ],
  });

  console.log("WhatWeProvide sectionData:", sectionData);
  
  const [content, setContent] = useState(mapSectionToContent(sectionData));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContent((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagChange = (side, index, value) => {
    setContent((prev) => {
      const updated = { ...prev };
      updated[side][index].text = value;
      return updated;
    });
  };

  const handleCancel = () => {
    setContent(mapSectionToContent(sectionData));
    setIsEditing(false);
    toast.success("Changes discarded");
  };

  return (
    <div className="flex flex-col gap-8 font-manrope">
      <Toaster />
      
      <div className="flex justify-between items-center border-b border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-cyan-400 uppercase tracking-wider">What We Provide Editor</h2>
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
                    const payload = {
                      title: content.heading,
                      para: content.para,
                      tagsLeft: content.tagsLeft,
                      tagsRight: content.tagsRight,
                    };
                    console.log('💾 WhatWeProvide final payload:', payload);
                    await onSave(payload);
                    setIsEditing(false);
                    toast.success("Saved successfully!");
                  } catch (err) {
                    console.error('❌ Error saving WhatWeProvide:', err);
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

        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Paragraph</label>
          <textarea
            disabled={!isEditing}
            name="para"
            value={content.para}
            onChange={handleChange}
            rows="3"
            className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${
              isEditing ? "border-cyan-400" : "border-gray-800 text-gray-400"
            }`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-bold text-cyan-400">Left Column Tags</h3>
          {content.tagsLeft.map((tag, index) => (
            <input
              key={index}
              disabled={!isEditing}
              value={tag.text}
              onChange={(e) => handleTagChange('tagsLeft', index, e.target.value)}
              placeholder={`Tag ${index + 1}`}
              className={`w-full bg-transparent border rounded-lg px-3 py-2 text-sm outline-none transition-all ${
                isEditing ? "border-cyan-400" : "border-gray-800 text-gray-400"
              }`}
            />
          ))}
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-bold text-cyan-400">Right Column Tags</h3>
          {content.tagsRight.map((tag, index) => (
            <input
              key={index}
              disabled={!isEditing}
              value={tag.text}
              onChange={(e) => handleTagChange('tagsRight', index, e.target.value)}
              placeholder={`Tag ${index + 1}`}
              className={`w-full bg-transparent border rounded-lg px-3 py-2 text-sm outline-none transition-all ${
                isEditing ? "border-cyan-400" : "border-gray-800 text-gray-400"
              }`}
            />
          ))}
        </div>
      </div>

      {!isEditing && (
        <div className="border-t border-gray-800 pt-6">
          <h3 className="text-sm font-bold text-cyan-400 mb-4">Preview</h3>
          <div className="bg-gray-900/50 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-2">{content.heading}</h2>
            <p className="text-sm text-gray-300 mb-6">{content.para}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                {content.tagsLeft.map((tag, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400 text-sm"
                  >
                    {tag.text}
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {content.tagsRight.map((tag, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400 text-sm"
                  >
                    {tag.text}
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

export default WhatWeProvide;
