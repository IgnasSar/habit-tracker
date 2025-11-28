import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Calendar.css";

export default function CalendarHabitItem({
  habit,
  date,
  onAddProgress,
  isFuture,
  isPeriodGoalMet,
  currentProgress,
  isDoneToday,
}) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isDisabled = isFuture || isPeriodGoalMet;

  const handleCardClick = () => {
    navigate(`/habit/${habit.id}/stats`);
  };

  const handleCheckClick = async (e) => {
    e.stopPropagation();
    if (isDisabled || loading) return;

    setLoading(true);
    try {
      await onAddProgress(habit, date);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`calendar-habit-item 
        ${isDoneToday ? "completed-today" : ""} 
        ${isPeriodGoalMet ? "period-achieved" : ""}
        ${isFuture ? "locked" : ""}
      `}
      title={`${habit.name}: ${currentProgress}/${habit.target_count}`}
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      <div className="habit-name">{habit.name}</div>
      <div className="habit-meta">
        <span className="progress-text">
          {currentProgress}/{habit.target_count}
        </span>
        <button
          className={`check-btn ${isPeriodGoalMet ? "completed" : ""} ${isDoneToday ? "completed" : ""}`}
          onClick={handleCheckClick}
          disabled={isDisabled}
        >
          {loading ? (
            <div className="spinner-small"></div>
          ) : (
            <svg className="check-icon-small" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
