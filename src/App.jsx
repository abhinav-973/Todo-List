import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from "./components/Header";

// --- Helper Functions & Constants ---
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const formatDeadline = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};

// --- SVG Icons ---
const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>
);
const DeleteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
);
const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"></path></svg>
);


// --- Reusable Components ---

const Calendar = ({ selectedDate, onDateChange }) => {
    const [viewDate, setViewDate] = useState(selectedDate || new Date());

    const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
    const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
    const startingDay = firstDayOfMonth.getDay();

    const calendarDays = [];
    for (let i = 0; i < startingDay; i++) {
        calendarDays.push(<div key={`empty-start-${i}`} className="w-10 h-10"></div>);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), i);
        const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
        const isToday = new Date().toDateString() === date.toDateString();
        const newSelectedDate = new Date(selectedDate.getTime());
        newSelectedDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());

        calendarDays.push(
            <div key={`day-${i}`} 
                 className={`w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-colors ${isSelected ? 'bg-blue-600 text-white' : isToday ? 'bg-blue-100 text-blue-800' : 'text-gray-300 hover:bg-gray-600'}`}
                 onClick={() => onDateChange(newSelectedDate)}>
                {i}
            </div>
        );
    }

    const changeMonth = (offset) => {
        setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    };

    return (
        <div className="p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => changeMonth(-1)} className="font-bold text-lg p-2 rounded-full hover:bg-gray-600">&lt;</button>
                <div className="font-bold text-lg">{MONTH_NAMES[viewDate.getMonth()]} {viewDate.getFullYear()}</div>
                <button onClick={() => changeMonth(1)} className="font-bold text-lg p-2 rounded-full hover:bg-gray-600">&gt;</button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-400 mb-2">
                {DAYS_OF_WEEK.map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
                {calendarDays}
            </div>
        </div>
    );
};

