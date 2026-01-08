import React from "react";
import Slider from "react-slick";

import Arrow from "../../components/Arrow";
import Button from "../../components/Button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const smartData = [
  {
    title: "TVG Management",
    desc: "Comprehensive agency management support focused on optimizing your day-to-day operations.",
    image: "smart-1.jpg",
    link: "/services/tvg-management"
  },
  {
    title: "TVG Reporting",
    desc: "Our nationwide network of court reporters and legal videographers is ready to support your firm wherever you need.",
    image: "smart-2.jpg",
    link: "/services/tvg-reporting"
  },
  {
    title: "TVG Stream",
    desc: "Cutting-edge trial presentation and event A/V, with detail-focused on-site support.",
    image: "smart-3.jpg",
    link: "/services/tvg-stream"
  },
  {
    title: "TVG Books",
    desc: "Book keeping support services for court reporting and other professional industries.",
    image: "smart-4.jpg",
    link: "/services/tvg-books"
  },
  // {
  //   title: "TVG Creative",
  //   desc: "Marketing materials, branding and identity kits for legal and B2B sectors.",
  //   image: "smart-5.jpg",
  //   link: "/services/tvg-creative"
  // },
  {
    title: "TVG Connect",
    desc: "Focused management services built for professional associations and organizations.",
    image: "smart-6.jpg",
    link: "/services/tvg-connect"
  },
  // {
  //   title: "TVG Command",
  //   desc: "Empowering you with sales support and practical training on leading legal tech platforms.",
  //   image: "smart-7.jpg",
  //   link: "/services/tvg-command"
  // },
  {
    title: "TVG Verify",
    desc: "Let us ensure your hiring is secure with reliable background screening and compliance checks, powered by Smart Hire.",
    image: "smart-8.jpg",
    link: "/services/tvg-verify"
  },
  
];

function NextArrow(props) {
  const { onClick } = props;
  return (
    <div
      className="cursor-pointer absolute -bottom-12 right-[calc(50%-3rem)] z-10"
      onClick={onClick}
    >
      <Arrow customClass={"bg-secondary "} />
    </div>
  );
}

function PrevArrow(props) {
  const { onClick } = props;
  return (
    <div
      className="cursor-pointer absolute -bottom-12 left-[calc(50%-3rem)] z-10"
      onClick={onClick}
    >
      <Arrow customClass={"bg-secondary rotate-180"} />
    </div>
  );
}

export default function SmartSlider({data}) {
    if (!data) return null;
    // console.log("SmartSlider data:", data);
    const {
  title,
  paragraph1,
  paragraph2,
  image,
  cards = [],
  button
} = data;

// Normalize incoming props: CMS sometimes sends JSON as strings
let finalCards = smartData;
if (cards) {
  if (typeof cards === "string") {
    try {
      const parsed = JSON.parse(cards);
      if (Array.isArray(parsed)) finalCards = parsed;
    } catch (err) {
      console.warn("SmartSlider: failed to parse cards JSON", err);
    }
  } else if (Array.isArray(cards) && cards.length) {
    finalCards = cards;
  }
}

let parsedButton = button;
if (typeof button === "string") {
  try {
    parsedButton = JSON.parse(button);
  } catch (err) {
    console.warn("SmartSlider: failed to parse button JSON", err);
  }
}

const navigate  = useNavigate()
  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 2,
    slidesToScroll: 1,
    centerMode: false,
    autoplay: true,
    autoplaySpeed: 5000, // 3 seconds
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          centerMode: false,
          autoplay: true,
          autoplaySpeed: 3000,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          centerMode: false,
          autoplay: true,
          autoplaySpeed: 3000,
        },
      },
    ],
  };

  return (
    <section className="bg-gradient-to-br from-[#0052B9] to-[#38ABD0] text-white py-20 relative" id="SmartSlider">
      <div className="image-top absolute top-0 left-0 w-32 md:w-60 h-32 md:h-60">
        <img src="/icon-half.png" alt="Featured 1" />
      </div>

      <div className="image-bottom absolute right-0 -rotate-180 bottom-0 w-32 md:w-60 h-32 md:h-60">
        <img src="/icon-half.png" alt="Featured 3" />
      </div>
      <div className=" px-[20px] md:px-[25px] lg:ps-[100px]">
        <div className="lg:flex items-stretch justify-between">
          <motion.div
            className="lg:w-[40%] flex flex-col justify-between items-start md:px-6 mb-10 lg:mb-0"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-h2 font-medium leading-tight mb-4">
                {title ? title : "Smart Support Services Tailored for Your Success"}
              </h2>

              <div className="flex items-center gap-2 mb-8">
                <Button
                  text={(parsedButton && parsedButton.label) || (button && button.label) || "Let's Get Started"}
                  link={(parsedButton && parsedButton.link) || (button && button.link)}
                  color={"text-white"}
                  arrowClass={"sd"}
                />
              </div>
            </motion.div>

            <motion.p
              className="text-white font-manrope text-xl lg:max-w-[500px]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {paragraph1 ? paragraph1 : `Our team is the heart of The Varallo Group. They bring dedication, professionalism, and integrity to everything they do. I’m constantly inspired by their commitment to our clients and to each other. It's a privilege to work alongside such talented people who take real pride in delivering excellence every single day.`}
            </motion.p>
            <br />
            <motion.p
              className="text-white font-manrope text-xl lg:max-w-[500px]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {paragraph2 ? paragraph2 : `At The Varallo Group, our services are built to simplify, strengthen, and scale your operations. Whether you're a court reporting firm, a professional organization, or an individual, our expertise meets your needs right where you are and right when you need it.`}
            </motion.p>
          </motion.div>

          <motion.div
            className="lg:w-[60%]"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <Slider {...settings}>
                {finalCards.map((item, i) => (
                  <div key={i}  className="px-4">
                    <motion.div
                      className="relative rounded-xl overflow-hidden cursor-pointer"
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: i * 0.2 }}
                      viewport={{ once: true }}
                      onClick={() => item.link && navigate(item.link)}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full rounded-[30px]"
                      />
                      <div className="absolute top-0 left-0 w-full h-full flex items-end justify-start p-4">
                        <div className="p-4 bg-black/50 backdrop-blur-md text-white rounded-xl xl:w-2/4">
                          <h4 className="font-medium text-p font-manrope mb-1">
                            {item.title}
                          </h4>
                          <p className="font-medium text-base leading-6 text-white">
                            {item.desc || item.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </Slider>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
