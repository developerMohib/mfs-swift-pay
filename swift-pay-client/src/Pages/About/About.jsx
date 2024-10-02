const About = () => {
  return (
    <div className="sm:flex items-center max-w-screen-xl">
      <div className="sm:w-1/2 p-10">
        <div className="image object-center text-center">
          <img src="https://i.imgur.com/WbQnbas.png" />
        </div>
      </div>
      <div className="sm:w-1/2 p-5">
        <div className="text">
          <span className="text-gray-500 border-b-2 border-secondary uppercase">
            About us
          </span>
          <h2 className="my-4 font-bold text-3xl  sm:text-4xl ">
            About <span className="text-secondary">Our Company</span>
          </h2>
          <p className="text-gray-700">
            we believe in empowering individuals and businesses to securely send
            and receive money across the globe. Whether you are supporting loved
            ones or conducting international business, our platform ensures
            seamless, fast, and affordable transfers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
