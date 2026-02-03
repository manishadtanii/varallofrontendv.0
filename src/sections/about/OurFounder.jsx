import React from "react";
import { motion } from "framer-motion";
import { FaLinkedin, FaFacebook } from "react-icons/fa";

function OurFounder({ data }) {
  console.log("OurFounder data:", data.profile.image.url);
  if (!data) return null;
  const { name, para1, para2, profile, quote } = data;
  console.log("OurFounder profile image URL:", profile?.image?.url);
  return (
    <section className="bg-btn relative md:py-32">
      <div className="image-bottom absolute left-0  top-0 w-32 md:w-60 h-32 md:h-60">
        <img src="/icon-half.png" alt="Featured 3" />
      </div>
      <div className="image-bottom absolute right-0 -rotate-180 bottom-0 w-32 md:w-60 h-32 md:h-60">
        <img src="/icon-half.png" alt="Featured 3" />
      </div>
      <div className="container-fluid">
        <div className="flex md:block mx-auto max-w-[1200px] text-center font-parkinsans mb-10 relative">
          <span className="hidden md:block md:absolute left-0 top-0 md:translate-x-[-110%] w-10 -mt-5">
            <img src="q-left.png" className="w-10" alt="" />
          </span>
          <p className="md:mb-20  text-p text-white">
            {quote ? quote.text : `Our team is the heart of The Varallo Group. They bring dedication, professionalism, and integrity to everything they do. I’m constantly inspired by their commitment to our clients and to each other. It's a privilege to work alongside such talented people who take real pride in delivering excellence every single day.`} <br />
            {/* <span><i> — Nancy Varallo, Founder & Executive Director</i></span> */}
          </p>

          <span className="hidden md:block md:absolute right-0 bottom-0  md:translate-x-[110%]">
            <img src="q-right.png" className="w-10" alt="" />
          </span>
        </div>

        <div className="flex flex-col md:flex-row  md:gap-10 bg-white/10 backdrop-blur-lg rounded-2xl ">
          {/* Left Side - Image + Name */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex  md:items-start w-full flex-col-reverse lg:flex-row md:w-1/2 items-stretch text-white relative p-5"
          >
            <div className="flex flex-col h-full items-stretch text-center gap-4 lg:justify-between  relative z-30">
              <h2 className="text-h2 font-parkinsans leading-tight text-center md:text-start sm:max-w-[300px]">
                {name ? name : `Nancy <br className="lg:block hidden" /> Varallo`}
              </h2>
              {/* Social Icons */}
              <div className="flex justify-center md:justify-start gap-4">
                <a
                  href="https://www.linkedin.com/in/nancy-varallo-8346a248/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-sky-600 rounded-full p-2 hover:bg-sky-100 transition"
                >
                  <FaLinkedin size={20} />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-sky-600 rounded-full p-2 hover:bg-sky-100 transition"
                >
                  <FaFacebook size={20} />
                </a>
              </div>
            </div>
            <div className="lg:absolute bottom-0 right-0 lg:w-[450px] mb-5 lg:mb-0">
              <img
                src={profile?.image?.url}
                className="w-full h-auto"
                alt="Nancy Varallo"
              />
            </div>
          </motion.div>

          {/* Right Side - Quote + Description */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full md:w-1/2 text-white p-5"
          >
            {/* Quote */}

            {/* Description */}
            <p className="text-xl leading-relaxed font-manrope">
              {para1 ? para1 : `Nancy Varallo launched her court reporting career in 1979 and founded The
Varallo Group in 2001, combining decades of expertise with a bold vision for better,smarter legal support. With a family name rooted in court reporting since 1937, Nancy
carries that legacy forward through her unwavering commitment to quality, service, and
innovation.`}
            </p>
            <br />
            <p className="text-xl leading-relaxed font-manrope">
              {para2 ? para2 : `From serving as President of the National Court Reporters Association to co-founding
the Project to Advance Stenographic Reporting (Project Steno), Nancy has been a
powerful advocate for the profession, mentoring students, creating industry programs,
and even overseeing high-profile cases at Guantanamo Bay. Known affectionately as
the “Fearless Leader” by her team, she brings heart, leadership, and family-first values
to every part of The Varallo Group.`}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default OurFounder;
