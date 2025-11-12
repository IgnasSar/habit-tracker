import { useEffect, useState } from "react";
import "../styles/Habit.css";

export default function HabitForm({ onSubmit, editingHabit, onCancel }) {
  const empty = {
    name: "",
    target_count: 1,
    period_type: "weekly",
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
    if (!form.name.trim()) e.name = "Habit name is required";
    if (form.target_count <= 0) e.target_count = "Must be positive";
    if (!["daily", "weekly", "monthly"].includes(form.period_type))
      e.period_type = "Invalid type";
    if (form.period_length <= 0) e.period_length = "Must be positive";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({
      ...p,
      [name]:
        name.includes("count") || name.includes("length")
          ? Number(value)
          : value,
    }));
  }

  async function submit(e) {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
    if (!editingHabit) setForm(empty);
  }

  const periodMap = {
    daily: 'day',
    weekly: 'week',
    monthly: 'month',
  };

  const goalText = `${form.target_count} time${form.target_count > 1 ? 's' : ''}`;
  const periodName = periodMap[form.period_type];
  const frequencyText = `every ${form.period_length} ${periodName}${form.period_length > 1 ? 's' : ''}`;

  return (
    <form className="habit-form-modern" onSubmit={submit} noValidate>
      <div className="form-field">
        <label>Habit</label>
        <input
          className={errors.name ? "error" : ""}
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g., Go for a run"
        />
        {errors.name && <span className="error-text">{errors.name}</span>}
      </div>

      <div className="form-field">
        <label>Your Goal Summary</label>
        <div className="dynamic-preview-text">
          {`${goalText}, ${frequencyText}`}
        </div>
      </div>

      <div className="form-row">
        <div className="form-field small">
          <label>Goal</label>
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
          <label>Every</label>
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

        <div className="form-field small">
          <label>&nbsp;</label>
          <select
            name="period_type"
            value={form.period_type}
            onChange={handleChange}
          >
            <option value="daily">Day(s)</option>
            <option value="weekly">Week(s)</option>
            <option value="monthly">Month(s)</option>
          </select>
          {errors.period_type && (
            <span className="error-text">{errors.period_type}</span>
          )}
        </div>
      </div>

      <div className="form-actions">
        {editingHabit && (
          <button type="button" className="btn neutral" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn primary">
          {editingHabit ? "Save Changes" : "Add Habit"}
        </button>
      </div>
    </form>
  );
}
