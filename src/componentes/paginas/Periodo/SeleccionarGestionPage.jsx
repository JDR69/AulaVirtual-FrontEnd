import React, { useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { useNavigate } from 'react-router-dom';

const SeleccionarGestionPage = () => {
    const navigate = useNavigate()
    const { gestion, setGestion } = useAuth();

    useEffect(() => {
        if (gestion) {
            console.log(gestion);
        }
    }, [gestion]);

    const handleCambio = (e) => {
        const idSeleccionado = parseInt(e.target.value);
        const gestionSeleccionada = gestion.find(g => g.gestion === idSeleccionado);
        if (gestionSeleccionada) {
            localStorage.setItem('gestion', JSON.stringify(gestionSeleccionada));
        }
    }

    const hanldeSeguir = () =>{
        navigate('/dasboard/seleccionar-curso')
    }

    return (
        <div className='contenedor-principal'>
            <div className='contenedor-secundario'>
                <select 
                    name="gestion" 
                    id="gestion-select"
                    onChange={handleCambio}
                >
                    <option value="">Seleccionar la gestión</option>
                    {
                        gestion?.map((g) => (
                            <option key={g.gestion} value={g.gestion}>{g.anio_escolar}</option>
                        ))
                    }
                </select>
                <button onClick={hanldeSeguir}>Aceptar</button>
            </div>
        </div>
    )
}

export default SeleccionarGestionPage
