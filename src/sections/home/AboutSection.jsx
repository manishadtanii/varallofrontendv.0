import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faCamera } from "@fortawesome/free-solid-svg-icons";
// import personImage from "../assets/about-image.jpg"; // Replace with your image
import { motion } from "framer-motion";

const AboutSection = ({ data }) => {
  if (!data) return null;
  console.log("AboutSection data:", data);  
    const {heading, subHeading, description,image} = data;
  
  return (
    <section className="" id="WhatSetsUsApart">
      <div className="container-fluid">
        <div className=" mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="space-y-8 col-span-2 ">
            <motion.div
              className="flex md:items-center flex-col md:flex-row gap-5 md:gap-12"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="md:w-[40%] text-4xl md:text-5xl font-medium leading-tight font-parkinsans">
               {data.title}
               
               
              </h2>
              <div className="md:w-[49%] ms-auto ">
                <h3 className="text-xl md:text-2xl font-manrope">
               {data.subHeading}

                </h3>
                <p className=" mt-2 font-manrope">
             {data.description}
                </p>
              </div>
            </motion.div>

            <div className="w-full relative grid grid-cols-1 md:grid-cols-2 gap-8 ">
              <motion.div
                className="md:mt-20"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <img
                  src={data.image["url"]}
                  alt="Expert"
                  className="rounded-2xl w-full max-w-xl object-cover"
                />
              </motion.div>
              {/* Right Column */}
              <motion.div
                className="space-y-8 md:mt-20 flex flex-col justify-center md:gap-5"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div>
                  <h3 className="mb-4 text-h3 font-manrope">
                   {data.whatSetsUsApart["heading"]}
                  </h3>
                  <p className=" text-xl max-w-[500px] mt-2 ">
                    {data.whatSetsUsApart["description"]}
                  </p>
                </div>

                <motion.div
                  className=""
                  initial="hidden"
                  whileInView="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.2,
                      },
                    },
                  }}
                  viewport={{ once: true }}
                >
                  {data.highlights.map((card, index) => (
                    <div key={index} className="flex items-start flex-col sm:flex-row md:flex-col lg:flex-row gap-4 justify-between mb-4 md:mb-8">
                      <div className="">
                        <img src={card.icon} alt={card.title} className="w-full max-w-[50px] h-auto" />
                      </div>
                      <h4 className="font-medium font-manrope text-black text-p sm:w-[28%] md:w-full lg:w-[25%]">
                        {card.title}
                      </h4>
                      <p className="font-manrope text-black sm:w-[40%] md:w-full lg:w-[60%]">
                        {card.description}
                      </p>
                  </div>))}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
