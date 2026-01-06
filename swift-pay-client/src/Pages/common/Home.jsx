import { useContext } from "react";
import { UserContext } from "../../authProvider/AuthProvider";
import HomeUser from "../user/HomeUser";
import HomeAgent from "../agent/HomeAgent";
import HomeAdmin from "../admin/HomeAdmin";
import Hero from "../../components/Hero";
import ServiceCardSlider from "../../components/ServiceCardSlider";

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
