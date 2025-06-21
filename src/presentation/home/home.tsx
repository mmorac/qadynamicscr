import React, { useState, useEffect } from 'react';
import { getAvailableHours } from '../../calendar_access/graphService';
import './home.css';

// Componente Calendar
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
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
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

  // Cargar horas disponibles cuando cambia la fecha
  useEffect(() => {
    if (!selectedDate) {
      setAvailableHours([]);
      return;
    }

    const fetchAvailableHours = async () => {
      setLoadingHours(true);
      setError(null);
      try {
        const hours = await getAvailableHours(selectedDate); // Ajusta la zona horaria
        setAvailableHours(hours);
      } catch (err) {
        setError('No se pudieron cargar las horas disponibles');
        setAvailableHours([]);
      } finally {
        setLoadingHours(false);
      }
    };

    fetchAvailableHours();
  }, [selectedDate]);

  // Manejar la reserva de una hora
  const handleBookHour = async (date: Date, hour: string) => {
    sessionStorage.setItem('selectedDate', date.toISOString());
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
            ? `Horas disponibles para ${selectedDate.toLocaleDateString()}`
            : 'Selecciona una fecha para ver las horas disponibles'}
        </h4>
        {loadingHours && <p>Cargando horas...</p>}
        {!loadingHours && availableHours.length === 0 && selectedDate && !error && (
          <p>No hay horas disponibles para esta fecha.</p>
        )}
        <div className="available-hours-grid">
          {availableHours.map(hour => (
            <button
              key={hour}
              className="available-hour-btn"
              onClick={() => selectedDate && handleBookHour(selectedDate, hour)}
            >
              Reservar {hour}
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
