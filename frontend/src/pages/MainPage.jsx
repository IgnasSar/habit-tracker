import { useEffect, useState } from "react";
import Header from "../components/Header";
import HabitForm from "../components/HabitForm";
import HabitList from "../components/HabitList";
import {
  getAllHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  getHabitChecks,
  createHabitCheck,
} from "../api/habitApi";
import { toLocalYYYYMMDD } from "../utils/dateUtil";
import "../styles/Habit.css";

const getPeriodStart = (habit) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  if (habit.period_type === "daily") {
    return now;
  }
  if (habit.period_type === "weekly") {
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const start = new Date(now);
    start.setDate(diff);
    return start;
  }
  if (habit.period_type === "monthly") {
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }
  return now;
};

export default function MainPage() {
  const [habitsWithProgress, setHabitsWithProgress] = useState([]);
  const [editingHabit, setEditingHabit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [hasNextPage, setHasNextPage] = useState(false);

  async function loadData(p = page, l = limit) {
    setLoading(true);
    try {
      const habitsData = await getAllHabits(p, l);
      setHasNextPage(habitsData.length === l);

      if (!habitsData.length) {
        setHabitsWithProgress([]);
        setLoading(false);
        return;
      }

      const progressPromises = habitsData.map(async (habit) => {
        const periodStart = getPeriodStart(habit);
        const today = new Date();
        const startStr = toLocalYYYYMMDD(periodStart);
        const endStr = toLocalYYYYMMDD(today);
        
        const checks = await getHabitChecks(habit.id, startStr, endStr);
        return {
          ...habit,
          checks,
          current_progress: checks.length,
        };
      });

      const habitsWithData = await Promise.all(progressPromises);
      setHabitsWithProgress(habitsWithData);

      if (editingHabit) {
        const updatedEditing = habitsWithData.find(h => h.id === editingHabit.id);
        if (updatedEditing) {
          setEditingHabit(updatedEditing);
        }
      }

    } catch (err) {
      console.error("Failed to load habits:", err);
      setHabitsWithProgress([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData(page, limit);
  }, [page, limit]);

  async function handleSubmit(form) {
    try {
      if (editingHabit) {
        await updateHabit(editingHabit.id, form);
      } else {
        await createHabit(form);
      }
      setEditingHabit(null);
      loadData(1, limit);
      setPage(1);
    } catch {
      alert("Failed to save habit.");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this habit?")) return;
    try {
      await deleteHabit(id);
      loadData(page, limit);
    } catch {
      alert("Delete failed.");
    }
  }

  async function handleAddProgress(habit) {
    const todayStr = toLocalYYYYMMDD(new Date());
    
    if (habit.current_progress >= habit.target_count) {
      alert("You've already reached your goal for this period!");
      return;
    }

    const hasDoneToday = habit.checks.some(c => c.entry_date === todayStr);
    if (hasDoneToday) {
       alert("You have already checked in today!");
       return;
    }

    try {
      await createHabitCheck(habit.id, todayStr);
      loadData(page, limit);
    } catch (err) {
      console.error("Failed to add progress:", err);
      alert("Action failed. Please refresh and try again.");
    }
  }

  const handlePrev = () => page > 1 && setPage((p) => p - 1);
  const handleNext = () => hasNextPage && setPage((p) => p + 1);

  return (
    <div className="main-page">
      <Header />
      <div className="habit-container">
        <div className="habit-header">
          <h2>Your Habits</h2>
          <p>Build routines by tracking targets over chosen periods.</p>
        </div>
        <HabitForm
          onSubmit={handleSubmit}
          editingHabit={editingHabit}
          onCancel={() => setEditingHabit(null)}
          onRefresh={() => loadData(page, limit)}
        />
        {loading ? (
          <p className="loading">Loading…</p>
        ) : (
          <>
            <HabitList
              habits={habitsWithProgress}
              onEdit={setEditingHabit}
              onDelete={handleDelete}
              onAddProgress={handleAddProgress}
            />
            <div className="pagination">
              <button
                onClick={handlePrev}
                disabled={page === 1}
                className="pagination-btn"
              >
                Previous
              </button>
              <span className="pagination-info">Page {page}</span>
              <button
                onClick={handleNext}
                disabled={!hasNextPage}
                className="pagination-btn"
              >
                Next
              </button>
              <div className="per-page-selector">
                <label htmlFor="limit">Show:</label>
                <select
                  id="limit"
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
