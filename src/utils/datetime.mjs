import axios from 'axios';
import moment from 'moment';

export const getDateTime = async () => {
    try{
        const response = await axios.get('http://worldtimeapi.org/api/timezone/America/Mexico_City');
        const { date } = response.data;

        const formatDate = moment(date).format('DD-MM-YYYY');
        const formatTime = moment(date).format('h:mmA');

        return { fecha : formatDate, hora : formatTime };
    }catch(error){
        console.error('Ha ocurrido un error al obtener la hora y fecha');
        throw error;
    }
}