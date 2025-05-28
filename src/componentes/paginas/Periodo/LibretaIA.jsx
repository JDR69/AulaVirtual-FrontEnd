import React, { useState } from 'react';
import '../../css/LibretaIA.css';

function LibretaIA() {
  const [alumno, setAlumno] = useState('');
  const [materias, setMaterias] = useState([]);
  const [dimensiones, setDimensiones] = useState({
    ser: '',
    saber: '',
    hacer: '',
    decidir: '',
    interpretacion: '',
    serCalificacion: 0,
    decidirCalificacion: 0,
  });

  const buscarAlumno = () => {
    // Simulación de búsqueda de alumno y sus materias
    setMaterias(['Matemáticas', 'Historia', 'Ciencias', 'Arte']);
    setDimensiones({
      ser: 'Responsable',
      saber: 10,
      hacer: 10,
      decidir: 'Crítico',
      interpretacion: 'Buen desempeño general',
      serCalificacion: 10,
      decidirCalificacion: 9,
    });
  };

  return (
    <div className="aa1">
      <div className="ab2">
        <h1>Libreta del Alumno</h1>
        <p>Busca un alumno para ver sus materias y dimensiones</p>
      </div>

      <div className="ac1">
        <label htmlFor="alumno">Buscar Alumno:</label>
        <input
          type="text"
          id="alumno"
          value={alumno}
          onChange={(e) => setAlumno(e.target.value)}
          placeholder="Ingresa el nombre del alumno"
        />
        <button className="btn-primary2" onClick={buscarAlumno}>
          Buscar
        </button>
      </div>

      {materias.length > 0 && (
        <>
          {/* Tabla principal con Saber, Hacer y Total */}
          <div className="ad1">
            <table>
              <thead>
                <tr>
                  <th>Materias</th>
                  <th>Saber</th>
                  <th>Hacer</th>
                  <th>Total</th>
                  <th>Interpretación</th>
                  <th>Interpretación Próximo Curso</th>
                </tr>
              </thead>
              <tbody>
                {materias.map((materia, index) => (
                  <tr key={index}>
                    <td>{materia}</td>
                    <td>{dimensiones.saber}</td>
                    <td>{dimensiones.hacer}</td>
                    <td>20</td>
                    <td>{dimensiones.interpretacion}</td>
                    <td>Por mejorar en áreas críticas</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tabla secundaria con Ser y Decidir con calificaciones */}
          <div className="ae1">
            <table>
              <thead>
                <tr>
                  <th>Ser</th>
                  <th>Calificación</th>
                  <th>Decidir</th>
                  <th>Calificación</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{dimensiones.ser}</td>
                  <td>{dimensiones.serCalificacion}</td>
                  <td>{dimensiones.decidir}</td>
                  <td>{dimensiones.decidirCalificacion}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default LibretaIA;