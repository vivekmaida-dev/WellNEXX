
import React, { useState, useEffect } from 'react';

interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
}

interface DayLog {
  date: string;
  entries: FoodEntry[];
  goal: number;
}

const COMMON_FOODS = [
  { name: 'Banana', calories: 89, protein: 1, carbs: 23, fat: 0 },
  { name: 'Apple', calories: 52, protein: 0, carbs: 14, fat: 0 },
  { name: 'Boiled Egg', calories: 78, protein: 6, carbs: 1, fat: 5 },
  { name: 'Chicken Breast (100g)', calories: 165, protein: 31, carbs: 0, fat: 4 },
  { name: 'Brown Rice (100g)', calories: 216, protein: 4, carbs: 45, fat: 2 },
  { name: 'Roti (1 piece)', calories: 80, protein: 3, carbs: 15, fat: 1 },
  { name: 'Dal (1 cup)', calories: 115, protein: 8, carbs: 18, fat: 2 },
  { name: 'Paneer (100g)', calories: 265, protein: 18, carbs: 3, fat: 21 },
  { name: 'Oats (40g)', calories: 150, protein: 5, carbs: 27, fat: 3 },
  { name: 'Almonds (10 pcs)', calories: 69, protein: 3, carbs: 2, fat: 6 },
  { name: 'Milk (200ml)', calories: 122, protein: 6, carbs: 9, fat: 7 },
  { name: 'Greek Yogurt (100g)', calories: 59, protein: 10, carbs: 4, fat: 0 },
  { name: 'Whey Protein (1 scoop)', calories: 120, protein: 25, carbs: 3, fat: 1 },
  { name: 'White Rice (100g)', calories: 130, protein: 3, carbs: 28, fat: 0 },
  { name: 'Sweet Potato (100g)', calories: 86, protein: 2, carbs: 20, fat: 0 },
  { name: 'Salmon (100g)', calories: 208, protein: 20, carbs: 0, fat: 13 },
  { name: 'Avocado (half)', calories: 161, protein: 2, carbs: 9, fat: 15 },
  { name: 'Idli (1 piece)', calories: 39, protein: 2, carbs: 8, fat: 0 },
  { name: 'Dosa (plain)', calories: 168, protein: 4, carbs: 30, fat: 4 },
  { name: 'Chapati + Sabzi', calories: 200, protein: 5, carbs: 30, fat: 7 },
];

const getTodayKey = () => new Date().toISOString().split('T')[0];

const loadLogs = (): Record<string, DayLog> => {
  try {
    return JSON.parse(localStorage.getItem('wellnexx_calories') || '{}');
  } catch {
    return {};
  }
};

const saveLogs = (logs: Record<string, DayLog>) => {
  localStorage.setItem('wellnexx_calories', JSON.stringify(logs));
};

