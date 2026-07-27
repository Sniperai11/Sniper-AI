const axios = require('axios');
const client = axios.create({ baseURL: '/api' });
console.log(client.getUri({ url: '/auth/login' }));
console.log(client.getUri({ url: 'auth/login' }));
