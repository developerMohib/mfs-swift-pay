import { useContext } from "react";
import { UserContext } from "../../AuthProvider/AuthProvider";
import Hero from "../../Components/Hero/Hero";
import HomeAdmin from "../../Components/HomeAdmin/HomeAdmin";
import HomeAgent from "../../Components/HomeAgent/HomeAgent";
import HomeUser from "../../Components/HomeUser/HomeUser";
import ServiceCardSlider from "../../Components/ServiceCardSlider/ServiceCardSlider";

const Home = () => {
  const { user, loading } = useContext(UserContext);
  const role = user?.userRole || null;
  const isAuthenticated = role !== null; // If role is null, the user is not authenticated
  if (loading) return <p>Loading...</p>;
  return (
    <div>
      {isAuthenticated ? (
        role === "User" ? (
          <HomeUser />
        ) : role === "Agent" ? (
          <HomeAgent />
        ) : role === "Admin" ? (
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