const CalorieTracker: React.FC = () => {
  const today = getTodayKey();
  const [logs, setLogs] = useState<Record<string, DayLog>>(loadLogs);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [editGoal, setEditGoal] = useState(false);
  const [goalInput, setGoalInput] = useState('');
  const [foodSearch, setFoodSearch] = useState('');
  const [form, setForm] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '' });
  const [activeTab, setActiveTab] = useState<'today' | 'history'>('today');

  const todayLog: DayLog = logs[today] || { date: today, entries: [], goal: 2000 };

  const totalCalories = todayLog.entries.reduce((s, e) => s + e.calories, 0);
  const totalProtein = todayLog.entries.reduce((s, e) => s + e.protein, 0);
  const totalCarbs = todayLog.entries.reduce((s, e) => s + e.carbs, 0);
  const totalFat = todayLog.entries.reduce((s, e) => s + e.fat, 0);
  const progress = Math.min((totalCalories / todayLog.goal) * 100, 100);
  const remaining = todayLog.goal - totalCalories;

  const updateLog = (updated: DayLog) => {
    const newLogs = { ...logs, [today]: updated };
    setLogs(newLogs);
    saveLogs(newLogs);
  };

  const addEntry = (entry: Omit<FoodEntry, 'id' | 'time'>) => {
    const newEntry: FoodEntry = {
      ...entry,
      id: Date.now().toString(),
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
    updateLog({ ...todayLog, entries: [...todayLog.entries, newEntry] });
    setForm({ name: '', calories: '', protein: '', carbs: '', fat: '' });
    setShowAddForm(false);
    setShowQuickAdd(false);
  };

  const removeEntry = (id: string) => {
    updateLog({ ...todayLog, entries: todayLog.entries.filter(e => e.id !== id) });
  };

  const saveGoal = () => {
    const g = parseInt(goalInput);
    if (g > 0) updateLog({ ...todayLog, goal: g });
    setEditGoal(false);
  };

  const filteredFoods = COMMON_FOODS.filter(f =>
    f.name.toLowerCase().includes(foodSearch.toLowerCase())
  );

  const historyDays = Object.values(logs)
    .filter(d => d.date !== today)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 7);

  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference - (progress / 100) * circumference;
  const progressColor = progress >= 100 ? '#ef4444' : progress >= 80 ? '#f59e0b' : '#78350F';

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 page-transition">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">
            Calorie <span className="text-well-accent">Tracker</span>
          </h1>
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-1">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('today')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'today' ? 'bg-well-accent text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
          >
            Today
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'history' ? 'bg-well-accent text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
          >
            History
          </button>
        </div>
      </div>

      {activeTab === 'today' ? (
        <>
          {/* Progress Ring + Stats */}
          <div className="bg-well-primary border border-white/10 rounded-[2rem] p-6 mb-6 shadow-lg">
            <div className="flex items-center gap-8">
              {/* Ring */}
              <div className="relative flex-shrink-0">
                <svg width="128" height="128" viewBox="0 0 128 128">
                  <circle cx="64" cy="64" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                  <circle
                    cx="64" cy="64" r="54"
                    fill="none"
                    stroke={progressColor}
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    transform="rotate(-90 64 64)"
                    style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-white">{totalCalories}</span>
                  <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">kcal</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-white/30 uppercase tracking-widest">Goal</span>
                  {editGoal ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={goalInput}
                        onChange={e => setGoalInput(e.target.value)}
                        className="w-20 px-2 py-1 bg-white/10 border border-well-accent/50 text-white rounded-lg text-sm font-bold outline-none"
                        autoFocus
                      />
                      <button onClick={saveGoal} className="text-well-accent text-xs font-black">Save</button>
                      <button onClick={() => setEditGoal(false)} className="text-white/30 text-xs font-black">Cancel</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setEditGoal(true); setGoalInput(todayLog.goal.toString()); }}
                      className="text-white font-bold text-sm hover:text-well-accent transition-colors"
                    >
                      {todayLog.goal} kcal ✎
                    </button>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-white/30 uppercase tracking-widest">Remaining</span>
                  <span className={`font-bold text-sm ${remaining < 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {remaining < 0 ? `+${Math.abs(remaining)}` : remaining} kcal
                  </span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%`, backgroundColor: progressColor }}
                  />
                </div>
              </div>
            </div>

            {/* Macros */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/5">
              {[
                { label: 'Protein', value: totalProtein, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                { label: 'Carbs', value: totalCarbs, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                { label: 'Fat', value: totalFat, color: 'text-pink-400', bg: 'bg-pink-500/10' },
              ].map(m => (
                <div key={m.label} className={`${m.bg} rounded-2xl p-4 text-center`}>
                  <div className={`text-xl font-black ${m.color}`}>{m.value}g</div>
                  <div className="text-[10px] font-black text-white/30 uppercase tracking-widest mt-1">{m.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Buttons */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => { setShowAddForm(!showAddForm); setShowQuickAdd(false); }}
              className="flex-1 bg-well-accent text-white py-3 rounded-2xl font-black text-sm uppercase tracking-wider btn-glow transition-all hover:bg-well-accent/90"
            >
              + Custom Food
            </button>
            <button
              onClick={() => { setShowQuickAdd(!showQuickAdd); setShowAddForm(false); setFoodSearch(''); }}
              className="flex-1 bg-white/5 border border-white/10 text-white py-3 rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-white/10 transition-all"
            >
              Quick Add
            </button>
          </div>

          {/* Custom Add Form */}
          {showAddForm && (
            <div className="bg-well-primary border border-well-accent/30 rounded-[2rem] p-6 mb-6 shadow-lg">
              <h3 className="text-white font-black uppercase tracking-tighter italic text-lg mb-5">Add Food</h3>
              <div className="space-y-3">
                <input
                  placeholder="Food name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl outline-none focus:border-well-accent transition-all placeholder-white/20 font-medium"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number" placeholder="Calories (kcal)"
                    value={form.calories}
                    onChange={e => setForm({ ...form, calories: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl outline-none focus:border-well-accent transition-all placeholder-white/20 font-medium"
                  />
                  <input
                    type="number" placeholder="Protein (g)"
                    value={form.protein}
                    onChange={e => setForm({ ...form, protein: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl outline-none focus:border-well-accent transition-all placeholder-white/20 font-medium"
                  />
                  <input
                    type="number" placeholder="Carbs (g)"
                    value={form.carbs}
                    onChange={e => setForm({ ...form, carbs: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl outline-none focus:border-well-accent transition-all placeholder-white/20 font-medium"
                  />
                  <input
                    type="number" placeholder="Fat (g)"
                    value={form.fat}
                    onChange={e => setForm({ ...form, fat: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl outline-none focus:border-well-accent transition-all placeholder-white/20 font-medium"
                  />
                </div>
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => {
                      if (!form.name || !form.calories) return;
                      addEntry({
                        name: form.name,
                        calories: parseInt(form.calories) || 0,
                        protein: parseInt(form.protein) || 0,
                        carbs: parseInt(form.carbs) || 0,
                        fat: parseInt(form.fat) || 0,
                      });
                    }}
                    className="flex-1 bg-well-accent text-white py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all hover:bg-well-accent/90"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-6 bg-white/5 text-white/40 py-3 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quick Add Panel */}
          {showQuickAdd && (
            <div className="bg-well-primary border border-white/10 rounded-[2rem] p-6 mb-6 shadow-lg">
              <h3 className="text-white font-black uppercase tracking-tighter italic text-lg mb-4">Quick Add</h3>
              <input
                placeholder="Search foods..."
                value={foodSearch}
                onChange={e => setFoodSearch(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl outline-none focus:border-well-accent transition-all placeholder-white/20 font-medium mb-4"
              />
              <div className="space-y-2 max-h-72 overflow-y-auto hide-scrollbar">
                {filteredFoods.map(f => (
                  <button
                    key={f.name}
                    onClick={() => addEntry(f)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-well-accent/10 border border-white/5 hover:border-well-accent/30 rounded-xl transition-all group"
                  >
                    <div className="text-left">
                      <div className="text-white font-bold text-sm group-hover:text-well-accent transition-colors">{f.name}</div>
                      <div className="text-white/30 text-[10px] uppercase tracking-wider font-bold mt-0.5">
                        P: {f.protein}g · C: {f.carbs}g · F: {f.fat}g
                      </div>
                    </div>
                    <div className="text-well-accent font-black text-sm">{f.calories} kcal</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Food Log */}
          <div className="bg-well-primary border border-white/10 rounded-[2rem] p-6 shadow-lg">
            <h3 className="text-white font-black uppercase tracking-tighter italic text-lg mb-5">
              Today's Log
              <span className="ml-3 text-xs text-white/30 font-bold normal-case tracking-normal">
                {todayLog.entries.length} items
              </span>
            </h3>
            {todayLog.entries.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-3">🍽️</div>
                <p className="text-white/30 font-bold text-sm uppercase tracking-widest">No food logged yet</p>
                <p className="text-white/20 text-xs mt-1">Add your meals above</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayLog.entries.map(entry => (
                  <div key={entry.id} className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/8 rounded-2xl border border-white/5 group transition-all">
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-bold text-sm truncate">{entry.name}</div>
                      <div className="text-white/30 text-[10px] uppercase tracking-wider font-bold mt-0.5">
                        {entry.time} · P: {entry.protein}g · C: {entry.carbs}g · F: {entry.fat}g
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-3">
                      <span className="text-well-accent font-black text-sm">{entry.calories} kcal</span>
                      <button
                        onClick={() => removeEntry(entry.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/0 hover:bg-red-500/20 text-white/20 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        /* History Tab */
        <div className="bg-well-primary border border-white/10 rounded-[2rem] p-6 shadow-lg">
          <h3 className="text-white font-black uppercase tracking-tighter italic text-lg mb-6">Past 7 Days</h3>
          {historyDays.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-3">📊</div>
              <p className="text-white/30 font-bold text-sm uppercase tracking-widest">No history yet</p>
              <p className="text-white/20 text-xs mt-1">Start logging to see trends</p>
            </div>
          ) : (
            <div className="space-y-4">
              {historyDays.map(day => {
                const cal = day.entries.reduce((s, e) => s + e.calories, 0);
                const pct = Math.min((cal / day.goal) * 100, 100);
                const date = new Date(day.date + 'T00:00:00');
                return (
                  <div key={day.date} className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <div className="text-white font-bold text-sm">
                          {date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                        </div>
                        <div className="text-white/30 text-[10px] uppercase tracking-widest font-bold mt-0.5">
                          {day.entries.length} items logged
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-black text-sm ${cal > day.goal ? 'text-red-400' : 'text-well-accent'}`}>
                          {cal} kcal
                        </div>
                        <div className="text-white/30 text-[10px] font-bold">/ {day.goal} goal</div>
                      </div>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: pct >= 100 ? '#ef4444' : pct >= 80 ? '#f59e0b' : '#78350F',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CalorieTracker;
