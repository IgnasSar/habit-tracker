import "../styles/Habit.css";

export default function HabitCard({ habit, onEdit, onDelete }) {
  return (
    <div className="habit-card-wide">
      <div className="habit-info">
        <h3 className="habit-title">{habit.name}</h3>
        <div className="habit-details">
          <span><strong>Target:</strong> {habit.target_count}</span>
          <span><strong>Period:</strong> {habit.period_type} ({habit.period_length})</span>
        </div>
      </div>

      <div className="habit-actions">
        <button className="btn edit" onClick={() => onEdit(habit)}>Edit</button>
        <button className="btn delete" onClick={() => onDelete(habit.id)}>Delete</button>
      </div>
    </div>
  );
}
