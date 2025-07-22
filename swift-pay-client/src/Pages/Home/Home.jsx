import { useContext } from "react";
import { UserContext } from "../../AuthProvider/AuthProvider";
import Hero from "../../Components/Hero/Hero";
import ServiceCardSlider from "../../Components/ServiceCardSlider/ServiceCardSlider";
import HomeUser from "../Dashboard/User/HomeUser/HomeUser";
import HomeAgent from "../Dashboard/Agent/HomeAgent/HomeAgent";
import HomeAdmin from "../Dashboard/Admin/HomeAdmin/HomeAdmin";

const Home = () => {
  const { user, loading } = useContext(UserContext);
  const role = user?.userRole || null;
  const isAuthenticated = role !== null; // If role is null, the user is not authenticated
  if (loading) return <p>Loading...</p>;
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
          <p> No Route Found For This User </p>
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
