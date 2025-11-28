import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import Header from "../components/Header";
import { getHabitById, getHabitChecks } from "../api/habitApi";
import { toLocalYYYYMMDD } from "../utils/dateUtil";
import "../styles/HabitStats.css";

export default function HabitStatsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [habit, setHabit] = useState(null);
  const [checks, setChecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState(90);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const habitData = await getHabitById(id);
        setHabit(habitData);

        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - timeRange);
        
        const checksData = await getHabitChecks(
          id,
          toLocalYYYYMMDD(start),
          toLocalYYYYMMDD(end)
        );
        setChecks(checksData);
      } catch (err) {
        console.error(err);
        setError("Failed to load statistics.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, timeRange]);

  const stats = useMemo(() => {
    if (!habit || !checks) return null;

    const map = new Map();
    checks.forEach((c) => {
      const date = c.entry_date.split("T")[0]; 
      map.set(date, (map.get(date) || 0) + 1);
    });

    const dailyChartData = [];
    const today = new Date();
    
    const daysToShow = Math.min(timeRange, 45); 
    
    for (let i = daysToShow - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = toLocalYYYYMMDD(d);
      const val = map.get(dateStr) || 0;
      dailyChartData.push({
        date: dateStr.slice(5),
        count: val,
        fullDate: dateStr,
      });
    }

    let totalMetPeriods = 0;
    let totalPeriods = 0;
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;
    let streakBroken = false;
    
    const startOfAnalysis = new Date();
    startOfAnalysis.setDate(startOfAnalysis.getDate() - timeRange);
    
    let loopDate = new Date();
    loopDate.setHours(0,0,0,0);

    let safety = 0;
    while(loopDate > startOfAnalysis && safety < 1000) {
        safety++;
        let periodStart, periodEnd;
        
        if (habit.period_type === 'daily') {
            periodEnd = toLocalYYYYMMDD(loopDate);
            periodStart = periodEnd;
            loopDate.setDate(loopDate.getDate() - 1);
        } else if (habit.period_type === 'weekly') {
             const day = loopDate.getDay();
             const diff = loopDate.getDate() - day + (day === 0 ? -6 : 1);
             const monday = new Date(loopDate);
             monday.setDate(diff);
             const sunday = new Date(monday);
             sunday.setDate(monday.getDate() + 6);
             periodStart = toLocalYYYYMMDD(monday);
             periodEnd = toLocalYYYYMMDD(sunday);
             loopDate.setDate(loopDate.getDate() - 7);
        } else {
            periodStart = toLocalYYYYMMDD(new Date(loopDate.getFullYear(), loopDate.getMonth(), 1));
            periodEnd = toLocalYYYYMMDD(new Date(loopDate.getFullYear(), loopDate.getMonth() + 1, 0));
            loopDate.setMonth(loopDate.getMonth() - 1);
        }

        const checksInPeriod = checks.filter(c => {
             return c.entry_date >= periodStart && c.entry_date <= periodEnd;
        }).length;

        totalPeriods++;

        if (checksInPeriod >= habit.target_count) {
            totalMetPeriods++;
            tempStreak++;
            if (!streakBroken) currentStreak++;
        } else {
            if (tempStreak > bestStreak) bestStreak = tempStreak;
            tempStreak = 0;
            
            const pEndObj = new Date(periodEnd);
            const now = new Date();
            if (pEndObj < now) streakBroken = true;
        }
    }
    if (tempStreak > bestStreak) bestStreak = tempStreak;

    const trendData = [];
    let trendLoopDate = new Date(startOfAnalysis);
    
    const day = trendLoopDate.getDay();
    const diff = trendLoopDate.getDate() - day + (day === 0 ? -6 : 1);
    trendLoopDate.setDate(diff);

    safety = 0;
    const now = new Date();

    while(trendLoopDate <= now && safety < 1000) {
        safety++;
        const wStart = toLocalYYYYMMDD(trendLoopDate);
        const wEndObj = new Date(trendLoopDate);
        wEndObj.setDate(wEndObj.getDate() + 6);
        const wEnd = toLocalYYYYMMDD(wEndObj);

        const checksInWeek = checks.filter(c => c.entry_date >= wStart && c.entry_date <= wEnd).length;

        let weeklyTarget = 0;
        if (habit.period_type === 'daily') weeklyTarget = habit.target_count * 7;
        else if (habit.period_type === 'weekly') weeklyTarget = habit.target_count;
        else weeklyTarget = Math.max(1, Math.ceil(habit.target_count / 4));

        let percent = Math.round((checksInWeek / weeklyTarget) * 100);
        if (percent > 100) percent = 100;

        trendData.push({
            date: wStart.slice(5),
            performance: percent,
            fullDate: wStart
        });

        trendLoopDate.setDate(trendLoopDate.getDate() + 7);
    }

    const completionRate = totalPeriods > 0 
        ? Math.round((totalMetPeriods / totalPeriods) * 100) 
        : 0;

    return {
      dailyChartData,
      trendData,
      currentStreak,
      bestStreak,
      completionRate,
      totalChecks: checks.length,
    };
  }, [habit, checks, timeRange]);

  const handleRangeChange = (e) => {
      setTimeRange(Number(e.target.value));
  };

  if (loading) return <div className="loading-screen">Loading statistics...</div>;
  if (error) return <div className="error-screen">{error}</div>;
  if (!habit) return <div className="error-screen">Habit not found.</div>;

  return (
    <div className="stats-page">
      <Header />
      <div className="stats-container">
        
        <div className="stats-header-row">
            <div className="header-left">
                <button className="back-btn" onClick={() => navigate(-1)}>&larr; Back</button>
                <div className="title-block">
                    <h1>{habit.name}</h1>
                    <div className="habit-badges">
                        <span className="badge type">
                        {habit.period_type === "daily" ? "Daily" : 
                        habit.period_type === "weekly" ? "Weekly" : "Monthly"}
                        </span>
                    </div>
                </div>
            </div>
            
            <div className="header-right">
                <label className="range-label">Time Range:</label>
                <select className="range-select" value={timeRange} onChange={handleRangeChange}>
                    <option value={30}>Last 30 Days</option>
                    <option value={90}>Last 3 Months</option>
                    <option value={180}>Last 6 Months</option>
                    <option value={365}>Last Year</option>
                </select>
            </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Current Streak</h3>
            <div className="stat-value highlight">{stats.currentStreak} <span className="stat-unit">periods</span></div>
            <div className="stat-desc">Active run</div>
          </div>
          <div className="stat-card">
            <h3>Best Streak</h3>
            <div className="stat-value">{stats.bestStreak} <span className="stat-unit">periods</span></div>
            <div className="stat-desc">Personal record</div>
          </div>
          <div className="stat-card">
            <h3>Success Rate</h3>
            <div className="stat-value">{stats.completionRate}%</div>
            <div className="stat-desc">Goals met in range</div>
          </div>
          <div className="stat-card">
            <h3>Total Volume</h3>
            <div className="stat-value">{stats.totalChecks}</div>
            <div className="stat-desc">Total check-ins</div>
          </div>
        </div>

        <div className="charts-layout">
            
            <div className="chart-box">
                <div className="chart-header">
                    <h3>Performance Curve</h3>
                    <p>Weekly completion percentage over time</p>
                </div>
                <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={stats.trendData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6c63ff" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#6c63ff" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                            <XAxis dataKey="date" tick={{fontSize: 12, fill: '#aaa'}} axisLine={false} tickLine={false} />
                            <YAxis domain={[0, 100]} tick={{fontSize: 12, fill: '#aaa'}} axisLine={false} tickLine={false} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
                                formatter={(value) => [`${value}%`, "Performance"]}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="performance" 
                                stroke="#6c63ff" 
                                strokeWidth={3}
                                fillOpacity={1} 
                                fill="url(#colorPerf)" 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="chart-box">
                <div className="chart-header">
                    <h3>Activity Volume</h3>
                    <p>Number of check-ins per day</p>
                </div>
                <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={stats.dailyChartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee"/>
                        <XAxis dataKey="date" tick={{fontSize: 12, fill: '#aaa'}} axisLine={false} tickLine={false} />
                        <YAxis allowDecimals={false} tick={{fontSize: 12, fill: '#aaa'}} axisLine={false} tickLine={false} />
                        <Tooltip 
                            cursor={{ fill: '#f7f7f7' }}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
                        />
                        <Bar dataKey="count" fill="#82ca9d" radius={[4, 4, 0, 0]} name="Check-ins" barSize={16} />
                    </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}
