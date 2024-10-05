import { Link } from "react-router-dom";
import SlideHome from "../SlideHome/SlideHome";

const Hero = () => {
  return (
    <section className="text-tarnary pt-6">
      <div className="md:flex flex-col justify-center p-6 mx-auto lg:flex-row lg:justify-between">
        {/* Here slider */}
        <SlideHome />

        <div className="flex flex-col px-6 rounded-sm lg:max-w-md xl:max-w-lg text-left">
          <h1 className="md:text-5xl text-3xl font-bold leading-none">
            Ac mattis
            <span className="text-secondary">senectus</span>erat pharetra
          </h1>
          <p className="mt-6 mb-8 text-lg sm:mb-12">
            Dictum aliquam porta in condimentum ac integer
            <br className="hidden md:inline lg:hidden" />
            turpis pulvinar, est scelerisque ligula sem
          </p>
          <div className="flex flex-col space-y-4 sm:items-center sm:justify-center sm:flex-row sm:space-y-0 sm:space-x-4 lg:justify-start">
            <Link
              rel="noopener noreferrer"
              className="px-8 py-3 text-lg font-semibold rounded bg-primary hover:bg-secondary text-text"
            >
              Suspendisse
            </Link>
            <Link
              rel="noopener noreferrer"
              className="px-8 py-3 text-lg font-semibold border rounded border-tarnary hover:bg-primary hover:text-bg"
            >
              Malesuada
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
