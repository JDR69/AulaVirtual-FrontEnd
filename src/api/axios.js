import axios from "axios";

const instance = axios.create({
    baseURL: 'https://backendcolegio-production.up.railway.app',
    timeout:100000
})

instance.interceptors.request.use((config) =>{
    const token = localStorage.getItem('token');
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error)=>{
    return Promise.reject(error);
}
)

export default instance



