import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { HiOutlineUpload, HiOutlineSave, HiOutlinePencilAlt, HiOutlineX, HiOutlineViewGridAdd } from "react-icons/hi";
import { uploadAPI } from "../../../services/apiService";

const Journey = ({ sectionData, onSave, onBrowseLibrary }) => {
  const [isEditing, setIsEditing] = useState(false);

  console.log("📍 Journey sectionData:", sectionData);

  // Listen for image selection from MediaLibrary
  useEffect(() => {
    const handleImageSelected = (event) => {
      const { fieldName, imageUrl } = event.detail;
      if (fieldName.startsWith("blockImage_")) {
        const index = parseInt(fieldName.split("_")[1]);
        console.log("✅ Image selected for journey block:", index, imageUrl);
        setContent((prev) => {
          const newBlocks = [...prev.blocks];
          newBlocks[index] = {
            ...newBlocks[index],
            image: {
              ...newBlocks[index].image,
              url: imageUrl,
            },
          };
          return { ...prev, blocks: newBlocks };
        });
        toast.success("Image loaded from library!");
      }
    };

    window.addEventListener("imageSelected", handleImageSelected);
    return () => window.removeEventListener("imageSelected", handleImageSelected);
  }, []);

  const [content, setContent] = useState({
    heading: sectionData?.heading || "The Varallo Group's Journey",
    subHeading: sectionData?.subHeading || "A family name, a lifelong commitment to excellence.",
    blocks: sectionData?.blocks || [
      {
        key: "legacy",
        title: "Our Legacy",
        description: "Founded in 2001 with a clear mission to deliver exceptional court reporting and legal support services rooted in professionalism, reliability, and personal attention. The Varallo Group builds on a family legacy dating back to 1937. For nearly 100 years, the Varallo name has been synonymous with excellence in the field.",
        image: {
          url: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766736717/our-legacy_pnhf2e.jpg",
          alt: "The Varallo Group leadership team",
        },
      },
      {
        key: "commitment",
        title: "Our Commitment",
        description: "From the start, The Varallo Group set out to be a trusted partner for law firms, corporate counsel, government agencies, and organizations nationwide.",
        image: {
          url: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766736717/commitment_abc123.jpg",
          alt: "Team collaboration",
        },
      },
      {
        key: "future",
        title: "Our Future",
        description: "What truly sets us apart is the people behind the services. We're constantly innovating to meet tomorrow's challenges.",
        image: {
          url: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766736717/future_xyz789.jpg",
          alt: "Vision for the future",
        },
      },
    ],
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContent((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlockImageUpdate = async (index, file) => {
    if (!file) return;

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size must be less than 2MB");
      return;
    }

    try {
      setUploading(true);
      const uploadResult = await uploadAPI.uploadImage(file, `journey-block-${index}`, 'about');

      if (uploadResult.success) {
        setContent((prev) => {
          const newBlocks = [...prev.blocks];
          newBlocks[index] = {
            ...newBlocks[index],
            image: {
              url: uploadResult.url,
              publicId: uploadResult.publicId,
              alt: newBlocks[index].image?.alt || "Journey block image",
            },
          };
          return { ...prev, blocks: newBlocks };
        });
        toast.success("Image uploaded!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const updateBlock = (index, field, value) => {
    setContent((prev) => {
      const newBlocks = [...prev.blocks];
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        newBlocks[index] = {
          ...newBlocks[index],
          [parent]: { ...newBlocks[index][parent], [child]: value },
        };
      } else {
        newBlocks[index] = { ...newBlocks[index], [field]: value };
      }
      return { ...prev, blocks: newBlocks };
    });
  };

  const handleSave = async () => {
    try {
      await onSave(content);
      setIsEditing(false);
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const handleCancel = () => {
    setContent({
      heading: sectionData?.heading || "The Varallo Group's Journey",
      subHeading: sectionData?.subHeading || "A family name, a lifelong commitment to excellence.",
      blocks: sectionData?.blocks || [
        {
          key: "legacy",
          title: "Our Legacy",
          description: "Founded in 2001 with a clear mission to deliver exceptional court reporting and legal support services rooted in professionalism, reliability, and personal attention. The Varallo Group builds on a family legacy dating back to 1937. For nearly 100 years, the Varallo name has been synonymous with excellence in the field.",
          image: {
            url: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766736717/our-legacy_pnhf2e.jpg",
            alt: "The Varallo Group leadership team",
          },
        },
        {
          key: "commitment",
          title: "Our Commitment",
          description: "From the start, The Varallo Group set out to be a trusted partner for law firms, corporate counsel, government agencies, and organizations nationwide.",
          image: {
            url: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766736717/commitment_abc123.jpg",
            alt: "Team collaboration",
          },
        },
        {
          key: "future",
          title: "Our Future",
          description: "What truly sets us apart is the people behind the services. We're constantly innovating to meet tomorrow's challenges.",
          image: {
            url: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766736717/future_xyz789.jpg",
            alt: "Vision for the future",
          },
        },
      ],
    });
    setIsEditing(false);
    toast.success("Changes discarded");
  };

  return (
    <div className="flex flex-col gap-8 font-manrope">
      <Toaster />

      {/* --- HEADER --- */}
      <div className="flex justify-between items-center border-b border-gray-800 pb-4">
        <h2 className="text-xl font-bold text-cyan-400 uppercase tracking-wider">Journey Section</h2>

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

      {/* --- HEADER CONTENT --- */}
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
          <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Sub Heading</label>
          <input
            disabled={!isEditing}
            name="subHeading"
            value={content.subHeading}
            onChange={handleChange}
            className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${
              isEditing ? "border-cyan-400" : "border-gray-800 text-gray-400"
            }`}
          />
        </div>
      </div>

      {/* --- BLOCKS SECTION --- */}
      <div className="border-t border-gray-800 pt-8">
        <h3 className="text-sm font-bold text-cyan-400 mb-4">Journey Blocks (3)</h3>
        <div className="grid grid-cols-1 gap-6">
          {content.blocks?.map((block, index) => (
            <div
              key={index}
              className={`bg-[#0b1318] border rounded-2xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4 ${
                isEditing ? "border-cyan-400/30" : "border-gray-800"
              }`}
            >
              {/* Image */}
              <div className="relative w-full h-48 bg-black rounded-lg overflow-hidden group">
                <input
                  type="file"
                  id={`block-image-${index}`}
                  className="hidden"
                  onChange={(e) => handleBlockImageUpdate(index, e.target.files[0])}
                  accept="image/*"
                />
                <img
                  src={block.image?.url}
                  alt={block.image?.alt}
                  className="w-full h-full object-cover"
                />
                {isEditing && (
                  <>
                    <label
                      htmlFor={`block-image-${index}`}
                      className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <HiOutlineUpload className="text-cyan-400 text-xl" />
                    </label>
                    <button
                      type="button"
                      onClick={() => onBrowseLibrary(`blockImage_${index}`)}
                      className="absolute top-2 right-2 bg-green-600 hover:bg-green-700 text-white p-2 rounded transition-colors opacity-0 group-hover:opacity-100"
                      title="Browse Library"
                    >
                      <HiOutlineViewGridAdd className="text-lg" />
                    </button>
                  </>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col gap-3">
                <input
                  disabled={!isEditing}
                  value={block.title}
                  onChange={(e) => updateBlock(index, "title", e.target.value)}
                  placeholder="Block Title"
                  className={`bg-transparent border-b border-gray-800 text-lg font-bold outline-none text-white focus:border-cyan-400 ${
                    !isEditing ? "border-transparent" : ""
                  }`}
                />

                <textarea
                  disabled={!isEditing}
                  value={block.description}
                  onChange={(e) => updateBlock(index, "description", e.target.value)}
                  placeholder="Block Description"
                  rows="3"
                  className={`bg-transparent border rounded-lg p-2 text-sm outline-none text-gray-400 ${
                    isEditing ? "border-cyan-400/30" : "border-gray-800"
                  }`}
                />

                <input
                  disabled={!isEditing}
                  value={block.image?.alt || ""}
                  onChange={(e) => updateBlock(index, "image.alt", e.target.value)}
                  placeholder="Image Alt Text"
                  className={`bg-transparent border rounded-lg px-3 py-2 text-xs outline-none text-white focus:border-cyan-400 ${
                    isEditing ? "border-cyan-400/30" : "border-gray-800"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- PREVIEW --- */}
      {!isEditing && (
        <div className="border-t border-gray-800 pt-6">
          <h3 className="text-sm font-bold text-cyan-400 mb-4">Preview</h3>
          <div className="bg-gray-900/50 rounded-xl p-6 space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white">{content.heading}</h2>
              <p className="text-sm text-gray-400 mt-2">{content.subHeading}</p>
            </div>

            <div className="space-y-6">
              {content.blocks?.map((block, i) => (
                <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-black/30 rounded-lg p-4 border border-gray-800">
                  <img src={block.image?.url} alt={block.image?.alt} className="h-40 object-cover rounded-lg" />
                  <div>
                    <h4 className="font-bold text-white mb-2">{block.title}</h4>
                    <p className="text-xs text-gray-300 line-clamp-3">{block.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Journey;
