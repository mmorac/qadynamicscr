import React from 'react';
import Calendar from '../home/calendar';

const BookIntro: React.FC = () => {
  return <Calendar onDateSelect={() => {}} sessionType="half-hour" />;
};

export default BookIntro;
