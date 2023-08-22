import axios from 'axios';
const URL = 'https://pixabay.com/api/';
const KEY ='38887202-a6778fad9111f44c566d860bc';

export async function fetchPhoto(q, page, perPage) {
    const url = `${URL}?key=${KEY}&q=${q}&page=${page}&per_page=${perPage}&image_type=photo&orientation=horizontal&safesearch=true`;
    const response = await axios.get(url);
    return response.data;  
          
};