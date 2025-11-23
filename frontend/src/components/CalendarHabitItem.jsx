import { useState } from "react";
import "../styles/Calendar.css";

export default function CalendarHabitItem({
  habit,
  date,
  onAddProgress,
  isLocked,
  isPeriodGoalMet,
  currentProgress,
  checksTodayCount,
}) {
  const [isChecking, setIsChecking] = useState(false);

  const handleCheck = async (e) => {
    e.stopPropagation();
    
    if (isLocked || isPeriodGoalMet || isChecking) {
      if (isPeriodGoalMet) {
        alert("You've already met your goal for this period!");
      }
      return;
    }

    setIsChecking(true);
    try {
      await onAddProgress(habit, date);
    } catch (err) {
      console.error("Failed to add progress from calendar", err);
    } finally {
      setIsChecking(false);
    }
  };

  let itemClassName = 'calendar-habit-item';
  if (isLocked) {
    itemClassName += ' locked';
  } else if (isPeriodGoalMet) {
    itemClassName += ' period-achieved';
  } else if (checksTodayCount > 0) {
    itemClassName += ' completed-today';
  }

  const isButtonCompleted = isPeriodGoalMet;

  return (
    <div className={itemClassName}>
      <span className="habit-name" title={habit.name}>
        {habit.name}
      </span>
      <div className="habit-meta">
        <span className="progress-text">
          {currentProgress}/{habit.target_count}
        </span>
        <button
          className={`check-btn ${isButtonCompleted ? 'completed' : ''} ${isChecking ? 'loading' : ''}`}
          onClick={handleCheck}
          disabled={isLocked || isPeriodGoalMet || isChecking}
          title={isPeriodGoalMet ? "Goal met!" : "Check in"}
        >
          {isChecking ? (
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
