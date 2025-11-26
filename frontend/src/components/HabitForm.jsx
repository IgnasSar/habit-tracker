import { useEffect, useState } from "react";
import { getHabitChecks, deleteHabitCheck } from "../api/habitApi";
import { toLocalYYYYMMDD } from "../utils/dateUtil";
import "../styles/Habit.css";

export default function HabitForm({ onSubmit, editingHabit, onCancel, onRefresh }) {
  const empty = {
    name: "",
    target_count: 1,
    period_type: "weekly",
    period_length: 1,
  };
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [undoLoading, setUndoLoading] = useState(false);

  useEffect(() => {
    setForm(editingHabit ? { ...editingHabit } : empty);
    setErrors({});
  }, [editingHabit]);

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Habit name is required";
    if (form.target_count <= 0) e.target_count = "Must be positive";
    if (!["daily", "weekly", "monthly"].includes(form.period_type)) e.period_type = "Invalid type";
    if (form.period_length <= 0) e.period_length = "Must be positive";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    const isNumeric = name.includes("count") || name.includes("length");
    setForm((p) => ({ ...p, [name]: isNumeric ? Number(value) : value }));
  }

  async function submit(e) {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
    if (!editingHabit) setForm(empty);
  }

  async function handleUndo() {
    if (!editingHabit) return;
    setUndoLoading(true);
    try {
        const today = new Date();
        const past = new Date();
        past.setDate(past.getDate() - 30);
        
        const checks = await getHabitChecks(
            editingHabit.id, 
            toLocalYYYYMMDD(past), 
            toLocalYYYYMMDD(today)
        );
        
        if (checks.length === 0) {
            alert("No progress to undo recently.");
            setUndoLoading(false);
            return;
        }

        const sortedChecks = checks.sort((a, b) => b.id - a.id);
        const lastCheck = sortedChecks[0];
        
        if (window.confirm(`Undo check for ${lastCheck.entry_date}?`)) {
            await deleteHabitCheck(lastCheck.id);
            if (onRefresh) onRefresh();
        }
    } catch (e) {
        console.error(e);
        alert("Failed to undo.");
    } finally {
        setUndoLoading(false);
    }
  }

  const periodMap = { daily: 'day', weekly: 'week', monthly: 'month' };
  const goalText = `${form.target_count} time${form.target_count > 1 ? 's' : ''}`;
  const periodName = periodMap[form.period_type];
  const frequencyText = `every ${form.period_length} ${periodName}${form.period_length > 1 ? 's' : ''}`;

  return (
    <form className="habit-form-modern" onSubmit={submit} noValidate>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
            <h3 style={{margin: 0}}>{editingHabit ? "Edit Habit" : "Create New Habit"}</h3>
            {editingHabit && (
                <button 
                    type="button" 
                    className="btn delete" 
                    style={{fontSize: '0.8rem', padding: '0.4rem 0.8rem'}}
                    onClick={handleUndo}
                    disabled={undoLoading}
                >
                    {undoLoading ? "..." : "Undo Last Check"}
                </button>
            )}
        </div>

        <div className="form-field">
            <label>Habit Name</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="e.g., Go for a run"/>
            {errors.name && <span className="error-text">{errors.name}</span>}
        </div>
        
        <div className="form-field">
            <label>Your Goal Summary</label>
            <div className="dynamic-preview-text">{`${goalText}, ${frequencyText}`}</div>
        </div>

        <div className="form-row">
            <div className="form-field small">
                <label>Target Count</label>
                <input type="number" name="target_count" value={form.target_count} onChange={handleChange} min="1"/>
                {errors.target_count && <span className="error-text">{errors.target_count}</span>}
            </div>
            <div className="form-field small">
                <label>Period Length</label>
                <input type="number" name="period_length" value={form.period_length} onChange={handleChange} min="1"/>
                {errors.period_length && <span className="error-text">{errors.period_length}</span>}
            </div>
            <div className="form-field small">
                <label>Period Type</label>
                <select name="period_type" value={form.period_type} onChange={handleChange}>
                    <option value="daily">Day(s)</option>
                    <option value="weekly">Week(s)</option>
                    <option value="monthly">Month(s)</option>
                </select>
            </div>
        </div>
        <div className="form-actions">
            {editingHabit && <button type="button" className="btn neutral" onClick={onCancel}>Cancel</button>}
            <button type="submit" className="btn primary">{editingHabit ? "Save Changes" : "Add Habit"}</button>
        </div>
    </form>
  );
}
