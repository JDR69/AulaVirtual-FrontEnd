import axios from "axios";

const instance = axios.create({
    baseURL: 'https://venerable-palmier-c7fb94.netlify.app',
    timeout:100000
})

instance.interceptors.request.use((config) =>{
    const token = localStorage.get('token');
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error)=>{
    return Promise.reject(error);
}
)

export default instance


