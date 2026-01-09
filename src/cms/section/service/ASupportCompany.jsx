import React, { useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  HiOutlineUpload,
  HiOutlineSave,
  HiOutlinePencilAlt,
  HiOutlineLockClosed,
  HiOutlineEye,
} from "react-icons/hi";

const ASupportCompany = ({ sectionData, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showReference, setShowReference] = useState(false);
  const mainFileRef = useRef(null);

  // State initialized with individual keys for absolute clarity
  const [content, setContent] = useState({
    heading:
      sectionData?.heading ||
      "A Support Company that Understands Your Business",
    subtext:
      sectionData?.subtext ||
      "At The Varallo Group, we bring together six specialized sub-brands under one clear vision. We are your single source for smarter, effective, and scalable success.",
    mainLeft: sectionData?.mainLeft || "./hero.png",
    mainCenter: sectionData?.mainCenter || "./hero.png",
    mainRight: sectionData?.mainRight || "./hero.png",
    ctaText: sectionData?.ctaText || "Schedule a call now",
    // Card 1
    c1_title: sectionData?.c1_title || "",
    c1_desc: sectionData?.c1_desc || "",
    c1_link: sectionData?.c1_link || "",
    c1_img: sectionData?.c1_img || "/card-1.jpg",
    // Card 2
    c2_title: sectionData?.c2_title || "",
    c2_desc: sectionData?.c2_desc || "",
    c2_link: sectionData?.c2_link || "",
    c2_img: sectionData?.c2_img || "/card-2.jpg",
    // Card 3
    c3_title: sectionData?.c3_title || "",
    c3_desc: sectionData?.c3_desc || "",
    c3_link: sectionData?.c3_link || "",
    c3_img: sectionData?.c3_img || "/card-3.jpg",
    // Card 4
    c4_title: sectionData?.c4_title || "",
    c4_desc: sectionData?.c4_desc || "",
    c4_link: sectionData?.c4_link || "",
    c4_img: sectionData?.c4_img || "/card-4.jpg",
  });

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

  return (
    <div className="flex flex-col gap-8 font-manrope">
      <Toaster />
      {/* --- HEADER --- */}
      <div className="flex justify-between items-center border-b border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-cyan-400 uppercase tracking-wider">
            Section Editor
          </h2>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all border ${
              isEditing
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-cyan-500 text-black border-cyan-400"
            }`}
          >
            {isEditing ? <HiOutlineLockClosed /> : <HiOutlinePencilAlt />}
            {isEditing ? "LOCK" : "EDIT"}
          </button>
          {isEditing && (
            <button
              onClick={() => {
                onSave(content);
                setIsEditing(false);
              }}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black px-6 py-2 rounded-full font-bold transition-all shadow-lg"
            >
              <HiOutlineSave /> SAVE
            </button>
          )}
        </div>
      </div>

      {/* --- MAIN SECTION --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
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
          {/* <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">
              Sub Heading
            </label>
            <input
              disabled={!isEditing}
              name="heading"
              value={content.subheading}
              placeholder=""
              onChange={handleChange}
              className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${
                isEditing ? "border-cyan-400" : "border-gray-800 text-gray-400"
              }`}
            />
          </div> */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">
              Paragraph Text
            </label>
            <textarea
              disabled={!isEditing}
              name="subtext"
              value={content.subtext}
              placeholder=""
              onChange={handleChange}
              rows="3"
              className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${
                isEditing ? "border-cyan-400" : "border-gray-800 text-gray-400"
              }`}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
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
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="relative ">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">
              Main Left
            </label>
            <div
              onClick={() => isEditing && mainFileRef.current.click()}
              className={`relative border-2 border-dashed rounded-2xl h-full min-h-[200px] max-h-[320px] flex items-center justify-center bg-black/20 overflow-hidden ${
                isEditing
                  ? "border-cyan-500 cursor-pointer group"
                  : "border-gray-800"
              }`}
            >
              <input
                type="file"
                ref={mainFileRef}
                onChange={(e) => handleImageUpdate("mainLeft", e)}
                className="hidden"
              />
              <img
                src={showReference ? "./hero.png" : content.mainLeft}
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
          <div className="relative ">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">
              Main center
            </label>
            <div
              onClick={() => isEditing && mainFileRef.current.click()}
              className={`relative border-2 border-dashed rounded-2xl h-full min-h-[200px] max-h-[320px] flex items-center justify-center bg-black/20 overflow-hidden ${
                isEditing
                  ? "border-cyan-500 cursor-pointer group"
                  : "border-gray-800"
              }`}
            >
              <input
                type="file"
                ref={mainFileRef}
                onChange={(e) => handleImageUpdate("mainCenter", e)}
                className="hidden"
              />
              <img
                src={showReference ? "./hero.png" : content.mainCenter}
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
          <div className="relative ">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">
              Main Right
            </label>
            <div
              onClick={() => isEditing && mainFileRef.current.click()}
              className={`relative border-2 border-dashed rounded-2xl h-full min-h-[200px] max-h-[320px] flex items-center justify-center bg-black/20 overflow-hidden ${
                isEditing
                  ? "border-cyan-500 cursor-pointer group"
                  : "border-gray-800"
              }`}
            >
              <input
                type="file"
                ref={mainFileRef}
                onChange={(e) => handleImageUpdate("mainRight", e)}
                className="hidden"
              />
              <img
                src={showReference ? "./hero.png" : content.mainRight}
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
    </div>
  );
};

export default ASupportCompany;
