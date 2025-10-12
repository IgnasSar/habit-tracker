import "../styles/Header.css";

export default function Header() {
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    return (
        <header className="main-header">
            <div className="header-center">
                <nav>
                    <a href="/main">Home</a>
                    <a href="/profile">Profile</a>
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
