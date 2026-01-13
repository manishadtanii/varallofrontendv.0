import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPhone, FiMail, FiClock, FiMapPin } from "react-icons/fi";
import { FaLinkedin, FaFacebook, FaChevronDown } from "react-icons/fa";
import Arrow from "../../components/Arrow";
import Select from "react-select";
import Form from "./FormSubmit";

const ContactUs = ({ data }) => {
  if (!data) return null;
  console.log("ContactUs data:", data);
  const { heading, subHeading, infoCard, map, emailSchedulingText, emailScheduling, emailProductionText, emailProduction, emailInvoicingText, emailInvoicing, emailVideoText, emailVideo, emailMarketingText, emailMarketing, emailGeneralText, emailGeneral } = data;
  const [open, setOpen] = useState(false);

  const services = [
    { name: emailSchedulingText || "Scheduling", email: emailScheduling || "schedule@thevarallogroup.com" },
    { name: emailProductionText || "Production", email: emailProduction || "production@thevarallogroup.com" },
    { name: emailInvoicingText || "Invoicing", email: emailInvoicing || "invoices@thevarallogroup.com" },
    { name: emailVideoText || "Video", email: emailVideo || "video@thevarallogroup.com" },
    { name: emailMarketingText || "Marketing", email: emailMarketing || "cedar@thevarallogroup.com" },
    { name: emailGeneralText || "General Inquiries", email: emailGeneral || "info@thevarallogroup.com" },
  ];
  const options = [
     { value: "Court Reporter", label: "Court Reporter" },
    { value: "Videographer", label: "Videographer" },
    { value: "Interactive Realtime In Person", label: "Interactive Realtime In Person" },
    { value: "Streaming Realtime", label: "Streaming Realtime" },
    { value: "Daily Draft", label: "Daily Draft" },
    { value: "Expedited Delivery", label: "Expedited Delivery" },
    { value: "Extra Laptop for Witness", label: "Extra Laptop for Witness" },
  ];
  const handleSelectionChange = (selected) => {
    console.log("Selected:", selected);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.6 },
    }),
  };

  return (
    <section>
      <div className="container-fluid">
        {/* Header */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-h2 font-parkinsans font-semibold">{heading? heading :"Contact Us"}</h2>
          <p className="font-manrope text-sm lg:text-xl mt-2">
            {subHeading? subHeading : "Reach out today, we’ll map the way forward with clear strategies and reliable assistance."}
          </p>
        </motion.div>

        {/* Grid Layout */}
        <div className="grid lg:grid-cols-3 gap-8 ">
          <div className="">
            {/* Left Info Card */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-white rounded-2xl p-4 md:p-8 flex flex-col justify-between bg-grad"
            >
              <div>
                <h3 className="text-[32px] font-manrope font-semibold">
                  {infoCard?.title ? infoCard.title : "You tell us. We Listen."}
                </h3>
                <p className="mb-4 font-manrope text-p lg:text-xl">
                  {infoCard?.description ? infoCard.description : "Rely on our team to help your business succeed."}
                </p>

                <div className="space-y-4 mt-8">
                  {/* Working Hours */}
                  {/* <div className="flex gap-4">
                    <div className="bg-btn w-14 h-14 rounded flex items-center justify-center">
                      <FiClock className="text-2xl" />
                    </div>
                    <p>
                      <strong className="font-manrope text-p font-medium">
                        Working Hours:
                      </strong>
                      <br />
                      <span className="text-[#ffffffb9] lg:text-xl mt-1 block">
                        Mon-Fri 8:00am - 5:00 pm ET
                      </span>
                    </p>
                  </div> */}

                  {/* Office Address */}
                  <div className="flex gap-4">
                    <div className="bg-btn w-14 h-14 rounded flex items-center justify-center">
                      <FiMapPin className="text-2xl" />
                    </div>
                    <p>
                      <strong className="font-manrope text-p font-medium">
                        {/* {console.log("infoCard address:", infoCard.contactDetails[0])} */}
                        {infoCard.contactDetails[0] ? infoCard.contactDetails[0].label : "Office Address:"}
                      </strong>
                      <br />
                      <span className="text-[#ffffffb9] lg:text-xl mt-1 block max-w-64">
                        {infoCard.contactDetails[0] ? infoCard.contactDetails[0].value : ``}
                      </span>
                    </p>
                  </div>

                  {/* Phone */}
                  <div className="flex gap-4">
                    <div className="bg-btn w-14 h-14 rounded flex items-center justify-center">
                      <FiPhone className="text-2xl" />
                    </div>
                    <p>
                      <strong className="font-manrope text-p font-medium">
                        
                                                {infoCard.contactDetails[1] ? infoCard.contactDetails[1].label : "Call us:"}
                      </strong>
                      <br />
                      <span className="text-[#ffffffb9] lg:text-xl mt-1 block">
                        <a href={`tel:${infoCard.contactDetails[1] ? infoCard.contactDetails[1].value : ``}`}>
                          {infoCard.contactDetails[1] ? infoCard.contactDetails[1].value : ``}
                        </a>
                                                
                      </span>
                    </p>
                  </div>

                  {/* Email Dropdown */}
                  <div className="flex items-start gap-3 relative">
                    <div className="bg-btn w-14 h-14 rounded flex items-center justify-center">
                      <FiMail className="text-2xl" />
                    </div>

                    <div>
                      <button
                        onClick={() => setOpen(!open)}
                        className="flex items-center gap-2 font-manrope text-p font-medium text-white"
                      >
                        Email us
                        <FaChevronDown
                          className={`transition-transform duration-300 ${
                            open ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <span className="text-[#ffffffb9] lg:text-xl mt-1 block">
                        Select services
                      </span>

                      <AnimatePresence>
                        {open && (
                          <motion.ul
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="absolute bg-white text-gray-800 shadow-lg rounded-lg mt-3 w-56 z-20 border"
                          >
                            {services.map((service, index) => (
                              <li
                                key={index}
                                className="px-4 py-2 hover:bg-blue-500 hover:text-white cursor-pointer transition"
                              >
                                <a
                                  href={`mailto:${service.email?.trim()}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {service.name}
                                </a>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>

              {/* Socials */}
              {console.log("infoCard socials:", infoCard.socialLinks[0].url)}
              <div className="flex gap-4 mt-10">
                <a href={infoCard.socialLinks[0].url} className="bg-btn p-3 rounded-full">
                  <FaLinkedin className="text-white text-xl" />
                </a>
                <a href={infoCard.socialLinks[1].url} className="bg-btn p-3 rounded-full">
                  <FaFacebook className="text-white text-xl" />
                </a>
              </div>
            </motion.div>
            {/* Map */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              className="mt-6 h-full"
            >
              <iframe
                className="w-full h-96 rounded-2xl"
                src={map['embedUrl']}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </motion.div>
          </div>

          {/* Right Contact Form */}
          <div className="lg:col-span-2" id="contact-main">
         <Form/>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
