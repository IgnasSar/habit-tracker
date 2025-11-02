import { useEffect, useState } from "react";
import Header from "../components/Header";
import HabitForm from "../components/HabitForm";
import HabitList from "../components/HabitList";
import {
  getAllHabits,
  createHabit,
  updateHabit,
  deleteHabit,
} from "../api/habitApi";
import "../styles/Habit.css";

export default function MainPage() {
  const [habits, setHabits] = useState([]);
  const [editingHabit, setEditingHabit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [hasNextPage, setHasNextPage] = useState(false);

  async function load(p = page, l = limit) {
    setLoading(true);
    try {
      const data = await getAllHabits(p, l);
      const items = Array.isArray(data) ? data : data.items ?? [];

      setHasNextPage(items.length === l);

      setHabits(items);
    } catch {
      setHabits([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(page, limit);
  }, [page, limit]);

  async function handleSubmit(form) {
    try {
      if (editingHabit) {
        const updated = await updateHabit(editingHabit.id, form);
        setHabits((p) => p.map((h) => (h.id === updated.id ? updated : h)));
        setEditingHabit(null);
      } else {
        const created = await createHabit(form);
        setHabits((p) => [created, ...p]);
      }
    } catch {
      alert("Failed to save habit.");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this habit?")) return;
    try {
      await deleteHabit(id);
      setHabits((p) => p.filter((h) => h.id !== id));
    } catch {
      alert("Delete failed.");
    }
  }

  const handlePrev = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  const handleNext = () => {
    if (hasNextPage) setPage((p) => p + 1);
  };

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
        />

        {loading ? (
          <p className="loading">Loading…</p>
        ) : (
          <>
            <HabitList
              habits={habits}
              onEdit={setEditingHabit}
              onDelete={handleDelete}
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
