import React from 'react';
import Calendar from '../home/calendar';

const BookHourly: React.FC = () => {
  return <Calendar onDateSelect={() => {}} sessionType="hour" />;
};

export default BookHourly;
