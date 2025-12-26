import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../components/common/Loader";

const About = () => {
  const { data: aboutData, isLoading } = useQuery({
    queryKey: ["service"],
    queryFn: async () => {
      const response = await axios.get("/aboutFAQ.json");
      return response?.data;
    },
  });

  if (isLoading) return <Loader />;

  return (
    <section className=" max-w-screen-xl">
    <div className="sm:flex items-center">
      <div className="sm:w-1/2 p-10">
        <div className="image object-center text-center">
          <img src="https://i.imgur.com/WbQnbas.png" />
        </div>
      </div>
      <div className="sm:w-1/2 p-5">
        <div className="text">
          <span className="text-text border-b-2 border-secondary uppercase">
            About us
          </span>
          <h2 className="my-4 font-bold text-3xl  sm:text-4xl ">
            About <span className="text-secondary">Our Company</span>
          </h2>
          <p className="text-tarnary">
            we believe in empowering individuals and businesses to securely send
            and receive money across the globe. Whether you are supporting loved
            ones or conducting international business, our platform ensures
            seamless, fast, and affordable transfers.
          </p>
        </div>
      </div>

      {/* some faq */}
      

    </div>
    <div className="w-full max-w-3xl px-2 mx-auto py-12 dark:bg-transparent">
      <h3 className="mt-3 text-xl font-bold text-tarnary md:text-2xl">
        Frequently Asked Questions
      </h3>
      <div className="grid max-w-5xl mx-auto mt-6 divide-y divide-text dark:divide-gray-700">
        

        {
          aboutData?.map(data => <div key={data.id} className="py-5">
            <details className="group">
              <summary className="flex items-center justify-between font-medium list-none cursor-pointer">
                <span> {data.title} </span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height={24} shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width={24} className="dark:stroke-gray-400">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 text-tarnary group-open:animate-fadeIn">
              {data.details}
              </p>
            </details>
          </div> )
        }
      </div>
    </div>
  </section>
  );
};

export default About;
