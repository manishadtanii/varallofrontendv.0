import React, { useState, useRef } from "react";
import { HiOutlineUpload, HiOutlineSave, HiOutlinePencilAlt, HiOutlineLockClosed, HiOutlineEye } from "react-icons/hi";

const Testimonials = ({ sectionData, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showReference, setShowReference] = useState(false);
  const mainFileRef = useRef(null);
  
  // State initialized with individual keys for absolute clarity
  const [content, setContent] = useState({
    heading: sectionData?.heading || "",
    subtext: sectionData?.subtext || "",
    mainImage: sectionData?.mainImage || "/hero.jpg",
    ctaText: sectionData?.ctaText || "",
    ctaLink: sectionData?.ctaLink || "",
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
    if (file) {
      const url = URL.createObjectURL(file);
      setContent(prev => ({ ...prev, [key]: url, [`${key}File`]: file }));
    }
  };

  return (
    <div className="flex flex-col gap-8 font-manrope">
      {/* --- HEADER --- */}
      <div className="flex justify-between items-center border-b border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-cyan-400 uppercase tracking-wider">Section Editor</h2>
          
        </div>
        
        <div className="flex gap-3">
          <button onClick={() => setIsEditing(!isEditing)} className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all border ${isEditing ? 'bg-gray-800 border-gray-700 text-white' : 'bg-cyan-500 text-black border-cyan-400'}`}>
            {isEditing ? <HiOutlineLockClosed /> : <HiOutlinePencilAlt />}
            {isEditing ? "LOCK" : "EDIT"}
          </button>
          {isEditing && (
            <button onClick={() => { onSave(content); setIsEditing(false); }} className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black px-6 py-2 rounded-full font-bold transition-all shadow-lg">
              <HiOutlineSave /> SAVE
            </button>
          )}
        </div>
      </div>

      {/* --- MAIN SECTION --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Main Heading</label>
            <input disabled={!isEditing} name="heading" value={content.heading} placeholder="" onChange={handleChange} className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${isEditing ? 'border-cyan-400' : 'border-gray-800 text-gray-400'}`} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Paragraph Text</label>
            <textarea disabled={!isEditing} name="subtext" value={content.subtext} placeholder="" onChange={handleChange} rows="3" className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${isEditing ? 'border-cyan-400' : 'border-gray-800 text-gray-400'}`} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">CTA Text</label>
            <input disabled={!isEditing} placeholder="" name="ctaText" value={content.ctaText} onChange={handleChange} className={`bg-transparent border rounded-xl px-4 py-2 outline-none ${isEditing ? 'border-cyan-400' : 'border-gray-800'}`} />
            </div>
              <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">CTA Link</label>
            <input disabled={!isEditing} placeholder="" name="ctaLink" value={content.ctaLink} onChange={handleChange} className={`bg-transparent border rounded-xl px-4 py-2 outline-none ${isEditing ? 'border-cyan-400' : 'border-gray-800'}`} />
            </div>
           
          </div>
        </div>

        <div className="relative">
          <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Main Image</label>
          <div onClick={() => isEditing && mainFileRef.current.click()} className={`relative border-2 border-dashed rounded-2xl h-full min-h-[200px] flex items-center justify-center bg-black/20 overflow-hidden ${isEditing ? 'border-cyan-500 cursor-pointer group' : 'border-gray-800'}`}>
            <input type="file" ref={mainFileRef} onChange={(e) => handleImageUpdate('mainImage', e)} className="hidden" />
            <img src={showReference ? "./hero.png" : content.mainImage} className="max-h-full object-contain p-2" alt="Hero" />
            {isEditing && <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><HiOutlineUpload className="text-cyan-400 text-2xl" /></div>}
          </div>
        </div>
      </div>

      {/* --- HARDCODED CARDS (2x2) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        
        {/* CARD 1 */}
        <div className={`bg-[#0b1318] border rounded-2xl p-5 flex gap-5 ${isEditing ? 'border-cyan-400/30' : 'border-gray-800'}`}>
          <div className="relative w-28 h-28 flex-shrink-0 bg-black rounded-xl overflow-hidden group">
            <img src={showReference ? "/card-1.jpg" : content.c1_img} className="w-full h-full object-cover" alt="" />
            {isEditing && <label className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer"><input type="file" className="hidden" onChange={(e) => handleImageUpdate('c1_img', e)} /><HiOutlineUpload className="text-cyan-400" /></label>}
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <input disabled={!isEditing} name="c1_title" value={content.c1_title} onChange={handleChange} placeholder="Title" className="bg-transparent border-b border-gray-800 text-sm font-bold outline-none text-white focus:border-cyan-400" />
            <textarea disabled={!isEditing} name="c1_desc" value={content.c1_desc} onChange={handleChange} placeholder="Desc" rows="2" className="bg-transparent border border-gray-800 rounded-lg p-2 text-[11px] outline-none text-gray-400" />
            <input disabled={!isEditing} name="c1_link" value={content.c1_link} onChange={handleChange} placeholder="Link" className="bg-transparent border border-gray-800 rounded-lg px-2 py-1 text-[10px] outline-none" />
          </div>
        </div>

        {/* CARD 2 */}
        <div className={`bg-[#0b1318] border rounded-2xl p-5 flex gap-5 ${isEditing ? 'border-cyan-400/30' : 'border-gray-800'}`}>
          <div className="relative w-28 h-28 flex-shrink-0 bg-black rounded-xl overflow-hidden group">
            <img src={showReference ? "/card-2.jpg" : content.c2_img} className="w-full h-full object-cover" alt="" />
            {isEditing && <label className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer"><input type="file" className="hidden" onChange={(e) => handleImageUpdate('c2_img', e)} /><HiOutlineUpload className="text-cyan-400" /></label>}
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <input disabled={!isEditing} name="c2_title" value={content.c2_title} onChange={handleChange} placeholder="Title" className="bg-transparent border-b border-gray-800 text-sm font-bold outline-none text-white focus:border-cyan-400" />
            <textarea disabled={!isEditing} name="c2_desc" value={content.c2_desc} onChange={handleChange} placeholder="Desc" rows="2" className="bg-transparent border border-gray-800 rounded-lg p-2 text-[11px] outline-none text-gray-400" />
            <input disabled={!isEditing} name="c2_link" value={content.c2_link} onChange={handleChange} placeholder="Link" className="bg-transparent border border-gray-800 rounded-lg px-2 py-1 text-[10px] outline-none" />
          </div>
        </div>

        {/* CARD 3 */}
        <div className={`bg-[#0b1318] border rounded-2xl p-5 flex gap-5 ${isEditing ? 'border-cyan-400/30' : 'border-gray-800'}`}>
          <div className="relative w-28 h-28 flex-shrink-0 bg-black rounded-xl overflow-hidden group">
            <img src={showReference ? "/card-3.jpg" : content.c3_img} className="w-full h-full object-cover" alt="" />
            {isEditing && <label className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer"><input type="file" className="hidden" onChange={(e) => handleImageUpdate('c3_img', e)} /><HiOutlineUpload className="text-cyan-400" /></label>}
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <input disabled={!isEditing} name="c3_title" value={content.c3_title} onChange={handleChange} placeholder="Title" className="bg-transparent border-b border-gray-800 text-sm font-bold outline-none text-white focus:border-cyan-400" />
            <textarea disabled={!isEditing} name="c3_desc" value={content.c3_desc} onChange={handleChange} placeholder="Desc" rows="2" className="bg-transparent border border-gray-800 rounded-lg p-2 text-[11px] outline-none text-gray-400" />
            <input disabled={!isEditing} name="c3_link" value={content.c3_link} onChange={handleChange} placeholder="Link" className="bg-transparent border border-gray-800 rounded-lg px-2 py-1 text-[10px] outline-none" />
          </div>
        </div>

        {/* CARD 4 */}
        <div className={`bg-[#0b1318] border rounded-2xl p-5 flex gap-5 ${isEditing ? 'border-cyan-400/30' : 'border-gray-800'}`}>
          <div className="relative w-28 h-28 flex-shrink-0 bg-black rounded-xl overflow-hidden group">
            <img src={showReference ? "/card-4.jpg" : content.c4_img} className="w-full h-full object-cover" alt="" />
            {isEditing && <label className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer"><input type="file" className="hidden" onChange={(e) => handleImageUpdate('c4_img', e)} /><HiOutlineUpload className="text-cyan-400" /></label>}
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <input disabled={!isEditing} name="c4_title" value={content.c4_title} onChange={handleChange} placeholder="Title" className="bg-transparent border-b border-gray-800 text-sm font-bold outline-none text-white focus:border-cyan-400" />
            <textarea disabled={!isEditing} name="c4_desc" value={content.c4_desc} onChange={handleChange} placeholder="Desc" rows="2" className="bg-transparent border border-gray-800 rounded-lg p-2 text-[11px] outline-none text-gray-400" />
            <input disabled={!isEditing} name="c4_link" value={content.c4_link} onChange={handleChange} placeholder="Link" className="bg-transparent border border-gray-800 rounded-lg px-2 py-1 text-[10px] outline-none" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Testimonials;