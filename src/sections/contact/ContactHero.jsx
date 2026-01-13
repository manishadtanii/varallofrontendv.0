import React from "react";
import Button from "../../components/Button";
import { motion } from "motion/react";
import Hero from "../../components/Hero";
import CurvedSlider from "../../components/CurvedSlider";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { a, b } from "framer-motion/client";

function ContactHero({ data }) {
  if (!data) return null;
  // console.log("ContactHero data:", data);
  const { heading, description, buttons, images, ctaText1, ctaLink1, ctaText2, ctaLink2 } = data;
  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    fade: true,
    pauseOnHover: false,
    cssEase: "linear",
    // centerMode: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <Hero clCustom="none">
      <div className="max-w-[1600px] m-auto pt-[50px] md:pt-[70px] lg:pt-[100px] px-[20px] md:px-[30px] lg:px-[50px]">
        <motion.h1
          className="text-h2 font-parkinsans leading-tight max-w-[900px] m-auto text-center"
          initial={{ opacity: 0, y: 40 }} // from bottom
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          {heading
            ? heading
            : "Start your journey with a conversation. Let’s Connect!"}
        </motion.h1>

        <motion.p
          className="text-gray-300 font-monospace text-xl mt-4 max-w-[800px] text-center mx-auto"
          initial={{ opacity: 0, y: 40 }} // from bottom
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {description
            ? description
            : "Reach out today, we’ll map the way forward with clear strategies and reliable legal assistance."}
        </motion.p>

        <motion.div
          className="mt-10 flex justify-center flex-col items-center gap-4"
          initial={{ opacity: 0, y: 40 }} // from bottom
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Button
            text={ctaText1 || "Request a call back for other services"}
            link={ctaLink1 || "mailto:info@varallogroup.com"}
            arrowClass="d"
          />
          <div className="border-b border-white ">
            <a
              href={ctaLink2 || "#contact-main"}
              className="text-base font-manrope md:text-xl"
            >
              {ctaText2 || "Schedule a Deposition"}
              &nbsp;
              <i class="fal fa-external-link text-base"></i>
            </a>
          </div>
        </motion.div>
        <div className="mt-5">
          {/* <motion.img
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "tween", duration: 1.5 }} // Increased duration
          src="./contact-hero.png" // Replace with your actual image path
          alt="Professional"
          className="w-full  "
        /> */}
        </div>
      </div>
      <div className="block md:hidden">
        <div className="container-fluid">
          <Slider {...settings}>
            {images && images.length > 0 ? (
              images.map((img, index) => (
                <div key={index}>
                  <img src={img['url']} alt={`Contact ${index + 1}`} />
                </div>
              ))
            ) : (
              <div>No images available</div>
            )}
          </Slider>
        </div>
      </div>
      <div className="hidden md:block">
        <CurvedSlider images={images} />
      </div>
    </Hero>
  );
}

export default ContactHero;
