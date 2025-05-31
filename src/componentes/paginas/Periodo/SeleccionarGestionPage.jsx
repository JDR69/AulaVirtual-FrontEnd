import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { useNavigate } from 'react-router-dom';

const SeleccionarGestionPage = () => {
    const navigate = useNavigate()
    const { gestion, setGestion } = useAuth();
    const [gestion2,setGestion2] = useState([])

    useEffect(() => {
        if (gestion) {
            setGestion2(gestion || [])
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
                        gestion2.map((g) => (
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
