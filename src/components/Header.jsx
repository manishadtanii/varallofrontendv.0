import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faXmark,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import ResourcePortalModal from "./ResourcePortalModal";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [portalOpen, setPortalOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      name: "Home",
      path: "/",
      // submenu: [
      //   { name: "Our Expertise", path: "/#our-expertise" },
      //   { name: "Services", path: "/#services" },
      //   { name: "Metrics", path: "/#metrics" },
      //   { name: "Featured", path: "/#featured" },
      //   { name: "Testimonials", path: "/#testimonials" },
      //   { name: "Our Blog", path: "/#our-blog" },
      // ],
    },
    {
      name: "About Us",
      path: "/about",
      // submenu: [
      //   { name: "Mission", path: "/about#mission" },
      //   { name: "Vision", path: "/about#vision" },
      //   { name: "Our Story", path: "/about#our-story" },
      //   { name: "Our Founder", path: "/about#founder" },
      //   { name: "Our Experts", path: "/about#team" },
      // ],
    },
    {
      name: "Services",
      path: "/services",
      submenu: [
        { name: "TVG Management", path: "/services/tvg-management" },
        { name: "TVG Stream", path: "/services/tvg-stream" },
        { name: "TVG Books  ", path: "/services/tvg-books" },
        { name: "TVG Connect", path: "/services/tvg-connect" },
        { name: "TVG Verify", path: "/services/tvg-verify" },
        // { name: "TVG Creative", path: "/services/tvg-creative" },
        { name: "TVG Reporting", path: "/services/tvg-reporting" },
        // { name: "TVG Command", path: "/services/tvg-command" },
      ],
    },
    // {
    //   name: "Blog",
    //   path: "/blog",
    //   submenu: [
    //     { name: "Trending Blogs", path: "/blog#trending-blogs" },
    //     { name: "Latest Blogs", path: "/blog#latest-blogs" },
    //     { name: "Popular Blogs", path: "/blog#popular-blogs" },
    //   ],
    // },
    {
      name: "Contact Us",
      path: "/contact",
    },
  ];

  const normalize = (p) => {
    if (!p) return "";
    if (p !== "/" && p.endsWith("/")) return p.slice(0, -1);
    return p;
  };

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 120);
      }
    }
  }, [location]);

  useEffect(() => {
    let lastScrollTop = 0;
    const handleScroll = () => {
      const header = document.getElementById("header");
      if (!header) return;

      const st = window.pageYOffset || document.documentElement.scrollTop;
      header.style.transform =
        st > lastScrollTop && st > 50 ? "translateY(-100%)" : "translateY(0)";
      lastScrollTop = st <= 0 ? 0 : st;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const renderLink = (sub, className = "", closeMenu = true) => {
    const hasHash = sub.path.includes("#");
    if (!hasHash) {
      return (
        <Link
          key={sub.path}
          to={sub.path}
          className={className}
          onClick={() => {
            if (closeMenu) setIsOpen(false);
            setOpenDropdown(null);
          }}
        >
          {sub.name}
        </Link>
      );
    }

    const [pathnamePart, hashPartRaw] = sub.path.split("#");
    const pathname = normalize(pathnamePart || "");
    const hash = hashPartRaw || "";
    const isSamePage = normalize(location.pathname) === pathname;

    if (isSamePage) {
      return (
        <a
          key={sub.path}
          href={sub.path}
          className={className}
          onClick={(e) => {
            e.preventDefault();
            const el = document.getElementById(hash);
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "start" });
              window.history.pushState(null, "", `${pathname}#${hash}`);
            }
            if (closeMenu) setIsOpen(false);
            setOpenDropdown(null);
          }}
        >
          {sub.name}
        </a>
      );
    }

    return (
      <Link
        key={sub.path}
        to={`${pathname || ""}#${hash}`}
        className={className}
        onClick={() => {
          if (closeMenu) setIsOpen(false);
          setOpenDropdown(null);
        }}
      >
        {sub.name}
      </Link>
    );
  };

  return (
    <motion.header
      className="bg-black text-white sticky top-0 z-50"
      id="header"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-[1600px] mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link to="/">
            <img src="/logo.png" alt="Logo" className="h-14" />
          </Link>
        </motion.div>

        {/* Hamburger Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden"
          whileTap={{ scale: 0.9, rotate: isOpen ? 90 : 0 }}
        >
          <FontAwesomeIcon icon={isOpen ? faXmark : faBars} size="lg" />
        </motion.button>

        {/* Desktop Nav */}
        <motion.div
          className="hidden lg:flex items-center justify-between flex-1 gap-8 mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <nav className="flex gap-6 text-lg font-medium mx-auto relative">
            {menuItems.map((item, idx) => (
              <div
                key={idx}
                className="relative group"
                onMouseEnter={() => setOpenDropdown(idx)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <div className="flex items-center gap-1 cursor-pointer">
                  <Link className="font-manrope" to={item.path}>
                    {item.name}
                  </Link>
                  {item.submenu && (
                    <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
                  )}
                </div>
                <AnimatePresence>
                  {openDropdown === idx && item.submenu && (
                    <motion.div
                      className="absolute left-0 mt-2 bg-white text-black rounded-lg shadow-lg p-3 w-52"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      {item.submenu.map((sub) =>
                        renderLink(
                          sub,
                          "block px-3 py-2 rounded-md hover:bg-[#48cae49c]",
                          false
                        )
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          <div className="flex gap-3">
            <button
              className="border border-white rounded-full px-5 py-2 text-lg font-manrope hover:bg-white hover:text-black transition"
              onClick={() => setPortalOpen(true)}
            >
              Resource Portal
            </button>
            <a
              href="https://api.ipospays.com/v1/sl/1qM3y_011025163407"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white rounded-full px-5 py-2 text-lg font-manrope hover:bg-white hover:text-black transition"
            >
              Pay Invoice
            </a>
          </div>
        </motion.div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="lg:hidden px-4 pb-4"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* {menuItems.map((item, idx) => (
              <div key={idx}>
                <Link
                  to={item.path}
                  className="flex justify-between w-full py-2 border-b border-gray-700"
                  onClick={() => setOpenDropdown(openDropdown === idx ? null : idx)}
                >
                  {item.name}
                  {item.submenu && (
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className={`transition-transform ${openDropdown === idx ? "rotate-180" : ""}`}
                    />
                  )}
                </Link>
                <AnimatePresence>
                  {openDropdown === idx && item.submenu && (
                    <motion.div
                      className="pl-4 flex flex-col gap-2 py-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      {item.submenu.map((sub) =>
                        renderLink(sub, "text-sm py-1 border-b border-gray-700", true)
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))} */}
            {/* {menuItems.map((item, idx) => (
              <div key={idx}>
                {item.submenu ? (
                  // Has submenu → render button with dropdown
                  <>
                    <button
                      className="flex justify-between w-full py-2 border-b border-gray-700"
                      onClick={() =>
                        setOpenDropdown(openDropdown === idx ? null : idx)
                      }
                    >
                      {item.name}
                      <FontAwesomeIcon
                        icon={faChevronDown}
                        className={`transition-transform ${
                          openDropdown === idx ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {openDropdown === idx && (
                        <motion.div
                          className="pl-4 flex flex-col gap-2 py-2"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          {item.submenu.map((sub) =>
                            renderLink(
                              sub,
                              "text-sm py-1 border-b border-gray-700",
                              true
                            )
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  // No submenu → render as Link directly
                  <Link
                    to={item.path}
                    className="flex justify-between w-full py-2 border-b border-gray-700"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))} */}
            {menuItems.map((item, idx) => (
  <div key={idx}>
    {item.submenu ? (
      // Has submenu → text as Link, arrow as dropdown toggle
      <>
        <div className="flex justify-between items-center w-full border-b border-gray-700 py-2">
          {/* Text → acts as a link */}
          <Link
            to={item.path || "#"} // you can add a main path if needed
            className="flex-1"
            onClick={() => setIsOpen(false)}
          >
            {item.name}
          </Link>

          {/* Arrow → toggles submenu */}
          <button
            onClick={() =>
              setOpenDropdown(openDropdown === idx ? null : idx)
            }
          >
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`transition-transform ml-2 ${
                openDropdown === idx ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Dropdown submenu */}
        <AnimatePresence>
          {openDropdown === idx && (
            <motion.div
              className="pl-4 flex flex-col gap-2 py-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              {item.submenu.map((sub) =>
                renderLink(
                  sub,
                  "text-sm py-1 border-b border-gray-700",
                  true
                )
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </>
    ) : (
      // No submenu → render as Link directly
      <Link
        to={item.path}
        className="flex justify-between w-full py-2 border-b border-gray-700"
        onClick={() => setIsOpen(false)}
      >
        {item.name}
      </Link>
    )}
  </div>
))}


            <div className="mt-4 flex flex-col gap-3">
              <button
                className="border border-white rounded-full px-5 py-2 text-sm text-center hover:bg-white hover:text-black transition"
                onClick={() => setPortalOpen(true)}
              >
                Resource Portal
              </button>
              <a
                href="https://api.ipospays.com/v1/sl/1qM3y_011025163407"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white rounded-full px-5 py-2 text-sm text-center hover:bg-white hover:text-black transition"
                onClick={() => setIsOpen(false)}
              >
                Pay Invoice
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <ResourcePortalModal
        isOpen={portalOpen}
        onClose={() => setPortalOpen(false)}
      />
    </motion.header>
  );
};

export default Header;
