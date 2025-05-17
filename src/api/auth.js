import instance from "./axios";

//Login usuario
export const login_request = data => instance.post(`/api/usuario/login/`,data,{
    headers:{
        "Content-Type": "application/json"
    },
    withCredentials:true
})