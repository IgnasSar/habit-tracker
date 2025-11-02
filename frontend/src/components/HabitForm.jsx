import { useEffect, useState } from "react";
import "../styles/Habit.css";

export default function HabitForm({ onSubmit, editingHabit, onCancel }) {
  const empty = {
    name: "",
    target_count: 1,
    period_type: "daily",
    period_length: 1,
  };
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(
      editingHabit
        ? {
            name: editingHabit.name,
            target_count: editingHabit.target_count,
            period_type: editingHabit.period_type,
            period_length: editingHabit.period_length,
          }
        : empty
    );
    setErrors({});
  }, [editingHabit]);

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name required";
    if (form.target_count <= 0) e.target_count = "Positive number";
    if (!["daily", "weekly", "monthly"].includes(form.period_type))
      e.period_type = "Invalid type";
    if (form.period_length <= 0) e.period_length = "Positive number";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({
      ...p,
      [name]:
        name.includes("count") || name.includes("length") ? Number(value) : value,
    }));
  }

  async function submit(e) {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
    if (!editingHabit) setForm(empty);
  }

  return (
    <form className="habit-form-modern" onSubmit={submit} noValidate>
      <div className="form-field">
        <label>Habit name</label>
        <input
          className={errors.name ? "error" : ""}
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Read 30 min / Go for a run"
        />
        {errors.name && <span className="error-text">{errors.name}</span>}
      </div>

      <div className="form-row">
        <div className="form-field small">
          <label>Target count</label>
          <input
            type="number"
            name="target_count"
            value={form.target_count}
            onChange={handleChange}
            min="1"
          />
          {errors.target_count && (
            <span className="error-text">{errors.target_count}</span>
          )}
        </div>

        <div className="form-field small">
          <label>Period type</label>
          <select
            name="period_type"
            value={form.period_type}
            onChange={handleChange}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          {errors.period_type && (
            <span className="error-text">{errors.period_type}</span>
          )}
        </div>

        <div className="form-field small">
          <label>Period length</label>
          <input
            type="number"
            name="period_length"
            value={form.period_length}
            onChange={handleChange}
            min="1"
          />
          {errors.period_length && (
            <span className="error-text">{errors.period_length}</span>
          )}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn primary">
          {editingHabit ? "Save" : "Add"}
        </button>
        {editingHabit && (
          <button type="button" className="btn neutral" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
