import "../styles/Header.css";
import { NavLink, useNavigate } from "react-router-dom";

export default function Header() {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <header className="main-header">
            <div className="header-center">
                <nav>
                    <NavLink to="/main" className={({isActive}) => isActive ? "active-link" : ""}>Home</NavLink>
                    <NavLink to="/calendar" className={({isActive}) => isActive ? "active-link" : ""}>Calendar</NavLink>
                    <NavLink to="/profile" className={({isActive}) => isActive ? "active-link" : ""}>Profile</NavLink>
                </nav>
            </div>
            <div className="header-right">
                <button className="logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </header>
    );
}
