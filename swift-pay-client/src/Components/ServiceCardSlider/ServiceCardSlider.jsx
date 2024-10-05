import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useQuery } from "@tanstack/react-query";

import Loader from "../Loader/Loader";

const ServiceCardSlider = () => {
  const settings = {
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2500,
    autoplaySpeed: 5000,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const { data: servicesData, isLoading } = useQuery({
    queryKey: ["service"],
    queryFn: async () => {
      const response = await axios.get("/serviceData.json");
      return response?.data;
    },
  });

  if (isLoading) return <Loader />;

  return (
    <div className="slider-container w-full mx-auto p-4 md:p-4 lg:p-8">
      <div className="text-center my-10">
        <h1 className="text-2xl md:text-4xl font-semibold text-tarnary">Our Services</h1>
        <p className="text-base md:text-lg text-tarnary" >3 easy steps to use your swiftPay Account</p>
      </div>
      <Slider {...settings}>
        {servicesData?.map((service) => (
          <div key={service.id}>
            {/* Each slide content */}
            <div className="bg-white md:mx-2 md:mt-5">
              <div className="px-4 py-6 mx-2 border-2 border-tarnary rounded-md">
                <h1 className="text-2xl md:text-4xl font-semibold text-tarnary mb-6">
               {service.service}
                </h1>
                <p className="text-base md:text-lg font-normal text-tarnary mb-6">
                  {service.Title}
                </p>
                <div className="flex justify-center">
                  <span className="bg-secondary rounded-lg text-tarnary font-medium text-base md:text-lg py-3 px-8 md:px-12 hover:bg-primary transition-all duration-150 ease-in-out cursor-pointer">
                    {service.service_name}
                  </span>
                </div>
                <p className="text-sm md:text-base font-normal text-tarnary mt-2">
                  Cash In refers to the process of depositing an amount into a
                  swiftPay account from swiftpay-authorized Uddokta Point.
                  {service.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ServiceCardSlider;
