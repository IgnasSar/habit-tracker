import Header from "../components/Header";
import "../styles/Register.css";

export default function MainPage() {
  return (
    <div className="main-page">
      <Header />
      <div className="content">
        <h2>Welcome to the dashboard!</h2>
        <p>More features will appear here later.</p>
      </div>
    </div>
  );
}
