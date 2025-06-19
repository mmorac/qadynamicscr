import {EventRequest} from '../../calendar_access/iEventRequest';
import React, { useState, useEffect } from 'react';
import { createCalendarEvent, getAvailableHours } from '../../calendar_access/graphService';

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
    <div style={{ border: '1px solid #ccc', padding: 16, borderRadius: 8, marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <button onClick={handlePrevMonth}>&lt;</button>
        <h3 style={{ margin: 0 }}>{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
        <button onClick={handleNextMonth}>&gt;</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, textAlign: 'center' }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} style={{ fontWeight: 'bold', padding: 2 }}>{d}</div>
        ))}
        {days.map((day, idx) =>
          day ? (
            <button
              key={idx}
              style={{ padding: 8, background: '#f9f9f9', border: '1px solid #eee', borderRadius: 4, cursor: 'pointer' }}
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
  const [bookingStatus, setBookingStatus] = useState<string | null>(null);
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
        const userId = 'alonso.angulo@qadynamicscr.com'; // Reemplaza con el correo del calendario
        const hours = await getAvailableHours(userId, selectedDate, 'America/Guatemala'); // Ajusta la zona horaria
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

  const handleBookHour = async (hour: string) => {
    if (!selectedDate) return;

    // Formatear la fecha y hora para Microsoft Graph
    const [hourPart] = hour.split(':');
    const startDateTime = new Date(selectedDate);
    startDateTime.setHours(parseInt(hourPart), 0, 0, 0);
    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(startDateTime.getHours() + 1); // Cita de 1 hora

    const event: EventRequest = {
      subject: 'Cita programada',
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'America/Guatemala', // Ajusta según tu zona horaria
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'America/Guatemala',
      },
      body: {
        content: `Cita reservada para el ${selectedDate.toLocaleDateString()} a las ${hour}`,
        contentType: 'text',
      },
    };

    try {
      const userId = 'alonso.angulo@qadynamicscr.com'; // Reemplaza con el correo del calendario
      const response = await createCalendarEvent(userId, event);
      setBookingStatus(`Cita creada: ${response.subject} a las ${hour} (ID: ${response.id})`);
      setError(null);
      // Actualizar horas disponibles después de crear la cita
      const updatedHours = await getAvailableHours(userId, selectedDate, 'America/Guatemala');
      setAvailableHours(updatedHours);
    } catch (err) {
      setError('No se pudo crear la cita');
      setBookingStatus(null);
      console.error('Error:', err);
    }
  };

  return (
    <div className="informative" style={{ width: '900px', borderStyle: 'solid' }}>
      <div className="calendar-container" style={{ width: '900px' }}>
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
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: 8,
            width: '100%',
          }}
        >
          {availableHours.map(hour => (
            <button
              key={hour}
              style={{
                padding: '8px 12px',
                borderRadius: 4,
                border: '1px solid rgb(48, 148, 132)',
                background: '#e7f8f5',
                color: 'rgb(48, 148, 132)',
                cursor: 'pointer',
                width: '100%',
              }}
              onClick={() => handleBookHour(hour)}
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
