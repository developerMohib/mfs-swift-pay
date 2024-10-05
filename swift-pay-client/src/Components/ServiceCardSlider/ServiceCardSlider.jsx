import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Slider from "react-slick";
import { useQuery } from "@tanstack/react-query";


const ServiceCardSlider = () => {
    const settings = {
        infinite: true,
        slidesToShow: 3, // default for mobile
        slidesToScroll: 1,
        autoplay: true,
        speed: 2500,
        autoplaySpeed: 5000,
        cssEase: "linear",
        responsive: [
          {
            breakpoint: 1024, // for screens larger than 1024px (desktop)
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 600, // for screens between 600px and 1024px (tablet)
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 480, // for screens smaller than 600px (mobile)
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
        ],
      };
const {data: servicesData, isLoading} = useQuery()

  return (
    <div className="slider-container w-full mx-auto p-4 md:p-8 lg:p-12">
      <Slider {...settings}>

        {/* slider one */}            
          <div className="bg-white w-full mx-4 md:mx-auto mt-16">
            <div className="px-8 py-6 mx-3 md:p-10 border-2 border-tarnary">
              <h1 className="text-4xl md:text-5xl font-medium leading-tight text-tarnary mb-6">
              we commit to a dynamic work environment to support
              </h1>
              <p className="text-base md:text-lg font-normal leading-normal text-tarnary mb-6">
              What is Cash in
              </p>
              <div className="flex justify-center">
                <span className="bg-secondary rounded-lg text-tarnary font-medium text-base md:text-lg py-3 px-8 md:px-12 hover:bg-primary transition-all duration-150 ease-in-out cursor-pointer " >Cash In</span>
              </div>
              <p className="text-base md:text-lg font-normal leading-normal text-tarnary mt-6">
                Hi,
              </p>
              <p className="text-sm md:text-base font-normal leading-normal text-tarnary mt-2">
              Cash In refers to the process of depositing an amount into a swiftPay account from swiftpay-authorized Uddokta Point.
              </p>
            </div>
          </div>

        {/* slider two */}
        <div>
          <div className="bg-white w-full mx-4 md:mx-auto mt-16">
            <div className="px-8 py-6 mx-3 md:p-10 border-2 border-tarnary">
              <h1 className="text-4xl md:text-5xl font-medium leading-tight text-tarnary mb-6">
                Lets go, its Google I/O
              </h1>
              <p className="text-base md:text-lg font-normal leading-normal text-tarnary mb-6">
              What is cash out
              </p>
              <div className="flex justify-center">
              <span className="bg-secondary rounded-lg text-tarnary font-medium text-base md:text-lg py-3 px-8 md:px-12 hover:bg-primary transition-all duration-150 ease-in-out cursor-pointer " >Cash Out </span>
              </div>
              <p className="text-base md:text-lg font-normal leading-normal text-tarnary mt-6">
                Hi,
              </p>
              <p className="text-sm md:text-base font-normal leading-normal text-tarnary mt-2">
              Cash Out refers to the process of withdrawing cash from one’s own swifPay account by visiting a nearby swifPay Uddokta. Customers can initiate Cash Out.
              </p>
            </div>
          </div>
        </div>

        {/* slider three */}
        <div>
          <div className="bg-white w-full mx-4 md:mx-auto mt-16">
            <div className="px-8 py-6 mx-3 md:p-10 border-2 border-tarnary">
              <h1 className="text-4xl md:text-5xl font-medium leading-tight text-tarnary mb-6">
                Lets go, its Google I/O
              </h1>
              <p className="text-base md:text-lg font-normal leading-normal text-tarnary mb-6">
                What is Send Money
              </p>
              <div className="flex justify-center">
              <span className="bg-secondary rounded-lg text-tarnary font-medium text-base md:text-lg py-3 px-8 md:px-12 hover:bg-primary transition-all duration-150 ease-in-out cursor-pointer" >Send Money</span>
              </div>
              <p className="text-base md:text-lg font-normal leading-normal text-tarnary mt-6">
                Hi,
              </p>
              <p className="text-sm md:text-base font-normal leading-normal text-tarnary mt-2">
              Send Money is a feature on Nagad that enables one to send money to any mobile number.
              </p>
            </div>
          </div>
        </div>

      </Slider>
    </div>
  );
};

export default ServiceCardSlider;
