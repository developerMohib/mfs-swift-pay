import Hero from "../../Components/Hero/Hero";
import HomeAdmin from "../../Components/HomeAdmin/HomeAdmin";
import HomeAgent from "../../Components/HomeAgent/HomeAgent";
import HomeUser from "../../Components/HomeUser/HomeUser";
import ServiceCardSlider from "../../Components/ServiceCardSlider/ServiceCardSlider";

const Home = () => {
  const role = null;
//   const role = "user";
//   const role = "admin";
  //   const role = "agent";
  const isAuthenticated = role !== null; // If role is null, the user is not authenticated

  return (
    <div>
      {isAuthenticated ? (
        role === "user" ? (
          <HomeUser />
        ) : role === "agent" ? (
          <HomeAgent />
        ) : role === "admin" ? (
          <HomeAdmin />
        ) : (
          <> </>
        )
      ) : (
        <>
        <Hero />
        <ServiceCardSlider />
      </>
      )}
    </div>
  );
};

export default Home;