const AnalogClock = ({ time, onTimeChange }) => {
    const [selectionMode, setSelectionMode] = useState('hour'); // 'hour' or 'minute'

    const handleNumberClick = (value) => {
        const newTime = new Date(time.getTime());
        if (selectionMode === 'hour') {
            const currentHours = newTime.getHours();
            const isPM = currentHours >= 12;
            let newHour = value; // 1-12
            if (isPM && newHour !== 12) {
                newHour += 12;
            } else if (!isPM && newHour === 12) {
                newHour = 0; // Midnight case
            }
            newTime.setHours(newHour);
            onTimeChange(newTime);
            setSelectionMode('minute'); // Automatically switch to minute selection
        } else { // 'minute'
            newTime.setMinutes(value);
            onTimeChange(newTime);
        }
    };

    const setAmPm = (period) => {
        const newTime = new Date(time.getTime());
        const hours = newTime.getHours();
        if (period === 'am' && hours >= 12) {
            newTime.setHours(hours - 12);
        } else if (period === 'pm' && hours < 12) {
            newTime.setHours(hours + 12);
        }
        onTimeChange(newTime);
    }

    const hours = time.getHours();
    const minutes = time.getMinutes();
    const isPM = hours >= 12;
    const displayHour = hours % 12 === 0 ? 12 : hours % 12;

    const numbers = selectionMode === 'hour' 
        ? [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] 
        : [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    
    const selectedValue = selectionMode === 'hour' ? displayHour : minutes;
    const angle = selectionMode === 'hour' ? (displayHour % 12) * 30 : (minutes % 60) * 6;

    return (
        <div className="flex flex-col items-center">
            {/* Digital Display & AM/PM */}
            <div className="flex items-center gap-4 mb-6 w-full justify-center">
                <div className="flex items-center text-6xl font-light">
                    <span className={`px-4 py-1 rounded-lg cursor-pointer transition-colors ${selectionMode === 'hour' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`} onClick={() => setSelectionMode('hour')}>
                        {String(displayHour).padStart(2, '0')}
                    </span>
                    <span className="mx-2 animate-pulse">:</span>
                     <span className={`px-4 py-1 rounded-lg cursor-pointer transition-colors ${selectionMode === 'minute' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`} onClick={() => setSelectionMode('minute')}>
                        {String(minutes).padStart(2, '0')}
                    </span>
                </div>
                <div className="flex flex-col gap-2">
                    <button onClick={() => setAmPm('am')} className={`px-3 py-1 text-sm font-medium border rounded-md transition-colors ${!isPM ? 'bg-green-500 border-green-500 text-white' : 'border-gray-500 hover:bg-gray-600'}`}>a.m.</button>
                    <button onClick={() => setAmPm('pm')} className={`px-3 py-1 text-sm font-medium border rounded-md transition-colors ${isPM ? 'bg-green-500 border-green-500 text-white' : 'border-gray-500 hover:bg-gray-600'}`}>p.m.</button>
                </div>
            </div>
            
            {/* Analog Clock Face */}
            <div className="w-64 h-64 bg-gray-700 rounded-full relative select-none flex items-center justify-center">
                <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10"></div>
                <div className="absolute top-1/2 left-1/2 w-0.5 rounded-full origin-top"
                     style={{ height: '40%', background: '#60a5fa', transform: `translate(-50%, -100%) rotate(${angle}deg)`, transformOrigin: 'bottom', transition: 'transform 0.3s ease-out' }}>
                </div>
                {numbers.map((num, i) => {
                    const numberAngle = selectionMode === 'hour' ? i * 30 : num * 6;
                    const isSelected = num === (selectionMode === 'hour' ? displayHour : minutes);

                    // The radius as a percentage of the container's half-width. 
                    // A value of ~42% pushes the numbers towards the edge.
                    const radius = 42; 
                    const x = Math.sin(numberAngle * Math.PI / 180) * radius;
                    const y = -Math.cos(numberAngle * Math.PI / 180) * radius;

                    return (
                        <div key={num} onClick={() => handleNumberClick(num)}
                             className={`absolute w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-all duration-200
                                ${isSelected ? 'bg-blue-500 text-white' : 'hover:bg-gray-600'}`}
                             style={{ top: `calc(50% + ${y}%)`, left: `calc(50% + ${x}%)`, transform: 'translate(-50%, -50%)' }}>
                            {selectionMode === 'minute' && num === 0 ? '00' : num}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [showFinished, setShowFinished] = useState(true);
  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const [deleteAll, setDeleteAll] = useState(false);
  const [isDeadlineModalOpen, setIsDeadlineModalOpen] = useState(false);
  const [deadline, setDeadline] = useState(new Date());

  const isInitialMount = useRef(true);

  // --- Effects ---
  useEffect(() => {
    try {
      const storedTodos = JSON.parse(localStorage.getItem("todos") || '[]');
      const parsedTodos = storedTodos.map(task => ({...task, deadline: new Date(task.deadline)}));
      setTodos(parsedTodos);
    } catch (error) {
      console.error("Failed to parse todos from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // --- Handlers ---
  const handleAdd = () => {
    if (!todo.trim()) return;
    const newTodos = [...todos, { id: Date.now(), todo, isCompleted: false, deadline }];
    newTodos.sort((a, b) => a.deadline - b.deadline);
    setTodos(newTodos);
    setTodo("");
    setDeadline(new Date()); 
  };

  const handleEdit = (id) => {
    const taskToEdit = todos.find((item) => item.id === id);
    if (taskToEdit) {
      setTodo(taskToEdit.todo);
      setDeadline(taskToEdit.deadline);
      const newTodos = todos.filter((item) => item.id !== id);
      setTodos(newTodos);
      setIsDeadlineModalOpen(true);
    }
  };

  const handleDeleteClick = (id) => setDeleteTaskId(id);
  const confirmDelete = () => {
    if (deleteTaskId) {
      setTodos(todos.filter((item) => item.id !== deleteTaskId));
      setDeleteTaskId(null);
    }
  };
  const cancelDelete = () => setDeleteTaskId(null);

  const confirmDeleteAll = () => { setTodos([]); setDeleteAll(false); };
  const cancelDeleteAll = () => setDeleteAll(false);
  
  const handleCheckBox = (e) => {
    const id = Number(e.target.name);
    setTodos(todos.map(item => item.id === id ? { ...item, isCompleted: !item.isCompleted } : item));
  };

  return (
    <>
    <Header/>
      <style>{`
        @keyframes fadeInScaleUp { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in-scale-up { animation: fadeInScaleUp 0.2s ease-out forwards; }
        @keyframes slideInFromRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        .animate-slide-in { animation: slideInFromRight 0.3s ease-out forwards; }
      `}</style>

      <div className="bg-gray-100 min-h-screen font-sans p-4">
        <div className="container mx-auto my-8 p-6 w-[95vw] sm:w-[90vw] md:w-[70vw] lg:w-[55vw] bg-white shadow-2xl rounded-2xl min-h-[80vh] border border-gray-200 flex flex-col">
          <div className="text-center mb-6">
            <h1 className="font-extrabold text-3xl md:text-4xl text-slate-800">iTask</h1>
            <p className="text-gray-500">Your Productivity Companion</p>
          </div>

          <div className="mb-4">
            <h2 className="text-lg font-bold mb-2 text-slate-700">Add a Task</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <input type="text" value={todo} onChange={e => setTodo(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                     className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                     placeholder="What needs to be done?" />
              <button onClick={() => { setDeadline(new Date()); setIsDeadlineModalOpen(true); }} className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium shadow-sm active:scale-95 transition">
                <CalendarIcon />
                Set Deadline
              </button>
              <button onClick={handleAdd} disabled={!todo.trim()}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-md active:scale-95 transition disabled:bg-blue-300">
                Save
              </button>
            </div>
          </div>
          
          <div className="h-[1px] bg-gray-200 my-4"></div>

          <h2 className="text-lg font-bold mb-2 text-slate-700">Your Tasks</h2>
          <div className="showFinished my-3 flex items-center gap-3">
            <input type="checkbox" id="showFinished" checked={showFinished} onChange={() => setShowFinished(!showFinished)}
                   className="w-4 h-4 accent-blue-600 cursor-pointer" />
            <label htmlFor="showFinished" className="text-gray-700 font-medium cursor-pointer select-none">Show Finished Tasks</label>
          </div>

          <div className="flex-grow max-h-[45vh] overflow-y-auto pr-2">
              {todos.length === 0 ? (
                  <div className="m-5 font-semibold text-gray-500 text-center">No tasks yet. Add one above! 🎉</div>
              ) : (
                  todos.filter(t => showFinished || !t.isCompleted).map(item => (
                      <div key={item.id} className="todo flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow-md transition duration-200 my-2 animate-slide-in">
                          <div className="flex items-center gap-3 mb-2 sm:mb-0">
                              <input name={String(item.id)} type="checkbox" checked={item.isCompleted} onChange={handleCheckBox}
                                     className="w-5 h-5 accent-blue-600 cursor-pointer flex-shrink-0 mt-1" />
                              <div>
                                  <span className={`text-base break-all ${item.isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                      {item.todo}
                                  </span>
                                  <p className="text-xs text-blue-600 font-medium mt-1">{formatDeadline(item.deadline)}</p>
                              </div>
                          </div>
                          <div className="flex gap-2 self-end sm:self-center">
                              <button onClick={() => handleEdit(item.id)} aria-label="Edit Task" className="p-2 rounded-full text-blue-600 hover:bg-blue-100 transition"><EditIcon /></button>
                              <button onClick={() => handleDeleteClick(item.id)} aria-label="Delete Task" className="p-2 rounded-full text-red-600 hover:bg-red-100 transition"><DeleteIcon /></button>
                          </div>
                      </div>
                  ))
              )}
          </div>

          {todos.length > 0 && (
            <div className="mt-auto pt-4 border-t border-gray-200 flex justify-between items-center">
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-4 py-1.5 rounded-full">
                {`${todos.filter(t => !t.isCompleted).length} tasks left`}
              </span>
              <button onClick={() => setDeleteAll(true)} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition">Delete All</button>
            </div>
          )}
        </div>
      </div>
      
      {/* --- Modals --- */}
      {isDeadlineModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsDeadlineModalOpen(false)}></div>
              <div className="relative bg-gray-800 text-white p-6 rounded-lg shadow-lg w-[90vw] max-w-2xl z-10 animate-fade-in-scale-up flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Calendar selectedDate={deadline} onDateChange={setDeadline} />
                  </div>
                  <div className="flex flex-1 flex-col justify-center items-center">
                      <AnalogClock time={deadline} onTimeChange={setDeadline} />
                      <div className="w-full flex gap-4 mt-6">
                        <button onClick={() => setIsDeadlineModalOpen(false)} className="flex-1 px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-500 transition">Cancel</button>
                        <button onClick={() => setIsDeadlineModalOpen(false)} className="flex-1 px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition">OK</button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {deleteTaskId && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={cancelDelete}></div>
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-80 text-center z-10 animate-fade-in-scale-up">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this task?</p>
            <div className="flex justify-center gap-4">
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition">Yes, Delete</button>
              <button onClick={cancelDelete} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {deleteAll && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={cancelDeleteAll}></div>
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-80 text-center z-50 animate-fade-in-scale-up">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete All</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to delete <strong>all tasks</strong>?</p>
            <div className="flex justify-center gap-4">
              <button onClick={confirmDeleteAll} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition">Yes, Delete All</button>
              <button onClick={cancelDeleteAll} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;


