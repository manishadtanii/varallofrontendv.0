import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  HiOutlineSave,
  HiOutlinePencilAlt,
  HiOutlineX,
  HiOutlineTrash,
  HiOutlinePlus,
} from "react-icons/hi";

const VerifyTestimonials = ({ sectionData, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);

  console.log("VerifyTestimonials sectionData:", sectionData);

  const mapSectionToContent = (sd) => ({
    heading: sd?.heading || "What Our Clients Say",
    cards: sd?.cards || [
      {
        name: "Client Name",
        company: "Company Name",
        text: "Client testimonial goes here...",
      },
    ],
  });

  const [content, setContent] = useState(mapSectionToContent(sectionData));

  React.useEffect(() => {
    console.log('📌 VerifyTestimonials received sectionData:', sectionData);
    setContent(mapSectionToContent(sectionData));
  }, [sectionData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContent((prev) => ({ ...prev, [name]: value }));
  };

  const handleCardChange = (index, field, value) => {
    setContent((prev) => {
      const newCards = [...prev.cards];
      newCards[index] = { ...newCards[index], [field]: value };
      return { ...prev, cards: newCards };
    });
  };

  const addCard = () => {
    setContent((prev) => ({
      ...prev,
      cards: [
        ...prev.cards,
        {
          name: "New Client",
          company: "New Company",
          text: "New testimonial...",
        },
      ],
    }));
  };

  const deleteCard = (index) => {
    setContent((prev) => ({
      ...prev,
      cards: prev.cards.filter((_, i) => i !== index),
    }));
  };

  const handleCancel = () => {
    setContent(mapSectionToContent(sectionData));
    setIsEditing(false);
    toast.success("Changes discarded");
  };

  return (
    <div className="flex flex-col gap-8 font-manrope">
      <Toaster />
      {/* --- HEADER --- */}
      <div className="flex justify-between items-center border-b border-gray-800 pb-4">
        <h2 className="text-xl font-bold text-cyan-400 uppercase tracking-wider">
          Testimonials
        </h2>

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
                    const payload = {
                      heading: content.heading,
                      cards: content.cards,
                    };

                    console.log('💾 VerifyTestimonials final payload:', payload);
                    await onSave(payload);
                    setIsEditing(false);
                    toast.success("Saved successfully");
                  } catch (err) {
                    console.error('❌ Error saving:', err);
                    toast.error("Failed to save");
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

      {/* --- HEADING --- */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">
          Section Heading
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

      {/* --- ADD CARD BUTTON --- */}
      {isEditing && (
        <button
          onClick={addCard}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all w-fit"
        >
          <HiOutlinePlus /> Add Testimonial
        </button>
      )}

      {/* --- TESTIMONIAL CARDS --- */}
      <div className="flex flex-col gap-6">
        {content.cards.map((card, index) => (
          <div
            key={index}
            className="p-6 bg-gray-900/30 border border-gray-800 rounded-2xl flex flex-col gap-4"
          >
            <div className="flex justify-between items-center mb-2">
              <label className="text-[10px] text-gray-500 font-bold uppercase">
                Card {index + 1}
              </label>
              {isEditing && (
                <button
                  onClick={() => deleteCard(index)}
                  className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
                >
                  <HiOutlineTrash className="text-sm" />
                </button>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">
                Client Name
              </label>
              <input
                disabled={!isEditing}
                type="text"
                value={card.name}
                onChange={(e) =>
                  handleCardChange(index, "name", e.target.value)
                }
                placeholder="Client name"
                className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${
                  isEditing
                    ? "border-cyan-400"
                    : "border-gray-800 text-gray-400"
                }`}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">
                Company Name
              </label>
              <input
                disabled={!isEditing}
                type="text"
                value={card.company}
                onChange={(e) =>
                  handleCardChange(index, "company", e.target.value)
                }
                placeholder="Company name"
                className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${
                  isEditing
                    ? "border-cyan-400"
                    : "border-gray-800 text-gray-400"
                }`}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">
                Testimonial Text
              </label>
              <textarea
                disabled={!isEditing}
                value={card.text}
                onChange={(e) =>
                  handleCardChange(index, "text", e.target.value)
                }
                placeholder="Testimonial text"
                rows="3"
                className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${
                  isEditing
                    ? "border-cyan-400"
                    : "border-gray-800 text-gray-400"
                }`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* --- FULL PREVIEW SECTION (Only when NOT editing) --- */}
      {!isEditing && (
        <div className="border-t border-gray-800 pt-6">
          <h3 className="text-sm font-bold text-cyan-400 mb-4">Preview</h3>
          <div className="bg-gray-900/50 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-8">{content.heading}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {content.cards.map((card, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 flex flex-col gap-3"
                >
                  <p className="text-sm text-gray-300 italic leading-relaxed">
                    "{card.text}"
                  </p>
                  <div className="border-t border-gray-700 pt-3">
                    <p className="font-bold text-white text-sm">{card.name}</p>
                    <p className="text-xs text-gray-400">{card.company}</p>
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

export default VerifyTestimonials;
