'use client';

import { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: Date;
  onComplete?: () => void;
}

export default function Countdown({ targetDate, onComplete }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference <= 0) {
        onComplete?.();
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  const pad = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="flex items-center gap-2">
      {timeLeft.days > 0 && (
        <div className="text-center">
          <span className="text-2xl font-bold">{timeLeft.days}</span>
          <span className="text-xs text-gray-500 block">dias</span>
        </div>
      )}
      <div className="text-center">
        <span className="text-2xl font-bold">{pad(timeLeft.hours)}</span>
        <span className="text-xs text-gray-500 block">horas</span>
      </div>
      <span className="text-2xl font-bold">:</span>
      <div className="text-center">
        <span className="text-2xl font-bold">{pad(timeLeft.minutes)}</span>
        <span className="text-xs text-gray-500 block">min</span>
      </div>
      <span className="text-2xl font-bold">:</span>
      <div className="text-center">
        <span className="text-2xl font-bold">{pad(timeLeft.seconds)}</span>
        <span className="text-xs text-gray-500 block">seg</span>
      </div>
    </div>
  );
}
