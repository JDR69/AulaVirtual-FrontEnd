import { createContext, useState, useContext, useEffect } from "react";
import { 
    login_request,
    obtenerUsuarioRequest,
    obtenerRolesRequest,
    obtenerPrivilegiosRequest,
    obtenerPermisosRequest,
    obtenerCursosRequest,
    obtenerMateriasRequest,
    obtenerHorariosRequest,
    obtenerNivelesRequest,
    obtenerParalelosRequest,
    obtenerDetalleCompletoPorCurso,
 } from "../api/auth";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {

    //Variables Usuarios
    const [usuarios,setUsuarios] = useState(null);
    const [permisosDelUsuario, setPermisosDelUsuario] = useState(null)
    const [roles,setRoles]=useState([]);
    const [privilegios,setPrivilegios] =useState([]);
    const [permisos, setPermisos] = useState([]);

    //Variables Academia
    const [cursos,setCursos] = useState([]);
    const [materias,setMaterias] = useState([]);
    const [horarios,setHorarios] = useState([]);
    const [niveles,setNiveles] = useState([]);
    const [paralelos,setParalelos] = useState([]);

    //DETALLE CURSO
    const [detalleCompleto,setDetalleCompleto] = useState([])


    const signin = async (user) => {
        try {
            const res = await login_request(user);
            console.log(res.data);
            setUsuarios(res.data.usuario)
            setPermisosDelUsuario(res.data.permisos)

        } catch (err) {
            throw err; 
          }
    }

    const cargarDatos = async () =>{
        try {

            const [
                resUsuarios,
                resRoles,
                resPrivilegios,
                resPermisos,
                resCursos,
                resMaterias,
                resParalelos,
                resHorarios,
                resNiveles,
                resDetalleCurso
            ] = await Promise.all([
                obtenerUsuarioRequest(),
                obtenerRolesRequest(),
                obtenerPrivilegiosRequest(),
                obtenerPermisosRequest(),
                obtenerCursosRequest(),
                obtenerMateriasRequest(),
                obtenerParalelosRequest(),
                obtenerHorariosRequest(),
                obtenerNivelesRequest(),
                obtenerDetalleCompletoPorCurso(),
            ])
            console.log(resUsuarios.data)
            setUsuarios(resUsuarios.data)
            setRoles(resRoles.data)
            setPrivilegios(resPrivilegios.data)
            setPermisos(resPermisos.data)
            setCursos(resCursos.data)
            setMaterias(resMaterias.data)
            setParalelos(resParalelos.data)
            setHorarios(resHorarios.data)
            setNiveles(resNiveles.data)
            console.log(resDetalleCurso.data)
            setDetalleCompleto(resDetalleCurso.data)
        } catch (err) {
            throw err;
        }
    }

  

    useEffect(() => {
    async function checklogin() {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem("user");
        cargarDatos();
        // if (!token) {
        //     setLoading(false);
        //     setUser(null);
        //     return;
        // }
        // try {
        //     setLoading(true);
        //     cargarDatos();
        //     cargarChoferes();
        //     setUser(JSON.parse(savedUser));
        //     setLoading(false);
        // } catch (error) {
        //     console.error(error);
        //     logout();
        //     setLoading(false);
        //     navigate('/login');
        // }

    }

    checklogin();
}, []);

return (
    <AuthContext.Provider value={{
        signin,
        cursos,
        setCursos,
        materias,
        setMaterias,
        horarios,
        setHorarios,
        niveles,
        setNiveles,
        paralelos,
        setParalelos,

        roles,
        setRoles,
        privilegios,
        setPrivilegios,
        permisos,
        setPermisos,
        usuarios,           
        setUsuarios,

        detalleCompleto,
    }}>
        {children}
    </AuthContext.Provider>

);
};



