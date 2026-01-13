import React, { useState, useRef, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { HiOutlineUpload, HiOutlineSave, HiOutlinePencilAlt, HiOutlineX, HiOutlineTrash, HiOutlineViewGridAdd } from "react-icons/hi";
import { uploadAPI } from "../../../services/apiService";

const Team = ({ sectionData, onSave, onBrowseLibrary }) => {
  const [isEditing, setIsEditing] = useState(false);

  console.log("📍 Team (Leadership Team) sectionData:", sectionData);

  // Listen for image selection from MediaLibrary
  useEffect(() => {
    const handleImageSelected = (event) => {
      const { fieldName, imageUrl } = event.detail;
      if (fieldName.startsWith("memberImage_")) {
        const index = parseInt(fieldName.split("_")[1]);
        console.log("✅ Image selected for team member:", index, imageUrl);
        setContent((prev) => {
          const newMembers = [...prev.members];
          newMembers[index] = {
            ...newMembers[index],
            image: {
              ...newMembers[index].image,
              url: imageUrl,
            },
          };
          return { ...prev, members: newMembers };
        });
        toast.success("Image loaded from library!");
      }
    };

    window.addEventListener("imageSelected", handleImageSelected);
    return () => window.removeEventListener("imageSelected", handleImageSelected);
  }, []);

  const [content, setContent] = useState({
    heading: sectionData?.heading || "The Pillars of The Varallo Group",
    subHeading: sectionData?.subHeading || "The thinkers, doers, and leaders shaping your future.",
    members: sectionData?.members || [
      {
        name: "Nancy Varallo",
        designation: "Founder and CEO",
        image: {
          url: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766736716/team-1_gxiwdy.jpg",
          alt: "Nancy Varallo",
        },
        linkedin: "https://www.linkedin.com/in/nancy-varallo-8346a248/",
      },
      {
        name: "George Catuogno",
        designation: "COO",
        image: {
          url: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766736716/team-2.jpg",
          alt: "George Catuogno",
        },
        linkedin: "https://www.linkedin.com/in/george-catuogno-2627a67/",
      },
    ],
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContent((prev) => ({ ...prev, [name]: value }));
  };

  const handleMemberImageUpdate = async (index, file) => {
    if (!file) return;

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size must be less than 2MB");
      return;
    }

    try {
      setUploading(true);
      const uploadResult = await uploadAPI.uploadImage(file, `team-member-${index}`, 'about');

      if (uploadResult.success) {
        setContent((prev) => {
          const newMembers = [...prev.members];
          newMembers[index] = {
            ...newMembers[index],
            image: {
              url: uploadResult.url,
              publicId: uploadResult.publicId,
              alt: newMembers[index].image?.alt || "Team member",
            },
          };
          return { ...prev, members: newMembers };
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

  const updateMember = (index, field, value) => {
    setContent((prev) => {
      const newMembers = [...prev.members];
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        newMembers[index] = {
          ...newMembers[index],
          [parent]: { ...newMembers[index][parent], [child]: value },
        };
      } else {
        newMembers[index] = { ...newMembers[index], [field]: value };
      }
      return { ...prev, members: newMembers };
    });
  };

  const addMember = () => {
    setContent((prev) => ({
      ...prev,
      members: [
        ...prev.members,
        {
          name: "New Team Member",
          designation: "Position Title",
          image: { url: "", alt: "Team member" },
          linkedin: "",
        },
      ],
    }));
  };

  const removeMember = (index) => {
    setContent((prev) => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index),
    }));
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
      heading: sectionData?.heading || "The Pillars of The Varallo Group",
      subHeading: sectionData?.subHeading || "The thinkers, doers, and leaders shaping your future.",
      members: sectionData?.members || [
        {
          name: "Nancy Varallo",
          designation: "Founder and CEO",
          image: {
            url: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766736716/team-1_gxiwdy.jpg",
            alt: "Nancy Varallo",
          },
          linkedin: "https://www.linkedin.com/in/nancy-varallo-8346a248/",
        },
        {
          name: "George Catuogno",
          designation: "COO",
          image: {
            url: "https://res.cloudinary.com/dh3dys6sf/image/upload/v1766736716/team-2.jpg",
            alt: "George Catuogno",
          },
          linkedin: "https://www.linkedin.com/in/george-catuogno-2627a67/",
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
        <h2 className="text-xl font-bold text-cyan-400 uppercase tracking-wider">Leadership Team Section</h2>

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

      {/* --- TEAM MEMBERS SECTION --- */}
      <div className="border-t border-gray-800 pt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-cyan-400">Team Members ({content.members?.length})</h3>
          {isEditing && (
            <button
              onClick={addMember}
              className="text-xs bg-cyan-500/20 border border-cyan-400 text-cyan-400 px-3 py-1.5 rounded-lg hover:bg-cyan-500/30 transition-all"
            >
              + Add Member
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6">
          {content.members?.map((member, index) => (
            <div
              key={index}
              className={`bg-[#0b1318] border rounded-2xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4 ${
                isEditing ? "border-cyan-400/30" : "border-gray-800"
              }`}
            >
              {/* Image */}
              <div className="relative w-full h-64 bg-black rounded-lg overflow-hidden group">
                <input
                  type="file"
                  id={`member-image-${index}`}
                  className="hidden"
                  onChange={(e) => handleMemberImageUpdate(index, e.target.files[0])}
                  accept="image/*"
                />
                <img
                  src={member.image?.url}
                  alt={member.image?.alt}
                  className="w-full h-full object-cover"
                />
                {isEditing && (
                  <>
                    <label
                      htmlFor={`member-image-${index}`}
                      className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <HiOutlineUpload className="text-cyan-400 text-xl" />
                    </label>
                    <button
                      type="button"
                      onClick={() => onBrowseLibrary(`memberImage_${index}`)}
                      className="absolute top-2 right-2 bg-green-600 hover:bg-green-700 text-white p-2 rounded transition-colors opacity-0 group-hover:opacity-100"
                      title="Browse Library"
                    >
                      <HiOutlineViewGridAdd className="text-lg" />
                    </button>
                  </>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="col-span-2 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-gray-500 font-bold uppercase">Name</label>
                      <input
                        disabled={!isEditing}
                        value={member.name}
                        onChange={(e) => updateMember(index, "name", e.target.value)}
                        placeholder="Full Name"
                        className={`bg-transparent border rounded-lg px-3 py-2 text-sm outline-none text-white ${
                          isEditing ? "border-cyan-400/30" : "border-gray-800"
                        }`}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-gray-500 font-bold uppercase">Designation</label>
                      <input
                        disabled={!isEditing}
                        value={member.designation}
                        onChange={(e) => updateMember(index, "designation", e.target.value)}
                        placeholder="Job Title"
                        className={`bg-transparent border rounded-lg px-3 py-2 text-sm outline-none text-white ${
                          isEditing ? "border-cyan-400/30" : "border-gray-800"
                        }`}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-gray-500 font-bold uppercase">LinkedIn URL</label>
                      <input
                        disabled={!isEditing}
                        value={member.linkedin}
                        onChange={(e) => updateMember(index, "linkedin", e.target.value)}
                        placeholder="https://linkedin.com/in/..."
                        className={`bg-transparent border rounded-lg px-3 py-2 text-xs outline-none text-white ${
                          isEditing ? "border-cyan-400/30" : "border-gray-800"
                        }`}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-gray-500 font-bold uppercase">Image Alt Text</label>
                      <input
                        disabled={!isEditing}
                        value={member.image?.alt || ""}
                        onChange={(e) => updateMember(index, "image.alt", e.target.value)}
                        placeholder="Alt text for accessibility"
                        className={`bg-transparent border rounded-lg px-3 py-2 text-xs outline-none text-white ${
                          isEditing ? "border-cyan-400/30" : "border-gray-800"
                        }`}
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <button
                      onClick={() => removeMember(index)}
                      className="text-red-400 hover:text-red-300 transition-all mt-2"
                    >
                      <HiOutlineTrash size={20} />
                    </button>
                  )}
                </div>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {content.members?.map((member, i) => (
                <div key={i} className="bg-black/50 rounded-lg p-4 border border-gray-800 text-center space-y-3">
                  <img
                    src={member.image?.url}
                    alt={member.image?.alt}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="font-bold text-white">{member.name}</h4>
                    <p className="text-xs text-cyan-400 font-semibold">{member.designation}</p>
                  </div>
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                    >
                      View LinkedIn →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;
