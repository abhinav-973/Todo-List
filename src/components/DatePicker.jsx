import React, { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

const DatePicker = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div className="flex flex-col items-center">
      <Calendar onChange={setDate} value={date} />
      <p className="mt-2">Selected Date: {date.toDateString()}</p>
    </div>
  );
}

export default DatePicker
