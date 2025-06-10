import React, { useState } from 'react';

// Calendar component with month view and navigation
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
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
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

// Placeholder function to get available hours for a date
const getAvailableHours = (date: Date): string[] => {
    // Example: 9am to 5pm, every hour
    return Array.from({ length: 9 }, (_, i) => `${9 + i}:00`);
};

const Home: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const availableHours = selectedDate ? getAvailableHours(selectedDate) : [];

    return (
        <div className='informative'>
            <Calendar onDateSelect={setSelectedDate} />
            <div>
                <h4>
                    {selectedDate
                        ? `Available Hours for ${selectedDate.toLocaleDateString()}`
                        : 'Select a date to see available hours'}
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {availableHours.map((hour) => (
                        <button
                            key={hour}
                            style={{ padding: '8px 12px', borderRadius: 4, border: '1px solid #007bff', background: '#e7f1ff', color: '#007bff', cursor: 'pointer' }}
                            onClick={() => alert(`Booked ${hour} on ${selectedDate?.toLocaleDateString()}`)}
                        >
                            Book {hour}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;