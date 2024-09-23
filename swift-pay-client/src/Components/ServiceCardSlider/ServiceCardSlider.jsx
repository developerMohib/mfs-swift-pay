import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Slider from "react-slick";

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

  return (
    <div className="slider-container w-full mx-auto p-4 md:p-8 lg:p-12">
      <Slider {...settings}>

        {/* slider one */}            
          <div className="bg-white w-full mx-4 md:mx-auto mt-16">
            <div className="px-8 py-6 mx-3 md:p-10 border-2 border-tarnary">
              <h1 className="text-4xl md:text-5xl font-medium leading-tight text-tarnary mb-6">
                Lets go, its Google I/O
              </h1>
              <p className="text-base md:text-lg font-normal leading-normal text-tarnary mb-6">
                Join us online on May 10, 2023
              </p>
              <div className="flex justify-center">
                <span className="bg-secondary rounded-lg text-tarnary font-medium text-base md:text-lg py-3 px-8 md:px-12 hover:bg-yellow-500 transition-all duration-150 ease-in-out cursor-pointer " >Cash In</span>
              </div>
              <p className="text-base md:text-lg font-normal leading-normal text-tarnary mt-6">
                Hi Young,
              </p>
              <p className="text-sm md:text-base font-normal leading-normal text-tarnary mt-2">
                Google I/O 2023 is around the corner! Tune in to watch the
                livestreamed keynotes at 10am PT, then dive into 100+ technical
                sessions, codelabs, and more, on demand. Learn about...
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
                Join us online on May 10, 2023
              </p>
              <div className="flex justify-center">
              <span className="bg-secondary rounded-lg text-tarnary font-medium text-base md:text-lg py-3 px-8 md:px-12 hover:bg-yellow-500 transition-all duration-150 ease-in-out cursor-pointer " >Cash Out </span>
              </div>
              <p className="text-base md:text-lg font-normal leading-normal text-tarnary mt-6">
                Hi Young,
              </p>
              <p className="text-sm md:text-base font-normal leading-normal text-tarnary mt-2">
                Google I/O 2023 is around the corner! Tune in to watch the
                livestreamed keynotes at 10am PT, then dive into 100+ technical
                sessions, codelabs, and more, on demand. Learn about...
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
                Join us online on May 10, 2023
              </p>
              <div className="flex justify-center">
              <span className="bg-secondary rounded-lg text-tarnary font-medium text-base md:text-lg py-3 px-8 md:px-12 hover:bg-yellow-500 transition-all duration-150 ease-in-out cursor-pointer" >Send Monry</span>
              </div>
              <p className="text-base md:text-lg font-normal leading-normal text-tarnary mt-6">
                Hi Young,
              </p>
              <p className="text-sm md:text-base font-normal leading-normal text-tarnary mt-2">
                Google I/O 2023 is around the corner! Tune in to watch the
                livestreamed keynotes at 10am PT, then dive into 100+ technical
                sessions, codelabs, and more, on demand. Learn about...
              </p>
            </div>
          </div>
        </div>

      </Slider>
    </div>
  );
};

export default ServiceCardSlider;
