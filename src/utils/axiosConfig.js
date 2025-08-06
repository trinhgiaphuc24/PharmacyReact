import axios from "axios";

const BASE_URL = 'http://127.0.0.1:8000/';

export const endpoints = {
    'login': '/login',
    'register': '/register',
    'medicines': '/medicines',
    'medicine-genres': '/medicine-genres',
    'produces': '/produces',
    'chatbot': '/chatbot/',
}

export default axios.create({
    baseURL: BASE_URL
})