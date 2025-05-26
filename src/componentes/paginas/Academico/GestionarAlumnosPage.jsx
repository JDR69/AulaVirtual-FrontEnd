import React, { useState, useEffect } from 'react';
import '../../css/Gestion.css';
import {
    crearNuevaGestionRequest,
    obtenerGestionRequest,
    // registrarAlumnoEnGestionRequest,
    // obtenerAlumnosRequest,
} from '../../../api/auth';

function GestionarAlumnosPage() {
    const [gestionData, setGestionData] = useState({
        anio_escolar: '',
        estado: true,
    });

    const [registroData, setRegistroData] = useState({
        alumno_id: '',
        curso: '',
        gestion_id: '',
    });

    const [alumnos, setAlumnos] = useState([]);
    const [gestiones, setGestiones] = useState([]);

    const [busquedaAlumno, setBusquedaAlumno] = useState('');
    const [sugerencias, setSugerencias] = useState([]);

    const handleGestionChange = (e) => {
        const { name, value } = e.target;
        setGestionData({ ...gestionData, [name]: value });
    };

    const handleRegistroChange = (e) => {
        const { name, value } = e.target;
        setRegistroData({ ...registroData, [name]: value });
    };

    const handleGestionSubmit = async (e) => {
        e.preventDefault();
        try {
            const newGestion = {
                anio_escolar: parseInt(gestionData.anio_escolar),
                estado: gestionData.estado,
            };
            await crearNuevaGestionRequest(newGestion);
            fetchGestiones();
        } catch (error) {
            const mensaje = error.response?.data?.error || 'Error al crear la gestión';
            alert(mensaje);
        }
    };

    const handleRegistroSubmit = async (e) => {
        e.preventDefault();
        const { alumno_id, gestion_id, curso } = registroData;
        if (!alumno_id || !gestion_id || !curso) {
            alert('Debe seleccionar un alumno, una gestión y asignar curso.');
            return;
        }
        try {
            await registrarAlumnoEnGestionRequest(registroData);
            alert('Alumno registrado exitosamente en la gestión.');
            setRegistroData({ alumno_id: '', curso: '', gestion_id: '' });
            setBusquedaAlumno('');
        } catch (error) {
            const mensaje = error.response?.data?.error || 'Error al registrar alumno';
            alert(mensaje);
        }
    };

    const fetchGestiones = async () => {
        try {
            const res = await obtenerGestionRequest();
            setGestiones(res.data);
        } catch (error) {
            console.error('Error al obtener gestiones:', error);
        }
    };

    const fetchAlumnos = async () => {
        try {
            const alumnos = [
                { id: 1, nombre: 'Juan', apellido: 'Pérez' },
                { id: 2, nombre: 'María', apellido: 'Gutiérrez' },
                { id: 3, nombre: 'Carlos', apellido: 'Ramírez' },
                { id: 4, nombre: 'Ana', apellido: 'Fernández' },
                { id: 5, nombre: 'Luis', apellido: 'Martínez' },
                { id: 6, nombre: 'Paola', apellido: 'Gómez' },
                { id: 7, nombre: 'José', apellido: 'Vargas' },
                { id: 8, nombre: 'Laura', apellido: 'Morales' },
                { id: 9, nombre: 'Fernando', apellido: 'Castillo' },
                { id: 10, nombre: 'Lucía', apellido: 'Ortega' },
            ];

            setAlumnos(alumnos);
        } catch (error) {
            console.error('Error al obtener alumnos:', error);
        }
    };

    useEffect(() => {
        fetchGestiones();
        fetchAlumnos();
    }, []);

    // Buscar alumno
    const handleBusquedaChange = (e) => {
        const valor = e.target.value;
        setBusquedaAlumno(valor);

        if (valor.trim().length >= 3) {
            const sugeridos = alumnos.filter((a) =>
                `${a.nombre} ${a.apellido}`.toLowerCase().includes(valor.toLowerCase())
            );
            setSugerencias(sugeridos);
        } else {
            setSugerencias([]);
        }
    };


    const seleccionarAlumno = (alumno) => {
        setRegistroData({
            ...registroData,
            alumno_id: alumno.id,
        });
        setBusquedaAlumno(`${alumno.nombre} ${alumno.apellido}`);
        setSugerencias([]);
    };

    return (
        <div className="contenedor-principal">
            <div className="contenedor-secundario">
                <div className="gestion-container">
                    <div className="gestion-header">
                        <h1>Gestión Académica de Alumnos</h1>
                        <p>Registrar alumnos en un año académico</p>
                    </div>

                    <div className="gestion-table card">
                        <div className="registro-form card">
                            <div className="card-header">
                                <h2>Registrar Alumno en Gestión</h2>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleRegistroSubmit}>
                                    <div className="input-group">
                                        <label >Buscar Alumno:</label>
                                        <div className="acomodar">
                                            <input
                                                type="text"
                                                id="busqueda"
                                                value={busquedaAlumno}
                                                onChange={handleBusquedaChange}
                                                placeholder="Ej: Juan Pérez"
                                                autoComplete="off"
                                                required
                                            />

                                            {busquedaAlumno.trim().length >= 3 && sugerencias.length > 0 && (
                                                <ul className="sugerencias">
                                                    {sugerencias.map((alumno) => (
                                                        <li
                                                            key={alumno.id}
                                                            onClick={() => seleccionarAlumno(alumno)}
                                                            className="sugerencia-item"
                                                        >
                                                            {alumno.nombre} {alumno.apellido}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="curso">Curso:</label>
                                        <select
                                            id="gestion"
                                            name="gestion_id"
                                            value={registroData.gestion_id}
                                            onChange={handleRegistroChange}
                                            required
                                        >
                                            <option value="">Seleccione el curso</option>
                                            {gestiones.map((gestion) => (
                                                <option key={gestion.id} value={gestion.id}>
                                                    {gestion.anio_escolar}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="curso">Paralelo:</label>
                                        <select
                                            id="gestion"
                                            name="gestion_id"
                                            value={registroData.gestion_id}
                                            onChange={handleRegistroChange}
                                            required
                                        >
                                            <option value="">Seleccione el paralelo</option>
                                            {gestiones.map((gestion) => (
                                                <option key={gestion.id} value={gestion.id}>
                                                    {gestion.anio_escolar}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="gestion">Gestión Académica:</label>
                                        <select
                                            id="gestion"
                                            name="gestion_id"
                                            value={registroData.gestion_id}
                                            onChange={handleRegistroChange}
                                            required
                                        >
                                            <option value="">Seleccione una gestión</option>
                                            {gestiones.map((gestion) => (
                                                <option key={gestion.id} value={gestion.id}>
                                                    {gestion.anio_escolar}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-actions">
                                        <button type="submit" className="btn btn-success">
                                            Registrar Alumno
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="gestion-table card">
                        <div className="card-header">
                            <h2>Gestiones Registradas</h2>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Año Escolar</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {gestiones.map((gestion) => (
                                            <tr key={gestion.id}>
                                                <td>{gestion.id}</td>
                                                <td>{gestion.anio_escolar}</td>
                                                <td>
                                                    <span className={`status-badge ${gestion.estado ? 'habilitado' : 'deshabilitado'}`}>
                                                        {gestion.estado ? 'Habilitado' : 'Deshabilitado'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default GestionarAlumnosPage;
