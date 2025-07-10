import React, { useState, useEffect } from 'react';
import { getAvailableHours } from '../../calendar_access/graphService';
import { useNavigate } from 'react-router-dom';
import './calendar.css';

interface CalendarProps {
  onDateSelect: (date: Date) => void;
  sessionType?: 'hour' | 'half-hour';
}

const Calendar: React.FC<CalendarProps> = ({ onDateSelect, sessionType = 'hour' }) => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedDate) {
      getAvailableHours(selectedDate, sessionType).then(setAvailableSlots);
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDate, sessionType]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const startDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const daysInMonth = getDaysInMonth(currentMonth);
  const days: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const handlePrevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(date);
    onDateSelect(date);
  };

  const handleSlotClick = (slot: string) => {
    if (selectedDate) {
      sessionStorage.setItem('selectedDate', selectedDate.toISOString());
      sessionStorage.setItem('selectedHour', slot);
      sessionStorage.setItem('sessionType', sessionType); // Store sessionType for use in booking form
      navigate('/book');
    }
  };

  return (
    <div className='calendar'>
      <div className="calendar-header">
        <button onClick={handlePrevMonth}>&lt;</button>
        <h3 className="calendar-title">{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
        <button onClick={handleNextMonth}>&gt;</button>
      </div>
      <div className="calendar-grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
          <div key={d} className="calendar-day-header">{d}</div>
        ))}
        {days.map((day, idx) =>
          day ? (
            <button
              key={idx}
              className="calendar-day-btn"
              onClick={() => handleDateClick(day)}
            >
              {day}
            </button>
          ) : (
            <div key={idx} />
          )
        )}
      </div>
      {/* Available slots below the calendar */}
      {selectedDate && (
        <div className="available-hours-grid">
          {availableSlots.length > 0 ? (
            availableSlots.map(slot => (
              <button key={slot} className="available-hour-btn" onClick={() => handleSlotClick(slot)}>{slot}</button>
            ))
          ) : (
            <div>No available slots</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Calendar;
