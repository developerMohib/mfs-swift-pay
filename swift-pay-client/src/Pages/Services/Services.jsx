import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loader from "../../Components/Loader/Loader";

const Services = () => {

  const { data: provideServices , isLoading } = useQuery({
    queryKey: ["service"],
    queryFn: async () => {
      const response = await axios.get("/provideService.json");
      return response?.data;
    },
  });

  if (isLoading) return <Loader />;


  return (
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
  );
};

export default Services;
