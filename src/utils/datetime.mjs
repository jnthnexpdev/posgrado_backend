import axios from 'axios';
import moment from 'moment';

const apiUrls = [
  'https://timeapi.io/api/Time/current/zone?timeZone=America/Mexico_City',
  'http://worldtimeapi.org/api/timezone/America/Mexico_City',
  'https://api.timezonedb.com/v2.1/get-time-zone?key=TU_API_KEY&format=json&by=zone&zone=America/Mexico_City'
];

export const getDateTime = async () => {

  try {
    const response = await Promise.race(
      apiUrls.map(url => axios.get(url, { timeout: 1000 })) // Timeout de 1s
    );

    return formatDateTime(extractDateTime(response.data));
  } catch (error) {
    return formatDateTime(new Date());
  }
};

// Extrae la fecha/hora dependiendo de la API
const extractDateTime = (data) => {
  return data.datetime || data.dateTime || data.utc_datetime || data.formatted || new Date().toISOString();
};

// Formatea la fecha y hora
const formatDateTime = (datetime) => {
  return {
    fecha: moment(datetime).format('DD-MM-YYYY'),
    hora: moment(datetime).format('h:mm A')
  };
};
