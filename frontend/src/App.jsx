import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import MainPage from "./pages/MainPage";
import ProfilePage from "./pages/ProfilePage";
import CalendarPage from "./pages/CalendarPage";
import HabitStatsPage from "./pages/HabitStatsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import NotificationManager from "./components/NotificationManager";

export default function App() {
  return (
    <Router>
      <NotificationManager />
      <Routes>
        <Route path="/" element={<RegisterPage />} />
        <Route path="/main" element={<ProtectedRoute><MainPage /></ProtectedRoute>} />
        <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/habit/:id/stats" element={<ProtectedRoute><HabitStatsPage /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}
