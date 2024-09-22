// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";

import slide1 from "../../assets/customer-service-skills.jpg";
import slide2 from "../../assets/customer-Service.png";
import slide3 from "../../assets/customer.png";
import slide4 from "../../assets/customer2.png";
import slide5 from "../../assets/customerhelp.png";
import slide6 from "../../assets/easy-pay.jpg";

import "./style.css";

// import required modules
import { Autoplay } from "swiper/modules";
import { useRef } from "react";

const SlideHome = () => {
    const progressCircle = useRef(null);
    const progressContent = useRef(null);

   const onAutoplayTimeLeft = (s, time, progress) => {
    // Update the CSS variable --progress
    if (progressCircle.current) {
      progressCircle.current.style.setProperty("--progress", 1 - progress);
    }

    // Update the text content with remaining time
    if (progressContent.current) {
      progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
    }
  };

  return (
    <>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[Autoplay]}
        onAutoplayTimeLeft={onAutoplayTimeLeft}
        className="mySwiper"
      >
        <SwiperSlide>
          {" "}
          <img className="md:h-[350px] h-64 " src={slide1} alt="" />{" "}
        </SwiperSlide>
        <SwiperSlide>
          {" "}
          <img className="md:h-[350px] h-64" src={slide2} alt="" />{" "}
        </SwiperSlide>
        <SwiperSlide>
          {" "}
          <img className="md:h-[350px] h-64" src={slide3} alt="" />{" "}
        </SwiperSlide>
        <SwiperSlide>
          {" "}
          <img className="md:h-[350px] h-64 " src={slide4} alt="" />{" "}
        </SwiperSlide>
        <SwiperSlide>
          {" "}
          <img className="md:h-[350px] h-64" src={slide5} alt="" />{" "}
        </SwiperSlide>
        <SwiperSlide>
          {" "}
          <img className="md:h-[350px] h-64" src={slide6} alt="" />{" "}
        </SwiperSlide>

        <div className="autoplay-progress" slot="container-end">
          
          <span ref={progressContent}></span>
        </div>


      </Swiper>
    </>
  );
};

export default SlideHome;
