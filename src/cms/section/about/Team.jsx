import React, { useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  HiOutlineUpload,
  HiOutlineSave,
  HiOutlinePencilAlt,
  HiOutlineLockClosed,
  HiOutlineEye,
} from "react-icons/hi";

const Team = ({ sectionData, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showReference, setShowReference] = useState(false);
  const mainFileRef = useRef(null);

  // State initialized with individual keys for absolute clarity
  const [content, setContent] = useState({
     heading: sectionData?.heading || "The Pillars of The Varallo Group",
    desc: sectionData?.desc || "The thinkers, doers, and leaders shaping your future.",
    // Team 1
    c1_title: sectionData?.c1_title || "Nancy Varallo",
    c1_role: sectionData?.c1_role || "Founder and CEO",
    c1_img: sectionData?.c1_img || "./team-1.jpg",
    c1_linkedin: sectionData?.c1_linkedin || "https://www.linkedin.com/in/nancy-varallo-8346a248/",
    // Team 2
    c2_title: sectionData?.c2_title || "George Catuogno",
    c2_role: sectionData?.c2_role || "COO",
    c2_img: sectionData?.c2_img || "./team-2.jpg",
    c2_linkedin: sectionData?.c2_linkedin || "https://www.linkedin.com/in/george-catuogno-2627a67/",
    // Team 3
    c3_title: sectionData?.c3_title || "Cedar Bushong",
    c3_role: sectionData?.c3_role || "Director of IT and Marketing",
    c3_img: sectionData?.c3_img || "./team-3.jpg",
    c3_linkedin: sectionData?.c3_linkedin || "https://www.linkedin.com/in/cedar-bushong-27b96751/",
    // Team 4
    c4_title: sectionData?.c4_title || "Ellie Reinhardt",
    c4_role: sectionData?.c4_role || "Director of Financial Operations",
    c4_img: sectionData?.c4_img || "./team-4.jpg",
    c4_linkedin: sectionData?.c4_linkedin || "https://www.linkedin.com/in/ellie-reinhardt-565252b6/",
    // Team 5
    c5_title: sectionData?.c5_title || "Mike Schena",
    c5_role: sectionData?.c5_role || "Director of Business Development",
    c5_img: sectionData?.c5_img || "./team-5.jpg",
    c5_linkedin: sectionData?.c5_linkedin || "https://www.linkedin.com/in/michael-schena-iii-774146aa/",
    // Team 6
    c6_title: sectionData?.c6_title || "Sarah Moynihan",
    c6_role: sectionData?.c6_role || "Director of Court Reporting Operations",
    c6_img: sectionData?.c6_img || "./team-6.jpg",
    c6_linkedin: sectionData?.c6_linkedin || "https://www.linkedin.com/in/sarah-moynihan/",
    // Team 7
    c7_title: sectionData?.c7_title || "Pat Blaskopf",
    c7_role: sectionData?.c7_role || "Director of Video Services",
    c7_img: sectionData?.c7_img || "./team-7.jpg",
    c7_linkedin: sectionData?.c7_linkedin || "https://www.linkedin.com/in/patrick-blaskopf/",
    // Team 8
    c8_title: sectionData?.c8_title || "Amelia Schneider",
    c8_role: sectionData?.c8_role || "Director of Association Services",
    c8_img: sectionData?.c8_img || "./team-8.jpg",
    c8_linkedin: sectionData?.c8_linkedin || "https://www.linkedin.com/in/amelia-schneider-012617/",
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
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
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
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Pera</label>
            <input disabled={!isEditing} name="desc" value={content.desc} placeholder="" onChange={handleChange} className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${isEditing ? 'border-cyan-400' : 'border-gray-800 text-gray-400'}`} />
          </div>
          {/* <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">
              Paragraph Text
            </label>
            <textarea
              disabled={!isEditing}
              name="desc"
              value={content.desc}
              placeholder=""
              onChange={handleChange}
              rows="3"
              className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${
                isEditing ? "border-cyan-400" : "border-gray-800 text-gray-400"
              }`}
            />
          </div> */}
          {/* <div className="grid grid-cols-2 gap-4">
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
          </div> */}
        </div>

        {/* <div className="relative ">
          <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">
            Main Image
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
              onChange={(e) => handleImageUpdate("mainImage", e)}
              className="hidden"
            />
            <img
              src={showReference ? "./hero.png" : content.mainImage}
              className="max-h-full object-contain p-2"
              alt="Hero"
            />
            {isEditing && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <HiOutlineUpload className="text-cyan-400 text-2xl" />
              </div>
            )}
          </div>
        </div> */}
      </div>
      {/* --- HARDCODED CARDS (2x2) --- */}
      <div className="">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* CARD 1 */}
          <div
            className={`bg-[#0b1318] border rounded-2xl p-5 flex flex-col gap-5 ${
              isEditing ? "border-cyan-400/30" : "border-gray-800"
            }`}
          >
            <div className="relative w-100 h-28 flex-shrink-0 bg-black rounded-xl overflow-hidden group">
              <img src={showReference ? "./ab-1.png" : content.c1_img} className="w-full h-full object-cover"/>
              {isEditing && (
                <label className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleImageUpdate("c1_img", e)}
                  />
                  <HiOutlineUpload className="text-cyan-400" />
                </label>
              )}
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
              <input
                disabled={!isEditing}
                name="c1_role"
                value={content.c1_role}
                onChange={handleChange}
                placeholder="Link"
                className="bg-transparent border border-gray-800 rounded-lg px-2 py-1 text-[10px] outline-none text-gray-400"
              />
              {/* <textarea
                disabled={!isEditing}
                name="c1_desc"
                value={content.c8_role}
                onChange={handleChange}
                placeholder="Desc"
                rows="2"
                className="bg-transparent border border-gray-800 rounded-lg p-2 text-[11px] outline-none text-gray-400"
              /> */}
              <input
                disabled={!isEditing}
                name="c1_linkedin"
                value={content.c1_linkedin}
                onChange={handleChange}
                placeholder="Link"
                className="bg-transparent border border-gray-800 rounded-lg px-2 py-1 text-[10px] outline-none text-gray-400"
              />
              
            </div>
          </div>
          {/* CARD 2 */}
          <div
            className={`bg-[#0b1318] border rounded-2xl p-5 flex flex-col gap-5 ${
              isEditing ? "border-cyan-400/30" : "border-gray-800"
            }`}
          >
            <div className="relative w-100 h-28 flex-shrink-0 bg-black rounded-xl overflow-hidden group">
              <img src={showReference ? "./ab-1.png" : content.c2_img} className="w-full h-full object-cover"/>
              {isEditing && (
                <label className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleImageUpdate("c2_img", e)}
                  />
                  <HiOutlineUpload className="text-cyan-400" />
                </label>
              )}
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
              <input
                disabled={!isEditing}
                name="c2_role"
                value={content.c2_role}
                onChange={handleChange}
                placeholder="Link"
                className="bg-transparent border border-gray-800 rounded-lg px-2 py-1 text-[10px] outline-none text-gray-400"
              />
              {/* <textarea
                disabled={!isEditing}
                name="c2_desc"
                value={content.c8_role}
                onChange={handleChange}
                placeholder="Desc"
                rows="2"
                className="bg-transparent border border-gray-800 rounded-lg p-2 text-[11px] outline-none text-gray-400"
              /> */}
              <input
                disabled={!isEditing}
                name="c2_linkedin"
                value={content.c2_linkedin}
                onChange={handleChange}
                placeholder="Link"
                className="bg-transparent border border-gray-800 rounded-lg px-2 py-1 text-[10px] outline-none text-gray-400"
              />
              
            </div>
          </div>
          {/* CARD 3 */}
          <div
            className={`bg-[#0b1318] border rounded-2xl p-5 flex flex-col gap-5 ${
              isEditing ? "border-cyan-400/30" : "border-gray-800"
            }`}
          >
            <div className="relative w-100 h-28 flex-shrink-0 bg-black rounded-xl overflow-hidden group">
              <img src={showReference ? "./ab-1.png" : content.c3_img} className="w-full h-full object-cover"/>
              {isEditing && (
                <label className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleImageUpdate("c3_img", e)}
                  />
                  <HiOutlineUpload className="text-cyan-400" />
                </label>
              )}
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
              <input
                disabled={!isEditing}
                name="c3_role"
                value={content.c3_role}
                onChange={handleChange}
                placeholder="Link"
                className="bg-transparent border border-gray-800 rounded-lg px-2 py-1 text-[10px] outline-none text-gray-400"
              />
              {/* <textarea
                disabled={!isEditing}
                name="c3_desc"
                value={content.c8_role}
                onChange={handleChange}
                placeholder="Desc"
                rows="2"
                className="bg-transparent border border-gray-800 rounded-lg p-2 text-[11px] outline-none text-gray-400"
              /> */}
              <input
                disabled={!isEditing}
                name="c3_linkedin"
                value={content.c3_linkedin}
                onChange={handleChange}
                placeholder="Link"
                className="bg-transparent border border-gray-800 rounded-lg px-2 py-1 text-[10px] outline-none text-gray-400"
              />
              
            </div>
          </div>
          {/* CARD 4 */}
          <div
            className={`bg-[#0b1318] border rounded-2xl p-5 flex flex-col gap-5 ${
              isEditing ? "border-cyan-400/30" : "border-gray-800"
            }`}
          >
            <div className="relative w-100 h-28 flex-shrink-0 bg-black rounded-xl overflow-hidden group">
              <img src={showReference ? "./ab-1.png" : content.c4_img} className="w-full h-full object-cover"/>
              {isEditing && (
                <label className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleImageUpdate("c4_img", e)}
                  />
                  <HiOutlineUpload className="text-cyan-400" />
                </label>
              )}
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
              <input
                disabled={!isEditing}
                name="c4_role"
                value={content.c4_role}
                onChange={handleChange}
                placeholder="Link"
                className="bg-transparent border border-gray-800 rounded-lg px-2 py-1 text-[10px] outline-none text-gray-400"
              />
              {/* <textarea
                disabled={!isEditing}
                name="c4_desc"
                value={content.c8_role}
                onChange={handleChange}
                placeholder="Desc"
                rows="2"
                className="bg-transparent border border-gray-800 rounded-lg p-2 text-[11px] outline-none text-gray-400"
              /> */}
              <input
                disabled={!isEditing}
                name="c4_linkedin"
                value={content.c4_linkedin}
                onChange={handleChange}
                placeholder="Link"
                className="bg-transparent border border-gray-800 rounded-lg px-2 py-1 text-[10px] outline-none text-gray-400"
              />
              
            </div>
          </div>
          {/* CARD 5 */}
          <div
            className={`bg-[#0b1318] border rounded-2xl p-5 flex flex-col gap-5 ${
              isEditing ? "border-cyan-400/30" : "border-gray-800"
            }`}
          >
            <div className="relative w-100 h-28 flex-shrink-0 bg-black rounded-xl overflow-hidden group">
              <img src={showReference ? "./ab-1.png" : content.c5_img} className="w-full h-full object-cover"/>
              {isEditing && (
                <label className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleImageUpdate("c5_img", e)}
                  />
                  <HiOutlineUpload className="text-cyan-400" />
                </label>
              )}
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <input
                disabled={!isEditing}
                name="c5_title"
                value={content.c5_title}
                onChange={handleChange}
                placeholder="Title"
                className="bg-transparent border-b border-gray-800 text-sm font-bold outline-none text-white focus:border-cyan-400"
              />
              <input
                disabled={!isEditing}
                name="c5_role"
                value={content.c5_role}
                onChange={handleChange}
                placeholder="Link"
                className="bg-transparent border border-gray-800 rounded-lg px-2 py-1 text-[10px] outline-none text-gray-400"
              />
              {/* <textarea
                disabled={!isEditing}
                name="c5_desc"
                value={content.c8_role}
                onChange={handleChange}
                placeholder="Desc"
                rows="2"
                className="bg-transparent border border-gray-800 rounded-lg p-2 text-[11px] outline-none text-gray-400"
              /> */}
              <input
                disabled={!isEditing}
                name="c5_linkedin"
                value={content.c5_linkedin}
                onChange={handleChange}
                placeholder="Link"
                className="bg-transparent border border-gray-800 rounded-lg px-2 py-1 text-[10px] outline-none text-gray-400"
              />
              
            </div>
          </div>
          {/* CARD 6 */}
          <div
            className={`bg-[#0b1318] border rounded-2xl p-5 flex flex-col gap-5 ${
              isEditing ? "border-cyan-400/30" : "border-gray-800"
            }`}
          >
            <div className="relative w-100 h-28 flex-shrink-0 bg-black rounded-xl overflow-hidden group">
              <img src={showReference ? "./ab-1.png" : content.c6_img} className="w-full h-full object-cover"/>
              {isEditing && (
                <label className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleImageUpdate("c6_img", e)}
                  />
                  <HiOutlineUpload className="text-cyan-400" />
                </label>
              )}
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <input
                disabled={!isEditing}
                name="c6_title"
                value={content.c6_title}
                onChange={handleChange}
                placeholder="Title"
                className="bg-transparent border-b border-gray-800 text-sm font-bold outline-none text-white focus:border-cyan-400"
              />
              <input
                disabled={!isEditing}
                name="c6_role"
                value={content.c6_role}
                onChange={handleChange}
                placeholder="Link"
                className="bg-transparent border border-gray-800 rounded-lg px-2 py-1 text-[10px] outline-none text-gray-400"
              />
              {/* <textarea
                disabled={!isEditing}
                name="c6_desc"
                value={content.c8_role}
                onChange={handleChange}
                placeholder="Desc"
                rows="2"
                className="bg-transparent border border-gray-800 rounded-lg p-2 text-[11px] outline-none text-gray-400"
              /> */}
              <input
                disabled={!isEditing}
                name="c6_linkedin"
                value={content.c6_linkedin}
                onChange={handleChange}
                placeholder="Link"
                className="bg-transparent border border-gray-800 rounded-lg px-2 py-1 text-[10px] outline-none text-gray-400"
              />
              
            </div>
          </div>
          {/* CARD 7 */}
          <div
            className={`bg-[#0b1318] border rounded-2xl p-5 flex flex-col gap-5 ${
              isEditing ? "border-cyan-400/30" : "border-gray-800"
            }`}
          >
            <div className="relative w-100 h-28 flex-shrink-0 bg-black rounded-xl overflow-hidden group">
              <img src={showReference ? "./ab-1.png" : content.c7_img} className="w-full h-full object-cover"/>
              {isEditing && (
                <label className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleImageUpdate("c7_img", e)}
                  />
                  <HiOutlineUpload className="text-cyan-400" />
                </label>
              )}
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <input
                disabled={!isEditing}
                name="c7_title"
                value={content.c7_title}
                onChange={handleChange}
                placeholder="Title"
                className="bg-transparent border-b border-gray-800 text-sm font-bold outline-none text-white focus:border-cyan-400"
              />
              <input
                disabled={!isEditing}
                name="c7_role"
                value={content.c7_role}
                onChange={handleChange}
                placeholder="Link"
                className="bg-transparent border border-gray-800 rounded-lg px-2 py-1 text-[10px] outline-none text-gray-400"
              />
              {/* <textarea
                disabled={!isEditing}
                name="c7_desc"
                value={content.c8_role}
                onChange={handleChange}
                placeholder="Desc"
                rows="2"
                className="bg-transparent border border-gray-800 rounded-lg p-2 text-[11px] outline-none text-gray-400"
              /> */}
              <input
                disabled={!isEditing}
                name="c7_linkedin"
                value={content.c7_linkedin}
                onChange={handleChange}
                placeholder="Link"
                className="bg-transparent border border-gray-800 rounded-lg px-2 py-1 text-[10px] outline-none text-gray-400"
              />
              
            </div>
          </div>
          {/* CARD 8 */}
          <div
            className={`bg-[#0b1318] border rounded-2xl p-5 flex flex-col gap-5 ${
              isEditing ? "border-cyan-400/30" : "border-gray-800"
            }`}
          >
            <div className="relative w-100 h-28 flex-shrink-0 bg-black rounded-xl overflow-hidden group">
              <img src={showReference ? "./ab-1.png" : content.c8_img} className="w-full h-full object-cover"/>
              {isEditing && (
                <label className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleImageUpdate("c8_img", e)}
                  />
                  <HiOutlineUpload className="text-cyan-400" />
                </label>
              )}
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <input
                disabled={!isEditing}
                name="c8_title"
                value={content.c8_title}
                onChange={handleChange}
                placeholder="Title"
                className="bg-transparent border-b border-gray-800 text-sm font-bold outline-none text-white focus:border-cyan-400"
              />
              <input
                disabled={!isEditing}
                name="c8_role"
                value={content.c8_role}
                onChange={handleChange}
                placeholder="Link"
                className="bg-transparent border border-gray-800 rounded-lg px-2 py-1 text-[10px] outline-none text-gray-400"
              />
              {/* <textarea
                disabled={!isEditing}
                name="c8_desc"
                value={content.c8_role}
                onChange={handleChange}
                placeholder="Desc"
                rows="2"
                className="bg-transparent border border-gray-800 rounded-lg p-2 text-[11px] outline-none text-gray-400"
              /> */}
              <input
                disabled={!isEditing}
                name="c8_linkedin"
                value={content.c8_linkedin}
                onChange={handleChange}
                placeholder="Link"
                className="bg-transparent border border-gray-800 rounded-lg px-2 py-1 text-[10px] outline-none text-gray-400"
              />
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
