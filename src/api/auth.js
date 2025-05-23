import instance from "./axios";

const tiempoEspera = 10000;

//Login usuario
export const login_request = data => instance.post(`/api/usuario/login/`, data, {
    headers: {
        "Content-Type": "application/json"
    }
})

//USARIOS
export const crearNuevoUsuarioRequest = (data) => instance.post(`/api/usuario/crearUsuario/`,
    data,
    {
        headers: {
            "Content-Type": "application/json"
        }
    }
)
export const actualizarUsuarioRequest = (data,id) => instance.put(`/api/usuario/actualizarUsuario/${id}/`,
  data,
  {
        headers: {
            "Content-Type": "application/json"
        }
    }
)
export const obtenerUsuarioRequest = () => {
    return instance.get(`/api/usuario/obtenerUsuario/`,
        { timeout: tiempoEspera }
    )
}

//ROL
export const crearNuevoRolRequest = (data) => instance.post(`/api/usuario/crearcrearRol/`,
    data,{
        headers: {
            "Content-Type": "application/json"
          },
        withCredentials:true
    }
)

export const obtenerRolesRequest = () => { return instance.get(`/api/usuario/obtenerRoles/`,{timeout:tiempoEspera})}

export const actualizarRolRequest = (data,id) => instance.put(`/api/usuario/actualizarRol/${id}/`,
    data,{
        headers: {
            "Content-Type": "application/json"
          },
        withCredentials:true
    }
)

export const eliminarRolRequest = (id) => instance.delete(`/api/usuario/eliminarRol/${id}/`,{
        headers: {
            "Content-Type": "application/json"
          },
        withCredentials:true
    })

//RUTAS PRIVILEGIOS
export const nuevoPrivilegioRequest = (data) => instance.post(`/api/usuario/crearPrivilegio/`,
    data,
    {
        headers: {
            "Content-Type": "application/json"
          },
        withCredentials:true
    }
)

export const obtenerPrivilegiosRequest = () =>{ return instance.get(`/api/usuario/obtenerPrivilegio/`,{timeout:tiempoEspera})}

export const actualizarPrivilegioRequest = (data,id) => instance.put(`/api/usuario/actualizarPrivilegio/${id}/`,
    data,{
        headers: {
            "Content-Type": "application/json"
          },
        withCredentials:true
    }
)

export const eliminarPrivilegioRequest = (id) => instance.delete(`/api/usuario/eliminarPrivilegio/${id}/`,{
        headers: {
            "Content-Type": "application/json"
          },
        withCredentials:true
    })

//RUTAS DE PERMISOS
export const obtenerPermisosRequest = () => { return instance.get(`/api/usuario/obtenerRolesAgrupados/`,{timeout:tiempoEspera})}

export const actualizarPermisosRequest = (data) => instance.put(`/api/usuario/actualizarEstadoPermiso/`,
    data,{
        headers: {
            "Content-Type": "application/json"
          },
        withCredentials:true
    })

//RUTAS DE CURSOS
export const nuevoCursoRequest = (data) =>  instance.post(`/api/academia/crear-curso/`,data,{
        headers: {
            "Content-Type": "application/json"
          },
        withCredentials:true
    })
export const actualizarCursoRequest = (data,id) => instance.put(`/api/academia/actualizar-curso/${id}/`,
    data,{
        headers: {
            "Content-Type": "application/json"
          },
        withCredentials:true
    })
export const eliminarCursoRequest = (id) => instance.delete(`/api/academia/eliminar-curso/${id}/`,{
        headers: {
            "Content-Type": "application/json"
          },
        withCredentials:true
    })
export const obtenerCursosRequest = () => { return instance.get(`/api/academia/obtener-cursos/`,{timeout:tiempoEspera})}

//RUTAS DE NIVELES
export const nuevoNivelRequest = (data) =>  instance.post(`/api/academia/crear-nivel/`,data,{
        headers: {
            "Content-Type": "application/json"
          },
        withCredentials:true
    })
