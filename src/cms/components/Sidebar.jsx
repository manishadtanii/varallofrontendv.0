import React, { useState } from "react";
import { 
  HiChevronDown, 
  HiChevronRight, 
  HiOutlineHome, 
  HiOutlineBriefcase, 
  HiOutlineMail, 
  HiOutlineViewGrid,
  HiOutlineDatabase
} from "react-icons/hi";

const Sidebar = () => {
  // Simple state to track which menu is open
  const [openMenu, setOpenMenu] = useState("home");

  const toggle = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <div className="w-80 flex flex-col gap-4 sticky top-6">
      <div className="bg-[#0a0f14]/80 border border-gray-800 rounded-[30px] p-6 h-[calc(100vh-48px)] overflow-y-auto custom-scrollbar shadow-2xl">
        
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-2 mb-8 border-b border-gray-800 pb-6">
          <img src="/icon2.png" alt="Logo" className="w-8 h-8" />
          <h2 className="text-lg font-bold tracking-tight text-white">The Varallo Group</h2>
        </div>

        <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4 px-2">Main Pages</p>

        {/* HOMEPAGE */}
        <div className="mb-2">
          <button 
            onClick={() => toggle("home")} 
            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all border ${openMenu === "home" ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" : "hover:bg-white/5 text-gray-400 border-transparent"}`}
          >
            <div className="flex items-center gap-3">
              <HiOutlineHome className="text-xl" />
              <span className="text-sm font-bold uppercase tracking-widest">Homepage</span>
            </div>
            {openMenu === "home" ? <HiChevronDown /> : <HiChevronRight />}
          </button>
          {openMenu === "home" && (
            <div className="ml-9 mt-2 flex flex-col gap-1 border-l border-gray-800">
              {["Hero", "Experience", "Services", "Trust", "Capabilities", "Testimonials"].map((sec) => (
                <button key={sec} className="text-left px-4 py-2 text-xs font-medium text-gray-500 hover:text-white transition-all">
                  {sec}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ABOUT US */}
        <div className="mb-2">
          <button 
            onClick={() => toggle("about")} 
            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all border ${openMenu === "about" ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" : "hover:bg-white/5 text-gray-400 border-transparent"}`}
          >
            <div className="flex items-center gap-3">
              <HiOutlineBriefcase className="text-xl" />
              <span className="text-sm font-bold uppercase tracking-widest">About Us</span>
            </div>
            {openMenu === "about" ? <HiChevronDown /> : <HiChevronRight />}
          </button>
          {openMenu === "about" && (
            <div className="ml-9 mt-2 flex flex-col gap-1 border-l border-gray-800">
              {["Hero", "Our Story", "Team"].map((sec) => (
                <button key={sec} className="text-left px-4 py-2 text-xs font-medium text-gray-500 hover:text-white transition-all">
                  {sec}
                </button>
              ))}
            </div>
          )}
        </div>

        <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] my-6 px-2 border-t border-gray-800 pt-6">TVG Services Sub-Pages</p>

        {/* MANAGEMENT */}
        <div className="mb-2">
          <button 
            onClick={() => toggle("management")} 
            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all border ${openMenu === "management" ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" : "hover:bg-white/5 text-gray-400 border-transparent"}`}
          >
            <div className="flex items-center gap-3">
              <HiOutlineDatabase className="text-xl" />
              <span className="text-sm font-bold uppercase tracking-widest">Management</span>
            </div>
            {openMenu === "management" ? <HiChevronDown /> : <HiChevronRight />}
          </button>
          {openMenu === "management" && (
            <div className="ml-9 mt-2 flex flex-col gap-1 border-l border-gray-800">
              {["Hero", "Overview", "Provide", "Tvg Effect", "Testimonials"].map((sec) => (
                <button key={sec} className="text-left px-4 py-2 text-xs font-medium text-gray-500 hover:text-white transition-all">
                  {sec}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 px-2">
           <div className="text-[9px] text-gray-700 font-bold uppercase tracking-widest">CMS System v1.2</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;