import React, { useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { HiOutlineUpload, HiOutlineSave, HiOutlinePencilAlt, HiOutlineX, HiOutlineViewGridAdd } from "react-icons/hi";

const WhatWeProvide = ({ sectionData, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showReference, setShowReference] = useState(false);
  const mainFileRef = useRef(null);

  // Map backend data to local state
  const mapSectionToContent = (sd) => ({
    heading: sd?.title || sd?.heading || "What We Provide",
    para: sd?.para || sd?.subtext || "We manage your back office so you can focus on delivering top-tier client service. From scheduling to payroll, we streamline the chaos behind the scenes.",
    wwp1: sd?.wwp1 || "Client Onboarding Assistance",
    wwp2: sd?.wwp2 || "Vendor Coordination",
    wwp3: sd?.wwp3 || "Transcript & Exhibit Handling",
    wwp4: sd?.wwp4 || "Billing, Collections & Payroll",
    wwp5: sd?.wwp5 || "Branding & Marketing Help",
    tagsLeft: sd?.tagsLeft || [
      { text: "Vendor Coordination" },
      { text: "Branding & Marketing Help" },
      { text: "Client Onboarding Assistance" },
      { text: "Branding & Marketing Help" },
      { text: "Vendor Coordination" },
      { text: "Transcript & Exhibit Handling" },
    ],
    tagsRight: sd?.tagsRight || [
      { text: "Billing, Collections & Payroll" },
      { text: "Transcript & Exhibit Handling" },
      { text: "Vendor Coordination" },
      { text: "Branding & Marketing Help" },
      { text: "Client Onboarding Assistance" },
      { text: "Branding & Marketing Help" },
    ],
  });

  console.log("WhatWeProvide sectionData:", sectionData);
  
  // State initialized with individual keys for absolute clarity
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

   const handleImageUpdate = (key, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const maxSize = 1 * 1024 * 1024; // 1MB
    if (file.size > maxSize) {
      toast.error("File size must be less than 1MB");
      return;
    }
    const url = URL.createObjectURL(file);
    setContent(prev => ({ ...prev, [key]: url, [`${key}File`]: file }));
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
                  const payload = {
                    title: content.heading,
                    para: content.para,
                    wwp1: content.wwp1,
                    wwp2: content.wwp2,
                    wwp3: content.wwp3,
                    wwp4: content.wwp4,
                    wwp5: content.wwp5,
                    tagsLeft: content.tagsLeft,
                    tagsRight: content.tagsRight,
                  };
                  console.log('💾 WhatWeProvide final payload:', payload);
                  await onSave(payload);
                  setIsEditing(false);
                }}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black px-6 py-2 rounded-full font-bold transition-all shadow-lg"
              >
                <HiOutlineSave /> SAVE
              </button>
            </>
          )}
        </div>
      </div>

      {/* --- MAIN SECTION --- */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Main Heading</label>
            <input disabled={!isEditing} name="heading" value={content.heading} placeholder="" onChange={handleChange} className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${isEditing ? 'border-cyan-400' : 'border-gray-800 text-gray-400'}`} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Paragraph Text</label>
            <textarea disabled={!isEditing} name="para" value={content.para} placeholder="" onChange={handleChange} rows="2" className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${isEditing ? 'border-cyan-400' : 'border-gray-800 text-gray-400'}`} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tags Left */}
            <div className="flex flex-col gap-3">
              <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Tags Left (6 items)</label>
              <div className="space-y-2">
                {content.tagsLeft?.map((tag, idx) => (
                  <input
                    key={`tagsLeft-${idx}`}
                    disabled={!isEditing}
                    value={tag?.text || ""}
                    onChange={(e) => handleTagChange("tagsLeft", idx, e.target.value)}
                    placeholder={`Tag ${idx + 1}`}
                    className={`w-full bg-transparent border rounded-lg px-4 py-2 outline-none transition-all ${
                      isEditing ? "border-cyan-400" : "border-gray-800 text-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Tags Right */}
            <div className="flex flex-col gap-3">
              <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Tags Right (6 items)</label>
              <div className="space-y-2">
                {content.tagsRight?.map((tag, idx) => (
                  <input
                    key={`tagsRight-${idx}`}
                    disabled={!isEditing}
                    value={tag?.text || ""}
                    onChange={(e) => handleTagChange("tagsRight", idx, e.target.value)}
                    placeholder={`Tag ${idx + 1}`}
                    className={`w-full bg-transparent border rounded-lg px-4 py-2 outline-none transition-all ${
                      isEditing ? "border-cyan-400" : "border-gray-800 text-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- FULL PREVIEW SECTION (Only when NOT editing) --- */}
      {!isEditing && (
        <div className="border-t border-gray-800 pt-6">
          <h3 className="text-sm font-bold text-cyan-400 mb-4">Preview</h3>
          <div className="bg-gray-900/50 rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{content.heading}</h2>
              <p className="text-sm text-gray-300 leading-relaxed">{content.para}</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tags Left Column */}
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase mb-3">Left Column Tags</p>
                <div className="flex flex-wrap gap-2">
                  {content.tagsLeft?.map((tag, idx) => (
                    <span key={idx} className="px-3 py-2 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 rounded-lg text-xs">
                      {tag?.text}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tags Right Column */}
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase mb-3">Right Column Tags</p>
                <div className="flex flex-wrap gap-2">
                  {content.tagsRight?.map((tag, idx) => (
                    <span key={idx} className="px-3 py-2 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 rounded-lg text-xs">
                      {tag?.text}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatWeProvide;