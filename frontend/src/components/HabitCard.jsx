import "../styles/Habit.css";

export default function HabitCard({ habit, onEdit, onDelete, onToggleComplete }) {
  const formatFrequency = () => {
    const periodMap = {
      daily: "day",
      weekly: "week",
      monthly: "month",
    };

    const target = `${habit.target_count} time${
      habit.target_count > 1 ? "s" : ""
    }`;
    const period = periodMap[habit.period_type];

    if (habit.period_length === 1) {
      return `${target} per ${period}`;
    }

    return `${target} every ${habit.period_length} ${period}s`;
  };

  const cardClassName = `habit-card-wide ${habit.completed ? "completed" : ""}`;
  const checkmarkClassName = `checkmark-container ${habit.completed ? "completed" : ""}`;

  return (
    <div className={cardClassName}>
      <button
        className={checkmarkClassName}
        onClick={() => onToggleComplete(habit.id)}
        aria-label={habit.completed ? "Mark as incomplete" : "Mark as complete"}
        title={habit.completed ? "Mark as incomplete" : "Mark as complete"}
      >
        <svg className="checkmark-icon" viewBox="0 0 24 24">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
      </button>

      <div className="habit-info">
        <h3 className="habit-title">{habit.name}</h3>
        <div className="habit-details">
          <span>
            <strong>Goal:</strong> {formatFrequency()}
          </span>
        </div>
      </div>

      <div className="habit-actions">
        <button className="btn edit" onClick={() => onEdit(habit)}>
          Edit
        </button>
        <button className="btn delete" onClick={() => onDelete(habit.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}
