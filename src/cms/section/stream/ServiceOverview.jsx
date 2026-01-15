import React, { useState, useRef, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { HiOutlineUpload, HiOutlineSave, HiOutlinePencilAlt, HiOutlineX, HiOutlineViewGridAdd } from "react-icons/hi";
import { uploadAPI } from "../../../services/apiService";

const ServiceOverview = ({ sectionData, onSave, onBrowseLibrary }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showReference, setShowReference] = useState(false);
  const fileInputRef = useRef(null);
  
  const [content, setContent] = useState({
    heading: sectionData?.heading || "Service Overview",
    subHeading: sectionData?.title || "Sophisticated Solutions for Critical Testimony",
    para1: sectionData?.para1 || "Technology has become a fundamental executive in today's legal proceedings. TVG Stream provides professional set-up and technical support for depositions, hearings, and trials that has little left to chance.",
    para2: sectionData?.para2 || "From complex multi-party virtual depositions to high-stakes trials, we deliver the tools, expertise, and staffing required for a flawless, frictionless both on screen and in-person.",
    mainImage: sectionData?.image?.url || sectionData?.img || "./services/stream-over.png",
  });

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
    setContent(prev => ({ ...prev, mainImage: url, [`mainImageFile`]: file }));
  };

  const handleCancel = () => {
    setContent({
      heading: sectionData?.heading || "Service Overview",
      subHeading: sectionData?.title || "Sophisticated Solutions for Critical Testimony",
      para1: sectionData?.para1 || "Technology has become a fundamental executive in today's legal proceedings. TVG Stream provides professional set-up and technical support for depositions, hearings, and trials that has little left to chance.",
      para2: sectionData?.para2 || "From complex multi-party virtual depositions to high-stakes trials, we deliver the tools, expertise, and staffing required for a flawless, frictionless both on screen and in-person.",
      mainImage: sectionData?.image?.url || sectionData?.img || "./services/stream-over.png",
    });
    setIsEditing(false);
    toast.success("Changes discarded");
  };

  useEffect(() => {
    const handler = (e) => {
      const { fieldName, imageUrl } = e?.detail || {};
      if (!fieldName || !imageUrl) return;
      if (fieldName === 'mainImage') {
        console.log(`🖼️ ServiceOverview image selected for ${fieldName}:`, imageUrl);
        setContent((prev) => ({ ...prev, mainImage: imageUrl }));
      }
    };

    window.addEventListener('imageSelected', handler);
    return () => window.removeEventListener('imageSelected', handler);
  }, []);

  return (
    <div className="flex flex-col gap-8 font-manrope">
      <Toaster />
      <div className="flex justify-between items-center border-b border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-cyan-400 uppercase tracking-wider">Section Editor</h2>
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
                    toast.loading('Uploading image...', { id: 'upload-overview' });
                    if (content.mainImageFile && content.mainImageFile instanceof File) {
                      const res = await uploadAPI.uploadImage(content.mainImageFile, 'overview', 'tvg-stream');
                      setContent((prev) => ({ ...prev, mainImage: res.url, mainImageFile: null }));
                      content.mainImage = res.url;
                    }
                    toast.success('Image uploaded', { id: 'upload-overview' });

                    const payload = {
                      heading: content.heading,
                      title: content.subHeading,
                      para1: content.para1,
                      para2: content.para2,
                      img: content.mainImage,
                    };
                    console.log('💾 ServiceOverview final payload:', payload);

                    await onSave(payload);
                    setIsEditing(false);
                  } catch (err) {
                    console.error('❌ Error uploading or saving ServiceOverview:', err);
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Main Heading</label>
            <input disabled={!isEditing} name="heading" value={content.heading} placeholder="" onChange={handleChange} className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${isEditing ? 'border-cyan-400' : 'border-gray-800 text-gray-400'}`} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Sub Heading</label>
            <input disabled={!isEditing} name="subHeading" value={content.subHeading} placeholder="" onChange={handleChange} className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${isEditing ? 'border-cyan-400' : 'border-gray-800 text-gray-400'}`} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Para 1</label>
            <textarea disabled={!isEditing} name="para1" value={content.para1} placeholder="" onChange={handleChange} rows="5" className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${isEditing ? 'border-cyan-400' : 'border-gray-800 text-gray-400'}`} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Para 2</label>
            <textarea disabled={!isEditing} name="para2" value={content.para2} placeholder="" onChange={handleChange} rows="5" className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${isEditing ? 'border-cyan-400' : 'border-gray-800 text-gray-400'}`} />
          </div>
        </div>

        <div className="relative">
          <div className="flex items-center justify-between">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Main Image</label>
            {isEditing && onBrowseLibrary && (
              <button
                onClick={() => onBrowseLibrary("mainImage")}
                className="flex items-center gap-2 px-3 py-1.5 text-xs bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg hover:bg-green-500/30 transition-all"
              >
                <HiOutlineViewGridAdd className="text-sm" />
              </button>
            )}
          </div>
          <div onClick={() => isEditing && fileInputRef.current.click()} className={`relative border-2 border-dashed rounded-2xl h-full min-h-[200px] flex items-center justify-center bg-black/20 overflow-hidden ${isEditing ? 'border-cyan-500 cursor-pointer group' : 'border-gray-800'}`}>
            <input type="file" ref={fileInputRef} onChange={(e) => handleImageUpdate('mainImage', e)} className="hidden" />
            <img src={showReference ? "./hero.png" : content.mainImage} className="max-h-full object-contain p-2" alt="Hero" />
            {isEditing && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <HiOutlineUpload className="text-cyan-400 text-2xl" />
              </div>
            )}
          </div>
        </div>
      </div>

      {!isEditing && (
        <div className="border-t border-gray-800 pt-6">
          <h3 className="text-sm font-bold text-cyan-400 mb-4">Preview</h3>
          <div className="bg-gray-900/50 rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{content.heading}</h2>
              <p className="text-sm text-cyan-400 mb-4">{content.subHeading}</p>
              <p className="text-sm text-gray-300 mb-3 leading-relaxed">{content.para1}</p>
              <p className="text-sm text-gray-300 leading-relaxed">{content.para2}</p>
            </div>
            <div className="flex items-center justify-center">
              <img src={content.mainImage} alt={content.heading} className="w-full h-auto object-contain rounded-lg" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceOverview;
