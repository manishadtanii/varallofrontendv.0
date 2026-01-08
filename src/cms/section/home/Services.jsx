import React, { useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  HiOutlineUpload,
  HiOutlineSave,
  HiOutlinePencilAlt,
  HiOutlineLockClosed,
  HiOutlineEye,
} from "react-icons/hi";

const Services = ({ sectionData, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showReference, setShowReference] = useState(false);
  const mainFileRef = useRef(null);

  // State initialized with individual keys for absolute clarity
  const [content, setContent] = useState({
    heading: sectionData?.heading || "Smart Support. Smart Solutions.",
    subtext1:
      sectionData?.subtext1 ||
      "Our team is the heart of The Varallo Group. They bring dedication, professionalism, and integrity to everything they do. I’m constantly inspired by their commitment to our clients and to each other. It's a privilege to work alongside such talented people who take real pride in delivering excellence every single day.",
    subtext2:
      sectionData?.subtext2 ||
      "At The Varallo Group, our services are built to simplify, strengthen, and scale your operations. Whether you're a court reporting firm, a professional organization, or an individual, our expertise meets your needs right where you are and right when you need it.",
    ctaText: sectionData?.ctaText || "Let's Get Started",
    // Card 1
    c1_title: sectionData?.c1_title || "TVG Reporting",
    c1_desc:
      sectionData?.c1_desc ||
      "Comprehensive agency management support focused on optimizing your day-to-day operations.",
    c1_img: sectionData?.c1_img || "./smart-1.jpg",
    c1_link: sectionData?.c1_link || "/services/tvg-management",

    // Card 2
    c2_title: sectionData?.c2_title || "TVG Reporting",
    c2_desc:
      sectionData?.c2_desc ||
      "Our nationwide network of court reporters and legal videographers is ready to support your firm wherever you need.",
    c2_img: sectionData?.c2_img || "./smart-2.jpg",
    c2_link: sectionData?.c2_link || "/services/tvg-reporting",

    // Card 3
    c3_title: sectionData?.c3_title || "TVG Stream",
    c3_desc:
      sectionData?.c3_desc ||
      "Cutting-edge trial presentation and event A/V, with detail-focused on-site support.",
    c3_img: sectionData?.c3_img || "./smart-3.jpg",
    c3_link: sectionData?.c3_link || "/services/tvg-stream",

    // Card 4
    c4_title: sectionData?.c4_title || "TVG Books",
    c4_desc:
      sectionData?.c4_desc ||
      "Book keeping support services for court reporting and other professional industries.",
    c4_img: sectionData?.c4_img || "./smart-4.jpg",
    c4_link: sectionData?.c4_link || "/services/tvg-books",

    // Card 5
    c5_title: sectionData?.c5_title || "TVG Connect",
    c5_desc:
      sectionData?.c5_desc ||
      "Focused management services built for professional associations and organizations.",
    c5_img: sectionData?.c5_img || "./smart-6.jpg",
    c5_link: sectionData?.c5_link || "/services/tvg-connect",

    // Card 6
    c6_title: sectionData?.c6_title || "TVG Verify",
    c6_desc:
      sectionData?.c6_desc ||
      "Let us ensure your hiring is secure with reliable background screening and compliance checks, powered by Smart Hire.",
    c6_img: sectionData?.c6_img || "./smart-8.jpg",
    c6_link: sectionData?.c6_link || "/services/tvg-verify",
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
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">
              Sub Heading
            </label>
            <input
              disabled={!isEditing}
              name="subSecTitle"
              value={content.subSecTitle}
              placeholder=""
              onChange={handleChange}
              className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${
                isEditing ? "border-cyan-400" : "border-gray-800 text-gray-400"
              }`}
            />
          </div>
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
                Sub Section Title
              </label>
              <input
                disabled={!isEditing}
                placeholder=""
                name="ctaText"
                value={content.subSecTitle}
                onChange={handleChange}
                className={`bg-transparent border rounded-xl px-4 py-2 outline-none ${
                  isEditing
                    ? "border-cyan-400"
                    : "border-gray-800 text-gray-400"
                }`}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">
                Sub Section Pera
              </label>
              <input
                disabled={!isEditing}
                placeholder=""
                name="ctaLink"
                value={content.subSecPera}
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

        <div className="relative">
          <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">
            Main Image
          </label>
          <div
            onClick={() => isEditing && mainFileRef.current.click()}
            className={`relative border-2 border-dashed rounded-2xl h-full min-h-[200px] flex items-center justify-center bg-black/20 overflow-hidden ${
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
        </div>
      </div>

      {/* --- HARDCODED CARDS (2x2) --- */}
      <div className="">
        <h1 className="mb-3">Smart Slider Cards</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* CARD 1 */}
          <div
            className={`bg-[#0b1318] border rounded-2xl p-5 flex gap-5 ${
              isEditing ? "border-cyan-400/30" : "border-gray-800"
            }`}
          >
            <div className="relative w-28 h-28 flex-shrink-0 bg-black rounded-xl overflow-hidden group">
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
              <textarea
                disabled={!isEditing}
                name="c1_desc"
                value={content.c1_desc}
                onChange={handleChange}
                placeholder="Desc"
                rows="2"
                className="bg-transparent border border-gray-800 rounded-lg p-2 text-[11px] outline-none text-gray-400"
              />
              <input disabled={!isEditing} name="c1_link" value={content.c1_link} onChange={handleChange} placeholder="Link" className="bg-transparent border border-gray-800 rounded-lg px-2 py-1 text-[10px] outline-none" />
            </div>
          </div>

          {/* CARD 2 */}
          <div
            className={`bg-[#0b1318] border rounded-2xl p-5 flex gap-5 ${
              isEditing ? "border-cyan-400/30" : "border-gray-800"
            }`}
          >
            <div className="relative w-28 h-28 flex-shrink-0 bg-black rounded-xl overflow-hidden group">
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
              <textarea
                disabled={!isEditing}
                name="c2_desc"
                value={content.c2_desc}
                onChange={handleChange}
                placeholder="Desc"
                rows="2"
                className="bg-transparent border border-gray-800 rounded-lg p-2 text-[11px] outline-none text-gray-400"
              />
              <input disabled={!isEditing} name="c2_link" value={content.c2_link} onChange={handleChange} placeholder="Link" className="bg-transparent border border-gray-800 rounded-lg px-2 py-1 text-[10px] outline-none" />
            </div>
          </div>

          {/* CARD 3 */}
          <div
            className={`bg-[#0b1318] border rounded-2xl p-5 flex gap-5 ${
              isEditing ? "border-cyan-400/30" : "border-gray-800"
            }`}
          >
            <div className="relative w-28 h-28 flex-shrink-0 bg-black rounded-xl overflow-hidden group">
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
              <textarea
                disabled={!isEditing}
                name="c3_desc"
                value={content.c3_desc}
                onChange={handleChange}
                placeholder="Desc"
                rows="2"
                className="bg-transparent border border-gray-800 rounded-lg p-2 text-[11px] outline-none text-gray-400"
              />
              <input
                disabled={!isEditing}
                name="c3_link"
                value={content.c3_link}
                onChange={handleChange}
                placeholder="Link"
                className="bg-transparent border border-gray-800 rounded-lg px-2 py-1 text-[10px] outline-none"
              />
            </div>
          </div>

          {/* CARD 4 */}
          <div
            className={`bg-[#0b1318] border rounded-2xl p-5 flex gap-5 ${
              isEditing ? "border-cyan-400/30" : "border-gray-800"
            }`}
          >
            <div className="relative w-28 h-28 flex-shrink-0 bg-black rounded-xl overflow-hidden group">
              <img
                src={showReference ? "/card-4.jpg" : content.c4_img}
                className="w-full h-full object-cover"
                alt=""
              />
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
              <textarea
                disabled={!isEditing}
                name="c4_desc"
                value={content.c4_desc}
                onChange={handleChange}
                placeholder="Desc"
                rows="2"
                className="bg-transparent border border-gray-800 rounded-lg p-2 text-[11px] outline-none text-gray-400"
              />
              <input
                disabled={!isEditing}
                name="c4_link"
                value={content.c4_link}
                onChange={handleChange}
                placeholder="Link"
                className="bg-transparent border border-gray-800 rounded-lg px-2 py-1 text-[10px] outline-none"
              />
            </div>
          </div>
          {/* CARD 5 */}
          <div
            className={`bg-[#0b1318] border rounded-2xl p-5 flex gap-5 ${
              isEditing ? "border-cyan 500/30" : "border-gray-800"
            }`}
          >
            <div className="relative w-28 h-28 flex-shrink-0 bg-black rounded-xl overflow-hidden group">
              <img
                src={showReference ? "/card-4.jpg" : content.c5_img}
                className="w-full h-full object-cover"
                alt=""
              />
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
              <textarea
                disabled={!isEditing}
                name="c5_desc"
                value={content.c5_desc}
                onChange={handleChange}
                placeholder="Desc"
                rows="2"
                className="bg-transparent border border-gray-800 rounded-lg p-2 text-[11px] outline-none text-gray-400"
              />
              <input
                disabled={!isEditing}
                name="c5_link"
                value={content.c5_link}
                onChange={handleChange}
                placeholder="Link"
                className="bg-transparent border border-gray-800 rounded-lg px-2 py-1 text-[10px] outline-none"
              />
            </div>
          </div>
          {/* CARD 6 */}
          <div
            className={`bg-[#0b1318] border rounded-2xl p-5 flex gap-5 ${
              isEditing ? "border-cyan-400/30" : "border-gray-800"
            }`}
          >
            <div className="relative w-28 h-28 flex-shrink-0 bg-black rounded-xl overflow-hidden group">
              <img
                src={showReference ? "/card-4.jpg" : content.c6_img}
                className="w-full h-full object-cover"
                alt=""
              />
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
              <textarea
                disabled={!isEditing}
                name="c6_desc"
                value={content.c6_desc}
                onChange={handleChange}
                placeholder="Desc"
                rows="2"
                className="bg-transparent border border-gray-800 rounded-lg p-2 text-[11px] outline-none text-gray-400"
              />
              <input
                disabled={!isEditing}
                name="c6_link"
                value={content.c6_link}
                onChange={handleChange}
                placeholder="Link"
                className="bg-transparent border border-gray-800 rounded-lg px-2 py-1 text-[10px] outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
