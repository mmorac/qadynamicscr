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
  sessionType: 'hour' | 'half-hour' = 'hour',
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

    let busySlots: string[] = [];
    if (appointmentsList && appointmentsList.length > 0) {
      appointmentsList.forEach((appointment: any) => {
        const start = new Date(appointment.horaInicio);
        const end = new Date(appointment.horaFinal);
        let slotStart = start.getHours() + start.getMinutes() / 60;
        let slotEnd = end.getHours() + end.getMinutes() / 60;
        let increment = sessionType === 'half-hour' ? 0.5 : 1;
        for (let t = slotStart; t < slotEnd; t += increment) {
          let hour = Math.floor(t);
          let min = (t % 1) === 0.5 ? '30' : '00';
          busySlots.push(`${hour}:${min}`);
        }
      });
    }

    // Generar todos los slots posibles de 8:00 a 16:30 (excluyendo 17:00)
    let allSlots: string[] = [];
    if (sessionType === 'half-hour') {
      for (let h = 8; h < 17; h++) {
        allSlots.push(`${h}:00`);
        if (h < 16) allSlots.push(`${h}:30`);
      }
    } else {
      allSlots = Array.from({ length: 9 }, (_, i) => `${8 + i}:00`).filter(slot => slot !== '17:00');
    }

    // Filtrar slots libres
    const availableSlots = allSlots.filter(slot => !busySlots.includes(slot));
    return availableSlots;
  } catch (error) {
    console.error('Error al obtener horas disponibles:', error);
    throw error;
  }
}

export async function bookTime(email:string, lastName: string, firstName: string, 
  idNumber: string, telephoneNumber: string, company: string, position: string): Promise<void> {
  try{
    const selectedDate = sessionStorage.getItem('selectedDate');
    const selectedHour = sessionStorage.getItem('selectedHour');
    const selectedEndTime = sessionStorage.getItem('selectedEndTime');

    // // selectedHour and selectedEndTime are originally in the format "HH:MM"
    // // Consequently, we need to convert them to a Date object and then to a string to store in sessionStorage.

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
      Apellidos: lastName,
      Nombre: firstName,
      Cedula: idNumber,
      Telefono: telephoneNumber,
      Empresa: company,
      Puesto: position,
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