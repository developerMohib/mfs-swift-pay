import { Outlet, Link } from "react-router-dom";

const UserLayout = () => {
    return (
        <div className="user-dashboard">
            <nav>
                <Link to="/dashboard/user">Home</Link>
                <Link to="/dashboard/user/profile">Profile</Link>
            </nav>
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default UserLayout;