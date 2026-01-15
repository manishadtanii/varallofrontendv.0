import React from "react";
import { motion } from "framer-motion";

const ServiceOver = ({ data }) => {
   if (!data) return null;
  console.log("Service Over data:", data);
  const { heading, img, para1, para2, subHeading } = data;
  return (
    <section className="bg-white">
      <div className="container-fluid">
        <div className="md:flex items-center gap-10">
          {/* Image Section */}
          <motion.div
            className="text-end md:order-2 md:w-[30%]"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <img
              src={img}
              alt="Service Overview"
              className="w-full max-w-xl mx-auto"
            />
          </motion.div>

          {/* Text Section */}
          <motion.div
            className="md:order-1 md:w-[60%] mt-10 "
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <div className="md:flex justify-between items-end gap-10">
              <motion.h2
                className="text-h2 font-parkinsans"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {heading?heading:`Service <br className="hidden md:block" /> Overview`}
              </motion.h2>

              <motion.p
                className="md:text-end text-base md:text-[32px] text-tertiary md:mt-6 font-medium font-manrope leading-10"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {subHeading}
              </motion.p>
            </div>

            <div className="">
              <motion.p
                className="md:mt-6 text-gray-700 text-base leading-relaxed"
                initial={{}}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3  }}
              >
                {para1}
              </motion.p>
            <motion.p
                className="md:mt-6 text-gray-700 text-base leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {para2}
              </motion.p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ServiceOver;
