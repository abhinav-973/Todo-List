import React from 'react'
import { useState } from 'react'
import Clock from "react-clock";
import "react-clock/dist/Clock.css";


const Timepicker = () => {
    const [time, setTime] = useState(new Date());

  return (
    <div className='flex flex-col items-center'>
      <Clock value={time} onChange = {setTime}/>
      <p className="mt-2">Selected Time: {time.toLocaleTimeString()}</p>
    </div>
  )
}

export default Timepicker
