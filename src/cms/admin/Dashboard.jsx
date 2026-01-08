import React, { useState, useEffect } from "react";
import SectionEditor from "../components/SectionEditor"; // The component created in the previous step
import toast, { Toaster } from "react-hot-toast";
import {
  HiOutlineHome,
  HiOutlineBriefcase,
  HiOutlineViewGrid,
  HiOutlineDatabase,
  HiChevronDown,
  HiChevronRight,
  HiOutlineUserCircle,
} from "react-icons/hi";
// 1. Import your custom section components
import Hero from "../section/home/Hero";
import Experience from "../section/home/Experience";
import Services from "../section/home/Services";
import Trust from "../section/home/Trust";
import Capabilities from "../section/home/Capabilities";
import Testimonials from "../section/home/Testimonials";
const Dashboard = () => {
  const [activePage, setActivePage] = useState("home");
  const [activeId, setActiveId] = useState("Hero");
  const [openMenu, setOpenMenu] = useState("home");
  const [cmsData, setCmsData] = useState({});

  // Toggle dropdowns in sidebar
  const toggle = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  // 2. Logic to pick the right component based on the sidebar selection
  const renderActiveEditor = () => {
    // This looks at the activeId set by your sidebar buttons
    switch (activeId) {
      case "Hero":
        return (
          <Hero sectionData={activeSectionData} onSave={handleUpdateSection} />
        );
      case "Experience":
        return (
          <Experience
            sectionData={activeSectionData}
            onSave={handleUpdateSection}
          />
        );
      case "Services":
        return (
          <Services
            sectionData={activeSectionData}
            onSave={handleUpdateSection}
          />
        );
      case "Trust":
        return (
          <Trust sectionData={activeSectionData} onSave={handleUpdateSection} />
        );
      case "Capabilities":
        return (
          <Capabilities
            sectionData={activeSectionData}
            onSave={handleUpdateSection}
          />
        );
      case "Testimonials":
        return (
          <Testimonials
            sectionData={activeSectionData}
            onSave={handleUpdateSection}
          />
        );
      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-500 border-2 border-dashed border-gray-800 rounded-3xl">
            <p>Select a valid section to begin editing.</p>
          </div>
        );
    }
  };

  // Logic to handle saving (linked to your API logic)
  const handleUpdateSection = async (updatedData) => {
    console.log("Saving to:", activePage, activeId, updatedData);
    // Add your fetch/patch logic here as per your API service
    toast.success(`Saved ${activeId} successfully!`);
  };

  // Helper to find specific section data from your state
  const activeSectionData =
    (cmsData[activePage] || []).find((s) => s.id === activeId) || {};

  return (
    <div className="flex min-h-screen bg-[#05080a] text-white p-6 gap-6 font-manrope">
      {/* --- SIDEBAR (Hardcoded as we discussed) --- */}
      <aside className="w-80 flex flex-col gap-4 sticky top-6">
        {/* --- SIDEBAR --- */}
        <div className="w-80 flex flex-col gap-4 sticky top-6">
          <div className="bg-[#0a0f14]/80 border border-gray-800 rounded-[30px] p-6 h-[calc(100vh-48px)] overflow-y-auto custom-scrollbar">
            <div className="flex items-center gap-3 px-2 mb-8 border-b border-gray-800 pb-6">
              <img src="/icon2.png" alt="Logo" className="w-8 h-8" />
              <h2 className="text-lg font-bold text-white">
                The Varallo Group
              </h2>
            </div>

            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-4 px-2">
              Main Pages
            </p>

            {/* Homepage Toggle */}
            <div className="mb-2">
              <button
                onClick={() => toggle("home")}
                className={`w-full flex items-center justify-between p-3 rounded-xl border ${
                  activePage === "home"
                    ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                    : "text-gray-400 border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <HiOutlineHome className="text-xl" />
                  <span className="text-sm font-bold uppercase">Homepage</span>
                </div>
                {openMenu === "home" ? <HiChevronDown /> : <HiChevronRight />}
              </button>
              {openMenu === "home" && (
                <div className="ml-9 mt-2 flex flex-col gap-1 border-l border-gray-800">
                  {[
                    "Hero",
                    "Experience",
                    "Services",
                    "Trust",
                    "Capabilities",
                    "Testimonials",
                  ].map((sec) => (
                    <button
                      key={sec}
                      onClick={() => {
                        setActivePage("home");
                        setActiveId(sec);
                      }}
                      className={`text-left px-4 py-2 text-xs font-medium transition-all ${
                        activeId === sec && activePage === "home"
                          ? "text-cyan-400 border-l-2 border-cyan-400 -ml-[2px]"
                          : "text-gray-500 hover:text-white"
                      }`}
                    >
                      {sec}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Management Toggle */}
            <div className="mb-2">
              <button
                onClick={() => toggle("management")}
                className={`w-full flex items-center justify-between p-3 rounded-xl border ${
                  activePage === "services/tvg-management"
                    ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                    : "text-gray-400 border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <HiOutlineDatabase className="text-xl" />
                  <span className="text-sm font-bold uppercase">
                    Management
                  </span>
                </div>
                {openMenu === "management" ? (
                  <HiChevronDown />
                ) : (
                  <HiChevronRight />
                )}
              </button>
              {openMenu === "management" && (
                <div className="ml-9 mt-2 flex flex-col gap-1 border-l border-gray-800">
                  {[
                    "Hero",
                    "Overview",
                    "Provide",
                    "Tvg Effect",
                    "Testimonials",
                  ].map((sec) => (
                    <button
                      key={sec}
                      onClick={() => {
                        setActivePage("services/tvg-management");
                        setActiveId(sec);
                      }}
                      className={`text-left px-4 py-2 text-xs font-medium transition-all ${
                        activeId === sec &&
                        activePage === "services/tvg-management"
                          ? "text-cyan-400 border-l-2 border-cyan-400 -ml-[2px]"
                          : "text-gray-500 hover:text-white"
                      }`}
                    >
                      {sec}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        <header className="flex items-center justify-between bg-[#0a0f14]/80 border border-gray-800 rounded-[30px] px-8 py-4">
          <h1 className="text-xl font-bold uppercase">
            Editing: <span className="text-cyan-400">{activeId}</span>
          </h1>
        </header>

        <div className="flex-1 bg-[#0a0f14]/80 border border-gray-800 rounded-[40px] p-10 overflow-y-auto custom-scrollbar">
          {/* 3. The magic happens here: the dashboard swaps the component based on activeId */}
          <div key={`${activePage}-${activeId}`}>{renderActiveEditor()}</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
