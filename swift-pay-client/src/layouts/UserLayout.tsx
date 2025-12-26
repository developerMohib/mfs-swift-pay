import { Outlet, Link } from "react-router-dom";

const UserLayout = () => {
    return (
        <div className="user-dashboard">
            <header>User Header</header>
            <nav>
                <Link to="/dashboard/user">Home</Link>
                <Link to="/dashboard/user/profile">Profile</Link>
            </nav>
            <main>
                <Outlet /> {/* Child routes render here */}
            </main>
            <footer>User Footer</footer>
        </div>
    );
};

export default UserLayout;