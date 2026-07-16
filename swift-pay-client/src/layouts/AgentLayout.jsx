import { Link, Outlet } from 'react-router-dom';

const AgentLayout = () => {
    return (
        <div className="agent-dashboard">
            <header>Agent Header</header>
            <nav>
                <Link to="/dashboard/agent">Home</Link>
                <Link to="/dashboard/agent/profile">Profile</Link>
            </nav>
            <main>
                <Outlet /> {/* Child routes render here */}
            </main>
            <footer>Agent Footer</footer>
        </div>
    );
};

export default AgentLayout;