import React, { useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  HiOutlineUpload,
  HiOutlineSave,
  HiOutlinePencilAlt,
  HiOutlineX,
  HiOutlineEye,
} from "react-icons/hi";

const Testimonials = ({ sectionData, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showReference, setShowReference] = useState(false);
  const mainFileRef = useRef(null);

  console.log("📍 Testimonials sectionData:", sectionData);

  // State initialized with individual keys for absolute clarity
  const [content, setContent] = useState({
    heading: sectionData?.heading || "Why Our Clients Choose Us Again & Again",

    // Testimonial 1
    c1_title: sectionData?.c1_title || "Michael Scire",
    c1_subtitle: sectionData?.c1_subtitle || "Florida Court Reporters Association",
    c1_desc: sectionData?.c1_desc || "“Such a great experience working with The Varallo Group. I cannot say enough wonderful things about each of you. You are all professional, helpful, efficient, and respectful. You all jumped right in and often offered help when I didn’t realize I needed it. The conference ran seamlessly. Thank you from the bottom of my heart.”",
    
    // Testimonial 2
    c2_title: sectionData?.c2_title || "Ray Catuogno, Jr.",
    c2_subtitle: sectionData?.c2_subtitle || "Real Time Court Reporting",
    c2_desc: sectionData?.c2_desc || "“I don’t get an opportunity to say it often enough, but I really appreciate the effort and hard work that everyone puts into making my business operations run smoothly. My work to establish the business was done long ago, and now it’s everyone else’s work that continues to make the business a success. So thanks for the big things that are a pain to do, and thanks for the little things that don’t get as much notice but are just as important.”",
    
    // Testimonial 3
    c3_title: sectionData?.c3_title || "Pam Owen",
    c3_subtitle: sectionData?.c3_subtitle || "BOSS Reporters",
    c3_desc: sectionData?.c3_desc || "“I am so appreciative of what you have taught me and for all of your efforts. I am very pleased with the progress we’ve made together and grateful for your positivity and eagerness to get ‘all the ducks in a row.’ I am optimistic and very excited about the future, and know I am lucky to have found you.”",
    
    // Testimonial 4
    c4_title: sectionData?.c4_title || "Mary Beth Johnson",
    c4_subtitle: sectionData?.c4_subtitle || "Community College of Allegheny County",
    c4_desc: sectionData?.c4_desc || "“May I begin by thanking you for a lifetime of work on behalf of Steno reporting. Your brilliance in creating A to Z and Basic Training saved our profession. As a result of your initiative, we now teach students from Oregon to Atlanta. You had vision, and I am grateful for your foresight.”",
    
    // Testimonial 5
    c5_title: sectionData?.c5_title || "Michael Lewis",
    c5_subtitle: sectionData?.c5_subtitle || "Discovery Legal Services",
    c5_desc: sectionData?.c5_desc || "“Working with The Varallo Group and Cedar Bushong has been an excellent experience. Their team handled our website development with precision, creating a site that truly reflects our brand and meets our needs. Beyond the initial development, their ongoing support has been invaluable. They are consistently responsive and supportive, addressing any issues promptly and helping us adapt our site as our business evolves. We couldn’t be happier with their dedication and commitment to our success. Highly recommend!”",
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

  const handleCancel = () => {
    setContent({
      heading: sectionData?.heading || "Why Our Clients Choose Us Again & Again",
      c1_title: sectionData?.c1_title || "Michael Scire",
      c1_subtitle: sectionData?.c1_subtitle || "Florida Court Reporters Association",
      c1_desc: sectionData?.c1_desc || "Such a great experience working with The Varallo Group. I cannot say enough wonderful things about each of you. You are all professional, helpful, efficient, and respectful. You all jumped right in and often offered help when I didn't realize I needed it. The conference ran seamlessly. Thank you from the bottom of my heart.",
      c2_title: sectionData?.c2_title || "Ray Catuogno, Jr.",
      c2_subtitle: sectionData?.c2_subtitle || "Real Time Court Reporting",
      c2_desc: sectionData?.c2_desc || "I don't get an opportunity to say it often enough, but I really appreciate the effort and hard work that everyone puts into making my business operations run smoothly. My work to establish the business was done long ago, and now it's everyone else's work that continues to make the business a success. So thanks for the big things that are a pain to do, and thanks for the little things that don't get as much notice but are just as important.",
      c3_title: sectionData?.c3_title || "Pam Owen",
      c3_subtitle: sectionData?.c3_subtitle || "BOSS Reporters",
      c3_desc: sectionData?.c3_desc || "I am so appreciative of what you have taught me and for all of your efforts. I am very pleased with the progress we've made together and grateful for your positivity and eagerness to get 'all the ducks in a row.' I am optimistic and very excited about the future, and know I am lucky to have found you.",
      c4_title: sectionData?.c4_title || "Mary Beth Johnson",
      c4_subtitle: sectionData?.c4_subtitle || "Community College of Allegheny County",
      c4_desc: sectionData?.c4_desc || "May I begin by thanking you for a lifetime of work on behalf of Steno reporting. Your brilliance in creating A to Z and Basic Training saved our profession. As a result of your initiative, we now teach students from Oregon to Atlanta. You had vision, and I am grateful for your foresight.",
      c5_title: sectionData?.c5_title || "Michael Lewis",
      c5_subtitle: sectionData?.c5_subtitle || "Discovery Legal Services",
      c5_desc: sectionData?.c5_desc || "Working with The Varallo Group and Cedar Bushong has been an excellent experience. Their team handled our website development with precision, creating a site that truly reflects our brand and meets our needs. Beyond the initial development, their ongoing support has been invaluable. They are consistently responsive and supportive, addressing any issues promptly and helping us adapt our site as our business evolves. We couldn't be happier with their dedication and commitment to our success. Highly recommend!",
    });
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
                onClick={() => {
                  onSave(content);
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
      <div className="grid grid-cols-1  gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Main Heading</label>
            <input disabled={!isEditing} name="heading" value={content.heading} placeholder="" onChange={handleChange} className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${isEditing ? 'border-cyan-400' : 'border-gray-800 text-gray-400'}`} />
          </div>
        {/*   <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Sub Heading</label>
            <input disabled={!isEditing} name="subSecTitle" value={content.subSecTitle} placeholder="" onChange={handleChange} className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${isEditing ? 'border-cyan-400' : 'border-gray-800 text-gray-400'}`} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Paragraph Text</label>
            <textarea disabled={!isEditing} name="subtext" value={content.subtext} placeholder="" onChange={handleChange} rows="3" className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${isEditing ? 'border-cyan-400' : 'border-gray-800 text-gray-400'}`} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Sub Section Title</label>
            <input disabled={!isEditing} placeholder="" name="ctaText" value={content.subSecTitle} onChange={handleChange} className={`bg-transparent border rounded-xl px-4 py-2 outline-none ${isEditing ? 'border-cyan-400' : 'border-gray-800 text-gray-400'}`} />
            </div>
              <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Sub Section Pera</label>
            <input disabled={!isEditing} placeholder="" name="ctaLink" value={content.subSecPera} onChange={handleChange} className={`bg-transparent border rounded-xl px-4 py-2 outline-none ${isEditing ? 'border-cyan-400' : 'border-gray-800 text-gray-400'}`} />
            </div>
           
          </div> */}
        </div>

        {/* <div className="relative">
          <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Main Image</label>
          <div onClick={() => isEditing && mainFileRef.current.click()} className={`relative border-2 border-dashed rounded-2xl h-full min-h-[200px] flex items-center justify-center bg-black/20 overflow-hidden ${isEditing ? 'border-cyan-500 cursor-pointer group' : 'border-gray-800'}`}>
            <input type="file" ref={mainFileRef} onChange={(e) => handleImageUpdate('mainImage', e)} className="hidden" />
            <img src={showReference ? "./hero.png" : content.mainImage} className="max-h-full object-contain p-2" alt="Hero" />
            {isEditing && <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><HiOutlineUpload className="text-cyan-400 text-2xl" /></div>}
          </div>
        </div> */}
      </div>
      {/* --- HARDCODED CARDS (2x2) --- */}
      <div className="">
        <h1 className="mb-3">Testimonial Cards</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* CARD 1 */}
          <div
            className={`bg-[#0b1318] border rounded-2xl p-5 flex flex-col gap-5 ${
              isEditing ? "border-cyan-400/30" : "border-gray-800"
            }`}
          >
            {/* <div className="relative w-100 h-28 flex-shrink-0 bg-black rounded-xl overflow-hidden group">
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
            </div> */}
            <div className="flex flex-col gap-2 flex-1">
              <input
                disabled={!isEditing}
                name="c1_title"
                value={content.c1_title}
                onChange={handleChange}
                placeholder="Title"
                className="bg-transparent border-b border-gray-800 text-sm font-bold outline-none text-white focus:border-cyan-400"
              />
              <input disabled={!isEditing} name="c1_subtitle" value={content.c1_subtitle} onChange={handleChange} placeholder="Link" className="bg-transparent border border-gray-800 rounded-lg px-2 py-1 text-[10px] outline-none text-gray-400" />
              <textarea
                disabled={!isEditing}
                name="c1_desc"
                value={content.c1_desc}
                onChange={handleChange}
                placeholder="Desc"
                rows="6"
                className="bg-transparent border border-gray-800 rounded-lg p-2 text-[11px] outline-none text-gray-400"
              />
            </div>
          </div>
          {/* CARD 2 */}
          <div
            className={`bg-[#0b1318] border rounded-2xl p-5 flex flex-col gap-5 ${
              isEditing ? "border-cyan-400/30" : "border-gray-800"
            }`}
          >
            {/* <div className="relative w-100 h-28 flex-shrink-0 bg-black rounded-xl overflow-hidden group">
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
            </div> */}
            <div className="flex flex-col gap-2 flex-1">
              <input
                disabled={!isEditing}
                name="c2_title"
                value={content.c2_title}
                onChange={handleChange}
                placeholder="Title"
                className="bg-transparent border-b border-gray-800 text-sm font-bold outline-none text-white focus:border-cyan-400"
              />
              <input disabled={!isEditing} name="c2_subtitle" value={content.c2_subtitle} onChange={handleChange} placeholder="Link" className="bg-transparent border border-gray-800 rounded-lg px-2 py-1 text-[10px] outline-none text-gray-400" />
              <textarea
                disabled={!isEditing}
                name="c2_desc"
                value={content.c2_desc}
                onChange={handleChange}
                placeholder="Desc"
                rows="6"
                className="bg-transparent border border-gray-800 rounded-lg p-2 text-[11px] outline-none text-gray-400"
              />
            </div>
          </div>
          {/* CARD 3 */}
          <div
            className={`bg-[#0b1318] border rounded-2xl p-5 flex flex-col gap-5 ${
              isEditing ? "border-cyan-400/30" : "border-gray-800"
            }`}
          >
            {/* <div className="relative w-100 h-28 flex-shrink-0 bg-black rounded-xl overflow-hidden group">
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
            </div> */}
            <div className="flex flex-col gap-2 flex-1">
              <input
                disabled={!isEditing}
                name="c3_title"
                value={content.c3_title}
                onChange={handleChange}
                placeholder="Title"
                className="bg-transparent border-b border-gray-800 text-sm font-bold outline-none text-white focus:border-cyan-400"
              />
              <input disabled={!isEditing} name="c3_subtitle" value={content.c3_subtitle} onChange={handleChange} placeholder="Link" className="bg-transparent border border-gray-800 rounded-lg px-2 py-1 text-[10px] outline-none text-gray-400" />
              <textarea
                disabled={!isEditing}
                name="c3_desc"
                value={content.c3_desc}
                onChange={handleChange}
                placeholder="Desc"
                rows="6"
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
            {/* <div className="relative w-100 h-28 flex-shrink-0 bg-black rounded-xl overflow-hidden group">
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
            </div> */}
            <div className="flex flex-col gap-2 flex-1">
              <input
                disabled={!isEditing}
                name="c4_title"
                value={content.c4_title}
                onChange={handleChange}
                placeholder="Title"
                className="bg-transparent border-b border-gray-800 text-sm font-bold outline-none text-white focus:border-cyan-400"
              />
              <input disabled={!isEditing} name="c4_subtitle" value={content.c4_subtitle} onChange={handleChange} placeholder="Link" className="bg-transparent border border-gray-800 rounded-lg px-2 py-1 text-[10px] outline-none text-gray-400" />
              <textarea
                disabled={!isEditing}
                name="c4_desc"
                value={content.c4_desc}
                onChange={handleChange}
                placeholder="Desc"
                rows="6"
                className="bg-transparent border border-gray-800 rounded-lg p-2 text-[11px] outline-none text-gray-400"
              />
            </div>
          </div>
          {/* CARD 5 */}
          <div
            className={`bg-[#0b1318] border rounded-2xl p-5 flex flex-col gap-5 ${
              isEditing ? "border-cyan-400/30" : "border-gray-800"
            }`}
          >
            {/* <div className="relative w-100 h-28 flex-shrink-0 bg-black rounded-xl overflow-hidden group">
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
            </div> */}
            <div className="flex flex-col gap-2 flex-1">
              <input
                disabled={!isEditing}
                name="c5_title"
                value={content.c5_title}
                onChange={handleChange}
                placeholder="Title"
                className="bg-transparent border-b border-gray-800 text-sm font-bold outline-none text-white focus:border-cyan-400"
              />
              <input disabled={!isEditing} name="c5_subtitle" value={content.c5_subtitle} onChange={handleChange} placeholder="Link" className="bg-transparent border border-gray-800 rounded-lg px-2 py-1 text-[10px] outline-none text-gray-400" />
              <textarea
                disabled={!isEditing}
                name="c5_desc"
                value={content.c5_desc}
                onChange={handleChange}
                placeholder="Desc"
                rows="6"
                className="bg-transparent border border-gray-800 rounded-lg p-2 text-[11px] outline-none text-gray-400"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
