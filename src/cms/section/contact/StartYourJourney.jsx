import React, { useState, useRef, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  HiOutlineUpload,
  HiOutlineSave,
  HiOutlinePencilAlt,
  HiOutlineX,
  HiOutlineEye,
  HiOutlineViewGridAdd,
} from "react-icons/hi";

const StartYourJourney = ({ sectionData, onSave, onBrowseLibrary }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showReference, setShowReference] = useState(false);
  const mainFileRef = useRef(null);

  console.log("🔍 Start Your Journey sectionData:", sectionData);
  // Helper: normalize incoming sectionData into component content shape
  const buildContentFromSection = (sd = {}) => {
    const defaultImg = './hero.png';

    // map images array (if present) to mainImage1..3 (only 3 images now)
    const imagesArr = Array.isArray(sd.images) ? sd.images : [];
    const mainImage1 = imagesArr[0]?.url || sd.mainImage1 || defaultImg;
    const mainImage2 = imagesArr[1]?.url || sd.mainImage2 || defaultImg;
    const mainImage3 = imagesArr[2]?.url || sd.mainImage3 || defaultImg;

    console.log("🖼️ Mapped images:", { mainImage1, mainImage2, mainImage3 });

    // map buttons array to ctaText/link
    const buttons = Array.isArray(sd.buttons) ? sd.buttons : [];
    const ctaText1 = buttons[0]?.text || sd.ctaText1 || 'Request a call back for other services';
    const ctaLink1 = buttons[0]?.link || sd.ctaLink1 || 'mailto:info@varallogroup.com';
    const ctaText2 = buttons[1]?.text || sd.ctaText2 || 'Schedule a Deposition';
    const ctaLink2 = buttons[1]?.link || sd.ctaLink2 || '#contact-main';

    return {
      heading: sd.heading || sd.title || "Start your journey with a conversation. Let's Connect!",
      subtext: sd.subtext || sd.description || sd.summary || "Reach out today, we'll map the way forward with clear strategies and reliable legal assistance.",
      ctaText1,
      ctaLink1,
      ctaText2,
      ctaLink2,
      mainImage1,
      mainImage2,
      mainImage3,
    };
  };

  // State initialized with normalized content
  const [content, setContent] = useState(buildContentFromSection(sectionData));

  // Update content when sectionData changes
  useEffect(() => {
    if (sectionData && Object.keys(sectionData).length > 0) {
      setContent(buildContentFromSection(sectionData));
      console.log("✅ Start Your Journey content updated from sectionData");
    }
  }, [sectionData]);

  // Listen for image selection from media library
  useEffect(() => {
    const handleImageSelected = (event) => {
      const { fieldName, imageUrl } = event.detail;
      if (fieldName && fieldName.startsWith('mainImage')) {
        setContent((prev) => ({ ...prev, [fieldName]: imageUrl }));
        toast.success(`${fieldName} updated from library!`);
      }
    };

    window.addEventListener('imageSelected', handleImageSelected);
    return () => window.removeEventListener('imageSelected', handleImageSelected);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      // Convert mainImage format to images array format for API
      const savePayload = {
        heading: content.heading,
        subtext: content.subtext,
        ctaText1: content.ctaText1,
        ctaLink1: content.ctaLink1,
        ctaText2: content.ctaText2,
        ctaLink2: content.ctaLink2,
        images: [
          { url: content.mainImage1, alt: "Contact image 1" },
          { url: content.mainImage2, alt: "Contact image 2" },
          { url: content.mainImage3, alt: "Contact image 3" },
        ],
        buttons: [
          { text: content.ctaText1, link: content.ctaLink1 },
          { text: content.ctaText2, link: content.ctaLink2 },
        ],
      };

      console.log("💾 Saving Start Your Journey data:", savePayload);
      await onSave(savePayload);
      setIsEditing(false);
      toast.success("✅ Section saved successfully!");
      console.log("✅ Start Your Journey data saved successfully");
    } catch (error) {
      console.error("❌ Error saving Start Your Journey data:", error);
      toast.error("Failed to save section");
    }
  };

  const handleImageUpdate = (key, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("File size must be less than 5MB");
      return;
    }

    // Auto-upload to Cloudinary
    uploadImageToCloudinary(file, key);
  };

  const uploadImageToCloudinary = async (file, fieldName) => {
    try {
      toast.loading(`Uploading ${fieldName}...`);
      
      const formData = new FormData();
      formData.append("image", file);
      formData.append("folder", "varallo-images/media-library");

      const response = await fetch("http://localhost:3000/api/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Upload failed");
      }

      // Update content with Cloudinary URL
      setContent((prev) => ({ ...prev, [fieldName]: data.url }));
      toast.success(`${fieldName} uploaded!`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload image");
    }
  };

  const handleCancel = () => {
    setContent(buildContentFromSection(sectionData));
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
                onClick={handleSave}
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
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Sub Heading</label>
            <input disabled={!isEditing} name="heading" value={content.subheading} placeholder="" onChange={handleChange} className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${isEditing ? 'border-cyan-400' : 'border-gray-800 text-gray-400'}`} />
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
                CTA Text 1
              </label>
              <input
                disabled={!isEditing}
                placeholder=""
                name="ctaText1"
                value={content.ctaText1}
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
                CTA Link 1
              </label>
              <input
                disabled={!isEditing}
                placeholder=""
                name="ctaLink1"
                value={content.ctaLink1}
                onChange={handleChange}
                className={`bg-transparent border rounded-xl px-4 py-2 outline-none ${
                  isEditing
                    ? "border-cyan-400"
                    : "border-gray-800 text-gray-400"
                }`}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">
                CTA Text 2
              </label>
              <input
                disabled={!isEditing}
                placeholder=""
                name="ctaText2"
                value={content.ctaText2}
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
                CTA Link 1
              </label>
              <input
                disabled={!isEditing}
                placeholder=""
                name="ctaLink2"
                value={content.ctaLink2}
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

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="relative ">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">
                Image 1
              </label>
              {isEditing && onBrowseLibrary && (
                <button onClick={() => onBrowseLibrary("mainImage1")} 
                  className="flex items-center gap-2 px-3 py-1.5 text-xs bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg hover:bg-green-500/30 transition-all">
                  <HiOutlineViewGridAdd className="text-sm" />
                </button>
              )}
            </div>
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
                onChange={(e) => handleImageUpdate("mainImage1", e)}
                className="hidden"
              />
              <img
                src={content.mainImage1}
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
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">
                Image 2
              </label>
              {isEditing && onBrowseLibrary && (
                <button onClick={() => onBrowseLibrary("mainImage2")} 
                  className="flex items-center gap-2 px-3 py-1.5 text-xs bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg hover:bg-green-500/30 transition-all">
                  <HiOutlineViewGridAdd className="text-sm" />
                </button>
              )}
            </div>
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
                onChange={(e) => handleImageUpdate("mainImage2", e)}
                className="hidden"
              />
              <img
                src={showReference ? "./hero.png" : content.mainImage2}
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
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">
                Image 3
              </label>
              {isEditing && onBrowseLibrary && (
                <button onClick={() => onBrowseLibrary("mainImage3")} 
                  className="flex items-center gap-2 px-3 py-1.5 text-xs bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg hover:bg-green-500/30 transition-all">
                  <HiOutlineViewGridAdd className="text-sm" />
                </button>
              )}
            </div>
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
                onChange={(e) => handleImageUpdate("mainImage3", e)}
                className="hidden"
              />
              <img
                src={showReference ? "./hero.png" : content.mainImage3}
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

      {/* --- PREVIEW --- */}
      {!isEditing && (
        <div className="border-t border-gray-800 pt-6">
          <h3 className="text-sm font-bold text-cyan-400 mb-4">Preview</h3>
          <div className="bg-gray-900/50 rounded-xl p-6 space-y-6">
            {/* Main Content */}
            <div className="text-center space-y-3">
              <h1 className="text-4xl font-bold text-white">{content.heading}</h1>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">{content.subtext}</p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href={content.ctaLink1} className="px-6 py-3 bg-cyan-500 text-black font-bold rounded-lg hover:bg-cyan-400 transition-all">
                {content.ctaText1}
              </a>
              <a href={content.ctaLink2} className="px-6 py-3 bg-gray-800 text-cyan-400 font-bold rounded-lg border border-cyan-500 hover:bg-gray-700 transition-all">
                {content.ctaText2}
              </a>
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="aspect-square bg-black rounded-lg overflow-hidden">
                <img src={content.mainImage1} alt="Journey" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-square bg-black rounded-lg overflow-hidden">
                <img src={content.mainImage2} alt="Journey" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-square bg-black rounded-lg overflow-hidden">
                <img src={content.mainImage3} alt="Journey" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StartYourJourney;
