import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { HiOutlineSave, HiOutlinePencilAlt, HiOutlineX, HiOutlineTrash } from "react-icons/hi";

const BooksTestimonials = ({ sectionData, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);

  console.log("📍 BooksTestimonials sectionData:", sectionData);

  const [content, setContent] = useState({
    heading: sectionData?.heading || "What Our Clients Say",
    cards: sectionData?.cards || [
      {
        name: "Satisfied Agency Owner",
        company: "Court Reporting Firm",
        text: "Our bookkeeping has never been cleaner. TVG Books gives us complete peace of mind.",
      },
      {
        name: "Finance Manager",
        company: "Legal Services Company",
        text: "Accurate records, timely reports, and expert guidance. Exactly what we needed.",
      },
      {
        name: "Business Owner",
        company: "Reporting Agency",
        text: "TVG Books helps us understand our financial health and plan for growth.",
      },
      {
        name: "Agency Director",
        company: "Court Services",
        text: "Professional service and attention to detail. Highly recommended!",
      },
      {
        name: "Office Manager",
        company: "Legal Solutions",
        text: "We can finally focus on business growth instead of bookkeeping chaos.",
      },
    ],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContent((prev) => ({ ...prev, [name]: value }));
  };

  const updateCard = (index, field, value) => {
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
          company: "Company Name",
          text: "Testimonial text here...",
        },
      ],
    }));
  };

  const deleteCard = (index) => {
    setContent((prev) => ({
      ...prev,
      cards: prev.cards.filter((_, i) => i !== index),
    }));
    toast.success("Card deleted");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setContent({
      heading: sectionData?.heading || "What Our Clients Say",
      cards: sectionData?.cards || [],
    });
    toast.success("Changes discarded");
  };

  return (
    <div className="flex flex-col gap-8 font-manrope">
      <Toaster />

      <div className="flex justify-between items-center border-b border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-cyan-400 uppercase tracking-wider">
            Testimonials Editor
          </h2>
        </div>

        <div className="flex gap-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all border bg-cyan-500 text-black border-cyan-400"
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
                    console.log("💾 BooksTestimonials final payload:", payload);
                    await onSave(payload);
                    setIsEditing(false);
                    toast.success("Saved successfully!");
                  } catch (err) {
                    console.error("❌ Error saving:", err);
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

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">
            Main Heading
          </label>
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
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-cyan-400">Testimonial Cards</h3>
          {isEditing && (
            <button
              onClick={addCard}
              className="px-4 py-2 bg-cyan-500 text-black rounded-lg text-sm font-bold hover:bg-cyan-400 transition-all"
            >
              + Add Card
            </button>
          )}
        </div>

        {content.cards.map((card, index) => (
          <div
            key={index}
            className="bg-gray-900/30 border border-gray-800 rounded-xl p-4 space-y-3"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Card {index + 1}</span>
              {isEditing && (
                <button
                  onClick={() => deleteCard(index)}
                  className="text-red-400 hover:text-red-300 transition-all"
                >
                  <HiOutlineTrash />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                disabled={!isEditing}
                value={card.name}
                onChange={(e) => updateCard(index, "name", e.target.value)}
                placeholder="Client Name"
                className={`bg-transparent border rounded-lg px-3 py-2 text-sm outline-none transition-all ${
                  isEditing ? "border-cyan-400" : "border-gray-800 text-gray-400"
                }`}
              />
              <input
                disabled={!isEditing}
                value={card.company}
                onChange={(e) => updateCard(index, "company", e.target.value)}
                placeholder="Company Name"
                className={`bg-transparent border rounded-lg px-3 py-2 text-sm outline-none transition-all ${
                  isEditing ? "border-cyan-400" : "border-gray-800 text-gray-400"
                }`}
              />
            </div>

            <textarea
              disabled={!isEditing}
              value={card.text}
              onChange={(e) => updateCard(index, "text", e.target.value)}
              placeholder="Testimonial text..."
              rows="3"
              className={`w-full bg-transparent border rounded-lg px-3 py-2 text-sm outline-none transition-all ${
                isEditing ? "border-cyan-400" : "border-gray-800 text-gray-400"
              }`}
            />
          </div>
        ))}
      </div>

      {!isEditing && (
        <div className="border-t border-gray-800 pt-6">
          <h3 className="text-sm font-bold text-cyan-400 mb-4">Preview</h3>
          <div className="bg-gray-900/50 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">{content.heading}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {content.cards.map((card, index) => (
                <div
                  key={index}
                  className="bg-gray-800/50 rounded-lg p-4 border border-gray-700"
                >
                  <p className="text-sm text-gray-300 mb-3 italic">"{card.text}"</p>
                  <div className="border-t border-gray-700 pt-3">
                    <p className="font-semibold text-cyan-400 text-sm">{card.name}</p>
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

export default BooksTestimonials;
