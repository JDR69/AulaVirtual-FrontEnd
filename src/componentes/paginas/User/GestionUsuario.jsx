import React, { useState } from 'react';

function GestionUsuario() {
    const [inputValue, setInputValue] = useState('');
    const [isProfesor, setIsProfesor] = useState(false);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        //algoritmo para determinar si es profesor o alumno
        setIsProfesor(value.toLowerCase().includes('profesor'));
    };

    return (
        <div className='contenedor-principal'>
            <div className='contenedor-secundario'>
                <h1>Gestion de Usuario</h1>

                <div className="form-group row" id='buscador'>
                    <label htmlFor="colFormLabel" className="col-sm-2 col-form-label">Elegir Profesor/Alumno</label>
                    <div className="col-sm-10">
                        <input
                            type="text"
                            className="form-control"
                            id="colFormLabel"
                            placeholder="Nombre o CI/Matricula"
                            value={inputValue}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div className='contenedor-contenido'>
                    <div className="mb-3">
                        <label>Nombre:</label>
                        <input type="text" className="form-control" name="nombre" />
                    </div>
                    <div className="mb-3">
                        <label>CI:</label>
                        <input type="text" className="form-control" name="ci" />
                    </div>
                </div>

                <h2>Designacion de datos</h2>
                <div className='contenedor-contenido'>

                    <div className="mb-3">
                        <label>Curso:</label>
                        <select className="form-control" name="curso">
                            {/* Opciones de curso */}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label>Paralelo:</label>
                        <select className="form-control" name="paralelo">
                            {/* Opciones de paralelo */}
                        </select>
                    </div>

                    {isProfesor && (
                        <>
                            <div className="mb-3">
                                <label>Materia:</label>
                                <select className="form-control" name="materia">
                                    {/* Opciones de materia */}
                                </select>
                            </div>

                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default GestionUsuario;
