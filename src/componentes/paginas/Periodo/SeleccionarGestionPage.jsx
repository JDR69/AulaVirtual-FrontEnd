import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { useNavigate } from 'react-router-dom';
import '../../css/SeleccionarGestion.css'; // Importar el CSS

const SeleccionarGestionPage = () => {
    const navigate = useNavigate()
    const { gestion, setGestion } = useAuth();
    const [gestion2, setGestion2] = useState([])

    useEffect(() => {
        if (gestion) {
            console.log(gestion)
            if (Array.isArray(gestion)) {
                setGestion2(gestion);
            }
        }
    }, [gestion]);

    const handleCambio = (e) => {
        const idSeleccionado = parseInt(e.target.value);
        const gestionSeleccionada = gestion.find(g => g.gestion === idSeleccionado);
        if (gestionSeleccionada) {
            localStorage.setItem('gestion', JSON.stringify(gestionSeleccionada));
        }
    }

    const hanldeSeguir = () => {
        navigate('/dasboard/seleccionar-curso')
    }

    return (
        <div className='sg1'>
            <div className='sg0'>
                <h1 className='sg2'>Seleccionar Gestión</h1>
                <div className='sg3'>
                    <div className='sg4'>
                        <select
                            name="gestion"
                            id="gestion-select"
                            onChange={handleCambio}
                            className="sg5"
                        >
                            <option value="">Seleccionar la gestión</option>
                            {
                                gestion2.map((g) => (
                                    <option key={g.gestion} value={g.gestion}>{g.anio_escolar}</option>
                                ))
                            }
                        </select>
                    </div>
                    <button onClick={hanldeSeguir} className="sg6">Aceptar</button>

                </div>
            </div>
        </div>
    )
}

export default SeleccionarGestionPage