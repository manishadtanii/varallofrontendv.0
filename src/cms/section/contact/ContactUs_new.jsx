import React, { useState, useRef, useEffect } from "react";
import toast, {Toaster} from "react-hot-toast";
import { HiOutlineUpload, HiOutlineSave, HiOutlinePencilAlt, HiOutlineX, HiOutlineEye } from "react-icons/hi";

const ContactUs = ({ sectionData, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showReference, setShowReference] = useState(false);
  const mainFileRef = useRef(null);

  console.log("📄 Contact Us sectionData:", sectionData);
  
  // Helper: normalize incoming sectionData into component content shape
  const buildContentFromSection = (sd = {}) => {
    // Extract from nested structure
    const infoCard = sd.infoCard || {};
    const contactDetails = Array.isArray(infoCard.contactDetails) ? infoCard.contactDetails : [];
    const socialLinks = Array.isArray(infoCard.socialLinks) ? infoCard.socialLinks : [];
    const formData = sd.formData || {};
    const map = sd.map || {};
    const services = Array.isArray(contactDetails[2]?.services) ? contactDetails[2].services : [];

    // Extract address and phone from contactDetails
    const addressText = contactDetails[0]?.value || "34 Grafton Street, Suite 2 Millbury, MA 01527";
    const callText = contactDetails[1]?.value || "508.753.9282";

    // Extract email services
    const emailSchedulingText = services[0]?.label || "Scheduling";
    const emailScheduling = services[0]?.value || "schedule@thevarallogroup.com";
    const emailProductionText = services[1]?.label || "Production";
    const emailProduction = services[1]?.value || "production@thevarallogroup.com";
    const emailInvoicingText = services[2]?.label || "Invoicing";
    const emailInvoicing = services[2]?.value || "invoices@thevarallogroup.com";
    const emailVideoText = services[3]?.label || "Video";
    const emailVideo = services[3]?.value || "video@thevarallogroup.com";
    const emailMarketingText = services[4]?.label || "Marketing";
    const emailMarketing = services[4]?.value || "cedar@thevarallogroup.com";
    const emailGeneralText = services[5]?.label || "General Inquiries";
    const emailGeneral = services[5]?.value || "info@thevarallogroup.com";

    return {
      heading: sd.heading || "Contact Us",
      desc: sd.subHeading || "Reach out today, we'll map the way forward with clear strategies and reliable assistance.",
      headingSchedule: formData.subHeading || "Schedule a deposition",
      descSchedule: formData.description || "Once you submit your request, we'll send a confirmation email within 24 hours. If you haven't received it by then, please contact our office to confirm we've received your scheduling request.",
      headingSidebar: infoCard.title || "You tell us. We Listen.",
      descSidebar: infoCard.description || "Rely on our team to help your business succeed.",
      addressText,
      addressLink: "https://maps.google.com/",
      callText,
      emailSchedulingText,
      emailScheduling,
      emailProductionText,
      emailProduction,
      emailInvoicingText,
      emailInvoicing,
      emailVideoText,
      emailVideo,
      emailMarketingText,
      emailMarketing,
      emailGeneralText,
      emailGeneral,
      faceBookLink: socialLinks[1]?.url || "https://www.facebook.com/",
      linkedinLink: socialLinks[0]?.url || "https://www.linkedin.com/",
      mapLink: map.embedUrl || "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d5912.049902837201!2d-71.746638!3d42.192534!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e40f9a42b7bfe5%3A0x3178cc10b1995a2!2s34%20Grafton%20St%2C%20Millbury%2C%20MA%2001527!5e0!3m2!1sen!2sus!4v1767883263142!5m2!1sen!2sus",
    };
  };

  // State initialized with normalized content
  const [content, setContent] = useState(buildContentFromSection(sectionData));

  // Update content when sectionData changes
  useEffect(() => {
    if (sectionData && Object.keys(sectionData).length > 0) {
      setContent(buildContentFromSection(sectionData));
      console.log("✅ Contact Us content updated from sectionData");
    }
  }, [sectionData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      console.log("💾 Saving Contact Us data:", content);
      await onSave(content);
      setIsEditing(false);
      console.log("✅ Contact Us data saved successfully");
    } catch (error) {
      console.error("❌ Error saving Contact Us data:", error);
    }
  };

  const handleImageUpdate = (key, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const maxSize = 1 * 1024 * 1024; // 1MB
    if (file.size > maxSize) {
      toast.error("File size must be less than 1MB");
      return;
    }
    const url = URL.createObjectURL(file);
    setContent(prev => ({ ...prev, [key]: url, [`${key}File`]: file }));
  };

  const handleCancel = () => {
    setContent(buildContentFromSection(sectionData));
    setIsEditing(false);
    toast.success("Changes discarded");
  };

  return (
    <div className="flex flex-col gap-8 font-manrope">
      <Toaster />
      {/* --- HEADER --- */}
      <div className="flex justify-between items-center border-b border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-cyan-400 uppercase tracking-wider">Section Editor</h2>
          
        </div>
        
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

      {/* --- MAIN SECTION --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Main Heading</label>
            <input disabled={!isEditing} name="heading" value={content.heading} placeholder="" onChange={handleChange} className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${isEditing ? 'border-cyan-400' : 'border-gray-800 text-gray-400'}`} />
          </div>
           <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Description</label>
            <textarea disabled={!isEditing} name="desc" value={content.desc} placeholder="" onChange={handleChange} rows="3" className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${isEditing ? 'border-cyan-400' : 'border-gray-800 text-gray-400'}`} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Schedule Heading</label>
            <input disabled={!isEditing} name="headingSchedule" value={content.headingSchedule} placeholder="" onChange={handleChange} className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${isEditing ? 'border-cyan-400' : 'border-gray-800 text-gray-400'}`} />
          </div>
           <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Schedule Description</label>
            <textarea disabled={!isEditing} name="descSchedule" value={content.descSchedule} placeholder="" onChange={handleChange} rows="3" className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${isEditing ? 'border-cyan-400' : 'border-gray-800 text-gray-400'}`} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Sidebar Heading</label>
            <input disabled={!isEditing} name="headingSidebar" value={content.headingSidebar} placeholder="" onChange={handleChange} className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${isEditing ? 'border-cyan-400' : 'border-gray-800 text-gray-400'}`} />
          </div>
           <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Sidebar Description</label>
            <textarea disabled={!isEditing} name="descSidebar" value={content.descSidebar} placeholder="" onChange={handleChange} rows="3" className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${isEditing ? 'border-cyan-400' : 'border-gray-800 text-gray-400'}`} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">headingSchedule</label>
            <input disabled={!isEditing} name="desc" value={content.desc} placeholder="" onChange={handleChange} className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${isEditing ? 'border-cyan-400' : 'border-gray-800 text-gray-400'}`} />
          </div>
         <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Number</label>
            <input disabled={!isEditing} name="callText" value={content.callText} placeholder="" onChange={handleChange} className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${isEditing ? 'border-cyan-400' : 'border-gray-800 text-gray-400'}`} />
            </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Address Text</label>
             <textarea disabled={!isEditing} name="addressText" value={content.addressText} placeholder="" onChange={handleChange} rows="3" className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${isEditing ? 'border-cyan-400' : 'border-gray-800 text-gray-400'}`} />
            </div>
              <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Address Link</label>
             <textarea disabled={!isEditing} name="addressLink" value={content.addressLink} placeholder="" onChange={handleChange} rows="3" className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${isEditing ? 'border-cyan-400' : 'border-gray-800 text-gray-400'}`} />
            </div>
           
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Scheduling Text</label>
            <input disabled={!isEditing} name="emailSchedulingText" value={content.emailSchedulingText} placeholder="" onChange={handleChange} className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${isEditing ? 'border-cyan-400' : 'border-gray-800 text-gray-400'}`} />
            </div>
            <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Scheduling Mail</label>
            <input disabled={!isEditing} name="emailScheduling" value={content.emailScheduling} placeholder="" onChange={handleChange} className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${isEditing ? 'border-cyan-400' : 'border-gray-800 text-gray-400'}`} />
            </div>
           
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Production Text</label>
            <input disabled={!isEditing} name="emailProductionText" value={content.emailProductionText} placeholder="" onChange={handleChange} className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${isEditing ? 'border-cyan-400' : 'border-gray-800 text-gray-400'}`} />
            </div>
            <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Production Mail</label>
            <input disabled={!isEditing} name="emailProduction" value={content.emailProduction} placeholder="" onChange={handleChange} className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${isEditing ? 'border-cyan-400' : 'border-gray-800 text-gray-400'}`} />
            </div>
           
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Invoicing Text</label>
            <input disabled={!isEditing} name="emailInvoicingText" value={content.emailInvoicingText} placeholder="" onChange={handleChange} className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${isEditing ? 'border-cyan-400' : 'border-gray-800 text-gray-400'}`} />
            </div>
            <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Invoicing Mail</label>
            <input disabled={!isEditing} name="emailInvoicing" value={content.emailInvoicing} placeholder="" onChange={handleChange} className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${isEditing ? 'border-cyan-400' : 'border-gray-800 text-gray-400'}`} />
            </div>
           
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Video Text</label>
            <input disabled={!isEditing} name="emailVideoText" value={content.emailVideoText} placeholder="" onChange={handleChange} className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${isEditing ? 'border-cyan-400' : 'border-gray-800 text-gray-400'}`} />
            </div>
            <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Video Mail</label>
            <input disabled={!isEditing} name="emailVideo" value={content.emailVideo} placeholder="" onChange={handleChange} className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${isEditing ? 'border-cyan-400' : 'border-gray-800 text-gray-400'}`} />
            </div>
           
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Marketing Text</label>
            <input disabled={!isEditing} name="emailMarketingText" value={content.emailMarketingText} placeholder="" onChange={handleChange} className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${isEditing ? 'border-cyan-400' : 'border-gray-800 text-gray-400'}`} />
            </div>
            <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Marketing Mail</label>
            <input disabled={!isEditing} name="emailMarketing" value={content.emailMarketing} placeholder="" onChange={handleChange} className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${isEditing ? 'border-cyan-400' : 'border-gray-800 text-gray-400'}`} />
            </div>
           
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">General Inquiries Text</label>
            <input disabled={!isEditing} name="emailGeneralText" value={content.emailGeneralText} placeholder="" onChange={handleChange} className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${isEditing ? 'border-cyan-400' : 'border-gray-800 text-gray-400'}`} />
            </div>
            <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">General Inquiries Mail</label>
            <input disabled={!isEditing} name="emailGeneral" value={content.emailGeneral} placeholder="" onChange={handleChange} className={`w-full bg-transparent border rounded-xl px-4 py-2 outline-none transition-all ${isEditing ? 'border-cyan-400' : 'border-gray-800 text-gray-400'}`} />
            </div>
           
          </div>
        </div>

        <div className="relative">
          <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Main Image</label>
          <div onClick={() => isEditing && mainFileRef.current.click()} className={`relative border-2 border-dashed rounded-2xl h-full min-h-[200px] flex items-center justify-center bg-black/20 overflow-hidden ${isEditing ? 'border-cyan-500 cursor-pointer group' : 'border-gray-800'}`}>
            <input type="file" ref={mainFileRef} onChange={(e) => handleImageUpdate('mainImage', e)} className="hidden" />
            <img src={showReference ? "./hero.png" : content.mainImage} className="max-h-full object-contain p-2" alt="Hero" />
            {isEditing && <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><HiOutlineUpload className="text-cyan-400 text-2xl" /></div>}
          </div>
        </div>
      </div>

      {/* --- PREVIEW --- */}
      {!isEditing && (
        <div className="border-t border-gray-800 pt-6">
          <h3 className="text-sm font-bold text-cyan-400 mb-4">Preview</h3>
          <div className="bg-gray-900/50 rounded-xl p-6 space-y-6">
            {/* Main Section */}
            <div className="space-y-3">
              <h2 className="text-3xl font-bold text-white">{content.heading}</h2>
              <p className="text-sm text-gray-300">{content.desc}</p>
            </div>

            {/* Scheduling Section */}
            <div className="border-t border-gray-800 pt-4 space-y-3">
              <h3 className="text-2xl font-bold text-white">{content.headingSchedule}</h3>
              <p className="text-sm text-gray-300">{content.descSchedule}</p>
            </div>

            {/* Sidebar Section */}
            <div className="border-t border-gray-800 pt-4 space-y-3">
              <h4 className="text-xl font-bold text-cyan-400">{content.headingSidebar}</h4>
              <p className="text-sm text-gray-300">{content.descSidebar}</p>
            </div>

            {/* Contact Info */}
            <div className="border-t border-gray-800 pt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase">Address</p>
                <p className="text-sm text-white">{content.addressText}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Phone</p>
                <p className="text-sm text-cyan-400">{content.callText}</p>
              </div>
            </div>

            {/* Email Contacts */}
            <div className="border-t border-gray-800 pt-4 grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase">{content.emailSchedulingText}</p>
                <a href={`mailto:${content.emailScheduling}`} className="text-sm text-cyan-400 hover:text-cyan-300">{content.emailScheduling}</a>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">{content.emailProductionText}</p>
                <a href={`mailto:${content.emailProduction}`} className="text-sm text-cyan-400 hover:text-cyan-300">{content.emailProduction}</a>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">{content.emailInvoicingText}</p>
                <a href={`mailto:${content.emailInvoicing}`} className="text-sm text-cyan-400 hover:text-cyan-300">{content.emailInvoicing}</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactUs;
