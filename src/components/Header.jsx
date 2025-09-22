import React from "react";
import { useState, useEffect } from "react";
import { FaTasks } from "react-icons/fa";

const Header = () => {
  const [time, setTime] = useState(new Date());

  // update clock every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg rounded-2xl px-6 py-5 flex justify-between items-center mt-1 mx-1">
      {/* Left - App Name + Icon */}
      <div className="flex items-center gap-3">
        <FaTasks className="text-white text-2xl animate-bounce" />
        <h1 className="text-3xl font-extrabold text-white tracking-wide">
          iTask
        </h1>
      </div>

      {/* Right - Live Clock */}
      <div className="text-lg font-mono text-white">
        {time.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </div>
    </header>
  );
};

export default Header;
