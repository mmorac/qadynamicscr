import React from 'react';
import Calendar from '../home/calendar';

const BookSession: React.FC = () => {
  return <Calendar onDateSelect={() => {}} sessionType="hour" />;
};

export default BookSession;
