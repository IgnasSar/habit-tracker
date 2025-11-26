import { useState } from "react";
import "../styles/Habit.css";

export default function HabitCard({ habit, onEdit, onDelete, onAddProgress }) {
  const [isChecking, setIsChecking] = useState(false);

  const currentProgress = habit.current_progress || 0;
  const target = habit.target_count;
  const isPeriodGoalMet = currentProgress >= target;

  const formatFrequency = () => {
    const periodMap = { daily: "day", weekly: "week", monthly: "month" };
    const period = periodMap[habit.period_type];
    if (habit.period_length === 1) return `per ${period}`;
    return `every ${habit.period_length} ${period}s`;
  };

  const handleCheckClick = async (e) => {
    e.stopPropagation();
    if (isPeriodGoalMet || isChecking)
      return;

    setIsChecking(true);
    try {
      await onAddProgress(habit);
    } catch (error) {
      console.error("Failed to add progress:", error);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className={`habit-card-wide ${isPeriodGoalMet ? "completed" : ""}`}>
      <div className="habit-check-section">
        <button
          className={`checkmark-container ${isPeriodGoalMet ? "completed" : ""} ${isChecking ? "loading" : ""}`}
          onClick={handleCheckClick}
          disabled={isPeriodGoalMet || isChecking}
          title={isPeriodGoalMet ? "Goal reached for this period!" : "Add progress for today"}
        >
          {isChecking ? (
            <div className="spinner"></div>
          ) : (
            <svg className="checkmark-icon" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          )}
        </button>
        <div className="progress-indicator">
          <span className={`count ${isPeriodGoalMet ? "success" : ""}`}>{currentProgress}</span>
          <span className="separator">/</span>
          <span className="target">{target}</span>
        </div>
      </div>
      <div className="habit-info">
        <h3 className="habit-title">{habit.name}</h3>
        <div className="habit-details">
          <span>
            <strong>Goal:</strong> {target} time{target > 1 ? "s" : ""} {formatFrequency()}
          </span>
        </div>
      </div>
      <div className="habit-actions">
        <button className="btn edit" onClick={() => onEdit(habit)}>Edit</button>
        <button className="btn delete" onClick={() => onDelete(habit.id)}>Delete</button>
      </div>
    </div>
  );
}
