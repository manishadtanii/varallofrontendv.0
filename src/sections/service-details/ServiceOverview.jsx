import React from "react";
import { motion } from "framer-motion";
import OverviewCard from "../../components/OverviewCard";

const ServiceOverview = ({ data }) => {
   if (!data) return null;
  console.log("ServiceOverview data:", data);
  const { title,  items } = data;
  return (
    <section className="bg-gradient-to-br from-[#1e90ff] to-[#1ca9c9] text-white relative">
      <div className="image-top absolute top-0 left-0 w-60 h-60">
        <img src="/icon-half.png" alt="Featured 1" />
      </div>
      <div className="image-middle absolute top-[50%] translate-y-[-50%] w-60 right-0">
        <img src="/icon-right.png" alt="Featured 2" />
      </div>
      <div className="image-bottom absolute left-0 -rotate-90 bottom-0 w-60 h-60">
        <img src="/icon-half.png" alt="Featured 3" />
      </div>
      <div className="container-fluid">
        <motion.h2
          className="text-center font-parkinsans text-h2 md:mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {title}
        </motion.h2>

        <div className="max-w-7xl m-auto">
          <div className="">
            {items.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
              >
                <OverviewCard {...service} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceOverview;
