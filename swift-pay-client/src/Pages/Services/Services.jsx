import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loader from "../../Components/Loader/Loader";
const logos = [
  {
    id: 1,
    alt: "Transistor",
    src: "https://tailwindui.com/plus-assets/img/logos/158x48/transistor-logo-gray-900.svg",
    darkSrc: "https://tailwindui.com/plus-assets/img/logos/158x48/transistor-logo-white.svg"
  },
  {
    id: 2,
    alt: "Reform",
    src: "https://tailwindui.com/plus-assets/img/logos/158x48/reform-logo-gray-900.svg",
    darkSrc: "https://tailwindui.com/plus-assets/img/logos/158x48/reform-logo-white.svg"
  },
  {
    id: 3,
    alt: "Tuple",
    src: "https://tailwindui.com/plus-assets/img/logos/158x48/tuple-logo-gray-900.svg",
    darkSrc: "https://tailwindui.com/plus-assets/img/logos/158x48/tuple-logo-white.svg"
  },
  {
    id: 4,
    alt: "SavvyCal",
    src: "https://tailwindui.com/plus-assets/img/logos/158x48/savvycal-logo-gray-900.svg",
    darkSrc: "https://tailwindui.com/plus-assets/img/logos/158x48/savvycal-logo-white.svg"
  },
  {
    id: 5,
    alt: "Statamic",
    src: "https://tailwindui.com/plus-assets/img/logos/158x48/statamic-logo-gray-900.svg",
    darkSrc: "https://tailwindui.com/plus-assets/img/logos/158x48/statamic-logo-white.svg"
  }
];


const Services = () => {


  const { data: provideServices, isLoading } = useQuery({
    queryKey: ["service"],
    queryFn: async () => {
      const response = await axios.get("/provideService.json");
      return response?.data;
    },
  });

  if (isLoading) return <Loader />;

  return (
    <section>
      <div className="md:grid grid-cols-3 gap-4" >
        {provideServices?.map((card) => (
          <div
            key={card.id}
            className="sm:py-12"
          >
            <div className="group relative cursor-pointer overflow-hidden bg-bg px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:mx-auto sm:max-w-sm sm:rounded-lg sm:px-10">
              <span className="absolute top-10 z-0 h-20 w-20 rounded-full bg-sky-500 transition-all duration-300 group-hover:scale-[10]" />
              <div className="relative z-10 mx-auto max-w-md">
                <span className="grid h-20 w-20 place-items-center rounded-full bg-sky-500 transition-all duration-300 group-hover:bg-sky-400">
                  {card.icon}
                </span>
                <div className="pt-5 text-base leading-7 text-tarnary transition-all duration-300 group-hover:text-white/90">
                  <h1 className="text-2xl md:text-4xl font-semibold text-tarnary mb-6" >{card.service_name}</h1>
                  <p className="text-base md:text-lg font-normal text-tarnary mb-6">{card.Title}</p>
                </div>
                <div className="pt-5 text-base text-tarnary leading-7">
                  <p>{card.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-center text-lg/8 font-semibold text-tarnary">
            Trusted by the world&apos;s most innovative teams
          </h2>
          <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
            {logos?.map((logo) => (
              <div key={logo.id} className="flex justify-center">
                <picture>
                  <source srcSet={logo.darkSrc} media="(prefers-color-scheme:light)" />
                  <img
                    alt={logo.alt}
                    src={logo.src}
                    width={158}
                    height={48}
                    className="max-h-12 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
                  />
                </picture>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
