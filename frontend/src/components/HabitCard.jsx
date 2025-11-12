import "../styles/Habit.css";

export default function HabitCard({ habit, onEdit, onDelete }) {
  const formatFrequency = () => {
    const periodMap = {
      daily: 'day',
      weekly: 'week',
      monthly: 'month',
    };

    const target = `${habit.target_count} time${habit.target_count > 1 ? 's' : ''}`;
    const period = periodMap[habit.period_type];

    if (habit.period_length === 1) {
      return `${target} per ${period}`;
    }

    return `${target} every ${habit.period_length} ${period}s`;
  };

  return (
    <div className="habit-card-wide">
      <div className="habit-info">
        <h3 className="habit-title">{habit.name}</h3>
        <div className="habit-details">
          <span><strong>Goal:</strong> {formatFrequency()}</span>
        </div>
      </div>

      <div className="habit-actions">
        <button className="btn edit" onClick={() => onEdit(habit)}>Edit</button>
        <button className="btn delete" onClick={() => onDelete(habit.id)}>Delete</button>
      </div>
    </div>
  );
}
