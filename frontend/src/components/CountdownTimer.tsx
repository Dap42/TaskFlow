"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  deadline: string;
}

export default function CountdownTimer({ deadline }: CountdownTimerProps) {
  const calculateTimeLeft = () => {
    const difference = +new Date(deadline) - +new Date();

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return null;
  };

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline]);

  if (!timeLeft) {
    return <span className="text-red-600 font-bold">Overdue!</span>;
  }

  return (
    <div className="flex gap-4 text-center">
      <div className="bg-gray-100 p-2 rounded min-w-[60px]">
        <div className="text-xl font-bold text-blue-600">{timeLeft.days}</div>
        <div className="text-xs text-gray-500">Days</div>
      </div>
      <div className="bg-gray-100 p-2 rounded min-w-[60px]">
        <div className="text-xl font-bold text-blue-600">{timeLeft.hours}</div>
        <div className="text-xs text-gray-500">Hours</div>
      </div>
      <div className="bg-gray-100 p-2 rounded min-w-[60px]">
        <div className="text-xl font-bold text-blue-600">
          {timeLeft.minutes}
        </div>
        <div className="text-xs text-gray-500">Mins</div>
      </div>
      <div className="bg-gray-100 p-2 rounded min-w-[60px]">
        <div className="text-xl font-bold text-blue-600">
          {timeLeft.seconds}
        </div>
        <div className="text-xs text-gray-500">Secs</div>
      </div>
    </div>
  );
}
