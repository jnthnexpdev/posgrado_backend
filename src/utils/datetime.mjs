import axios from 'axios';
import moment from 'moment';

export const getDateTime = async () => {
  try {
    // Intenta obtener los datos de la primera API
    const response = await axios.get('http://worldtimeapi.org/api/timezone/America/Mexico_City');
    return formatDateTime(response.data.datetime);
  } catch (error) {
    console.warn('Primera API falló, intentando con la API de respaldo...');
    
    try {
      // Si falla la primera API, intenta con la segunda
      const backupResponse = await axios.get('https://timeapi.io/api/Time/current/zone?timeZone=America/Mexico_City');
      console.log(formatDateTime(backupResponse.data.dateTime));
      return formatDateTime(backupResponse.data.dateTime);
    } catch (backupError) {
      console.error('Ambas APIs fallaron al obtener la hora y fecha.');
      throw backupError;
    }
  }
};

// Función para formatear la fecha y hora
const formatDateTime = (datetime) => {
  const formatDate = moment(datetime).format('DD-MM-YYYY');
  const formatTime = moment(datetime).format('h:mm A');
  return { fecha: formatDate, hora: formatTime };
};
