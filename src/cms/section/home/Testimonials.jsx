import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { HiOutlineSave, HiOutlinePencilAlt, HiOutlineX, HiOutlineTrash } from "react-icons/hi";

const Testimonials = ({ sectionData, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);

  console.log("📍 Testimonials sectionData:", sectionData);

  // State initialized with actual backend data structure
  const [content, setContent] = useState({
    heading: sectionData?.heading || "Why Our Clients Choose Us Again & Again",
    cards: sectionData?.cards || [
      {
        name: "Pam Owen",
        company: "BOSS Reporters",
        text: "Varallo has been an absolute game-changer for our business. Their team is responsive, reliable, and genuinely invested in our success. We couldn't ask for a better partner.",
      },
      {
        name: "Mary Beth Johnson",
        company: "Community College of Allegheny County",
        text: "The level of professionalism and attention to detail from Varallo is outstanding. They handle our complex needs with ease and always deliver on time.",
      },
      {
        name: "Sarah Mitchell",
        company: "Legal Associates Group",
        text: "Working with Varallo has streamlined our entire process. Their technology solutions combined with excellent customer service make them indispensable.",
      },
      {
        name: "James Rodriguez",
        company: "Corporate Legal Department",
        text: "We trust Varallo with our most critical cases. Their expertise and dedication ensure every detail is perfect. Highly recommended!",
      },
      {
        name: "Emily Thompson",
        company: "District Court Services",
        text: "The consistency and quality of service from Varallo is exceptional. They've become an essential part of our operations.",
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
          text: "Add testimonial text here...",
        },
      ],
    }));
  };

  const removeCard = (index) => {
    setContent((prev) => ({
      ...prev,
      cards: prev.cards.filter((_, i) => i !== index),
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
      heading: sectionData?.heading || "Why Our Clients Choose Us Again & Again",
      cards: sectionData?.cards || [
        {
          name: "Pam Owen",
          company: "BOSS Reporters",
          text: "Varallo has been an absolute game-changer for our business. Their team is responsive, reliable, and genuinely invested in our success. We couldn't ask for a better partner.",
        },
        {
          name: "Mary Beth Johnson",
          company: "Community College of Allegheny County",
          text: "The level of professionalism and attention to detail from Varallo is outstanding. They handle our complex needs with ease and always deliver on time.",
        },
        {
          name: "Sarah Mitchell",
          company: "Legal Associates Group",
          text: "Working with Varallo has streamlined our entire process. Their technology solutions combined with excellent customer service make them indispensable.",
        },
        {
          name: "James Rodriguez",
          company: "Corporate Legal Department",
          text: "We trust Varallo with our most critical cases. Their expertise and dedication ensure every detail is perfect. Highly recommended!",
        },
        {
          name: "Emily Thompson",
          company: "District Court Services",
          text: "The consistency and quality of service from Varallo is exceptional. They've become an essential part of our operations.",
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
        <h2 className="text-xl font-bold text-cyan-400 uppercase tracking-wider">Testimonials Section</h2>

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

      {/* --- HEADING --- */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Section Heading</label>
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

      {/* --- TESTIMONIAL CARDS --- */}
      <div className="border-t border-gray-800 pt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-cyan-400">Testimonial Cards ({content.cards?.length})</h3>
          {isEditing && (
            <button
              onClick={addCard}
              className="text-xs bg-cyan-500/20 border border-cyan-400 text-cyan-400 px-3 py-1.5 rounded-lg hover:bg-cyan-500/30 transition-all"
            >
              + Add Card
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4">
          {content.cards?.map((card, index) => (
            <div
              key={index}
              className={`bg-[#0b1318] border rounded-xl p-4 ${
                isEditing ? "border-cyan-400/30" : "border-gray-800"
              }`}
            >
              {/* Card Number Badge */}
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-bold text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded">
                  Card {index + 1}
                </span>
                {isEditing && (
                  <button
                    onClick={() => removeCard(index)}
                    className="text-red-400 hover:text-red-300 transition-all"
                  >
                    <HiOutlineTrash size={18} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Name */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-gray-500 font-bold uppercase">Name</label>
                  <input
                    disabled={!isEditing}
                    value={card.name}
                    onChange={(e) => updateCard(index, "name", e.target.value)}
                    placeholder="Client Name"
                    className={`bg-transparent border rounded-lg px-3 py-2 text-sm outline-none text-white ${
                      isEditing ? "border-cyan-400/30" : "border-gray-800"
                    }`}
                  />
                </div>

                {/* Company */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-gray-500 font-bold uppercase">Company</label>
                  <input
                    disabled={!isEditing}
                    value={card.company}
                    onChange={(e) => updateCard(index, "company", e.target.value)}
                    placeholder="Company Name"
                    className={`bg-transparent border rounded-lg px-3 py-2 text-sm outline-none text-white ${
                      isEditing ? "border-cyan-400/30" : "border-gray-800"
                    }`}
                  />
                </div>

                {/* Stars (visual placeholder) */}
                {/* <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-gray-500 font-bold uppercase">Rating</label>
                  <div className="flex items-center gap-1 text-cyan-400">
                    {"★★★★★".split("").map((star, i) => (
                      <span key={i}>{star}</span>
                    ))}
                  </div>
                </div> */}
              </div>

              {/* Testimonial Text */}
              <div className="mt-3">
                <label className="text-[9px] text-gray-500 font-bold uppercase">Testimonial Text</label>
                <textarea
                  disabled={!isEditing}
                  value={card.text}
                  onChange={(e) => updateCard(index, "text", e.target.value)}
                  placeholder="Enter testimonial text..."
                  rows="3"
                  className={`w-full bg-transparent border rounded-lg p-3 text-sm outline-none text-gray-300 mt-1 ${
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
            <div>
              <h2 className="text-2xl font-bold text-white text-center">{content.heading}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {content.cards?.map((card, i) => (
                <div key={i} className="bg-black/50 rounded-lg p-4 border border-gray-800 space-y-2">
                  <div className="flex gap-1 text-cyan-400">{"★★★★★".split("").map((s, j) => <span key={j}>{s}</span>)}</div>
                  <p className="text-xs text-gray-300 line-clamp-3">{card.text}</p>
                  <div className="pt-2 border-t border-gray-700">
                    <p className="text-xs font-bold text-white">{card.name}</p>
                    <p className="text-[10px] text-gray-400">{card.company}</p>
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

export default Testimonials;
