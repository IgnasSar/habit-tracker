import { useEffect, useState, useMemo } from "react";
import Header from "../components/Header";
import CalendarHabitItem from "../components/CalendarHabitItem";
import {
  getAllHabits,
  getHabitChecks,
  createHabitCheck,
} from "../api/habitApi";
import "../styles/Calendar.css";

const toYYYYMMDD = (date) => date.toISOString().split("T")[0];

const getPeriodForDate = (habit, date) => {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);

  if (habit.period_type === "daily") {
    const start = new Date(d);
    return { start: toYYYYMMDD(start), end: toYYYYMMDD(start) };
  }
  if (habit.period_type === "weekly") {
    const day = d.getUTCDay();
    const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1);
    const start = new Date(d.setUTCDate(diff));
    const end = new Date(start);
    end.setUTCDate(start.getUTCDate() + 6);
    return { start: toYYYYMMDD(start), end: toYYYYMMDD(end) };
  }
  if (habit.period_type === "monthly") {
    const start = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
    const end = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0));
    return { start: toYYYYMMDD(start), end: toYYYYMMDD(end) };
  }
  return { start: toYYYYMMDD(d), end: toYYYYMMDD(d) };
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [habits, setHabits] = useState([]);
  const [allChecks, setAllChecks] = useState([]);
  const [loading, setLoading] = useState(true);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const todayStr = toYYYYMMDD(new Date());

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const userHabits = await getAllHabits(1, 100);
        setHabits(userHabits);

        const firstDay = toYYYYMMDD(new Date(year, month, 1));
        const lastDay = toYYYYMMDD(new Date(year, month + 1, 0));

        const checkPromises = userHabits.map((h) =>
          getHabitChecks(h.id, firstDay, lastDay)
        );
        const checksByHabit = await Promise.all(checkPromises);
        setAllChecks(checksByHabit.flat());
      } catch (e) {
        console.error("Failed to load calendar data", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [year, month]);

  const checksByHabitId = useMemo(() => {
    return allChecks.reduce((acc, check) => {
      acc[check.habit_id] = acc[check.habit_id] || [];
      acc[check.habit_id].push(check);
      return acc;
    }, {});
  }, [allChecks]);

  const handleAddProgressForDate = async (habit, date) => {
    const period = getPeriodForDate(habit, date);
    const checksForHabit = checksByHabitId[habit.id] || [];
    const checksInPeriod = checksForHabit.filter(
      (c) => c.entry_date >= period.start && c.entry_date <= period.end
    );
    
    if (checksInPeriod.length >= habit.target_count) {
      alert("You've already met your goal for this period!");
      return;
    }
    
    const tempId = Date.now();
    const tempCheck = { id: tempId, habit_id: habit.id, entry_date: date };
    setAllChecks((prev) => [...prev, tempCheck]);

    try {
      const newCheck = await createHabitCheck(habit.id, date);
      setAllChecks((prev) => prev.map((c) => (c.id === tempId ? newCheck : c)));
    } catch (err) {
      alert("Failed to save progress. Reverting.");
      setAllChecks((prev) => prev.filter((c) => c.id !== tempId));
    }
  };

  const renderCalendarGrid = () => {
    const days = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDayOfWeek = new Date(year, month, 1).getDay();
    const adjustedStartDay = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

    for (let i = 0; i < adjustedStartDay; i++) {
        days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = toYYYYMMDD(new Date(year, month, d));
      const isLocked = dateStr > todayStr;

      days.push(
        <div key={d} className="calendar-day">
          <div className="day-number">{d}</div>
          <div className="day-events">
            {habits.map((habit) => {
              const period = getPeriodForDate(habit, dateStr);
              const checksForHabit = checksByHabitId[habit.id] || [];
              const checksInPeriod = checksForHabit.filter(
                (c) => c.entry_date >= period.start && c.entry_date <= period.end
              );
              
              const currentProgress = checksInPeriod.length;
              const isPeriodGoalMet = currentProgress >= habit.target_count;
              
              const checksTodayCount = checksForHabit.filter(c => c.entry_date === dateStr).length;

              return (
                <CalendarHabitItem
                  key={`${habit.id}-${dateStr}`}
                  habit={habit}
                  date={dateStr}
                  onAddProgress={handleAddProgressForDate}
                  isLocked={isLocked}
                  isPeriodGoalMet={isPeriodGoalMet}
                  currentProgress={currentProgress}
                  checksTodayCount={checksTodayCount}
                />
              );
            })}
          </div>
        </div>
      );
    }
    return days;
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="calendar-page">
      <Header />
      <div className="calendar-container">
        <div className="calendar-header">
          <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="nav-btn">&lt;</button>
          <h2>{monthNames[month]} {year}</h2>
          <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="nav-btn">&gt;</button>
        </div>
        <div className="calendar-grid-header">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (<div key={day} className="weekday-name">{day}</div>))}
        </div>
        <div className="calendar-grid">
          {loading ? (<div className="cal-loading">Loading Schedule...</div>) : renderCalendarGrid()}
        </div>
      </div>
    </div>
  );
}
