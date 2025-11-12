import HabitCard from "./HabitCard";
import "../styles/Habit.css";

export default function HabitList({ habits, onEdit, onDelete }) {
  if (!habits?.length) {
    return <div className="no-habits">You haven't added any habits yet. Start by adding one above!</div>;
  }

  return (
    <div className="habit-list-wide">
      {habits.map((h) => (
        <HabitCard key={h.id} habit={h} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
