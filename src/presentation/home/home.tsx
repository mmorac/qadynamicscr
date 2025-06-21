import React, { useState, useEffect } from 'react';
import { getAvailableHours } from '../../calendar_access/graphService';
import './home.css';

// Calendar Component
const Calendar: React.FC<{ onDateSelect: (date: Date) => void }> = ({ onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

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
              onClick={() => onDateSelect(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
            >
              {day}
            </button>
          ) : (
            <div key={idx} />
          )
        )}
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableHours, setAvailableHours] = useState<string[]>([]);
  const [bookingStatus ] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingHours, setLoadingHours] = useState<boolean>(false);

  // Load available hours when the date changes
  useEffect(() => {
    if (!selectedDate) {
      setAvailableHours([]);
      return;
    }

    const fetchAvailableHours = async () => {
      setLoadingHours(true);
      setError(null);
      try {
        const hours = await getAvailableHours(selectedDate); // Adjust timezone
        setAvailableHours(hours);
      } catch (err) {
        setError('Could not load available hours');
        setAvailableHours([]);
      } finally {
        setLoadingHours(false);
      }
    };
    
    fetchAvailableHours();
  }, [selectedDate]);

  const adjustDate = (isoString: string) => {
    const date = new Date(isoString);
    const offsetMs = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offsetMs);
    return localDate.toISOString();
  }

  // Handle booking an hour
  const handleBookHour = async (date: Date, hour: string) => {
    let selectedDate = adjustDate(date.toISOString());
    sessionStorage.setItem('selectedDate', selectedDate);
    if(hour.length < 5) {
      hour = `0${hour}`
    }
    sessionStorage.setItem('selectedHour', hour);
    window.history.pushState({}, '', '/book');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  return (
    <div className="informative" style={{ width: '100%'}}>
      <div className="calendar-container">
        <Calendar onDateSelect={setSelectedDate} />
      </div>
      <div className="available-hours">
        <h4>
          {selectedDate
            ? `Available hours for ${selectedDate.toLocaleDateString()}`
            : 'Select a date to see available hours'}
        </h4>
        {loadingHours && <p>Loading hours...</p>}
        {!loadingHours && availableHours.length === 0 && selectedDate && !error && (
          <p>No available hours for this date.</p>
        )}
        <div className="available-hours-grid">
          {availableHours.map(hour => (
            <button
              key={hour}
              className="available-hour-btn"
              onClick={() => selectedDate && handleBookHour(selectedDate, hour)}
            >
              Book {hour}
            </button>
          ))}
        </div>
        {bookingStatus && <p style={{ color: 'green', marginTop: 8 }}>{bookingStatus}</p>}
        {error && <p style={{ color: 'red', marginTop: 8 }}>{error}</p>}
      </div>
    </div>
  );
};

export default Home;
