import { Client } from '@microsoft/microsoft-graph-client';
import { Event } from '@microsoft/microsoft-graph-types';
import axios from 'axios';

// Interfaces para crear eventos
interface EventRequest {
  subject?: string;
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
  body?: { content: string; contentType: string };
}

interface EventResponse {
  id?: string;
  subject?: string;
  start: { dateTime?: string; timeZone: string };
  end: { dateTime?: string; timeZone: string };
}

export async function createCalendarEvent(
  userId: string,
  event: EventRequest,
): Promise<EventResponse> {
  try {
    const client = Client.init({
      authProvider: (done) => {
        done(null, sessionStorage.getItem('accessToken'));
      },
    });

    const graphEvent: Event = {
      subject: event.subject,
      start: {
        dateTime: event.start.dateTime,
        timeZone: event.start.timeZone,
      },
      end: {
        dateTime: event.end.dateTime,
        timeZone: event.end.timeZone,
      },
      body: event.body
        ? {
            content: event.body.content,
            contentType: event.body.contentType as 'text' | 'html',
          }
        : undefined,
    };

    const response: Event = await client
      .api(`/users/${userId}/calendar/events`)
      .post(graphEvent);

    return {
      id: response.id,
      subject: response.subject ?? '',
      start: {
        dateTime: response.start?.dateTime ?? '',
        timeZone: response.start?.timeZone ?? '',
      },
      end: {
        dateTime: response.end?.dateTime ?? '',
        timeZone: response.end?.timeZone ?? '',
      },
    };
  } catch (error) {
    console.error('Error al crear evento:', error);
    throw error;
  }
}

export async function getAvailableHours(
  date: Date,
): Promise<string[]> {
  try {
    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      throw new Error('The access token is not available.');
    }


    // Formatear el inicio y fin del día
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const url = `https://qadynamicscrapi-g3degpcrf8ffbbas.canadacentral-01.azurewebsites.net/api/v1/calendar/availability`;
    const requestBody = {
      Token: sessionStorage.getItem('accessToken'),
      StartTime: startOfDay.toISOString(),
      EndTime: endOfDay.toISOString(),
    };
    const appointments = await axios.post(url, requestBody);

    let appointmentsList = appointments.data;

    let busyHours: string[] = [];
    if (appointmentsList && appointmentsList.length > 0) {
      appointmentsList.forEach((appointment: any) => {
        const start = new Date(appointment.horaInicio);
        const end = new Date(appointment.horaFinal);
        const startHour = start.getHours();
        const endHour = end.getHours();

        // Agregar horas ocupadas al arreglo
        for (let hour = startHour; hour < endHour; hour++) {
          busyHours.push(`${hour}:00`);
          if(end.getMinutes() > 0 && hour === endHour - 1) {
            busyHours.push(`${hour + 1}:00`); // Si la cita termina en minutos, agregar la siguiente hora
          }
        }
      });
    }
    
    // Generar todas las horas posibles de 9:00 a 17:00
    const allHours = Array.from({ length: 9 }, (_, i) => `${8 + i}:00`);

    // Filtrar horas libres (0 = libre, 1 = ocupado, 2 = tentativo, 3 = fuera de horario)
    const availableHours = allHours.filter(hour => !busyHours.includes(hour));

    return availableHours;
  } catch (error) {
    console.error('Error al obtener horas disponibles:', error);
    throw error;
  }
}

export async function bookTime(email:string) {
  try{
    const selectedDate = sessionStorage.getItem('selectedDate');
    const selectedHour = sessionStorage.getItem('selectedHour');
    const selectedEndTime = sessionStorage.getItem('selectedEndTime');

    // selectedHour and selectedEndTime are originally in the format "HH:MM"
    // Consequently, we need to convert them to a Date object and then to a string to store in sessionStorage.

    const startTime = selectedHour ? `${selectedDate?.split('T')[0]}T${selectedHour.split(':')[0]}:${selectedHour.split(':')[1]}:00.000` : '';
    const endTime = selectedEndTime ? `${selectedDate?.split('T')[0]}T${selectedEndTime.split(':')[0]}:${selectedEndTime.split(':')[1]}:00.000` : '';

    sessionStorage.setItem('selectedHour', startTime);
    sessionStorage.setItem('selectedEndTime', endTime);

    // Send the booking request to our API

    const url = `https://qadynamicscrapi-g3degpcrf8ffbbas.canadacentral-01.azurewebsites.net/api/v1/calendar/book`;
    //const url = `https://localhost:7205/api/v1/calendar/book`;
    const requestBody = {
      Token: sessionStorage.getItem('accessToken'),
      StartTime: sessionStorage.getItem('selectedHour') || '',
      EndTime: sessionStorage.getItem('selectedEndTime') || '',
      Email: email,
    };
    // Show loader
    const loader = document.createElement('div');
    loader.id = 'booking-loader';
    loader.style.position = 'fixed';
    loader.style.top = '0';
    loader.style.left = '0';
    loader.style.width = '100vw';
    loader.style.height = '100vh';
    loader.style.background = 'rgba(0,0,0,0.3)';
    loader.style.display = 'flex';
    loader.style.alignItems = 'center';
    loader.style.justifyContent = 'center';
    loader.style.zIndex = '9999';
    loader.innerHTML = `<div style="background: white; padding: 2rem 3rem; border-radius: 8px; font-size: 1.2rem;">Sending the booking request</div>`;
    document.body.appendChild(loader);

    let response;
    try {
      response = await axios.post(url, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
      });
    } finally {
      // Remove loader
      const loaderElem = document.getElementById('booking-loader');
      if (loaderElem) loaderElem.remove();
    }
    if (response.status === 200) {
      alert(`Booking confirmed for ${email}`);
    } else {
      throw new Error('Error reservando la hora');
    }
  }
  catch (error) {
    console.error('Error al reservar hora:', error);
    throw error;
  }
}