export const actualizarNivelRequest = (data,id) => instance.put(`/api/academia/actualizar-nivel/${id}/`,
    data,{
        headers: {
            "Content-Type": "application/json"
          },
        withCredentials:true
    })
export const eliminarNivelRequest = (id) => instance.delete(`/api/academia/eliminar-nivel/${id}/`,{
        headers: {
            "Content-Type": "application/json"
          },
        withCredentials:true
    })
export const obtenerNivelesRequest = () => { return instance.get(`/api/academia/obtener-niveles/`,{timeout:tiempoEspera})}

//RUTAS DE PARALELOS
export const nuevoParaleloRequest = (data) =>  instance.post(`/api/academia/crear-paralelo/`,data,{
        headers: {
            "Content-Type": "application/json"
          },
        withCredentials:true
    })
export const actualizarParaleloRequest = (data,id) => instance.put(`/api/academia/actualizar-paralelo/${id}/`,
    data,{
        headers: {
            "Content-Type": "application/json"
          },
        withCredentials:true
    })
export const eliminarParaleloRequest = (id) => instance.delete(`/api/academia/eliminar-paralelo/${id}/`,{
        headers: {
            "Content-Type": "application/json"
          },
        withCredentials:true
    })
export const obtenerParalelosRequest = () => { return instance.get(`/api/academia/obtener-paralelos/`,{timeout:tiempoEspera})}

//RUTAS DE MATERIAS
export const nuevoMateriaRequest = (data) =>  instance.post(`/api/academia/crear-materia/`,data,{
        headers: {
            "Content-Type": "application/json"
          },
        withCredentials:true
    })
export const actualizarMateriaRequest = (data,id) => instance.put(`/api/academia/actualizar-materia/${id}/`,
    data,{
        headers: {
            "Content-Type": "application/json"
          },
        withCredentials:true
    })
export const eliminarMateriaRequest = (id) => instance.delete(`/api/academia/eliminar-materia/${id}/`,{
        headers: {
            "Content-Type": "application/json"
          },
        withCredentials:true
    })
export const obtenerMateriasRequest = () => { return instance.get(`/api/academia/obtener-materias/`,{timeout:tiempoEspera})}

//RUTAS DE HORARIOS
export const nuevoHorarioRequest = (data) =>  instance.post(`/api/academia/crear-horario/`,data,{
        headers: {
            "Content-Type": "application/json"
          },
        withCredentials:true
    })
export const actualizarHorarioRequest = (data,id) => instance.put(`/api/academia/actualizar-horario/${id}/`,
    data,{
        headers: {
            "Content-Type": "application/json"
          },
        withCredentials:true
    })
export const eliminarHorarioRequest = (id) => instance.delete(`/api/academia/eliminar-horario/${id}/`,{
        headers: {
            "Content-Type": "application/json"
          },
        withCredentials:true
    })
export const obtenerHorariosRequest = () => { return instance.get(`/api/academia/obtener-horarios/`,{timeout:tiempoEspera})}


//OBTENER DETALLE COMPLETO POR CURSO
export const obtenerDetalleCompletoPorCurso = () => { return instance.get(`/api/academia/obtener/`,{timeout:tiempoEspera})}

//RUTAS DE DETALLE CURSO MATERIA
export const nuevoDetalleCursoMateriaRequest = (data) => instance.post(`/api/academia/crear-detalle-curso-materia/`,
    data,{
        headers: {
            "Content-Type": "application/json"
          },
        withCredentials:true
    }
)
export const eliminarDetalleCursoMateriaRequest = (dato) =>
  instance.delete('/api/academia/eliminar-detalle-curso-materia/', {
    data: dato, 
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });



//RUTAS DE DETALLE CURSO PARALELO
export const nuevoDetalleCursoParaleloRequest = (data) => instance.post(`/api/academia/crear-detalle-curso-paralelo/`,
    data,{
        headers: {
            "Content-Type": "application/json"
          },
        withCredentials:true
    }
)
export const eliminarDetalleCursoParaleloRequest = (dato) =>
  instance.delete('/api/academia/eliminar-paralelo/', {
    data: dato, 
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });
