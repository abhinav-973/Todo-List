import React, { useState } from "react";
import Calendar from "react-calendar";
import Clock from "react-clock";
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

const DeadLinePicker = () => {
 const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());

  const handleSave = () => {
    // combine date + time into one Date object
    const finalDateTime = new Date(date);
    finalDateTime.setHours(time.getHours(), time.getMinutes(), 0);
    onDeadlineSet(finalDateTime);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <h2 className="text-xl font-semibold">Pick Deadline</h2>
      
      {/* Calendar */}
      <Calendar onChange={setDate} value={date} />

      {/* Analog Clock */}
      <Clock value={time} onChange={setTime} />

      <button
        onClick={handleSave}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Set Deadline
      </button>
    </div>
  );
}

export default DeadLinePicker
