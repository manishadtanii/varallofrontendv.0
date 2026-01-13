import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { HiOutlineSave, HiOutlinePencilAlt, HiOutlineX } from "react-icons/hi";

const Mission = ({ sectionData, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);

  console.log("📍 Mission sectionData:", sectionData);

  const [content, setContent] = useState({
    statement: sectionData?.statement || "Our goal is to serve as a trusted partner, delivering expert services as an extension of your team. We make your operations simpler, your results stronger, and give you more time to focus on what truly matters to you.",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContent((prev) => ({ ...prev, [name]: value }));
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
      statement: sectionData?.statement || "Our goal is to serve as a trusted partner, delivering expert services as an extension of your team. We make your operations simpler, your results stronger, and give you more time to focus on what truly matters to you.",
    });
    setIsEditing(false);
    toast.success("Changes discarded");
  };

  return (
    <div className="flex flex-col gap-8 font-manrope">
      <Toaster />

      {/* --- HEADER --- */}
      <div className="flex justify-between items-center border-b border-gray-800 pb-4">
        <h2 className="text-xl font-bold text-cyan-400 uppercase tracking-wider">Mission Section</h2>

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

      {/* --- MAIN CONTENT --- */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Mission Statement</label>
          <textarea
            disabled={!isEditing}
            name="statement"
            value={content.statement}
            onChange={handleChange}
            rows="6"
            className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${
              isEditing ? "border-cyan-400" : "border-gray-800 text-gray-400"
            }`}
          />
        </div>
      </div>

      {/* --- CHARACTER COUNT --- */}
      <div className="text-xs text-gray-500">
        Characters: {content.statement.length}
      </div>

      {/* --- PREVIEW --- */}
      {!isEditing && (
        <div className="border-t border-gray-800 pt-6">
          <h3 className="text-sm font-bold text-cyan-400 mb-4">Preview</h3>
          <div className="bg-gray-900/50 rounded-xl p-6">
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-lg text-gray-300 leading-relaxed">
                {content.statement}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mission;
