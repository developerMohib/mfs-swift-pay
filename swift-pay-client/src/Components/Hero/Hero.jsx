import { Link } from "react-router-dom";
import SlideHome from "../SlideHome/SlideHome";

const Hero = () => {
  return (
    <section className="text-tarnary pt-6">
      <div className="md:flex flex-col justify-center p-6 mx-auto lg:flex-row lg:justify-between">
        {/* Here slider */}
        <SlideHome />

        <div className="flex flex-col px-6 rounded-sm lg:max-w-md xl:max-w-lg text-left">
          <h1 className="md:text-4xl text-2xl font-bold leading-none">
            Revolutionizing Money Transfers in{" "}
            <span className="text-primary">swift</span>
            <span className="text-secondary">Pay</span> with Speed and
            Simplicity
          </h1>
          <p className="mt-6 mb-3 text-lg sm:mb-3">
            lightning-fast, secure money transfers, ensuring your funds reach
            anywhere in the world with ease.
            <br />
            <br className="md:block hidden" />
            Our user-friendly platform guarantees seamless transactions, whether
            local or international. Experience a new era of hassle-free,
            reliable payments at your fingertips.
          </p>
          <div className="flex flex-col space-y-4 sm:items-center sm:justify-center sm:flex-row sm:space-y-0 sm:space-x-4 lg:justify-start">
            <Link
              to="/sign-up"
              rel="noopener noreferrer"
              className="px-8 py-3 text-lg font-semibold rounded bg-primary hover:bg-secondary text-text"
            >
              Register
            </Link>
            <Link
              to="/sign-in"
              rel="noopener noreferrer"
              className="px-8 py-3 text-lg font-semibold border rounded border-tarnary hover:bg-primary hover:text-bg"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
